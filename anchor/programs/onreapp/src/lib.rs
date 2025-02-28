#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod onreapp {
    use super::*;

  pub fn close(_ctx: Context<CloseOnreapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.onreapp.count = ctx.accounts.onreapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.onreapp.count = ctx.accounts.onreapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeOnreapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.onreapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeOnreapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Onreapp::INIT_SPACE,
  payer = payer
  )]
  pub onreapp: Account<'info, Onreapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseOnreapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub onreapp: Account<'info, Onreapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub onreapp: Account<'info, Onreapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Onreapp {
  count: u8,
}
