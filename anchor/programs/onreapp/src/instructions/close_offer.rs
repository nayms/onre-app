use crate::state::{Offer, State};
use anchor_lang::prelude::*;
use anchor_lang::Accounts;
use anchor_spl::token;
use anchor_spl::token::{Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct CloseOffer<'info> {
    #[account(
        mut,
        close = boss)    ]
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
    /// CHECK: This is a derived PDA, not storing data
    pub offer_token_authority: AccountInfo<'info>,
    pub boss: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn close_offer(ctx: Context<CloseOffer>) -> Result<()> {
    let offer = &mut ctx.accounts.offer;

    offer.active = false;

    let remaining = offer.sell_token_remaining;
    let offer_id = offer.offer_id;
    if remaining > 0 {
        let offer_id_bytes = offer_id.to_le_bytes();
        let seeds = &[b"offer_authority".as_ref(), offer_id_bytes.as_ref(), &[ctx.accounts.offer.authority_bump]];
        let signer_seeds = &[&seeds[..]];
        let cpi_ctx2 = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.offer_sell_token_account.to_account_info(),
                to: ctx.accounts.boss_sell_token_account.to_account_info(),
                authority: ctx.accounts.offer_token_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(cpi_ctx2, remaining)?;
    }

    Ok(())
}
