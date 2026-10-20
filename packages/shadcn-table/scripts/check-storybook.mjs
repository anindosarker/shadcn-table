#!/usr/bin/env node
/**
 * Static Storybook gate for the edition button (.storybook/edition-tool.ts):
 * with both builds served from one directory (`storybook:build`, then
 * `storybook:build:base` into storybook-static/base/), each edition's toolbar
 * shows a link labelled with the other edition that opens the same story
 * there.
 *
 * Usage (a static server must be running, for example
 * `pnpm serve storybook-static -l 5344`):
 *   node scripts/check-storybook.mjs [--base http://localhost:5344]
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

/** First story id of the Radix UI build; both builds share the story set. */
const index = JSON.parse(
  await readFile(path.join(PKG_DIR, 'storybook-static', 'index.json'), 'utf8'),
);
const storyId = Object.values(index.entries).find(
  (e) => e.type === 'story',
)?.id;
if (!storyId) {
  console.error('no story in storybook-static/index.json');
  process.exit(1);
}

/** Each edition: its root, the label the button shows, where it must go. */
const editions = [
  {
    name: 'radix',
    root: `${base}/`,
    label: 'Base UI',
    target: `${base}/base/`,
  },
  {
    name: 'base',
    root: `${base}/base/`,
    label: 'Radix UI',
    target: `${base}/`,
  },
];

const results = [];
const browser = await chromium.launch();
for (const { name, root, label, target } of editions) {
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
  const link = page.locator('[data-edition-link]');
  await link.waitFor({ timeout: 30000 }).catch(() => {});
  check(
    'edition button',
    (await link.count()) === 1,
    String(await link.count()),
  );
  if (await link.count()) {
    check(
      'label',
      (await link.textContent())?.trim() === label,
      await link.textContent(),
    );
    check('target _top', (await link.getAttribute('target')) === '_top');
    const href = new URL(await link.evaluate((a) => a.href));
    check(
      'other edition',
      `${href.origin}${href.pathname}` === target,
      href.href,
    );
    check(
      'story id preserved',
      href.searchParams.get('path') === `/story/${storyId}`,
      href.search,
    );
    check(
      'title mentions the edition',
      ((await link.getAttribute('title')) ?? '').includes(label),
    );
  }
  check('no page errors', errors.length === 0, errors[0] ?? '');
  await page.close();
}
await browser.close();

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
