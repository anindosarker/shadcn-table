import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// `ST_BASE=base` or `ST_BASE=aria` builds the library and the shared stories
// against the Base UI tree in registry/base or the React Aria tree in
// registry/aria; the default is the Radix tree in registry/radix. `@/` is a
// plain alias to that tree (test config only: no library file knows about the
// other trees).
const EDITIONS = ['radix', 'base', 'aria'] as const;
export const ST_BASE =
  EDITIONS.find((edition) => edition === process.env.ST_BASE) ?? 'radix';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'registry', ST_BASE) },
  },
});
