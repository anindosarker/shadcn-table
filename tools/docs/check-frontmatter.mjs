#!/usr/bin/env node
// Checks the docs frontmatter and copy rules of spec 31 (D60) over
// apps/shadcn-table-docs/content/docs/**/*.mdx, or the folder or file given
// as the first argument. Prints one line per rule with its count and the
// offending paths; exits 1 when any count is above 0.
//
//   node tools/docs/check-frontmatter.mjs [path]

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '../..');
const target = resolve(
  process.cwd(),
  process.argv[2] ?? join(repoRoot, 'apps/shadcn-table-docs/content/docs'),
);

const DESCRIPTION_MIN = 120;
const DESCRIPTION_MAX = 155;
const MIN_WORDS = 150;
const TYPO = /use use|example show how|Shadcn Table example/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function walk(path) {
  if (statSync(path).isFile()) return path.endsWith('.mdx') ? [path] : [];
  return readdirSync(path, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => walk(join(path, entry.name)));
}

/** Reads the flat `key: value` lines of a frontmatter block. */
function parseFrontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) return { data: {}, body: source };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!field) continue;
    let value = field[2].trim();
    if (value.startsWith("'") && value.endsWith("'") && value.length > 1) {
      value = value.slice(1, -1).replaceAll("''", "'");
    } else if (
      value.startsWith('"') &&
      value.endsWith('"') &&
      value.length > 1
    ) {
      value = JSON.parse(value);
    }
    data[field[1]] = value;
  }
  return { data, body: source.slice(match[0].length) };
}

/** Words of prose: code fences, imports, JSX tags and link targets removed. */
function countWords(body) {
  const prose = body
    .replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, ' ')
    .replace(/^(import|export)\s.*$/gm, ' ')
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    .replace(/\]\([^)]*\)/g, ' ');
  return prose.split(/\s+/).filter((token) => /[A-Za-z0-9]/.test(token)).length;
}

const files = walk(target);
const rules = {
  'description outside 120 to 155 characters': [],
  'missing or malformed date': [],
  'duplicate description': [],
  'under 150 words': [],
  'typo match': [],
};
const byDescription = new Map();

for (const file of files) {
  const path = relative(repoRoot, file);
  const source = readFileSync(file, 'utf8');
  const { data, body } = parseFrontmatter(source);
  const description = data.description ?? '';

  if (
    description.length < DESCRIPTION_MIN ||
    description.length > DESCRIPTION_MAX
  ) {
    rules['description outside 120 to 155 characters'].push(
      `${path} (${description.length})`,
    );
  }
  if (!DATE.test(data.date ?? ''))
    rules['missing or malformed date'].push(path);
  if (description) {
    byDescription.set(description, [
      ...(byDescription.get(description) ?? []),
      path,
    ]);
  }
  const words = countWords(body);
  if (words < MIN_WORDS) rules['under 150 words'].push(`${path} (${words})`);
  if (TYPO.test(description) || TYPO.test(body)) rules['typo match'].push(path);
}

for (const paths of byDescription.values()) {
  if (paths.length > 1) rules['duplicate description'].push(paths.join(' = '));
}

let failed = false;
console.log(`${files.length} pages under ${relative(repoRoot, target) || '.'}`);
for (const [rule, offenders] of Object.entries(rules)) {
  console.log(`${rule}: ${offenders.length}`);
  for (const offender of offenders) console.log(`  ${offender}`);
  if (offenders.length > 0) failed = true;
}
process.exit(failed ? 1 : 0);
