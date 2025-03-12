use crate::state::Offer;
use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct TakeOffer<'info> {
    #[account(mut)]
    pub offer: Account<'info, Offer>,

    #[account(mut)]
    pub offer_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account_sell: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account_buy: Account<'info, TokenAccount>,

    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

pub fn take_offer(ctx: Context<TakeOffer>, sell_token_amount: u64) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    require!(
        sell_token_amount <= offer.sell_token_remaining,
        ErrorCode::InsufficientOfferBalance
    );
    require!(offer.active, ErrorCode::OfferInactive);
    require!(
        offer.sell_token_mint == ctx.accounts.user_token_account_sell.mint,
        ErrorCode::InvalidSellTokenMint
    );
    require!(
        offer.buy_token_mint == ctx.accounts.user_token_account_buy.mint,
        ErrorCode::InvalidBuyTokenMint
    );

    // TODO: decimals handling and conversion
    let buy_token_amount = sell_token_amount
        .checked_mul(offer.buy_token_total_amount)
        .unwrap()
        .checked_div(offer.sell_token_total_amount)
        .unwrap();

    offer.sell_token_remaining -= sell_token_amount;

    let sell_transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.offer_token_account.to_account_info(),
            to: ctx.accounts.offer_token_account.to_account_info(),
            authority: ctx.accounts.offer.to_account_info(),
        },
    );
    token::transfer(sell_transfer_ctx, sell_token_amount)?;

    let buy_transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_token_account_sell.to_account_info(),
            to: ctx.accounts.user_token_account_buy.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    token::transfer(buy_transfer_ctx, buy_token_amount)?;

    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient tokens remaining in the offer.")]
    InsufficientOfferBalance,
    #[msg("The offer is inactive.")]
    OfferInactive,
    #[msg("The sell token mint does not match the offer.")]
    InvalidSellTokenMint,
    #[msg("The buy token mint does not match the offer.")]
    InvalidBuyTokenMint,
}
