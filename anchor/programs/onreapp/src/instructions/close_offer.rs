use crate::state::{Offer, State};
use anchor_lang::prelude::*;
use anchor_lang::Accounts;
use anchor_spl::token;
use anchor_spl::token::{Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct CloseOffer<'info> {
    #[account(mut)]
    pub offer: Account<'info, Offer>,
    #[account(mut)]
    pub offer_sell_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub offer_buy_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub boss_buy_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub boss_sell_token_account: Account<'info, TokenAccount>,

    #[account(has_one = boss)]
    pub state: Account<'info, State>,
    pub boss: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn close_offer(ctx: Context<CloseOffer>) -> Result<()> {
    let offer = &mut ctx.accounts.offer;

    offer.active = false;

    let remaining = offer.sell_token_remaining;
    if remaining > 0 {
        let seeds = &[b"state".as_ref(), &[ctx.accounts.state.bump]];
        let signer_seeds = &[&seeds[..]];
        let cpi_ctx2 = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.offer_sell_token_account.to_account_info(),
                to: ctx.accounts.boss_sell_token_account.to_account_info(),
                authority: ctx.accounts.state.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(cpi_ctx2, remaining)?;
    }

    Ok(())
}
