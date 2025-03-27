import React, { useState } from 'react';
import { formatNumber, formatPercent } from '@/utils/number-formatting.ts';
import { Button, Checkbox, Label } from '@/components/Input.tsx';
import { BalanceSummary, LinkControl, TokenAmountGroup, ValueDisplay, ValueGroup } from './Shared.tsx';
import { TokenAmountInput } from './TokenAmountInput.tsx';
import { useGetUserBalance, useOfferInfo } from '@/data/SolanaProvider.tsx';

import type { TradePurchaseModel } from './types.ts';

type PurchaseFormProps = { data: TradePurchaseModel };

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ data }) => {
  const balance = useGetUserBalance();

  const [payAmount, setPayAmount] = useState<string>();
  const [receiveAmount, setReceiveAmount] = useState<string>();
  const [accepted, setAccepted] = useState(false);

  const formattedUserBalance = balance?.data?.uiAmount == null ? '' : formatNumber(balance.data.uiAmount);
  // console.log('balance', balance?.data /*balance?.data*/);
  // const programAccounts = useProgramAccounts();
  // const accounts = programAccounts.data ?? [];
  // console.log(
  //   'accounts:',
  //   accounts.map(a => a.pubkey.toBase58()),
  // );
  // console.log(accounts.data[0].account.data);

  const offerInfo = useOfferInfo() ?? {};
  // @ts-ignore
  const { buyToken, sellToken, price } = offerInfo;
  console.log('offerInfo', offerInfo);
  const buyTokenSupply = buyToken?.supply;
  const buyTokenSymbol = buyToken?.symbol ?? '';
  const sellTokenSymbol = sellToken?.symbol ?? '';
  const buyTokePrice = price ?? 1;

  const maxAvailableToBuy = Math.min(balance?.data?.uiAmount ?? 0, buyToken?.total);

  const handleMaxPay = () => {
    setPayAmount(`${maxAvailableToBuy}`);
  };
  const handleMaxReceive = () => {};

  const handleChangePayAmount: React.ChangeEventHandler<HTMLInputElement> = e => {
    setPayAmount(e.target.value);
    // retrieve limits for the field and for the other field
    // - what is the max we can possibly pay
    // - what is the max there is available to buy
    // calculate this and other value
    // populate the fields
  };

  const handleChangeReceiveAmount: React.ChangeEventHandler<HTMLInputElement> = e => {
    setReceiveAmount(e.target.value);
  };

  return (
    <>
      <ValueGroup>
        <ValueDisplay
          label="Available Supply:"
          value={
            <>
              <em>{formatNumber(buyTokenSupply, 0)}</em> {buyTokenSymbol}
            </>
          }
        />
        <ValueDisplay
          label="Offered Supply:"
          value={
            <>
              <em>{formatNumber(500, 0)}</em> {buyTokenSymbol}
            </>
          }
        />
        <ValueDisplay
          label="Purchase Price:"
          value={
            <>
              <em>{formatNumber(buyTokePrice, 2)}</em> {sellTokenSymbol}
            </>
          }
        />
        <ValueDisplay label="sUSDe APY:" value={<em>{formatPercent(data.sUSDeAPY, 2)}</em>} />
        <ValueDisplay label="OnRe APY:" value={<em>{formatPercent(data.onReAPY, 2)}</em>} />
        <ValueDisplay label="Combined APY:" value={<em>{formatPercent(data.sUSDeAPY + data.onReAPY, 2)}</em>} />
      </ValueGroup>

      <TokenAmountGroup>
        <TokenAmountInput
          label="You pay"
          value={payAmount}
          controls={<LinkControl onClick={handleMaxPay}>Max</LinkControl>}
          symbol={sellTokenSymbol}
          summary={<BalanceSummary value={formattedUserBalance} />}
          onChange={handleChangePayAmount}
        />

        <TokenAmountInput
          label="You receive"
          value={receiveAmount}
          controls={<LinkControl onClick={handleMaxReceive}>Max</LinkControl>}
          symbol={buyTokenSymbol}
          summary={<BalanceSummary value={0} />}
          onChange={handleChangeReceiveAmount}
        />
      </TokenAmountGroup>

      <ValueGroup>
        <Label>
          <Checkbox
            checked={accepted}
            onChange={() => {
              setAccepted(accepted => !accepted);
            }}
          />
          I have read and agree to the <a href="https://nayms.com">Participation Agreement</a> and the{' '}
          <a href="https://nayms.com">Participation Agreement Addendum</a>
        </Label>
      </ValueGroup>

      <Button>!!!!Purchase!!!!</Button>
    </>
  );
};
