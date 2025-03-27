import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '@/utils/constants.ts';
import { useWallet } from '@solana/wallet-adapter-react';

type WhitelistApprovedResponse = {
  status: 'APPROVED';
  pubKey: string;
};
type WhitelistNotStartedResponse = {
  pubKey: string;
  status: 'NOT_STARTED';
  data: {
    url: string;
  };
};
type WhitelistUnusedResponse = {
  status: 'PENDING' | 'REJECTED' | 'STARTED';
};

type WhitelistResponse = WhitelistNotStartedResponse | WhitelistApprovedResponse | WhitelistUnusedResponse;

export const queryWalletWhitelist = (address: string = ''): Promise<WhitelistResponse> =>
  fetch(`${API_URL.solanaWalletWhitelist}/${encodeURIComponent(address)}`).then(res => res.json());

type SessionContextType =
  | {
      state: 'initial';
    }
  | {
      state: 'not-started';
      redirectTo: string;
    }
  | {
      state: 'ready';
    }
  | { state: 'error' };

const SessionContext = createContext<SessionContextType>({ state: 'initial' });

export const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { wallet, publicKey } = useWallet();

  const [contextValue, setContextValue] = useState<SessionContextType>({ state: 'initial' });

  // TODO Invalidate the state when wallet/public key changes
  useEffect(() => {
    if (!publicKey || wallet == null || wallet.readyState !== 'Installed') {
      setContextValue({
        state: 'initial',
      });
      return;
    }

    queryWalletWhitelist(publicKey?.toBase58())
      .then(response => {
        if (response.status === 'NOT_STARTED')
          setContextValue({
            state: 'not-started',
            redirectTo: response.data.url,
          });
        else if (response.status === 'APPROVED')
          setContextValue({
            state: 'ready',
          });
      })

      .catch(err => {
        console.error('Whitelist', err);

        setContextValue({ state: 'error' });
      });
  }, [wallet, publicKey]);

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};

export const useSessionContext = (): SessionContextType => useContext(SessionContext);
