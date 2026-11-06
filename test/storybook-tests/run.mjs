import { defineTest } from '../lib/define.mjs';
import { run } from './test.mjs';

export default defineTest({
  name: 'storybook-tests',
  paths: [
    'packages/shadcn-table/**',
    'tools/registry/bases.mjs',
    'test/storybook-tests/**',
  ],
  bases: ['base', 'radix', 'aria'],
  run,
});
