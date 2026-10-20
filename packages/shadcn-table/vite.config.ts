import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// `ST_BASE=base` builds the library and the shared stories against the Base
// UI tree in registry/base; the default is the Radix tree in registry/radix.
// `@/` is a plain alias to that tree (test config only: no library file knows
// about the other tree).
export const ST_BASE = process.env.ST_BASE === 'base' ? 'base' : 'radix';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'registry', ST_BASE) },
  },
});
