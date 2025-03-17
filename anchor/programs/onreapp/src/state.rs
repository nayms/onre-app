use anchor_lang::prelude::*;

#[account]
pub struct Offer {
    pub offer_id: u64,
    pub sell_token_mint: Pubkey,
    pub buy_token_mint_1: Pubkey,
    pub buy_token_mint_2: Pubkey,
    pub buy_token_1_total_amount: u64,
    pub buy_token_2_total_amount: u64,
    pub sell_token_total_amount: u64,
    pub authority_bump: u8,
}

impl Offer {
    pub const SIZE: usize = 8 +      // offer_id (u64)
            32 + // sell_token_mint (Pubkey)
            32 + // buy_token_mint_1 (Pubkey)
            32 + // buy_token_mint_2 (Pubkey)
            8 +  // buy_token_1_total_amount (u64)
            8 +  // buy_token_2_total_amount (u64)
            8 +  // sell_token_total_amount (u64)
            1;  // authority_bump (u8)
}

#[account]
pub struct State {
    pub boss: Pubkey,
}

impl State {
    pub const SIZE: usize = 32;
}


