import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// `ST_BASE=base` builds the library and the shared stories against the Base
// UI tree in bases/base; the default is the Radix tree in bases/radix. Every
// `@/` import (library, parts, lib/utils, index.css) is looked up in the base
// folder first and in shared/ second, so a file under
// bases/<base>/components/ui/shadcn-table overrides the shared copy of the
// same path (test config only: no library file knows about the other tree).
export const ST_BASE = process.env.ST_BASE === 'base' ? 'base' : 'radix';

const ROOTS = [
  path.resolve(__dirname, 'bases', ST_BASE),
  path.resolve(__dirname, 'shared'),
];
const EXTENSIONS = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];

/** Resolve `@/<rel>` against bases/<ST_BASE> then shared/, first file wins. */
export function resolveAlias(source: string): string | null {
  if (!source.startsWith('@/')) return null;
  const rel = source.slice(2);
  for (const root of ROOTS) {
    for (const ext of EXTENSIONS) {
      const candidate = path.join(root, rel) + ext;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
  }
  return null;
}

function baseFallback(): Plugin {
  return {
    name: 'st-base-fallback',
    enforce: 'pre',
    resolveId(source) {
      return resolveAlias(source);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [baseFallback(), react(), tailwindcss()],
});
