/**
 * Cluster D page checks: docs/examples a to e (advanced ... export-pdf).
 * Every page renders an example group (components/example-tabs.tsx): the
 * route's example is the active tab and clicking another tab navigates to
 * that example's page, so each page asserts its own example plus the tab
 * strip, and one page per group follows a sibling tab to another D page.
 */
import { example } from './_helpers.mjs';

const expandButtons = (w) => w.locator('button[aria-label="Expand"]');

async function hasText(w, id, re, check) {
  const txt = (await w.innerText().catch(() => '')) ?? '';
  check(`${id}: text ${re}`, re.test(txt));
}

/** The group's tab strip shows every tab label, in order. */
async function tabStrip(page, labels, check) {
  const tabs = page.locator('[role="tab"]');
  const found = (await tabs.allTextContents()).map((t) => t.trim());
  const ok = labels.every((l, i) => found[i] === l);
  check('tab strip', ok, found.join('|'));
}

/** Clicks a tab, expects navigation to that example page and its table. */
async function followTab(page, label, slug, id, check) {
  await page.locator('[role="tab"]', { hasText: label }).first().click();
  await page
    .waitForURL(`**/docs/examples/${slug}`, { timeout: 30000 })
    .catch(() => {});
  check(
    `tab "${label}" navigates`,
    page.url().endsWith(`/docs/examples/${slug}`),
    page.url(),
  );
  await page.waitForLoadState('networkidle').catch(() => {});
  await example(page, id, check);
}

const BASIC = ['Basic', 'Minimal', 'Advanced', 'Custom Headless'];
const EXPANDING = [
  'Expanding Tree',
  'Parsed Tree',
  'Column Grouping',
  'Customized Grouping',
  'Aggregation',
  'Detail Panel',
  'Chart Detail Panel',
];
const EDITING = [
  'Modal',
  'Inline Row',
  'Inline Cell',
  'Inline Table',
  'Tree Editing',
];
const EXPORT = ['Export to CSV', 'Export to PDF'];

