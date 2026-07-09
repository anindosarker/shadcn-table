import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'shadcn-react-table-core': path.resolve(
        __dirname,
        '../../packages/shadcn-react-table-core/src/index.ts',
      ),
    },
  },
});
