import React, { useState } from 'react';
import { formatNumber, formatPercent } from '@/utils/number-formatting.ts';
import { TradePurchaseModel } from './types.ts';
import {
  BalanceSummary,
  Button,
  LinkControl,
  TokenAmountGroup,
  TokenAmountInput,
  ValueDisplay,
  ValueGroup,
} from './Shared.tsx';
import { Checkbox, Label } from '@/components/Input.tsx';

type PurchaseFormProps = { data: TradePurchaseModel };

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ data }) => {
  const [payAmount, setPayAmount] = useState<string>();
  const [receiveAmount, setReceiveAmount] = useState<string>();
  const [accepted, setAccepted] = useState(false);

  const handleMaxPay = () => {};
  const handleMaxReceive = () => {};

  const handleChangePayAmount: React.ChangeEventHandler<HTMLInputElement> = e => {
    setPayAmount(e.target.value);
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
              <em>{formatNumber(data.availableSupply.value, 0)}</em> {data.availableSupply.symbol}
            </>
          }
        />
        <ValueDisplay
          label="Purchase Price:"
          value={
            <>
              <em>{formatNumber(data.purchasePrice.value, 2)}</em> {data.purchasePrice.symbol}
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
          symbol={data.purchasePrice.symbol}
          summary={<BalanceSummary value={1000} />}
          onChange={handleChangePayAmount}
        />

        <TokenAmountInput
          label="You receive"
          value={receiveAmount}
          controls={<LinkControl onClick={handleMaxReceive}>Max</LinkControl>}
          symbol={data.availableSupply.symbol}
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

      <Button>Purchase</Button>
    </>
  );
};
