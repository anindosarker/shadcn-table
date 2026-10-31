/**
 * Cluster B page checks: guides/accessibility to guides/display-columns.
 * Each entry: async ({ page, check }) => void, run after load at the first width.
 */
import { example, propTable } from './_helpers.mjs';

const count = (scope, selector) => scope.locator(selector).count();

/** Opens the first button with `label` inside `wrapper`; returns the open menu. */
async function openMenu(page, wrapper, label) {
  await wrapper.locator(`button[aria-label="${label}"]`).first().click();
  const menu = page.locator('[role="menu"]').first();
  await menu.waitFor({ timeout: 10000 }).catch(() => {});
  return menu;
}

const checks = {
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

  '/docs/guides/column-filtering': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const variants = await example(page, 'customize-filter-variants', check);
    check(
      'customize-filter-variants: date input',
      (await count(variants, 'thead input[type="date"]')) > 0,
    );
    check(
      'customize-filter-variants: range slider',
      (await count(variants, 'thead [data-slot="slider"]')) > 0,
    );
    check(
      'customize-filter-variants: checkbox filter',
      (await count(variants, 'thead [data-slot="checkbox"]')) > 0,
    );
    const facets = await example(page, 'enable-filter-facet-values', check);
    check(
      'enable-filter-facet-values: select filter',
      (await count(facets, 'thead [data-slot="select-trigger"]')) > 0,
    );
    const alternate = await example(page, 'alternate-column-filtering', check);
    check(
      'alternate-column-filtering: no subheader filters',
      (await count(alternate, 'thead input')) === 0,
    );
    const modes = await example(page, 'customize-filter-modes', check);
    check(
      'customize-filter-modes: filter mode buttons',
      (await count(modes, 'button[aria-label="Change filter mode"]')) > 0,
    );
    const components = await example(
      page,
      'customize-filter-components',
      check,
    );
    check(
      'customize-filter-components: filter inputs',
      (await count(components, 'thead input')) > 0,
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
      'disable-column-hiding: column switches',
      (await count(menu, '[role="switch"]')) > 0,
    );
    await page.keyboard.press('Escape');
  },

  '/docs/guides/column-ordering-dnd': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    await propTable(page, '#relevant-state-options-table', check);
    const w = await example(page, 'enable-column-ordering', check);
    check(
      'enable-column-ordering: drag handles',
      (await count(w, 'thead button[aria-label="Move"]')) > 0,
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
      (await count(w, 'thead [data-slot="separator"]')) > 0,
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
    await example(page, 'alternate-detail-panel', check);
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
};

export default checks;
