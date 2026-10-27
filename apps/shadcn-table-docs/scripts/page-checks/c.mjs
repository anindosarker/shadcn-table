/**
 * Cluster C page checks: guides/editing through guides/virtualization
 * (guides/pagination lives in a.mjs). Each entry: async ({ page, check }) =>
 * void, run after load at the first width.
 */
import { example, exampleGroup, panelOf, propTable } from './_helpers.mjs';

/** The feature's visible marker inside an example wrapper. */
async function marker(wrapper, id, label, selector, check) {
  const n = await wrapper.locator(selector).count();
  check(`${id}: ${label}`, n > 0, `found=${n}`);
}

const TABLE = '#relevant-props-table';
const STATE = '#relevant-state-options-table';
const COLUMN = '#relevant-column-options-table';

const checks = {
  '/docs/guides/editing': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, COLUMN, check);
    await propTable(page, STATE, check);
    await exampleGroup(
      page,
      [
        ['Modal', 'editing-crud-modal'],
        ['Inline Row', 'editing-crud-row'],
        ['Inline Cell', 'editing-crud-cell'],
        ['Inline Table', 'editing-crud-table'],
        ['Tree Editing', 'editing-crud-tree'],
      ],
      check,
    );
    const modalTab = page.locator('[role="tab"]', { hasText: 'Modal' }).first();
    await modalTab.click();
    const w = await example(page, 'editing-crud-modal', check);
    // ST_Tooltip adds no aria-label to its trigger (MUI did); match the icon.
    await marker(
      w,
      'editing-crud-modal',
      'edit button',
      'tbody button:has(.lucide-pencil)',
      check,
    );
  },
  '/docs/guides/expanding-sub-rows': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, STATE, check);
    for (const id of [
      'enable-expanding-tree',
      'expanding-tree-expanded',
      'expanding-tree-root-expanded',
      'expanding-tree-flat-parse',
      'lazy-sub-rows',
    ]) {
      const w = await example(page, id, check);
      await marker(
        w,
        id,
        'expand button',
        'button[aria-label*="Expand" i], button[aria-label*="Collapse" i]',
        check,
      );
    }
  },
  '/docs/guides/full-screen-toggle': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, STATE, check);
  },
  '/docs/guides/global-filtering': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, COLUMN, check);
    await propTable(page, STATE, check);
    const custom = await example(
      page,
      'customize-global-filter-component',
      check,
    );
    await marker(
      custom,
      'customize-global-filter-component',
      'search input',
      'input[placeholder^="Search "][placeholder$=" rows"]',
      check,
    );
    const remote = await example(page, 'remote', check);
    await marker(
      remote,
      'remote',
      'search toggle',
      'button[aria-label*="search" i], input[placeholder*="Search" i]',
      check,
    );
  },
  // content/docs/guides/index.mdx is served at /docs/guides (fumadocs index).
  '/docs/guides': async ({ page, check }) => {
    const links = await page.locator('main a[href^="/docs/guides/"]').count();
    check('guides toc links', links > 10, `links=${links}`);
  },
  '/docs/guides/localization': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    // 38 locale files; the header's base switch (#nd-subnav) has two tabs of its own.
    const tabs = await page.locator('[role="tab"]:not(#nd-subnav *)').count();
    check('locale tabs', tabs === 38, `tabs=${tabs}`);
    const es = await example(page, 'localization-i18n-es', check);
    await marker(
      es,
      'localization-i18n-es',
      'spanish header',
      'th:has-text("Nombre")',
      check,
    );
    await exampleGroup(
      page,
      [
        ['de', 'localization-i18n-de'],
        ['fa', 'localization-i18n-fa'],
        ['zh-Hant', 'localization-i18n-zh-hant'],
      ],
      check,
    );
    const de = panelOf(page, 'localization-i18n-de');
    await page.locator('[role="tab"]', { hasText: /^de$/ }).first().click();
    await marker(
      de,
      'localization-i18n-de',
      'german header',
      'th:has-text("Vorname")',
      check,
    );
    const fa = panelOf(page, 'localization-i18n-fa');
    await page.locator('[role="tab"]', { hasText: /^fa$/ }).first().click();
    await marker(
      fa,
      'localization-i18n-fa',
      'rtl wrapper',
      '[style*="direction: rtl"]',
      check,
    );
  },
  '/docs/guides/memoization': async ({ page, check }) => {
    await propTable(page, TABLE, check);
  },
  '/docs/guides/production-ready-tables': async ({ page, check }) => {
    const w = await example(page, 'server-side-data', check);
    await marker(
      w,
      'server-side-data',
      'refresh button',
      'button:has(.lucide-refresh-cw)',
      check,
    );
    check('steps', (await page.locator('article h3').count()) >= 4);
    // Multi-file example: the code explorer lists every file in its tree.
    await w
      .locator('button', { hasText: /^Code$/ })
      .first()
      .click();
    const files = await w
      .locator(
        '[data-slot="code-explorer"] nav [data-tree-row]:not([data-folder])',
      )
      .count();
    check(
      'server-side-data: 5 files in the tree',
      files === 5,
      `files=${files}`,
    );
    await w
      .locator('button', { hasText: /^Preview$/ })
      .first()
      .click();
  },
  '/docs/guides/server-side-data': async ({ page, check }) => {
    check(
      'redirects to guides/production-ready-tables',
      page.url().endsWith('/docs/guides/production-ready-tables'),
      page.url(),
    );
  },
  '/docs/getting-started/production-ready-tables': async ({ page, check }) => {
    check(
      'redirects to guides/production-ready-tables',
      page.url().endsWith('/docs/guides/production-ready-tables'),
      page.url(),
    );
  },
  '/docs/guides/row-actions': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    const menu = await example(page, 'row-actions-menu-items', check);
    await marker(
      menu,
      'row-actions-menu-items',
      'row actions button',
      'button[aria-label="Row Actions"]',
      check,
    );
    const buttons = await example(page, 'row-actions-buttons', check);
    await marker(
      buttons,
      'row-actions-buttons',
      'action buttons',
      'tbody button',
      check,
    );
  },
  '/docs/guides/row-numbers': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    for (const id of [
      'enable-row-numbers-original',
      'enable-row-numbers-static',
    ]) {
      const w = await example(page, id, check);
      await marker(w, id, 'row number header', 'th:has-text("#")', check);
    }
  },
  '/docs/guides/row-ordering-dnd': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, STATE, check);
    for (const id of ['enable-row-ordering', 'enable-row-dragging']) {
      const w = await example(page, id, check);
      await marker(w, id, 'drag handle', 'button[aria-label*="Move" i]', check);
    }
  },
  '/docs/guides/row-pinning': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, STATE, check);
    for (const id of [
      'enable-row-pinning-sticky',
      'enable-row-pinning-static',
      'enable-row-pinning-select',
    ]) {
      const w = await example(page, id, check);
      await marker(
        w,
        id,
        'pin control',
        'button[aria-label*="Pin" i], input[type="checkbox"], button[role="checkbox"]',
        check,
      );
    }
  },
  '/docs/guides/row-selection': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, STATE, check);
    for (const id of [
      'enable-row-selection',
      'single-row-selection',
      'manual-selection',
      'customize-row-selection',
      'enable-row-pinning-select',
    ]) {
      const w = await example(page, id, check);
      await marker(
        w,
        id,
        'select control',
        'tbody input[type="checkbox"], tbody button[role="checkbox"], tbody button[role="radio"], tbody tr[class*="cursor-pointer"]',
        check,
      );
    }
  },
  '/docs/guides/sorting': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, COLUMN, check);
    await propTable(page, STATE, check);
    const multi = await example(page, 'multi-sorting', check);
    await marker(
      multi,
      'multi-sorting',
      'sort label',
      'th button[aria-label*="Sort" i], th [aria-label*="Sort" i]',
      check,
    );
    await example(page, 'remote', check);
  },
  '/docs/guides/state-management': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await example(page, 'persistent-state', check);
  },
  '/docs/guides/sticky-header': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    const w = await example(page, 'enable-sticky-header', check);
    await marker(
      w,
      'enable-sticky-header',
      'sticky thead',
      'thead [class*="sticky"], thead[class*="sticky"], thead th[class*="sticky"]',
      check,
    );
  },
  '/docs/guides/table-event-listeners': async ({ page, check }) => {
    // One h3 (shadcn components) with an h4 per listener example, as in MRT.
    const headings = await page.locator('main h4').count();
    check('event listener sections', headings > 3, `h4=${headings}`);
  },
  '/docs/guides/toolbar-customization': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, STATE, check);
    await example(page, 'minimal', check);
    const custom = await example(page, 'custom-top-toolbar', check);
    await marker(
      custom,
      'custom-top-toolbar',
      'custom toolbar buttons',
      'button:has-text("Create Account")',
      check,
    );
    const external = await example(page, 'external-toolbar', check);
    await marker(
      external,
      'external-toolbar',
      'external pagination',
      'nav, [data-slot="pagination"], button[aria-label*="page" i]',
      check,
    );
  },
  '/docs/guides/virtualization': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    for (const id of [
      'enable-row-virtualization',
      'enable-column-virtualization',
    ]) {
      const w = await example(page, id, check);
      const rows = await w.locator('table tbody tr').count();
      check(`${id}: virtualized row window`, rows < 200, `rows=${rows}`);
    }
  },
};

export default checks;
