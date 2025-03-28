export type Token = {
  value: number;
  symbol: string;
};

export type TradePurchaseModel = {
  sUSDeAPY: number;
  onReAPY: number;
};

export type TradeScheduleRedemptionModel = {
  redeemableSupply: Token;
  estimatedRedemptionPrice: Token;
  nextRedemptionDate: string;
  nextRedemptionDeadline: string;
  scheduledForRedemption: Token;
};

export type TradeRedemptionModel = {
  amountToCollect: Token;
  amountToReceive: Token;
  dueDate: string;
};
