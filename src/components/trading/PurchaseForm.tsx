import React, { useState } from 'react';
import { formatNumber, formatPercent } from '@/utils/number-formatting.ts';
import { TradePurchaseModel } from '@/components/trading/types.ts';
import {
  BalanceSummary,
  Button,
  Column,
  LinkControl,
  Row,
  TokenAmountGroup,
  TokenAmountInput,
  ValueDisplay,
  ValueGroup,
} from '@/components/trading/Shared.tsx';

type PurchaseFormProps = { data: TradePurchaseModel };

export const PurchaseForm: React.FC<PurchaseFormProps> = ({ data }) => {
  const [payAmount, setPayAmount] = useState<string>();
  const [receiveAmount, setReceiveAmount] = useState<string>();

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
        <Row style={{ gap: 8 }}>
          <Column>
            <input type="checkbox" id="rememberMe" name="rememberMe" />
          </Column>
          <Column>
            I have read and agree to the <a href="">Participation Agreement</a> and the{' '}
            <a href="">Participation Agreement Addendum</a>
          </Column>
        </Row>
      </ValueGroup>

      <Button>Purchase</Button>
    </>
  );
};
