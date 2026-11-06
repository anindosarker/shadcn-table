import { defineTest } from '../lib/define.mjs';
import { run, SCENARIOS } from './test.mjs';

export default defineTest({
  name: 'installation-e2e',
  paths: [
    'packages/shadcn-table/registry/**',
    'packages/shadcn-table/package.json',
    'apps/shadcn-table-docs/examples/**',
    'tools/registry/**',
    'test/installation-e2e/**',
  ],
  scenarios: Object.keys(SCENARIOS),
  run,
});
