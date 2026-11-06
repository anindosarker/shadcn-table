// Placeholder until its milestone task fills it: listed, never run.
import { defineTest } from '../lib/define.mjs';

export default defineTest({
  name: 'installation-e2e',
  paths: ['test/installation-e2e/**'],
  scenarios: [
    'fresh',
    'existing',
    'base',
    'aria',
    'nextjs-base',
    'nextjs-radix',
    'nextjs-aria',
  ],
  pending: true,
  run: async () => ({ status: 'fail', summary: 'not written yet' }),
});
