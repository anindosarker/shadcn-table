// Usage (repo root): node --test tools/release/record-output.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { capRecord, outputLine } from './record-output.mjs';

const record = (errors) => ({ name: 'lint', status: 'fail', errors });

test('capRecord keeps the first five of seven errors', () => {
  const errors = ['1', '2', '3', '4', '5', '6', '7'];
  assert.deepEqual(capRecord(record(errors)).errors, ['1', '2', '3', '4', '5']);
});

test('capRecord cuts a 401 character error to 399 characters and an ellipsis', () => {
  const [cut] = capRecord(record(['x'.repeat(401)])).errors;
  assert.equal(cut.length, 400);
  assert.equal(cut, `${'x'.repeat(399)}…`);
});

test('capRecord leaves a 400 character error untouched', () => {
  const error = 'y'.repeat(400);
  assert.deepEqual(capRecord(record([error])).errors, [error]);
});

test('capRecord returns a record without errors unchanged', () => {
  const plain = { name: 'lint', status: 'pass' };
  assert.equal(capRecord(plain), plain);
});

test('outputLine prints the key and the capped record as one JSON line', () => {
  const full = record(['1', '2', '3', '4', '5', '6', 'z'.repeat(401)]);
  const line = outputLine('base', full);
  assert.equal(line, `base=${JSON.stringify(capRecord(full))}`);
  assert.equal(line.includes('\n'), false);
  assert.equal(JSON.parse(line.slice('base='.length)).errors.length, 5);
});

test('outputLine prints nothing for a missing record', () => {
  assert.equal(outputLine('base', undefined), '');
});
