import React, { createContext, useContext, useEffect, useState } from 'react';
import { BN } from '@coral-xyz/anchor';
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
import { type ParsedAccountData, PublicKey, type TokenAmount, Transaction } from '@solana/web3.js';
import { env } from '@/utils/constants.ts';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';

import { type Metadata, Metaplex } from '@metaplex-foundation/js';

import { getCurrentOffer, getOnReAppProgramInfo, type OnReAppProgram } from './utils/SolanaProgram';

export { WalletMultiButton as WalletButton } from '@solana/wallet-adapter-react-ui';

type SolanaProgramContextState =
  | {
      state: 'initial';
      program: null;
      offerPda: null;
      offerAuthority: null;
    }
  | {
      state: 'ready';
      program: OnReAppProgram;
      offerPda: PublicKey;
      offerAuthority: PublicKey;
    };

type SolanaProgramContentMethods = {
  executePurchase: (amount: number) => void;
  purchaseTransactionState: TransactionState;
};

type SolanaProgramContextType = SolanaProgramContextState
  & SolanaProgramContentMethods & { offerInfo: OfferInfoStateType };

type TransactionState =
  | { status: 'idle' }
  | { status: 'preparing' }
  | { status: 'executing' }
  | { status: 'done' }
  | { status: 'error' };

const getInitialProgramContextState = (): SolanaProgramContextState => ({
  state: 'initial',
  program: null,
  offerPda: null,
  offerAuthority: null,
});

const SolanaProgramContext = createContext<SolanaProgramContextType | null>(null);

export const SolanaProgramProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { publicKey: userPublicKey, sendTransaction } = useWallet();
  const [programContextState, setProgramContextState] = useState<SolanaProgramContextState>(
    getInitialProgramContextState(),
  );
  const [offerInfoState, setOfferInfoState] = useState<OfferInfoStateType>({ state: 'initial' });

  const [transactionState, setTransactionState] = useState<TransactionState>({ status: 'idle' });

  useEffect(() => {
    if (wallet == null) {
      setProgramContextState(getInitialProgramContextState());
      return;
    }

    const program = getOnReAppProgramInfo(connection, wallet);
    const { offerPda, offerAuthority } = getCurrentOffer(program);

    setProgramContextState({ state: 'ready', program, offerPda, offerAuthority });
  }, [wallet, connection]);

  const updateOfferInfo = () => {
    const { program, offerPda, offerAuthority } = programContextState;

    if (!(program && offerPda)) {
      setOfferInfoState({ state: 'initial' });
      return;
    }
    setOfferInfoState({ state: 'loading' });

    program.account.offer
      .fetch(offerPda)

      .then(offerAccount => {
        const { buyTokenMint1, sellTokenMint } = offerAccount;
        const metaplex = Metaplex.make(connection);

        return Promise.all([
          offerAccount,
          connection.getParsedAccountInfo(buyTokenMint1),
          connection.getParsedAccountInfo(sellTokenMint),
          metaplex.nfts().findByMint({ mintAddress: buyTokenMint1 }),
          metaplex.nfts().findByMint({ mintAddress: sellTokenMint }),
          getAssociatedTokenAddress(buyTokenMint1, offerAuthority, true).then(offerBuyToken1Pda =>
            connection.getTokenAccountBalance(offerBuyToken1Pda),
          ),
        ]);
      })

      .then(([offerAccount, buyTokenInfo, sellTokenInfo, buyTokenMeta, sellTokenMeta, offerBuyTokenAccountInfo]) => {
        const { buyToken1TotalAmount, sellTokenTotalAmount } = offerAccount;
        const buyTokenInfoValue =
          isParsedAccountData(buyTokenInfo?.value?.data) ? buyTokenInfo?.value?.data : undefined;

        const sellTokenInfoValue =
          isParsedAccountData(sellTokenInfo?.value?.data) ? sellTokenInfo?.value?.data : undefined;

        setOfferInfoState({
          state: 'valid',
          buyToken: toTokenInfo(
            buyTokenInfoValue,
            buyTokenMeta,
            buyToken1TotalAmount,
            new BN(offerBuyTokenAccountInfo.value.amount),
          ) as Required<TokenInfo>,
          sellToken: toTokenInfo(sellTokenInfoValue, sellTokenMeta, sellTokenTotalAmount),
          price: buyToken1TotalAmount.div(sellTokenTotalAmount).toNumber(),
        });
      });
  };

  useEffect(() => {
    updateOfferInfo();
  }, [programContextState.program, programContextState.offerPda]);

  const executePurchase = (amount: number) => {
    const { program, offerPda } = programContextState;

    if (!(program && offerPda && userPublicKey)) return;

    const offerAccount = program.account.offer.fetch(offerPda);
    setTransactionState({ status: 'preparing' });

    // Check for existence of buy token in user's wallet
    const userBuyTokenBalance = offerAccount
      .then(({ buyTokenMint1 }) => getAssociatedTokenAddress(buyTokenMint1, userPublicKey, true))
      .then(userTokenPda => connection.getTokenAccountBalance(userTokenPda));

    const takeOfferInstruction = offerAccount
      .then(({ sellTokenMint }) =>
        Promise.all([
          connection.getParsedAccountInfo(sellTokenMint),
          getAssociatedTokenAddress(sellTokenMint, userPublicKey, true),
        ]),
      )
      .then(([sellTokenInfo, userTokenPda]) =>
        program.methods
          // @ts-ignore
          .takeOfferOne(new BN(Math.pow(10, sellTokenInfo?.value?.data?.parsed?.info?.decimals)).mul(new BN(amount)))
          .accountsPartial({ userSellTokenAccount: userTokenPda, offer: offerPda, user: userPublicKey })
          .instruction(),
      );

    Promise.allSettled([userBuyTokenBalance, takeOfferInstruction, offerAccount])
      .then(([balanceResolution, takeOfferInstructionResolution, offerAccountData]) => {
        const transaction = new Transaction();
        if (balanceResolution.status === 'rejected' && offerAccountData.status === 'fulfilled') {
          const { buyTokenMint1 } = offerAccountData.value;
          const createUser1BuyToken1AccountInstruction = createAssociatedTokenAccountInstruction(
            userPublicKey,
            getAssociatedTokenAddressSync(buyTokenMint1, userPublicKey, true),
            userPublicKey,
            buyTokenMint1,
          );

          transaction.add(createUser1BuyToken1AccountInstruction);
        }

        if (takeOfferInstructionResolution.status === 'fulfilled') {
          transaction.add(takeOfferInstructionResolution.value);
        } else {
          return Promise.reject();
        }

        setTransactionState({ status: 'executing' });
        return sendTransaction(transaction, connection);
      })
      .then(signature => Promise.all([signature, connection.getLatestBlockhash()]))
      .then(([signature, hash]) => {
        console.log({ signature, hash });
        return connection.confirmTransaction({
          signature,
          blockhash: hash.blockhash,
          lastValidBlockHeight: hash.lastValidBlockHeight,
        });
      })
      .then(() => {
        setTransactionState({ status: 'done' });
        setTimeout(() => setTransactionState({ status: 'idle' }), 100);
      })
      .catch(() => {
        setTransactionState({ status: 'error' });
        setTimeout(() => setTransactionState({ status: 'idle' }), 100);
      })
      .finally(() => updateOfferInfo());
  };

  return (
    <SolanaProgramContext.Provider
      value={{
        ...programContextState,
        offerInfo: offerInfoState,
        executePurchase,
        purchaseTransactionState: transactionState,
      }}
    >
      {children}
    </SolanaProgramContext.Provider>
  );
};

