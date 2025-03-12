use crate::state::{Offer, State};
use anchor_lang::prelude::*;
use anchor_lang::Accounts;
use anchor_spl::token;
use anchor_spl::token::{Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct CloseOffer<'info> {
    // TODO: Do we close the account or simply make inactive?
    #[account(mut, close = boss)]
    pub offer: Account<'info, Offer>,

    #[account(mut)]
    pub offer_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub boss_token_account: Account<'info, TokenAccount>,

    #[account(has_one = boss)]
    pub state: Account<'info, State>,
    pub boss: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

pub fn close_offer(ctx: Context<CloseOffer>) -> Result<()> {
    let offer = &mut ctx.accounts.offer;

    offer.active = false;

    let remaining = offer.sell_token_remaining;
    if remaining > 0 {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.offer_token_account.to_account_info(),
                to: ctx.accounts.boss_token_account.to_account_info(),
                authority: offer.to_account_info(),
            },
        );
        token::transfer(cpi_ctx, remaining)?;
    }

    // Mark offer as closed or simply close the account
    Ok(())
}
