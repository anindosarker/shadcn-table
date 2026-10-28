#!/usr/bin/env node
/**
 * Static Storybook gate for the edition switch (.storybook/edition-tool.ts):
 * with the three builds served from one directory (`storybook:build`,
 * `storybook:build:base` and `storybook:build:aria` into
 * storybook-static/radix/, storybook-static/base/ and storybook-static/aria/),
 * each edition's toolbar marks its own edition and shows one link per other
 * edition, labelled with it, that opens the same story there. One more
 * check, for the production host: the root redirects to the default
 * edition's build with the query kept (vercel.json). A plain static server
 * answers the root with 200 or 404 instead; the check is then skipped.
 *
 * Usage (a static server must be running, for example
 * `pnpm serve storybook-static -l 5344`):
 *   node scripts/check-storybook.mjs [--base http://localhost:5344]
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_EDITION,
  EDITION_LABELS,
  EDITIONS,
} from './registry/editions.mjs';

const PKG_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const require = createRequire(path.join(PKG_DIR, 'node_modules', '/'));
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const i = args.indexOf('--base');
const base = (i === -1 ? 'http://localhost:5344' : args[i + 1]).replace(
  /\/$/,
  '',
);

/** First story id of the default edition's build; every build shares the story set. */
const indexFile = path.join(
  PKG_DIR,
  'storybook-static',
  DEFAULT_EDITION,
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
 * Each edition: the label its button shows and where its build is served
 * (every edition under <edition>/).
 */
const editions = EDITIONS.map((name) => ({
  name,
  label: EDITION_LABELS[name],
  root: `${base}/${name}/`,
}));

const results = [];

// The root redirect (vercel.json, storybook host): `/?path=...` answers 3xx
// with a Location of `/<DEFAULT_EDITION>/?path=...`. A static server has no
// redirects, so a 200 or 404 at the root skips the check instead of failing.
{
  const query = `?path=/story/${storyId}`;
  const res = await fetch(`${base}/${query}`, { redirect: 'manual' });
  if (res.status >= 300 && res.status < 400) {
    const location = new URL(res.headers.get('location') ?? '', base);
    const ok =
      location.pathname === `/${DEFAULT_EDITION}/` && location.search === query;
    results.push(
      `${ok ? 'PASS' : 'FAIL'} root redirects to /${DEFAULT_EDITION}/ with the query kept ${res.status} ${location.href}`,
    );
  } else {
    results.push(
      `SKIP root redirect (status ${res.status}, no redirect on this server)`,
    );
  }
}
const browser = await chromium.launch();
for (const { name, label, root } of editions) {
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
  const current = page.locator('[data-edition-current]');
  await current.waitFor({ timeout: 30000 }).catch(() => {});
  check(
    'current edition marked',
    (await current.count()) === 1 &&
      (await current.textContent())?.trim() === label &&
      (await current.getAttribute('aria-current')) === 'page',
    (await current.count()) ? await current.textContent() : '0',
  );
  const others = editions.filter((edition) => edition.name !== name);
  check(
    'one link per other edition',
    (await page.locator('[data-edition-link]').count()) === others.length,
    String(await page.locator('[data-edition-link]').count()),
  );
  for (const other of others) {
    const link = page.locator(`[data-edition-link="${other.name}"]`);
    const what = (text) => `${other.name} link ${text}`;
    if ((await link.count()) !== 1) {
      check(what('present'), false, String(await link.count()));
      continue;
    }
    check(
      what('label'),
      (await link.textContent())?.trim() === other.label,
      await link.textContent(),
    );
    check(what('target _top'), (await link.getAttribute('target')) === '_top');
    const href = new URL(await link.evaluate((a) => a.href));
    check(
      what('opens the edition'),
      `${href.origin}${href.pathname}` === other.root,
      href.href,
    );
    check(
      what('story id preserved'),
      href.searchParams.get('path') === `/story/${storyId}`,
      href.search,
    );
    check(
      what('title mentions the edition'),
      ((await link.getAttribute('title')) ?? '').includes(other.label),
    );
  }
  check(
    'manager title mentions the edition',
    (await page.title()).includes(label) ||
      (await page.locator(`text=shadcn-table (${label})`).count()) > 0,
  );
  check('no page errors', errors.length === 0, errors[0] ?? '');
  await page.close();
}
await browser.close();

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
