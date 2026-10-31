#!/usr/bin/env node
// Usage (repo root): node scripts/release/smoke.mjs
//
// Production smoke for .github/workflows/release.yml, Node fetch only. Every
// check runs; the script prints one PASS or FAIL line per check and exits
// non-zero when any failed. Checks, against www.shadcn-table.com and
// storybook.shadcn-table.com:
//   /r/<base>/shadcn-table.json for every base (BASES in
//     packages/shadcn-table/scripts/registry/lib.mjs): 200, `dependencies`
//     carries lucide-react (the Lucide icon set item) and
//     `registryDependencies` names the core item
//   /r/<base>/shadcn-table-core.json for every base: 200, `dependencies`
//     carries the @tanstack/react-table pin of packages/shadcn-table/package.json
//   /r/<base>/registry.json for every base: the item names are exactly
//     the ones hosted.mjs derives from the committed catalogs (the main item as
//     shadcn-table, the core item as shadcn-table-core, the icon sets as
//     shadcn-table-<library>, its locales as shadcn-table-locale-<code>, the
//     base's example items of the docs app as example-<slug>)
//   Storybook /<base>/ for every base: 200 HTML; / redirects to
//     /<DEFAULT_BASE>/ with the query kept (the vercel.json redirect)
//   /SKILL.md: 200, names every base (BASE_LABELS)
//   /llms.txt: 200
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_BASE,
  BASE_LABELS,
  BASES,
  baseExampleItems,
  baseItems,
} from '../../packages/shadcn-table/scripts/registry/lib.mjs';

const SITE = 'https://www.shadcn-table.com';
const STORYBOOK = 'https://storybook.shadcn-table.com';
const HOSTED_NAME = 'shadcn-table';
const CORE_NAME = `${HOSTED_NAME}-core`;
const ICON_SETS = ['tabler', 'phosphor', 'hugeicons', 'remixicon'];
const DOCS_PACKAGE_NAME = 'shadcn-table-docs';
const LABELS = BASES.map((base) => BASE_LABELS[base]);

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

/** The item names hosted.mjs writes into /r/<base>/registry.json. */
const expectedItems = (base) => {
  const { main, locales: committed } = baseItems(library, base);
  const localePrefix = `${main?.name}-locale-`;
  const locales = committed.map(
    (item) => `${HOSTED_NAME}-locale-${item.name.slice(localePrefix.length)}`,
  );
  return [
    HOSTED_NAME,
    CORE_NAME,
    ...ICON_SETS.map((library) => `${HOSTED_NAME}-${library}`),
    ...locales,
    ...baseExampleItems(examples, base).map((item) => item.name),
  ];
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

for (const base of BASES) {
  const itemUrl = `${SITE}/r/${base}/${HOSTED_NAME}.json`;
  const item = await get(itemUrl);
  if (checkStatus(`${itemUrl} 200 JSON`, item, 'json')) {
    const parsed = parseJson(item.text);
    const deps = parsed?.dependencies ?? [];
    const registryDeps = parsed?.registryDependencies ?? [];
    check(
      `${itemUrl} dependencies carry lucide-react`,
      deps.includes('lucide-react'),
      `dependencies=${deps.join(' ')}`,
    );
    check(
      `${itemUrl} registryDependencies name ${CORE_NAME}`,
      registryDeps.some((dep) => dep.endsWith(`/${CORE_NAME}.json`)),
      `registryDependencies=${registryDeps.join(' ')}`,
    );
  }

  const coreUrl = `${SITE}/r/${base}/${CORE_NAME}.json`;
  const core = await get(coreUrl);
  if (checkStatus(`${coreUrl} 200 JSON`, core, 'json')) {
    const deps = parseJson(core.text)?.dependencies ?? [];
    check(
      `${coreUrl} dependencies pin ${tanstackPin}`,
      deps.includes(tanstackPin),
      `dependencies=${deps.join(' ')}`,
    );
  }

  const catalogUrl = `${SITE}/r/${base}/registry.json`;
  const catalog = await get(catalogUrl);
  if (checkStatus(`${catalogUrl} 200 JSON`, catalog, 'json')) {
    const expected = expectedItems(base).sort();
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

// Every base under /<base>/; the root redirects to the default base
// (vercel.json), query string included.
for (const base of BASES) {
  const url = `${STORYBOOK}/${base}/`;
  checkStatus(`${url} 200 HTML`, await get(url), 'text/html');
}
{
  const query = '?path=/story/x';
  const url = `${STORYBOOK}/${query}`;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const location = new URL(res.headers.get('location') ?? '', STORYBOOK);
    check(
      `${url} redirects to /${DEFAULT_BASE}/${query}`,
      res.status >= 300 &&
        res.status < 400 &&
        location.pathname === `/${DEFAULT_BASE}/` &&
        // Vercel percent-encodes the forwarded query value
        // (`?path=%2Fstory%2Fx`), so compare the decoded parameter.
        location.searchParams.get('path') === '/story/x',
      `status=${res.status} location=${location.href}`,
    );
  } catch (error) {
    check(
      `${url} redirects to /${DEFAULT_BASE}/${query}`,
      false,
      `error=${String(error?.cause ?? error)}`,
    );
  }
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
