/**
 * Site checks (spec 59): what holds across the docs site rather than on one
 * section's pages. Each entry: async ({ page, check }) => void, run after
 * load at the first width, as in the other section lists.
 *
 * - `/sitemap.xml`: every guide page the sitemap lists is fetched as served
 *   HTML, before any script runs, and holds no element id twice (D113: an
 *   example shown twice on one guide carries two ids from the server on).
 * - `/nope` and `/docs/examples/sticky-heder`: a missing address answers 404
 *   with the site's own page (D121): "404", "This page does not exist", the
 *   four sections in order (each answering 200), the docs search box opening
 *   the search dialog, the base select and the theme toggle in the bar, light
 *   and dark, and no sideways scroll at 390 px.
 */

/** The sections of D101, in their order. */
const SECTIONS = ['Get Started', 'Examples', 'Guides', 'API'];

/** Missing addresses: one at the root, one under /docs (a misspelt example). */
const MISSING = ['/nope', '/docs/examples/sticky-heder'];

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

const checks = {
  '/sitemap.xml': async ({ page, check }) => guideIdsUnique(page, check),
  ...Object.fromEntries(
    MISSING.map((route) => [
      route,
      async ({ page, check }) => notFoundPage(page, check),
    ]),
  ),
};

export default checks;
