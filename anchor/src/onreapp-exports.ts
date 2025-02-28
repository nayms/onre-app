// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import OnreappIDL from '../target/idl/onreapp.json'
import type { Onreapp } from '../target/types/onreapp'

// Re-export the generated IDL and type
export { Onreapp, OnreappIDL }

// The programId is imported from the program IDL.
export const ONREAPP_PROGRAM_ID = new PublicKey(OnreappIDL.address)

// This is a helper function to get the Onreapp Anchor program.
export function getOnreappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...OnreappIDL, address: address ? address.toBase58() : OnreappIDL.address } as Onreapp, provider)
}

// This is a helper function to get the program ID for the Onreapp program depending on the cluster.
export function getOnreappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Onreapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return ONREAPP_PROGRAM_ID
  }
}
