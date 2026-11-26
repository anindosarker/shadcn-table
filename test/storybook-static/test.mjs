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
 *     [--ids <from>:<to>]
 * `--ids` reads the Code tab of that slice of index.json only (index
 * positions, end excluded), for a partial run by hand; the default is every id.
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
 *
 * Then the Code tab of every story (checkCode, spec 66, D142): one manager
 * page, the story switched in place for every id of index.json; the panel
 * must show the story's code text (tools/story-source/extract.mjs, the text
 * `virtual:story-sources` serves), compared after trimming, and none of
 * `play`, `expect(`, `storybook/test`, `userEvent`. The run time of this
 * read is in the result's details. On the first manager page it opens, the
 * toolbar must hold one item `v<version>` (D150), the version from
 * packages/shadcn-table/package.json: a link to the GitHub releases, right
 * after the base switcher; and the sidebar title must read
 * `shadcn-table (<base label>)`, with no version.
 *
 * The head of the manager page, read as text from `/index.html` (checkHead,
 * D1): one `<title>` that holds `shadcn-table (<base label>)`, one meta
 * description of 70 to 160 characters that holds the label, and one canonical
 * link to `https://storybook.shadcn-table.com/<base>/`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { BASE_LABELS, DEFAULT_BASE } from '../../tools/registry/bases.mjs';
import {
  storySources,
  TEST_WORDS,
} from '../../tools/story-source/extract.mjs';
import { portFor, run as exec, spawnServer } from '../lib/exec.mjs';
import {
  MORE_DIR,
  readExactStories,
} from '../../apps/shadcn-table-docs/lib/story-pages.mjs';

const CI_PORT = 5343;
/** The library version the manager toolbar names (D150). */
const LIBRARY_VERSION = JSON.parse(
  fs.readFileSync(
    new URL('../../packages/shadcn-table/package.json', import.meta.url),
    'utf8',
  ),
).version;
/** The manager's brand title: Storybook's Brand, a link to the root. */
const MANAGER_TITLE = '.sidebar-header a';
/**
 * The manager's preview toolbar and its base switcher (base-tool.ts): a
 * Storybook Select, labelled "Base" plus the chosen base ("Base Base UI").
 */
const TOOLBAR = '[data-testid="sb-preview-toolbar"]';
const BASE_SWITCHER = 'button[aria-haspopup="listbox"][aria-label^="Base "]';
const STORY_ID = 'features-pagination--pagination-compact-more-data';
const EXPECTED_RANGE = '1-10 of 551';
const DOCS_ORIGIN = 'https://www.shadcn-table.com';
const STORYBOOK_ORIGIN = 'https://storybook.shadcn-table.com';
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

/** The Code tab's text in the manager (addon-docs code panel). */
const CODE_PANEL = '[id$="tabpanel-storybook/docs/panel"] pre';
/** A story renders within this after the switch. */
const RENDER_TIMEOUT = 30_000;
/** Then its code text shows within this (the preview sends it after render). */
const CODE_TIMEOUT = 5_000;
/** A panel text that stays the same this long is the one the story shows. */
const CODE_SETTLE = 1_500;
/** A fresh page after this many stories (one page crashed after about 450). */
const PAGE_STORIES = 200;

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

/** The value of attribute `name` in the tag text `tag`, or undefined. */
const attribute = (tag, name) =>
  new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i')
    .exec(tag)
    ?.slice(1)
    .find((value) => value !== undefined);

/**
 * The head of the built manager page of `base` (D1): exactly one title, one
 * meta description and one canonical link, with the values of that base.
 */
async function checkHead(root, base) {
  const label = BASE_LABELS[base];
  const problems = [];
  const html = await (await fetch(`${root}/index.html`)).text();
  const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  const want = `shadcn-table (${label})`;
  if (titles.length !== 1) problems.push(`${titles.length} titles`);
  else if (!titles[0][1].includes(want))
    problems.push(`title "${titles[0][1]}" (expected "${want}")`);
  const tags = (element) => html.match(new RegExp(`<${element}\\b[^>]*>`, 'gi')) ?? [];
  const descriptions = tags('meta').filter(
    (tag) => attribute(tag, 'name')?.toLowerCase() === 'description',
  );
  if (descriptions.length !== 1)
    problems.push(`${descriptions.length} descriptions`);
  else {
    const content = attribute(descriptions[0], 'content') ?? '';
    if (content.length < 70 || content.length > 160)
      problems.push(`description of ${content.length} characters`);
    if (!content.includes(label))
      problems.push(`description "${content}" (no "${label}")`);
  }
  const canonicals = tags('link').filter(
    (tag) => attribute(tag, 'rel')?.toLowerCase() === 'canonical',
  );
  const href = `${STORYBOOK_ORIGIN}/${base}/`;
  if (canonicals.length !== 1) problems.push(`${canonicals.length} canonicals`);
  else if (attribute(canonicals[0], 'href') !== href)
    problems.push(
      `canonical "${attribute(canonicals[0], 'href')}" (expected "${href}")`,
    );
  return problems.length
    ? `FAIL manager head: ${problems.join('; ')}`
    : 'PASS manager head';
}

