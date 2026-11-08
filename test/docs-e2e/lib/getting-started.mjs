/**
 * Getting started page checks: the home page, /docs and getting-started/*.
 * Each entry: async ({ page, check, base }) => void, run after load at the
 * first width; `base` is the base the page opened on (the runner's --base,
 * else the default). The home page asserts the hero command bar (it follows
 * the site-wide base), the landing (hero, install command, live demo rows,
 * feature and install headings, guide links), then holds the page through the
 * full live demo loop on Base UI, Radix UI and React Aria (demoLoop in
 * helpers.mjs), and ends with the theme customizer (themeCustomizer).
 */
import { BASE_LABELS, BASES } from '../../../tools/registry/bases.mjs';
import {
  baseSwitch,
  codeToggle,
  demoLoop,
  example,
  headerBaseLabel,
  headerBaseMenu,
} from './helpers.mjs';

/**
 * The install page's edition select and Short form switch: both commands
 * start on Lucide (`shadcn-table`), Tabler in the first select switches both
 * (one pick per page) to `shadcn-table-tabler`, and Short form shows the
 * `components.json` registries entry and the `@shadcn-table/<item>` command.
 * The page is on the Radix UI tab when this runs.
 */
async function iconEditions(page, check, article) {
  check(
    'created with shadcn create section',
    (await page
      .locator('article h2', { hasText: 'Created with shadcn create' })
      .count()) === 1,
  );
  const selects = page.locator('article button[aria-label="Icon library"]');
  check(
    'icon library select per command',
    (await selects.count()) === 2,
    String(await selects.count()),
  );
  if (!(await selects.count())) return;
  check(
    'icon library starts on Lucide',
    (await selects.first().textContent())?.trim() === 'Lucide',
    (await selects.first().textContent()) ?? '',
  );
  await selects.first().click();
  const tabler = page.getByRole('menuitemradio', { name: 'Tabler' });
  await tabler.waitFor({ timeout: 5000 }).catch(() => {});
  await tabler.click();
  await tabler.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  const commands = page.locator('article pre:visible', {
    hasText: 'shadcn-table-tabler.json',
  });
  check(
    'tabler: both commands install the edition',
    (await commands.count()) === 2,
    String(await commands.count()),
  );
  check(
    'tabler: update command overwrites',
    /\/r\/radix\/shadcn-table-tabler\.json --overwrite/.test(await article()),
  );
  const short = page.locator('article [role="switch"]').first();
  await short.click();
  await page.waitForTimeout(200);
  const txt = await article();
  check(
    'short form: namespace command',
    txt.includes('shadcn@latest add @shadcn-table/shadcn-table-tabler'),
  );
  check(
    'short form: registries entry',
    txt.includes('"registries"') &&
      txt.includes('"@shadcn-table"') &&
      txt.includes('/r/{style}/{name}.json'),
  );
  await short.click();
}

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
 * The hero's command bar (components/agent-bar.tsx): the Command tab names the
 * site-wide base and its chevron menu sets it, so the command follows. Opens on
 * `base`, visits the other two, returns to it. The tab text is uppercased by
 * CSS; compare case-insensitively.
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

/**
 * The `Default` color preset's primary (apps/shadcn-table-docs/lib/design-system/color-presets.ts),
 * the Emerald look a fresh visitor sees.
 */
const DEFAULT_PRIMARY = {
  light: 'oklch(0.596 0.145 163.225)',
  dark: 'oklch(0.765 0.177 163.223)',
};
const DESIGN_SYSTEM_KEY = 'st-design-system';

/**
 * The theme customizer (components/theme-customizer.tsx, D2): the default
 * tokens come from the design system style element with empty storage and
 * with a choice older than 2 days; the palette button opens the panel, which
 * has no Copy and no Import button (D21) and one shortcut row with Reset,
 * Undo, Redo, Random and Next preset that does not overflow (D22); with the
 * panel open `r`, `Mod+Z`, `Mod+Shift+Z` and `Shift+R` shuffle, undo, redo
 * and reset, `p` does nothing; `r` does nothing while the search dialog is
 * open; a Colors tab edit changes the computed
 * variable; the Icon Library select switches the home tables (spec 14).
 * Leaves the page on the default look with empty storage.
 */
