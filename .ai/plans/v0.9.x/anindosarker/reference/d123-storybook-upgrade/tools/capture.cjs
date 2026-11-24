// usage: node capture.cjs <staticRoot with base|radix|aria> <outDir> <port>
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const WT = '~/Work/Personal/React-table/shadcn-react-table.worktrees/08';
const { chromium } = require(path.join(WT, 'node_modules/playwright'));

const [root, out, port] = process.argv.slice(2);
const STORIES = [
  'basic--default',
  'features-column-pinning-examples--column-pinning-enabled',
  'features-filtering-examples--filtering-enabled-default',
  'features-editing-examples--editing-enabled-edit-mode-modal-default',
  'features-detail-panel-examples--detail-panel-enabled-semantic',
  'features-virtualization--enable-row-virtualization-dense',
  'features-row-pinning-examples--row-pinning-sticky-default-enabled',
  'features-view-settings-examples--view-settings-default',
  'features-click-to-copy-examples--click-to-copy-enabled',
  'styling-sticky-header-examples--enable-sticky-header',
];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(root, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

const finished = (page) =>
  page.waitForFunction(() => window.__STORYBOOK_PREVIEW__?.currentRender?.phase === 'finished', undefined, { timeout: 90000 });

async function main() {
  await new Promise((r) => server.listen(Number(port), '127.0.0.1', r));
  const origin = `http://127.0.0.1:${port}`;
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const log = [];
  try {
    for (const base of ['base', 'radix', 'aria']) {
      for (const mode of ['light', 'dark']) {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
        await ctx.addInitScript((m) => localStorage.setItem('sb-addon-themes-3', JSON.stringify({ current: m })), mode);
        // Deterministic data: faker seeds from Math.random, dates from Date.now.
        await ctx.addInitScript(() => {
          let a = 0x2f6b1d3c;
          Math.random = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
        });
        await ctx.clock.setFixedTime(new Date('2026-01-01T12:00:00Z'));
        const page = await ctx.newPage();
        for (const id of STORIES) {
          await page.goto(`${origin}/${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'load' });
          try { await finished(page); } catch { log.push(`TIMEOUT ${base} ${mode} ${id}`); }
          await page.mouse.move(0, 0);
          await page.waitForTimeout(1200);
          await page.screenshot({ path: path.join(out, `${base}-${mode}-${id}.png`), animations: 'disabled', caret: 'hide' });
        }
        await ctx.close();
      }
      {
        // Shell: manager with sidebar, toolbar (base tool, dark mode toggle), Code panel. Default is dark.
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
        const page = await ctx.newPage();
        await page.goto(`${origin}/${base}/?path=/story/basic--default`, { waitUntil: 'load' });
        await page.frameLocator('#storybook-preview-iframe').locator('body').waitFor();
        await page.waitForTimeout(4000);
        await page.screenshot({ path: path.join(out, `${base}-shell-default.png`), animations: 'disabled', caret: 'hide' });
        const previewDark = () => page.frames().find((f) => f.url().includes('iframe.html'))?.evaluate(() => document.documentElement.className);
        log.push(`SHELL ${base} preview html class before toggle: ${await previewDark()}`);
        const toggle = page.locator('button[aria-label^="Change theme"]').first();
        if (await toggle.count()) {
          await toggle.click();
          await page.waitForTimeout(2500);
          log.push(`TOGGLE ${base} preview html class after click: ${await previewDark()}; button now: ${await page.locator('button[aria-label^="Change theme"]').first().getAttribute('aria-label')}`);
          await page.screenshot({ path: path.join(out, `${base}-shell-toggled.png`), animations: 'disabled', caret: 'hide' });
        } else log.push(`TOGGLE ${base} not found`);
        const sel = page.locator('button[aria-label^="Base "]').first();
        if (await sel.count()) {
          await sel.click();
          await page.waitForTimeout(800);
          await page.screenshot({ path: path.join(out, `${base}-shell-basetool.png`), animations: 'disabled', caret: 'hide' });
          const next = { base: 'Radix UI', radix: 'React Aria', aria: 'Base UI' }[base];
          const opt = page.getByRole('option', { name: next }).first();
          if (await opt.count()) {
            await Promise.all([page.waitForURL((u) => !u.pathname.startsWith(`/${base}/`), { timeout: 15000 }).catch(() => {}), opt.click()]);
            const u = new URL(page.url());
            log.push(`BASETOOL ${base} -> ${u.pathname}${u.search}`);
          } else log.push(`BASETOOL ${base} option "${next}" not found`);
        } else log.push(`BASETOOL ${base} not found`);
        await ctx.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log(log.join('\n'));
}
main().catch((e) => { console.error(e); server.close(); process.exit(1); });
