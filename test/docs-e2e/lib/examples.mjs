/**
 * Examples page checks: the /docs/examples redirect and examples/*. Every example page
 * renders its own example in one playground panel (the group tab strips only
 * survive inside guides), so a page asserts that single panel, its table
 * rows, the Code toggle and the example's own markers.
 */
import {
  chipFilter,
  closeChipEditor,
  codeToggle,
  example,
  headerLabelsFit,
  sectionFrame,
} from './helpers.mjs';
import { FIRST_EXAMPLE_URL } from '../../../apps/shadcn-table-docs/lib/examples-entry.mjs';
import { BASE_LABELS } from '../../../tools/registry/bases.mjs';

const expandButtons = (w) => w.locator('button[aria-label="Expand"]');

const DESIGN_SYSTEM_KEY = 'st-design-system';

/**
 * Spec 14 (D27): a stored `iconLibrary: 'tabler'` reaches the example on the
 * page's base copy (components/example-icons.tsx): after a reload the
 * toolbar's search toggle draws a Tabler svg. Clears the stored config and
 * reloads after.
 */
async function storedIconLibrary(page, check) {
  await page.evaluate((key) => {
    localStorage.setItem(
      key,
      JSON.stringify({
        config: { iconLibrary: 'tabler' },
        savedAt: Date.now(),
      }),
    );
  }, DESIGN_SYSTEM_KEY);
  await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
  const sel = '[id="example-basic"] button[aria-label="Show/Hide search"] svg';
  await page
    .locator('[id="example-basic"] table tbody tr')
    .first()
    .waitFor({ timeout: 30000 })
    .catch(() => {});
  const tabler = await page
    .waitForFunction(
      (s) => document.querySelector(s)?.classList.contains('tabler-icon'),
      sel,
      { timeout: 5000 },
    )
    .then(() => true)
    .catch(() => false);
  const cls =
    (await page
      .locator(sel)
      .first()
      .getAttribute('class')
      .catch(() => '')) ?? '';
  check('basic: stored Tabler pick switches the example icons', tabler, cls);
  await page.evaluate((key) => localStorage.removeItem(key), DESIGN_SYSTEM_KEY);
  await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
  await page
    .locator('[id="example-basic"] table tbody tr')
    .first()
    .waitFor({ timeout: 30000 })
    .catch(() => {});
}

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
  await pageOrder(page, check);
}

/**
 * Spec 54 (D104): the page order around the example. A `Try it` h3 and its
 * list of 2 to 4 steps sit directly above the example panel, a `Related
 * guides` h2 with its links follows the panel, and the page has no "View
 * Extra Storybook" line.
 */
