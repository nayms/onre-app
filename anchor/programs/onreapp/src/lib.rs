use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("J24jWEosQc5jgkdPm3YzNgzQ54CqNKkhzKy56XXJsLo2");

#[program]
pub mod onre_app {
    use super::*;

    pub fn make_offer_one(
        ctx: Context<MakeOfferOne>,
        offer_id: u64,
        buy_token_1_total_amount: u64,
        sell_token_total_amount: u64,
    ) -> Result<()> {
        make_offer::make_offer_one(
            ctx,
            offer_id,
            buy_token_1_total_amount,
            sell_token_total_amount,
        )
    }

    pub fn make_offer_two(
        ctx: Context<MakeOfferTwo>,
        offer_id: u64,
        buy_token_1_total_amount: u64,
        buy_token_2_total_amount: u64,
        sell_token_total_amount: u64,
    ) -> Result<()> {
        make_offer::make_offer_two(
            ctx,
            offer_id,
            buy_token_1_total_amount,
            buy_token_2_total_amount,
            sell_token_total_amount,
        )
    }

    pub fn close_offer(ctx: Context<CloseOffer>) -> Result<()> {
        close_offer::close_offer(ctx)
    }

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::initialize(ctx)
    }

    pub fn set_boss(ctx: Context<SetBoss>, new_boss: Pubkey) -> Result<()> {
        set_boss::set_boss(ctx, new_boss)
    }
}
