// Usage (repo root): node --test tools/release/check-release.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decide } from './check-release.mjs';

const push = { EVENT: 'push', INPUT_VERSION: '', GITHUB_SHA: 'abc123' };
const deps = (over = {}) => ({
  version: '0.5.0',
  changelogStatus: () => 0,
  tagged: () => false,
  ...over,
});

test('none: Unreleased lines on master warn and release nothing', () => {
  const never = () => assert.fail('lines on master read no tag');
  const result = decide(push, deps({ tagged: never }));
  assert.equal(result.code, 0);
  assert.equal(result.mode, 'none');
  assert.equal(result.version, '0.5.0');
  assert.deepEqual(result.lines, [
    '::warning::CHANGELOG.md has ## Unreleased lines on master: merged without the version bump; nothing released',
    'mode=none version=0.5.0',
  ]);
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
    'mode=none version=0.5.0',
  ]);
});

test('release: no Unreleased lines and the version is untagged', () => {
  const result = decide(push, deps({ changelogStatus: () => 2 }));
  assert.equal(result.code, 0);
  assert.equal(result.mode, 'release');
  assert.equal(result.version, '0.5.0');
  assert.deepEqual(result.lines, ['mode=release version=0.5.0']);
});

test('release: a dispatch, with or without an input version', () => {
  const dispatch = { ...push, EVENT: 'workflow_dispatch' };
  const never = () => assert.fail('a dispatch reads nothing');
  const plain = decide(
    dispatch,
    deps({ changelogStatus: never, tagged: never }),
  );
  assert.deepEqual([plain.mode, plain.version], ['release', '0.5.0']);
  const given = decide(
    { ...dispatch, INPUT_VERSION: '0.4.0' },
    deps({ changelogStatus: never, tagged: never }),
  );
  assert.deepEqual([given.mode, given.version], ['release', '0.4.0']);
});

test('a malformed section passes the exit code through', () => {
  const result = decide(push, deps({ changelogStatus: () => 1 }));
  assert.deepEqual(result, { code: 1, lines: [] });
});
