#!/usr/bin/env node
// Usage (repo root): node scripts/release/smoke.mjs
//
// Production smoke for .github/workflows/release.yml, Node fetch only. Every
// check runs; the script prints one PASS or FAIL line per check and exits
// non-zero when any failed. Checks, against www.shadcn-table.com and
// storybook.shadcn-table.com:
//   /r/<edition>/shadcn-table.json for every edition (EDITIONS in
//     packages/shadcn-table/scripts/registry/lib.mjs): 200, `dependencies`
//     carries the @tanstack/react-table pin of packages/shadcn-table/package.json
//   /r/<edition>/registry.json for every edition: the item names are exactly
//     the ones hosted.mjs derives from the committed catalogs (the main item as
//     shadcn-table, its locales as shadcn-table-locale-<code>, every example
//     item of the docs app)
//   Storybook / for the reference edition, /<edition>/ for every other: 200 HTML
//   /SKILL.md: 200, names every edition (EDITION_LABELS)
//   /llms.txt: 200
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  EDITION_LABELS,
  EDITIONS,
  editionItems,
  REFERENCE_EDITION,
} from '../../packages/shadcn-table/scripts/registry/lib.mjs';

const SITE = 'https://www.shadcn-table.com';
const STORYBOOK = 'https://storybook.shadcn-table.com';
const HOSTED_NAME = 'shadcn-table';
const DOCS_PACKAGE_NAME = 'shadcn-table-docs';
const LABELS = EDITIONS.map((edition) => EDITION_LABELS[edition]);

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
const readJson = (rel) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));

/** The docs app folder, found by package name so a folder rename does not matter. */
const docsDir = () => {
  for (const dir of fs.readdirSync(path.join(ROOT, 'apps'))) {
    const pkg = path.join('apps', dir, 'package.json');
    if (!fs.existsSync(path.join(ROOT, pkg))) continue;
    if (readJson(pkg).name === DOCS_PACKAGE_NAME) return path.join('apps', dir);
  }
  console.error(`smoke: no apps/*/package.json named ${DOCS_PACKAGE_NAME}`);
  process.exit(1);
};

const libraryPackage = readJson('packages/shadcn-table/package.json');
const library = readJson('packages/shadcn-table/registry.json');
const examples = readJson(path.join(docsDir(), 'registry.json'));
const tanstackPin = `@tanstack/react-table@${libraryPackage.dependencies['@tanstack/react-table']}`;

/** The item names hosted.mjs writes into /r/<edition>/registry.json. */
const expectedItems = (edition) => {
  const { main, locales: committed } = editionItems(library, edition);
  const localePrefix = `${main?.name}-locale-`;
  const locales = committed.map(
    (item) => `${HOSTED_NAME}-locale-${item.name.slice(localePrefix.length)}`,
  );
  return [HOSTED_NAME, ...locales, ...examples.items.map((item) => item.name)];
};

const results = [];
const check = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ` ${extra}` : ''}`);
};

/** GET once; a thrown fetch error becomes a failed check, not a crash. */
const get = async (url) => {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    return { res, text: await res.text() };
  } catch (error) {
    return { res: null, text: '', error: String(error?.cause ?? error) };
  }
};

const parseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const checkStatus = (name, { res, error }, expectedType) => {
  const type = res?.headers.get('content-type') ?? '';
  const ok =
    res?.status === 200 && (!expectedType || type.includes(expectedType));
  check(name, ok, res ? `status=${res.status} type=${type}` : `error=${error}`);
  return ok;
};

/** Sorted-list difference, both ways, for the catalog check. */
const diff = (expected, actual) => {
  const missing = expected.filter((n) => !actual.includes(n));
  const extra = actual.filter((n) => !expected.includes(n));
  return [
    missing.length ? `missing=${missing.join(',')}` : '',
    extra.length ? `extra=${extra.join(',')}` : '',
  ]
    .filter(Boolean)
    .join(' ');
};

for (const edition of EDITIONS) {
  const itemUrl = `${SITE}/r/${edition}/${HOSTED_NAME}.json`;
  const item = await get(itemUrl);
  if (checkStatus(`${itemUrl} 200 JSON`, item, 'json')) {
    const deps = parseJson(item.text)?.dependencies ?? [];
    check(
      `${itemUrl} dependencies pin ${tanstackPin}`,
      deps.includes(tanstackPin),
      `dependencies=${deps.join(' ')}`,
    );
  }

  const catalogUrl = `${SITE}/r/${edition}/registry.json`;
  const catalog = await get(catalogUrl);
  if (checkStatus(`${catalogUrl} 200 JSON`, catalog, 'json')) {
    const expected = expectedItems(edition).sort();
    const actual = (parseJson(catalog.text)?.items ?? [])
      .map((i) => i.name)
      .sort();
    const same =
      expected.length === actual.length &&
      expected.every((n, i) => n === actual[i]);
    check(
      `${catalogUrl} lists the ${expected.length} committed items`,
      same,
      same ? '' : `actual=${actual.length} ${diff(expected, actual)}`,
    );
  }
}

// Radix at the Storybook root, every other edition under /<edition>/.
for (const edition of EDITIONS) {
  const url = `${STORYBOOK}/${edition === REFERENCE_EDITION ? '' : `${edition}/`}`;
  checkStatus(`${url} 200 HTML`, await get(url), 'text/html');
}

const skillUrl = `${SITE}/SKILL.md`;
const skill = await get(skillUrl);
if (checkStatus(`${skillUrl} 200`, skill)) {
  const missing = LABELS.filter((label) => !skill.text.includes(label));
  check(
    `${skillUrl} names ${LABELS.join(', ')}`,
    missing.length === 0,
    missing.length ? `missing=${missing.join(',')}` : '',
  );
}

checkStatus(`${SITE}/llms.txt 200`, await get(`${SITE}/llms.txt`));

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
