/**
 * Cluster E page checks: examples/faceted-values to examples/virtualized and
 * the home page. Each example page renders its own example in one playground
 * panel (no group tab strip), so a page asserts that panel, its table rows,
 * the Code toggle and the page's feature marker. The home page asserts the new
 * landing: hero, install command, live demo rows, feature and install
 * headings, guide links, then holds the page through the full live demo loop
 * on Base UI, Radix UI and React Aria (demoLoop in _helpers.mjs).
 */
import { codeToggle, demoLoop, example } from './_helpers.mjs';

/**
 * An example page renders exactly one playground panel (data-mode) and no
 * group tab strip; the explorer's file tree is a nav, not a tablist.
 */
async function singleExample(page, check) {
  const panels = await page.locator('article [data-mode]').count();
  check('single example panel', panels === 1, `panels=${panels}`);
  const strips = await page
    .locator('article [role="tablist"]:not([aria-label="Source files"])')
    .count();
  check('no group tab strip', strips === 0, `tablists=${strips}`);
}

/** One example page: single panel, example rows, Code toggle, feature marker. */
const examplePage =
  (id, needle, marker) =>
  async ({ page, check }) => {
    await singleExample(page, check);
    const w = await example(page, id, check);
    if (marker) await marker(page, w, check);
    await codeToggle(page, id, needle, check);
  };

