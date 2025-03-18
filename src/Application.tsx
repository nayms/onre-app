import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalStyles, WalletAdapterStyles } from '@/themes';
import { MainLayout } from '@/modules/layouts/MainLayout.tsx';
import { NotFoundView } from '@/views/NotFoundView.tsx';
import { CoinTradeView } from '@/views/CoinTradeView.tsx';
import { SwitchableThemeProvider } from '@/data/ThemeProvider.tsx';
import { SolanaProvider } from '@/data/SolanaProvider.tsx';
import { ClusterProvider } from '@/components/_old_from_scaffold/cluster/cluster-data-access.tsx';

const client = new QueryClient();

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => (
  <HelmetProvider>
    <QueryClientProvider client={client}>
      <ClusterProvider>
        <SwitchableThemeProvider>
          <GlobalStyles />
          <WalletAdapterStyles />
          <SolanaProvider>{children}</SolanaProvider>
        </SwitchableThemeProvider>
      </ClusterProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export const Application: React.FC = () => (
  <Providers>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<CoinTradeView />} />
          <Route path="*" element={<NotFoundView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Providers>
);