async function themeCustomizer({ page, check }) {
  const primary = () =>
    page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--primary')
        .trim(),
    );
  /** `--primary` in light and dark, the `.dark` class restored after. */
  const bothModes = () =>
    page.evaluate(() => {
      const root = document.documentElement;
      const wasDark = root.classList.contains('dark');
      const read = () =>
        getComputedStyle(root).getPropertyValue('--primary').trim();
      root.classList.remove('dark');
      const light = read();
      root.classList.add('dark');
      const dark = read();
      root.classList.toggle('dark', wasDark);
      return { light, dark };
    });
  const reload = async () => {
    await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(1000);
  };
  const stored = () =>
    page.evaluate((key) => localStorage.getItem(key), DESIGN_SYSTEM_KEY);

  await page.evaluate((key) => localStorage.removeItem(key), DESIGN_SYSTEM_KEY);
  await reload();
  const fresh = await bothModes();
  const styleElement = await page.evaluate(
    () => document.getElementById('design-system-theme-vars') !== null,
  );
  check(
    'theme: default look with empty storage',
    styleElement &&
      fresh.light === DEFAULT_PRIMARY.light &&
      fresh.dark === DEFAULT_PRIMARY.dark,
    `style=${styleElement} ${JSON.stringify(fresh)}`,
  );

  await page.evaluate((key) => {
    const css =
      ':root[data-design-system] { --primary: oklch(0.5 0.2 20); }\n' +
      ':root[data-design-system].dark { --primary: oklch(0.5 0.2 20); }\n';
    localStorage.setItem(
      key,
      JSON.stringify({
        config: { style: 'nova', colorPreset: 'mono' },
        css,
        savedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      }),
    );
  }, DESIGN_SYSTEM_KEY);
  await reload();
  const stale = await bothModes();
  const left = await stored();
  check(
    'theme: a stale choice is ignored and removed',
    stale.light === DEFAULT_PRIMARY.light &&
      stale.dark === DEFAULT_PRIMARY.dark &&
      left === null,
    `${JSON.stringify(stale)} stored=${left !== null}`,
  );

  const trigger = page
    .locator('button[aria-label="Customize theme"]:visible')
    .first();
  const panel = page.getByRole('dialog');
  if (await trigger.count()) {
    await trigger.click();
    await panel.waitFor({ timeout: 5000 }).catch(() => {});
  }
  const tabs = await panel.getByRole('tab').allTextContents();
  const heading = await panel
    .getByRole('heading', { name: 'Theme', exact: true })
    .count();
  // D21: no Copy menu and no Import popover in the panel
  const copyImport = await panel
    .getByRole('button', { name: /^(Copy|Import)$/ })
    .count();
  check(
    'theme: the palette button opens the panel',
    heading === 1 &&
      ['Colors', 'Typography', 'Other'].every((t) => tabs.includes(t)) &&
      copyImport === 0,
    `heading=${heading} tabs=${tabs.join(',')} copyImport=${copyImport}`,
  );

  // D22: one shortcut row under the header, five buttons by accessible name
  const shortcutNames = ['Reset', 'Undo', 'Redo', 'Random', 'Next preset'];
  const shortcutCounts = [];
  for (const name of shortcutNames) {
    shortcutCounts.push(
      await panel.getByRole('button', { name, exact: true }).count(),
    );
  }
  check(
    'theme: the shortcut row has Reset, Undo, Redo, Random, Next preset',
    shortcutCounts.every((n) => n === 1),
    shortcutNames.map((n, i) => `${n}=${shortcutCounts[i]}`).join(' '),
  );
  const rowSize = await page.evaluate(() => {
    const row = document.querySelector('[data-slot="theme-shortcut-row"]');
    return row ? { scroll: row.scrollWidth, client: row.clientWidth } : null;
  });
  check(
    'theme: the shortcut row does not overflow',
    rowSize !== null && rowSize.scroll === rowSize.client,
    JSON.stringify(rowSize),
  );

  // the shortcuts, pressed with the panel open once focus has moved into it
  await page
    .waitForFunction(
      () =>
        document
          .querySelector('[role="dialog"]')
          ?.contains(document.activeElement) === true,
      null,
      { timeout: 5000 },
    )
    .catch(() => {});
  await page.waitForTimeout(300);
  const press = async (key) => {
    await page.keyboard.press(key);
    await page.waitForTimeout(200);
  };
  // A shuffle can land on a look with the same primary (a theme matching the
  // color preset it left), so `r` is pressed until --primary moves, at most
  // three times; every press before that kept --primary, so undo still
  // returns to `before`.
  const shuffle = async (from) => {
    let value = from;
    for (let i = 0; i < 3 && value === from; i++) {
      await press('r');
      value = await primary();
    }
    return value;
  };
  const before = await primary();
  const shuffled = await shuffle(before);
  check(
    'theme: r changes --primary',
    shuffled !== before,
    `${before} -> ${shuffled}`,
  );
  await press('ControlOrMeta+z');
  const undone = await primary();
  check(
    'theme: Mod+Z restores it',
    shuffled !== before && undone === before,
    `${shuffled} -> ${undone}`,
  );
  await press('ControlOrMeta+Shift+z');
  const redone = await primary();
  check(
    'theme: Mod+Shift+Z reapplies the shuffled value',
    shuffled !== before && undone === before && redone === shuffled,
    `${undone} -> ${redone}`,
  );
  const again = await shuffle(redone);
  await press('p');
  const afterP = await primary();
  check('theme: p changes nothing', afterP === again, `${again} -> ${afterP}`);
  await press('Shift+R');
  const reset = await primary();
  check(
    'theme: Shift+R returns to the default',
    again !== DEFAULT_PRIMARY.dark && reset === DEFAULT_PRIMARY.dark,
    `${again} -> ${reset}`,
  );
  await page.keyboard.press('Escape');
  await panel.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  await page.evaluate(() =>
    document.activeElement instanceof HTMLElement
      ? document.activeElement.blur()
      : undefined,
  );

  await page.keyboard.press('ControlOrMeta+k');
  const search = page.getByRole('dialog');
  await search.waitFor({ timeout: 5000 }).catch(() => {});
  const searchOpen = (await search.count()) > 0;
  await press('r');
  const duringSearch = await primary();
  check(
    'theme: r does nothing while the search dialog is open',
    searchOpen && duringSearch === reset,
    `search=${searchOpen} ${reset} -> ${duringSearch}`,
  );
  await page.keyboard.press('Escape');
  await search.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});

  const edited = 'oklch(0.6 0.2 30)';
  let afterEdit = '';
  if (await trigger.count()) {
    await trigger.click();
    await panel.waitFor({ timeout: 5000 }).catch(() => {});
    const input = panel.getByLabel('primary', { exact: true });
    if (await input.count()) {
      await input.fill(edited);
      await page.waitForTimeout(200);
      afterEdit = await primary();
    }
    await page.keyboard.press('Escape');
    await panel.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
  }
  check(
    'theme: a Colors tab edit changes the computed variable',
    afterEdit === edited,
    afterEdit,
  );

  await themeColorPicker({ page, check, trigger, panel, primary, press });
  await themeIconLibrary({ page, check, trigger, panel });
  await page.keyboard.press('Shift+R');
  await page.evaluate((key) => localStorage.removeItem(key), DESIGN_SYSTEM_KEY);
}

