// usage: node capture-docs.cjs <origin> <outDir>
const path = require('node:path');
const fs = require('node:fs');
const WT = '~/Work/Personal/React-table/shadcn-react-table.worktrees/08';
const { chromium } = require(path.join(WT, 'node_modules/playwright'));
const [origin, out] = process.argv.slice(2);
const PAGES = [
  'basic--default',
  'features-column-pinning--column-pinning-enabled',
  'features-virtualization--enable-row-virtualization-dense',
];
const TAB = { base: 'base-ui', radix: 'radix-ui', aria: 'react-aria' };
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const log = [];
  try {
    for (const base of ['base', 'radix', 'aria']) {
      for (const mode of ['light', 'dark']) {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
        await ctx.addInitScript(([tab, m]) => {
          localStorage.setItem('base', tab);
          localStorage.setItem('theme', m);
          let a = 0x2f6b1d3c;
          Math.random = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
        }, [TAB[base], mode]);
        await ctx.clock.setFixedTime(new Date('2026-01-01T12:00:00Z'));
        const page = await ctx.newPage();
        const errors = [];
        page.on('pageerror', (e) => errors.push(String(e)));
        for (const id of PAGES) {
          const res = await page.goto(`${origin}/docs/examples/more/${id}`, { waitUntil: 'networkidle', timeout: 120000 });
          await page.locator('table').first().waitFor({ timeout: 60000 }).catch(() => log.push(`NOTABLE ${base} ${mode} ${id}`));
          await page.mouse.move(0, 0);
          await page.waitForTimeout(2500);
          log.push(`PAGE ${base} ${mode} ${id} ${res?.status()}`);
          await page.screenshot({ path: path.join(out, `docs-${base}-${mode}-${id}.png`), animations: 'disabled', caret: 'hide' });
        }
        if (errors.length) log.push(`ERRORS ${base} ${mode}: ${errors.join(' | ')}`);
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
  }
  console.log(log.join('\n'));
})();