export const useSolanaProgramContext = (): SolanaProgramContextType => {
  const context = useContext(SolanaProgramContext);
  if (context === null) throw new Error('useSolanaProgramContext must be within SolanaProgramContext.Provider');

  return context;
};

const noBalanceTokenAmount: TokenAmount = {
  amount: '0',
  decimals: 9,
  uiAmount: 0,
} as const;

export const useGetUserBalance = () => {
  const { connection } = useConnection();
  const { program, offerPda } = useSolanaProgramContext();
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
        .then(userTokenPda => connection.getTokenAccountBalance(userTokenPda))
        .catch(() => Promise.resolve({ value: noBalanceTokenAmount }))
        .then(({ value }) => value),
  });
};

type TokenInfo = {
  decimals: number;
  supply: number;
  name: string;
  symbol: string;
  total: number;
  totalAvailable?: number;
};

const toTokenInfo = (
  tokenData: ParsedAccountData | undefined,
  tokenMeta: Pick<Metadata, 'name' | 'symbol'>,
  total: BN,
  totalAvailable?: BN,
): TokenInfo => {
  const tokenParsedInfo = tokenData?.parsed?.info ?? {};
  const { decimals = 0, supply: supplyRaw = 0 } = tokenParsedInfo;
  const scale = new BN(Math.pow(10, decimals));
  const supply = new BN(supplyRaw).div(scale).toNumber();
  const { name, symbol } = tokenMeta;

  return {
    decimals,
    supply,
    name,
    symbol,
    total: total.div(scale).toNumber(),
    ...(totalAvailable && {
      totalAvailable: totalAvailable.div(scale).toNumber(),
    }),
  };
};

const isParsedAccountData = (data: ParsedAccountData | unknown): data is ParsedAccountData =>
  typeof data === 'object' && data != null && 'program' in data && typeof data.program === 'string';

type OfferInfoStateType =
  | { state: 'initial' | 'loading' }
  | {
      state: 'valid';
      buyToken: Required<TokenInfo>;
      sellToken: TokenInfo;
      price: number;
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
