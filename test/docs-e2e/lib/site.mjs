/**
 * Site checks (spec 59): what holds across the docs site rather than on one
 * section's pages. Each entry: async ({ page, check }) => void, run after
 * load at the first width, as in the other section lists.
 *
 * - `/sitemap.xml`: every guide page the sitemap lists is fetched as served
 *   HTML, before any script runs, and holds no element id twice (D113: an
 *   example shown twice on one guide carries two ids from the server on).
 *   Every sitemap page is fetched the same way for its search head (v1.0.x
 *   D3), and /favicon.ico and the web manifest answer 200.
 * - `/nope` and `/docs/examples/sticky-heder`: a missing address answers 404
 *   with the site's own page (D121): "404", "This page does not exist", the
 *   four sections in order (each answering 200), the docs search box opening
 *   the search dialog, the base select and the theme toggle in the bar, light
 *   and dark, and no sideways scroll at 390 px.
 * - `/docs/examples/sticky-heder` and `/docs/nope`, missing docs addresses
 *   at two depths (Q129): the served HTML is the 404 page inside the root
 *   layout, not Next's empty error page (`id="__next_error__"`), with both
 *   head scripts of app/layout.tsx; a hard load logs no "script tag" error,
 *   the design system script marks <html>, and a stored sidebar width is
 *   applied by the sidebar state script.
 * - A story page under "More examples" (D116, D102, D103): its served HTML
 *   holds the folder open with the current row, its number and its
 *   sub-group label, and no other story row; in the browser the folder is
 *   open, its label ends with the count in brackets, it lists that many
 *   rows, the current row is marked with its running number, and a sub-group
 *   label is no toggle. On `/docs/examples/basic` the folder starts closed,
 *   opens on a click and stays open after a reload.
 * - `/docs/examples/more`, the list of every story page (v1.0.x D5): its
 *   served HTML answers 200 and links each story id of more/meta.json once
 *   from a list item, under one h2 per group label in order, with one h1 and
 *   a description; the served sidebar of `/docs/examples/basic` (More
 *   examples closed) and of a story page (open) links it, and the sitemap
 *   lists it.
 */

import fs from 'node:fs';
import path from 'node:path';
import { MORE_DIR } from '../../../apps/shadcn-table-docs/lib/story-pages.mjs';
import { headerVersion } from './getting-started.mjs';

/** The sections of D101, in their order. */
const SECTIONS = ['Get Started', 'Examples', 'Guides', 'API'];

/** Missing addresses: one at the root, one under /docs (a misspelt example). */
const MISSING = ['/nope', '/docs/examples/sticky-heder', '/docs/nope'];

/** The missing addresses under /docs, whose metadata the docs route builds. */
const MISSING_DOCS = MISSING.filter((r) => r.startsWith('/docs/'));

/** The HTTP status these routes answer with (test.mjs reads it). */
export const status = Object.fromEntries(MISSING.map((r) => [r, 404]));

/** Element ids of served HTML, script bodies left out (their JSON is no markup). */
const servedIds = (html) => {
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  return [...markup.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]);
};

/** The ids that occur more than once in `ids`, each named once. */
const repeatedIds = (ids) =>
  [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))].sort();

/**
 * D113: every guide page in the sitemap, fetched without running scripts,
 * holds each element id once. Names the guides that repeat one, with the
 * repeated ids.
 */
async function guideIdsUnique(page, check) {
  const origin = new URL(page.url()).origin;
  const xml = await (await fetch(`${origin}/sitemap.xml`)).text();
  const guides = [
    ...new Set(
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((m) => new URL(m[1]).pathname)
        .filter((p) => p === '/docs/guides' || p.startsWith('/docs/guides/')),
    ),
  ];
  check('sitemap: guide pages', guides.length > 0, String(guides.length));
  const offenders = [];
  for (const route of guides) {
    const res = await fetch(origin + route);
    if (!res.ok) {
      offenders.push(`${route} (status ${res.status})`);
      continue;
    }
    const repeated = repeatedIds(servedIds(await res.text()));
    if (repeated.length) offenders.push(`${route} (${repeated.join(' ')})`);
  }
  check(
    'served guide HTML: no element id twice',
    offenders.length === 0,
    offenders.join(', '),
  );
}

