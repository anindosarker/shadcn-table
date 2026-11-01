#!/usr/bin/env node
/**
 * Counts React Aria development warnings on the aria Storybook dev server.
 *
 * Usage: node scripts/check-aria-warnings.mjs [--url http://localhost:6008]
 * (default: the aria Storybook dev port, BASE_PORTS.aria)
 *
 * Opens each story below, toggles one column action menu and one row action
 * menu where the story renders them, and counts console messages that carry
 * one of React Aria's focusable, role or label warnings. Exits 1 when any
 * warning is logged.
 */
import { chromium } from 'playwright';

import { BASE_PORTS } from './registry/bases.mjs';

const args = process.argv.slice(2);
const urlFlag = args.indexOf('--url');
const baseUrl = (
  urlFlag >= 0 ? args[urlFlag + 1] : `http://localhost:${BASE_PORTS.aria}`
).replace(/\/$/, '');

const STORIES = [
  'basic--default',
  'features-column-pinning-examples--column-pinning-initial',
  'features-filtering-examples--filter-fn-and-filter-variants-faceted',
  'features-pagination-examples--pagination-enabled-default',
  'features-selection-examples--selection-enabled',
  'features-selection-examples--single-selection-radio',
  'features-row-actions-examples--row-actions-enabled',
  'features-column-grouping-examples--column-grouping-enabled',
  'features-sub-row-tree-examples--sub-row-tree-enabled-default',
];

const PATTERNS = [
  'must be focusable',
  'interactive ARIA role',
  'you must specify an aria-label',
];

const toggleMenu = async (page, selector) => {
  const opener = page.locator(selector).first();
  if ((await opener.count()) === 0) return false;
  await opener.scrollIntoViewIfNeeded();
  await opener.click();
  await page.locator('[role="menu"]').first().waitFor({ timeout: 5000 });
  await page.keyboard.press('Escape');
  await page.locator('[role="menu"]').first().waitFor({
    state: 'detached',
    timeout: 5000,
  });
  return true;
};

const browser = await chromium.launch();
const warnings = [];
let failed = false;

try {
  for (const id of STORIES) {
    const page = await browser.newPage({
      viewport: { width: 1400, height: 900 },
    });
    page.on('console', (message) => {
      const text = message.text();
      if (PATTERNS.some((pattern) => text.includes(pattern))) {
        warnings.push({ id, text });
      }
    });
    try {
      const response = await page.goto(
        `${baseUrl}/iframe.html?id=${id}&viewMode=story`,
        { waitUntil: 'load' },
      );
      if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
      await page
        .locator('#storybook-root tbody tr')
        .first()
        .waitFor({ timeout: 30000 });
      await page.waitForTimeout(500);
      const column = await toggleMenu(page, 'thead [aria-haspopup="menu"]');
      const row = await toggleMenu(page, 'tbody [aria-haspopup="menu"]');
      await page.waitForTimeout(300);
      console.log(
        `${id}: column menu ${column ? 'toggled' : 'absent'}, row menu ${row ? 'toggled' : 'absent'}`,
      );
    } catch (error) {
      failed = true;
      console.error(`${id}: ${error.message}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

const distinct = [...new Set(warnings.map(({ text }) => text))];
console.log(`react-aria warnings: ${warnings.length}`);
for (const text of distinct) {
  const stories = [
    ...new Set(warnings.filter((w) => w.text === text).map((w) => w.id)),
  ];
  console.log(`- ${text} (${stories.join(', ')})`);
}
if (warnings.length > 0 || failed) process.exit(1);
