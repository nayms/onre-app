import React, { ChangeEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatNumber, formatPercent } from '@/utils/number-formatting.ts';
import { Button, Checkbox, Label } from '@/components/Input.tsx';
import {
  BalanceSummary,
  ErrorSummary,
  FormatAmount,
  LinkControl,
  TokenAmountGroup,
  ValueDisplay,
  ValueGroup,
} from './Shared.tsx';
import { TokenAmountInput } from './TokenAmountInput.tsx';
import { useSessionContext } from '@/data/SessionProvider.tsx';
import { useGetUserBalance, useOfferInfo, useSolanaProgramContext } from '@/data/SolanaProvider.tsx';
import { LoadingDots } from '@/components/LoadingDots.tsx';

import type { TradePurchaseModel } from './types.ts';
import toast from 'react-hot-toast';

const Banner = styled.div`
  background-color: ${({ theme }) => theme.color.text.control};
  color: ${({ theme }) => theme.color.background};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  a {
    color: ${({ theme }) => theme.color.background};
    text-decoration: underline;
  }
`;

const validateAmount = (amount: number): string | undefined =>
  isNaN(amount) || amount < 0 ? 'Invalid value' : undefined;

const validateMaxAmount = (
  amount: number,
  maxAmount: number,
  errorMessage = 'Value is greater than the maximum',
): string | undefined => (amount > maxAmount ? errorMessage : undefined);

type InputState = {
  value: string;
  error?: string;
};

