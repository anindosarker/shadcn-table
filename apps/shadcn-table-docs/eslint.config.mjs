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
    //installed Radix UI copy of the table and its parts (lib:install radix), linted in packages/shadcn-table
    'components/ui-radix/**',
    //installed Base UI copy of the table and its parts (lib:install base), same source
    'components/ui-base/**',
    //installed React Aria copy of the table and its parts (lib:install aria), same source
    'components/ui-aria/**',
    //generated per-base variants of the examples (lib/example-variants.mjs)
    'examples/.radix/**',
    'examples/.base/**',
    'examples/.aria/**',
  ]),
  {
    //examples mirror MRT's; loading data and reading storage after mount is intentional there
    files: ['examples/**'],
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
]);

export default eslintConfig;
