use anchor_lang::prelude::*;

/// Represents an offer in the Onre App program.
///
/// Stores details of an offer where a boss provides buy tokens in exchange for sell tokens.
/// Used in `make_offer`, `take_offer`, and `close_offer` instructions.
///
/// # Fields
/// - `offer_id`: Unique identifier for the offer.
/// - `sell_token_mint`: Mint of the token the offer expects to receive.
/// - `buy_token_mint_1`: Mint of the first buy token offered.
/// - `buy_token_mint_2`: Mint of the second buy token offered (System Program ID if unused).
/// - `buy_token_1_total_amount`: Total amount of the first buy token offered.
/// - `buy_token_2_total_amount`: Total amount of the second buy token offered (0 if unused).
/// - `sell_token_total_amount`: Total amount of sell tokens expected.
/// - `authority_bump`: Bump seed for the offer’s token authority PDA.
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
    /// Size of the `Offer` account in bytes.
    ///
    /// Calculated as: 8 (offer_id) + 32 (sell_token_mint) + 32 (buy_token_mint_1) +
    /// 32 (buy_token_mint_2) + 8 (buy_token_1_total_amount) + 8 (buy_token_2_total_amount) +
    /// 8 (sell_token_total_amount) + 1 (authority_bump) = 129 bytes.
    pub const SIZE: usize = 8 + 32 + 32 + 32 + 8 + 8 + 8 + 1;
}

/// Represents the program state in the Onre App program.
///
/// Stores the current boss’s public key, used for authorization across instructions.
///
/// # Fields
/// - `boss`: Public key of the current boss, set via `initialize` and updated via `set_boss`.
#[account]
pub struct State {
    pub boss: Pubkey,
}

impl State {
    /// Size of the `State` account in bytes.
    ///
    /// Calculated as: 32 (boss Pubkey) = 32 bytes.
    pub const SIZE: usize = 32;
}
