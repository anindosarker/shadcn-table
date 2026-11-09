#!/usr/bin/env node
// Usage (repo root, the record step of every test job in .github/workflows/,
// after its `pnpm test <name> --ci` step):
//   node tools/release/record-output.mjs --key <key> >> "$GITHUB_OUTPUT"
//
// Prints the job's test record as one job output line (D38):
// `<key>=<compact JSON>`, `<key>` being the base, the scenario or `record`.
// The record is the one test/.out/*.json (the newest when several), its
// `errors` cut to the first five, each at most 400 characters (an `…` ends
// a cut entry), so nineteen records stay far below the output and env
// limits. No record file: prints nothing and exits 0 (PR Summary shows the
// job skipped). Writes no file and reads no GITHUB_OUTPUT itself: the shell
// redirect appends the line, so the same command runs under act and in a
// local shell.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
export const MAX_ERRORS = 5;
export const MAX_ERROR_LENGTH = 400;

/** The record with `errors` capped: five entries, 400 characters each. */
export const capRecord = (record) => {
  if (!Array.isArray(record.errors)) return record;
  return {
    ...record,
    errors: record.errors
      .slice(0, MAX_ERRORS)
      .map((e) =>
        String(e).length > MAX_ERROR_LENGTH
          ? `${String(e).slice(0, MAX_ERROR_LENGTH - 1)}…`
          : String(e),
      ),
  };
};

/** The newest test/.out/*.json under `dir`, parsed, or undefined. */
export const newestRecord = (dir) => {
  if (!fs.existsSync(dir)) return undefined;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.join(dir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  for (const file of files) {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      // an unreadable file: the next newest
    }
  }
  return undefined;
};

/** `<key>=<compact capped record>`, or '' without a record. */
export const outputLine = (key, record) =>
  record ? `${key}=${JSON.stringify(capRecord(record))}` : '';

const main = () => {
  const at = process.argv.indexOf('--key');
  const key = at === -1 ? undefined : process.argv[at + 1];
  if (!key || !/^[A-Za-z0-9_-]+$/.test(key)) {
    console.error('record-output: --key <base|scenario|record> is required');
    process.exit(1);
  }
  const line = outputLine(key, newestRecord(path.join(ROOT, 'test', '.out')));
  if (line) console.log(line);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
