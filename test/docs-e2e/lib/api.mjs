/**
 * API page checks: /docs/api and api/*. Each entry: async ({ page, check })
 * => void, run after load at the first width. Every reference page shows the
 * OptionsSwitcher with its own tab active and its full prop table.
 */
import { codeToggle, names } from './helpers.mjs';

const checks = {
  '/docs/api': async ({ page, check }) => {
    const n = await page.locator('article a[href^="/docs/api/"]').count();
    check('table of contents links', n >= 9, String(n));
  },
  '/docs/api/table-options': async ({ page, check }) => {
    await switcher(page, 'Table Options', 3, check);
    await propTable(page, '#props-table', 211, check);
    await codeToggle(page, 'root-props', 'TableOptionsTable', check);
  },
  '/docs/api/column-options': async ({ page, check }) => {
    await switcher(page, 'Column Options', 3, check);
    await propTable(page, '#column-options-table', 65, check);
    await codeToggle(page, 'column-options', 'ColumnOptionsTable', check);
  },
  '/docs/api/state-options': async ({ page, check }) => {
    await switcher(page, 'State Options', 3, check);
    await propTable(page, '#state-options-table', 35, check);
    await codeToggle(page, 'state-options', 'StateOptionsTable', check);
  },
  '/docs/api/table-instance-apis': async ({ page, check }) => {
    await switcher(page, 'Table Instance APIs', 4, check);
    await propTable(page, '#table-instance-apis-table', 138, check);
    await codeToggle(
      page,
      'table-instance-apis',
      'TableInstanceAPIsTable',
      check,
    );
  },
  '/docs/api/column-instance-apis': async ({ page, check }) => {
    await switcher(page, 'Column Instance APIs', 4, check);
    await propTable(page, '#column-instance-apis-table', 55, check);
    await codeToggle(
      page,
      'column-instance-apis',
      'ColumnInstanceAPIsTable',
      check,
    );
  },
  '/docs/api/row-instance-apis': async ({ page, check }) => {
    await switcher(page, 'Row Instance APIs', 4, check);
    await propTable(page, '#row-instance-apis-table', 39, check);
    await codeToggle(page, 'row-instance-apis', 'RowInstanceAPIsTable', check);
  },
  '/docs/api/cell-instance-apis': async ({ page, check }) => {
    await switcher(page, 'Cell Instance APIs', 4, check);
    await propTable(page, '#cell-instance-apis-table', 9, check);
    await codeToggle(
      page,
      'cell-instance-apis',
      'CellInstanceAPIsTable',
      check,
    );
  },
  '/docs/api/st-components': async ({ page, check }) => {
    await switcher(page, 'ST Components', 2, check);
    const n = await page.locator('article h5').count();
    check('component headings', n === 42, String(n));
  },
  '/docs/api/st-hooks': async ({ page, check }) => {
    await switcher(page, 'ST Hooks', 2, check);
    const n = await page.locator('article h3').count();
    check('hook headings', n === 8, String(n));
  },
};

/**
 * OptionsSwitcher: `count` tabs, the one for this page active.
 */
async function switcher(page, active, count, check) {
  const tabs = page.locator('[role="tab"]:not(#nd-subnav *)');
  check(
    'switcher tabs',
    (await tabs.count()) === count,
    String(await tabs.count()),
  );
  const current = page.locator('[role="tab"][data-state="active"]');
  check(
    'switcher active tab',
    (await current.textContent())?.trim() === active,
    (await current.textContent()) ?? '',
  );
}

/** Full prop table: every data row rendered (no pagination). */
async function propTable(page, id, count, check) {
  const rows = await names(page, id);
  check(`${id} rows`, rows.length === count, String(rows.length));
}

export default checks;
