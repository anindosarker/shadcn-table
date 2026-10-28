import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // Parts (registry/<edition>/components/ui/<part>.tsx) are what `shadcn add`
  // installs, written by scripts/registry/add-part.mjs and never edited; the
  // library lives below components/ui/shadcn-table/ and is linted.
  globalIgnores(['dist', 'storybook-static', 'registry/*/components/ui/*.tsx']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      // reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      // Editors lint from the repo root, where two package configs are
      // candidates; pin the parser to this package.
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // Unused code is checked here, not by tsc (the tsconfigs carry no
      // noUnusedLocals / noUnusedParameters, see the parts above); `_`
      // prefixed names are tolerated as tsc tolerated them.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // Folded core (MRT-verbatim types/hooks/utils/fns): linted as MRT's
    // .eslintrc lints them (no-explicit-any off, no react-hooks plugin);
    // no-unused-vars keeps the locals check and skips arguments, MRT's
    // signatures carry unused ones.
    files: [
      'registry/*/components/ui/shadcn-table/{fns,hooks,utils,shared/fns,shared/utils}/**/*.{ts,tsx}',
      'registry/*/components/ui/shadcn-table/{icons,types}.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { args: 'none', varsIgnorePattern: '^_' },
      ],
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
]);
