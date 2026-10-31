#!/usr/bin/env node
// Usage (repo root), one served Storybook per base:
//   ST_BASE=<base> pnpm --filter shadcn-table exec storybook dev -p <port> --ci
//   node .ai/plans/v0.7.x/anindosarker/reference/06-capture.mjs --base <base> --url http://localhost:<port> [--out <dir>]
//
// Spec 06 baseline and judged captures: five LTR views per base from the
// served Storybook, each in the light and the dark theme (the Storybook
// theme switch, set through its localStorage key), written as
// <out>/06-<base>-<view>-<theme>.png (default out: this folder). Playwright
// and its Chromium come from packages/shadcn-table.
// Views: resize-handle (hovered header row of a resizable table),
// pinned-columns (pinned start and end columns, table scrolled to the middle),
// toolbar (top and bottom toolbar with the table), header-shadows (sticky
// header over scrolled rows), ltr (the basic story, whole table).
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = path.resolve(here, '../../../../../packages/shadcn-table');
const { chromium } = createRequire(path.join(pkg, 'package.json'))(
  'playwright',
);

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
};
const base = arg('base');
const url = arg('url');
const out = path.resolve(arg('out', here));
if (!base || !url) {
  console.error(
    'usage: 06-capture.mjs --base <base> --url <storybook url> [--out <dir>]',
  );
  process.exit(2);
}

const VIEWS = [
  {
    view: 'resize-handle',
    id: 'features-column-resizing-examples--column-resizing-enabled-default-on-change',
    shoot: async (page) => {
      await page
        .locator('#storybook-root thead th')
        .filter({ visible: true })
        .first()
        .hover();
      return page.locator('#storybook-root thead').first();
    },
  },
  {
    view: 'pinned-columns',
    id: 'features-column-pinning-examples--column-pinning-initial',
    shoot: async (page) => {
      const container = page
        .locator('#storybook-root table')
        .first()
        .locator('xpath=..');
      await container.evaluate((el) => {
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      });
      return container;
    },
  },
  {
    view: 'toolbar',
    id: 'features-toolbar-examples--toolbar-enabled-default',
    shoot: async (page) => page.locator('#storybook-root'),
  },
  {
    view: 'header-shadows',
    id: 'styling-sticky-header-examples--enable-sticky-header',
    shoot: async (page) => {
      const container = page
        .locator('#storybook-root table')
        .first()
        .locator('xpath=..');
      await container.evaluate((el) => {
        el.scrollTop = 120;
      });
      return container;
    },
  },
  {
    view: 'ltr',
    id: 'basic--default',
    shoot: async (page) => page.locator('#storybook-root'),
  },
];

const browser = await chromium.launch();
for (const theme of ['light', 'dark']) {
  const page = await browser.newPage({
    viewport: { width: 1000, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: theme,
  });
  await page.addInitScript((current) => {
    localStorage.setItem('sb-addon-themes-3', JSON.stringify({ current }));
  }, theme);
  for (const { view, id, shoot } of VIEWS) {
    await page.goto(`${url}/iframe.html?id=${id}&viewMode=story`, {
      waitUntil: 'load',
      timeout: 120_000,
    });
    await page
      .locator('#storybook-root table')
      .first()
      .waitFor({ timeout: 120_000 });
    const target = await shoot(page);
    await page.waitForTimeout(400);
    const file = path.join(out, `06-${base}-${view}-${theme}.png`);
    await target.screenshot({ path: file, animations: 'disabled' });
    console.log(`06-capture: ${path.relative(process.cwd(), file)}`);
  }
  await page.close();
}
await browser.close();
