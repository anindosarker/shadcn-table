import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// `ST_BASE=base` builds the library and the shared stories against the Base
// UI tree in bases/base; the default is the Radix tree in bases/radix. Every
// `@/` import (library, parts, lib/utils, index.css) resolves inside the one
// tree, so the plain prefix alias is the only switch (test config only: no
// library file knows about the other tree).
export const ST_BASE = process.env.ST_BASE === 'base' ? 'base' : 'radix';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'bases', ST_BASE),
    },
  },
});
