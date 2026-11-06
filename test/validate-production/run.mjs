import { defineTest } from '../lib/define.mjs';
import { run } from './test.mjs';

export default defineTest({
  name: 'validate-production',
  paths: ['test/validate-production/**'],
  run,
});
