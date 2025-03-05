import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CoinTradeTabPanel } from '@/components/trading/CoinTradeTabPanel.tsx';

import type { TradePurchaseModel, TradeRedemptionModel } from '@/components/trading/types.ts';

const dataBuy: TradePurchaseModel = {
  availableSupply: {
    value: 1_000_000,
    symbol: 'ONe',
  },
  purchasePrice: {
    value: 1.1,
    symbol: 'sUSDe',
  },
  sUSDeAPY: 0.155,
  onReAPY: 0.1045,
};

const dataSell: TradeRedemptionModel = {
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

export const CoinTradeView: React.FC = () => (
  <>
    <Helmet>
      <title>Home | OnRe</title>
    </Helmet>

    <CoinTradeTabPanel buyData={dataBuy} sellData={dataSell} />
  </>
);
