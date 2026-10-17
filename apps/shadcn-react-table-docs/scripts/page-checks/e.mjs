/**
 * Cluster E page checks: examples/faceted-values to examples/virtualized and
 * the home page. Each example page renders one tabbed group (isPage): the
 * active tab follows the route, so a page asserts its tab strip, its own
 * example (table with rows) and the page's feature marker.
 */
import { codeToggle, example } from './_helpers.mjs';

/** Tab strip of an isPage group: every label present, the route's tab active. */
async function groupTabs(page, labels, activeLabel, check) {
  const tabs = page.locator('[role="tab"]');
  await tabs
    .first()
    .waitFor({ timeout: 30000 })
    .catch(() => {});
  const texts = (await tabs.allTextContents()).map((t) => t.trim());
  check(
    'group tabs',
    labels.every((l) => texts.includes(l)),
    texts.join('|'),
  );
  const active = page.locator('[role="tab"][data-state="active"]');
  check(
    `active tab "${activeLabel}"`,
    (
      (await active
        .first()
        .textContent()
        .catch(() => '')) ?? ''
    ).trim() === activeLabel,
  );
}

const FILTERING = [
  'Filter Variants',
  'Faceted Values',
  'Filter Switching',
  'Popover Filters',
  'Custom Filter UI',
];
const VIRTUALIZED = [
  'Fully Virtualized',
  'Row Virtualization',
  'Column Virtualization',
  'Infinite Scrolling',
];
const REMOTE = [
  'React Query',
  'useEffect',
  'Dynamic Columns',
  'Lazy Detail Panel',
  'Lazy Sub-Rows',
];
const DRAGGING = ['Column Ordering', 'Row Ordering', 'Row Dragging'];
const STICKY = [
  'Sticky Header',
  'Column Pinning',
  'Row Pinning (Sticky)',
  'Row Pinning (Static)',
  'Sticky Row Selection',
];
const BASIC = ['Basic', 'Minimal', 'Advanced', 'Custom Headless'];

/** One example page: tabs, example rows, Code toggle, feature marker. */
const examplePage =
  (labels, activeLabel, id, needle, marker) =>
  async ({ page, check }) => {
    await groupTabs(page, labels, activeLabel, check);
    const w = await example(page, id, check);
    if (marker) await marker(page, w, check);
    await codeToggle(page, w, id, needle, check);
  };

export default {
  '/docs/examples': async ({ page, check }) => {
    const links = page.locator('main a[href^="/docs/examples/"]');
    check(
      'example links',
      (await links.count()) >= 40,
      `n=${await links.count()}`,
    );
  },
  '/docs/examples/faceted-values': examplePage(
    FILTERING,
    'Faceted Values',
    'enable-filter-facet-values',
    'enableFacetedValues: true',
    async (page, w, check) => {
      const selects = w.locator('thead select, thead [role="combobox"]');
      check('faceted select filters', (await selects.count()) > 0);
    },
  ),
  '/docs/examples/filter-switching': examplePage(
    FILTERING,
    'Filter Switching',
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
    FILTERING,
    'Filter Variants',
    'customize-filter-variants',
    "filterVariant: 'range-slider'",
    async (page, w, check) => {
      check(
        'range slider filter',
        (await w.locator('thead [role="slider"]').count()) > 0,
      );
    },
  ),
  '/docs/examples/popover-filters': examplePage(
    FILTERING,
    'Popover Filters',
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
    VIRTUALIZED,
    'Infinite Scrolling',
    'infinite-scrolling',
    'useInfiniteQuery',
    async (page, w, check) => {
      const txt = await w.textContent();
      check('fetched count text', /Fetched \d+ of \d+ total rows/.test(txt));
    },
  ),
  '/docs/examples/row-virtualization': examplePage(
    VIRTUALIZED,
    'Row Virtualization',
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
    VIRTUALIZED,
    'Fully Virtualized',
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
  '/docs/examples/react-query': examplePage(
    REMOTE,
    'React Query',
    'react-query',
    'useQuery',
  ),
  '/docs/examples/remote': examplePage(
    REMOTE,
    'useEffect',
    'remote',
    'manualPagination: true',
  ),
  '/docs/examples/lazy-detail-panel': examplePage(
    REMOTE,
    'Lazy Detail Panel',
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
    REMOTE,
    'Lazy Sub-Rows',
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
    BASIC,
    'Minimal',
    'minimal',
    'SRT_Table',
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
    DRAGGING,
    'Row Dragging',
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
    DRAGGING,
    'Row Ordering',
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
    STICKY,
    'Sticky Header',
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
    STICKY,
    'Row Pinning (Sticky)',
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
    STICKY,
    'Row Pinning (Static)',
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
    STICKY,
    'Sticky Row Selection',
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
  '/': async ({ page, check }) => {
    const h1 = page.locator('h1').first();
    check(
      'hero title',
      /Shadcn\s*React\s*Table/.test((await h1.textContent()) ?? ''),
    );
    const main = page.locator('main, body');
    const txt = (await main.first().textContent()) ?? '';
    check(
      'install command',
      txt.includes(
        'pnpm dlx shadcn@latest add anindosarker/shadcn-react-table/shadcn-react-table',
      ),
    );
    check('no V3 alert', !/was released September 5th, 2024/.test(txt));
    check(
      'popular docs',
      txt.includes('Popular Docs') && txt.includes('Best Practices'),
    );
    await groupTabs(page, BASIC, 'Basic', check);
    await example(page, 'basic', check);
    check('comparison heading', txt.includes("Let's Compare"));
    check('feature comparison heading', txt.includes('Feature Comparison'));
    const tables = page.locator('table');
    check(
      'comparison + feature tables',
      (await tables.count()) >= 3,
      `tables=${await tables.count()}`,
    );
    check(
      'no contributors section',
      !txt.includes('Maintainers and Contributors'),
    );
  },
};
