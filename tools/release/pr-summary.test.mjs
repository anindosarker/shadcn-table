// Usage (repo root): node --test tools/release/pr-summary.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JOBS, MARKER, buildComment } from './pr-summary.mjs';

const RUN = 'https://github.com/o/r/actions/runs/1';
const record = (name, extra = {}) => ({
  name,
  status: 'pass',
  summary: 'ok',
  ...extra,
});
const validatePr = record('validate-pr', {
  summary: 'Ships as 0.8.2 (release:patch)',
  details: {
    version: '0.8.2',
    label: 'release:patch',
    changelog: { added: 2, changed: 1, fixed: 4 },
  },
});
const full = [
  ...['base', 'radix', 'aria'].map((base) =>
    record('typecheck', { base, summary: 'tsc clean' }),
  ),
  record('lint', { summary: '0 warnings' }),
  ...['base', 'radix', 'aria'].map((base) =>
    record('storybook-tests', { base, summary: '609 passed' }),
  ),
  ...['base', 'radix', 'aria'].map((base) =>
    record('docs-e2e', { base, summary: '5 clusters, 107 pages' }),
  ),
  record('validate-repo', { summary: 'bases identical' }),
  ...[
    'fresh',
    'existing',
    'base',
    'aria',
    'nextjs-base',
    'nextjs-radix',
    'nextjs-aria',
  ].map((scenario) =>
    record('installation-e2e', { scenario, summary: 'built' }),
  ),
  validatePr,
];

test('a full run: marker, version, counts, nineteen job lines, run link', () => {
  const body = buildComment(full, { runUrl: RUN, labelEvent: false });
  const lines = body.split('\n');
  assert.equal(lines[0], MARKER);
  assert.equal(lines[1], 'Ships as 0.8.2 (release:patch).');
  assert.equal(lines[3], 'Added 2, Changed 1, Fixed 4');
  const jobs = lines.filter((l) => l.startsWith('- '));
  assert.equal(jobs.length, 19);
  assert.deepEqual(
    jobs.map((l) => l.slice(2, l.indexOf(':'))),
    JOBS.map((j) => j.job),
  );
  assert.ok(lines.includes('- Storybook Tests (radix): 609 passed'));
  assert.ok(lines.includes('- Installation E2E (base): built'));
  assert.ok(lines.includes('- Typecheck (base): tsc clean'));
  assert.ok(lines.includes(`[Run](${RUN})`));
});

test('a failed job reads FAIL with its summary', () => {
  const records = full.map((r) =>
    r.name === 'lint' ? { ...r, status: 'fail', summary: '3 errors' } : r,
  );
  const body = buildComment(records, { runUrl: RUN, labelEvent: false });
  assert.ok(body.includes('\n- Lint: FAIL 3 errors\n'));
});

test('missing records: no record lines and no version', () => {
  const body = buildComment([record('lint', { summary: '0 warnings' })], {
    runUrl: RUN,
    labelEvent: false,
  });
  const lines = body.split('\n');
  assert.equal(lines[1], 'No version: Validate PR did not run.');
  assert.equal(lines[3], 'Changelog: no Validate PR record.');
  assert.ok(lines.includes('- Lint: 0 warnings'));
  assert.ok(
    lines.includes('- Docs E2E Tests (aria): no record (skipped or cancelled)'),
  );
  assert.equal(
    lines.filter((l) => l.endsWith('no record (skipped or cancelled)')).length,
    18,
  );
});

test('a reason instead of a version, and an empty Unreleased section', () => {
  const body = buildComment(
    [
      record('validate-pr', {
        summary: 'No release: label missing',
        details: { reason: 'No release: label missing', changelog: {} },
      }),
    ],
    { runUrl: RUN, labelEvent: false },
  );
  const lines = body.split('\n');
  assert.equal(lines[1], 'No release: label missing.');
  assert.equal(lines[3], 'No lines under ## Unreleased.');
});

test('a label event keeps the previous job lines and run link', () => {
  const previous = buildComment(full, { runUrl: RUN, labelEvent: false });
  const relabelled = record('validate-pr', {
    summary: 'Ships as 0.9.0 (release:minor)',
    details: {
      version: '0.9.0',
      label: 'release:minor',
      changelog: { added: 3 },
    },
  });
  const body = buildComment([relabelled], {
    runUrl: 'https://github.com/o/r/actions/runs/2',
    previous,
    labelEvent: true,
  });
  const lines = body.split('\n');
  assert.equal(lines[0], MARKER);
  assert.equal(lines[1], 'Ships as 0.9.0 (release:minor).');
  assert.equal(lines[3], 'Added 3');
  assert.ok(lines.includes('- Storybook Tests (radix): 609 passed'));
  assert.ok(lines.includes('- Validate PR: Ships as 0.9.0 (release:minor)'));
  assert.ok(lines.includes(`[Run](${RUN})`));
  assert.equal(lines.filter((l) => l.startsWith('- ')).length, 19);
});

test('a label event without a previous comment builds from the records', () => {
  const body = buildComment([validatePr], { runUrl: RUN, labelEvent: true });
  assert.ok(body.includes('\n- Lint: no record (skipped or cancelled)\n'));
});
