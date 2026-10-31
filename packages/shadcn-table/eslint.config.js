import comments from '@eslint-community/eslint-plugin-eslint-comments';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

// Each base resolves `@/` to its own tree, so type-aware rules read that
// base's tsconfig.
const BASE_PROJECTS = {
  base: './tsconfig.baseui.json',
  radix: './tsconfig.radix.json',
  aria: './tsconfig.aria.json',
};

export default defineConfig([
  // Parts (registry/<base>/components/ui/<part>.tsx) are what `shadcn add`
  // installs, written by scripts/registry/add-part.mjs and never edited; the
  // library lives below components/ui/shadcn-table/ and is linted.
  globalIgnores(['dist', 'storybook-static', 'registry/*/components/ui/*.tsx']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      // Editors lint from the repo root, where two package configs are
      // candidates; pin the parser to this package.
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
  ...Object.entries(BASE_PROJECTS).map(([base, project]) => ({
    files: [`registry/${base}/components/ui/shadcn-table/**/*.{ts,tsx}`],
    languageOptions: {
      parserOptions: { project, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { '@eslint-community/eslint-comments': comments },
    rules: {
      '@typescript-eslint/no-deprecated': 'error',
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  })),
]);
