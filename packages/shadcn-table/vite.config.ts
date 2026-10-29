import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolveBase } from './scripts/registry/bases.mjs';

// `ST_BASE=base`, `ST_BASE=radix` or `ST_BASE=aria` builds the library and
// the shared stories against that base's tree in registry/<base>. `@/`
// is a plain alias to that tree (test config only: no library file knows
// about the other trees). Any other value, or none, is the default base,
// Base UI (DEFAULT_BASE in scripts/registry/bases.mjs), so a bare
// `vitest` or `storybook` (editor test runners, the addon-vitest panel) runs
// the tree a reader sees first.
export const ST_BASE = resolveBase(process.env.ST_BASE);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'registry', ST_BASE) },
  },
});
