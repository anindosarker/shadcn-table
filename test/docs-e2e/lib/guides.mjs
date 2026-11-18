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
  examplePanel,
  headerLabelsFit,
  names,
  paginationControls,
  panelOf,
  propTable,
  sectionFrame,
} from './helpers.mjs';

const count = (scope, selector) => scope.locator(selector).count();

/** Rendered widths of the header cells of example `w`, in px. */
const headWidths = (w) =>
  w
    .locator('thead tr')
    .first()
    .locator('th')
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));

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

const DESIGN_SYSTEM_KEY = 'st-design-system';

/**
 * Spec 13 (D26): the docs parts carry the design-system hooks, so the theme
 * panel's Style, Menu Color and Menu Accent reach a menu. Each check opens
 * the panel's own Style select (a `cn-menu-target` popup): a Style pick
 * changes its first item's computed padding or gap; Menu Color
 * `inverted` puts `dark` on its content (the provider loop); Menu Accent
 * `bold` paints the focused item with `--primary`. Leaves the default look
 * with empty storage (Shift+R).
 */
async function themeParts(page, check) {
  const trigger = page
    .locator('button[aria-label="Customize theme"]:visible')
    .first();
  const panel = page.getByRole('dialog');
  const content = page.locator('[data-slot="select-content"]').first();
  const openPanel = async () => {
    if (await panel.count()) return;
    await trigger.click();
    await panel.waitFor({ timeout: 5000 }).catch(() => {});
  };
  /** Opens the panel's `label` select; returns false when it does not open. */
  const openSelect = async (label) => {
    await openPanel();
    await panel.getByLabel(label, { exact: true }).first().click();
    const opened = await content
      .waitFor({ timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    // the provider loop marks new popups on the next frame
    await page.waitForTimeout(300);
    return opened;
  };
  const closeSelect = async () => {
    await page.keyboard.press('Escape');
    await content.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  };
  const pick = async (label, option) => {
    if (!(await openSelect(label))) return;
    await page.getByRole('option', { name: option, exact: true }).click();
    await content.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(300);
  };
  /**
   * The first item's padding and gap: set by the style layer only (`.cn-*`),
   * never by a token. The content's radius follows `--radius`, which a Style
   * pick also sets, so it changes on unhooked parts too.
   */
  const look = () =>
    content
      .getByRole('option')
      .first()
      .evaluate((el) => {
        const cs = getComputedStyle(el);
        return `padding ${cs.padding} gap ${cs.gap}`;
      });

  try {
    let before = '';
    let after = '';
    if (await openSelect('Style')) {
      before = await look();
      await closeSelect();
    }
    await pick('Style', 'Sera');
    if (await openSelect('Style')) {
      after = await look();
      await closeSelect();
    }
    check(
      'theme parts: style changes menus',
      before !== '' && after !== '' && before !== after,
      `${before} -> ${after}`,
    );

    await pick('Menu Color', 'Inverted');
    let classes = '';
    if (await openSelect('Style')) {
      classes = (await content.getAttribute('class')) ?? '';
      await closeSelect();
    }
    check(
      'theme parts: menu color inverts',
      classes.split(/\s+/).includes('dark'),
      `dark=${classes.split(/\s+/).includes('dark')}`,
    );

    await pick('Menu Accent', 'Bold');
    let paint = { background: '', primary: '', focused: false };
    if (await openSelect('Style')) {
      const item = content.getByRole('option').first();
      await item.hover();
      await item.focus();
      await page.waitForTimeout(300);
      paint = await item.evaluate((el) => {
        const probe = document.createElement('span');
        probe.style.backgroundColor = 'var(--primary)';
        el.appendChild(probe);
        const primary = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return {
          background: getComputedStyle(el).backgroundColor,
          primary,
          focused: document.activeElement === el,
        };
      });
      await closeSelect();
    }
    check(
      'theme parts: menu accent bold',
      paint.focused &&
        paint.primary !== '' &&
        paint.background === paint.primary,
      `focused=${paint.focused} ${paint.background} vs ${paint.primary}`,
    );
  } finally {
    await page.keyboard.press('Escape');
    await panel.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    await page.evaluate(() =>
      document.activeElement instanceof HTMLElement
        ? document.activeElement.blur()
        : undefined,
    );
    await page.keyboard.press('Shift+R');
    await page.evaluate(
      (key) => localStorage.removeItem(key),
      DESIGN_SYSTEM_KEY,
    );
  }
}

/**
 * Spec 55 (D105, finding 2 of the "Guide example block" review), as D113
 * builds it: no two elements share an example id. Every example playground
 * carries its name in `data-example`; after hydration (polled) each example
 * on the page has at most one element with `example-<name>` (a mount in the
 * guide body) and at most one with `guide-example-<name>` (the Example
 * section), at least one of the two, and no id of a playground repeats.
 */
async function uniqueExampleIds(page, check, label) {
  const probe = () => {
    const count = (id) => document.querySelectorAll(`[id="${id}"]`).length;
    const panels = [...document.querySelectorAll('[data-example]')];
    const names = [...new Set(panels.map((el) => el.dataset.example))];
    const wrong = names.filter((name) => {
      const plain = count(`example-${name}`);
      const section = count(`guide-example-${name}`);
      return plain > 1 || section > 1 || plain + section === 0;
    });
    const ids = panels.map((el) => el.id);
    const repeated = ids.filter((id, i) => ids.indexOf(id) !== i);
    return {
      ok: wrong.length === 0 && repeated.length === 0,
      wrong,
      repeated,
    };
  };
  await page
    .waitForFunction(
      `document.querySelector('[data-example]') && (${probe.toString()})().ok`,
      undefined,
      { timeout: 10000 },
    )
    .catch(() => {});
  const result = await page.evaluate(probe);
  check(
    `${label}: one element per example id`,
    result.ok,
    `wrong=${result.wrong.join(',')} repeated=${result.repeated.join(',')}`,
  );
}

/**
 * Spec 55 (D105): the guide's Example section. An h2 "Example" sits before
 * every other h2 of the guide, with one example playground between it and
 * the next heading; the playground's toolbar links its example page (one
 * example: the name; several: "Open example page" beside the picker).
 * Between the heading and the playground stands nothing, or, on a guide of
 * `EXPLAINERS` (D122), exactly the one explainer paragraph moved up with
 * the removed lower table.
 * Spec 58 (D117): only the first intro paragraph stands above the heading,
 * except on the guides of `INTRO_BLOCKS`.
 * Returns the section's playground.
 */
async function exampleSection(page, check, explainer) {
  const info = await page.evaluate(() => {
    const heading = document.querySelector('article h2#example');
    if (!heading) return null;
    const lead = [];
    for (
      let el = heading.nextElementSibling;
      el && !el.matches('[data-example], h2, h3');
      el = el.nextElementSibling
    ) {
      lead.push({ tag: el.tagName, text: el.textContent ?? '' });
    }
    const headings = [...document.querySelectorAll('article :is(h2, h3)')];
    const next = headings[headings.indexOf(heading) + 1];
    const follows = (a, b) =>
      !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    const panels = [
      ...document.querySelectorAll('article [data-example]'),
    ].filter((el) => follows(heading, el) && (!next || follows(el, next)));
    const link = panels[0]?.querySelector('header a[href^="/docs/examples/"]');
    const above = [...(heading.parentElement?.children ?? [])];
    return {
      intro: above.slice(0, above.indexOf(heading)).map((el) => el.tagName),
      firstH2: document.querySelector('article h2') === heading,
      lead,
      panels: panels.length,
      href: link?.getAttribute('href') ?? '',
    };
  });
  check('example section: h2 "Example"', info !== null);
  if (!info) return null;
  check('example section: first h2 of the guide', info.firstH2);
  const blocks = INTRO_BLOCKS[new URL(page.url()).pathname] ?? 1;
  check(
    `example section: follows ${blocks} intro block(s)`,
    info.intro.length === blocks && (blocks !== 1 || info.intro[0] === 'P'),
    info.intro.join(','),
  );
  const lead = info.lead.map(({ tag, text }) => `${tag}:${text}`);
  check(
    explainer
      ? 'example section: explainer line, then the playground'
      : 'example section: playground right under the heading',
    lead.join('|') === (explainer ? `P:${explainer}` : ''),
    lead.join('|').slice(0, 120),
  );
  check(
    'example section: one playground',
    info.panels === 1,
    `panels=${info.panels}`,
  );
  check('example section: links its example page', info.href !== '', info.href);
  await uniqueExampleIds(page, check, 'example section');
  return page.locator('article h2#example ~ [data-example]').first();
}

/**
 * Clicks the picker arrow `verb` ("Next", "Previous") of guide playground
 * `w`; an enabled arrow is labelled `<verb>: <example title>`.
 */
async function pickExample(page, w, verb) {
  await w.locator(`header button[aria-label^="${verb}: "]`).first().click();
  await page.waitForTimeout(500);
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
    // One h2 per section (spec 55); the h2 repeating the title is dropped
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
    // The Example section's story turns click to copy on for the whole
    // table: every cell of the first row holds a copy button.
    const w = page.locator('article h2#example ~ [data-example]').first();
    const cells = w.locator('table tbody tr').first().locator('td');
    await cells
      .first()
      .waitFor({ timeout: 30000 })
      .catch(() => {});
    const copy = await w
      .locator('table tbody tr')
      .first()
      .locator('td:has(button)')
      .count();
    check(
      'click to copy example: a copy button in every cell',
      copy > 0 && copy === (await cells.count()),
      `copy=${copy} cells=${await cells.count()}`,
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
    // spec 64: the Example section's table hides Address on load
    const hidden = await example(
      page,
      'features-column-hiding--column-hidden-on-load',
      check,
    );
    check(
      'column-hidden-on-load: no Address header',
      (await hidden.getByRole('columnheader', { name: /^Address/ }).count()) ===
        0,
    );
    const shown = await openMenu(page, hidden, 'Show/Hide columns');
    check(
      'column-hidden-on-load: Address unticked in the menu',
      (await shown
        .getByRole('menuitemcheckbox', { name: 'Address', exact: true })
        .getAttribute('aria-checked')
        .catch(() => '')) === 'false',
    );
    await page.keyboard.press('Escape');
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
    // spec 64: the Example section's table has First Name widened on load
    const widened = await example(
      page,
      'features-column-resizing--column-widened-on-load',
      check,
    );
    check(
      'column-widened-on-load: resize handles',
      (await count(widened, 'thead .cursor-col-resize')) > 0,
    );
    const first = await widened
      .locator('thead th:has-text("First Name")')
      .first()
      .evaluate((el) => el.getBoundingClientRect().width)
      .catch(() => 0);
    const widths = await headWidths(widened);
    check(
      'column-widened-on-load: First Name the widest column',
      first > 0 && first === Math.max(...widths),
      `first=${first} widths=${widths.map(Math.round).join(',')}`,
    );
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
    // spec 64: the Example section's columns have clearly different widths
    const w = await example(
      page,
      'styling-custom-column-widths--custom-widths-semantic',
      check,
    );
    const widths = await headWidths(w);
    check(
      'custom-widths-semantic: uneven column widths',
      widths.length > 1 && Math.max(...widths) > 2 * Math.min(...widths),
      widths.map(Math.round).join(','),
    );
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
    // spec 64: the Example section's table opens dense, the toggle in its toolbar
    const dense = await example(
      page,
      'features-dense-padding--default-to-dense-padding',
      check,
    );
    await marker(
      dense,
      'default-to-dense-padding',
      'density button',
      'button[aria-label="Toggle density"]',
      check,
    );
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
    // spec 64: the Example section's table shows the built-in display columns
    const top = await example(
      page,
      'styling-styling-display-columns--customize-display-columns',
      check,
    );
    check(
      'customize-display-columns story: row numbers header',
      /#/.test((await top.locator('thead').first().textContent()) ?? ''),
    );
    check(
      'customize-display-columns story: select all',
      (await count(top, '[aria-label="Toggle select all"]')) > 0,
    );
    await marker(
      top,
      'customize-display-columns story',
      'expand button',
      'tbody button[aria-label="Expand"]',
      check,
    );
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
    const w = await example(page, 'editing-crud-modal', check);
    // ST_Tooltip adds no aria-label to its trigger (MUI did); match the icon.
    await marker(
      w,
      'editing-crud-modal',
      'edit button',
      'tbody button:has(.lucide-pencil)',
      check,
    );
    // The Example section's picker lists the five editing examples in the
    // guide's order and swaps them in place.
    const section = page.locator('article h2#example ~ [data-example]').first();
    for (const id of [
      'editing-crud-row',
      'editing-crud-cell',
      'editing-crud-table',
      'editing-crud-tree',
    ]) {
      await pickExample(page, section, 'Next');
      await example(page, id, check);
    }
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
    // spec 64: the Example section's table opens with two chips set
    const w = await example(page, 'features-filter-chips--chips-seeded', check);
    check(
      'chips-seeded: two chips',
      (await count(w, '[data-filter-chip]')) === 2,
      `chips=${await count(w, '[data-filter-chip]')}`,
    );
    await marker(
      w,
      'chips-seeded',
      'filter button',
      'button[aria-label="Filter"]',
      check,
    );
  },
  '/docs/guides/overflow-tooltip': async ({ page, check }) => {
    await propTable(page, '#relevant-props-table', check);
    await propTable(page, '#relevant-column-options-table', check);
    // spec 64: the Example section's table cuts cell text with an ellipsis
    const top = await example(
      page,
      'styling-default-look--overflow-tooltip',
      check,
    );
    const cut = await top
      .locator('tbody td span.truncate')
      .evaluateAll(
        (els) => els.filter((el) => el.scrollWidth > el.clientWidth).length,
      );
    check('overflow-tooltip story: cut cell text', cut > 0, `cut=${cut}`);
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
    // spec 64: the Example section's table opens with two sorts applied
    const seeded = await example(
      page,
      'features-sort-popover--sort-popover-seeded',
      check,
    );
    await marker(
      seeded,
      'sort-popover-seeded',
      'sort button',
      'button:has-text("2 sorts")',
      check,
    );
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
    await themeParts(page, check);
  },
  '/docs/guides/full-screen-toggle': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, STATE, check);
  },
  '/docs/guides/global-filtering': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, COLUMN, check);
    await propTable(page, STATE, check);
    // spec 64: the Example section's table opens with its search box set
    const searched = await example(
      page,
      'features-search--searched-on-load',
      check,
    );
    const terms = await searched
      .locator('input')
      .evaluateAll((els) => els.map((el) => el.value));
    check(
      'searched-on-load: search box open with John',
      terms.includes('John'),
      terms.join(','),
    );
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
    // every guide of meta.json under its group heading (spec 53 1.6.3)
    const links = await page.locator('main a.docs-index-link').count();
    check('guides list links', links === 46, `links=${links}`);
    for (const id of ['fundamentals', 'customization-guides'])
      check(
        `guides list heading #${id}`,
        (await page.locator(`main h3[id="${id}"]`).count()) === 1,
      );
    await sectionFrame(page, check, 'Guides');
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
    // The Example section shows the guide's table as a story; its Code view
    // lists the server-side-data example's files (D130, D131).
    const w = await example(
      page,
      'features-server-data--production-ready-table',
      check,
    );
    await marker(
      w,
      'server-side-data',
      'refresh button',
      'button:has(.lucide-refresh-cw)',
      check,
    );
    check('steps', (await page.locator('article h2').count()) >= 4);
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
    // spec 64: the Example section's table has action buttons on every row
    const top = await example(
      page,
      'features-row-actions--custom-row-action-buttons',
      check,
    );
    const rows = await count(top, 'tbody tr');
    const viewed = await count(top, 'tbody tr:has(button:has-text("View"))');
    check(
      'custom-row-action-buttons: View on every row',
      rows > 0 && viewed === rows,
      `rows=${rows} view=${viewed}`,
    );
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
    // spec 64: the Example section's table (sticky-row-selection) opens with a row selected
    await marker(
      examplePanel(page, 'enable-row-pinning-select'),
      'enable-row-pinning-select',
      'selected row',
      'tbody [data-selected]',
      check,
    );
  },
  '/docs/guides/sorting': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, COLUMN, check);
    await propTable(page, STATE, check);
    // spec 64: the Example section's table, sorted on load; the lower copy
    // of the multi-sorting table is gone (D122)
    const multi = await example(
      page,
      'features-sorting--sorted-on-load',
      check,
    );
    await marker(
      multi,
      'sorted-on-load',
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
    // One h2 (shadcn components) with an h3 per listener example (spec 55:
    // guide sections are h2, their sub-sections h3).
    const headings = await page.locator('article h3').count();
    check('event listener sections', headings > 3, `h3=${headings}`);
  },
  '/docs/guides/tanstack-table-with-shadcn-ui': async ({ page, check }) => {
    const title = (
      (await page.locator('article h1').first().textContent()) ?? ''
    ).trim();
    check('title', title === 'TanStack Table with shadcn/ui', `h1=${title}`);
    check(
      'first section',
      (await page
        .locator('article h2', { hasText: 'What TanStack Table gives you' })
        .count()) > 0,
    );
    check('headings', (await count(page, 'article :is(h2, h3)')) >= 3);
  },
  '/docs/guides/toolbar-customization': async ({ page, check }) => {
    await propTable(page, TABLE, check);
    await propTable(page, STATE, check);
    // spec 64: the Example section's table has a custom toolbar button, the
    // Create New User icon button
    const top = await example(
      page,
      'features-toolbar--custom-top-toolbar-actions',
      check,
    );
    await marker(
      top,
      'custom-top-toolbar-actions',
      'custom toolbar button',
      'button:has(svg.lucide-square-plus)',
      check,
    );
    await example(page, 'minimal', check);
    const provider = await page
      .locator('article h2', { hasText: 'Compose with ST_TableProvider' })
      .count();
    check('table provider section', provider === 1, `h2=${provider}`);
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
    // The section's picker swaps row for column virtualization and back;
    // each example also shows further down, so the plain id passes between
    // mounts and must stay on exactly one element.
    const section = page.locator('article h2#example ~ [data-example]').first();
    await pickExample(page, section, 'Next');
    await uniqueExampleIds(page, check, 'after picker swap');
    await pickExample(page, section, 'Previous');
    await uniqueExampleIds(page, check, 'after picker swap back');
  },
};