async function pageOrder(page, check) {
  const order = await page.evaluate(() => {
    const article = document.querySelector('article');
    const panel = article?.querySelector('[data-mode]');
    // the heading's text also holds its hidden "Copy Anchor Link" label
    const heading = (tag, text) =>
      [...(article?.querySelectorAll(tag) ?? [])].find((h) =>
        h.textContent?.trim().startsWith(text),
      );
    const tryIt = heading('h3', 'Try it');
    const list = tryIt?.nextElementSibling;
    const next = list?.nextElementSibling;
    const guides = heading('h2', 'Related guides');
    return {
      steps: list?.querySelectorAll('ol > li').length ?? 0,
      aboveExample: !!(
        panel &&
        next &&
        (next === panel || next.contains(panel))
      ),
      guidesBelow: !!(
        panel &&
        guides &&
        panel.compareDocumentPosition(guides) & Node.DOCUMENT_POSITION_FOLLOWING
      ),
      links: guides?.nextElementSibling?.querySelectorAll('li a').length ?? 0,
      storybookLine: /View Extra Storybook/.test(article?.textContent ?? ''),
    };
  });
  check(
    'Try it steps directly above the example',
    order.steps >= 2 && order.steps <= 4 && order.aboveExample,
    `steps=${order.steps} above=${order.aboveExample}`,
  );
  check(
    'Related guides below the example',
    order.guidesBelow && order.links > 0,
    `links=${order.links}`,
  );
  check('no Storybook examples line', !order.storybookLine);
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
 * F25 (v0.9.x): the `tbody tr` count once the example's rows have settled:
 * no loading skeleton left in the body and the count equal across two reads
 * 300 ms apart, bounded at 10 s. The CRUD examples load their users through
 * a fake 1 s query and render skeleton rows until then.
 */
async function settledRowCount(page, w) {
  const rows = w.locator('tbody tr');
  const skeletons = w.locator('tbody [data-slot="skeleton"]');
  const deadline = Date.now() + 10_000;
  let count = await rows.count();
  while (Date.now() < deadline) {
    await page.waitForTimeout(300);
    const next = await rows.count();
    if (next === count && (await skeletons.count()) === 0) return next;
    count = next;
  }
  return count;
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
    const before = await settledRowCount(page, w);
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
    const after = await settledRowCount(page, w);
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

/** One example page: single panel, example rows, Code toggle, feature marker. */
const examplePage =
  (id, needle, marker) =>
  async ({ page, check }) => {
    await singleExample(page, check);
    const w = await example(page, id, check);
    if (marker) await marker(page, w, check);
    await codeToggle(page, id, needle, check);
  };

/** A story page (spec 56, 1.6.4) and the last one in the sidebar. */
const STORY_PAGE = 'features-aggregation--aggregation';
const LAST_STORY_PAGE = 'styling-theming--custom-dark-theme';
/** 42 example pages, then one row per story page under More examples. */
const LAST_ROW = 636;

/**
 * Spec 56 (1.6.4, D103): a story page shows its story in the playground on
 * the run's base (the toolbar names it, the table renders, Storybook opens
 * that base's story), the Code tab shows the story file, and the page has no
 * Copy prompt (a story has no registry item). The sidebar numbers the
 * Examples rows from `1. Basic` through More examples, which is open on a
 * page inside it.
 */
const storyPage =
  (id, row) =>
  async ({ page, check, base }) => {
    // one panel; the Try it and Related guides parts come with the texts
    const panels = await page.locator('article [data-mode]').count();
    check(`${id}: single example panel`, panels === 1, `panels=${panels}`);
    const panel = page.locator(`[id="example-${id}"]`);
    const rows = panel.locator('[data-slot="preview"] tbody tr');
    await rows
      .first()
      .waitFor({ timeout: 30000 })
      .catch(() => {});
    check(`${id}: table renders`, (await rows.count()) > 0);
    const label = (
      (await panel.locator('header button[aria-label="Base"]').textContent()) ??
      ''
    ).trim();
    check(
      `${id}: toolbar base is the run's base`,
      label === BASE_LABELS[base],
      label,
    );
    const href = await panel
      .locator('header a', { hasText: 'Storybook' })
      .getAttribute('href');
    check(
      `${id}: Storybook opens this story on the base`,
      href === `https://storybook.shadcn-table.com/${base}/?path=/story/${id}`,
      href ?? '',
    );
    check(
      `${id}: no Copy prompt`,
      (await panel.getByRole('button', { name: /Copy prompt/ }).count()) === 0,
    );
    await panel.getByRole('button', { name: 'Code', exact: true }).click();
    const code = panel.locator('[data-slot="code"]');
    await code.waitFor({ timeout: 10000 }).catch(() => {});
    const text = (await code.textContent().catch(() => '')) ?? '';
    check(
      `${id}: Code shows the story file`,
      text.includes('.stories.tsx') && text.includes('export default meta'),
    );
    await panel.getByRole('button', { name: 'Preview', exact: true }).click();
    const more = page.locator(
      '#nd-sidebar button[data-slot="collapsible-trigger"]',
      {
        hasText: 'More examples',
      },
    );
    check(
      'More examples open on a page inside it',
      (await more.getAttribute('aria-expanded').catch(() => null)) === 'true',
    );
    const links = page.locator('#nd-sidebar a[href^="/docs/examples/"]');
    const first = ((await links.first().textContent()) ?? '').trim();
    check('first Examples row is 1. Basic', first === '1. Basic', first);
    const active = (
      (await page.locator('#nd-sidebar a[data-active="true"]').textContent()) ??
      ''
    ).trim();
    if (row !== undefined)
      check(`${id}: sidebar row ${row}`, active.startsWith(`${row}. `), active);
  };

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
    await storedIconLibrary(page, check);
    // Example switcher: previous is disabled on the first example, next
    // steps to the second Featured row, React Query (D103).
    const header = w.locator('header');
    const prev = header.locator('button[aria-label^="Previous"]');
    const next = header.locator('button[aria-label^="Next"]');
    check(
      'switcher: no label',
      (await header.getByText('Select example').count()) === 0,
    );
    check(
      'switcher: prev disabled',
      await prev.isDisabled().catch(() => false),
    );
    check(
      'switcher: next names React Query',
      /^Next: React Query/.test((await next.getAttribute('aria-label')) ?? ''),
    );
    await next.click();
    await page
      .waitForURL('**/docs/examples/react-query', { timeout: 30000 })
      .catch(() => {});
    check(
      'switcher: next goes to react-query',
      new URL(page.url()).pathname === '/docs/examples/react-query',
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
  // no index page: the section opens its first example (docs-layout L13)
  '/docs/examples': async ({ page, check }) => {
    check(
      'redirects to the first example',
      new URL(page.url()).pathname === FIRST_EXAMPLE_URL,
      page.url(),
    );
    await sectionFrame(page, check, 'Examples');
  },
  '/docs/examples/faceted-values': examplePage(
    'enable-filter-facet-values',
    'enableFacetedValues: true',
    async (page, w, check) => {
      await headerLabelsFit(w, 'enable-filter-facet-values', check);
      const editor = await chipFilter(
        page,
        w,
        'faceted-values',
        'City',
        '[data-slot="select-trigger"], [role="combobox"]',
        check,
      );
      await closeChipEditor(page, editor);
    },
  ),
  '/docs/examples/filter-switching': examplePage(
    'customize-filter-modes',
    'enableColumnFilterModes: false',
    async (page, w, check) => {
      // the mode picker sits on the editor's top line in chips mode (D39)
      const editor = await chipFilter(
        page,
        w,
        'filter-switching',
        'First Name',
        'button[aria-label*="filter mode" i]',
        check,
      );
      await closeChipEditor(page, editor);
    },
  ),
  '/docs/examples/filter-variants': examplePage(
    'customize-filter-variants',
    "filterVariant: 'range-slider'",
    async (page, w, check) => {
      await headerLabelsFit(w, 'customize-filter-variants', check);
      // Radix and React Aria thumbs carry role=slider, the Base UI thumb is a range input.
      const editor = await chipFilter(
        page,
        w,
        'filter-variants',
        'Salary',
        '[role="slider"], input[type="range"]',
        check,
      );
      await closeChipEditor(page, editor);
    },
  ),
  '/docs/examples/subheader-filters': examplePage(
    'subheader-filters',
    "columnFilterDisplayMode: 'subheader'",
    async (page, w, check) => {
      // Radix and React Aria thumbs carry role=slider, the Base UI thumb is a range input.
      check(
        'range slider filter',
        (await w
          .locator('thead [role="slider"], thead input[type="range"]')
          .count()) > 0,
      );
      check(
        'date filter input',
        (await w.locator('thead input[type="date"]').count()) > 0,
      );
      check(
        'checkbox filter',
        (await w
          .locator('thead [role="checkbox"], thead [data-slot="checkbox"]')
          .count()) > 0,
      );
      check(
        'filter mode buttons',
        (await w.locator('thead button[aria-label*="filter mode" i]').count()) >
          0,
      );
      // F44: every filter input and caption sits inside its th and inside any
      // clipping box between them, each caption's text inside its box; the
      // slider track stays in its th and its "Filter Mode:" caption sits
      // below the track.
      const layout = await w.locator('thead').evaluate((thead) => {
        const inside = (inner, outer) =>
          inner.left >= outer.left - 1 &&
          inner.right <= outer.right + 1 &&
          inner.top >= outer.top - 1 &&
          inner.bottom <= outer.bottom + 1;
        const clipped = [];
        let slider = 'no slider';
        for (const th of thead.querySelectorAll('th')) {
          const cell = th.getBoundingClientRect();
          const parts = [
            ...th.querySelectorAll(
              '[data-slot="input-group"], [data-slot="slider-track"], [data-slot="slider-thumb"], label, p',
            ),
          ].filter((part) => !part.closest('[aria-hidden="true"]'));
          for (const part of parts) {
            const box = part.getBoundingClientRect();
            let clip = part.parentElement;
            let ok = inside(box, cell);
            while (ok && clip && clip !== th) {
              if (getComputedStyle(clip).overflowX !== 'visible')
                ok = inside(box, clip.getBoundingClientRect());
              clip = clip.parentElement;
            }
            // A Filter Mode caption's text overflowing its own box is cut too.
            if (
              ok &&
              part.textContent?.startsWith('Filter Mode:') &&
              part.scrollWidth > part.clientWidth + 1
            )
              ok = false;
            if (!ok)
              clipped.push(
                `${th.textContent?.trim().slice(0, 14)} ${part.dataset.slot ?? part.tagName}:${part.textContent?.trim().slice(0, 30)} [${Math.round(box.left - cell.left)}, ${Math.round(box.right - cell.left)}] in ${Math.round(cell.width)}`,
              );
          }
          const track = th.querySelector('[data-slot="slider-track"]');
          if (track) {
            const caption = [...th.querySelectorAll('label, p')].find((el) =>
              el.textContent?.startsWith('Filter Mode:'),
            );
            const trackBox = track.getBoundingClientRect();
            const top = caption?.getBoundingClientRect().top ?? -1;
            slider =
              top >= trackBox.bottom
                ? ''
                : `caption top ${top} < track bottom ${trackBox.bottom}`;
          }
        }
        return { clipped, slider };
      });
      check(
        'subheader filters not clipped',
        layout.clipped.length === 0,
        layout.clipped.join(' '),
      );
      check('slider caption below track', layout.slider === '', layout.slider);
    },
  ),
  '/docs/examples/persistent-view': examplePage(
    'persistent-view',
    'persistViewSettings: true',
    async (page, w, check) => {
      // F14: the docs prose margin must not push the pagination out of the
      // bottom toolbar
      const box = await w
        .locator('[data-slot="pagination-content"]')
        .last()
        .evaluate((el) => {
          const bar = el.closest('div.justify-between')?.parentElement;
          if (!bar) return null;
          const ul = el.getBoundingClientRect();
          const rect = bar.getBoundingClientRect();
          return {
            bar: Math.round(rect.bottom),
            inside: ul.top >= rect.top - 0.5 && ul.bottom <= rect.bottom + 0.5,
            ul: Math.round(ul.bottom),
          };
        })
        .catch(() => null);
      check(
        'pagination inside the bottom toolbar',
        !!box?.inside,
        box ? `ul=${box.ul} bar=${box.bar}` : 'no pagination',
      );
      // D24: with no stored view the example opens at ten rows
      await page.evaluate(() =>
        localStorage.removeItem('shadcn-table:persistent-view:view'),
      );
      await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
      const rows = w.locator('table tbody tr');
      await rows
        .first()
        .waitFor({ timeout: 30000 })
        .catch(() => {});
      const count = await rows.count();
      check('ten rows on first load', count === 10, `rows=${count}`);
      const size = await w
        .locator('[aria-label="Rows per page"]')
        .first()
        .evaluate((el) =>
          el.tagName === 'SELECT'
            ? el.value
            : el.textContent?.match(/\d+/)?.[0],
        )
        .catch(() => null);
      check('rows per page reads 10', size === '10', `select=${size}`);
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
      await headerLabelsFit(w, 'alternate-column-filtering', check);
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
  '/docs/examples/react-query': examplePage(
    'react-query',
    'useQuery',
    async (page, w, check) => {
      // a body row under the sticky header is a library layout fault: logged,
      // not failed (spec 06.2 1.6.5)
      const head = await w.locator('thead').first().boundingBox();
      const row = await w.locator('tbody tr').first().boundingBox();
      if (head && row && row.y < head.y + head.height - 0.5) {
        console.warn(
          `  warn react-query: first body row top ${Math.round(row.y)} above the sticky header bottom ${Math.round(head.y + head.height)}`,
        );
      }
      check('react-query: header and first row measured', !!head && !!row);
    },
  ),
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
      await headerLabelsFit(w, 'enable-row-dragging', check);
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
  [`/docs/examples/more/${STORY_PAGE}`]: storyPage(STORY_PAGE),
  [`/docs/examples/more/${LAST_STORY_PAGE}`]: storyPage(
    LAST_STORY_PAGE,
    LAST_ROW,
  ),
};

export default checks;
