/**
 * Guides page checks: /docs/guides and guides/*. Each entry:
 * async ({ page, check, base }) => void, run after load at the first width.
 */
import {
  chipFilter,
  closeChipEditor,
  codeToggle,
  example,
  exampleGroup,
  headerLabelsFit,
  names,
  paginationControls,
  panelOf,
  propTable,
} from './helpers.mjs';

const count = (scope, selector) => scope.locator(selector).count();

/** Opens the first button with `label` inside `wrapper`; returns the open menu. */
async function openMenu(page, wrapper, label) {
  await wrapper.locator(`button[aria-label="${label}"]`).first().click();
  const menu = page.locator('[role="menu"]').first();
  await menu.waitFor({ timeout: 10000 }).catch(() => {});
  return menu;
}

/** The feature's visible marker inside an example wrapper. */
async function marker(wrapper, id, label, selector, check) {
  const n = await wrapper.locator(selector).count();
  check(`${id}: ${label}`, n > 0, `found=${n}`);
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
 * The Localization guide's install command (InstallCommand locale): German
 * first on the page's base, then French through the Locale select, with the
 * import line under the tabs following the pick.
 */
async function localeCommand(page, check, base) {
  const command = async () =>
    (await page
      .locator('article pre:visible', { hasText: 'shadcn-table-locale-' })
      .first()
      .textContent()
      .catch(() => '')) ?? '';
  const importLine = async () =>
    (await page
      .locator('article p', { hasText: 'localization={' })
      .first()
      .textContent()
      .catch(() => '')) ?? '';
  const de = await command();
  check(
    'locale command: de on the base',
    de.includes(`/r/${base}/shadcn-table-locale-de.json`),
    de,
  );
  check(
    'locale import line: de',
    (await importLine()).includes('ST_Localization_DE'),
    await importLine(),
  );
  const select = page.locator('article button[aria-label="Locale"]');
  check('locale select', (await select.count()) === 1);
  if (!(await select.count())) return;
  await select.click();
  const french = page.getByRole('menuitemradio', { name: 'French (fr)' });
  await french.waitFor({ timeout: 5000 }).catch(() => {});
  await french.click();
  await french.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const fr = await command();
  check(
    'locale command: fr',
    fr.includes(`/r/${base}/shadcn-table-locale-fr.json`),
    fr,
  );
  check(
    'locale import line: fr',
    (await importLine()).includes('localization={ST_Localization_FR}'),
    await importLine(),
  );
}

const TABLE = '#relevant-props-table';
const STATE = '#relevant-state-options-table';
const COLUMN = '#relevant-column-options-table';

const checks = {
  '/docs/guides/pagination': async ({ page, check }) => {
    const propNames = await names(page, '#relevant-props-table');
    check('table options rows', propNames.length === 9, propNames.join(','));
    const stateNames = await names(page, '#relevant-state-options-table');
    check(
      'state options rows',
      stateNames.join(',') === 'pagination',
      stateNames.join(','),
    );
    check(
      'stPaginationProps copy id',
      (await page.locator('#stPaginationProps-prop').count()) === 1,
    );
    const alt = await example(page, 'alternate-pagination', check);
    await paginationControls(alt, 'alternate-pagination', check);
    await codeToggle(
      page,
      'alternate-pagination',
      "paginationDisplayMode: 'compact'",
      check,
    );
    const remote = await example(page, 'remote', check);
    await paginationControls(remote, 'remote', check);
    await codeToggle(page, 'remote', 'manualPagination: true', check);
    const before = await remote.locator('table tbody tr').first().textContent();
    const next = remote
      .locator('button[aria-label*="next" i], a[aria-label*="next" i]')
      .first();
    check('remote: next page button', (await next.count()) > 0);
    if (await next.count()) {
      await next.click();
      await page.waitForTimeout(1500);
      const after = await remote
        .locator('table tbody tr')
        .first()
        .textContent();
      check('remote: next page changes rows', before !== after);
    }
  },
  '/docs/guides/accessibility': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
  },

  '/docs/guides/aggregation': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    // aggregation-multi renders Count/Average/Median/Min/Max per group (MRT TS.tsx).
    for (const [id, re] of [
      ['aggregation-and-grouping', /Max by|Average by|Min by/],
      ['aggregation-multi', /Count:.*Average:.*Median:/],
    ]) {
      const w = await example(page, id, check);
      check(
        `${id}: grouping chips`,
        (await count(w, '[data-slot="badge"]')) > 0,
      );
      const body = (await w.locator('table tbody').first().textContent()) ?? '';
      check(`${id}: aggregated cells`, re.test(body));
    }
  },

  '/docs/guides/async-loading': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const loading = await example(page, 'loading', check);
    check(
      'loading: skeleton cells',
      (await count(loading, '[data-slot="skeleton"]')) > 0,
    );
    check(
      'loading: spinner',
      (await count(loading, '[data-slot="spinner"]')) > 0,
    );
    const linear = await example(page, 'linear-progress', check);
    check(
      'linear-progress: progress bar',
      (await count(linear, '[data-slot="progress"]')) > 0,
    );
    const rq = await example(page, 'react-query', check);
    // Radix tooltip adds no aria-label to its trigger (MUI did); match the icon.
    check(
      'react-query: refresh button',
      (await count(rq, 'button:has(.lucide-refresh-cw)')) === 1,
    );
  },

  '/docs/guides/best-practices': async ({ page, check }) => {
    // One h3 per section, as in MRT; the h2 repeating the title is dropped
    // by the sync.
    check('headings', (await count(page, 'article :is(h2, h3)')) >= 3);
  },

  '/docs/guides/cell-actions': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    const w = await example(page, 'enable-cell-actions', check);
    await w.locator('table tbody tr').first().locator('td').nth(1).click({
      button: 'right',
    });
    const menu = page.locator('[role="menu"]').first();
    await menu.waitFor({ timeout: 10000 }).catch(() => {});
    const text = (await menu.textContent().catch(() => '')) ?? '';
    check(
      'enable-cell-actions: context menu',
      /Item 1/.test(text),
      text.slice(0, 60),
    );
    await page.keyboard.press('Escape');
  },

  '/docs/guides/click-to-copy': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    const w = await example(page, 'enable-click-to-copy', check);
    check(
      'enable-click-to-copy: copy buttons in cells',
      (await count(w, 'table tbody button')) > 0,
    );
  },

  '/docs/guides/column-actions': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    const disabled = await example(page, 'disable-column-actions', check);
    // ID disables column actions; First Name and Last Name keep theirs.
    check(
      'disable-column-actions: two columns keep actions',
      (await count(disabled, 'button[aria-label="Column Actions"]')) === 2,
    );
    const custom = await example(page, 'custom-column-actions', check);
    const menu = await openMenu(page, custom, 'Column Actions');
    const text = (await menu.textContent().catch(() => '')) ?? '';
    check(
      'custom-column-actions: custom items',
      /Item 1/.test(text),
      text.slice(0, 60),
    );
    await page.keyboard.press('Escape');
    const space = await example(page, 'column-actions-space', check);
    check(
      'column-actions-space: head content spaced',
      (await count(space, 'thead [class*="justify-between"]')) > 0,
    );
  },

  '/docs/guides/column-icons': async ({ page, check }) => {
    await propTable(page, '#relevant-column-options-table', check);
    const w = await example(page, 'persistent-view', check);
    check(
      'persistent-view: header column icons',
      (await count(w, 'thead th svg[aria-hidden="true"]')) >= 5,
    );
  },

  '/docs/guides/column-filtering': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    // chips mode (the default): each filter is added through the toolbar
    // Filter button and its editor opens from the chip
    const variants = await example(page, 'customize-filter-variants', check);
    for (const [column, control] of [
      ['Salary', '[role="slider"], input[type="range"]'],
      ['Status', '[role="checkbox"], [data-slot="checkbox"]'],
    ]) {
      const editor = await chipFilter(
        page,
        variants,
        'customize-filter-variants',
        column,
        control,
        check,
      );
      await closeChipEditor(page, editor);
    }
    const facets = await example(page, 'enable-filter-facet-values', check);
    await closeChipEditor(
      page,
      await chipFilter(
        page,
        facets,
        'enable-filter-facet-values',
        'City',
        '[data-slot="select-trigger"], [role="combobox"]',
        check,
      ),
    );
    const alternate = await example(page, 'alternate-column-filtering', check);
    check(
      'alternate-column-filtering: no subheader filters',
      (await count(alternate, 'thead input')) === 0,
    );
    await headerLabelsFit(alternate, 'alternate-column-filtering', check);
    const modes = await example(page, 'customize-filter-modes', check);
    await closeChipEditor(
      page,
      await chipFilter(
        page,
        modes,
        'customize-filter-modes',
        'First Name',
        'button[aria-label="Change filter mode"]',
        check,
      ),
    );
    const components = await example(
      page,
      'customize-filter-components',
      check,
    );
    await closeChipEditor(
      page,
      await chipFilter(
        page,
        components,
        'customize-filter-components',
        'Age',
        'input',
        check,
      ),
    );
  },

  '/docs/guides/column-grouping': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const grouping = await example(page, 'enable-column-grouping', check);
    check(
      'enable-column-grouping: grouping chips',
      (await count(grouping, '[data-slot="badge"]')) > 0,
    );
    check(
      'enable-column-grouping: mode radios',
      (await count(grouping, '[data-slot="radio-group-item"]')) === 3,
    );
    const remove = await example(
      page,
      'customize-remove-column-grouping',
      check,
    );
    check(
      'customize-remove-column-grouping: expand buttons',
      (await count(remove, 'button[aria-label="Expand"]')) > 0,
    );
  },

  '/docs/guides/column-hiding': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const w = await example(page, 'disable-column-hiding', check);
    const menu = await openMenu(page, w, 'Show/Hide columns');
    check(
      'disable-column-hiding: column checkbox rows',
      (await count(menu, '[role="menuitemcheckbox"]')) > 0,
    );
    await page.keyboard.press('Escape');
  },

  '/docs/guides/column-ordering-dnd': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const w = await example(page, 'enable-column-ordering', check);
    check(
      'enable-column-ordering: draggable headers',
      (await count(w, 'thead [draggable="true"]')) > 0,
    );
  },

  '/docs/guides/column-pinning': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const w = await example(page, 'enable-column-pinning', check);
    check(
      'enable-column-pinning: pinned cells',
      (await count(w, '[data-pinned="true"]')) > 0,
    );
  },

  '/docs/guides/column-resizing': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const w = await example(page, 'enable-column-resizing', check);
    check(
      'enable-column-resizing: resize handles',
      (await count(w, 'thead .cursor-col-resize')) > 0,
    );
    const fa = await example(page, 'localization-i18n-fa', check);
    // React serialises the inline style as `direction:rtl` (no space).
    check(
      'localization-i18n-fa: rtl wrapper',
      (await count(fa, '[style*="direction:rtl"], [style*="direction: rtl"]')) >
        0,
    );
    check(
      'localization-i18n-fa: Persian labels',
      (await count(fa, 'button[aria-label="اقدامات ستون"]')) > 0,
    );
  },

  '/docs/guides/column-size': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
  },

  '/docs/guides/customize-components': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    const theme = await example(page, 'mui-theme', check);
    check(
      'mui-theme: themed wrapper',
      (await count(theme, '[class*="--background"]')) > 0,
    );
    const styles = await example(page, 'customize-table-styles', check);
    check(
      'customize-table-styles: striped body',
      (await count(styles, 'tbody[class*="nth-of-type"]')) === 1,
    );
    await headerLabelsFit(styles, 'customize-table-styles', check);
  },

  '/docs/guides/customize-icons': async ({ page, check, base }) => {
    // Icon editions: the update form of the edition command, Lucide first.
    const edition = page.locator('article pre:visible', {
      hasText: `/r/${base}/shadcn-table.json --overwrite`,
    });
    check(
      'edition command',
      (await edition.count()) === 1,
      String(await edition.count()),
    );
    check(
      'icon library select',
      (await page
        .locator('article button[aria-label="Icon library"]')
        .count()) === 1,
    );
    await propTable(page, '#relevant-props-table', check);
    const w = await example(page, 'font-awesome-icons', check);
    check(
      'font-awesome-icons: Font Awesome svgs',
      (await count(w, 'svg[data-icon]')) > 0,
    );
  },

  '/docs/guides/data-columns': async ({ page, check }) => {
    const w = await example(page, 'column-alignment', check);
    check(
      'column-alignment: right aligned cells',
      (await count(w, 'td[align="right"]')) > 0,
    );
    await headerLabelsFit(w, 'column-alignment', check);
  },

  '/docs/guides/density-toggle': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const w = await example(page, 'disable-density-toggle', check);
    check(
      'disable-density-toggle: no density button',
      (await count(w, 'button[aria-label="Toggle density"]')) === 0,
    );
  },

  '/docs/guides/detail-panel': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const conditional = await example(
      page,
      'enable-detail-panel-conditionally',
      check,
    );
    await conditional.locator('button[aria-label="Expand"]').first().click();
    await page.waitForTimeout(500);
    const body =
      (await conditional.locator('table tbody').first().textContent()) ?? '';
    check(
      'enable-detail-panel-conditionally: panel opens',
      /Address:/.test(body),
    );
    await headerLabelsFit(
      conditional,
      'enable-detail-panel-conditionally',
      check,
    );
    const alternate = await example(page, 'alternate-detail-panel', check);
    await headerLabelsFit(alternate, 'alternate-detail-panel', check);
    // initialState.expanded = { 0: true }: the first panel (and its chart) is
    // open on load; clicking the first expand button would collapse it.
    const chart = await example(page, 'chart-detail-panel', check);
    await chart
      .locator('svg.recharts-surface')
      .first()
      .waitFor({ timeout: 10000 })
      .catch(() => {});
    check(
      'chart-detail-panel: recharts chart',
      (await count(chart, 'svg.recharts-surface')) > 0,
    );
    const lines = chart.locator('path.recharts-line-curve');
    // an invalid stroke color computes to none: the line is not drawn
    const stroke =
      (await lines.count()) > 0
        ? await lines.first().evaluate((el) => getComputedStyle(el).stroke)
        : 'none';
    check(
      'chart-detail-panel: chart lines drawn',
      (await lines.count()) > 0 && stroke !== 'none',
      `lines=${await lines.count()} stroke=${stroke}`,
    );
    await example(page, 'enable-detail-panel-virtualized', check);
    await example(page, 'lazy-detail-panel', check);
  },

  '/docs/guides/display-columns': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    const w = await example(page, 'customize-display-columns', check);
    check(
      'customize-display-columns: row numbers header',
      /#/.test((await w.locator('thead').first().textContent()) ?? ''),
    );
    check(
      'customize-display-columns: select all',
      (await count(
        w,
        'button[aria-label="Toggle select all"], [aria-label="Toggle select all"]',
      )) > 0,
    );
  },
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
  '/docs/guides/filter-chips': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const w = await example(page, 'basic', check);
    await marker(
      w,
      'basic',
      'filter button',
      'button[aria-label="Filter"]',
      check,
    );
  },
  '/docs/guides/overflow-tooltip': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    const w = await example(page, 'basic', check);
    await marker(
      w,
      'basic',
      'truncated cell text',
      'tbody td span.truncate',
      check,
    );
  },
  '/docs/guides/scroll-cues': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    const w = await example(page, 'enable-column-pinning', check);
    await marker(
      w,
      'enable-column-pinning',
      'scroll buttons',
      'button[aria-label="Scroll left"], button[aria-label="Scroll right"]',
      check,
    );
  },
  '/docs/guides/sort-editor': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const w = await example(page, 'multi-sorting', check);
    await marker(
      w,
      'multi-sorting',
      'sort chip',
      'button:has-text("2 sorts")',
      check,
    );
  },
  '/docs/guides/tint-tokens': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    const w = await example(page, 'enable-row-selection', check);
    await marker(
      w,
      'enable-row-selection',
      'tint token root',
      '[data-slot="st-table-layout"][class*="--st-hover"]',
      check,
    );
  },
  '/docs/guides/view-settings': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const w = await example(page, 'persistent-view', check);
    await marker(
      w,
      'persistent-view',
      'view settings button',
      'button[aria-label="View settings"]',
      check,
    );
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
  '/docs/guides/localization': async ({ page, check, base }) => {
    await propTable(page, TABLE, check);
    // 39 locale files; the install command's base and package manager tabs
    // are not in the Locales list.
    const tabs = await page
      .locator('[aria-label="Locales"] [role="tab"]')
      .count();
    check('locale tabs', tabs === 39, `tabs=${tabs}`);
    await localeCommand(page, check, base);
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
        ['mk', 'localization-i18n-mk'],
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
      'sorted header marker',
      'th [aria-label="Sorted ascending"], th [aria-label="Sorted descending"]',
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
    const provider = await page
      .locator('article h3', { hasText: 'Compose with ST_TableProvider' })
      .count();
    check('table provider section', provider === 1, `h3=${provider}`);
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
    await sortChip(page, external, 'external-toolbar', 'First Name', check);
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
