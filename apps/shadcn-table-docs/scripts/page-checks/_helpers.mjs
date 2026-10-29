/**
 * Shared assertions for scripts/page-checks/<cluster>.mjs. Every helper takes
 * the Playwright `page` and the `check(name, ok, extra?)` reporter the runner
 * passes to each page check.
 */
import {
  DEFAULT_BASE,
  BASE_LABELS,
  BASES,
} from '../../../../packages/shadcn-table/scripts/registry/bases.mjs';

/** Prop-table option names (3rd cell; detail-panel rows have no cells). */
export async function names(page, tableId) {
  const cells = page.locator(`${tableId} table tbody tr td:nth-child(3)`);
  await cells
    .first()
    .waitFor({ timeout: 30000 })
    .catch(() => {});
  return (await cells.allTextContents()).map((t) => t.trim()).filter(Boolean);
}

/** Prop table renders at least one data row. Returns the option names. */
export async function propTable(page, tableId, check) {
  const list = await names(page, tableId);
  check(`${tableId}: rows`, list.length > 0, `rows=${list.length}`);
  return list;
}

/**
 * Example playground `#example-<id>` or prop-table source toggle
 * `#props-<id>` for a bare example or table id. Both carry a prefix so a
 * heading whose slug equals the id cannot resolve the locator to two nodes.
 */
export function panelOf(page, id) {
  return page.locator(`[id="example-${id}"], [id="props-${id}"]`);
}

/**
 * Live example playground: panel `#example-<id>` present, table with rows.
 * The table stays mounted in every view mode, so rows resolve even after
 * the Code toggle. Returns the panel locator.
 */
export async function example(page, id, check) {
  const panel = page.locator(`[id="example-${id}"]`);
  check(`${id}: panel`, (await panel.count()) === 1);
  const rows = panel.locator('table tbody tr');
  await rows
    .first()
    .waitFor({ timeout: 30000 })
    .catch(() => {});
  const n = await rows.count();
  check(`${id}: table rows`, n > 0, `rows=${n}`);
  return panel;
}

export async function paginationControls(wrapper, id, check) {
  const n =
    (await wrapper.locator('nav, [data-slot="pagination"]').count()) +
    (await wrapper
      .locator(
        'button[aria-label*="page" i], a[aria-label*="page" i], [data-slot="pagination-link"]',
      )
      .count());
  check(`${id}: pagination controls`, n > 0, `found=${n}`);
}

/**
 * Code toggle of `#example-<id>` or `#props-<id>`: an example playground (Preview | Code | Both,
 * a code explorer with a file tree and a path bar copy button) or a prop
 * table's source toggle (code block copy button). Clicking Code must show
 * the highlighted source containing `needle` with its copy button, then switches a playground back to Preview. A playground
 * also gets its explorer checked (the entry file `TS.tsx` shown, a file tree
 * with two or more entries when the example has several files, clicking the
 * second entry swaps the shown source, the path bar copy button copies the
 * shown file), plus its full screen toggle, the "Copy prompt" split button
 * (it must write the install command for `example-<id>` through the
 * clipboard stub scripts/check-pages.mjs installs) and its caret menu
 * (copy install command, Open in GitHub). The panel is located
 * by id.
 */
