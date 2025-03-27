import React, { useState } from 'react';
import styled from 'styled-components';
import { TabPanel } from '@/components/TabPanel.tsx';
import { PurchaseForm } from './PurchaseForm.tsx';
// import { ScheduleForm } from './ScheduleForm.tsx';
// import { RedemptionForm } from '@/modules/trading/RedemptionForm.tsx';
import { TradeRedemptionModel, TradePurchaseModel, TradeScheduleRedemptionModel } from './types.ts';

const ContentContainer = styled.div`
  display: flex;
  width: 500px;
  margin: 6vh auto 0;
`;

const Badge = styled.div`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  font-size: 9px;
  line-height: 1;
  background: ${({ theme }) => theme.palette.red['600']};
  color: white;
  border-radius: 50%;
  transform: translate(1px, -2px);
`;

type CoinTradeTabPanelProps = {
  buyData: TradePurchaseModel;
  sellData: TradeScheduleRedemptionModel;
  collectData: TradeRedemptionModel[];
};

// @ts-ignore - Remove after uncommenting other tabs
export const CoinTradeTabPanel: React.FC<CoinTradeTabPanelProps> = ({ buyData, sellData, collectData }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const tabInfo = [
    'Purchase',
    'Schedule Redemption',
    <>Redeem {collectData.length > 0 && <Badge>{collectData.length}</Badge>} </>,
  ].slice(0, 1); // just show 1st

  return (
    <ContentContainer>
      <TabPanel tabs={tabInfo} current={currentTab} onChange={setCurrentTab}>
        {currentTab === 0 && <PurchaseForm data={buyData} />}
        {/*{currentTab === 1 && <ScheduleForm data={sellData} />}*/}
        {/*{currentTab === 2 && <RedemptionForm data={collectData} />}*/}
      </TabPanel>
    </ContentContainer>
  );
};
