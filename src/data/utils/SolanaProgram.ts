import { Buffer } from 'buffer';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { PublicKey, type Connection } from '@solana/web3.js';
import type { AnchorWallet } from '@solana/wallet-adapter-react';

import { env } from '@/utils/constants.ts';
import idl from '../../../anchor/target/idl/onre_app.json';
import { type OnreApp } from '../../../anchor/target/types/onre_app';

export type OnReAppProgram = Program<OnreApp>;

export const getOnReAppProgramInfo = (connection: Connection, wallet: AnchorWallet) => {
  const program: OnReAppProgram = new Program(idl as OnreApp, new AnchorProvider(connection, wallet));

  // Override the ID because we're targeting specific program on the blockchain
  // rather than depend on a local built/generated id which might be different
  idl.address = env.solanaProgramId;

  return program;
};

export const getCurrentOffer = (program: OnReAppProgram) => {
  const offerIdN = new BN(env.solanaOfferId);
  const bOffer = Buffer.from('offer');
  const bOfferId = offerIdN.toArrayLike(Buffer, 'le', 8);

  const [offerPda] = PublicKey.findProgramAddressSync([bOffer, bOfferId], program.programId);
  const bOfferAuthority = Buffer.from('offer_authority');
  const [offerAuthority] = PublicKey.findProgramAddressSync([bOfferAuthority, bOfferId], program.programId);

  return { offerPda, offerAuthority };
};
