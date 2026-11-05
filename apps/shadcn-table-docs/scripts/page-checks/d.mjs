/**
 * Cluster D page checks: docs/examples a to e (advanced ... export-pdf).
 * Every page renders its own example in one playground panel (the group tab
 * strips only survive inside guides), so each page asserts that single panel
 * plus the example's own markers.
 */
import { example, headerLabelsFit } from './_helpers.mjs';

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

/**
 * The chips filter default (D56): no funnel in the headers, the toolbar's
 * Filter button present.
 */
async function chipsDefault(w, id, check) {
  const funnels = await w.locator('thead svg.lucide-funnel').count();
  check(`${id}: no header funnel`, funnels === 0, `funnels=${funnels}`);
  const filterButtons = await w.locator('button[aria-label="Filter"]').count();
  check(
    `${id}: toolbar Filter button`,
    filterButtons > 0,
    `buttons=${filterButtons}`,
  );
}

/**
 * F51: sorting by `column` through its column menu shows the sort chip
 * (ST_SortPopover variant="chip"), a button named after the column outside
 * the table head.
 */
async function sortChip(page, w, id, column, check) {
  try {
    await w
      .locator(`thead th button[aria-label="${column} column menu"]`)
      .first()
      .click();
    await page
      .getByRole('menuitem', { name: 'Sort ascending', exact: true })
      .first()
      .click({ timeout: 5000 });
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(300);
    const chips = await w
      .locator('button')
      .evaluateAll(
        (els, label) =>
          els.filter(
            (el) => !el.closest('thead') && el.textContent?.trim() === label,
          ).length,
        column,
      );
    check(`${id}: sort chip`, chips > 0, `chips=${chips}`);
  } catch (e) {
    check(`${id}: sort chip`, false, String(e.message).split('\n')[0]);
  }
}

/**
 * F53: the row's delete button opens a shadcn AlertDialog with the question,
 * not a browser confirm; Cancel closes it and keeps every row.
 */
async function deleteDialog(page, w, id, check) {
  let alerted = false;
  const onDialog = (d) => {
    alerted = true;
    d.dismiss().catch(() => {});
  };
  page.on('dialog', onDialog);
  try {
    const before = await w.locator('tbody tr').count();
    await w.locator('tbody button.text-destructive').first().click();
    const dialog = page.getByRole('alertdialog');
    await dialog.waitFor({ timeout: 5000 });
    const text = (await dialog.innerText()) ?? '';
    check(
      `${id}: delete dialog`,
      /Are you sure you want to delete this user\?/.test(text),
      text.replace(/\s+/g, ' ').slice(0, 120),
    );
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    await dialog.waitFor({ state: 'hidden', timeout: 5000 });
    const after = await w.locator('tbody tr').count();
    check(
      `${id}: delete dialog cancel keeps the rows`,
      after === before,
      `before=${before} after=${after}`,
    );
  } catch (e) {
    check(
      `${id}: delete dialog`,
      false,
      String(e.message).split('\n')[0].slice(0, 160),
    );
  } finally {
    page.off('dialog', onDialog);
  }
  check(`${id}: delete dialog, no browser confirm`, !alerted);
}

const checks = {
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
    // F37: the toolbar actions open a shadcn Dialog with the selected
    // names, not a browser alert
    let alerted = false;
    const onDialog = (d) => {
      alerted = true;
      d.dismiss().catch(() => {});
    };
    page.on('dialog', onDialog);
    try {
      // a DOM click: React Aria's input is visually hidden under its box
      await w
        .locator('tbody [role="checkbox"], tbody input[type="checkbox"]')
        .first()
        .evaluate((el) => el.click());
      await w.getByRole('button', { name: 'Activate', exact: true }).click();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor({ timeout: 5000 });
      const text = (await dialog.innerText()) ?? '';
      check(
        'advanced: action dialog',
        /Activate/.test(text) && /Activating 1 person/.test(text),
        text.replace(/\s+/g, ' ').slice(0, 120),
      );
      await dialog
        .locator('[data-slot="dialog-footer"] button')
        .first()
        .click();
      await dialog.waitFor({ state: 'hidden', timeout: 5000 });
      check('advanced: action dialog closes', true);
    } catch (e) {
      check(
        'advanced: action dialog',
        false,
        String(e.message).split('\n')[0].slice(0, 160),
      );
    } finally {
      page.off('dialog', onDialog);
    }
    check('advanced: no browser alert', !alerted);
    await sortChip(page, w, 'advanced', 'Name', check);
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
    const w = await example(page, 'basic', check);
    await singleExample(page, check);
    // Example switcher: previous is disabled on the first example, next
    // steps to Minimal.
    const header = w.locator('header');
    const prev = header.locator('button[aria-label^="Previous"]');
    const next = header.locator('button[aria-label^="Next"]');
    check(
      'switcher: label',
      (await header.getByText('Select example').count()) === 1,
    );
    check(
      'switcher: prev disabled',
      await prev.isDisabled().catch(() => false),
    );
    check(
      'switcher: next names Minimal',
      /^Next: Minimal/.test((await next.getAttribute('aria-label')) ?? ''),
    );
    await next.click();
    await page
      .waitForURL('**/docs/examples/minimal', { timeout: 30000 })
      .catch(() => {});
    check(
      'switcher: next goes to minimal',
      new URL(page.url()).pathname === '/docs/examples/minimal',
      page.url(),
    );
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
    await headerLabelsFit(w, 'chart-detail-panel', check);
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
    await headerLabelsFit(w, 'enable-column-pinning', check);
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
    await headerLabelsFit(w, 'enable-detail-panel-conditionally', check);
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
    await headerLabelsFit(w, 'editing-crud-modal', check);
    await deleteDialog(page, w, 'editing-crud-modal', check);
  },
  '/docs/examples/editing-crud-inline-cell': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-cell', check);
    await singleExample(page, check);
    await hasText(w, 'editing-crud-cell', /Create New User/, check);
    await headerLabelsFit(w, 'editing-crud-cell', check);
    await deleteDialog(page, w, 'editing-crud-cell', check);
  },
  '/docs/examples/editing-crud-inline-row': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-row', check);
    await singleExample(page, check);
    await hasText(w, 'editing-crud-row', /Create New User/, check);
    await headerLabelsFit(w, 'editing-crud-row', check);
    await deleteDialog(page, w, 'editing-crud-row', check);
  },
  '/docs/examples/editing-crud-inline-table': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-table', check);
    await singleExample(page, check);
    await hasText(w, 'editing-crud-table', /Create New User/, check);
    await headerLabelsFit(w, 'editing-crud-table', check);
    await deleteDialog(page, w, 'editing-crud-table', check);
  },
  '/docs/examples/editing-crud-tree': async ({ page, check }) => {
    const w = await example(page, 'editing-crud-tree', check);
    await singleExample(page, check);
    await hasText(w, 'editing-crud-tree', /Create New User/, check);
    await headerLabelsFit(w, 'editing-crud-tree', check);
    await deleteDialog(page, w, 'editing-crud-tree', check);
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
    await chipsDefault(w, 'export-to-csv', check);
    await headerLabelsFit(w, 'export-to-csv', check);
  },
  '/docs/examples/export-pdf': async ({ page, check }) => {
    const w = await example(page, 'export-to-pdf', check);
    await singleExample(page, check);
    await hasText(w, 'export-to-pdf', /Export All Rows/, check);
    await chipsDefault(w, 'export-to-pdf', check);
    await headerLabelsFit(w, 'export-to-pdf', check);
  },
};

export default checks;
