import React, { useState } from 'react';
import { formatNumber } from '@/utils/number-formatting.ts';
import { BalanceSummary, LinkControl, TokenAmountGroup, ValueDisplay, ValueGroup } from './Shared.tsx';
import { TokenAmountInput } from './TokenAmountInput.tsx';
import { formatLocalShortDate } from '@/utils/format-date.ts';
import { Column, Row } from '@/components/Layout.tsx';
import { Button } from '@/components/Input.tsx';

import type { TradeScheduleRedemptionModel } from './types.ts';

type ScheduleFormProps = { data: TradeScheduleRedemptionModel };

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ data }) => {
  const [scheduleAmount, setScheduleAmount] = useState<string>();

  const handleScheduleMax = () => {};

  const handleChangeScheduleAmount: React.ChangeEventHandler<HTMLInputElement> = e => {
    setScheduleAmount(e.target.value);
  };

  return (
    <>
      <ValueGroup>
        <ValueDisplay
          label="Redeemable Supply:"
          value={
            <>
              <em>{formatNumber(data.redeemableSupply.value, 0)}</em> {data.redeemableSupply.symbol}
            </>
          }
        />
        <ValueDisplay
          label="Estimated Redemption Price:"
          value={
            <>
              <em>{formatNumber(data.estimatedRedemptionPrice.value, 2)}</em> {data.estimatedRedemptionPrice.symbol}
            </>
          }
        />
        <ValueDisplay label="Next Redemption Date:" value={<em>{formatLocalShortDate(data.nextRedemptionDate)}</em>} />
        <ValueDisplay
          label="Next Redemption Deadline:"
          value={<em>{formatLocalShortDate(data.nextRedemptionDeadline)}</em>}
        />
        <ValueDisplay
          label="Combined APY:"
          value={
            <>
              <em>{formatNumber(data.scheduledForRedemption.value, 2)}</em> {data.scheduledForRedemption.symbol}
            </>
          }
        />
      </ValueGroup>

      <TokenAmountGroup>
        <TokenAmountInput
          label="Schedule for redemption"
          value={scheduleAmount}
          controls={<LinkControl onClick={handleScheduleMax}>Max</LinkControl>}
          symbol={data.redeemableSupply.symbol}
          summary={<BalanceSummary value={1000} />}
          onChange={handleChangeScheduleAmount}
        />
      </TokenAmountGroup>

      <ValueGroup>
        <Row style={{ gap: 8, fontWeight: 500 }}>
          <Column>Exact redemption price will be determined on the redemption date</Column>
        </Row>
      </ValueGroup>

      <Button>Schedule Redemption</Button>
    </>
  );
};
