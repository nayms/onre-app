use crate::contexts::CloseOfferContext;
use crate::state::{Offer, State};
use anchor_lang::prelude::*;
use anchor_lang::Accounts;
use anchor_spl::token;
use anchor_spl::token::{Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct CloseOfferOne<'info> {
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

pub fn close_offer_one(ctx: Context<CloseOfferOne>) -> Result<()> {
    let offer_sell_token_account = &ctx.accounts.offer_sell_token_account;
    let offer_buy_1_token_account = &ctx.accounts.offer_buy_1_token_account;

    // Get the boss's token accounts
    let boss_sell_token_account = &ctx.accounts.boss_sell_token_account;
    let boss_buy_1_token_account = &ctx.accounts.boss_buy_1_token_account;

    transfer_remaining_tokens(
        &ctx,
        &offer_sell_token_account,
        &boss_sell_token_account,
    )?;

    transfer_remaining_tokens(
        &ctx,
        &offer_buy_1_token_account,
        &boss_buy_1_token_account,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct CloseOfferTwo<'info> {
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

pub fn close_offer_two(ctx: Context<CloseOfferTwo>) -> Result<()> {
    let offer_sell_token_account = &ctx.accounts.offer_sell_token_account;
    let offer_buy_1_token_account = &ctx.accounts.offer_buy_1_token_account;
    let offer_buy_2_token_account = &ctx.accounts.offer_buy_2_token_account;

    // Get the boss's token accounts
    let boss_sell_token_account = &ctx.accounts.boss_sell_token_account;
    let boss_buy_1_token_account = &ctx.accounts.boss_buy_1_token_account;
    let boss_buy_2_token_account = &ctx.accounts.boss_buy_1_token_account;

    transfer_remaining_tokens(
        &ctx,
        &offer_sell_token_account,
        &boss_sell_token_account,
    )?;

    transfer_remaining_tokens(
        &ctx,
        &offer_buy_1_token_account,
        &boss_buy_1_token_account,
    )?;

    transfer_remaining_tokens(
        &ctx,
        &offer_buy_2_token_account,
        &boss_buy_2_token_account,
    )?;

    Ok(())
}

impl<'info> CloseOfferContext<'info> for CloseOfferOne<'info> {
  fn token_program(&self) -> &Program<'info, Token> {
    &self.token_program
  }

  fn offer_token_authority(&self) -> &AccountInfo<'info> {
    &self.offer_token_authority
  }

  fn offer(&self) -> &Account<'info, Offer> {
    &self.offer
  }
}

impl<'info> CloseOfferContext<'info> for CloseOfferTwo<'info> {
  fn token_program(&self) -> &Program<'info, Token> {
    &self.token_program
  }

  fn offer_token_authority(&self) -> &AccountInfo<'info> {
    &self.offer_token_authority
  }

  fn offer(&self) -> &Account<'info, Offer> {
    &self.offer
  }
}

fn transfer_remaining_tokens<'info, T: CloseOfferContext<'info> + anchor_lang::Bumps>(
  ctx: &Context<T>,
  from_token_account: &Account<'info, TokenAccount>,
  to_token_account: &Account<'info, TokenAccount>,
) -> Result<()> {

    let balance = from_token_account.amount;

    if balance > 0 {
        let offer_id_bytes = ctx.accounts.offer().offer_id.to_le_bytes();
        let seeds = &[
            b"offer_authority".as_ref(),
            offer_id_bytes.as_ref(),
            &[ctx.accounts.offer().authority_bump],
        ];
        let signer_seeds = &[&seeds[..]];
        let cpi_transfer = CpiContext::new_with_signer(
            ctx.accounts.token_program().to_account_info(),
            Transfer {
                from: from_token_account.to_account_info(),
                to: to_token_account.to_account_info(),
                authority: ctx.accounts.offer_token_authority().to_account_info(),
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