type PurchaseFormProps = { data: TradePurchaseModel };

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ data }) => {
  const sessionContext = useSessionContext();
  const balance = useGetUserBalance();
  const offerInfo = useOfferInfo();
  const { executePurchase, purchaseTransactionState } = useSolanaProgramContext();

  // console.log('offerInfo', offerInfo);

  const [payAmount, setPayAmount] = useState<InputState>({ value: '' });
  const [receiveAmount, setReceiveAmount] = useState<InputState>({ value: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Derived
  const isUserWhitelisted = sessionContext.state === 'approved';
  const isKycRequired = sessionContext.state === 'not-started';

  const userBalance = balance?.data?.uiAmount == null ? 0 : balance.data.uiAmount;

  const isOfferValid = offerInfo.state === 'valid';
  const isOfferLoading = offerInfo.state === 'loading';
  const buyTokenSupply = isOfferValid ? offerInfo.buyToken.supply : '';
  const buyTokenSymbol = isOfferValid ? offerInfo.buyToken.symbol : '';
  const sellTokenSymbol = isOfferValid ? offerInfo.sellToken.symbol : '';
  const buyTokenPrice = isOfferValid ? offerInfo.price : 1;
  const offeredSupply = isOfferValid ? offerInfo.buyToken.total : 0;
  const totalAvailable = isOfferValid ? offerInfo.buyToken.totalAvailable : 0;

  const maxAvailableToBuy = Math.min(userBalance / buyTokenPrice, totalAvailable);

  const validAmounts = !(payAmount.error || receiveAmount.error) && parseFloat(payAmount.value) > 0;

  type ChangeAmountsType = (arg: {
    payAmount: number;
    payValue?: string;
    receiveAmount: number;
    receiveValue?: string;
  }) => void;

  const changeAmounts: ChangeAmountsType = ({ payAmount, payValue, receiveAmount, receiveValue }) => {
    const payError =
      validateAmount(payAmount)
      || validateMaxAmount(payAmount, userBalance, 'Value is greater than the balance available');

    const receiveError =
      validateAmount(receiveAmount)
      || validateMaxAmount(receiveAmount, totalAvailable, 'Value is greater than the amount available');

    setPayAmount(({ value }) => ({
      value: payValue ?? (isNaN(payAmount) ? value : formatNumber(payAmount, 8).replaceAll(/,/g, '')),
      error: payError,
    }));
    setReceiveAmount(({ value }) => ({
      value: receiveValue ?? (isNaN(receiveAmount) ? value : formatNumber(receiveAmount, 8).replaceAll(/,/g, '')),
      error: receiveError,
    }));
  };

  const handleMaxPay = () => {
    if (!isUserWhitelisted) return;

    const receiveAmount = Math.min(maxAvailableToBuy, userBalance / buyTokenPrice);
    const payAmount = receiveAmount * buyTokenPrice;
    changeAmounts({
      payAmount,
      receiveAmount,
    });
  };

  const handleChangeAmount =
    (side: 'pay' | 'receive'): ChangeEventHandler<HTMLInputElement> =>
    e => {
      const { value } = e.target;
      const amount = Number(value);

      if (side === 'pay') {
        changeAmounts({
          payValue: value,
          payAmount: amount,
          receiveAmount: amount * buyTokenPrice,
        });
      } else {
        changeAmounts({ receiveValue: value, payAmount: amount / buyTokenPrice, receiveAmount: amount });
      }
    };

  const handlePurchase = () => {
    if (payAmount.error) return;
    executePurchase(Number(payAmount.value));
  };

  useEffect(() => {
    if (purchaseTransactionState.status === 'preparing') {
      toast(`Executing purchase transaction...`);
    } else if (purchaseTransactionState.status === 'done') {
      toast.success(`Purchase transaction successful!`);
    } else if (purchaseTransactionState.status === 'error') {
      toast.error(`Purchase failed!`);
    }
  }, [purchaseTransactionState]);

  const canPurchase = isUserWhitelisted && validAmounts && acceptedTerms;
  return (
    <>
      {isKycRequired && (
        <Banner>
          To make a purchase, you need to complete the KYC check. Choose to proceed as a{' '}
          <a href={sessionContext.urlKyb}>company</a> or an <a href={sessionContext.urlKyb}>individual</a>.
        </Banner>
      )}
      <ValueGroup>
        <ValueDisplay
          label="Available Supply:"
          value={isOfferLoading ? <LoadingDots /> : <FormatAmount value={buyTokenSupply} symbol={buyTokenSymbol} />}
        />
        <ValueDisplay
          label="Offered Supply:"
          value={isOfferLoading ? <LoadingDots /> : <FormatAmount value={offeredSupply} symbol={buyTokenSymbol} />}
        />
        <ValueDisplay
          label="Available for Purchase:"
          value={isOfferLoading ? <LoadingDots /> : <FormatAmount value={totalAvailable} symbol={buyTokenSymbol} />}
        />
        <ValueDisplay
          label="Purchase Price:"
          value={
            isOfferLoading ?
              <LoadingDots />
            : <FormatAmount value={buyTokenPrice} symbol={sellTokenSymbol} maxDecimals={2} />
          }
        />
        <ValueDisplay label="sUSDe APY:" value={<em>{formatPercent(data.sUSDeAPY, 2)}</em>} />
        <ValueDisplay label="OnRe APY:" value={<em>{formatPercent(data.onReAPY, 2)}</em>} />
        <ValueDisplay label="Combined APY:" value={<em>{formatPercent(data.sUSDeAPY + data.onReAPY, 2)}</em>} />
      </ValueGroup>

      <TokenAmountGroup>
        <TokenAmountInput
          label="You pay"
          value={payAmount.value}
          controls={isUserWhitelisted && <LinkControl onClick={handleMaxPay}>Max</LinkControl>}
          symbol={sellTokenSymbol}
          summary={
            <>
              <ErrorSummary>{payAmount.error}</ErrorSummary>
              <BalanceSummary value={formatNumber(userBalance)} />
            </>
          }
          invalid={!!payAmount.error}
          disabled={!isUserWhitelisted}
          onChange={handleChangeAmount('pay')}
        />

        <TokenAmountInput
          label="You receive"
          value={receiveAmount.value}
          symbol={buyTokenSymbol}
          summary={<ErrorSummary>{receiveAmount.error}</ErrorSummary>}
          invalid={!!receiveAmount.error}
          disabled={!isUserWhitelisted}
          onChange={handleChangeAmount('receive')}
        />
      </TokenAmountGroup>

      <ValueGroup>
        <Label>
          <Checkbox
            checked={acceptedTerms}
            onChange={() => {
              setAcceptedTerms(accepted => !accepted);
            }}
          />
          I have read and agree to the <a href="https://nayms.com">Participation Agreement</a> and the{' '}
          <a href="https://nayms.com">Participation Agreement Addendum</a>
        </Label>
      </ValueGroup>

      <Button disabled={!canPurchase || purchaseTransactionState.status !== 'idle'} onClick={handlePurchase}>
        {purchaseTransactionState.status === 'idle' ? 'Purchase' : <LoadingDots color={'black'} />}
      </Button>
    </>
  );
};
