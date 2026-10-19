import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    //per-agent next dev dist dirs (NEXT_DIST_DIR, see next.config.mjs)
    '.next-*/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.source/**',
    //installed library copy (overwritten by lib:install), linted in packages/shadcn-table
    'components/ui/shadcn-table/**',
    //Base UI copy of the table and its parts (lib:install:base), same source
    'components/ui-base/**',
    //generated Base UI variants of the examples (lib/example-variants.mjs)
    'examples/.base/**',
  ]),
  {
    //examples mirror MRT's; loading data and reading storage after mount is intentional there
    files: ['examples/**'],
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
]);

export default eslintConfig;