/**
 * The Colors tab picker (spec 10, D23): the `primary` swatch is a button that
 * opens a popover holding a `react-colorful` picker; dragging the hue to its
 * start and the saturation square to its top right corner writes `#ff0000`
 * live; after Escape one `Mod+Z` returns to the value before the click and a
 * second one to the value before the typed edit that precedes the session, so
 * the session left exactly one history entry. Closes the panel.
 */
async function themeColorPicker({
  page,
  check,
  trigger,
  panel,
  primary,
  press,
}) {
  const typed = 'oklch(0.55 0.15 250)';
  let chainStart = '';
  let before = '';
  let opened = false;
  let picked = '';
  let undone = '';
  let undoneTwice = '';
  if (await trigger.count()) {
    await trigger.click();
    await panel
      .first()
      .waitFor({ timeout: 5000 })
      .catch(() => {});
    await page.waitForTimeout(300);
    const input = panel.first().getByLabel('primary', { exact: true });
    if (await input.count()) {
      chainStart = await primary();
      await input.fill(typed);
      await page.waitForTimeout(200);
      before = await primary();
    }
    const swatch = page.getByRole('button', {
      name: 'Pick primary',
      exact: true,
    });
    if (await swatch.count()) {
      await swatch.click();
      const picker = page.locator('[role="dialog"] .react-colorful').first();
      opened = await picker
        .waitFor({ timeout: 5000 })
        .then(() => true)
        .catch(() => false);
      if (opened) {
        const viewport = page.viewportSize() ?? { width: 1280, height: 720 };
        const clampX = (x) => Math.max(0, Math.min(viewport.width - 1, x));
        const clampY = (y) => Math.max(0, Math.min(viewport.height - 1, y));
        // press in the middle, release past the given edge: the picker clamps
        const drag = async (part, toX, toY) => {
          const box = await picker.locator(part).boundingBox();
          if (!box) return;
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(clampX(toX(box)), clampY(toY(box)), {
            steps: 5,
          });
          await page.mouse.up();
        };
        await drag(
          '.react-colorful__hue',
          (box) => box.x - 8,
          (box) => box.y + box.height / 2,
        );
        await drag(
          '.react-colorful__saturation',
          (box) => box.x + box.width + 8,
          (box) => box.y - 8,
        );
        await page.waitForTimeout(200);
        picked = await primary();
      }
      await page.keyboard.press('Escape');
      await page
        .locator('.react-colorful')
        .first()
        .waitFor({ state: 'detached', timeout: 5000 })
        .catch(() => {});
      await page.waitForTimeout(200);
      await press('ControlOrMeta+z');
      undone = await primary();
      await press('ControlOrMeta+z');
      undoneTwice = await primary();
    }
    await page.keyboard.press('Escape');
    await panel
      .first()
      .waitFor({ state: 'detached', timeout: 5000 })
      .catch(() => {});
  }
  check('theme: picker opens', opened, `opened=${opened}`);
  check(
    'theme: picker writes live',
    opened && picked === '#ff0000' && picked !== before,
    `${before} -> ${picked}`,
  );
  check(
    'theme: picker undoes in one step',
    opened &&
      before === typed &&
      undone === before &&
      undoneTwice === chainStart,
    `${chainStart} -> ${before} -> ${picked}, undo ${undone}, undo ${undoneTwice}`,
  );
}

