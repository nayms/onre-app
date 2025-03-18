import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, TransactionMessage, VersionedMessage, VersionedTransaction } from '@solana/web3.js';
import { OnreApp } from '../target/types/onre_app';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  createMint,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  mintTo,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

describe('onreapp', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const initialBoss = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.OnreApp as Program<OnreApp>;
  let sellTokenMint: PublicKey;
  let buyToken1Mint: PublicKey;
  let buyToken2Mint: PublicKey;
  let bossSellTokenAccount: PublicKey;
  let bossBuyTokenAccount1: PublicKey;
  let bossBuyTokenAccount2: PublicKey;
  let offerPda: PublicKey;
  let offerSellTokenPda: PublicKey;
  let offerBuyToken1Pda: PublicKey;
  let offerBuyToken2Pda: PublicKey;
  let offerId = new anchor.BN(123123123);
  let statePda: PublicKey;
  let offerAuthority: PublicKey;

  beforeAll(async () => {
    // Airdrop SOL to initialBoss for transactions
    let signature = await provider.connection.requestAirdrop(initialBoss.publicKey, anchor.web3.LAMPORTS_PER_SOL * 20);
    await provider.connection.confirmTransaction({ signature, ...(await provider.connection.getLatestBlockhash()) });

    // Create mock SPL tokens
    sellTokenMint = await createMint(provider.connection, initialBoss.payer, initialBoss.publicKey, null, 9);
    buyToken1Mint = await createMint(provider.connection, initialBoss.payer, initialBoss.publicKey, null, 9);
    buyToken2Mint = await createMint(provider.connection, initialBoss.payer, initialBoss.publicKey, null, 9);

    // Create associated token accounts for initialBoss
    bossSellTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      initialBoss.payer,
      sellTokenMint,
      initialBoss.publicKey,
    );
    bossBuyTokenAccount1 = await createAssociatedTokenAccount(
      provider.connection,
      initialBoss.payer,
      buyToken1Mint,
      initialBoss.publicKey,
    );

    bossBuyTokenAccount2 = await createAssociatedTokenAccount(
      provider.connection,
      initialBoss.payer,
      buyToken2Mint,
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
      buyToken1Mint,
      bossBuyTokenAccount1,
      initialBoss.publicKey,
      1000 * 10 ** 9,
    );
    await mintTo(
      provider.connection,
      initialBoss.payer,
      buyToken2Mint,
      bossBuyTokenAccount2,
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
    offerBuyToken1Pda = await getAssociatedTokenAddress(buyToken1Mint, offerAuthority, true);
    offerBuyToken2Pda = await getAssociatedTokenAddress(buyToken2Mint, offerAuthority, true);
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
    let signature = await provider.connection.requestAirdrop(newBoss.publicKey, anchor.web3.LAMPORTS_PER_SOL * 200);
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
    const offerSellTokenAccountInstruction = createAssociatedTokenAccountInstruction(
      initialBoss.payer.publicKey,
      getAssociatedTokenAddressSync(sellTokenMint, offerAuthority, true),
      offerAuthority,
      sellTokenMint,
    );
    const buyToken1AccountInstruction = createAssociatedTokenAccountInstruction(
      initialBoss.payer.publicKey,
      getAssociatedTokenAddressSync(buyToken1Mint, offerAuthority, true),
      offerAuthority,
      buyToken1Mint,
    );

    await program.methods
      .makeOfferOne(offerId, new anchor.BN(500 * 10 ** 9), new anchor.BN(500 * 10 ** 9))
      .accounts({
        bossBuyToken1Account: bossBuyTokenAccount1,
        sellTokenMint: sellTokenMint,
        buyToken1Mint: buyToken1Mint,
        state: statePda,
      })
      .preInstructions([buyToken1AccountInstruction, offerSellTokenAccountInstruction])
      .rpc();

    // Fetch the offer account
    const offerAccount = await program.account.offer.fetch(offerPda);
    // Check the offer attributes
    expect(offerAccount.offerId.eq(offerId)).toBe(true);
    expect(offerAccount.sellTokenMint.toBase58()).toEqual(sellTokenMint.toBase58());
    expect(offerAccount.buyTokenMint1.toBase58()).toEqual(buyToken1Mint.toBase58());

    expect(offerAccount.sellTokenTotalAmount.eq(new anchor.BN(500 * 10 ** 9))).toBe(true);
    expect(offerAccount.buyToken1TotalAmount.eq(new anchor.BN(500 * 10 ** 9))).toBe(true);

    // Check balance of the boss sell token account
    const bossBuyTokenAccountInfo = await provider.connection.getTokenAccountBalance(bossBuyTokenAccount1);
    expect(+bossBuyTokenAccountInfo.value.amount).toEqual(500 * 10 ** 9);

    // Check balance of the offer sell token account
    const offerBuyTokenAccountInfo = await provider.connection.getTokenAccountBalance(offerBuyToken1Pda);
    expect(+offerBuyTokenAccountInfo.value.amount).toEqual(500 * 10 ** 9);

    const offer = await program.account.offer.fetch(offerPda);
    console.log(offer);
  });

  it('Make offer fails on boss account with non boss signature', async () => {
    let newBoss = new anchor.Wallet(Keypair.generate());
    let signature = await provider.connection.requestAirdrop(newBoss.publicKey, anchor.web3.LAMPORTS_PER_SOL * 20);
    await provider.connection.confirmTransaction({
      signature: signature,
      ...(await provider.connection.getLatestBlockhash()),
    });
    await expect(
      program.methods
        .makeOfferOne(offerId, new anchor.BN(500 * 10 ** 9), new anchor.BN(500 * 10 ** 9))
        .accountsPartial({
          bossBuyToken1Account: bossBuyTokenAccount1,
          sellTokenMint: sellTokenMint,
          buyToken1Mint: buyToken1Mint,
          state: statePda,
        })
        .signers([newBoss.payer])
        .rpc(),
    ).rejects.toThrow();
  });

  it('Make offer fails on non boss account with boss signature', async () => {
    let newBoss = new anchor.Wallet(Keypair.generate());
    await expect(
      program.methods
        .makeOfferOne(offerId, new anchor.BN(500 * 10 ** 9), new anchor.BN(500 * 10 ** 9))
        .accountsPartial({
          bossBuyToken1Account: bossBuyTokenAccount1,
          sellTokenMint: sellTokenMint,
          buyToken1Mint: buyToken1Mint,
          state: statePda,
          boss: newBoss.publicKey,
        })
        .signers([initialBoss.payer])
        .rpc(),
    ).rejects.toThrow();
  });

  it('Make offer fails on non boss account with non boss signature', async () => {
    let newBoss = new anchor.Wallet(Keypair.generate());
    await expect(
      program.methods
        .makeOfferOne(offerId, new anchor.BN(500 * 10 ** 9), new anchor.BN(500 * 10 ** 9))
        .accountsPartial({
          bossBuyToken1Account: bossBuyTokenAccount1,
          sellTokenMint: sellTokenMint,
          buyToken1Mint: buyToken1Mint,
          state: statePda,
          boss: newBoss.publicKey,
        })
        .signers([newBoss.payer])
        .rpc(),
    ).rejects.toThrow();
  });

  it('Replace an offer', async () => {
    const newOfferId = new anchor.BN(123123124);
    const [newOfferAuthorityPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('offer_authority'), newOfferId.toArrayLike(Buffer, 'le', 8)],
      program.programId,
    );
    const newOfferSellTokenPda = await getAssociatedTokenAddress(sellTokenMint, newOfferAuthorityPda, true);
    const newOfferBuyTokenPda = await getAssociatedTokenAddress(buyToken1Mint, newOfferAuthorityPda, true);

    let closeInstruction = await program.methods
      .closeOfferOne()
      .accounts({
        offer: offerPda,
        bossSellTokenAccount: bossSellTokenAccount,
        bossBuy1TokenAccount: bossBuyTokenAccount1,
        state: statePda,
      })
      .instruction();

    console.log("creating atas");
    const offerSellTokenAccountInstruction = createAssociatedTokenAccountInstruction(
      initialBoss.payer.publicKey,
      getAssociatedTokenAddressSync(sellTokenMint, newOfferAuthorityPda, true),
      newOfferAuthorityPda,
      sellTokenMint,
    );
    const buyToken1AccountInstruction = createAssociatedTokenAccountInstruction(
      initialBoss.payer.publicKey,
      getAssociatedTokenAddressSync(buyToken1Mint, newOfferAuthorityPda, true),
      newOfferAuthorityPda,
      buyToken1Mint,
    );

    console.log("done creating atas")
    let makeOfferInstruction = await program.methods
      .makeOfferOne(newOfferId, new anchor.BN(500 * 10 ** 9), new anchor.BN(500 * 10 ** 9))
      .accounts({
        bossBuyToken1Account: bossBuyTokenAccount1,
        sellTokenMint: sellTokenMint,
        buyToken1Mint: buyToken1Mint,
        state: statePda,
      })
      .instruction();

    let tx = new VersionedTransaction(
      new TransactionMessage({
        payerKey: initialBoss.publicKey,
        recentBlockhash: (await provider.connection.getLatestBlockhash()).blockhash,
        instructions: [
          closeInstruction,
          offerSellTokenAccountInstruction,
          buyToken1AccountInstruction,
          makeOfferInstruction,
        ],
      }).compileToLegacyMessage(),
    );

    let versionedTransaction = await initialBoss.signTransaction(tx);

    let signedTransctionBytes = versionedTransaction.serialize();
    let signature = await provider.connection.sendRawTransaction(signedTransctionBytes);

    await provider.connection.confirmTransaction({
      signature: signature,
      ...(await provider.connection.getLatestBlockhash()),
    });

    const [newOfferPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('offer'), newOfferId.toArrayLike(Buffer, 'le', 8)],
      program.programId,
    );

    // Fetch the offer account
    const offerAccount = await program.account.offer.fetch(newOfferPda);
    // Check the offer attributes
    expect(offerAccount.offerId.eq(newOfferId)).toBe(true);
    expect(offerAccount.sellTokenMint.toBase58()).toEqual(sellTokenMint.toBase58());
    expect(offerAccount.buyTokenMint1.toBase58()).toEqual(buyToken1Mint.toBase58());

    expect(offerAccount.sellTokenTotalAmount.eq(new anchor.BN(500 * 10 ** 9))).toBe(true);
    expect(offerAccount.buyToken1TotalAmount.eq(new anchor.BN(500 * 10 ** 9))).toBe(true);

    // Check balance of the boss sell token account
    const bossSellTokenAccountInfo = await provider.connection.getTokenAccountBalance(bossSellTokenAccount);
    const offerSellTokenAccountInfo = await provider.connection.getTokenAccountBalance(newOfferSellTokenPda);
    const offerBuyToken1AccountInfo = await provider.connection.getTokenAccountBalance(newOfferBuyTokenPda);
    expect(+bossSellTokenAccountInfo.value.amount).toEqual(1000 * 10 ** 9);
    expect(+offerSellTokenAccountInfo.value.amount).toEqual(0);
    expect(+offerBuyToken1AccountInfo.value.amount).toEqual(500 * 10 ** 9);
  });
});
