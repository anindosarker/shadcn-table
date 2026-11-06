// Placeholder until its milestone task fills it: listed, never run.
import { defineTest } from '../lib/define.mjs';

export default defineTest({
  name: 'validate-production',
  paths: ['test/validate-production/**'],

  pending: true,
  run: async () => ({ status: 'fail', summary: 'not written yet' }),
});
