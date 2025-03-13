use crate::state::{Offer, State};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use anchor_spl::{
    associated_token::AssociatedToken,
    mint,
};

#[derive(Accounts)]
#[instruction(offer_id: u64)]
pub struct MakeOffer<'info> {
    #[account(
        init,
        payer = boss,
        space = 8 + Offer::SIZE,
        seeds=[b"offer", offer_id.to_le_bytes().as_ref()],
        bump
  )]
    pub offer: Account<'info, Offer>,

    #[account(
        init,
        payer = boss,
        associated_token::mint = sell_token_mint,
        associated_token::authority = offer_token_authority,
    )]
    pub offer_sell_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = boss,
        associated_token::mint = buy_token_mint,
        associated_token::authority = offer_token_authority,
    )]
    pub offer_buy_token_account: Account<'info, TokenAccount>,

    #[account(
        seeds = [b"offer_authority", offer_id.to_le_bytes().as_ref()],
        bump
    )]
    /// CHECK:
    pub offer_token_authority: AccountInfo<'info>,

    #[account(mut)]
    pub boss_sell_token_account: Account<'info, TokenAccount>,

    pub sell_token_mint: Account<'info, Mint>,
    pub buy_token_mint: Account<'info, Mint>,

    #[account(has_one = boss)]
    pub state: Account<'info, State>,
    #[account(mut)]
    pub boss: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn make_offer(
    ctx: Context<MakeOffer>,
    offer_id: u64,
    buy_token_total_amount: u64,
    sell_token_total_amount: u64,
) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    offer.offer_id = offer_id;
    offer.buy_token_mint = ctx.accounts.buy_token_mint.key();
    offer.sell_token_mint = ctx.accounts.sell_token_mint.key();
    offer.buy_token_total_amount = buy_token_total_amount;
    offer.sell_token_total_amount = sell_token_total_amount;
    offer.sell_token_remaining = sell_token_total_amount;
    offer.amount_bought = 0;
    offer.active = true;
    offer.authority_bump = ctx.bumps.offer_token_authority;

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.boss_sell_token_account.to_account_info(),
            to: ctx.accounts.offer_sell_token_account.to_account_info(),
            authority: ctx.accounts.boss.to_account_info(),
        },
    );
    token::transfer(cpi_ctx, sell_token_total_amount)?;

    // TODO: Save the offer id/address
    Ok(())
}
