use anchor_lang::prelude::*;

#[account]
pub struct Offer {
    pub offer_id: u64,
    pub buy_token_mint: Pubkey,
    pub sell_token_mint: Pubkey,
    pub buy_token_total_amount: u64,
    pub sell_token_total_amount: u64,
    pub sell_token_remaining: u64,
    pub amount_bought: u64,
    // TODO: active flag if we don't want to close offer account
    pub active: bool,
}

#[account]
pub struct OfferList {
    pub offers: Vec<Offer>,
}

impl Offer {
    pub const SIZE: usize = 8 +      // offer_id (u64)
            32 + // buy_token_mint (Pubkey)
            32 + // sell_token_mint (Pubkey)
            8 +  // buy_token_total_amount (u64)
            8 +  // sell_token_total_amount (u64)
            8 +  // sell_token_remaining (u64)
            8 +  // amount_bought (u64)
            1; // active (bool)
}

#[account]
pub struct State {
    pub boss: Pubkey,
    // TODO: Add a list of offers
    // pub offer_list: Vec<u64>,
}

impl State {
    pub const SIZE: usize = 32;
}


