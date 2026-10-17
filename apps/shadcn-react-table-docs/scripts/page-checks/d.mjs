/**
 * Cluster D page checks: docs/examples a to e (advanced ... export-pdf).
 * Every page renders its own example in one playground panel (the group tab
 * strips only survive inside guides), so each page asserts that single panel
 * plus the example's own markers.
 */
import { example } from './_helpers.mjs';

const expandButtons = (w) => w.locator('button[aria-label="Expand"]');

async function hasText(w, id, re, check) {
  const txt = (await w.innerText().catch(() => '')) ?? '';
  check(`${id}: text ${re}`, re.test(txt));
}

/**
 * An example page renders exactly one playground panel (data-mode) and no
 * group tab strip; the only tablist is the playground's source file tabs.
 */
async function singleExample(page, check) {
  const panels = await page.locator('article [data-mode]').count();
  check('single example panel', panels === 1, `panels=${panels}`);
  const strips = await page
    .locator('article [role="tablist"]:not([aria-label="Source files"])')
    .count();
  check('no group tab strip', strips === 0, `tablists=${strips}`);
}

export default {
  '/docs/examples/advanced': async ({ page, check }) => {
    const w = await example(page, 'advanced', check);
    await singleExample(page, check);
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
    await singleExample(page, check);
    check(
      'aggregation-and-grouping: grouped rows',
      (await expandButtons(w).count()) > 0,
    );
    await hasText(w, 'aggregation-and-grouping', /Salary/, check);
  },
  '/docs/examples/basic': async ({ page, check }) => {
    await example(page, 'basic', check);
    await singleExample(page, check);
  },
  '/docs/examples/chart-detail-panel': async ({ page, check }) => {
    const w = await example(page, 'chart-detail-panel', check);
    await singleExample(page, check);
    const btn = expandButtons(w).first();
    check('chart-detail-panel: expand button', (await btn.count()) > 0);
    // initialState.expanded = { 0: true }: the first chart is open on load.
    await w
      .locator('.recharts-surface')
      .first()
      .waitFor({ timeout: 10000 })
      .catch(() => {});
    check(
      'chart-detail-panel: chart rendered',
      (await w.locator('.recharts-wrapper, .recharts-surface').count()) > 0,
    );
  },
  '/docs/examples/column-grouping': async ({ page, check }) => {
    const w = await example(page, 'enable-column-grouping', check);
    await singleExample(page, check);
    check(
      'column-grouping: grouped rows',
      (await expandButtons(w).count()) > 0,
    );
    await hasText(w, 'enable-column-grouping', /Grouped Column Mode/, check);
  },
  '/docs/examples/column-ordering': async ({ page, check }) => {
    const w = await example(page, 'enable-column-ordering', check);
    await singleExample(page, check);
    check(
      'column-ordering: column drag handles',
      (await w
        .locator('thead [draggable="true"], thead button[aria-label*="Move" i]')
        .count()) > 0,
    );
  },
  '/docs/examples/column-pinning': async ({ page, check }) => {
    const w = await example(page, 'enable-column-pinning', check);
    await singleExample(page, check);
    check(
      'column-pinning: pinned cells',
      (await w.locator('[data-pinned], td.sticky, th.sticky').count()) > 0,
    );
  },
  '/docs/examples/column-virtualization': async ({ page, check }) => {
    const w = await example(page, 'enable-column-virtualization', check);
    await singleExample(page, check);
    const th = await w.locator('thead th').count();
    check(
      'column-virtualization: virtualized header count',
      th > 5 && th < 200,
      `th=${th}`,
    );
  },
  '/docs/examples/custom-filter-ui': async ({ page, check }) => {
    const w = await example(page, 'custom-column-filtering-ui', check);
    await singleExample(page, check);
    check(
      'custom-filter-ui: filter inputs',
      (await w.locator('input').count()) >= 2,
    );
  },
  '/docs/examples/custom-headless': async ({ page, check }) => {
    const w = await example(page, 'custom-headless', check);
    await singleExample(page, check);
    await hasText(w, 'custom-headless', /My Custom Headless Table/, check);
  },
  '/docs/examples/customized-grouping': async ({ page, check }) => {
    const w = await example(page, 'customize-remove-column-grouping', check);
    await singleExample(page, check);
    await hasText(w, 'customize-remove-column-grouping', /Groups/, check);
    check(
      'customized-grouping: grouped rows',
      (await expandButtons(w).count()) > 0,
    );
  },
  '/docs/examples/detail-panel': async ({ page, check }) => {
    const w = await example(page, 'enable-detail-panel-conditionally', check);
    await singleExample(page, check);
    check('detail-panel: expand buttons', (await expandButtons(w).count()) > 0);
  },
  '/docs/examples/dynamic-columns': async ({ page, check }) => {
    const w = await example(page, 'dynamic-columns', check);
    await singleExample(page, check);
    check(
      'dynamic-columns: refresh button',
      (await w.locator('button:has(svg)').count()) > 0,
    );
  },
  '/docs/examples/editing-crud': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-modal', check);
    await singleExample(page, check);
    await hasText(w, 'editing-crud-modal', /Create New User/, check);
  },
  '/docs/examples/editing-crud-inline-cell': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-cell', check);
    await singleExample(page, check);
    await hasText(w, 'editing-crud-cell', /Create New User/, check);
  },
  '/docs/examples/editing-crud-inline-row': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-row', check);
    await singleExample(page, check);
    await hasText(w, 'editing-crud-row', /Create New User/, check);
  },
  '/docs/examples/editing-crud-inline-table': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-table', check);
    await singleExample(page, check);
    await hasText(w, 'editing-crud-table', /Create New User/, check);
  },
  '/docs/examples/editing-crud-tree': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-tree', check);
    await singleExample(page, check);
    await hasText(w, 'editing-crud-tree', /Create New User/, check);
    check(
      'editing-crud-tree: expand buttons',
      (await expandButtons(w).count()) > 0,
    );
  },
  '/docs/examples/expanding-tree': async ({ page, check }) => {
    const w = await example(page, 'expanding-tree-expanded', check);
    await singleExample(page, check);
    check(
      'expanding-tree: expand buttons',
      (await expandButtons(w).count()) > 0,
    );
  },
  '/docs/examples/expanding-tree-flat-parse': async ({ page, check }) => {
    const w = await example(page, 'expanding-tree-flat-parse', check);
    await singleExample(page, check);
    check(
      'expanding-tree-flat-parse: expand buttons',
      (await expandButtons(w).count()) > 0,
    );
  },
  '/docs/examples/export-csv': async ({ page, check }) => {
    const w = await example(page, 'export-to-csv', check);
    await singleExample(page, check);
    await hasText(w, 'export-to-csv', /Export All Data/, check);
  },
  '/docs/examples/export-pdf': async ({ page, check }) => {
    const w = await example(page, 'export-to-pdf', check);
    await singleExample(page, check);
    await hasText(w, 'export-to-pdf', /Export All Rows/, check);
  },
};
