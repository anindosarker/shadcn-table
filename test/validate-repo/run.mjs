import { defineTest } from '../lib/define.mjs';
import { run } from './test.mjs';

export default defineTest({
  name: 'validate-repo',
  paths: [
    'packages/shadcn-table/registry/**',
    'packages/shadcn-table/registry.json',
    'packages/shadcn-table/package.json',
    'apps/shadcn-table-docs/examples/**',
    'apps/shadcn-table-docs/content/docs/examples/**',
    'apps/shadcn-table-docs/registry.json',
    'tools/**',
    'test/validate-repo/**',
  ],
  run,
});
