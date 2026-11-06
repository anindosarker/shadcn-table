import { defineTest } from '../lib/define.mjs';
import { run } from './test.mjs';

export default defineTest({
  name: 'lint',
  paths: [
    'packages/shadcn-table/**',
    'apps/shadcn-table-docs/**',
    'test/lint/**',
  ],
  run,
});
