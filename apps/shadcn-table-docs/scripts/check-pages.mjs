#!/usr/bin/env node
/**
 * Dev-server page gate: loads docs pages in headless Chromium at desktop and
 * mobile widths and fails on any console.error or uncaught page error, in
 * particular React hydration mismatches (which only print in `next dev`).
 * Per-page assertions live in scripts/page-checks/<cluster>.mjs (default
 * export: { '/docs/path': async ({ page, check, edition }) => void }, where
 * `edition` is the one the page opened on); files starting with `_` are
 * helpers and not loaded. Add an entry for every new page that
 * renders live examples or prop tables.
 *
 * Usage (dev server must be running, default http://localhost:5320):
 *   node scripts/check-pages.mjs [a|b|c|d|e] [--base http://localhost:5321]
 *     [--edition base|radix|aria] [--widths 1440,700] [--shots <dir>]
 *     [/docs/path ...]
 *
 * A single-letter argument limits the run to that cluster's page checks;
 * explicit /docs paths run only those pages (with their checks, if any).
 * `--edition` opens every page with that shadcn base selected (the stored
 * pick of components/base-selector.tsx), so the live examples and code
 * views are that edition's; without it the pages open on the default base
 * (DEFAULT_EDITION in editions.mjs, Base UI).
 * Playwright is resolved from packages/shadcn-table/node_modules
 * (a devDependency of the library package).
 */
import { createRequire } from 'node:module';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  DEFAULT_EDITION,
  EDITIONS,
} from '../../../packages/shadcn-table/scripts/registry/editions.mjs';
import { TAB_VALUES } from '../lib/base-tabs.mjs';

const APP_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const CHECKS_DIR = path.join(APP_DIR, 'scripts', 'page-checks');
const require = createRequire(
  path.join(
    APP_DIR,
    '..',
    '..',
    'packages',
    'shadcn-table',
    'node_modules',
    '/',
  ),
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
const edition = opt('edition', '');
if (edition && !EDITIONS.includes(edition)) {
  console.error(`--edition must be one of ${EDITIONS.join(', ')}`);
  process.exit(1);
}
/** The stored value of the site-wide base tab group for `--edition`. */
const editionTab = edition ? TAB_VALUES[edition] : '';
const widths = opt('widths', '1440,700').split(',').map(Number);
const shots = opt('shots', '');
const clusters = args
  .filter((a) => /^[a-z]$/i.test(a))
  .map((a) => a.toLowerCase());
const routesArg = args.filter((a) => a.startsWith('/'));

/** Console errors that always fail the gate, whatever the page. */
const FATAL = [/hydrat/i, /Minified React error/i, /Encountered a script tag/i];

/**
 * Console errors the library emits on its own and that are tracked as
 * library bugs in .ai/plans/handoff/ATTENTION-2026-10-17-claude-review.md;
 * ignored by the `no console errors` check only (FATAL still applies).
 * Empty right now.
 */
const KNOWN_LIBRARY_ERRORS = [];

/**
 * Resource errors from third-party hosts (fonts blocked by an ad blocker,
 * for example) are not ours. Same-origin 404/500 stay fatal, and so do
 * hosts the docs depend on for visible content (example avatars).
 */
const MONITORED_EXTERNAL_HOSTS = ['api.dicebear.com'];

function isExternalResourceError(text, url) {
  if (!/^Failed to load resource/.test(text)) return false;
  try {
    const host = new URL(url).host;
    if (MONITORED_EXTERNAL_HOSTS.includes(host)) return false;
    return host !== new URL(base).host;
  } catch {
    return false;
  }
}

const isKnownLibraryError = (text) =>
  KNOWN_LIBRARY_ERRORS.some((prefix) => text.startsWith(prefix));

/** Merged PAGE_CHECKS from scripts/page-checks/*.mjs (optionally one cluster). */
async function loadChecks() {
  const files = (await fs.readdir(CHECKS_DIR))
    .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
    .filter((f) => !clusters.length || clusters.includes(f.slice(0, -4)))
    .sort();
  const merged = {};
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(CHECKS_DIR, f)).href);
    for (const [route, fn] of Object.entries(mod.default ?? {})) {
      if (merged[route]) console.warn(`warn: ${f} redefines ${route}`);
      merged[route] = fn;
    }
  }
  return merged;
}

const PAGE_CHECKS = await loadChecks();
const pages = routesArg.length ? routesArg : Object.keys(PAGE_CHECKS);
if (!pages.length) {
  console.error('no pages to check');
  process.exit(1);
}
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
    // Headless clipboard is not readable; the playground's copy items write
    // through navigator.clipboard.writeText, stubbed to keep the last text
    // on window.__stClipboard for the page checks.
    await ctx.addInitScript((tab) => {
      window.__stClipboard = '';
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text) => {
            window.__stClipboard = String(text);
          },
        },
      });
      // The base selector reads the fumadocs tab group `base` from storage.
      if (tab) localStorage.setItem('base', tab);
    }, editionTab);
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      if (isExternalResourceError(m.text(), m.location()?.url ?? '')) return;
      errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    const res = await page.goto(base + route, {
      waitUntil: 'networkidle',
      timeout: 90000,
    });
    check('status', res?.status() === 200, String(res?.status()));
    await page.waitForTimeout(1500);
    if (i === 0 && PAGE_CHECKS[route]) {
      try {
        await PAGE_CHECKS[route]({
          page,
          check,
          edition: edition || DEFAULT_EDITION,
        });
      } catch (e) {
        check('page check threw', false, String(e.message).slice(0, 160));
      }
    }
    const fatal = errors.filter((e) => FATAL.some((re) => re.test(e)));
    check(
      'no hydration / React errors',
      fatal.length === 0,
      fatal.map((e) => e.split('\n')[0].slice(0, 160)).join(' || '),
    );
    const ours = errors.filter((e) => !isKnownLibraryError(e));
    check(
      'no console errors',
      ours.length === 0,
      ours.length
        ? `${ours.length}: ` + ours[0].split('\n')[0].slice(0, 160)
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
