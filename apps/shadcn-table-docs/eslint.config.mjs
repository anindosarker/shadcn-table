import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '.source/**',
    //installed library copy (overwritten by lib:install), linted in packages/shadcn-table
    'components/ui/shadcn-table/**',
  ]),
  {
    //examples mirror MRT's; loading data and reading storage after mount is intentional there
    files: ['examples/**'],
    rules: { 'react-hooks/set-state-in-effect': 'off' },
  },
]);

export default eslintConfig;
