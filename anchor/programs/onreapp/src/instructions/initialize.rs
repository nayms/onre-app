use anchor_lang::Accounts;
use anchor_lang::prelude::*;
use crate::state::State;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = boss,
        space = 8 + State::SIZE,
        seeds = [b"state"],
        bump
    )]
    pub state: Account<'info, State>,

    #[account(mut)]
    pub boss: Signer<'info>,

    pub system_program: Program<'info, System>,
}


pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let state = &mut ctx.accounts.state;
    if state.boss == Pubkey::default() {
        state.boss = ctx.accounts.boss.key();
    }
    Ok(())
}
