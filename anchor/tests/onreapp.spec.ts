import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Onreapp} from '../target/types/onreapp'

describe('onreapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Onreapp as Program<Onreapp>

  const onreappKeypair = Keypair.generate()

  it('Initialize Onreapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        onreapp: onreappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([onreappKeypair])
      .rpc()

    const currentCount = await program.account.onreapp.fetch(onreappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Onreapp', async () => {
    await program.methods.increment().accounts({ onreapp: onreappKeypair.publicKey }).rpc()

    const currentCount = await program.account.onreapp.fetch(onreappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Onreapp Again', async () => {
    await program.methods.increment().accounts({ onreapp: onreappKeypair.publicKey }).rpc()

    const currentCount = await program.account.onreapp.fetch(onreappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Onreapp', async () => {
    await program.methods.decrement().accounts({ onreapp: onreappKeypair.publicKey }).rpc()

    const currentCount = await program.account.onreapp.fetch(onreappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set onreapp value', async () => {
    await program.methods.set(42).accounts({ onreapp: onreappKeypair.publicKey }).rpc()

    const currentCount = await program.account.onreapp.fetch(onreappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the onreapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        onreapp: onreappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.onreapp.fetchNullable(onreappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
