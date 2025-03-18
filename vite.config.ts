import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import Unfonts from 'unplugin-fonts/vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          //       jotai: ['jotai'],
          react: ['react', 'react-dom', 'react-router'],
          //       reactHotToast: ['react-hot-toast'],
          solanaWalletAdapters: [
            '@solana/wallet-adapter-base',
            '@solana/wallet-adapter-react',
            '@solana/wallet-adapter-react-ui',
          ],
          //       tanstack: ['@tanstack/react-query'],
        },
      },
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
        }),
      ],
    },
  },
  plugins: [
    viteTsconfigPaths(),
    react(),
    Unfonts({
      google: {
        families: [{ name: 'Inter', styles: 'ital,opsz,wght@0,14..32,100..900;1,14..32,100..900' }],
      },
    }),
    nodePolyfills(),
  ],
});
