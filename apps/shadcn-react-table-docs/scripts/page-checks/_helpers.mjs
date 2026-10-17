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
 * Live example playground: panel `#<id>` present, table with rows. The
 * table stays mounted in every view mode, so rows resolve even after the
 * Code toggle. Returns the panel locator.
 */
export async function example(page, id, check) {
  const panel = page.locator(`#${id}`);
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
 * Code toggle of `#<id>`: an example playground (Preview | Code | Split,
 * one file tab per source file) or a prop table's source toggle (no tabs).
 * Clicking Code must show the highlighted source containing `needle` with
 * its copy button, then switches a playground back to Preview. `wrapper` is
 * kept for the older call sites; the panel is located by id.
 */
export async function codeToggle(page, wrapper, id, needle, check) {
  const panel = page.locator(`#${id}`);
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