const checks = {
  '/docs/examples': async ({ page, check }) => {
    const links = page.locator('main a[href^="/docs/examples/"]');
    check(
      'example links',
      (await links.count()) >= 40,
      `n=${await links.count()}`,
    );
  },
  '/docs/examples/faceted-values': examplePage(
    'enable-filter-facet-values',
    'enableFacetedValues: true',
    async (page, w, check) => {
      const selects = w.locator('thead select, thead [role="combobox"]');
      check('faceted select filters', (await selects.count()) > 0);
    },
  ),
  '/docs/examples/filter-switching': examplePage(
    'customize-filter-modes',
    'enableColumnFilterModes: true',
    async (page, w, check) => {
      check(
        'filter mode buttons',
        (await w.locator('thead button[aria-label*="filter mode" i]').count()) >
          0,
      );
    },
  ),
  '/docs/examples/filter-variants': examplePage(
    'customize-filter-variants',
    "filterVariant: 'range-slider'",
    async (page, w, check) => {
      // Radix and React Aria thumbs carry role=slider, the Base UI thumb is a range input.
      check(
        'range slider filter',
        (await w
          .locator('thead [role="slider"], thead input[type="range"]')
          .count()) > 0,
      );
    },
  ),
  '/docs/examples/popover-filters': examplePage(
    'alternate-column-filtering',
    "columnFilterDisplayMode: 'popover'",
    async (page, w, check) => {
      check(
        'no inline filter inputs',
        (await w.locator('thead input').count()) === 0,
      );
      check(
        'filter buttons in head',
        (await w.locator('thead button').count()) > 0,
      );
    },
  ),
  '/docs/examples/infinite-scrolling': examplePage(
    'infinite-scrolling',
    'useInfiniteQuery',
    async (page, w, check) => {
      const txt = await w.textContent();
      check('fetched count text', /Fetched \d+ of \d+ total rows/.test(txt));
    },
  ),
  '/docs/examples/row-virtualization': examplePage(
    'enable-row-virtualization',
    'enableRowVirtualization: true',
    async (page, w, check) => {
      const n = await w.locator('table tbody tr').count();
      check(
        'virtualized rows (fewer than 10000)',
        n > 0 && n < 200,
        `rows=${n}`,
      );
    },
  ),
  '/docs/examples/virtualized': examplePage(
    'virtualized',
    'enableColumnVirtualization: true',
    async (page, w, check) => {
      const n = await w.locator('table tbody tr').count();
      check(
        'virtualized rows (fewer than 10000)',
        n > 0 && n < 200,
        `rows=${n}`,
      );
    },
  ),
  '/docs/examples/react-query': examplePage('react-query', 'useQuery'),
  '/docs/examples/remote': examplePage('remote', 'manualPagination: true'),
  '/docs/examples/lazy-detail-panel': examplePage(
    'lazy-detail-panel',
    '/api/moredata/',
    async (page, w, check) => {
      const expand = w.locator('tbody button[aria-label*="expand" i]').first();
      check('expand button', (await expand.count()) > 0);
      if (!(await expand.count())) return;
      await expand.click();
      await page.waitForTimeout(2500);
      const txt = await w.textContent();
      check('detail panel loaded', /Favorite Music|favoriteMusic/i.test(txt));
    },
  ),
  '/docs/examples/lazy-sub-rows': examplePage(
    'lazy-sub-rows',
    '/api/treedata',
    async (page, w, check) => {
      check(
        'expand buttons',
        (await w.locator('tbody button[aria-label*="expand" i]').count()) > 0,
      );
    },
  ),
  '/docs/examples/minimal': examplePage(
    'minimal',
    'ST_Table',
    async (page, w, check) => {
      check('caption', (await w.locator('table caption').count()) === 1);
      check(
        'no toolbar',
        (await w
          .locator('input[type="search"], input[placeholder*="Search" i]')
          .count()) === 0,
      );
    },
  ),
  '/docs/examples/row-dragging': examplePage(
    'enable-row-dragging',
    'enableRowDragging: true',
    async (page, w, check) => {
      check(
        'two tables',
        (await w.locator('table').count()) === 2,
        `tables=${await w.locator('table').count()}`,
      );
    },
  ),
  '/docs/examples/row-ordering': examplePage(
    'enable-row-ordering',
    'enableRowOrdering: true',
    async (page, w, check) => {
      check(
        'drag handles',
        (await w
          .locator(
            'tbody button[aria-label*="drag" i], tbody [draggable="true"]',
          )
          .count()) > 0,
      );
    },
  ),
  '/docs/examples/sticky-header': examplePage(
    'enable-sticky-header',
    'enableStickyHeader: true',
    async (page, w, check) => {
      const pos = await w
        .locator('thead')
        .first()
        .evaluate((el) => getComputedStyle(el).position);
      check('thead sticky', pos === 'sticky', pos);
    },
  ),
  '/docs/examples/sticky-row-pinning': examplePage(
    'enable-row-pinning-sticky',
    'enableRowPinning: true',
    async (page, w, check) => {
      check(
        'pin buttons',
        (await w.locator('tbody button[aria-label*="pin" i]').count()) > 0,
      );
    },
  ),
  '/docs/examples/static-row-pinning': examplePage(
    'enable-row-pinning-static',
    "rowPinningDisplayMode: 'top-and-bottom'",
    async (page, w, check) => {
      check(
        'pin buttons',
        (await w.locator('tbody button[aria-label*="pin" i]').count()) > 0,
      );
    },
  ),
  '/docs/examples/sticky-row-selection': examplePage(
    'enable-row-pinning-select',
    "rowPinningDisplayMode: 'select-sticky'",
    async (page, w, check) => {
      check(
        'row checkboxes',
        (await w
          .locator('tbody [role="checkbox"], tbody input[type="checkbox"]')
          .count()) > 0,
      );
    },
  ),
  '/': async ({ page, check, base }) => {
    const h1 = page.locator('h1').first();
    check(
      'hero title',
      /shadcn\s*-?\s*table/i.test((await h1.textContent()) ?? ''),
    );
    const main = page.locator('main, body');
    const txt = (await main.first().textContent()) ?? '';
    const bar = page.locator('[data-slot="agent-bar"]');
    check('agent bar', (await bar.count()) === 1);
    check('agent prompt', txt.includes('Install shadcn-table in my app:'));
    await bar.getByRole('radio', { name: 'Command' }).click();
    // The hosted registry URL of the selected base (the default, Base UI, or
    // the runner's --base); the origin is the dev server's in dev.
    check(
      'install command',
      /pnpm dlx shadcn@latest add \S+\/r\/[a-z]+\/shadcn-table\.json/.test(
        (await bar.textContent()) ?? '',
      ),
    );
    check(
      'copy command label',
      (await bar.getByRole('button', { name: 'Copy command' }).count()) === 1,
    );
    check('no V3 alert', !/was released September 5th, 2024/.test(txt));
    check(
      'agent bar',
      (await page.locator('[data-slot="agent-bar"]').count()) === 1,
    );
    // the live demo table is client-rendered (next/dynamic)
    const rows = page.locator('table tbody tr');
    await rows
      .first()
      .waitFor({ timeout: 30000 })
      .catch(() => {});
    check(
      'live demo rows',
      (await rows.count()) > 0,
      `rows=${await rows.count()}`,
    );
    check('features heading', txt.includes('Everything you need'));
    check(
      'install steps heading',
      txt.includes('Up and running in three steps'),
    );
    const guides = page.locator('a[href^="/docs/guides/"]');
    check(
      'guide links',
      (await guides.count()) >= 10,
      `guides=${await guides.count()}`,
    );
    check(
      'no contributors section',
      !txt.includes('Maintainers and Contributors'),
    );
    await demoLoop({ page, check, base });
  },
};

export default checks;
