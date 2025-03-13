import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { OnreApp } from '../target/types/onre_app';
import { createAssociatedTokenAccount, createMint, getAssociatedTokenAddress, mintTo } from '@solana/spl-token';

describe('onreapp', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const initialBoss = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.OnreApp as Program<OnreApp>;
  let sellTokenMint: PublicKey;
  let buyTokenMint: PublicKey;
  let bossSellTokenAccount: PublicKey;
  let bossBuyTokenAccount: PublicKey;
  let offerPda: PublicKey;
  let offerSellTokenPda: PublicKey;
  let offerBuyTokenPda: PublicKey;
  let offerId = new anchor.BN(123123123);
  let statePda: PublicKey;
  let offerAuthority: PublicKey;

  beforeAll(async () => {
    // Airdrop SOL to initialBoss for transactions
    let signature = await provider.connection.requestAirdrop(initialBoss.publicKey, anchor.web3.LAMPORTS_PER_SOL * 20);
    await provider.connection.confirmTransaction({ signature, ...(await provider.connection.getLatestBlockhash()) });

    // Create mock SPL tokens
    sellTokenMint = await createMint(provider.connection, initialBoss.payer, initialBoss.publicKey, null, 9);
    buyTokenMint = await createMint(provider.connection, initialBoss.payer, initialBoss.publicKey, null, 9);

    // Create associated token accounts for initialBoss
    bossSellTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      initialBoss.payer,
      sellTokenMint,
      initialBoss.publicKey,
    );
    bossBuyTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      initialBoss.payer,
      buyTokenMint,
      initialBoss.publicKey,
    );

    // Mint some tokens to initialBoss
    await mintTo(
      provider.connection,
      initialBoss.payer,
      sellTokenMint,
      bossSellTokenAccount,
      initialBoss.publicKey,
      1000 * 10 ** 9,
    );
    await mintTo(
      provider.connection,
      initialBoss.payer,
      buyTokenMint,
      bossBuyTokenAccount,
      initialBoss.publicKey,
      1000 * 10 ** 9,
    );

    [offerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('offer'), offerId.toArrayLike(Buffer, 'le', 8)],
      program.programId,
    );

    [statePda] = PublicKey.findProgramAddressSync([Buffer.from('state')], program.programId);
    [offerAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from('offer_authority'), offerId.toArrayLike(Buffer, 'le', 8)],
      program.programId,
    );
    offerSellTokenPda = await getAssociatedTokenAddress(sellTokenMint, offerAuthority, true);
    offerBuyTokenPda = await getAssociatedTokenAddress(buyTokenMint, offerAuthority, true);
  });

  it('Initialize onre with right boss account', async () => {
    await program.methods
      .initialize()
      .accounts({
        boss: initialBoss.publicKey,
      })
      .rpc();
    const currentBoss = await program.account.state.fetch(statePda);

    expect(currentBoss.boss).toEqual(initialBoss.publicKey);
  });

  it('Set boss account sets a new boss account', async () => {
    const newBoss = new anchor.Wallet(Keypair.generate());
    await program.methods
      .setBoss(newBoss.publicKey)
      .accounts({
        state: statePda,
      })
      .rpc();
    const currentBoss = await program.account.state.fetch(statePda);

    expect(currentBoss.boss).toEqual(newBoss.publicKey);

    // Set the old boss back
    let signature = await provider.connection.requestAirdrop(newBoss.publicKey, anchor.web3.LAMPORTS_PER_SOL * 20);
    await provider.connection.confirmTransaction({
      signature: signature,
      ...(await provider.connection.getLatestBlockhash()),
    });

    const latestBlockhash = await provider.connection.getLatestBlockhash();
    const message = new TransactionMessage({
      payerKey: newBoss.publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: [
        await program.methods
          .setBoss(initialBoss.publicKey)
          .accountsPartial({
            state: statePda,
            boss: newBoss.publicKey,
          })
          .instruction(),
      ],
    }).compileToLegacyMessage();

    const tx = new VersionedTransaction(message);
    tx.sign([newBoss.payer]);

    let setBossSignature = await provider.connection.sendTransaction(tx);

    await provider.connection.confirmTransaction({
      signature: setBossSignature,
      ...(await provider.connection.getLatestBlockhash()),
    });

    const finalBoss = await program.account.state.fetch(statePda);
    expect(finalBoss.boss).toEqual(initialBoss.publicKey);
  });

  it('Makes an offer', async () => {
    await program.methods
      .makeOffer(offerId, new anchor.BN(500 * 10 ** 9), new anchor.BN(500 * 10 ** 9))
      .accounts({
        bossSellTokenAccount: bossSellTokenAccount,
        sellTokenMint: sellTokenMint,
        buyTokenMint: buyTokenMint,
        state: statePda,
      })
      .rpc();

    // Fetch the offer account
    const offerAccount = await program.account.offer.fetch(offerPda);
    // Check the offer attributes
    expect(offerAccount.offerId.eq(offerId)).toBe(true);
    expect(offerAccount.sellTokenMint.toBase58()).toEqual(sellTokenMint.toBase58());
    expect(offerAccount.buyTokenMint.toBase58()).toEqual(buyTokenMint.toBase58());

    expect(offerAccount.sellTokenTotalAmount.eq(new anchor.BN(500 * 10 ** 9))).toBe(true);
    expect(offerAccount.buyTokenTotalAmount.eq(new anchor.BN(500 * 10 ** 9))).toBe(true);
    expect(offerAccount.sellTokenRemaining.eq(new anchor.BN(500 * 10 ** 9))).toBe(true);
    expect(offerAccount.amountBought.eq(new anchor.BN(0))).toBe(true);

    // Check balance of the boss sell token account
    const bossSellTokenAccountInfo = await provider.connection.getTokenAccountBalance(bossSellTokenAccount);
    expect(+bossSellTokenAccountInfo.value.amount).toEqual(500 * 10 ** 9);

    // Check balance of the offer sell token account
    const offerSellTokenAccountInfo = await provider.connection.getTokenAccountBalance(offerSellTokenPda);
    expect(+offerSellTokenAccountInfo.value.amount).toEqual(500 * 10 ** 9);
  });

  it('Make offer fails on boss account with non boss signature', async () => {
    let newBoss = new anchor.Wallet(Keypair.generate());
    let signature = await provider.connection.requestAirdrop(newBoss.publicKey, anchor.web3.LAMPORTS_PER_SOL * 20);
    await provider.connection.confirmTransaction({
      signature: signature,
      ...(await provider.connection.getLatestBlockhash()),
    });
    await expect(program.methods
      .makeOffer(offerId, new anchor.BN(500 * 10 ** 9), new anchor.BN(500 * 10 ** 9))
      .accountsPartial({
        bossSellTokenAccount: bossSellTokenAccount,
        sellTokenMint: sellTokenMint,
        buyTokenMint: buyTokenMint,
        state: statePda,
      })
      .signers([newBoss.payer])
      .rpc()
    ).rejects.toThrow()
  });

  it('Make offer fails on non boss account with boss signature', async () => {
    let newBoss = new anchor.Wallet(Keypair.generate());
    await expect(program.methods
      .makeOffer(offerId, new anchor.BN(500 * 10 ** 9), new anchor.BN(500 * 10 ** 9))
      .accountsPartial({
        bossSellTokenAccount: bossSellTokenAccount,
        sellTokenMint: sellTokenMint,
        buyTokenMint: buyTokenMint,
        state: statePda,
        boss: newBoss.publicKey,
      })
      .signers([initialBoss.payer])
      .rpc()
    ).rejects.toThrow()
  });

  it('Make offer fails on non boss account with non boss signature', async () => {
    let newBoss = new anchor.Wallet(Keypair.generate());
    await expect(program.methods
      .makeOffer(offerId, new anchor.BN(500 * 10 ** 9), new anchor.BN(500 * 10 ** 9))
      .accountsPartial({
        bossSellTokenAccount: bossSellTokenAccount,
        sellTokenMint: sellTokenMint,
        buyTokenMint: buyTokenMint,
        state: statePda,
        boss: newBoss.publicKey,
      })
      .signers([newBoss.payer])
      .rpc()
    ).rejects.toThrow()
  });

  it('Close an offer', async () => {
    await program.methods
      .closeOffer()
      .accounts({
        offer: offerPda,
        offerSellTokenAccount: offerSellTokenPda,
        offerBuyTokenAccount: offerBuyTokenPda,
        bossSellTokenAccount: bossSellTokenAccount,
        bossBuyTokenAccount: bossBuyTokenAccount,
        offerTokenAuthority: offerAuthority,
        state: statePda,
      })
      .rpc();

    // Fetch the offer account
    const offerAccount = await program.account.offer.fetch(offerPda);
    // Check the offer attributes
    expect(offerAccount.offerId.eq(offerId)).toBe(true);
    expect(offerAccount.sellTokenMint.toBase58()).toEqual(sellTokenMint.toBase58());
    expect(offerAccount.buyTokenMint.toBase58()).toEqual(buyTokenMint.toBase58());

    expect(offerAccount.sellTokenTotalAmount.eq(new anchor.BN(500 * 10 ** 9))).toBe(true);
    expect(offerAccount.buyTokenTotalAmount.eq(new anchor.BN(500 * 10 ** 9))).toBe(true);
    expect(offerAccount.sellTokenRemaining.eq(new anchor.BN(500 * 10 ** 9))).toBe(true);
    expect(offerAccount.amountBought.eq(new anchor.BN(0))).toBe(true);

    // Check balance of the boss sell token account
    const bossSellTokenAccountInfo = await provider.connection.getTokenAccountBalance(bossSellTokenAccount);
    const offerSellTokenAccountInfo = await provider.connection.getTokenAccountBalance(offerSellTokenPda);
    expect(+bossSellTokenAccountInfo.value.amount).toEqual(1000 * 10 ** 9);
    expect(+offerSellTokenAccountInfo.value.amount).toEqual(0);
  });
});
