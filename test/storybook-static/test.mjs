/**
 * storybook-static (per base): the static Storybook resets a story after its
 * play (D8, F6). Opens the PaginationCompactMoreData story's iframe in
 * headless Chromium, waits until the story's render has finished (play,
 * then afterEach), and asserts the story is back in its initial state: the
 * footer reads `1-10 of 551`, the global filter is empty and
 * `window.__ST_STATIC__` is true. `storybook dev` and vitest keep the end
 * state; this test covers the static build only.
 *
 * Usage (repo root):
 *   pnpm test storybook-static [--base base|radix|aria] [--url <origin>]
 *
 * Without --url the base's static Storybook is built
 * (`pnpm --filter shadcn-table storybook:build:<base>`) and served from
 * packages/shadcn-table/storybook-static/<base> by `serve` on 5343 under
 * --ci, else on a free agent port (5340 to 5360), then stopped. With --url
 * the story is opened on `<origin>/<base>/` (the deployed site) instead.
 * Both ways it also checks the docs story pages against the index.json of
 * that Storybook (checkPages), and the intro line above the story (D124): a
 * link "View documentation for this example" to the story's docs page, and
 * no "This story on the docs site" text.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { DEFAULT_BASE } from '../../tools/registry/bases.mjs';
import { portFor, run as exec, spawnServer } from '../lib/exec.mjs';
import {
  MORE_DIR,
  readExactStories,
} from '../../apps/shadcn-table-docs/lib/story-pages.mjs';

const CI_PORT = 5343;
const STORY_ID = 'features-pagination--pagination-compact-more-data';
const EXPECTED_RANGE = '1-10 of 551';
const DOCS_ORIGIN = 'https://www.shadcn-table.com';
const INTRO_TEXT = 'View documentation for this example';
const OLD_INTRO_TEXT = 'This story on the docs site';
/** The story's render (play, then afterEach) settles within this. */
const FINISH_TIMEOUT = 90_000;
/** Then the initial state shows within this. */
const RESET_TIMEOUT = 30_000;

const option = (flags, name, fallback) => {
  const i = flags.indexOf(`--${name}`);
  return i === -1 ? fallback : flags[i + 1];
};

/** The footer range, the global filter value and the static flag. */
const readState = () => {
  const range = [...document.querySelectorAll('span')]
    .map((el) => el.textContent ?? '')
    .find((text) => /^\d+-\d+ of \d+$/.test(text));
  const filter = document.querySelector('input[placeholder="Search"]');
  return {
    range: range ?? '',
    filter: filter ? filter.value : '',
    isStatic: window.__ST_STATIC__ === true,
  };
};

/**
 * The docs story pages against this Storybook's index (spec 56, 1.6.5): every
 * exact story of lib/storybook-map.ts is in it, and the pages under
 * content/docs/examples/more/ (more/meta.json order) are its other stories,
 * in its order.
 */
