use crate::state::Offer;
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[derive(Accounts)]
#[instruction(offer_id: u64)]
pub struct TakeOfferOne<'info> {
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
    #[account(mut,
      associated_token::mint = offer.sell_token_mint,
      associated_token::authority = user,
    )]
    pub user_sell_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = offer.buy_token_mint_1,
        associated_token::authority = user,
  )]
    pub user_buy_token_1_account: Account<'info, TokenAccount>,
    #[account(
        seeds = [b"offer_authority", offer.offer_id.to_le_bytes().as_ref()],
        bump
    )]
    /// CHECK:
    pub offer_token_authority: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn take_offer_one(ctx: Context<TakeOfferOne>, sell_token_amount: u64) -> Result<()> {
    let offer = &ctx.accounts.offer;

    require!(
        offer.sell_token_mint == ctx.accounts.user_sell_token_account.mint,
        TakeOfferErrorCode::InvalidSellTokenMint
    );
    require!(
        offer.buy_token_mint_1 == ctx.accounts.user_buy_token_1_account.mint,
        TakeOfferErrorCode::InvalidBuyTokenMint
    );
    require!(
        ctx.accounts.offer_sell_token_account.amount + sell_token_amount
            <= offer.sell_token_total_amount,
        TakeOfferErrorCode::OfferExceedsSellLimit
    );

    require!(
        offer.buy_token_mint_2 == system_program::ID,
        TakeOfferErrorCode::InvalidTakeOffer
    );

    let buy_token_1_amount = calculate_buy_amount(
        sell_token_amount,
        offer.buy_token_1_total_amount,
        offer.sell_token_total_amount,
    )?;
    require!(
        ctx.accounts.offer_buy_token_1_account.amount >= buy_token_1_amount,
        TakeOfferErrorCode::InsufficientOfferBalance
    );

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_sell_token_account.to_account_info(),
                to: ctx.accounts.offer_sell_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        sell_token_amount,
    )?;

    let offer_id_bytes = &offer.offer_id.to_le_bytes();
    let seeds = &[
        b"offer_authority".as_ref(),
        offer_id_bytes,
        &[offer.authority_bump],
    ];
    let signer_seeds = &[&seeds[..]];
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.offer_buy_token_1_account.to_account_info(),
                to: ctx.accounts.user_buy_token_1_account.to_account_info(),
                authority: ctx.accounts.offer_token_authority.to_account_info(),
            },
            signer_seeds,
        ),
        buy_token_1_amount,
    )?;

    msg!(
        "Offer {} taken by user {}, sell amount: {}",
        offer.offer_id,
        ctx.accounts.user.key(),
        sell_token_amount
    );
    msg!("Transferred buy token 1 amount: {}", buy_token_1_amount);

    Ok(())
}

#[derive(Accounts)]
#[instruction(offer_id: u64)]
pub struct TakeOfferTwo<'info> {
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
        mut,
        associated_token::mint = offer.buy_token_mint_1,
        associated_token::authority = user,
  )]
    pub user_buy_token_1_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = offer.buy_token_mint_2,
        associated_token::authority = user,
  )]
    pub user_buy_token_2_account: Account<'info, TokenAccount>,
    #[account(
        seeds = [b"offer_authority", offer.offer_id.to_le_bytes().as_ref()],
        bump
  )]
    /// CHECK:
    pub offer_token_authority: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn take_offer_two(ctx: Context<TakeOfferTwo>, sell_token_amount: u64) -> Result<()> {
    let offer = &ctx.accounts.offer;

    require!(
        offer.sell_token_mint == ctx.accounts.user_sell_token_account.mint,
        TakeOfferErrorCode::InvalidSellTokenMint
    );
    require!(
        offer.buy_token_mint_1 == ctx.accounts.user_buy_token_1_account.mint,
        TakeOfferErrorCode::InvalidBuyTokenMint
    );
    require!(
        ctx.accounts.offer_sell_token_account.amount + sell_token_amount
            <= offer.sell_token_total_amount,
        TakeOfferErrorCode::OfferExceedsSellLimit
    );

    require!(
        offer.buy_token_mint_2 == ctx.accounts.user_buy_token_2_account.mint,
        TakeOfferErrorCode::InvalidBuyTokenMint
    );

    let buy_token_1_amount = calculate_buy_amount(
        sell_token_amount,
        offer.buy_token_1_total_amount,
        offer.sell_token_total_amount,
    )?;
    let buy_token_2_amount = calculate_buy_amount(
        sell_token_amount,
        offer.buy_token_2_total_amount,
        offer.sell_token_total_amount,
    )?;

    require!(
        ctx.accounts.offer_buy_token_1_account.amount >= buy_token_1_amount,
        TakeOfferErrorCode::InsufficientOfferBalance
    );
    require!(
        ctx.accounts.offer_buy_token_2_account.amount >= buy_token_2_amount,
        TakeOfferErrorCode::InsufficientOfferBalance
    );
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_sell_token_account.to_account_info(),
                to: ctx.accounts.offer_sell_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        sell_token_amount,
    )?;

    let offer_id_bytes = &ctx.accounts.offer.offer_id.to_le_bytes();
    let seeds = &[
        b"offer_authority".as_ref(),
        offer_id_bytes,
        &[offer.authority_bump],
    ];
    let signer_seeds = &[&seeds[..]];
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.offer_buy_token_1_account.to_account_info(),
                to: ctx.accounts.user_buy_token_1_account.to_account_info(),
                authority: ctx.accounts.offer_token_authority.to_account_info(),
            },
            signer_seeds,
        ),
        buy_token_1_amount,
    )?;

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.offer_buy_token_2_account.to_account_info(),
                to: ctx.accounts.user_buy_token_2_account.to_account_info(),
                authority: ctx.accounts.offer_token_authority.to_account_info(),
            },
            signer_seeds,
        ),
        buy_token_2_amount,
    )?;
    msg!(
        "Offer {} taken by user {}, sell amount: {}",
        offer.offer_id,
        ctx.accounts.user.key(),
        sell_token_amount
    );
    msg!("Transferred buy token 1 amount: {}", buy_token_1_amount);
    msg!("Transferred buy token 2 amount: {}", buy_token_2_amount);
    Ok(())
}

fn calculate_buy_amount(
    sell_token_amount: u64,
    buy_token_total_amount: u64,
    sell_token_total_amount: u64,
) -> Result<u64> {
    if sell_token_total_amount == 0 {
        return Err(error!(TakeOfferErrorCode::InvalidSellTokenMint).into());
    }
    let result = (sell_token_amount as u128)
        .checked_mul(buy_token_total_amount as u128)
        .ok_or(TakeOfferErrorCode::CalculationOverflow)?
        .checked_div(sell_token_total_amount as u128)
        .ok_or(TakeOfferErrorCode::CalculationOverflow)?;
    if result > u64::MAX as u128 {
        return Err(error!(TakeOfferErrorCode::CalculationOverflow));
    }
    Ok(result as u64)
}

#[error_code]
pub enum TakeOfferErrorCode {
    #[msg("Insufficient tokens remaining in the offer.")]
    InsufficientOfferBalance,
    #[msg("The sell token mint does not match the offer.")]
    InvalidSellTokenMint,
    #[msg("The buy token mint does not match the offer.")]
    InvalidBuyTokenMint,
    #[msg("The offer would exceed its total sell token limit.")]
    OfferExceedsSellLimit,
    #[msg("The offer is of 2 buy token type.")]
    InvalidTakeOffer,
    #[msg("Calculation overflowed or invalid.")]
    CalculationOverflow,
}
