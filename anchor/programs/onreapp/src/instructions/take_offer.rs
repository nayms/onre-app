use crate::state::Offer;
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token;
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
#[instruction(offer_id: u64)]
pub struct TakeOffer<'info> {
    #[account(mut)]
    pub offer: Account<'info, Offer>,
    #[account(
        mut,
        associated_token::mint = offer.sell_token_mint,
        associated_token::authority = offer_token_authority,
    )]
    pub offer_sell_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = offer.buy_token_mint_1,
        associated_token::authority = offer_token_authority,
    )]
    pub offer_buy_token_1_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = offer.buy_token_mint_2,
        associated_token::authority = offer_token_authority,
    )]
    pub offer_buy_token_2_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_sell_token_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = buy_token_1_mint,
        associated_token::authority = user,
    )]
    pub user_buy_token_1_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = buy_token_2_mint,
        associated_token::authority = user,
    )]
    pub user_buy_token_2_account: Account<'info, TokenAccount>,

    pub buy_token_1_mint: Account<'info, Mint>,
    pub buy_token_2_mint: Account<'info, Mint>,

    #[account(
        seeds = [b"offer_authority", offer_id.to_le_bytes().as_ref()],
        bump
    )]
    /// CHECK:
    pub offer_token_authority: AccountInfo<'info>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn take_offer(ctx: Context<TakeOffer>, sell_token_amount: u64) -> Result<()> {
    let offer = &ctx.accounts.offer;

    require!(
        sell_token_amount > ctx.accounts.offer_sell_token_account.amount,
        ErrorCode::InsufficientOfferBalance
    );
    require!(
        offer.sell_token_mint == ctx.accounts.user_sell_token_account.mint,
        ErrorCode::InvalidSellTokenMint
    );
    require!(
        offer.buy_token_mint_1 == ctx.accounts.user_buy_token_1_account.mint,
        ErrorCode::InvalidBuyTokenMint
    );
    require!(
        offer.buy_token_mint_2 == ctx.accounts.user_buy_token_2_account.mint,
        ErrorCode::InvalidBuyTokenMint
    );

    let buy_token_1_amount = sell_token_amount
        .checked_mul(offer.buy_token_1_total_amount)
        .unwrap()
        .checked_div(offer.sell_token_total_amount)
        .unwrap();
    let buy_token_2_amount = sell_token_amount
        .checked_mul(offer.buy_token_2_total_amount)
        .unwrap()
        .checked_div(offer.sell_token_total_amount)
        .unwrap();

    let sell_token_transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.user_sell_token_account.to_account_info(),
            to: ctx.accounts.offer_sell_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        },
    );
    let offer_id_bytes = &ctx.accounts.offer.offer_id.to_le_bytes();
    let seeds = &[
        b"offer_authority".as_ref(),
        offer_id_bytes,
        &[ctx.accounts.offer.authority_bump],
    ];
    let signer_seeds = &[&seeds[..]];
    let buy_token_1_transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.offer_buy_token_1_account.to_account_info(),
            to: ctx.accounts.user_buy_token_1_account.to_account_info(),
            authority: ctx.accounts.offer_token_authority.to_account_info(),
        },
        signer_seeds,
    );
    if ctx.accounts.offer_buy_token_2_account.amount > 0 {
        let buy_token_2_transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.offer_buy_token_2_account.to_account_info(),
                to: ctx.accounts.user_buy_token_2_account.to_account_info(),
                authority: ctx.accounts.offer_token_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(buy_token_2_transfer_ctx, buy_token_2_amount)?;
    }
    token::transfer(sell_token_transfer_ctx, sell_token_amount)?;
    token::transfer(buy_token_1_transfer_ctx, buy_token_1_amount)?;
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient tokens remaining in the offer.")]
    InsufficientOfferBalance,
    #[msg("The sell token mint does not match the offer.")]
    InvalidSellTokenMint,
    #[msg("The buy token mint does not match the offer.")]
    InvalidBuyTokenMint,
}
