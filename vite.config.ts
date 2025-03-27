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
          react: [
            '@tanstack/react-query',
            'react',
            'react-dom',
            'react-helmet-async',
            'react-hot-toast',
            'react-router',
          ],
          solana: [
            '@coral-xyz/anchor',
            '@metaplex-foundation/js', // NOTE: HUUUGE, try to work around it
            '@solana/spl-token',
            '@solana/wallet-adapter-base',
            '@solana/wallet-adapter-react',
            '@solana/wallet-adapter-react-ui',
            '@solana/web3.js',
          ],
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
