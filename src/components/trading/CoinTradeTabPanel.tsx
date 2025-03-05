import React, { useState } from 'react';
import styled from 'styled-components';
import { PanelContainer, PanelContent, PanelTitle, TabButton, Tabs } from '@/components/Panel.tsx';
import { PurchaseForm } from '@/components/trading/PurchaseForm.tsx';
import { TradePurchaseModel, TradeRedemptionModel } from '@/components/trading/types.ts';
import { RedeemForm } from '@/components/trading/RedeemForm.tsx';

const ContentContainer = styled.div`
  display: flex;
  width: 500px;
  margin: 10% auto 20%;
`;

type TradeTabType = 'buy' | 'sell';

type CoinTradeTabPanelProps = { buyData: TradePurchaseModel; sellData: TradeRedemptionModel };

export const CoinTradeTabPanel: React.FC<CoinTradeTabPanelProps> = ({ buyData, sellData }) => {
  const [currentTab, setCurrentTab] = useState<TradeTabType>('buy');

  const handleSetTab = (tabType: TradeTabType) => () => setCurrentTab(tabType);

  return (
    <ContentContainer className={'lol'}>
      <PanelContainer>
        <PanelTitle>
          <Tabs>
            <TabButton $active={currentTab === 'buy'} onClick={handleSetTab('buy')}>
              Purchase
            </TabButton>
            <TabButton $active={currentTab === 'sell'} onClick={handleSetTab('sell')}>
              Redeem
            </TabButton>
          </Tabs>
        </PanelTitle>
        <PanelContent>
          {currentTab === 'buy' && <PurchaseForm data={buyData} />}
          {currentTab === 'sell' && <RedeemForm data={sellData} />}
        </PanelContent>
      </PanelContainer>
    </ContentContainer>
  );
};
