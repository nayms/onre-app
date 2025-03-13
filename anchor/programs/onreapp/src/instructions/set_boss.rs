use anchor_lang::Accounts;
use anchor_lang::prelude::*;
use crate::state::State;

#[derive(Accounts)]
pub struct SetBoss<'info> {
    #[account(mut, has_one = boss)]
    pub state: Account<'info, State>,

    #[account(mut)]
    pub boss: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn set_boss(ctx: Context<SetBoss>, new_boss: Pubkey) -> Result<()> {
    let state = &mut ctx.accounts.state;
    state.boss = new_boss;
    Ok(())
}