/**
 * The Icon Library select (spec 14, D27): picking Tabler switches the home
 * demo's toolbar icons (the search toggle's svg gets `tabler-icon` within
 * 5 s), the pick is stored and survives a reload, and `Shift+R` with the
 * panel open returns the table to Lucide. Closes the panel.
 */
async function themeIconLibrary({ page, check, trigger, panel }) {
  const icon = '.v5-demo button[aria-label="Show/Hide search"] svg';
  const iconHas = (cls) =>
    page
      .waitForFunction(
        ({ sel, c }) =>
          document.querySelector(sel)?.classList.contains(c) === true,
        { sel: icon, c: cls },
        { timeout: 5000 },
      )
      .then(() => true)
      .catch(() => false);
  const iconClass = async () =>
    (await page
      .locator(icon)
      .first()
      .getAttribute('class')
      .catch(() => '')) ?? '';
  const openPanel = async () => {
    if (!(await trigger.count())) return;
    await trigger.click();
    await panel
      .first()
      .waitFor({ timeout: 5000 })
      .catch(() => {});
    await page.waitForTimeout(300);
  };
  // The first Escape can only dismiss the tooltip of the focused shortcut
  // button, so a second one follows while the panel is still open.
  const closePanel = async () => {
    for (let i = 0; i < 2 && (await panel.count()); i++) {
      await page.keyboard.press('Escape');
      await panel
        .first()
        .waitFor({ state: 'detached', timeout: 2500 })
        .catch(() => {});
    }
  };

  await openPanel();
  const select = panel.first().getByLabel('Icon Library', { exact: true });
  let picked = false;
  if (await select.count()) {
    picked = await select
      .click({ timeout: 5000 })
      .then(async () => {
        const option = page.getByRole('option', { name: 'Tabler' });
        await option.waitFor({ timeout: 5000 });
        await option.click();
        return true;
      })
      .catch(() => false);
  }
  await page.waitForTimeout(200);
  await closePanel();
  const tabler = await iconHas('tabler-icon');
  check(
    'icons: Tabler switches the home tables',
    picked && tabler,
    `picked=${picked} class=${await iconClass()}`,
  );

  const storedLibrary = await page.evaluate((key) => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? 'null')?.config
        ?.iconLibrary;
    } catch {
      return undefined;
    }
  }, DESIGN_SYSTEM_KEY);
  // The live demo plays while its toolbar is in view and its replay moves
  // focus into the table, where the theme keys are ignored; at the top of
  // the page it holds, so Shift+R below reaches the panel.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.reload({ waitUntil: 'networkidle', timeout: 90000 });
  await page
    .locator('.v5-demo table tbody tr')
    .first()
    .waitFor({ timeout: 30000 })
    .catch(() => {});
  const afterReload = await iconHas('tabler-icon');
  check(
    'icons: the pick survives a reload',
    storedLibrary === 'tabler' && afterReload,
    `stored=${storedLibrary} class=${await iconClass()}`,
  );

  await openPanel();
  await page
    .waitForFunction(
      () =>
        document
          .querySelector('[role="dialog"]')
          ?.contains(document.activeElement) === true,
      null,
      { timeout: 5000 },
    )
    .catch(() => {});
  await page.keyboard.press('Shift+R');
  const lucide = await iconHas('lucide');
  check(
    'icons: Shift+R returns to Lucide',
    tabler && lucide,
    `class=${await iconClass()}`,
  );
  await closePanel();
}