/*
 * D122: the guides whose lower copy of the Example section's table was
 * removed and whose explainer line moved up into the section, as rendered
 * text.
 */
const EXPLAINERS = {
  '/docs/guides/async-loading':
    'Here is a copy of the full React Query example.',
  '/docs/guides/pagination':
    'Here is the full Remote Data example showing off server-side filtering, pagination, and sorting.',
  '/docs/guides/row-selection':
    'You can combine the row pinning feature with the row selection feature to create a cool user experience where selected rows always stay within view.',
  '/docs/guides/scroll-cues':
    'Hover the table to see the chevrons; the start and end pinned columns cast the edge shadow.',
  '/docs/guides/production-ready-tables':
    'Open the network tab and click around. Every page, sort, search or filter change sends one request to /api/users.',
};

/*
 * D117: guides whose Example section does not follow exactly one intro
 * paragraph, by the number of blocks above it. Full Screen Toggle has no
 * intro; Production-Ready Tables keeps its four-piece list, diagram and
 * closing line in the intro, as D130 left it (spec 58, 1.3).
 */
const INTRO_BLOCKS = {
  '/docs/guides/full-screen-toggle': 0,
  '/docs/guides/production-ready-tables': 4,
};

/*
 * Every guide page opens with its Example section (spec 55, D105): its
 * checks run first, then the page's own, in page order.
 */
for (const [path, run] of Object.entries(checks)) {
  if (!/^\/docs\/guides\/[^/]+$/.test(path)) continue;
  if (path === '/docs/guides/server-side-data') continue;
  checks[path] = async (ctx) => {
    await exampleSection(ctx.page, ctx.check, EXPLAINERS[path]);
    await run(ctx);
  };
}

export default checks;
