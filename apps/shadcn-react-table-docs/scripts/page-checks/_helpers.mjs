/**
 * Shared assertions for scripts/page-checks/<cluster>.mjs. Every helper takes
 * the Playwright `page` and the `check(name, ok, extra?)` reporter the runner
 * passes to each page check.
 */

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
 * Code toggle of `#example-<id>` or `#props-<id>`: an example playground (Preview | Code | Split,
 * one file tab per source file) or a prop table's source toggle (no tabs).
 * Clicking Code must show the highlighted source containing `needle` with
 * its copy button, then switches a playground back to Preview. A playground
 * also gets its full screen toggle and the caret menu's copy items checked:
 * "Copy prompt" must write the install command for `example-<id>` through
 * the clipboard stub scripts/check-pages.mjs installs. The panel is located
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
  check(
    `${id}: copy button`,
    (await panel.locator('figure button').count()) >= 1,
  );
  if ((await panel.getAttribute('data-mode')) !== null) {
    const tabs = await panel.locator('[role="tab"]').count();
    check(`${id}: file tabs`, tabs === 1 || tabs === 2, `tabs=${tabs}`);
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
    // Caret menu: copy items above the disabled open-in items. The menu is
    // portaled, so its items are looked up on the page.
    const caret = panel.locator('button[aria-label="More ways to open"]');
    check(`${id}: caret button`, (await caret.count()) === 1);
    if (await caret.count()) {
      await caret.first().click();
      const menu = page.locator('[role="menu"]');
      await menu.waitFor({ timeout: 5000 }).catch(() => {});
      const copyInstall = menu.getByRole('menuitem', {
        name: 'Copy install command',
      });
      const copyPrompt = menu.getByRole('menuitem', { name: 'Copy prompt' });
      check(`${id}: copy install item`, (await copyInstall.count()) === 1);
      check(`${id}: copy prompt item`, (await copyPrompt.count()) === 1);
      if (await copyPrompt.count()) {
        await copyPrompt.click();
        await page.waitForTimeout(100);
        const text = await page.evaluate(() => window.__srtClipboard ?? '');
        check(
          `${id}: prompt copied`,
          text.includes('shadcn@latest add') && text.includes(`example-${id}`),
          `len=${text.length}`,
        );
        check(
          `${id}: copied state`,
          (await menu.getByRole('menuitem', { name: 'Copied' }).count()) === 1,
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
