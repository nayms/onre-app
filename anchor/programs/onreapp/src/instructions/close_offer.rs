use crate::state::{Offer, State};
use anchor_lang::prelude::*;
use anchor_lang::Accounts;
use anchor_spl::token;
use anchor_spl::token::{Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct CloseOffer<'info> {
    #[account(
        mut,
        close = boss
    )]
    pub offer: Account<'info, Offer>,
    #[account(
        mut,
        associated_token::mint = offer.sell_token_mint,
        associated_token::authority = offer_token_authority,
        close = boss
    )]
    pub offer_sell_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = offer.buy_token_mint_1,
        associated_token::authority = offer_token_authority,
        close = boss
    )]
    pub offer_buy_1_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = offer.buy_token_mint_2,
        associated_token::authority = offer_token_authority,
        close = boss
    )]
    pub offer_buy_2_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub boss_buy_1_token_account: Account<'info, TokenAccount>,
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
    let offer = &ctx.accounts.offer;

    let offer_sell_token_account = &ctx.accounts.offer_sell_token_account;
    let offer_buy_1_token_account = &ctx.accounts.offer_buy_1_token_account;
    let offer_buy_2_token_account = &ctx.accounts.offer_buy_2_token_account;

    // Get the boss's token accounts
    let boss_sell_token_account = &ctx.accounts.boss_sell_token_account;
    let boss_buy_1_token_account = &ctx.accounts.boss_buy_1_token_account;

    transfer_remaining_tokens(
        &offer_sell_token_account,
        &boss_sell_token_account,
        &offer.offer_id,
        &ctx,
    )?;

    transfer_remaining_tokens(
        &offer_buy_1_token_account,
        &boss_buy_1_token_account,
        &offer.offer_id,
        &ctx,
    )?;

    transfer_remaining_tokens(
        &offer_buy_2_token_account,
        &boss_buy_1_token_account,
        &offer.offer_id,
        &ctx,
    )?;

    Ok(())
}

// Helper function to transfer remaining tokens to the boss
fn transfer_remaining_tokens(
    from_token_account: &Account<TokenAccount>,
    to_token_account: &Account<TokenAccount>,
    offer_id: &u64,
    ctx: &Context<CloseOffer>,
) -> Result<()> {
    // Get the balance of the token account
    let balance = from_token_account.amount;

    // Only transfer if there's a balance remaining
    if balance > 0 {
        let offer_id_bytes = offer_id.to_le_bytes();
        let seeds = &[
            b"offer_authority".as_ref(),
            offer_id_bytes.as_ref(),
            &[ctx.accounts.offer.authority_bump],
        ];
        let signer_seeds = &[&seeds[..]];
        let cpi_transfer = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.offer_sell_token_account.to_account_info(),
                to: ctx.accounts.boss_sell_token_account.to_account_info(),
                authority: ctx.accounts.offer_token_authority.to_account_info(),
            },
            signer_seeds,
        );

        msg!(
            "Transferring {} tokens from {} to {}",
            balance,
            from_token_account.key(),
            to_token_account.key()
        );

        token::transfer(cpi_transfer, balance)?;
    }

    Ok(())
}
