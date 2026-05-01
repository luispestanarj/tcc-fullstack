import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3333', changeOrigin: true },
    },
  },
  resolve: {
    alias: {
      '@tcc/shared': resolve(__dirname, '../../packages/shared/src'),
    },
  },
});
