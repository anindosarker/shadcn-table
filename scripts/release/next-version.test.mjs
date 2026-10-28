// Usage (repo root): node --test scripts/release/next-version.test.mjs
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { bump, levelFromChangelog, run } from './next-version.mjs';

const changelog = (body) =>
  `# Changelog\n\nIntro.\n\n## Unreleased\n\n${body}\n## 0.5.0 - 2026-10-28\n\n### Added\n\n- Old line.\n`;
const cli = (argv, version, text) =>
  run(argv, { version, changelog: () => text });

test('bump by level', () => {
  assert.equal(bump('0.5.0', 'patch'), '0.5.1');
  assert.equal(bump('0.5.0', 'minor'), '0.6.0');
  assert.equal(bump('0.5.0', 'major'), '1.0.0');
  assert.equal(bump('1.2.3', 'major'), '2.0.0');
  assert.equal(bump('1.0.0-rc.1', 'patch'), '1.0.0');
});

test('each heading while 0.x', () => {
  for (const [heading, next] of [
    ['Breaking', '0.6.0'],
    ['Removed', '0.6.0'],
    ['Added', '0.6.0'],
    ['Changed', '0.6.0'],
    ['Fixed', '0.5.1'],
    ['Docs', '0.5.1'],
  ]) {
    const text = changelog(`### ${heading}\n\n- A line.\n`);
    assert.deepEqual(
      cli([], '0.5.0', text),
      { code: 0, out: `${next}\n` },
      heading,
    );
  }
});

test('the highest heading wins; Breaking is major from 1.0', () => {
  const text = changelog(
    '### Fixed\n\n- A fix.\n\n### Breaking\n\n- A break.\n',
  );
  assert.equal(levelFromChangelog(text, 0), 'minor');
  assert.deepEqual(cli([], '1.2.3', text), { code: 0, out: '2.0.0\n' });
  assert.deepEqual(cli([], '1.2.3', changelog('### Added\n\n- A feature.\n')), {
    code: 0,
    out: '1.3.0\n',
  });
});

test('a heading with no lines does not count', () => {
  const text = changelog('### Added\n\n### Fixed\n\n- A fix.\n');
  assert.deepEqual(cli([], '0.5.0', text), { code: 0, out: '0.5.1\n' });
});

test('no section or no lines exits 2 with nothing printed', () => {
  const none = '# Changelog\n\n## 0.5.0 - 2026-10-28\n\n### Added\n\n- Old.\n';
  assert.deepEqual(cli([], '0.5.0', none), { code: 2, out: '' });
  assert.deepEqual(cli(['--from-changelog'], '0.5.0', changelog('')), {
    code: 2,
    out: '',
  });
  assert.deepEqual(
    cli(
      ['--level', 'minor', '--from-changelog'],
      '0.5.0',
      changelog('### Added\n'),
    ),
    { code: 2, out: '' },
  );
});

test('the label level wins over the headings', () => {
  const text = changelog('### Fixed\n\n- A fix.\n');
  assert.deepEqual(
    cli(['--level', 'minor', '--from-changelog'], '0.5.0', text),
    {
      code: 0,
      out: '0.6.0\n',
    },
  );
  assert.deepEqual(cli(['--level', 'major'], '0.5.0', ''), {
    code: 0,
    out: '1.0.0\n',
  });
});

test('bad input exits 1', () => {
  assert.equal(cli(['--level', 'huge'], '0.5.0', '').code, 1);
  assert.equal(cli(['--nope'], '0.5.0', '').code, 1);
  assert.equal(cli([], '0.5.0', changelog('### Misc\n\n- A line.\n')).code, 1);
  assert.equal(cli([], '0.5.0', changelog('- A stray line.\n')).code, 1);
});

test('the CLI reads the library version', () => {
  const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
  );
  const { version } = JSON.parse(
    fs.readFileSync(
      path.join(root, 'packages/shadcn-table/package.json'),
      'utf8',
    ),
  );
  const out = execFileSync(
    process.execPath,
    [path.join(root, 'scripts/release/next-version.mjs'), '--level', 'patch'],
    { encoding: 'utf8' },
  );
  assert.equal(out, `${bump(version, 'patch')}\n`);
});
