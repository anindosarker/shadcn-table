/**
 * Cluster A page checks: home, docs/index, getting-started, api/*.
 * Each entry: async ({ page, check, base }) => void, run after load at
 * the first width; `base` is the base the page opened on (the runner's
 * --base, else the default).
 */
import {
  BASE_LABELS,
  BASES,
} from '../../../../packages/shadcn-table/scripts/registry/bases.mjs';
import {
  baseSwitch,
  codeToggle,
  example,
  headerBaseLabel,
  headerBaseMenu,
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
 * Opens on `base`, visits the other two, returns to it. The tab text is
 * uppercased by CSS; compare case-insensitively.
 */
async function commandBarBase({ page, check, base }) {
  const label0 = BASE_LABELS[base];
  const others = Object.keys(BASE_LABELS).filter((e) => e !== base);
  const bar = page.locator('[data-slot="agent-bar"]');
  check('agent bar', (await bar.count()) === 1, String(await bar.count()));
  if (!(await bar.count())) return;
  const tab = bar.getByRole('radio', { name: /^command/i });
  const label = async () => ((await tab.textContent()) ?? '').trim();
  const command = async () =>
    (await bar.locator('span.font-mono').textContent()) ?? '';
  const pick = async (name) => {
    await bar.getByRole('button', { name: 'Choose base' }).click();
    const item = page.getByRole('menuitemradio', { name, exact: true });
    await item.waitFor({ timeout: 5000 });
    await item.click();
    await page.waitForTimeout(200);
  };
  const expectBase = async (what, e) => {
    const l = BASE_LABELS[e];
    check(
      `${what}: command`,
      (await command()).includes(`/r/${e}/`),
      await command(),
    );
    check(
      `${what}: tab label`,
      (await label()).toLowerCase().includes(l.toLowerCase()),
      await label(),
    );
  };
  check(
    `command tab names ${label0}`,
    (await label()).toLowerCase().includes(label0.toLowerCase()),
    await label(),
  );
  await tab.click();
  check(
    `${base} command`,
    (await command()).includes(`/r/${base}/`),
    await command(),
  );
  await bar.getByRole('button', { name: 'Choose base' }).click();
  const items = page.getByRole('menuitemradio');
  check(
    'base menu items',
    (await items.allTextContents()).join(',') ===
      BASES.map((e) => BASE_LABELS[e]).join(','),
    (await items.allTextContents()).join(','),
  );
  check(
    `base menu: ${label0} checked`,
    (await items
      .filter({ hasText: label0 })
      .first()
      .getAttribute('aria-checked')) === 'true',
  );
  await page.keyboard.press('Escape');
  for (const other of others) {
    await pick(BASE_LABELS[other]);
    await expectBase(other, other);
  }
  await pick(label0);
  await expectBase(`${base} again`, base);
}

const checks = {
  '/': async ({ page, check, base }) => {
    await commandBarBase({ page, check, base });
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
      'redirects to introduction',
      page.url().endsWith('/docs/getting-started/introduction'),
      page.url(),
    );
  },
  '/docs/getting-started/install': async ({ page, check, base }) => {
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
    const addCommand = (target, item) =>
      new RegExp(`shadcn@latest add \\S+/r/${target}/${item}\\.json`);
    let txt = await article();
    // The page opens on `base`: the default (Base UI) in a fresh browser
    // context, the runner's --base otherwise; the header select agrees
    // and its menu lists the bases in order.
    check(
      `opens on ${BASE_LABELS[base]}`,
      (await headerBaseLabel(page)) === BASE_LABELS[base],
    );
    await headerBaseMenu(page, check, BASE_LABELS[base]);
    check(
      `init on the ${base} base`,
      txt.includes(`shadcn@latest init --base ${base}`),
    );
    check('install command', addCommand(base, 'shadcn-table').test(txt));
    check(
      'compatibility sentence',
      txt.includes('on the Base UI, Radix UI or React Aria base') &&
        txt.includes('React Aria is supported since 0.5.0'),
    );
    check(
      'aria style note',
      txt.includes('aria-* style') && txt.includes('aria-nova'),
    );
    // The Base UI tab (the site-wide base group) switches both commands and
    // the header select with them.
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
      'base ui tab: header select follows',
      (await headerBaseLabel(page)) === 'Base UI',
    );
    // The React Aria tab: same group, the aria commands.
    await page
      .locator('article [role="tab"]', { hasText: 'React Aria' })
      .first()
      .click();
    await page.waitForTimeout(200);
    txt = await article();
    check(
      'react aria tab: init on the react aria base',
      txt.includes('shadcn@latest init --base aria'),
    );
    check(
      'react aria tab: install command',
      addCommand('aria', 'shadcn-table').test(txt),
    );
    check(
      'react aria tab: header select follows',
      (await headerBaseLabel(page)) === 'React Aria',
    );
    check(
      'uninstall lists react-aria-components',
      txt.includes('react-aria-components'),
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
    // The @st namespace form lives here only; the localization guide links
    // to this page's Registry addresses section.
    check(
      'namespace form',
      txt.includes('registry add @st=') && txt.includes('add @st/shadcn-table'),
    );
    check(
      'one address per base',
      BASES.every((base) => txt.includes(`/r/${base}/shadcn-table.json`)),
    );
    check(
      'skill install command',
      txt.includes('npx skills add anindosarker/shadcn-table'),
    );
    check(
      'llms link',
      (await page.locator('article a[href="/llms.txt"]').count()) === 1,
    );
  },
  '/docs/getting-started': async ({ page, check }) => {
    check(
      'redirects to introduction',
      page.url().endsWith('/docs/getting-started/introduction'),
      page.url(),
    );
  },
  '/docs/api': async ({ page, check }) => {
    const n = await page.locator('article a[href^="/docs/api/"]').count();
    check('table of contents links', n >= 9, String(n));
  },
  '/docs/api/table-options': async ({ page, check }) => {
    await switcher(page, 'Table Options', 3, check);
    await propTable(page, '#props-table', 199, check);
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
 * OptionsSwitcher: `count` tabs, the one for this page active.
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
