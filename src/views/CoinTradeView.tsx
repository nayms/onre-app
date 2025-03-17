import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CoinTradeTabPanel } from '@/modules/trading/CoinTradeTabPanel.tsx';

import type { TradePurchaseModel, TradeScheduleRedemptionModel } from '@/modules/trading/types.ts';

// *** MOCK DATA --- >>>
const dataBuy: TradePurchaseModel = {
  availableSupply: {
    value: 1_000_000,
    symbol: 'ONe', // ONr
  },
  purchasePrice: {
    value: 1.1,
    symbol: 'sUSDe',
  },
  sUSDeAPY: 0.155,
  onReAPY: 0.1045,
};

const dataSell: TradeScheduleRedemptionModel = {
  redeemableSupply: {
    value: 76_124,
    symbol: 'ONe',
  },
  estimatedRedemptionPrice: {
    value: 1.5,
    symbol: 'sUSDe',
  },
  nextRedemptionDate: '2025-07-01',
  nextRedemptionDeadline: '2025-06-01',
  scheduledForRedemption: { value: 100, symbol: 'ONe' },
};

const dataCollect = [
  {
    amountToCollect: { value: 750, symbol: 'ONr 15-OCT-2024' },
    amountToReceive: { value: 900, symbol: 'sUSDe' },
    dueDate: '2024-10-15',
  },
  {
    amountToCollect: { value: 1000, symbol: 'ONr 01-FEB-2025' },
    amountToReceive: { value: 1500, symbol: 'sUSDe' },
    dueDate: '2025-02-01',
  },
  {
    amountToCollect: { value: 985, symbol: 'ONr 09-MAR-2025' },
    amountToReceive: { value: 1350, symbol: 'sUSDe' },
    dueDate: '2025-03-09',
  },
];
// *** MOCK DATA --- <<<

export const CoinTradeView: React.FC = () => (
  <>
    <Helmet>
      <title>Home | OnRe</title>
    </Helmet>

    <CoinTradeTabPanel buyData={dataBuy} sellData={dataSell} collectData={dataCollect} />
  </>
);
