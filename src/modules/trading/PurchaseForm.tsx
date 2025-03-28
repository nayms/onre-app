import React, { useEffect, useState } from 'react';
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

import type { TradePurchaseModel } from './types.ts';
import { LoadingDots } from '@/components/LoadingDots.tsx';

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
  const userBalance = balance?.data?.uiAmount == null ? 0 : balance.data.uiAmount;

  const isOfferValid = offerInfo.state === 'valid';
  const isOfferLoading = offerInfo.state === 'loading';
  const buyTokenSupply = isOfferValid ? offerInfo.buyToken.supply : '';
  const buyTokenSymbol = isOfferValid ? offerInfo.buyToken.symbol : '';
  const sellTokenSymbol = isOfferValid ? offerInfo.sellToken.symbol : '';
  const buyTokenPrice = isOfferValid ? offerInfo.price : 1;
  const offeredSupply = isOfferValid ? offerInfo.buyToken.total : 0;
  const totalAvailable = isOfferValid ? offerInfo.buyToken.totalAvailable : 0;
  const maxAvailableToBuy = Math.min(userBalance, totalAvailable);

  const validAmounts = !(payAmount.error || receiveAmount.error) && parseFloat(payAmount.value) > 0;

  const changePayAmount = (value: string) => {
    const amount = Number(value);
    if (isNaN(amount) || amount < 0) {
      setPayAmount({ value, error: 'Invalid value' });
      return;
    }

    if (amount < 0 || amount / buyTokenPrice > totalAvailable) {
      setPayAmount({ value, error: 'Value is greater than the amount available' });
      // pomeri na donje poje
      return;
    }

    if (amount < 0 || amount > userBalance) {
      setPayAmount({ value, error: 'Value is greater than the balance available' });
      return;
    }
    // TODO: other corner cases

    const amountToReceive = amount / buyTokenPrice;
    setReceiveAmount({ value: formatNumber(amountToReceive, 4) });
    setPayAmount({ value });
  };

  const changeReceiveAmount = (value: string) => {
    const amount = Number(value);
    if (isNaN(amount) || amount < 0) {
      setReceiveAmount({ value, error: 'Invalid value' });
      return;
    }

    if (amount < 0 || amount > maxAvailableToBuy) {
      setReceiveAmount({ value, error: 'Value is greater than the amount available' });
      return;
    }
    // TODO: other corner cases

    const amountToBuy = amount * buyTokenPrice;
    setPayAmount({ value: formatNumber(amountToBuy, 4) });
    setReceiveAmount({ value });
  };

  const handleMaxPay = () => {
    changePayAmount(`${maxAvailableToBuy}`);
  };

  const handleChangePayAmount: React.ChangeEventHandler<HTMLInputElement> = e => changePayAmount(e.target.value);

  const handleChangeReceiveAmount: React.ChangeEventHandler<HTMLInputElement> = e =>
    changeReceiveAmount(e.target.value);

  const handlePurchase = () => {
    if (payAmount.error) return;
    executePurchase(Number(payAmount.value));
  };

  useEffect(() => {
    console.log('purchaseTransactionState', purchaseTransactionState);
  }, [purchaseTransactionState]);

  const canPurchase = isUserWhitelisted && validAmounts && acceptedTerms;

  console.log({ canPurchase, isUserWhitelisted, purchaseTransactionState });
  return (
    <>
      <ValueGroup style={{ background: '#ccf' }}>
        In order to purchase, you need to complete the kyc the links: <a href="">for individuals</a> or{' '}
        <a href="">for businesses</a>.
      </ValueGroup>
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
          controls={<LinkControl onClick={handleMaxPay}>Max</LinkControl>}
          symbol={sellTokenSymbol}
          summary={
            <>
              <ErrorSummary>{payAmount.error}</ErrorSummary>
              <BalanceSummary value={formatNumber(userBalance)} />
            </>
          }
          invalid={!!payAmount.error}
          disabled={!isUserWhitelisted}
          onChange={handleChangePayAmount}
        />

        <TokenAmountInput
          label="You receive"
          value={receiveAmount.value}
          symbol={buyTokenSymbol}
          summary={
            <>
              <ErrorSummary>{receiveAmount.error}</ErrorSummary>

              {/*<BalanceSummary value={0} />*/}
            </>
          }
          invalid={!!receiveAmount.error}
          disabled={!isUserWhitelisted}
          onChange={handleChangeReceiveAmount}
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
