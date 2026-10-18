/**
 * Cluster A page checks: docs/index, getting-started, api/*.
 * Each entry: async ({ page, check }) => void, run after load at the first width.
 */
import { codeToggle, example, names, paginationControls } from './_helpers.mjs';

/** The agent bar: one visible prompt pointing at /SKILL.md, Copy prompt writes it. */
async function agentBar(page, check) {
  const bar = page.locator('[data-slot="agent-bar"]');
  check('agent bar', (await bar.count()) === 1, String(await bar.count()));
  if (!(await bar.count())) return;
  const copy = bar.getByRole('button', { name: 'Copy prompt' });
  await copy.click();
  const written = await page.evaluate(() => window.__srtClipboard ?? '');
  check(
    'copy prompt writes the skill prompt',
    written.startsWith('Install shadcn-react-table in my app: ') &&
      written.endsWith('/SKILL.md'),
    written,
  );
  check(
    'copied state',
    (await bar.getByRole('button', { name: 'Copied' }).count()) === 1,
  );
}

export default {
  '/docs/getting-started/usage': async ({ page, check }) => {
    const steps = page.locator('article .fd-step');
    check(
      'four steps',
      (await steps.count()) === 4,
      String(await steps.count()),
    );
    const w = await example(page, 'basic', check);
    await codeToggle(page, 'basic', 'useShadcnReactTable', check);
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
      'alternate-pagination',
      "paginationDisplayMode: 'pages'",
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
  '/docs': async ({ page, check }) => {
    check(
      'redirects to install',
      page.url().endsWith('/docs/getting-started/install'),
      page.url(),
    );
  },
  '/docs/getting-started/install': async ({ page, check }) => {
    const steps = page.locator('article .fd-step');
    const tabs = page.locator('article [role="tab"]');
    check(
      'three steps',
      (await steps.count()) === 3,
      String(await steps.count()),
    );
    check(
      'package manager tabs',
      (await tabs.count()) >= 8,
      String(await tabs.count()),
    );
    const txt = (await page.locator('article').textContent()) ?? '';
    check(
      'init on the radix base',
      txt.includes('shadcn@latest init --base radix'),
    );
    check(
      'install command',
      txt.includes(
        'shadcn@latest add anindosarker/shadcn-react-table/shadcn-react-table',
      ),
    );
    await agentBar(page, check);
  },
  '/docs/getting-started/production-ready-tables': async ({ page, check }) => {
    const w = await example(page, 'server-side-data', check);
    check(
      'server-side-data: refresh button',
      (await w.locator('button:has(.lucide-refresh-cw)').count()) === 1,
    );
    check('steps', (await page.locator('article h3').count()) >= 4);
  },
  '/docs/guides/server-side-data': async ({ page, check }) => {
    check(
      'redirects to production-ready-tables',
      page.url().endsWith('/docs/getting-started/production-ready-tables'),
      page.url(),
    );
  },
  '/docs/getting-started/agents': async ({ page, check }) => {
    await agentBar(page, check);
    const txt = (await page.locator('article').textContent()) ?? '';
    check(
      'skill install command',
      txt.includes('npx skills add anindosarker/shadcn-react-table'),
    );
    check(
      'llms link',
      (await page.locator('article a[href="/llms.txt"]').count()) === 1,
    );
  },
  '/docs/getting-started': async ({ page, check }) => {
    check(
      'redirects to install',
      page.url().endsWith('/docs/getting-started/install'),
      page.url(),
    );
  },
  '/docs/api': async ({ page, check }) => {
    const n = await page.locator('article a[href^="/docs/api/"]').count();
    check('table of contents links', n >= 9, String(n));
  },
  '/docs/api/table-options': async ({ page, check }) => {
    await switcher(page, 'Table Options', 3, check);
    await propTable(page, '#props-table', 210, check);
    await codeToggle(page, 'root-props', 'TableOptionsTable', check);
  },
  '/docs/api/column-options': async ({ page, check }) => {
    await switcher(page, 'Column Options', 3, check);
    await propTable(page, '#column-options-table', 63, check);
    await codeToggle(page, 'column-options', 'ColumnOptionsTable', check);
  },
  '/docs/api/state-options': async ({ page, check }) => {
    await switcher(page, 'State Options', 3, check);
    await propTable(page, '#state-options-table', 33, check);
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
    await propTable(page, '#column-instance-apis-table', 56, check);
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
  '/docs/api/srt-components': async ({ page, check }) => {
    await switcher(page, 'SRT Components', 2, check);
    const n = await page.locator('article h5').count();
    check('component headings', n === 30, String(n));
  },
  '/docs/api/srt-hooks': async ({ page, check }) => {
    await switcher(page, 'SRT Hooks', 2, check);
    const n = await page.locator('article h3').count();
    check('hook headings', n === 7, String(n));
  },
};

/** OptionsSwitcher: `count` tabs, the one for this page active. */
async function switcher(page, active, count, check) {
  const tabs = page.locator('[role="tab"]');
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
