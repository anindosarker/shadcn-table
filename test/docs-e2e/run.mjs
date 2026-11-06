// Placeholder until its milestone task fills it: listed, never run.
import { defineTest } from '../lib/define.mjs';

export default defineTest({
  name: 'docs-e2e',
  paths: ['test/docs-e2e/**'],
  bases: ['base', 'radix', 'aria'],
  pending: true,
  run: async () => ({ status: 'fail', summary: 'not written yet' }),
});
