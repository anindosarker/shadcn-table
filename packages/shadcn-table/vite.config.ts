import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolveEdition } from './scripts/registry/editions.mjs';

// `ST_BASE=base` or `ST_BASE=aria` builds the library and the shared stories
// against the Base UI tree in registry/base or the React Aria tree in
// registry/aria; the default is the Radix tree in registry/radix. `@/` is a
// plain alias to that tree (test config only: no library file knows about the
// other trees). Any other value, or none, is the reference edition
// (scripts/registry/editions.mjs).
export const ST_BASE = resolveEdition(process.env.ST_BASE);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'registry', ST_BASE) },
  },
});
