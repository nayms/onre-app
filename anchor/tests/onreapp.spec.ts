import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { Onre } from '../target/types/onre';

describe('onreapp', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.OnreApp as Program<Onre>;

  it('Initialize Onre with right boss account', async () => {
    let [statePda] = PublicKey.findProgramAddressSync([Buffer.from('state')], program.programId);

    await program.methods
      .initialize()
      .accounts({
        boss: payer.publicKey,
      })
      .rpc();

    const currentBoss = await program.account.state.fetch(statePda);

    expect(currentBoss.boss).toEqual(payer.publicKey);
  });
});