async function checkPages(root) {
  const results = [];
  const check = (name, ok, extra = '') =>
    results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' ' + extra : ''}`);
  const res = await fetch(`${root}/index.json`);
  const index = await res.json();
  const ids = Object.values(index.entries)
    .filter((entry) => entry.type === 'story')
    .map((entry) => entry.id);
  const exact = readExactStories();
  const missing = [...exact.keys()].filter((id) => !ids.includes(id));
  check(
    'example stories in index.json',
    missing.length === 0,
    missing.length ? missing.join(', ') : `${exact.size}`,
  );
  const want = ids.filter((id) => !exact.has(id));
  const meta = JSON.parse(
    fs.readFileSync(path.join(MORE_DIR, 'meta.json'), 'utf8'),
  );
  const pages = meta.pages.filter((page) => !page.startsWith('---'));
  const first = want.findIndex((id, i) => pages[i] !== id);
  check(
    'story pages match index.json',
    want.length === pages.length && first === -1,
    first === -1
      ? `${pages.length} pages`
      : `at ${first}: page ${pages[first] ?? 'none'}, story ${want[first] ?? 'none'} (node lib/story-pages.mjs)`,
  );
  return results;
}

/**
 * A story's docs page, as .storybook/preview.tsx links it: the example page
 * of an exact story, else /docs/examples/more/<story id>.
 */
const docsPageUrl = (id) =>
  `${DOCS_ORIGIN}/docs/examples/${readExactStories().get(id) ?? `more/${id}`}`;

/** The PASS and FAIL lines of one story check against `storyUrl`. */
async function checkStory(storyUrl) {
  const results = [];
  const check = (name, ok, extra = '') =>
    results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' ' + extra : ''}`);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    const res = await page.goto(storyUrl, {
      waitUntil: 'load',
      timeout: 90_000,
    });
    check('status', res?.status() === 200, String(res?.status()));
    // The render's last phase is `finished`, after the play and afterEach
    // (storybook StoryRender); before it the story still shows the play.
    try {
      await page.waitForFunction(
        () => window.__STORYBOOK_PREVIEW__?.currentRender?.phase === 'finished',
        undefined,
        { timeout: FINISH_TIMEOUT },
      );
      check('play finished', true);
    } catch {
      const phase = await page
        .evaluate(() => window.__STORYBOOK_PREVIEW__?.currentRender?.phase)
        .catch(() => undefined);
      check('play finished', false, `phase ${phase ?? 'none'}`);
    }
    let state;
    try {
      await page.waitForFunction(
        ({ fn, expected }) => {
          const s = new Function(`return (${fn})()`)();
          return s.range === expected && s.filter === '';
        },
        { fn: readState.toString(), expected: EXPECTED_RANGE },
        { timeout: RESET_TIMEOUT },
      );
    } catch {
      // reported below with the state it ended in
    }
    state = await page.evaluate(readState);
    check(
      'footer in initial state',
      state.range === EXPECTED_RANGE,
      `"${state.range}" (expected "${EXPECTED_RANGE}")`,
    );
    check(
      'global filter empty',
      state.filter === '',
      state.filter ? `"${state.filter}"` : '',
    );
    check('window.__ST_STATIC__ is true', state.isStatic);
    const intro = await page.evaluate(
      ({ text, oldText }) => ({
        hrefs: [...document.querySelectorAll('a')]
          .filter((a) => a.textContent?.trim() === text)
          .map((a) => a.href),
        hasOld: document.body.textContent?.includes(oldText) ?? false,
      }),
      { text: INTRO_TEXT, oldText: OLD_INTRO_TEXT },
    );
    const expectedDocs = docsPageUrl(STORY_ID);
    check(
      'intro links to the docs page',
      intro.hrefs.length === 1 && intro.hrefs[0] === expectedDocs,
      `${JSON.stringify(intro.hrefs)} (expected "${expectedDocs}")`,
    );
    check('old intro text absent', !intro.hasOld);
  } finally {
    await browser.close();
  }
  return results;
}

export const run = async (ctx) => {
  const base = ctx.base ?? DEFAULT_BASE;
  const given = option(ctx.flags, 'url', '').replace(/\/$/, '');
  let server;
  let root;
  try {
    if (given) {
      root = `${given}/${base}`;
    } else {
      const build = await exec(
        'pnpm',
        ['--filter', 'shadcn-table', `storybook:build:${base}`],
        { cwd: ctx.root },
      );
      if (build.code !== 0) {
        return {
          status: 'fail',
          summary: 'storybook build failed',
          errors: [
            `pnpm --filter shadcn-table storybook:build:${base}: exit ${build.code}`,
          ],
        };
      }
      const port = await portFor(ctx, CI_PORT);
      root = `http://localhost:${port}`;
      const dir = path.join(
        'packages',
        'shadcn-table',
        'storybook-static',
        base,
      );
      // serve's clean URLs redirect /iframe.html to /iframe and drop the
      // query, so the story id is lost; the static hosts keep .html.
      const config = path.join(ctx.out, 'storybook-static-serve.json');
      fs.mkdirSync(ctx.out, { recursive: true });
      fs.writeFileSync(config, JSON.stringify({ cleanUrls: false }) + '\n');
      ctx.log(`storybook-static: serve ${dir} on ${root}`);
      server = await spawnServer(
        'pnpm',
        [
          'exec',
          'serve',
          dir,
          '-l',
          String(port),
          '--no-clipboard',
          '-c',
          config,
        ],
        {
          cwd: ctx.root,
          readyUrl: `${root}/iframe.html`,
          timeoutMs: 60_000,
          name: 'serve',
        },
      );
    }
    const pageResults = await checkPages(root);
    ctx.log(pageResults.join('\n'));
    const storyUrl = `${root}/iframe.html?id=${STORY_ID}&viewMode=story`;
    ctx.log(`storybook-static (${base}): ${storyUrl}`);
    let results;
    try {
      results = await checkStory(storyUrl);
    } catch (error) {
      results = [`FAIL story threw ${String(error.message).slice(0, 200)}`];
    }
    ctx.log(results.join('\n'));
    const failures = [...pageResults, ...results].filter((r) =>
      r.startsWith('FAIL'),
    );
    const details = { url: given || 'local', story: STORY_ID };
    if (failures.length) {
      return {
        status: 'fail',
        summary: `reset fail: ${failures[0].slice(0, 160)}`,
        details,
        errors: failures,
      };
    }
    return { status: 'pass', summary: 'reset pass', details };
  } finally {
    await server?.stop();
  }
};
