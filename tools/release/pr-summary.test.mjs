// Usage (repo root): node --test tools/release/pr-summary.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  JOBS,
  MARKER,
  buildComment,
  changelogSection,
  recordsFromNeeds,
} from './pr-summary.mjs';

const RUN = 'https://github.com/o/r/actions/runs/1';
const record = (name, extra = {}) => ({
  name,
  status: 'pass',
  summary: 'ok',
  ...extra,
});
const validatePr = record('validate-pr', {
  summary: 'Ships as 0.9.0 (release:minor, already bumped)',
  details: { version: '0.9.0', label: 'release:minor', note: 'already bumped' },
});
const full = [
  ...['base', 'radix', 'aria'].map((base) =>
    record('typecheck', { base, summary: 'tsc clean' }),
  ),
  record('lint', { summary: '9 warnings' }),
  ...['base', 'radix', 'aria'].map((base) =>
    record('storybook-tests', { base, summary: '618 passed' }),
  ),
  ...['base', 'radix', 'aria'].map((base) =>
    record('docs-e2e', { base, summary: '4 sections, 107 pages' }),
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

const CHANGELOG = [
  '# Changelog',
  '',
  '## Unreleased',
  '',
  '### Added',
  '',
  '#### Theme customizer panel',
  '',
  '- a line',
  '',
  '#### Release approval gate',
  '',
  '### Fixed',
  '',
  '#### Filter mode menu exit jump (F3)',
  '',
  '## 0.8.2 - 2026-11-06',
  '',
  '### Changed',
  '',
  '#### Epic 08 release run',
  '',
].join('\n');

const opts = (extra = {}) => ({
  title: 'release: 0.9.0',
  runUrl: RUN,
  runId: '1',
  changelog: CHANGELOG,
  labelEvent: false,
  ...extra,
});

const tableRows = (body) =>
  body
    .split('\n')
    .filter((l) => l.startsWith('| ') && !/^\| (Job|---) /.test(l));
const firstCell = (row) => row.split(' | ')[0].slice(2);
const resultRows = (body) =>
  tableRows(body).filter((r) => !/^\| \*\*.*\*\* \| +\|$/.test(r));

test('a full green run: title, status line, grouped table, no failures, changelog', () => {
  const body = buildComment(full, opts());
  const lines = body.split('\n');
  assert.equal(lines[0], MARKER);
  assert.equal(lines[1], '## release: 0.9.0');
  assert.equal(
    lines.find((l) => l.startsWith('`')),
    `\`release:minor\` | [run 1](${RUN}) | ✅ all green`,
  );
  assert.ok(lines.includes('| Job | Result |'));
  const groups = tableRows(body).filter((r) => / \| +\|$/.test(r));
  assert.deepEqual(groups, [
    '| **Typecheck** | |',
    '| **Storybook Tests** | |',
    '| **Docs E2E Tests** | |',
    '| **Installation E2E** | |',
  ]);
  const rows = resultRows(body);
  assert.equal(rows.length, 19);
  assert.deepEqual(
    rows.map(firstCell),
    JOBS.map((j) =>
      j.base || j.scenario
        ? `&nbsp;&nbsp;${j.base ?? j.scenario}`
        : `**${j.job}**`,
    ),
  );
  assert.ok(lines.includes('| &nbsp;&nbsp;base | ✅ tsc clean |'));
  assert.ok(lines.includes('| **Lint** | ✅ 9 warnings |'));
  assert.ok(
    lines.includes(
      '| **Validate PR** | ✅ Ships as 0.9.0 (release:minor, already bumped) |',
    ),
  );
  // the group row comes right before its legs
  const all = tableRows(body);
  const tc = all.indexOf('| **Typecheck** | |');
  assert.equal(all[tc + 1], '| &nbsp;&nbsp;base | ✅ tsc clean |');
  assert.ok(!body.includes('<details>'));
  assert.ok(lines.includes('#### Changelog'));
  assert.ok(lines.includes('Under `## Unreleased`: Added 2 · Fixed 1'));
  assert.equal(
    lines.at(-1),
    '<sub>Updated on every run of this pull request.</sub>',
  );
});

test('two failures: status, cells cut before the first ": ", details block', () => {
  const records = full.map((r) => {
    if (r.name === 'docs-e2e' && r.base === 'base') {
      return {
        ...r,
        status: 'fail',
        summary: '4 sections, 107 pages, 2 failed: examples: FAIL /a',
        errors: ['examples: FAIL /a @1440 x', 'examples: FAIL /b @1440 y'],
      };
    }
    if (r.name === 'lint') return { ...r, status: 'fail', summary: '3 errors' };
    return r;
  });
  const body = buildComment(records, opts());
  const lines = body.split('\n');
  assert.ok(
    lines.find((l) => l.startsWith('`')).endsWith(' | ❌ 2 jobs failed'),
  );
  assert.ok(
    lines.includes('| &nbsp;&nbsp;base | ❌ 4 sections, 107 pages, 2 failed |'),
  );
  assert.ok(lines.includes('| **Lint** | ❌ 3 errors |'));
  assert.ok(lines.includes('<details>'));
  assert.ok(lines.includes('<summary>❌ 3 failures</summary>'));
  assert.ok(
    lines.includes('- **Docs E2E Tests (base)** examples: FAIL /a @1440 x'),
  );
  assert.ok(
    lines.includes('- **Docs E2E Tests (base)** examples: FAIL /b @1440 y'),
  );
  assert.ok(lines.includes('- **Lint** 3 errors'));
  assert.ok(lines.includes('</details>'));
});

test('missing records: skipped cells and the skipped status', () => {
  const body = buildComment(
    full.filter((r) => r.name !== 'docs-e2e'),
    opts(),
  );
  const lines = body.split('\n');
  assert.ok(lines.find((l) => l.startsWith('`')).endsWith(' | ⚪ 3 skipped'));
  const docs = tableRows(body);
  const at = docs.indexOf('| **Docs E2E Tests** | |');
  assert.deepEqual(docs.slice(at + 1, at + 4), [
    '| &nbsp;&nbsp;base | ⚪ skipped |',
    '| &nbsp;&nbsp;radix | ⚪ skipped |',
    '| &nbsp;&nbsp;aria | ⚪ skipped |',
  ]);
});

test('no validate-pr record: no release label', () => {
  const body = buildComment(
    full.filter((r) => r.name !== 'validate-pr'),
    opts(),
  );
  assert.ok(
    body.includes(`\nno release label | [run 1](${RUN}) | ⚪ 1 skipped\n`),
  );
});

test('a dispatch without a title reads PR checks', () => {
  const body = buildComment(full, opts({ title: undefined }));
  assert.equal(body.split('\n')[1], '## PR checks');
});

test('a label event keeps the other rows and the failures block', () => {
  const failed = full.map((r) =>
    r.name === 'docs-e2e' && r.base === 'radix'
      ? {
          ...r,
          status: 'fail',
          summary: '4 sections, 107 pages, 1 failed: examples: FAIL /c',
          errors: ['examples: FAIL /c @1440 z'],
        }
      : r,
  );
  const previous = buildComment(failed, opts());
  const relabelled = record('validate-pr', {
    summary: 'Ships as 0.9.1 (release:patch)',
    details: { version: '0.9.1', label: 'release:patch' },
  });
  const changelog = CHANGELOG.replace(
    '#### Release approval gate',
    '#### Release approval gate\n\n#### Third',
  );
  const body = buildComment([relabelled], {
    ...opts({ runUrl: 'https://github.com/o/r/actions/runs/2', runId: '2' }),
    changelog,
    previous,
    labelEvent: true,
  });
  const lines = body.split('\n');
  assert.equal(lines[0], MARKER);
  assert.equal(lines[1], '## release: 0.9.0');
  assert.equal(
    lines.find((l) => l.startsWith('`')),
    '`release:patch` | [run 2](https://github.com/o/r/actions/runs/2) | ❌ 1 job failed',
  );
  assert.ok(lines.includes('| &nbsp;&nbsp;radix | ✅ 618 passed |'));
  assert.ok(
    lines.includes(
      '| &nbsp;&nbsp;radix | ❌ 4 sections, 107 pages, 1 failed |',
    ),
  );
  assert.ok(lines.includes('| **Lint** | ✅ 9 warnings |'));
  assert.ok(
    lines.includes('| **Validate PR** | ✅ Ships as 0.9.1 (release:patch) |'),
  );
  assert.equal(resultRows(body).length, 19);
  const block = (b) => b.slice(b.indexOf('<details>'), b.indexOf('</details>'));
  assert.equal(block(body), block(previous));
  assert.ok(lines.includes('Under `## Unreleased`: Added 3 · Fixed 1'));
});

test('a label event without a previous comment builds from the records', () => {
  const body = buildComment([validatePr], opts({ labelEvent: true }));
  assert.ok(body.includes('\n| **Lint** | ⚪ skipped |\n'));
});

test('changelog: Unreleased counts and one bullet per heading', () => {
  const lines = changelogSection(CHANGELOG).split('\n');
  assert.equal(lines[0], '#### Changelog');
  assert.ok(lines.includes('Under `## Unreleased`: Added 2 · Fixed 1'));
  assert.ok(
    lines.includes(
      '- **Added** · Theme customizer panel · Release approval gate',
    ),
  );
  assert.ok(lines.includes('- **Fixed** · Filter mode menu exit jump (F3)'));
  assert.equal(lines.filter((l) => l.startsWith('- ')).length, 2);
});

test('changelog: an Unreleased section without entries reads nothing yet', () => {
  const text =
    '## Unreleased\n\n### Added\n\n## 0.8.2 - 2026-11-06\n\n### Changed\n\n#### Old\n';
  const section = changelogSection(text);
  assert.ok(section.includes('Under `## Unreleased`: nothing yet'));
  assert.ok(!section.split('\n').some((l) => l.startsWith('- ')));
});

test('changelog: without Unreleased the top version section is read', () => {
  const text =
    '# Changelog\n\n## 0.9.0 - 2026-11-08\n\n### Changed\n\n#### Epic 01 Filtering\n\n#### Epic 02 Pagination\n\n## 0.8.2 - 2026-11-06\n\n### Fixed\n\n#### Old\n';
  const lines = changelogSection(text).split('\n');
  assert.ok(lines.includes('Under `## 0.9.0 - 2026-11-08`: Changed 2'));
  assert.ok(
    lines.includes('- **Changed** · Epic 01 Filtering · Epic 02 Pagination'),
  );
  assert.ok(!lines.some((l) => l.includes('Old')));
});

test('changelog: a missing file reads not found', () => {
  assert.ok(changelogSection(undefined).includes('Changelog: not found'));
});

test('recordsFromNeeds: every output record of every job, empty and invalid values skipped', () => {
  const out = (r) => JSON.stringify(r);
  const needs = {
    typecheck: {
      result: 'failure',
      outputs: {
        base: out(record('typecheck', { base: 'base' })),
        radix: out(record('typecheck', { base: 'radix', status: 'fail' })),
        aria: '',
      },
    },
    'docs-e2e': {
      result: 'success',
      outputs: {
        base: out(record('docs-e2e', { base: 'base' })),
        radix: '{not json',
        aria: out({ leg: 'aria' }),
      },
    },
    lint: { result: 'success', outputs: { record: out(record('lint')) } },
    'validate-pr': { result: 'skipped', outputs: {} },
    head: { result: 'success' },
  };
  const records = recordsFromNeeds(JSON.stringify(needs));
  assert.deepEqual(
    records.map((r) => [r.name, r.base, r.status]),
    [
      ['typecheck', 'base', 'pass'],
      ['typecheck', 'radix', 'fail'],
      ['docs-e2e', 'base', 'pass'],
      ['lint', undefined, 'pass'],
    ],
  );
});

test('recordsFromNeeds: an empty or invalid NEEDS reads no records', () => {
  assert.deepEqual(recordsFromNeeds(''), []);
  assert.deepEqual(recordsFromNeeds('{not json'), []);
  assert.deepEqual(recordsFromNeeds('null'), []);
});
