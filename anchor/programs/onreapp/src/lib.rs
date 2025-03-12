use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;

use instructions::*;

declare_id!("J24jWEosQc5jgkdPm3YzNgzQ54CqNKkhzKy56XXJsLo2");

#[program]
pub mod onre_app {
    use super::*;

    pub fn make_offer(ctx: Context<MakeOffer>, args: MakeOfferArgs) -> Result<()> {
        make_offer::make_offer(ctx, args)
    }

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::initialize(ctx)
    }
}
