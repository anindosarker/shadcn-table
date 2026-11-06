// Usage (repo root): node --test scripts/release/prepare.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { check, prepare, setVersion } from './prepare.mjs';

const changelog = (body) =>
  `# Changelog\n\nIntro.\n\n## Unreleased\n\n${body}\n## 0.8.0 - 2026-11-05\n\n### Added\n\n- Old line.\n`;
const now = () => new Date('2026-11-07T10:00:00Z');
const deps = (text, version = '0.8.0') => ({
  version,
  changelog: () => text,
  now,
});

test('setVersion replaces the one version line in place', () => {
  const text =
    '{\n  "name": "x",\n  "version": "0.8.0",\n  "private": true\n}\n';
  assert.equal(
    setVersion(text, '0.8.1'),
    '{\n  "name": "x",\n  "version": "0.8.1",\n  "private": true\n}\n',
  );
});

test('setVersion throws on zero or two version lines', () => {
  assert.throws(() => setVersion('{\n  "name": "x"\n}\n', '0.8.1'), /found 0/);
  assert.throws(
    () =>
      setVersion(
        '{\n  "version": "1.0.0",\n  "a": {\n    "version": "2.0.0"\n  }\n}\n',
        '0.8.1',
      ),
    /found 2/,
  );
});

test('prepare: the label level wins over the headings', () => {
  const text = changelog('### Changed\n\n- A line.\n');
  const result = prepare(['--level', 'patch'], deps(text));
  assert.equal(result.code, 0);
  assert.equal(result.next, '0.8.1');
  assert.equal(
    result.changelog,
    text.replace('## Unreleased', '## 0.8.1 - 2026-11-07'),
  );
});

test('prepare: without a level the headings decide', () => {
  const text = changelog(
    '### Fixed\n\n- A fix.\n\n### Added\n\n- A feature.\n',
  );
  const result = prepare([], deps(text));
  assert.equal(result.next, '0.9.0');
  assert.match(result.changelog, /^## 0\.9\.0 - 2026-11-07$/m);
  assert.doesNotMatch(result.changelog, /^## Unreleased/m);
});

test('prepare: exit 2 without Unreleased lines', () => {
  for (const text of [
    changelog(''),
    '# Changelog\n\n## 0.8.0 - 2026-11-05\n',
  ]) {
    for (const argv of [[], ['--level', 'patch']]) {
      const result = prepare(argv, deps(text));
      assert.equal(result.code, 2);
      assert.match(result.err, /no lines under ## Unreleased/);
    }
  }
});

test('prepare: exit 1 on a bad level, an unknown argument or a malformed section', () => {
  const text = changelog('### Changed\n\n- A line.\n');
  assert.equal(prepare(['--level', 'huge'], deps(text)).code, 1);
  assert.equal(prepare(['--force'], deps(text)).code, 1);
  const bad = prepare([], deps(changelog('- A line without heading.\n')));
  assert.equal(bad.code, 1);
  assert.match(bad.err, /^prepare: /);
});

test('check: bumped, not bumped, inconsistent', () => {
  const bumped = check({
    version: '0.8.1',
    baseVersion: '0.8.0',
    changelog: () =>
      '# Changelog\n\n## 0.8.1 - 2026-11-07\n\n### Changed\n\n- A line.\n',
  });
  assert.deepEqual(bumped, {
    code: 0,
    line: 'already bumped: 0.8.1 (master 0.8.0)',
  });
  const pending = check({
    version: '0.8.0',
    baseVersion: '0.8.0',
    changelog: () => changelog('### Changed\n\n- A line.\n'),
  });
  assert.equal(pending.code, 2);
  const inconsistent = check({
    version: '0.8.0',
    baseVersion: '0.8.0',
    changelog: () => changelog(''),
  });
  assert.equal(inconsistent.code, 1);
  assert.match(inconsistent.line, /^inconsistent/);
  const malformed = check({
    version: '0.8.1',
    baseVersion: '0.8.0',
    changelog: () => changelog('- A line without heading.\n'),
  });
  assert.equal(malformed.code, 1);
});