/** Pages fetched at once by the site head check. */
const HEAD_FETCHES = 8;

/** The attributes of each `<tag ...>` in `html`, as plain objects. */
const tagAttrs = (html, tag) =>
  [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'gi'))].map((m) =>
    Object.fromEntries(
      [...m[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map((a) => [
        a[1].toLowerCase(),
        a[2],
      ]),
    ),
  );

/** The search head of one served page (v1.0.x D3). */
const pageHead = (html) => {
  const head = html.slice(0, html.search(/<\/head>/i) + 1 || undefined);
  const metas = tagAttrs(head, 'meta');
  const links = tagAttrs(head, 'link');
  const article = html.match(/<article\b[\s\S]*<\/article>/i)?.[0] ?? '';
  const h2 = article.search(/<h2[\s>]/i);
  const h3 = article.search(/<h3[\s>]/i);
  const crumbs = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ]
    .flatMap((m) => {
      try {
        const data = JSON.parse(m[1]);
        return Array.isArray(data) ? data : [data];
      } catch {
        return [];
      }
    })
    .filter((d) => d?.['@type'] === 'BreadcrumbList');
  return {
    title: head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '',
    description:
      metas.find((m) => m.name === 'description')?.content?.trim() ?? '',
    ogUrl: metas.find((m) => m.property === 'og:url')?.content ?? '',
    canonical: links.find((l) => l.rel === 'canonical')?.href ?? '',
    manifest: links.find((l) => l.rel === 'manifest')?.href ?? '',
    // An h3 on a page with no h2 at all also skips a level (Q5).
    h3BeforeH2: h3 !== -1 && (h2 === -1 || h3 < h2),
    crumb: crumbs[0]?.itemListElement?.[0]?.item ?? '',
  };
};

/** `items` mapped through `fn`, at most `limit` at a time, in order. */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: limit }, worker));
  return out;
}

/** The first ten of `list` and its count, for a FAIL line. */
const named = (list) =>
  list.length
    ? `${list.length}: ${list.slice(0, 10).join(', ')}${list.length > 10 ? ', ...' : ''}`
    : '';

/**
 * v1.0.x D3: every sitemap page, fetched as served HTML, answers 200 with a
 * description, a title no other page has, an og:url equal to its canonical,
 * no h3 before the first h2 of its article, and a breadcrumb whose first
 * item answers 200; the site serves /favicon.ico and a web manifest.
 */
