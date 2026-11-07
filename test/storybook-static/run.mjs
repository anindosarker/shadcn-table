import { defineTest } from '../lib/define.mjs';
import { run } from './test.mjs';

export default defineTest({
  name: 'storybook-static',
  paths: [
    'packages/shadcn-table/.storybook/**',
    'packages/shadcn-table/stories/**',
    'test/storybook-static/**',
  ],
  bases: ['base', 'radix', 'aria'],
  run,
});