/**
 * A story's docs page, as .storybook/preview.tsx links it: the example page
 * of an exact story, else /docs/examples/more/<story id>.
 */
const docsPageUrl = (id) =>
  `${DOCS_ORIGIN}/docs/examples/${readExactStories().get(id) ?? `more/${id}`}`;

/**
 * The Code tab of every story of `root`'s index.json against its code text
 * (spec 66, 1.6.6). One browser, one manager page (a fresh one every
 * PAGE_STORIES stories and after a crash); each story is opened in place by
 * history.pushState and popstate, as the manager's own links do. A story
 * passes when, after its storyRendered, the panel shows its text (trimmed)
 * within CODE_TIMEOUT and none of the test words.
 * @returns {Promise<{ results: string[], read: number, failed: string[], seconds: number }>}
 */
async function checkCode(root, { base, log, slice }) {
  const index = await (await fetch(`${root}/index.json`)).json();
  const all = Object.values(index.entries)
    .filter((entry) => entry.type === 'story')
    .map((entry) => entry.id);
  const [from, to] = (slice || ':').split(':');
  const ids = all.slice(Number(from || 0), to ? Number(to) : all.length);
  const sources = await storySources({ base });
  const started = Date.now();
  const failed = [];
  const results = [];
  const browser = await chromium.launch();
  let page;
  let opened = 0;
  let toolbarChecked = false;
  /**
   * The toolbar version item and the sidebar title of the manager page that
   * just opened, once a run (D150).
   */
  const checkToolbar = async () => {
    toolbarChecked = true;
    const version = `v${LIBRARY_VERSION}`;
    const title = `shadcn-table (${BASE_LABELS[base]})`;
    await page
      .waitForSelector(`${TOOLBAR} ${BASE_SWITCHER}`, { timeout: 5_000 })
      .catch(() => {});
    const found = await page.evaluate(
      ({ toolbar, switcher, text }) => {
        const bar = document.querySelector(toolbar);
        if (!bar) return { problem: 'no toolbar' };
        // the innermost elements that read the text, one per item
        const items = [...bar.querySelectorAll('*')].filter(
          (el) =>
            el.innerText?.trim() === text &&
            ![...el.children].some((child) => child.innerText?.trim() === text),
        );
        if (items.length !== 1) return { problem: `${items.length} items` };
        const link = items[0].closest('a');
        const href = link?.href ?? '';
        const baseTool = bar.querySelector(switcher);
        if (!baseTool) return { href, problem: 'no base switcher' };
        // each tool's top element under the group that holds both
        let group = baseTool.parentElement;
        while (group && !group.contains(items[0])) group = group.parentElement;
        const top = (el) => {
          while (el.parentElement !== group) el = el.parentElement;
          return el;
        };
        const next = top(baseTool).nextElementSibling === top(items[0]);
        return { href, problem: next ? '' : 'not right after the base switcher' };
      },
      { toolbar: TOOLBAR, switcher: BASE_SWITCHER, text: version },
    );
    const shown = (
      await page
        .locator(MANAGER_TITLE)
        .filter({ hasText: /^shadcn-table/ })
        .first()
        .innerText({ timeout: 5_000 })
        .catch(() => '')
    ).trim();
    const problems = [
      found.problem,
      found.problem || found.href.endsWith('/releases')
        ? ''
        : `href "${found.href}" not /releases`,
      shown === title ? '' : `title "${shown}" (expected "${title}")`,
    ].filter(Boolean);
    results.push(
      `${problems.length ? 'FAIL' : 'PASS'} manager toolbar version "${version}"${problems.length ? `: ${problems.join('; ')}` : ''}`,
    );
  };
  const open = async (id) => {
    await page?.close().catch(() => {});
    page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    await page.addInitScript(() => {
      window.__stRendered = new Set();
      const hook = setInterval(() => {
        const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
        if (!channel) return;
        clearInterval(hook);
        channel.on('storyRendered', (event) =>
          window.__stRendered.add(
            typeof event === 'string' ? event : event?.storyId,
          ),
        );
      }, 5);
    });
    // index.html by name: serve with cleanUrls off lists the folder at /
    await page.goto(`${root}/index.html?path=/story/${id}`, {
      waitUntil: 'load',
      timeout: 90_000,
    });
    await page.waitForSelector(CODE_PANEL, { timeout: 60_000 });
    opened = 0;
    if (!toolbarChecked) await checkToolbar();
  };
  const panelText = () =>
    page.evaluate(
      (selector) => document.querySelector(selector)?.innerText ?? '',
      CODE_PANEL,
    );
  /** The panel's text once it settled on `expected`, else what it shows. */
  const read = async (id, expected, fresh) => {
    if (fresh) await open(id);
    else
      await page.evaluate((storyId) => {
        window.__stRendered.delete(storyId);
        history.pushState({}, '', `?path=/story/${storyId}`);
        dispatchEvent(new PopStateEvent('popstate', { state: {} }));
      }, id);
    opened += 1;
    await page
      .waitForFunction((storyId) => window.__stRendered.has(storyId), id, {
        timeout: RENDER_TIMEOUT,
        polling: 50,
      })
      .catch(() => {});
    // done when the panel shows the text, or shows another text that has
    // not changed for CODE_SETTLE (a failing story need not wait it out)
    await page.evaluate(() => {
      window.__stSettle = undefined;
    });
    await page
      .waitForFunction(
        ({ selector, text, settle }) => {
          const now = performance.now();
          const shown = (
            document.querySelector(selector)?.innerText ?? ''
          ).trim();
          if (shown === text) return true;
          const last = (window.__stSettle ??= { shown, at: now });
          if (last.shown !== shown) {
            last.shown = shown;
            last.at = now;
            return false;
          }
          return now - last.at >= settle;
        },
        { selector: CODE_PANEL, text: expected, settle: CODE_SETTLE },
        { timeout: CODE_TIMEOUT, polling: 50 },
      )
      .catch(() => {});
    return panelText();
  };
  try {
    let fresh = true;
    let pageFailures = 0;
    for (const [i, id] of ids.entries()) {
      const expected = sources[id]?.trim();
      let text;
      try {
        text = await read(id, expected ?? '', fresh || opened >= PAGE_STORIES);
      } catch {
        try {
          text = await read(id, expected ?? '', true);
        } catch (error) {
          // a manager that does not open at all fails the read at once
          pageFailures += 1;
          if (pageFailures >= 3) throw error;
          text = `(page failed: ${String(error.message).split('\n')[0]})`;
          fresh = true;
          results.push(`FAIL code ${id}: ${text}`);
          failed.push(id);
          continue;
        }
      }
      pageFailures = 0;
      fresh = false;
      const shown = text.trim();
      const word = TEST_WORDS.exec(shown);
      let problem = '';
      if (expected === undefined) problem = 'no code text for this id';
      else if (shown !== expected)
        problem = `shows "${shown.split('\n')[0].slice(0, 80)}" (${shown.split('\n').length} lines; expected "${expected.split('\n')[0].slice(0, 80)}", ${expected.split('\n').length} lines)`;
      if (word) problem += `${problem ? '; ' : ''}holds "${word[0]}"`;
      if (problem) {
        failed.push(id);
        results.push(`FAIL code ${id}: ${problem}`);
      }
      if (i % 100 === 99)
        log(`storybook-static: code tab ${i + 1} of ${ids.length} read`);
    }
  } finally {
    await browser.close();
  }
  const seconds = Math.round((Date.now() - started) / 1000);
  results.push(
    `${failed.length ? 'FAIL' : 'PASS'} code tab of ${ids.length} stories: ${ids.length - failed.length} pass, ${failed.length} fail, ${seconds} s`,
  );
  return { results, read: ids.length, failed, seconds };
}

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
    try {
      pageResults.push(await checkHead(root, base));
    } catch (error) {
      pageResults.push(
        `FAIL manager head: threw ${String(error.message).slice(0, 200)}`,
      );
    }
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
    let code;
    try {
      code = await checkCode(root, {
        base,
        log: ctx.log,
        slice: option(ctx.flags, 'ids', ''),
      });
    } catch (error) {
      code = {
        results: [`FAIL code tab threw ${String(error.message).slice(0, 200)}`],
        read: 0,
        failed: [],
        seconds: 0,
      };
    }
    ctx.log(code.results.join('\n'));
    const failures = [...pageResults, ...results, ...code.results].filter(
      (r) => r.startsWith('FAIL'),
    );
    const details = {
      url: given || 'local',
      story: STORY_ID,
      codeTab: {
        read: code.read,
        failed: code.failed.length,
        seconds: code.seconds,
      },
    };
    if (failures.length) {
      return {
        status: 'fail',
        summary: `reset fail: ${failures[0].slice(0, 160)}`,
        details,
        errors: failures,
      };
    }
    return {
      status: 'pass',
      summary: `reset pass, code tab of ${code.read} stories pass (${code.seconds} s)`,
      details,
    };
  } finally {
    await server?.stop();
  }
};
