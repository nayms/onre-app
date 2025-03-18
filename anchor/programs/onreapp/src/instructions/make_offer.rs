use crate::state::{Offer, State};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

#[derive(Accounts)]
#[instruction(offer_id: u64)]
pub struct MakeOfferOne<'info> {
    #[account(
        init,
        payer = boss,
        space = 8 + Offer::SIZE,
        seeds=[b"offer", offer_id.to_le_bytes().as_ref()],
        bump
  )]
    pub offer: Account<'info, Offer>,

    #[account(
        associated_token::mint = sell_token_mint,
        associated_token::authority = offer_token_authority,
    )]
    pub offer_sell_token_account: Account<'info, TokenAccount>,

    #[account(
        associated_token::mint = buy_token_1_mint,
        associated_token::authority = offer_token_authority,
    )]
    pub offer_buy_token_1_account: Account<'info, TokenAccount>,

    #[account(
        seeds = [b"offer_authority", offer_id.to_le_bytes().as_ref()],
        bump
    )]
    /// CHECK: This is a derived PDA, not storing data
    pub offer_token_authority: AccountInfo<'info>,

    #[account(mut)]
    pub boss_buy_token_1_account: Box<Account<'info, TokenAccount>>,

    pub sell_token_mint: Box<Account<'info, Mint>>,
    pub buy_token_1_mint: Box<Account<'info, Mint>>,

    #[account(has_one = boss)]
    pub state: Box<Account<'info, State>>,
    #[account(mut)]
    pub boss: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
#[instruction(offer_id: u64)]
pub struct MakeOfferTwo<'info> {
  #[account(
        init,
        payer = boss,
        space = 8 + Offer::SIZE,
        seeds=[b"offer", offer_id.to_le_bytes().as_ref()],
        bump
  )]
  pub offer: Account<'info, Offer>,

  #[account(
        associated_token::mint = sell_token_mint,
        associated_token::authority = offer_token_authority,
  )]
  pub offer_sell_token_account: Account<'info, TokenAccount>,

  #[account(
        associated_token::mint = buy_token_1_mint,
        associated_token::authority = offer_token_authority,
  )]
  pub offer_buy_token_1_account: Account<'info, TokenAccount>,

  #[account(
        associated_token::mint = buy_token_2_mint,
        associated_token::authority = offer_token_authority,
  )]
  pub offer_buy_token_2_account: Account<'info, TokenAccount>,

  #[account(
        seeds = [b"offer_authority", offer_id.to_le_bytes().as_ref()],
        bump
  )]
  /// CHECK:
  pub offer_token_authority: AccountInfo<'info>,

  #[account(mut)]
  pub boss_buy_token_1_account: Box<Account<'info, TokenAccount>>,
  #[account(mut)]
  pub boss_buy_token_2_account: Box<Account<'info, TokenAccount>>,

  pub sell_token_mint: Box<Account<'info, Mint>>,
  pub buy_token_1_mint: Box<Account<'info, Mint>>,
  pub buy_token_2_mint: Box<Account<'info, Mint>>,

  #[account(has_one = boss)]
  pub state: Box<Account<'info, State>>,
  #[account(mut)]
  pub boss: Signer<'info>,

  pub token_program: Program<'info, Token>,
  pub system_program: Program<'info, System>,
  pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn make_offer_two(
    ctx: Context<MakeOfferTwo>,
    offer_id: u64,
    buy_token_1_total_amount: u64,
    buy_token_2_total_amount: u64,
    sell_token_total_amount: u64,
) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    offer.offer_id = offer_id;
    offer.sell_token_mint = ctx.accounts.sell_token_mint.key();
    offer.buy_token_mint_1 = ctx.accounts.buy_token_1_mint.key();
    offer.buy_token_mint_2 = ctx.accounts.buy_token_2_mint.key();
    offer.buy_token_1_total_amount = buy_token_1_total_amount;
    offer.buy_token_2_total_amount = buy_token_2_total_amount;
    offer.sell_token_total_amount = sell_token_total_amount;
    offer.authority_bump = ctx.bumps.offer_token_authority;

  transfer_token(
    &ctx,
    &ctx.accounts.boss_buy_token_1_account,
    &ctx.accounts.offer_buy_token_1_account,
    buy_token_1_total_amount,
  )?;

  transfer_token(
    &ctx,
    &ctx.accounts.boss_buy_token_2_account,
    &ctx.accounts.offer_buy_token_2_account,
    buy_token_2_total_amount,
  )?;
    Ok(())
}

pub fn make_offer_one(
    ctx: Context<MakeOfferOne>,
    offer_id: u64,
    buy_token_1_total_amount: u64,
    sell_token_total_amount: u64,
) -> Result<()> {
    let offer = &mut ctx.accounts.offer;
    offer.offer_id = offer_id;
    offer.sell_token_mint = ctx.accounts.sell_token_mint.key();
    offer.buy_token_mint_1 = ctx.accounts.buy_token_1_mint.key();
    offer.buy_token_1_total_amount = buy_token_1_total_amount;
    offer.sell_token_total_amount = sell_token_total_amount;
    offer.authority_bump = ctx.bumps.offer_token_authority;

    let cpi_buy_token = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.boss_buy_token_1_account.to_account_info(),
            to: ctx.accounts.offer_buy_token_1_account.to_account_info(),
            authority: ctx.accounts.boss.to_account_info(),
        },
    );

    token::transfer(cpi_buy_token, buy_token_1_total_amount)?;
    Ok(())
}


fn transfer_token<'info>(
  ctx: &Context<MakeOfferTwo<'info>>,
  from: &Account<'info, TokenAccount>,
  to: &Account<'info, TokenAccount>,
  amount: u64,
) -> Result<()> {
  if amount > 0 {
    let cpi_ctx = CpiContext::new(
      ctx.accounts.token_program.to_account_info(),
      Transfer {
        from: from.to_account_info(),
        to: to.to_account_info(),
        authority: ctx.accounts.boss.to_account_info(),
      },
    );
    token::transfer(cpi_ctx, amount)?;
  }
  Ok(())
}
