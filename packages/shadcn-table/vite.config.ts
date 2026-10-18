import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defaultClientConditions, defineConfig, type Plugin } from 'vite';

// `ST_BASE=base` builds the library against the Base UI parts in base/ and
// the `primitives/base/*` adapters (the `st-base` condition of the
// `#primitives/*` import map in package.json); the default is Radix.
const onBase = process.env.ST_BASE === 'base';

const SRC_UI = path.resolve(__dirname, './src/components/ui');
const BASE_UI = path.resolve(__dirname, './base/components/ui');

/**
 * Resolves `@/components/ui/<part>` (the shadcn parts, not the library under
 * the same alias) to base/components/ui. The built-in alias plugin has
 * already turned `@` into the src path by the time this runs; a plugin
 * rather than a regex alias because the rolldown build takes alias
 * replacements literally.
 */
const baseParts = (): Plugin => ({
  name: 'st-base-parts',
  enforce: 'pre',
  resolveId(source, importer, options) {
    if (!source.startsWith(`${SRC_UI}/`)) return null;
    const part = source.slice(SRC_UI.length + 1);
    if (part === 'shadcn-table' || part.startsWith('shadcn-table/')) {
      return null;
    }
    return this.resolve(path.join(BASE_UI, part), importer, {
      ...options,
      skipSelf: true,
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [...(onBase ? [baseParts()] : []), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    conditions: onBase
      ? ['st-base', ...defaultClientConditions]
      : [...defaultClientConditions],
  },
});
