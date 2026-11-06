import { defineTest } from '../lib/define.mjs';
import { run } from './test.mjs';

export default defineTest({
  name: 'validate-pr',
  paths: ['CHANGELOG.md', 'tools/release/**', 'test/validate-pr/**'],
  run,
});
