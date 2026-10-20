/**
 * Cluster A page checks: home, docs/index, getting-started, api/*.
 * Each entry: async ({ page, check }) => void, run after load at the first width.
 */
import {
  baseSwitch,
  codeToggle,
  example,
  names,
  paginationControls,
} from './_helpers.mjs';

/** The agent bar: one visible prompt pointing at /SKILL.md, Copy prompt writes it. */
async function agentBar(page, check) {
  const bar = page.locator('[data-slot="agent-bar"]');
  check('agent bar', (await bar.count()) === 1, String(await bar.count()));
  if (!(await bar.count())) return;
  const copy = bar.getByRole('button', { name: 'Copy prompt' });
  await copy.click();
  const written = await page.evaluate(() => window.__stClipboard ?? '');
  check(
    'copy prompt writes the skill prompt',
    written.startsWith('Install shadcn-table in my app: ') &&
      written.endsWith('/SKILL.md'),
    written,
  );
  check(
    'copied state',
    (await bar.getByRole('button', { name: 'Copied' }).count()) === 1,
  );
}

/**
 * The hero's command bar (components/agent-bar.tsx): the Command tab names
 * the site-wide base and its chevron menu sets it, so the command follows.
 * The tab text is uppercased by CSS; compare case-insensitively.
 */
async function commandBarBase(page, check) {
  const bar = page.locator('[data-slot="agent-bar"]');
  check('agent bar', (await bar.count()) === 1, String(await bar.count()));
  if (!(await bar.count())) return;
  const tab = bar.getByRole('radio', { name: /^command/i });
  const label = async () => ((await tab.textContent()) ?? '').trim();
  const command = async () =>
    (await bar.locator('span.font-mono').textContent()) ?? '';
  const pick = async (base) => {
    await bar.getByRole('button', { name: 'Choose base' }).click();
    const item = page.getByRole('menuitemradio', { name: base, exact: true });
    await item.waitFor({ timeout: 5000 });
    await item.click();
    await page.waitForTimeout(200);
  };
  check(
    'command tab names radix ui',
    /radix ui/i.test(await label()),
    await label(),
  );
  await tab.click();
  check(
    'radix command',
    (await command()).includes('/r/radix/'),
    await command(),
  );
  await bar.getByRole('button', { name: 'Choose base' }).click();
  const items = page.getByRole('menuitemradio');
  check(
    'base menu items',
    (await items.allTextContents()).join(',') === 'Radix UI,Base UI',
    (await items.allTextContents()).join(','),
  );
  check(
    'base menu: radix ui checked',
    (await items.first().getAttribute('aria-checked')) === 'true',
  );
  await page.keyboard.press('Escape');
  await pick('Base UI');
  check(
    'base ui: command',
    (await command()).includes('/r/base/'),
    await command(),
  );
  check('base ui: tab label', /base ui/i.test(await label()), await label());
  await pick('Radix UI');
  check(
    'radix ui again: command',
    (await command()).includes('/r/radix/'),
    await command(),
  );
  check(
    'radix ui again: tab label',
    /radix ui/i.test(await label()),
    await label(),
  );
}

const checks = {
  '/': async ({ page, check }) => {
    await commandBarBase(page, check);
  },
  '/docs/getting-started/usage': async ({ page, check }) => {
    const steps = page.locator('article .fd-step');
    check(
      'four steps',
      (await steps.count()) === 4,
      String(await steps.count()),
    );
    const w = await example(page, 'basic', check);
    await codeToggle(page, 'basic', 'useShadcnTable', check);
    // The header's base switch re-renders the example on Base UI and the
    // code view shows that variant's imports; Radix again afterwards.
    await baseSwitch(page, 'basic', check);
  },
  '/docs/guides/pagination': async ({ page, check }) => {
    const propNames = await names(page, '#relevant-props-table');
    check('table options rows', propNames.length === 8, propNames.join(','));
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
    const article = async () =>
      (await page.locator('article').textContent()) ?? '';
    // The hosted registry URL: the origin is the dev server's in dev.
    const addCommand = (base, item) =>
      new RegExp(`shadcn@latest add \\S+/r/${base}/${item}\\.json`);
    let txt = await article();
    check(
      'init on the radix base',
      txt.includes('shadcn@latest init --base radix'),
    );
    check('install command', addCommand('radix', 'shadcn-table').test(txt));
    check(
      'namespace form',
      txt.includes('registry add @st=') && txt.includes('add @st/shadcn-table'),
    );
    check(
      'compatibility sentence',
      txt.includes('Radix UI or Base UI base') &&
        txt.includes('React Aria is not supported'),
    );
    // The Base UI tab (the site-wide base group) switches both commands and
    // the header switch with them.
    await page
      .locator('article [role="tab"]', { hasText: 'Base UI' })
      .first()
      .click();
    await page.waitForTimeout(200);
    txt = await article();
    check(
      'base ui tab: init on the base ui base',
      txt.includes('shadcn@latest init --base base'),
    );
    check(
      'base ui tab: install command',
      addCommand('base', 'shadcn-table').test(txt),
    );
    check(
      'base ui tab: header switch follows',
      (await page
        .locator(
          '#nd-subnav [aria-label="shadcn base"] [role="tab"][data-active]',
        )
        .textContent()) === 'Base UI',
    );
    await page
      .locator('article [role="tab"]', { hasText: 'Radix UI' })
      .first()
      .click();
    await page.waitForTimeout(200);
    check(
      'radix tab again: install command',
      addCommand('radix', 'shadcn-table').test(await article()),
    );
    await agentBar(page, check);
  },
  '/docs/getting-started/agents': async ({ page, check }) => {
    await agentBar(page, check);
    const txt = (await page.locator('article').textContent()) ?? '';
    check(
      'skill install command',
      txt.includes('npx skills add anindosarker/shadcn-table'),
    );
    check(
      'llms link',
      (await page.locator('article a[href="/llms.txt"]').count()) === 1,
    );
  },
  '/docs/getting-started/migrating-v1': async ({ page, check }) => {
    const txt = (await page.locator('article').textContent()) ?? '';
    check('dependency bump', txt.includes('@tanstack/react-table 9.3.1'));
    check(
      'rename table lists sortFn and table.state',
      txt.includes('sortFn') && txt.includes('table.state'),
    );
    check(
      'tanstack migration guide link',
      (await page
        .locator(
          'article a[href="https://tanstack.com/table/latest/docs/framework/react/guide/migrating"]',
        )
        .count()) === 1,
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
    await propTable(page, '#props-table', 201, check);
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
    await propTable(page, '#column-instance-apis-table', 55, check);
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
  '/docs/api/st-components': async ({ page, check }) => {
    await switcher(page, 'ST Components', 2, check);
    const n = await page.locator('article h5').count();
    check('component headings', n === 30, String(n));
  },
  '/docs/api/st-hooks': async ({ page, check }) => {
    await switcher(page, 'ST Hooks', 2, check);
    const n = await page.locator('article h3').count();
    check('hook headings', n === 7, String(n));
  },
};

/**
 * OptionsSwitcher: `count` tabs, the one for this page active. The header's
 * base switch (components/base-selector.tsx) has two tabs of its own.
 */
async function switcher(page, active, count, check) {
  const tabs = page.locator('[role="tab"]:not(#nd-subnav *)');
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

export default checks;
