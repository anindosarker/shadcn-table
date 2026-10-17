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

/** Live example wrapper: #<id>-demo heading, table with rows. */
export async function example(page, id, check) {
  const demo = page.locator(`#${id}-demo`);
  check(`${id}: demo heading`, (await demo.count()) === 1);
  const wrapper = demo.locator('xpath=ancestor::div[1]/..');
  const rows = wrapper.locator('table tbody tr');
  await rows
    .first()
    .waitFor({ timeout: 30000 })
    .catch(() => {});
  const n = await rows.count();
  check(`${id}: table rows`, n > 0, `rows=${n}`);
  return wrapper;
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

export async function codeToggle(page, wrapper, id, needle, check) {
  const btn = wrapper.locator('button', { hasText: /^Code$/ });
  check(`${id}: Code button`, (await btn.count()) === 1);
  if (!(await btn.count())) return;
  await btn.first().click();
  const pre = page.locator(`#${id}-source-code pre`);
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
    (await page.locator(`#${id}-source-code button`).count()) >= 1,
  );
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
