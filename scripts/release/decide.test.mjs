// Usage (repo root): node --test scripts/release/decide.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decide } from './decide.mjs';

const push = { EVENT: 'push', INPUT_VERSION: '', GITHUB_SHA: 'abc123' };
const deps = (over = {}) => ({
  version: '0.5.0',
  changelogStatus: () => 0,
  mergedLabel: () => '',
  tagged: () => false,
  ...over,
});

test('version: Unreleased lines, the merged PR label gives the level', () => {
  const calls = [];
  const result = decide(
    push,
    deps({
      mergedLabel: (sha) => {
        calls.push(sha);
        return 'release:patch';
      },
    }),
  );
  assert.deepEqual(calls, ['abc123']);
  assert.equal(result.code, 0);
  assert.equal(result.mode, 'version');
  assert.equal(result.version, '0.5.0');
  assert.equal(result.level, 'patch');
  assert.deepEqual(result.lines, [
    'merged PR label: release:patch',
    'mode=version version=0.5.0 level=patch',
  ]);
});

test('version: no label, or release:skip, leaves the level to the headings', () => {
  for (const label of ['', 'release:skip']) {
    const result = decide(push, deps({ mergedLabel: () => label }));
    assert.equal(result.mode, 'version', label);
    assert.equal(result.level, '', label);
    assert.equal(
      result.lines.at(-1),
      'mode=version version=0.5.0 level=from headings',
    );
  }
});

test('none: no Unreleased lines and the version is tagged', () => {
  const tags = [];
  const result = decide(
    push,
    deps({
      changelogStatus: () => 2,
      tagged: (tag) => {
        tags.push(tag);
        return true;
      },
    }),
  );
  assert.deepEqual(tags, ['v0.5.0']);
  assert.equal(result.mode, 'none');
  assert.deepEqual(result.lines, [
    'no Unreleased lines and v0.5.0 is already tagged; nothing to do',
    'mode=none version=0.5.0 level=from headings',
  ]);
});

test('release: no Unreleased lines and the version is untagged', () => {
  const result = decide(push, deps({ changelogStatus: () => 2 }));
  assert.equal(result.code, 0);
  assert.equal(result.mode, 'release');
  assert.equal(result.version, '0.5.0');
  assert.deepEqual(result.lines, [
    'mode=release version=0.5.0 level=from headings',
  ]);
});

test('release: a dispatch, with or without an input version', () => {
  const dispatch = { ...push, EVENT: 'workflow_dispatch' };
  const never = () => assert.fail('a dispatch reads nothing');
  const plain = decide(
    dispatch,
    deps({ changelogStatus: never, mergedLabel: never, tagged: never }),
  );
  assert.deepEqual([plain.mode, plain.version], ['release', '0.5.0']);
  const given = decide(
    { ...dispatch, INPUT_VERSION: '0.4.0' },
    deps({ changelogStatus: never, mergedLabel: never, tagged: never }),
  );
  assert.deepEqual([given.mode, given.version], ['release', '0.4.0']);
});

test('a malformed section passes the exit code through', () => {
  const result = decide(push, deps({ changelogStatus: () => 1 }));
  assert.deepEqual(result, { code: 1, lines: [] });
});