async function siteHead(page, check) {
  const origin = new URL(page.url()).origin;
  const xml = await (await fetch(`${origin}/sitemap.xml`)).text();
  const routes = [
    ...new Set(
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        (m) => new URL(m[1]).pathname,
      ),
    ),
  ];
  const heads = await mapLimit(routes, HEAD_FETCHES, async (route) => {
    const res = await fetch(origin + route);
    return {
      route,
      status: res.status,
      ...pageHead(res.ok ? await res.text() : ''),
    };
  });

  check(
    'sitemap pages: 200 with a description',
    heads.length > 0 && heads.every((h) => h.status === 200 && h.description),
    named(
      heads
        .filter((h) => h.status !== 200 || !h.description)
        .map((h) => (h.status === 200 ? h.route : `${h.route} (${h.status})`)),
    ),
  );

  const byTitle = Map.groupBy(heads, (h) => h.title);
  const shared = [...byTitle.values()]
    .filter((group) => group.length > 1)
    .map(
      (group) => `"${group[0].title}" ${group.map((h) => h.route).join(' ')}`,
    );
  check('sitemap pages: no title twice', shared.length === 0, named(shared));

  check(
    'sitemap pages: og:url equals the canonical',
    heads.every((h) => h.ogUrl && h.ogUrl === h.canonical),
    named(
      heads
        .filter((h) => !h.ogUrl || h.ogUrl !== h.canonical)
        .map((h) => h.route),
    ),
  );

  check(
    'sitemap pages: no h3 before the first h2',
    heads.every((h) => !h.h3BeforeH2),
    named(heads.filter((h) => h.h3BeforeH2).map((h) => h.route)),
  );

  // The structured data names the deployed origin; the path is what is checked.
  const crumbStatus = new Map();
  for (const h of heads) {
    if (!h.crumb) continue;
    const path = new URL(h.crumb, origin).pathname;
    if (!crumbStatus.has(path))
      crumbStatus.set(
        path,
        (await fetch(origin + path, { redirect: 'manual' })).status,
      );
  }
  check(
    'sitemap pages: breadcrumb item 1 answers 200',
    crumbStatus.size > 0 && [...crumbStatus.values()].every((s) => s === 200),
    named(
      [...crumbStatus]
        .filter(([, s]) => s !== 200)
        .map(([path, s]) => `${path} (${s})`),
    ),
  );

  const icon = await fetch(`${origin}/favicon.ico`);
  const iconType = icon.headers.get('content-type') ?? '';
  check(
    '/favicon.ico: 200 with an icon type',
    icon.status === 200 && /icon/.test(iconType),
    `${icon.status} ${iconType}`,
  );

  const home = heads.find((h) => h.route === '/');
  let manifest = `no <link rel="manifest">`;
  let manifestOk = false;
  if (home?.manifest) {
    const res = await fetch(new URL(home.manifest, origin + '/'));
    const json = res.ok ? await res.json().catch(() => null) : null;
    manifestOk = !!json?.name && Array.isArray(json?.icons);
    manifest = `${home.manifest} ${res.status}`;
  }
  check('web manifest: linked, 200, name and icons', manifestOk, manifest);
}

/** D121: the 404 page of a missing address. */
async function notFoundPage(page, check) {
  const origin = new URL(page.url()).origin;
  const main = page.locator('main');
  check(
    '404: the line "404"',
    await main
      .getByText('404', { exact: true })
      .isVisible()
      .catch(() => false),
  );
  check(
    '404: "This page does not exist"',
    await main
      .getByRole('heading', { name: 'This page does not exist' })
      .isVisible()
      .catch(() => false),
  );

  const links = main.locator('nav[aria-label="Sections"] a');
  const texts = (await links.allTextContents()).map((t) => t.trim());
  check(
    '404: section links in order',
    texts.join('|') === SECTIONS.join('|'),
    texts.join('|'),
  );
  const broken = [];
  for (const href of await links.evaluateAll((els) =>
    els.map((el) => el.getAttribute('href')),
  )) {
    const res = await fetch(origin + href);
    if (res.status !== 200) broken.push(`${href} ${res.status}`);
  }
  check(
    '404: section links answer 200',
    broken.length === 0,
    broken.join(', '),
  );

  const bar = page.locator('header').first();
  const baseSelect = bar.locator('button[aria-label="Base"]');
  const themeToggle = bar.locator(
    'button[aria-label="Toggle light or dark mode"]',
  );
  check('404: base select in the bar', await baseSelect.isVisible());
  check('404: theme toggle in the bar', await themeToggle.isVisible());
  // the 404 page renders the home header (components/not-found-page.tsx)
  await headerVersion({
    page,
    check,
    selector: 'header.v4-nav',
    prefix: '404: ',
  });

  const search = main.locator('[data-search-full]');
  await search.click();
  const dialog = page.getByRole('dialog');
  const opened = await dialog
    .first()
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  check('404: search box opens the search dialog', opened);
  await page.keyboard.press('Escape');
  await dialog
    .first()
    .waitFor({ state: 'hidden', timeout: 5000 })
    .catch(() => {});

  const isDark = () =>
    page.evaluate(() => document.documentElement.classList.contains('dark'));
  const startDark = await isDark();
  await themeToggle.click();
  await page
    .waitForFunction(
      (was) => document.documentElement.classList.contains('dark') !== was,
      startDark,
      { timeout: 5000 },
    )
    .catch(() => {});
  const flipped = (await isDark()) !== startDark;
  check(
    '404: light and dark',
    flipped && (await main.getByText('404', { exact: true }).isVisible()),
    `dark before=${startDark} after=${await isDark()}`,
  );
  await themeToggle.click();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  check('404 @390: no sideways scroll', overflow <= 0, `overflow=${overflow}`);
  check(
    '404 @390: base select and theme toggle in the bar',
    (await baseSelect.isVisible()) && (await themeToggle.isVisible()),
  );
}

