import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'storybook-static']),
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
  },
  {
    // Folded core (MRT-verbatim types/hooks/utils/fns): linted as MRT's
    // .eslintrc lints them (no-explicit-any / no-unused-vars off, no
    // react-hooks plugin).
    files: [
      'src/components/ui/shadcn-table/{fns,hooks,utils}/**/*.{ts,tsx}',
      'src/components/ui/shadcn-table/{icons,types}.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
]);
