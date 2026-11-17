import { defineTest } from '../lib/define.mjs';
import { run } from './test.mjs';

export default defineTest({
  name: 'storybook-static',
  paths: [
    'packages/shadcn-table/.storybook/**',
    'packages/shadcn-table/stories/**',
    'apps/shadcn-table-docs/lib/storybook-map.ts',
    'apps/shadcn-table-docs/lib/story-pages.mjs',
    'apps/shadcn-table-docs/content/docs/examples/more/**',
    'test/storybook-static/**',
  ],
  bases: ['base', 'radix', 'aria'],
  run,
});