export async function codeToggle(page, id, needle, check) {
  const panel = panelOf(page, id);
  const btn = panel.locator('button', { hasText: /^Code$/ });
  check(`${id}: Code button`, (await btn.count()) === 1);
  if (!(await btn.count())) return;
  await btn.first().click();
  const pre = panel.locator('pre');
  await pre
    .first()
    .waitFor({ timeout: 15000 })
    .catch(() => {});
  const txt =
    (await pre
      .first()
      .textContent()
      .catch(() => '')) ?? '';
  check(`${id}: source shown`, txt.includes(needle), `len=${txt.length}`);
  const isPlayground = (await panel.getAttribute('data-mode')) !== null;
  const explorer = panel.locator('[data-slot="code-explorer"]');
  check(
    `${id}: copy button`,
    (await (
      isPlayground
        ? explorer.locator('button[aria-label^="Copy"]')
        : panel.locator('figure button')
    ).count()) >= 1,
  );
  if (isPlayground) {
    check(`${id}: code explorer`, (await explorer.count()) === 1);
    // The explorer opens on the entry file. With two or more files it has a
    // file tree (sm and up) whose rows swap the shown source; the path bar's
    // copy button writes the shown file through the clipboard stub.
    const copyBtn = explorer.locator('button[aria-label^="Copy"]').first();
    const shownPath = async () =>
      ((await copyBtn.getAttribute('aria-label').catch(() => '')) ?? '')
        .replace(/^Copy /, '')
        .trim();
    const tree = explorer.locator('nav[aria-label="Source files"]');
    const rows = tree.locator('[data-tree-row]:not([data-folder])');
    const hasTree = (await tree.count()) === 1;
    const fileRows = await rows.count();
    check(
      `${id}: file tree`,
      hasTree ? fileRows >= 2 : fileRows === 0,
      `tree=${hasTree} files=${fileRows}`,
    );
    check(
      `${id}: entry file shown`,
      (await shownPath()) === 'TS.tsx',
      `shown=${await shownPath()}`,
    );
    const shownSource = async () =>
      (await pre
        .first()
        .textContent()
        .catch(() => '')) ?? '';
    // Whitespace is dropped entirely: once the client-side highlight has
    // rendered, textContent of the line spans carries no newlines.
    const norm = (s) => s.replace(/\s+/g, '');
    if (hasTree && (await tree.isVisible().catch(() => false))) {
      const second = rows.nth(1);
      const target = (await second.getAttribute('title')) ?? '';
      await second.click();
      // The path bar updates at once; the code pane keeps the previous file
      // until DynamicCodeBlock has highlighted the new one. Poll the pane.
      await page
        .waitForFunction(
          ([sel, prev]) => {
            const pre = document.querySelector(sel)?.querySelector('pre');
            return !!pre && pre.textContent.replace(/\s+/g, '') !== prev;
          },
          [`[id="example-${id}"]`, norm(txt)],
          { timeout: 5000 },
        )
        .catch(() => {});
      const swapped = await shownSource();
      check(
        `${id}: file swap`,
        target !== 'TS.tsx' &&
          (await shownPath()) === target &&
          norm(swapped) !== norm(txt),
        `target=${target} shown=${await shownPath()} len=${swapped.length}`,
      );
      check(
        `${id}: active row`,
        (await tree
          .locator('[data-tree-row][aria-current="true"]')
          .getAttribute('title')
          .catch(() => null)) === target,
      );
    }
    await copyBtn.click();
    await page.waitForTimeout(100);
    const copied = await page.evaluate(() => window.__stClipboard ?? '');
    const shown = await shownSource();
    check(
      `${id}: file copied`,
      copied.length > 0 && norm(copied) === norm(shown),
      `clip=${copied.length} shown=${shown.length}`,
    );
    check(
      `${id}: copy copied state`,
      (await explorer.locator('button[aria-label="Copied"]').count()) === 1,
    );
    // Back to Preview so later steps can interact with the table.
    await panel
      .locator('button', { hasText: /^Preview$/ })
      .first()
      .click();
    // Example pages carry the page switcher in the panel header; guides do
    // not, since switching there would leave the guide.
    const onExamplePage = new URL(page.url()).pathname.startsWith(
      '/docs/examples/',
    );
    const switchers = await panel.locator('header [role="combobox"]').count();
    check(
      `${id}: panel switcher ${onExamplePage ? 'present' : 'absent'}`,
      switchers === (onExamplePage ? 1 : 0),
      `combobox=${switchers}`,
    );
    // Full screen (same button as the table toolbar's) toggles aria-pressed
    // and Escape leaves it again.
    const full = panel.locator(
      'header button[aria-label="Toggle full screen"]',
    );
    check(`${id}: full screen button`, (await full.count()) === 1);
    if (await full.count()) {
      await full.first().click();
      check(
        `${id}: full screen on`,
        (await full.getAttribute('aria-pressed').catch(() => null)) === 'true',
      );
      await page.keyboard.press('Escape');
      check(
        `${id}: full screen off`,
        (await full.getAttribute('aria-pressed').catch(() => null)) === 'false',
      );
    }
    // Split button: Copy prompt leads and reads "Copied" after a click.
    const copyPrompt = panel
      .locator('header [aria-label="Open example"]')
      .getByRole('button', { name: 'Copy prompt' });
    check(`${id}: copy prompt button`, (await copyPrompt.count()) === 1);
    if (await copyPrompt.count()) {
      await copyPrompt.click();
      await page.waitForTimeout(100);
      const text = await page.evaluate(() => window.__stClipboard ?? '');
      check(
        `${id}: prompt copied`,
        text.includes('shadcn@latest add') && text.includes(`example-${id}`),
        `len=${text.length}`,
      );
      check(
        `${id}: copied state`,
        (await panel
          .locator('header [aria-label="Open example"]')
          .getByRole('button', { name: 'Copied' })
          .count()) === 1,
      );
    }
    // Caret menu: copy install command, then the open-in items. The menu is
    // portaled, so its items are looked up on the page.
    const caret = panel.locator('button[aria-label="More actions"]');
    check(`${id}: caret button`, (await caret.count()) === 1);
    if (await caret.count()) {
      await caret.first().click();
      const menu = page.locator('[role="menu"]');
      await menu.waitFor({ timeout: 5000 }).catch(() => {});
      const copyInstall = menu.getByRole('menuitem', {
        name: 'Copy install command',
      });
      const github = menu.getByRole('menuitem', { name: 'Open in GitHub' });
      check(`${id}: copy install item`, (await copyInstall.count()) === 1);
      check(
        `${id}: open in GitHub item`,
        (await github.count()) === 1 &&
          /github\.com/.test((await github.getAttribute('href')) ?? ''),
      );
      if (await copyInstall.count()) {
        await copyInstall.click();
        await page.waitForTimeout(100);
        const text = await page.evaluate(() => window.__stClipboard ?? '');
        check(
          `${id}: install command copied`,
          text.includes('shadcn@latest add') && text.includes(`example-${id}`),
          `len=${text.length}`,
        );
      }
      await page.keyboard.press('Escape');
      await menu.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }
}

/**
 * Example group (shadcn Tabs): clicks every tab in order and asserts each
 * example renders a table with rows. `tabs` lists [label, exampleId].
 */
export async function exampleGroup(page, tabs, check) {
  for (const [label, id] of tabs) {
    const tab = page.locator('[role="tab"]', { hasText: label }).first();
    check(`${id}: tab "${label}"`, (await tab.count()) === 1);
    if (!(await tab.count())) continue;
    await tab.click();
    await page.waitForTimeout(300);
    await example(page, id, check);
  }
}

/**
 * The docs header's base select (BaseSwitch, components/base-selector.tsx):
 * a button labelled "Base" that shows the current base and opens a
 * radio menu over the bases.
 */
export const headerBase = (page) =>
  page.locator('#nd-subnav button[aria-label="Base"]');

/** The base the header select shows. */
export const headerBaseLabel = async (page) =>
  ((await headerBase(page).textContent()) ?? '').trim();

/** Opens the header select's menu; returns its radio items. */
export const openHeaderBaseMenu = async (page) => {
  await headerBase(page).click();
  const items = page.getByRole('menuitemradio');
  await items
    .first()
    .waitFor({ timeout: 5000 })
    .catch(() => {});
  return items;
};

/**
 * Picks a base by label through the header select, then waits for the
 * menu to close. The current base is left alone: the menu has nothing to
 * change then.
 */
export const pickHeaderBase = async (page, label) => {
  if ((await headerBaseLabel(page)) === label) return;
  const items = await openHeaderBaseMenu(page);
  await items.filter({ hasText: label }).click();
  await items
    .first()
    .waitFor({ state: 'detached', timeout: 5000 })
    .catch(() => {});
};

/**
 * The header select lists every base in BASES order (Base UI, Radix
 * UI, React Aria), the current one checked; the menu is closed again after.
 */
export async function headerBaseMenu(page, check, current) {
  const items = await openHeaderBaseMenu(page);
  const labels = (await items.allTextContents()).map((t) => t.trim());
  check(
    'header base menu lists the bases in order',
    labels.join(',') === BASES.map((e) => BASE_LABELS[e]).join(','),
    labels.join(', '),
  );
  const checked = page.locator('[role="menuitemradio"][aria-checked="true"]');
  check(
    'header base menu checks the current base',
    (await checked.count()) === 1 &&
      ((await checked.textContent()) ?? '').trim() === current,
  );
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
}

/**
 * Site-wide base switch (the header select above):
 * Base UI re-renders example `#example-<id>` (rows again, Base UI markup:
 * Base UI collapsibles set data-open/data-closed, Radix's set data-state),
 * then React Aria does (rows again, React Aria markup: React Aria Components
 * set data-rac on what they render, Radix and Base UI never do), while the
 * Code view keeps showing the base-neutral source, with
 * `@/components/ui/shadcn-table` imports and no `ui-radix`, `ui-base` or
 * `ui-aria`; then Radix again, same source. The page opens on the default
 * base (Base UI) or the runner's --base, so the loop starts by picking
 * Radix UI. No console errors is asserted by the runner. The explorer
 * highlights the active file in the browser, so the code view's text is
 * read only once a `code` element is in the explorer.
 */
export async function baseSwitch(page, id, check) {
  const panel = page.locator(`[id="example-${id}"]`);
  const header = headerBase(page);
  check('base switch in header', (await header.count()) === 1);
  if (!(await header.count())) return;
  const rows = panel.locator('table tbody tr');
  const code = panel.locator('[data-slot="code-explorer"] code');
  const source = async () => {
    await code
      .first()
      .waitFor({ timeout: 15000 })
      .catch(() => {});
    return (
      (await panel
        .locator('pre')
        .first()
        .textContent()
        .catch(() => '')) ?? ''
    );
  };
  const showCode = async () => {
    await panel
      .locator('button', { hasText: /^Code$/ })
      .first()
      .click();
    await page.waitForTimeout(200);
  };
  const showPreview = async () => {
    await panel
      .locator('button', { hasText: /^Preview$/ })
      .first()
      .click();
    await rows
      .first()
      .waitFor({ timeout: 60000 })
      .catch(() => {});
  };
  const pick = async (label) => {
    await pickHeaderBase(page, label);
    await rows
      .first()
      .waitFor({ timeout: 60000 })
      .catch(() => {});
  };
  const baseMarkup = () => panel.locator('[data-open], [data-closed]').count();
  const ariaMarkup = () => panel.locator('[data-rac]').count();
  const neutral = (text) =>
    text.includes("'@/components/ui/shadcn-table'") &&
    !text.includes('ui-radix') &&
    !text.includes('ui-base') &&
    !text.includes('ui-aria');
  await pick('Radix UI');
  check(`${id}: radix markup`, (await baseMarkup()) === 0);
  check(
    `${id}: radix markup, no react aria`,
    (await ariaMarkup()) === 0,
    `rac=${await ariaMarkup()}`,
  );
  await pick('Base UI');
  check(
    `${id}: base ui rows`,
    (await rows.count()) > 0,
    `rows=${await rows.count()}`,
  );
  check(
    `${id}: base ui markup`,
    (await baseMarkup()) > 0,
    `base=${await baseMarkup()}`,
  );
  check(
    `${id}: base ui markup, no react aria`,
    (await ariaMarkup()) === 0,
    `rac=${await ariaMarkup()}`,
  );
  await showCode();
  const baseSource = await source();
  check(
    `${id}: base ui source`,
    neutral(baseSource),
    `len=${baseSource.length}`,
  );
  await showPreview();
  await pick('React Aria');
  check(
    `${id}: react aria rows`,
    (await rows.count()) > 0,
    `rows=${await rows.count()}`,
  );
  check(
    `${id}: react aria markup`,
    (await ariaMarkup()) > 0,
    `rac=${await ariaMarkup()}`,
  );
  await showCode();
  const ariaSource = await source();
  check(
    `${id}: react aria source`,
    neutral(ariaSource),
    `len=${ariaSource.length}`,
  );
  await pickHeaderBase(page, 'Radix UI');
  await page.waitForTimeout(200);
  const radixSource = await source();
  check(
    `${id}: radix source again`,
    neutral(radixSource),
    `len=${radixSource.length}`,
  );
  await showPreview();
  check(`${id}: radix rows again`, (await rows.count()) > 0);
  check(
    `${id}: radix markup again`,
    (await baseMarkup()) === 0 && (await ariaMarkup()) === 0,
    `base=${await baseMarkup()} rac=${await ariaMarkup()}`,
  );
}

const DEMO_LAST = 'Now showing: Grouping';
const DEMO_MIN_HOLD_MS = 15000;
const DEMO_TIMEOUT_MS = 30000;

/**
 * Holds the home page through the full live demo loop on every base. The
 * demo (components/dev-home/v12/signal-demo.tsx) plays only while it is on
 * screen, so it is scrolled into view; each hold waits until its aria-live
 * status reads the last step and lasts at least DEMO_MIN_HOLD_MS. The first
 * hold runs on the base the page opened on (the default, Base UI, or the
 * runner's --base); the next two pick the other bases through the agent
 * bar's base menu and reload. A render loop or crash that needs
 * time or the demo's step changes to surface fails here (v0.3.0 died with
 * React error #185 about 9.6 s after load, when the demo's replay edit effect
 * re-ran on every render): the runner's pageerror and console listeners stay
 * attached across the reload, and a renderer crash fails
 * `demo: no renderer crash`.
 */
export async function demoLoop({ page, check, base }) {
  const opened = BASE_LABELS[base] ?? BASE_LABELS[DEFAULT_BASE];
  let crashed = false;
  page.once('crash', () => {
    crashed = true;
  });
  const hold = async () => {
    const start = Date.now();
    const status = page.locator('[aria-label="Demo items"] [aria-live]');
    await status.first().scrollIntoViewIfNeeded({ timeout: DEMO_TIMEOUT_MS });
    await status
      .filter({ hasText: DEMO_LAST })
      .first()
      .waitFor({ timeout: DEMO_TIMEOUT_MS });
    const rest = DEMO_MIN_HOLD_MS - (Date.now() - start);
    if (rest > 0) await page.waitForTimeout(rest);
    return Date.now() - start;
  };
  const run = async (name, before) => {
    try {
      if (before) await before();
      const ms = await hold();
      check(name, !crashed, `held=${ms}ms`);
    } catch (e) {
      check(name, false, String(e.message).split('\n')[0].slice(0, 160));
    }
  };
  /** Picks a base through the agent bar's menu, reloads, and asserts it kept. */
  const choose = (label) => async () => {
    const bar = page.locator('[data-slot="agent-bar"]');
    await bar.getByRole('button', { name: 'Choose base' }).click();
    const item = page.getByRole('menuitemradio', {
      name: label,
      exact: true,
    });
    await item.waitFor({ timeout: 5000 });
    await item.click();
    await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
    const tab =
      (await bar
        .getByRole('radio', { name: /^command/i })
        .textContent()
        .catch(() => '')) ?? '';
    if (!tab.toLowerCase().includes(label.toLowerCase()))
      throw new Error(`base not kept after reload: ${tab.trim()}`);
  };
  await run(`demo: ${opened.toLowerCase()} reaches Grouping`);
  for (const label of Object.values(BASE_LABELS).filter((l) => l !== opened)) {
    const name = `demo: ${label.toLowerCase()} reaches Grouping`;
    if (crashed) check(name, false, 'skipped after crash');
    else await run(name, choose(label));
  }
  check('demo: no renderer crash', !crashed);
}
