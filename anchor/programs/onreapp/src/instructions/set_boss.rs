use anchor_lang::Accounts;
use anchor_lang::prelude::*;
use crate::state::State;

/// Account structure for updating the program’s boss.
///
/// This struct defines the accounts required to change the `boss` field in the program state.
///
/// # Preconditions
/// - The `state` account must be initialized prior to execution, via an `initialize` instruction.
/// - The current `boss` must sign the transaction to authorize the change.
#[derive(Accounts)]
pub struct SetBoss<'info> {
  /// The program state account, containing the current boss to be updated.
  ///
  /// # Constraints
  /// - Must be mutable to allow updating the `boss` field.
  /// - The `has_one = boss` constraint ensures only the current boss can modify it.
  #[account(mut, has_one = boss)]
  pub state: Account<'info, State>,

  /// The current boss, signing the transaction to authorize the update.
  #[account(mut)]
  pub boss: Signer<'info>,

  /// Solana System program, included for potential rent accounting.
  pub system_program: Program<'info, System>,
}

/// Updates the boss in the program state.
///
/// Sets the `boss` field in the `state` account to a new public key, logging the change for traceability.
/// Only the current boss can call this instruction, enforced by the `has_one = boss` constraint.
///
/// # Arguments
/// - `ctx`: Context containing the accounts for the state update.
/// - `new_boss`: The new public key to set as the boss.
///
/// # Returns
/// A `Result` indicating success or failure.
pub fn set_boss(ctx: Context<SetBoss>, new_boss: Pubkey) -> Result<()> {
  let state = &mut ctx.accounts.state;
  state.boss = new_boss;
  msg!(
        "Boss updated from {} to {} by {}",
        ctx.accounts.boss.key(),
        new_boss,
        ctx.accounts.boss.key()
    );
  Ok(())
}
