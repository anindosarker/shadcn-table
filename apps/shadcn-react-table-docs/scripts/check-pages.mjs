#!/usr/bin/env node
/**
 * Dev-server page gate: loads docs pages in headless Chromium at desktop and
 * mobile widths and fails on any console.error or uncaught page error, in
 * particular React hydration mismatches (which only print in `next dev`).
 * Per-page assertions live in PAGE_CHECKS; add an entry for every new page
 * that renders live examples or prop tables.
 *
 * Usage (dev server must be running, default http://localhost:5320):
 *   node scripts/check-pages.mjs [--base http://localhost:5321]
 *     [--widths 1440,700] [--shots <dir>] [/docs/path ...]
 *
 * Playwright is resolved from apps/test-shadcn/.playwright/node_modules.
 */
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const require = createRequire(
  path.join(APP_DIR, '..', 'test-shadcn', '.playwright', 'node_modules', '/'),
);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const [v] = args.splice(i, 2).slice(1);
  return v;
};
const base = opt('base', 'http://localhost:5320');
const widths = opt('widths', '1440,700').split(',').map(Number);
const shots = opt('shots', '');

/** Console errors that always fail the gate, whatever the page. */
const FATAL = [/hydrat/i, /Minified React error/i, /Encountered a script tag/i];

/**
 * Per-page checks run after load at the first width only.
 * Each entry: async ({ page, check }) => void.
 */
const PAGE_CHECKS = {
  '/docs/getting-started/usage': async ({ page, check }) => {
    const w = await example(page, 'basic', check);
    await codeToggle(page, w, 'basic', 'useShadcnReactTable', check);
  },
  '/docs/guides/pagination': async ({ page, check }) => {
    const propNames = await names(page, '#relevant-props-table');
    check('table options rows', propNames.length === 9, propNames.join(','));
    const stateNames = await names(page, '#relevant-state-options-table');
    check(
      'state options rows',
      stateNames.join(',') === 'pagination',
      stateNames.join(','),
    );
    check(
      'srtPaginationProps copy id',
      (await page.locator('#srtPaginationProps-prop').count()) === 1,
    );
    const alt = await example(page, 'alternate-pagination', check);
    await paginationControls(alt, 'alternate-pagination', check);
    await codeToggle(
      page,
      alt,
      'alternate-pagination',
      "paginationDisplayMode: 'pages'",
      check,
    );
    const remote = await example(page, 'remote', check);
    await paginationControls(remote, 'remote', check);
    await codeToggle(page, remote, 'remote', 'manualPagination: true', check);
    const before = await remote.locator('table tbody tr').first().textContent();
    const next = remote
      .locator('button[aria-label*="next" i], a[aria-label*="next" i]')
      .first();
    check('remote: next page button', (await next.count()) > 0);
    if (await next.count()) {
      await next.click();
      await page.waitForTimeout(1500);
      const after = await remote
        .locator('table tbody tr')
        .first()
        .textContent();
      check('remote: next page changes rows', before !== after);
    }
  },
};

/** Prop-table option names (3rd cell; detail-panel rows have no cells). */
async function names(page, tableId) {
  const cells = page.locator(`${tableId} table tbody tr td:nth-child(3)`);
  await cells
    .first()
    .waitFor({ timeout: 30000 })
    .catch(() => {});
  return (await cells.allTextContents()).map((t) => t.trim()).filter(Boolean);
}

/** Live example wrapper: #<id>-demo heading, table with rows. */
async function example(page, id, check) {
  const demo = page.locator(`#${id}-demo`);
  check(`${id}: demo heading`, (await demo.count()) === 1);
  const wrapper = demo.locator('xpath=ancestor::div[1]/..');
  const rows = wrapper.locator('table tbody tr');
  await rows
    .first()
    .waitFor({ timeout: 30000 })
    .catch(() => {});
  const n = await rows.count();
  check(`${id}: table rows`, n > 0, `rows=${n}`);
  return wrapper;
}

async function paginationControls(wrapper, id, check) {
  const n =
    (await wrapper.locator('nav, [data-slot="pagination"]').count()) +
    (await wrapper
      .locator(
        'button[aria-label*="page" i], a[aria-label*="page" i], [data-slot="pagination-link"]',
      )
      .count());
  check(`${id}: pagination controls`, n > 0, `found=${n}`);
}

async function codeToggle(page, wrapper, id, needle, check) {
  const btn = wrapper.locator('button', { hasText: /^Code$/ });
  check(`${id}: Code button`, (await btn.count()) === 1);
  if (!(await btn.count())) return;
  await btn.first().click();
  const pre = page.locator(`#${id}-source-code pre`);
  await pre
    .first()
    .waitFor({ timeout: 15000 })
    .catch(() => {});
  const txt =
    (await pre
      .first()
      .textContent()
      .catch(() => '')) ?? '';
  check(`${id}: source shown`, txt.includes(needle), `len=${txt.length}`);
  check(
    `${id}: copy button`,
    (await page.locator(`#${id}-source-code button`).count()) >= 1,
  );
}

const pages = args.length ? args : Object.keys(PAGE_CHECKS);
const results = [];
const browser = await chromium.launch();

for (const route of pages) {
  for (const [i, width] of widths.entries()) {
    const label = `${route} @${width}`;
    const check = (name, ok, extra = '') =>
      results.push(
        `${ok ? 'PASS' : 'FAIL'} ${label} ${name}${extra ? ' ' + extra : ''}`,
      );
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: 'dark',
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    const res = await page.goto(base + route, {
      waitUntil: 'networkidle',
      timeout: 90000,
    });
    check('status', res?.status() === 200, String(res?.status()));
    await page.waitForTimeout(1500);
    if (i === 0 && PAGE_CHECKS[route])
      await PAGE_CHECKS[route]({ page, check });
    const fatal = errors.filter((e) => FATAL.some((re) => re.test(e)));
    check(
      'no hydration / React errors',
      fatal.length === 0,
      fatal.map((e) => e.split('\n')[0].slice(0, 160)).join(' || '),
    );
    check(
      'no console errors',
      errors.length === 0,
      errors.length
        ? `${errors.length}: ` + errors[0].split('\n')[0].slice(0, 160)
        : '',
    );
    if (shots && i === 0) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: path.join(shots, `pages-${route.split('/').pop()}.png`),
        fullPage: true,
      });
    }
    await ctx.close();
  }
}
await browser.close();

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL')).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