export default {
  '/docs/examples/advanced': async ({ page, check }) => {
    const w = await example(page, 'advanced', check);
    await tabStrip(page, BASIC, check);
    check(
      'advanced: row selection checkboxes',
      (await w.locator('input[type="checkbox"], [role="checkbox"]').count()) >
        1,
    );
    check('advanced: expand buttons', (await expandButtons(w).count()) > 0);
    await hasText(w, 'advanced', /Job Title/, check);
  },
  '/docs/examples/aggregation-and-grouping': async ({ page, check }) => {
    const w = await example(page, 'aggregation-and-grouping', check);
    await tabStrip(page, EXPANDING, check);
    check(
      'aggregation-and-grouping: grouped rows',
      (await expandButtons(w).count()) > 0,
    );
    await hasText(w, 'aggregation-and-grouping', /Salary/, check);
  },
  '/docs/examples/basic': async ({ page, check }) => {
    await example(page, 'basic', check);
    await tabStrip(page, BASIC, check);
    await followTab(page, 'Advanced', 'advanced', 'advanced', check);
  },
  '/docs/examples/chart-detail-panel': async ({ page, check }) => {
    const w = await example(page, 'chart-detail-panel', check);
    await tabStrip(page, EXPANDING, check);
    const btn = expandButtons(w).first();
    check('chart-detail-panel: expand button', (await btn.count()) > 0);
    if (await btn.count()) {
      await btn.click();
      await page.waitForTimeout(800);
      check(
        'chart-detail-panel: chart rendered',
        (await w.locator('.recharts-wrapper, .recharts-surface').count()) > 0,
      );
    }
  },
  '/docs/examples/column-grouping': async ({ page, check }) => {
    const w = await example(page, 'enable-column-grouping', check);
    await tabStrip(page, EXPANDING, check);
    check(
      'column-grouping: grouped rows',
      (await expandButtons(w).count()) > 0,
    );
    await hasText(w, 'enable-column-grouping', /Grouped Column Mode/, check);
    await followTab(
      page,
      'Aggregation',
      'aggregation-and-grouping',
      'aggregation-and-grouping',
      check,
    );
  },
  '/docs/examples/column-ordering': async ({ page, check }) => {
    const w = await example(page, 'enable-column-ordering', check);
    await tabStrip(
      page,
      ['Column Ordering', 'Row Ordering', 'Row Dragging'],
      check,
    );
    check(
      'column-ordering: column drag handles',
      (await w
        .locator('thead [draggable="true"], thead button[aria-label*="Move" i]')
        .count()) > 0,
    );
  },
  '/docs/examples/column-pinning': async ({ page, check }) => {
    const w = await example(page, 'enable-column-pinning', check);
    await tabStrip(
      page,
      [
        'Sticky Header',
        'Column Pinning',
        'Row Pinning (Sticky)',
        'Row Pinning (Static)',
        'Sticky Row Selection',
      ],
      check,
    );
    check(
      'column-pinning: pinned cells',
      (await w.locator('[data-pinned], td.sticky, th.sticky').count()) > 0,
    );
  },
  '/docs/examples/column-virtualization': async ({ page, check }) => {
    const w = await example(page, 'enable-column-virtualization', check);
    await tabStrip(
      page,
      [
        'Fully Virtualized',
        'Row Virtualization',
        'Column Virtualization',
        'Infinite Scrolling',
      ],
      check,
    );
    const th = await w.locator('thead th').count();
    check(
      'column-virtualization: virtualized header count',
      th > 5 && th < 200,
      `th=${th}`,
    );
  },
  '/docs/examples/custom-filter-ui': async ({ page, check }) => {
    const w = await example(page, 'custom-column-filtering-ui', check);
    await tabStrip(
      page,
      [
        'Filter Variants',
        'Faceted Values',
        'Filter Switching',
        'Popover Filters',
        'Custom Filter UI',
      ],
      check,
    );
    check(
      'custom-filter-ui: filter inputs',
      (await w.locator('input').count()) >= 2,
    );
  },
  '/docs/examples/custom-headless': async ({ page, check }) => {
    const w = await example(page, 'custom-headless', check);
    await tabStrip(page, BASIC, check);
    await hasText(w, 'custom-headless', /My Custom Headless Table/, check);
  },
  '/docs/examples/customized-grouping': async ({ page, check }) => {
    const w = await example(page, 'customize-remove-column-grouping', check);
    await tabStrip(page, EXPANDING, check);
    await hasText(w, 'customize-remove-column-grouping', /Groups/, check);
    check(
      'customized-grouping: grouped rows',
      (await expandButtons(w).count()) > 0,
    );
  },
  '/docs/examples/detail-panel': async ({ page, check }) => {
    const w = await example(page, 'enable-detail-panel-conditionally', check);
    await tabStrip(page, EXPANDING, check);
    check('detail-panel: expand buttons', (await expandButtons(w).count()) > 0);
  },
  '/docs/examples/dynamic-columns': async ({ page, check }) => {
    const w = await example(page, 'dynamic-columns', check);
    await tabStrip(
      page,
      [
        'React Query',
        'useEffect',
        'Dynamic Columns',
        'Lazy Detail Panel',
        'Lazy Sub-Rows',
      ],
      check,
    );
    check(
      'dynamic-columns: refresh button',
      (await w.locator('button:has(svg)').count()) > 0,
    );
    await followTab(page, 'useEffect', 'remote', 'remote', check);
  },
  '/docs/examples/editing-crud': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-modal', check);
    await tabStrip(page, EDITING, check);
    await hasText(w, 'editing-crud-modal', /Create New User/, check);
    await followTab(
      page,
      'Inline Row',
      'editing-crud-inline-row',
      'editing-crud-row',
      check,
    );
  },
  '/docs/examples/editing-crud-inline-cell': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-cell', check);
    await tabStrip(page, EDITING, check);
    await hasText(w, 'editing-crud-cell', /Create New User/, check);
  },
  '/docs/examples/editing-crud-inline-row': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-row', check);
    await tabStrip(page, EDITING, check);
    await hasText(w, 'editing-crud-row', /Create New User/, check);
  },
  '/docs/examples/editing-crud-inline-table': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-table', check);
    await tabStrip(page, EDITING, check);
    await hasText(w, 'editing-crud-table', /Create New User/, check);
  },
  '/docs/examples/editing-crud-tree': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-tree', check);
    await tabStrip(page, EDITING, check);
    await hasText(w, 'editing-crud-tree', /Create New User/, check);
    check(
      'editing-crud-tree: expand buttons',
      (await expandButtons(w).count()) > 0,
    );
  },
  '/docs/examples/expanding-tree': async ({ page, check }) => {
    const w = await example(page, 'expanding-tree-expanded', check);
    await tabStrip(page, EXPANDING, check);
    check(
      'expanding-tree: expand buttons',
      (await expandButtons(w).count()) > 0,
    );
  },
  '/docs/examples/expanding-tree-flat-parse': async ({ page, check }) => {
    const w = await example(page, 'expanding-tree-flat-parse', check);
    await tabStrip(page, EXPANDING, check);
    check(
      'expanding-tree-flat-parse: expand buttons',
      (await expandButtons(w).count()) > 0,
    );
  },
  '/docs/examples/export-csv': async ({ page, check }) => {
    const w = await example(page, 'export-to-csv', check);
    await tabStrip(page, EXPORT, check);
    await hasText(w, 'export-to-csv', /Export All Data/, check);
    await followTab(
      page,
      'Export to PDF',
      'export-pdf',
      'export-to-pdf',
      check,
    );
  },
  '/docs/examples/export-pdf': async ({ page, check }) => {
    const w = await example(page, 'export-to-pdf', check);
    await tabStrip(page, EXPORT, check);
    await hasText(w, 'export-to-pdf', /Export All Rows/, check);
  },
};
