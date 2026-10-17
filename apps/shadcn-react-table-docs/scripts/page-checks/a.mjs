/**
 * Cluster A page checks: docs/index, getting-started, api/*.
 * Each entry: async ({ page, check }) => void, run after load at the first width.
 */
import { codeToggle, example, names, paginationControls } from './_helpers.mjs';

export default {
  '/docs/getting-started/usage': async ({ page, check }) => {
    const w = await example(page, 'basic', check);
    await codeToggle(page, w, 'basic', 'useShadcnReactTable', check);
  },
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
      'srtPaginationProps copy id',
      (await page.locator('#srtPaginationProps-prop').count()) === 1,
    );
    const alt = await example(page, 'alternate-pagination', check);
    await paginationControls(alt, 'alternate-pagination', check);
    await codeToggle(
      page,
      alt,
      'alternate-pagination',
      "paginationDisplayMode: 'pages'",
      check,
    );
    const remote = await example(page, 'remote', check);
    await paginationControls(remote, 'remote', check);
    await codeToggle(page, remote, 'remote', 'manualPagination: true', check);
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
};