const checks = {
  '/': async ({ page, check, base }) => {
    // the hero command bar follows the site-wide base (was cluster a)
    await commandBarBase({ page, check, base });
    const h1 = page.locator('h1').first();
    check(
      'hero title',
      /shadcn\s*-?\s*table/i.test((await h1.textContent()) ?? ''),
    );
    const main = page.locator('main, body');
    const txt = (await main.first().textContent()) ?? '';
    const bar = page.locator('[data-slot="agent-bar"]');
    check('agent bar', (await bar.count()) === 1);
    check('agent prompt', txt.includes('Install shadcn-table in my app:'));
    await bar.getByRole('radio', { name: 'Command' }).click();
    // The hosted registry URL of the selected base (the default, Base UI, or
    // the runner's --base); the origin is the dev server's in dev.
    check(
      'install command',
      /pnpm dlx shadcn@latest add \S+\/r\/[a-z]+\/shadcn-table\.json/.test(
        (await bar.textContent()) ?? '',
      ),
    );
    check(
      'copy command label',
      (await bar.getByRole('button', { name: 'Copy command' }).count()) === 1,
    );
    check('no V3 alert', !/was released September 5th, 2024/.test(txt));
    check(
      'agent bar',
      (await page.locator('[data-slot="agent-bar"]').count()) === 1,
    );
    // the live demo table is client-rendered (next/dynamic)
    const rows = page.locator('table tbody tr');
    await rows
      .first()
      .waitFor({ timeout: 30000 })
      .catch(() => {});
    check(
      'live demo rows',
      (await rows.count()) > 0,
      `rows=${await rows.count()}`,
    );
    // the stock 0.8 table: icons in the headers, filters as chips (no
    // filter row under the headers), the view settings button
    const demo = page.locator('.v5-demo-table');
    check(
      'demo: header icons',
      (await demo.locator('thead th svg[aria-hidden="true"]').count()) >= 5,
    );
    check(
      'demo: no subheader filter row',
      (await demo.locator('thead input').count()) === 0,
    );
    check(
      'demo: view settings button',
      (await demo.locator('button[aria-label="View settings"]').count()) === 1,
    );
    // seven data columns (D54), and at the desktop width they fit the frame,
    // so the Estimate cell the Editing step changes is in view (F32)
    const dataHeaders = await demo
      .locator('thead th button[aria-label$=" column menu"]')
      .count();
    check(
      'demo: seven data columns',
      dataHeaders === 7,
      `columns=${dataHeaders}`,
    );
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      const overflow = await demo
        .locator('table')
        .first()
        .evaluate((table) => {
          const box = table.parentElement;
          return box ? box.scrollWidth - box.clientWidth : 0;
        });
      check(
        'demo: no horizontal scroll',
        overflow <= 1,
        `overflow=${overflow}px`,
      );
    }
    check('features heading', txt.includes('Everything you need'));
    check(
      'install steps heading',
      txt.includes('Up and running in three steps'),
    );
    const guides = page.locator('a[href^="/docs/guides/"]');
    check(
      'guide links',
      (await guides.count()) >= 10,
      `guides=${await guides.count()}`,
    );
    check(
      'no contributors section',
      !txt.includes('Maintainers and Contributors'),
    );
    // a page of ten rows fits the table frame: no row cut off at the bottom,
    // no scrollbar inside the table (F45 follow-up)
    const clipped = await demo
      .locator('table')
      .first()
      .evaluate((table) => {
        const box = table.parentElement;
        return box ? box.scrollHeight - box.clientHeight : 0;
      });
    check('demo: ten rows fit the frame', clipped <= 1, `clipped=${clipped}px`);
    // the replay plays only while the toolbar has room for its popovers
    // below it (F48, D63): with the toolbar near the bottom edge it holds on
    // Starting; with the demo in view it plays and the Sort popover opens
    // below its trigger; scrolled away mid-step it pauses with no popover
    // left open, and scrolled back it resumes
    const toolbarNearBottom = () =>
      page.evaluate(() => {
        const sort = [
          ...document.querySelectorAll(
            '.v5-demo-table button[aria-label="Sort"]',
          ),
        ].find((button) => !button.closest('table'));
        if (!sort) return -1;
        window.scrollBy(
          0,
          sort.getBoundingClientRect().bottom - (window.innerHeight - 80),
        );
        return Math.round(
          window.innerHeight - sort.getBoundingClientRect().bottom,
        );
      });
    const demoInView = () =>
      page.evaluate(() =>
        document.querySelector('.v5-demo')?.scrollIntoView({ block: 'center' }),
      );
    const replayState = () =>
      page.evaluate(() => {
        const popover = document.querySelector('[data-slot="popover-content"]');
        const trigger = document.querySelector(
          '.v5-demo-table [aria-expanded="true"]',
        );
        return {
          status:
            document.querySelector('[aria-label="Demo items"] [aria-live]')
              ?.textContent ?? '',
          running:
            document.querySelector('.v5-demo')?.hasAttribute('data-running') ??
            false,
          popoverTop: popover
            ? Math.round(popover.getBoundingClientRect().top)
            : null,
          triggerBottom: trigger
            ? Math.round(trigger.getBoundingClientRect().bottom)
            : null,
        };
      });
    try {
      const room = await toolbarNearBottom();
      // the Sort popover would open 2s after Starting; give it 3s
      await page.waitForTimeout(3000);
      const held = await replayState();
      check(
        'demo: holds on Starting with the toolbar near the bottom edge',
        room >= 0 &&
          room < 360 &&
          held.status === 'Starting' &&
          !held.running &&
          held.popoverTop === null,
        `room=${room}px ${JSON.stringify(held)}`,
      );
      await demoInView();
      await page
        .locator('[data-slot="popover-content"]')
        .first()
        .waitFor({ timeout: 10000 });
      const playing = await replayState();
      check(
        'demo: plays in view, the Sort popover opens below its trigger',
        playing.running &&
          playing.triggerBottom !== null &&
          playing.popoverTop !== null &&
          playing.popoverTop >= playing.triggerBottom,
        JSON.stringify(playing),
      );
      await toolbarNearBottom();
      // wait for the paused state (F61): no data-running, no popover open
      await page
        .waitForFunction(
          () =>
            !document.querySelector('.v5-demo')?.hasAttribute('data-running') &&
            !document.querySelector('[data-slot="popover-content"]'),
          null,
          { timeout: 5000 },
        )
        .catch(() => {});
      const away = await replayState();
      // the Sort step's hold is 2.2s: a running replay would move on
      await page.waitForTimeout(3000);
      const later = await replayState();
      check(
        'demo: pauses when scrolled away mid-step, no popover left open',
        !away.running &&
          away.popoverTop === null &&
          /Sorting/.test(away.status) &&
          later.status === away.status,
        `${JSON.stringify(away)} 3s later=${later.status}`,
      );
      await demoInView();
      await page
        .locator('[aria-label="Demo items"] [aria-live]')
        .filter({ hasText: 'Search' })
        .waitFor({ timeout: 10000 });
      check('demo: resumes when scrolled back', true);
    } catch (e) {
      check(
        'demo: plays only with room for its popovers',
        false,
        String(e.message).split('\n')[0].slice(0, 160),
      );
    }
    // the six step titles name the feature (F45), and one full replay gives
    // every step the active state in turn: a recorder samples the list each
    // frame from a Replay click (outside the table, so the replay keeps
    // playing) until the loop starts over. It also records what the replay
    // must never leave behind (F45 follow-up): a tooltip or a keyboard focus
    // ring on a control it clicked, a page scroll, a change in the table
    // frame's height or in the step list's place, an empty cell editor; and
    // what it must show: the Filtering cue on the "+ Filter" pill, the cue on
    // the sort chip, the sort editor, the filter chip editor and the view
    // settings panel (F49, D65), polled each frame, the moved column drawn on top of the cells it slides across (F47): mid-slide, the
    // topmost element at its header's centre is that header
    const titles = await page
      .locator('[aria-label="Demo items"] .v5-step span.text-sm')
      .allTextContents();
    const expected = [
      'Sort editor',
      'Global search',
      'Cell editing',
      'Filter chips',
      'Column order',
      'Alternating row colors',
    ];
    check(
      'demo: step titles',
      titles.join('|') === expected.join('|'),
      titles.join(' | '),
    );
    try {
      const steps = page.locator('[aria-label="Demo items"]');
      // the whole demo in view, so the toolbar has room for the popovers
      await demoInView();
      await page.evaluate(() => {
        const seen = new Set();
        const flaws = {
          tooltips: new Set(),
          rings: new Set(),
          scrolls: new Set(),
          frames: new Set(),
          lists: new Set(),
          emptyEdit: 0,
          pillCue: false,
          cues: new Set(),
          movedOnTop: 0,
          movedCovered: 0,
          flipped: new Set(),
        };
        window.__demoSeen = seen;
        window.__demoFlaws = flaws;
        const aside = document.querySelector('[aria-label="Demo items"]');
        const table = document.querySelector('.v5-demo-table');
        const frame = table?.querySelector('table')?.parentElement;
        const list = aside?.querySelector('ol');
        const sample = () => {
          aside?.querySelectorAll('.v5-step').forEach((el, i) => {
            if (el.getAttribute('data-state') === 'active') seen.add(i);
          });
          document
            .querySelectorAll('[role="tooltip"]')
            .forEach((el) => flaws.tooltips.add(el.textContent?.trim()));
          const focused = document.activeElement;
          if (
            focused instanceof HTMLElement &&
            focused.matches(':focus-visible') &&
            !focused.matches('input, textarea') &&
            (table?.contains(focused) ||
              focused.closest('[data-slot="popover-content"]'))
          ) {
            flaws.rings.add(
              focused.getAttribute('aria-label') ??
                focused.textContent?.trim().slice(0, 20),
            );
          }
          flaws.scrolls.add(Math.round(window.scrollY));
          // every popover the replay opens sits below its trigger (F48)
          const trigger = table?.querySelector(
            '[data-slot="popover-trigger"][aria-expanded="true"], button[aria-expanded="true"]',
          );
          const popover = document.querySelector(
            '[data-slot="popover-content"]',
          );
          if (
            trigger &&
            popover &&
            popover.getBoundingClientRect().top <
              trigger.getBoundingClientRect().bottom
          ) {
            flaws.flipped.add(
              trigger.getAttribute('aria-label') ??
                trigger.textContent?.trim().slice(0, 20),
            );
          }
          if (frame) flaws.frames.add(frame.offsetHeight);
          if (aside && list) {
            flaws.lists.add(
              Math.round(
                list.getBoundingClientRect().top -
                  aside.getBoundingClientRect().top,
              ),
            );
          }
          const edit = table?.querySelector('tbody input');
          if (edit instanceof HTMLInputElement && edit.value === '') {
            flaws.emptyEdit += 1;
          }
          table?.querySelectorAll('.v12-cue').forEach((el) => {
            if (
              el.tagName === 'BUTTON' &&
              !el.hasAttribute('aria-label') &&
              el.textContent?.trim() === 'Filter'
            ) {
              flaws.pillCue = true;
            }
            if (
              el.tagName === 'BUTTON' &&
              !el.closest('thead') &&
              el.textContent?.trim() === 'Due'
            ) {
              flaws.cues.add('sort chip');
            }
          });
          // the editors and the panel render in portals outside the table
          document
            .querySelectorAll('[data-slot="popover-content"].v12-cue')
            .forEach((el) => {
              const text = el.textContent ?? '';
              if (text.includes('Delete sort')) flaws.cues.add('sort editor');
              if (text.includes('Remove filter')) {
                flaws.cues.add('filter chip editor');
              }
              if (el.querySelector('[aria-label="Alternating row colors"]')) {
                flaws.cues.add('view settings panel');
              }
            });
          const head = [...(table?.querySelectorAll('thead th') ?? [])].map(
            (th) => th.getAttribute('data-flip-column'),
          );
          if (head[1] === 'project') {
            const th = table?.querySelector(
              'thead th[data-flip-column="project"]',
            );
            const sliding = th
              ?.getAnimations()
              .some(
                (animation) =>
                  animation.playState === 'running' &&
                  animation.effect
                    ?.getKeyframes()
                    .some((keyframe) => keyframe.translate !== undefined),
              );
            if (th && sliding) {
              const rect = th.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              if (
                x >= 0 &&
                y >= 0 &&
                x < window.innerWidth &&
                y < window.innerHeight
              ) {
                const hit = document.elementFromPoint(x, y);
                if (hit && th.contains(hit)) flaws.movedOnTop += 1;
                else flaws.movedCovered += 1;
              }
            }
          }
          if (window.__demoSeen === seen) requestAnimationFrame(sample);
        };
        sample();
      });
      await steps.getByRole('button', { name: 'Replay' }).click();
      await steps
        .locator('.v5-step')
        .nth(expected.length - 1)
        .and(page.locator('[data-state="active"]'))
        .waitFor({ timeout: 45000 });
      // the last step plays out, then the loop starts over
      await steps
        .locator('[aria-live]')
        .filter({ hasText: 'Starting' })
        .waitFor({ timeout: 15000 })
        .catch(() => {});
      const { seen, flaws } = await page.evaluate(() => {
        const list = [...window.__demoSeen].sort();
        const f = window.__demoFlaws;
        window.__demoSeen = null;
        return {
          seen: list,
          flaws: {
            tooltips: [...f.tooltips],
            rings: [...f.rings],
            scrolls: [...f.scrolls],
            frames: [...f.frames],
            lists: [...f.lists],
            emptyEdit: f.emptyEdit,
            pillCue: f.pillCue,
            cues: [...f.cues],
            movedOnTop: f.movedOnTop,
            movedCovered: f.movedCovered,
            flipped: [...f.flipped],
          },
        };
      });
      check(
        'demo: every step active in one replay',
        seen.length === expected.length,
        `active=${seen.join(',')}`,
      );
      check(
        'demo: no tooltip during the replay',
        flaws.tooltips.length === 0,
        flaws.tooltips.join(' | '),
      );
      check(
        'demo: no focus ring left by the replay',
        flaws.rings.length === 0,
        flaws.rings.join(' | '),
      );
      check(
        'demo: every popover opens below its trigger',
        flaws.flipped.length === 0,
        flaws.flipped.join(' | '),
      );
      check(
        'demo: the replay never scrolls the page',
        flaws.scrolls.length === 1,
        `scrollY=${flaws.scrolls.join(',')}`,
      );
      check(
        'demo: the table frame keeps its height',
        flaws.frames.length === 1,
        `heights=${flaws.frames.join(',')}`,
      );
      check(
        'demo: the step list never moves',
        flaws.lists.length === 1,
        `offsets=${flaws.lists.join(',')}`,
      );
      check(
        'demo: the cell editor never shows empty',
        flaws.emptyEdit === 0,
        `frames=${flaws.emptyEdit}`,
      );
      check('demo: Filtering cues the + Filter pill', flaws.pillCue);
      const cued = [
        'sort editor',
        'sort chip',
        'filter chip editor',
        'view settings panel',
      ];
      check(
        'demo: cues the sort chip, the editors and the view settings panel',
        cued.every((cue) => flaws.cues.includes(cue)),
        `cued=${flaws.cues.join(',')}`,
      );
      check(
        'demo: the moved column slides on top of the others',
        flaws.movedOnTop > 0 && flaws.movedCovered === 0,
        `onTop=${flaws.movedOnTop} covered=${flaws.movedCovered}`,
      );
    } catch (e) {
      check(
        'demo: every step active in one replay',
        false,
        String(e.message).split('\n')[0].slice(0, 160),
      );
    }
    await demoLoop({ page, check, base });
    await themeCustomizer({ page, check });
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
    // The example toolbar's own base select drives the same switch.
    await baseSwitch(page, 'basic', check, { via: 'toolbar' });
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
    // context, the runner's --base otherwise; the header select agrees and its
    // menu lists the bases in order.
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
    await iconEditions(page, check, article);
    await agentBar(page, check);
  },
  '/docs/getting-started/agents': async ({ page, check }) => {
    await agentBar(page, check);
    const txt = (await page.locator('article').textContent()) ?? '';
    // The @shadcn-table namespace form lives here only; the localization
    // guide links to this page's Registry addresses section.
    check(
      'namespace form',
      txt.includes('registry add @shadcn-table=') &&
        txt.includes('add @shadcn-table/shadcn-table'),
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
  '/docs/getting-started/production-ready-tables': async ({ page, check }) => {
    check(
      'redirects to guides/production-ready-tables',
      page.url().endsWith('/docs/guides/production-ready-tables'),
      page.url(),
    );
  },
};

export default checks;
