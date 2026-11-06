/**
 * docs-e2e (per base): the docs pages in headless Chromium at desktop and
 * mobile widths; fails on any console.error or uncaught page error, in
 * particular React hydration mismatches. Per-page assertions live in
 * lib/<cluster>.mjs (default export: { '/docs/path': async ({ page, check,
 * base }) => void }, where `base` is the one the page opened on);
 * lib/helpers.mjs holds the shared assertions and is not a cluster. Add an
 * entry for every new page that renders live examples or prop tables.
 *
 * Usage (repo root):
 *   pnpm test docs-e2e [--base base|radix|aria] [--url <origin>]
 *     [a|b|c|d|e ...] [/docs/path ...] [--widths 1440,700] [--shots <dir>]
 *
 * Without --url the docs app is built (`pnpm --filter shadcn-table-docs
 * build`) and served by `next start` on 5320 under --ci, else on a free agent
 * port (5340 to 5360), then stopped. With --url the pages are checked
 * against that origin only. Clusters a to e run one after the other, each
 * with its own browser, all before the exit; letters limit the run to those
 * clusters, explicit /docs paths to those pages (with their checks, if any).
 * `--base` opens every page with that shadcn base selected (the stored pick
 * of components/base-selector.tsx); a based run always has one.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { TAB_VALUES } from '../../apps/shadcn-table-docs/lib/base-tabs.mjs';
import { DEFAULT_BASE } from '../../tools/registry/bases.mjs';
import { portFor, run as exec, spawnServer } from '../lib/exec.mjs';

const CHECKS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'lib',
);
const CLUSTERS = ['a', 'b', 'c', 'd', 'e'];
const CI_PORT = 5320;

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

function isExternalResourceError(text, resourceUrl, url) {
  if (!/^Failed to load resource/.test(text)) return false;
  try {
    const host = new URL(resourceUrl).host;
    if (MONITORED_EXTERNAL_HOSTS.includes(host)) return false;
    return host !== new URL(url).host;
  } catch {
    return false;
  }
}

const isKnownLibraryError = (text) =>
  KNOWN_LIBRARY_ERRORS.some((prefix) => text.startsWith(prefix));

/** Merged PAGE_CHECKS from lib/<cluster>.mjs (optionally some clusters). */
async function loadChecks(clusters) {
  const files = (await fs.readdir(CHECKS_DIR))
    .filter((f) => /^[a-z]\.mjs$/.test(f))
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

/**
 * One pass over `routes` (or every page of `clusters`) against `url`:
 * the PASS and FAIL lines.
 */
export async function checkPages({
  url,
  base = '',
  clusters = [],
  routes = [],
  widths = [1440, 700],
  shots = '',
}) {
  /** The stored value of the site-wide base tab group for `base`. */
  const baseTab = base ? TAB_VALUES[base] : '';
  const PAGE_CHECKS = await loadChecks(clusters);
  const pages = routes.length ? routes : Object.keys(PAGE_CHECKS);
  if (!pages.length) return { results: ['FAIL no pages to check'], pages };
  const results = [];
  const browser = await chromium.launch();
  try {
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
        }, baseTab);
        const page = await ctx.newPage();
        const errors = [];
        page.on('console', (m) => {
          if (m.type() !== 'error') return;
          if (isExternalResourceError(m.text(), m.location()?.url ?? '', url))
            return;
          errors.push(m.text());
        });
        page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
        const res = await page.goto(url + route, {
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
              base: base || DEFAULT_BASE,
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
  } finally {
    await browser.close();
  }
  return { results, pages };
}

const option = (flags, name, fallback) => {
  const i = flags.indexOf(`--${name}`);
  return i === -1 ? fallback : flags[i + 1];
};

export const run = async (ctx) => {
  const flags = ctx.flags;
  const given = option(flags, 'url', '');
  const widths = option(flags, 'widths', '1440,700').split(',').map(Number);
  const shots = option(flags, 'shots', '');
  const letters = flags
    .filter((a) => /^[a-z]$/i.test(a))
    .map((a) => a.toLowerCase());
  const routes = flags.filter((a) => a.startsWith('/'));
  const clusters = routes.length
    ? [[]]
    : (letters.length ? letters : CLUSTERS).map((c) => [c]);

  let server;
  let url = given.replace(/\/$/, '');
  try {
    if (!url) {
      const build = await exec(
        'pnpm',
        ['--filter', 'shadcn-table-docs', 'build'],
        {
          cwd: ctx.root,
        },
      );
      if (build.code !== 0) {
        return {
          status: 'fail',
          summary: 'docs build failed',
          errors: [`pnpm --filter shadcn-table-docs build: exit ${build.code}`],
        };
      }
      const port = await portFor(ctx, CI_PORT);
      url = `http://localhost:${port}`;
      ctx.log(`docs-e2e: next start on ${url}`);
      server = await spawnServer(
        'pnpm',
        [
          '--filter',
          'shadcn-table-docs',
          'exec',
          'next',
          'start',
          '-p',
          String(port),
        ],
        {
          cwd: ctx.root,
          readyUrl: url,
          timeoutMs: 120_000,
          name: 'next start',
        },
      );
    }
    const failures = [];
    const seen = new Set();
    let total = 0;
    for (const cluster of clusters) {
      const name = cluster[0] ?? 'pages';
      ctx.log(
        `docs-e2e: ${name}${ctx.base ? ` (${ctx.base})` : ''} against ${url}`,
      );
      let results;
      let pages = [];
      try {
        ({ results, pages } = await checkPages({
          url,
          base: ctx.base ?? '',
          clusters: cluster,
          routes,
          widths,
          shots,
        }));
      } catch (error) {
        results = [`FAIL ${name} threw ${String(error.message).slice(0, 200)}`];
      }
      for (const page of pages) seen.add(page);
      total += results.length;
      ctx.log(results.join('\n'));
      const failed = results.filter((r) => r.startsWith('FAIL'));
      ctx.log(
        `${name}: ${results.length - failed.length} passed, ${failed.length} failed`,
      );
      failures.push(...failed.map((line) => `${name}: ${line}`));
    }
    const scope = routes.length
      ? `${seen.size} pages`
      : `${clusters.length} cluster${clusters.length === 1 ? '' : 's'}, ${seen.size} pages`;
    if (failures.length) {
      return {
        status: 'fail',
        summary: `${scope}, ${failures.length} failed: ${failures[0].slice(0, 160)}`,
        details: {
          url: given || 'local',
          checks: total,
          failed: failures.length,
        },
        errors: failures,
      };
    }
    return {
      status: 'pass',
      summary: scope,
      details: { url: given || 'local', checks: total, pages: seen.size },
    };
  } finally {
    await server?.stop();
  }
};
