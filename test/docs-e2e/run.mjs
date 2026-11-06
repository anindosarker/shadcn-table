import { defineTest } from '../lib/define.mjs';
import { run } from './test.mjs';

export default defineTest({
  name: 'docs-e2e',
  paths: [
    'apps/shadcn-table-docs/**',
    'packages/shadcn-table/registry/**',
    'tools/registry/**',
    'test/docs-e2e/**',
  ],
  bases: ['base', 'radix', 'aria'],
  run,
});
