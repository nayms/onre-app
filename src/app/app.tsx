import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalStyles } from '@/GlobalStyles';
import { defaultTheme } from '@/themes';
import { PageNotFound } from '@/components/views/PageNotFound.tsx';
import { CoinTradeView } from '@/components/views/CoinTradeView.tsx';
import { MainLayout } from '@/components/layouts/MainLayout.tsx';

const client = new QueryClient();

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => (
  <HelmetProvider>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export const App: React.FC = () => (
  <Providers>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<CoinTradeView />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Providers>
);
