#!/usr/bin/env node
/**
 * Static Storybook gate for the base switch (.storybook/base-tool.ts): with the
 * three builds served from one directory (`storybook:build:base`,
 * `storybook:build:radix` and `storybook:build:aria` into
 * storybook-static/base/, storybook-static/radix/ and storybook-static/aria/),
 * each base's toolbar shows one Base select labelled with its own base; opened,
 * it lists every base in BASES order, its own one selected, and choosing
 * another opens the same story there. One more check, for the production host:
 * the root redirects to the default base's build with the query kept
 * (vercel.json). A plain static server answers the root with 200 or 404
 * instead; the check is then skipped.
 *
 * Usage (a static server must be running, for example
 * `pnpm serve storybook-static -l 5344`):
 *   node scripts/check-storybook.mjs [--url http://localhost:5344]
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_BASE, BASE_LABELS, BASES } from './registry/bases.mjs';

const PKG_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const require = createRequire(path.join(PKG_DIR, 'node_modules', '/'));
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const i = args.indexOf('--url');
const origin = (i === -1 ? 'http://localhost:5344' : args[i + 1]).replace(
  /\/$/,
  '',
);

/**
 * First story id of the default base's build; every build shares the story
 * set.
 */
const indexFile = path.join(
  PKG_DIR,
  'storybook-static',
  DEFAULT_BASE,
  'index.json',
);
const index = JSON.parse(await readFile(indexFile, 'utf8'));
const storyId = Object.values(index.entries).find(
  (e) => e.type === 'story',
)?.id;
if (!storyId) {
  console.error(`no story in ${path.relative(PKG_DIR, indexFile)}`);
  process.exit(1);
}

/**
 * Each base: the label its select shows and where its build is served (every
 * base under <base>/).
 */
const bases = BASES.map((name) => ({
  name,
  label: BASE_LABELS[name],
  root: `${origin}/${name}/`,
}));

const results = [];

// The root redirect (vercel.json, storybook host): `/?path=...` answers 3xx
// with a Location of `/<DEFAULT_BASE>/?path=...`. A static server has no
// redirects, so a 200 or 404 at the root skips the check instead of failing.
{
  const query = `?path=/story/${storyId}`;
  const res = await fetch(`${origin}/${query}`, { redirect: 'manual' });
  if (res.status >= 300 && res.status < 400) {
    const location = new URL(res.headers.get('location') ?? '', origin);
    const ok =
      location.pathname === `/${DEFAULT_BASE}/` && location.search === query;
    results.push(
      `${ok ? 'PASS' : 'FAIL'} root redirects to /${DEFAULT_BASE}/ with the query kept ${res.status} ${location.href}`,
    );
  } else {
    results.push(
      `SKIP root redirect (status ${res.status}, no redirect on this server)`,
    );
  }
}
const browser = await chromium.launch();
for (const { name, label, root } of bases) {
  const check = (what, ok, extra = '') =>
    results.push(
      `${ok ? 'PASS' : 'FAIL'} ${name} ${what}${extra ? ' ' + extra : ''}`,
    );
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${root}?path=/story/${storyId}`, {
    waitUntil: 'networkidle',
  });
  // Storybook's Select names its trigger `<ariaLabel> <selected title>`.
  const trigger = page.locator(
    'button[aria-haspopup="listbox"][aria-label^="Base"]',
  );
  await trigger.waitFor({ timeout: 30000 }).catch(() => {});
  check(
    'one base select showing the current base',
    (await trigger.count()) === 1 &&
      (await trigger.textContent())?.trim() === label,
    (await trigger.count()) ? await trigger.textContent() : '0',
  );
  if ((await trigger.count()) !== 1) {
    await page.close();
    continue;
  }
  await trigger.click();
  const options = page.locator(
    '[role="listbox"][aria-label="Base"] [role="option"]',
  );
  await options
    .first()
    .waitFor({ timeout: 5000 })
    .catch(() => {});
  const titles = (await options.allTextContents()).map((t) => t.trim());
  check(
    'menu lists the bases in order',
    titles.join(',') === bases.map((base) => base.label).join(','),
    titles.join(', '),
  );
  const selected = page.locator(
    '[role="listbox"][aria-label="Base"] [role="option"][aria-selected="true"]',
  );
  check(
    'current base selected',
    (await selected.count()) === 1 &&
      (await selected.textContent())?.trim() === label,
  );
  // Choosing the next base opens the same story in its build.
  const other =
    bases[(bases.findIndex((e) => e.name === name) + 1) % bases.length];
  await Promise.all([
    page
      .waitForURL((url) => url.href.startsWith(other.root), { timeout: 30000 })
      .catch(() => {}),
    options.filter({ hasText: other.label }).click(),
  ]);
  const href = new URL(page.url());
  check(
    `choosing ${other.name} opens the base`,
    `${href.origin}${href.pathname}` === other.root,
    href.href,
  );
  check(
    `choosing ${other.name} keeps the story`,
    href.searchParams.get('path') === `/story/${storyId}`,
    href.search,
  );
  await page.goto(`${root}?path=/story/${storyId}`, {
    waitUntil: 'networkidle',
  });
  check(
    'manager title mentions the base',
    (await page.title()).includes(label) ||
      (await page.locator(`text=shadcn-table (${label})`).count()) > 0,
  );
  check('no page errors', errors.length === 0, errors[0] ?? '');
  await page.close();
}
await browser.close();

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
const skipped = results.filter((r) => r.startsWith('SKIP')).length;
console.log(
  `\n${results.length - failed - skipped} passed, ${failed} failed, ${skipped} skipped`,
);
process.exit(failed ? 1 : 0);