/**
 * Q129: a missing docs address renders the 404 page inside the root layout,
 * so the head scripts of app/layout.tsx come with the served HTML and run.
 * When the docs route threw notFound() for it (metadata or page), Next
 * served its empty error page and the browser built the whole document,
 * scripts included, which never ran (React logs "Encountered a script tag"
 * in development).
 * The browser part runs in its own tab with its own error listeners; the
 * sidebar width key is lib/sidebar-state.ts's, the <html> mark
 * lib/design-system/config.ts's.
 */
async function missingDocsPageHead(page, check, route) {
  const origin = new URL(page.url()).origin;
  const res = await fetch(origin + route);
  const html = await res.text();
  check('served 404: status', res.status === 404, String(res.status));
  check(
    'served 404: not the empty error page',
    !html.includes('id="__next_error__"'),
  );
  check(
    'served 404: the 404 page text',
    html.includes('>404<') && html.includes('This page does not exist'),
  );
  const head = /<head>([\s\S]*?)<\/head>/.exec(html)?.[1] ?? '';
  const inlineScripts = [...head.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    (m) => m[1],
  );
  check(
    'served 404: both head scripts',
    inlineScripts.some((s) => s.includes('"data-design-system"')) &&
      inlineScripts.some((s) => s.includes('"docs-sidebar-width"')),
    `inline head scripts=${inlineScripts.length}`,
  );

  const tab = await page.context().newPage();
  const errors = [];
  tab.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  tab.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  try {
    await tab.goto(origin + '/');
    await tab.evaluate(() => localStorage.setItem('docs-sidebar-width', '360'));
    await tab.goto(origin + route, {
      waitUntil: 'networkidle',
      timeout: 90000,
    });
    await tab.waitForTimeout(1000);
    const script = errors.filter((e) => /script tag/i.test(e));
    check(
      'hard load: no script tag error',
      script.length === 0,
      script.map((e) => e.split('\n')[0].slice(0, 160)).join(' || '),
    );
    check(
      'hard load: design system mark on <html>',
      await tab.evaluate(() =>
        document.documentElement.hasAttribute('data-design-system'),
      ),
    );
    const width = await tab.evaluate(() =>
      document.documentElement.style.getPropertyValue('--docs-sidebar-width'),
    );
    check('hard load: stored sidebar width mark', width === '360px', width);
  } finally {
    await tab.evaluate(() => localStorage.removeItem('docs-sidebar-width'));
    await tab.close();
  }
}

/** A story page in the middle of "More examples" (spec 59, D116). */
const STORY_ROUTE =
  '/docs/examples/more/features-column-pinning--column-pinning-initial';
/** Its sub-group label in the sidebar, without the count. */
const STORY_GROUP = 'Features/Column Pinning';

/** The visible text of an HTML fragment, tags dropped. */
const textOf = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');

/**
 * D116: the served story page HTML (no scripts run) carries "More examples"
 * open with only the current row, numbered, under its sub-group label.
 */
