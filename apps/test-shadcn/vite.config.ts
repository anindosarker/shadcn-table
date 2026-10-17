import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const repoRoot = path.resolve(__dirname, '../..');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Array form: first match wins. The library alias must precede the
    // generic `@` alias so the library resolves to the package source while
    // its own `@/lib/utils` and `@/components/ui/*` imports resolve to this
    // playground's copies.
    alias: [
      {
        find: '@/components/ui/shadcn-react-table',
        replacement: path.resolve(
          repoRoot,
          'packages/shadcn-react-table/src/components/ui/shadcn-react-table',
        ),
      },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
