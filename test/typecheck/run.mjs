import { defineTest } from '../lib/define.mjs';
import { run } from './test.mjs';

export default defineTest({
  name: 'typecheck',
  paths: [
    'packages/shadcn-table/**',
    'apps/shadcn-table-docs/**',
    'tools/registry/**',
    'test/typecheck/**',
  ],
  bases: ['base', 'radix', 'aria'],
  run,
});