async function servedStoryRow(page, check) {
  const origin = new URL(page.url()).origin;
  const html = await (await fetch(origin + STORY_ROUTE)).text();
  const start = html.indexOf('<aside');
  const aside = html.slice(start, html.indexOf('</aside>', start));
  const storyLinks = aside.match(/href="\/docs\/examples\/more\//g) ?? [];
  check(
    'served HTML: one story row, the current one',
    storyLinks.length === 1 && aside.includes(`href="${STORY_ROUTE}"`),
    `story links=${storyLinks.length}`,
  );
  const active = /<a [^>]*data-active="true"[^>]*>([\s\S]*?)<\/a>/.exec(aside);
  check(
    'served HTML: current row with its number',
    active !== null && /^\d+\. Column Pinning Initial$/.test(textOf(active[1])),
    active ? textOf(active[1]) : 'none',
  );
  check(
    'served HTML: More examples open, with its sub-group label',
    /aria-expanded="true"[^>]*>(?:<[^>]*>)*More examples/.test(aside) &&
      textOf(aside).includes(STORY_GROUP),
  );
}

/** The page that lists every story page (v1.0.x D5). */
const LIST_ROUTE = '/docs/examples/more';
/** more/meta.json `pages`: "---Group---" labels and story ids, in order. */
const MORE_ENTRIES = JSON.parse(
  fs.readFileSync(path.join(MORE_DIR, 'meta.json'), 'utf8'),
).pages;

/** The served `<aside>` of `route`, before any script runs. */
const servedAside = async (origin, route) => {
  const html = await (await fetch(origin + route)).text();
  const start = html.indexOf('<aside');
  return start === -1 ? '' : html.slice(start, html.indexOf('</aside>', start));
};

/**
 * D5: the served list page links every story page of more/meta.json once,
 * each from a list item under its group's h2, in meta.json order.
 */
async function storyListPage(page, check) {
  const origin = new URL(page.url()).origin;
  const res = await fetch(origin + LIST_ROUTE);
  const html = res.ok ? await res.text() : '';
  check('list page: served 200', res.status === 200, String(res.status));
  const article = html.match(/<article\b[\s\S]*<\/article>/i)?.[0] ?? '';
  const linked = [
    ...article.matchAll(
      /<li\b[^>]*>\s*<a\b[^>]*\bhref="\/docs\/examples\/more\/([^"#?]+)"/g,
    ),
  ].map((m) => m[1]);
  const ids = MORE_ENTRIES.filter((entry) => !entry.startsWith('---'));
  const have = new Set(linked);
  const missing = ids.filter((id) => !have.has(id));
  const extra = linked.filter(
    (id, i) => !ids.includes(id) || linked.indexOf(id) !== i,
  );
  check(
    'list page: one link per story page of more/meta.json',
    linked.length === ids.length && missing.length === 0 && extra.length === 0,
    `links=${linked.length} stories=${ids.length} missing=${named(missing)} extra=${named(extra)}`,
  );
  const h1 = html.match(/<h1[\s>]/g)?.length ?? 0;
  check('list page: one h1', h1 === 1, `h1=${h1}`);
  check('list page: a description', pageHead(html).description.length > 0);
  // the heading's copy-link button carries text of its own
  const h2 = [...article.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map((m) =>
    textOf(m[1].replace(/<button\b[\s\S]*?<\/button>/g, '')).trim(),
  );
  const groups = MORE_ENTRIES.filter((entry) => entry.startsWith('---')).map(
    (entry) => entry.slice(3, -3),
  );
  check(
    'list page: h2 per group label, in order',
    h2.join('|') === groups.join('|'),
    `h2=${h2.length} groups=${groups.length}`,
  );
}

/** D5: the served sidebar links the list page, More examples closed and open. */
async function servedListLink(page, check) {
  const origin = new URL(page.url()).origin;
  for (const [route, state] of [
    ['/docs/examples/basic', 'closed'],
    [STORY_ROUTE, 'open'],
  ]) {
    const aside = await servedAside(origin, route);
    check(
      `served sidebar of ${route} (${state}): links ${LIST_ROUTE}`,
      aside.includes(`href="${LIST_ROUTE}"`),
    );
  }
}

/** The "More examples" trigger of the desktop sidebar. */
const moreTrigger = (page) =>
  page.locator('#nd-sidebar button[data-slot="collapsible-trigger"]', {
    hasText: 'More examples',
  });

/**
 * D102, D103 in the browser: the story page's folder is open and lists all
 * its rows, numbered, the current one marked; sub-group labels are no
 * toggle. Then `/docs/examples/basic`: closed, opened by a click, still open
 * after a reload (the stored state is cleared first and restored after).
 */
async function moreExamplesSidebar(page, check) {
  const more = moreTrigger(page);
  check(
    'More examples open on a story page',
    (await more.getAttribute('aria-expanded').catch(() => null)) === 'true',
  );
  const label = ((await more.textContent()) ?? '').trim();
  const count = Number(/\((\d+)\)$/.exec(label)?.[1] ?? NaN);
  check('More examples label ends with its count', count > 0, label);
  const rows = page.locator('#nd-sidebar a[href^="/docs/examples/more/"]');
  const texts = (await rows.allTextContents()).map((t) => t.trim());
  check(
    'More examples lists as many rows as its count',
    texts.length === count,
    `rows=${texts.length} count=${count}`,
  );
  const first = Number(/^(\d+)\./.exec(texts[0] ?? '')?.[1] ?? NaN);
  const numbered = texts.every((t, i) => t.startsWith(`${first + i}. `));
  check('More examples rows numbered in order', numbered, texts[0] ?? '');
  const hrefs = await rows.evaluateAll((els) =>
    els.map((el) => el.getAttribute('href')),
  );
  const index = hrefs.indexOf(STORY_ROUTE);
  const active = (
    (await page.locator('#nd-sidebar a[data-active="true"]').textContent()) ??
    ''
  ).trim();
  check(
    'current row marked with its running number',
    index >= 0 && active === texts[index],
    active,
  );
  const subgroup = page
    .locator('#nd-sidebar [data-subgroup]', { hasText: STORY_GROUP })
    .first();
  check(
    'sub-group label is no toggle',
    (await subgroup.count()) === 1 &&
      (await subgroup.locator('button').count()) === 0 &&
      (await subgroup.evaluate((el) => el.closest('button') === null)),
  );

  const origin = new URL(page.url()).origin;
  const clearStored = () =>
    page.evaluate(() => {
      for (const key of Object.keys(localStorage))
        if (key.startsWith('docs-sidebar-open:')) localStorage.removeItem(key);
    });
  await clearStored();
  await page.goto(origin + '/docs/examples/basic', {
    waitUntil: 'networkidle',
    timeout: 90000,
  });
  const expanded = async () =>
    (await moreTrigger(page)
      .getAttribute('aria-expanded')
      .catch(() => null)) === 'true';
  check('basic: More examples starts closed', !(await expanded()));
  await moreTrigger(page).click();
  check(
    'basic: More examples opens on a click',
    (await expanded()) && (await rows.count()) === count,
    `rows=${await rows.count()}`,
  );
  await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
  await moreTrigger(page)
    .waitFor({ timeout: 10000 })
    .catch(() => {});
  check('basic: More examples still open after a reload', await expanded());
  await clearStored();
}

const checks = {
  [STORY_ROUTE]: async ({ page, check }) => {
    await servedStoryRow(page, check);
    await servedListLink(page, check);
    await moreExamplesSidebar(page, check);
  },
  [LIST_ROUTE]: async ({ page, check }) => {
    await storyListPage(page, check);
  },
  '/sitemap.xml': async ({ page, check }) => {
    await guideIdsUnique(page, check);
    await siteHead(page, check);
    const xml = await (
      await fetch(`${new URL(page.url()).origin}/sitemap.xml`)
    ).text();
    // the origin is the deployment's (NEXT_PUBLIC_SITE_URL); the path is checked
    check(
      `sitemap: lists ${LIST_ROUTE}`,
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].some(
        (m) => new URL(m[1]).pathname === LIST_ROUTE,
      ),
    );
  },
  ...Object.fromEntries(
    MISSING.map((route) => [
      route,
      async ({ page, check }) => {
        await notFoundPage(page, check);
        if (MISSING_DOCS.includes(route))
          await missingDocsPageHead(page, check, route);
      },
    ]),
  ),
};

export default checks;
