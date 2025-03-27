import React, { createContext, useContext, useEffect, useState } from 'react';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { useQuery } from '@tanstack/react-query';
import { WalletError } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  useAnchorWallet,
  useConnection,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { type Connection, type ParsedAccountData, PublicKey, type TokenAmount } from '@solana/web3.js';
import { env } from '@/utils/constants.ts';
import { Buffer } from 'buffer';
import * as anchor from '@coral-xyz/anchor';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { Metaplex, type Sft, type SftWithToken, type Nft, type NftWithToken } from '@metaplex-foundation/js';

// Types and IDL from Solana program
import { OnreApp } from '../../anchor/target/types/onre_app';
import idl from '../../anchor/target/idl/onre_app.json';

export { WalletMultiButton as WalletButton } from '@solana/wallet-adapter-react-ui';

type SolanaProgramContextType =
  | {
      state: 'initial';
      program: null;
      offerPda: null;
    }
  | {
      state: 'ready';
      program: Program<OnreApp>;
      offerPda: PublicKey;
    };

const getInitialProgramContext = (): SolanaProgramContextType => ({
  state: 'initial',
  program: null,
  offerPda: null,
});

const SolanaProgramContext = createContext<SolanaProgramContextType>(getInitialProgramContext());

export const SolanaProgramProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [contextValue, setContextValue] = useState<SolanaProgramContextType>(getInitialProgramContext());

  useEffect(() => {
    if (wallet == null) {
      setContextValue(getInitialProgramContext());
      return;
    }

    idl.address = env.solanaProgramId; // Override because: reasons
    const program: Program<OnreApp> = new Program(idl as OnreApp, new AnchorProvider(connection, wallet));

    const offerIdN = new anchor.BN(env.solanaOfferId);
    const bOffer = Buffer.from('offer');
    const bOfferId = offerIdN.toArrayLike(Buffer, 'le', 8);
    const [offerPda] = PublicKey.findProgramAddressSync([bOffer, bOfferId], program.programId);

    setContextValue({ state: 'ready', program, offerPda });
  }, [wallet, connection]);

  return <SolanaProgramContext.Provider value={contextValue}>{children}</SolanaProgramContext.Provider>;
};

export const useSolanaProgram = (): SolanaProgramContextType => useContext(SolanaProgramContext);

const noBalanceTokenAmount: TokenAmount = {
  amount: '',
  decimals: 9,
  uiAmount: null,
} as const;

const getTokenAccountBalance = (connection: Connection, accountPda: PublicKey) =>
  connection.getTokenAccountBalance(accountPda).catch(() => Promise.resolve({ value: noBalanceTokenAmount }));

export const useGetUserBalance = () => {
  const { connection } = useConnection();
  const { program, offerPda } = useSolanaProgram();
  const { publicKey: userPublicKey } = useWallet();

  if (!(program && offerPda && userPublicKey))
    return useQuery({
      enabled: false,
      queryKey: ['get-balance'],
      queryFn: () => Promise.resolve(noBalanceTokenAmount),
    });

  return useQuery({
    queryKey: ['get-balance'],
    queryFn: () =>
      program.account.offer
        .fetch(offerPda)
        .then(({ sellTokenMint }) => getAssociatedTokenAddress(sellTokenMint, userPublicKey, true))
        .then(userSellTokenPda => getTokenAccountBalance(connection, userSellTokenPda))
        .then(({ value }) => value),
  });
};

const toTokenInfo = (
  tokenData: ParsedAccountData | undefined,
  tokenMeta: Sft | SftWithToken | Nft | NftWithToken,
  total: BN,
) => {
  const tokenParsedInfo = tokenData?.parsed?.info ?? {};
  const { decimals = 0, supply: supplyRaw = 0 } = tokenParsedInfo;
  const scale = Math.pow(10, decimals);
  const supply = parseInt(supplyRaw) / scale;
  const { name, symbol } = tokenMeta;

  return {
    decimals,
    supply,
    name,
    symbol,
    // TODO: use this field to represent the real available total
    total: total.toNumber() / scale,
  };
};

const isParsedAccountData = (data: ParsedAccountData | unknown): data is ParsedAccountData =>
  typeof data === 'object' && data != null && 'program' in data && typeof data.program === 'string';

export const useOfferInfo = () => {
  const { connection } = useConnection();
  const { program, offerPda } = useSolanaProgram();
  const [offerInfoState, setOfferInfoState] = useState({});

  useEffect(() => {
    if (!(program && offerPda)) return;

    program.account.offer
      .fetch(offerPda)

      .then(offerAccount => {
        // @ts-ignore
        const { buyTokenMint1, sellTokenMint, buyToken1TotalAmount, sellTokenTotalAmount } = offerAccount;
        // console.log({
        //   buyToken1TotalAmount: buyToken1TotalAmount.toNumber(),
        //   sellTokenTotalAmount: sellTokenTotalAmount.toNumber(),
        // });

        // const resultBN = buyToken1TotalAmount.div(sellTokenTotalAmount);
        // console.log('resultNB', resultBN.toNumber());

        // console.log({
        //   buyToken1TotalAmount,
        //   fmtBuyToken1TotalAmount: buyToken1TotalAmount.toString(),
        //   sellTokenTotalAmount,
        //   fmtSellTokenTotalAmount: sellTokenTotalAmount.toString(),
        // });

        const metaplex = Metaplex.make(connection);
        Promise.all([
          connection.getParsedAccountInfo(buyTokenMint1),
          connection.getParsedAccountInfo(sellTokenMint),
          metaplex.nfts().findByMint({ mintAddress: buyTokenMint1 }),
          metaplex.nfts().findByMint({ mintAddress: sellTokenMint }),
        ]).then(([buyTokenInfo, sellTokenInfo, buyTokenMeta, sellTokenMeta]) => {
          // console.log({
          //   buyTokenInfo,
          //   sellTokenInfo,
          //   buyTokenMeta,
          //   sellTokenMeta,
          // });

          const buyTokenInfoValue =
            isParsedAccountData(buyTokenInfo?.value?.data) ? buyTokenInfo?.value?.data : undefined;

          const sellTokenInfoValue =
            isParsedAccountData(sellTokenInfo?.value?.data) ? sellTokenInfo?.value?.data : undefined;

          setOfferInfoState({
            buyToken: toTokenInfo(buyTokenInfoValue, buyTokenMeta, buyToken1TotalAmount),
            sellToken: toTokenInfo(sellTokenInfoValue, sellTokenMeta, sellTokenTotalAmount),
            price: buyToken1TotalAmount.div(sellTokenTotalAmount).toNumber(),
          });
        });
      });
  }, [program, offerPda]);

  return offerInfoState;
};

export const SolanaProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
  <ConnectionProvider endpoint={env.solanaRpcUrl}>
    <WalletProvider
      wallets={[]}
      onError={(error: WalletError) => {
        console.error(error);
      }}
      autoConnect
    >
      <SolanaProgramProvider>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaProgramProvider>
    </WalletProvider>
  </ConnectionProvider>
);
