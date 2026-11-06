// The release gate (D78, D79; epic 07.1 1.6.3). install.yml runs it on the
// Next app it scaffolds per base, against `next dev` (React Aria warns in
// development builds only), with the pages of ./pages copied into the app:
//
//   node test/release/gate.mjs --base <base|radix|aria> --url <origin> --out <dir>
//     [--reference <dir>] [--no-diff]
//
// Checks: zero console warnings and errors on /release-gate,
// /release-gate/persisted and /release-gate/rtl; the persisted view marked
// data-st-view-pending with aria-busy before DOMContentLoaded and the stored
// order restored after a reload (D36); the RTL pinned Name header and its
// resize handle on the inline-end edge, a 60 px handle drag widening it
// (v0.7.x D31); the two default captures, compared with the committed
// references by pixelmatch. Writes <out>/default-{light,dark}.png,
// default-<m>-diff.png on a failed diff, and result.json. Exit 0 pass, 1 any
// failure. The checks the Storybook plays cover are not repeated here.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import pixelmatch from 'pixelmatch';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASES = ['base', 'radix', 'aria'];
const VIEWPORT = { width: 1800, height: 1150 };
const NAV_TIMEOUT = 120_000;
const MAX_DIFF_PIXELS = 500;
const ARIA_PATTERN =
  /react aria|must be focusable|interactive ARIA role|aria-label/i;
const THEMES = ['light', 'dark'];

const { values: args } = parseArgs({
  options: {
    base: { type: 'string' },
    url: { type: 'string' },
    out: { type: 'string' },
    reference: { type: 'string' },
    'no-diff': { type: 'boolean', default: false },
  },
});
if (!BASES.includes(args.base) || !args.url || !args.out) {
  console.error(
    'usage: node test/release/gate.mjs --base <base|radix|aria> --url <origin> --out <dir> [--reference <dir>] [--no-diff]',
  );
  process.exit(1);
}
const base = args.base;
const origin = args.url.replace(/\/$/, '');
const out = path.resolve(args.out);
const reference = path.resolve(
  args.reference ?? path.join(HERE, 'reference', base),
);
fs.mkdirSync(out, { recursive: true });

const failures = [];
const fail = (check, message) => {
  failures.push(`${check}: ${message}`);
  console.log(`::error::${base} ${check}: ${message}`);
};
const result = { base, pages: {}, persisted: null, rtl: null, captures: {} };

// Console messages land in the bucket of the page being visited.
let bucket = null;
const visit = (route) => {
  bucket = result.pages[route] ??= {
    warnings: [],
    errors: [],
    ariaWarnings: [],
  };
};
const record = (kind, text) => {
  if (!bucket) return;
  bucket[kind].push(text);
  if (base === 'aria' && ARIA_PATTERN.test(text))
    bucket.ariaWarnings.push(text);
};

const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: VIEWPORT });
  context.setDefaultNavigationTimeout(NAV_TIMEOUT);
  context.setDefaultTimeout(NAV_TIMEOUT);
  await context.addInitScript({ path: path.join(HERE, 'init.js') });
  const page = await context.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'warning') record('warnings', msg.text());
    else if (msg.type() === 'error') record('errors', msg.text());
  });
  page.on('pageerror', (error) => record('errors', String(error)));

  // The gate table publishes its instance in an effect, so it is set once
  // the page has hydrated.
  const ready = () =>
    page.waitForFunction(() => window.__gateTable !== undefined, null, {
      timeout: NAV_TIMEOUT,
    });
  const open = async (route) => {
    visit(route);
    await page.goto(origin + route, { waitUntil: 'load' });
    await ready();
  };
  const reload = async () => {
    await page.reload({ waitUntil: 'load' });
    await ready();
  };
  const section = async (name, fn) => {
    try {
      await fn();
    } catch (error) {
      fail(name, String(error?.message ?? error).split('\n')[0]);
    }
  };

  await section('captures', async () => {
    await open('/release-gate');
    await page.evaluate(() => localStorage.clear());
    for (const mode of THEMES) {
      await page.evaluate((m) => localStorage.setItem('theme', m), mode);
      await page.emulateMedia({ colorScheme: mode });
      await reload();
      const dark = await page.evaluate(() =>
        document.documentElement.classList.contains('dark'),
      );
      if (dark !== (mode === 'dark')) {
        fail(`capture ${mode}`, `html.dark is ${dark ? 'present' : 'absent'}`);
      }
      await page.evaluate(() =>
        document.querySelectorAll('nextjs-portal').forEach((e) => e.remove()),
      );
      await page.mouse.move(1790, 1140);
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(out, `default-${mode}.png`),
        fullPage: true,
      });
    }
    await page.emulateMedia({ colorScheme: 'light' });
    await page.evaluate(() => localStorage.clear());
  });

  await section('persisted', async () => {
    await open('/release-gate/persisted');
    await page.evaluate(() => localStorage.clear());
    await reload();
    // Reorder Assignee onto Project through the header drag path. Headless
    // Chromium does not deliver a native drop, so the HTML5 drag events are
    // dispatched with one DataTransfer whose dropEffect the handlers set.
    await page.evaluate(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const dt = new DataTransfer();
      let dropEffect = 'none';
      let effectAllowed = 'uninitialized';
      Object.defineProperty(dt, 'dropEffect', {
        get: () => dropEffect,
        set: (v) => (dropEffect = v),
      });
      Object.defineProperty(dt, 'effectAllowed', {
        get: () => effectAllowed,
        set: (v) => (effectAllowed = v),
      });
      const th = (id) =>
        document.querySelector(`thead th[data-flip-column="${id}"]`);
      const src = th('assignee');
      const dst = th('project');
      const r = dst.getBoundingClientRect();
      const at = {
        bubbles: true,
        cancelable: true,
        dataTransfer: dt,
        clientX: r.x + r.width * 0.75,
        clientY: r.y + r.height / 2,
      };
      src.dispatchEvent(
        new DragEvent('dragstart', {
          bubbles: true,
          cancelable: true,
          dataTransfer: dt,
        }),
      );
      await sleep(150);
      dst.dispatchEvent(new DragEvent('dragenter', at));
      dst.dispatchEvent(new DragEvent('dragover', at));
      await sleep(250);
      dst.dispatchEvent(new DragEvent('dragover', at));
      dst.dispatchEvent(new DragEvent('drop', at));
      src.dispatchEvent(new DragEvent('dragend', at));
    });
    await page.waitForTimeout(800);
    const stored = await page.evaluate(() => ({
      keys: Object.keys(localStorage).filter((k) =>
        k.startsWith('shadcn-table:'),
      ),
      order: window.__gateTable.getVisibleLeafColumns().map((c) => c.id),
    }));
    if (stored.keys.length !== 1) {
      throw new Error(
        `expected one shadcn-table: key, found ${JSON.stringify(stored.keys)}`,
      );
    }
    if (stored.order.indexOf('assignee') < stored.order.indexOf('project')) {
      throw new Error(
        `the drag did not move Assignee after Project: ${stored.order.join(',')}`,
      );
    }
    await reload();
    await page.waitForTimeout(1000);
    const after = await page.evaluate(() => ({
      pend: window.__pend,
      attrNow: document.querySelector('[data-st-view-pending]') !== null,
      order: window.__gateTable.getVisibleLeafColumns().map((c) => c.id),
    }));
    await page.evaluate(() => localStorage.clear());
    const { pend } = after;
    result.persisted = {
      storedOrder: stored.order,
      restoredOrder: after.order,
      seen: pend.seen,
      seenAtMs: pend.seenAt === null ? null : Math.round(pend.seenAt),
      dclMs: pend.dcl === null ? null : Math.round(pend.dcl),
      removedAtMs: pend.removedAt === null ? null : Math.round(pend.removedAt),
      ariaBusyWhileMarked: pend.ariaBusy,
      attributeAfterHydration: after.attrNow,
      log: pend.log,
    };
    if (!pend.seen) fail('persisted', 'data-st-view-pending never observed');
    else {
      if (pend.dcl === null || !(pend.seenAt < pend.dcl)) {
        fail(
          'persisted',
          `marked at ${pend.seenAt} ms, not before DOMContentLoaded (${pend.dcl} ms)`,
        );
      }
      if (pend.ariaBusy !== 'true') {
        fail(
          'persisted',
          `aria-busy while marked is ${JSON.stringify(pend.ariaBusy)}`,
        );
      }
    }
    if (after.attrNow)
      fail('persisted', 'data-st-view-pending still present after hydration');
    if (after.order.join(',') !== stored.order.join(',')) {
      fail(
        'persisted',
        `order not restored: ${after.order.join(',')} (stored ${stored.order.join(',')})`,
      );
    }
  });

  await section('rtl', async () => {
    await open('/release-gate/rtl');
    const box = () =>
      page.evaluate(() => {
        const th = document.querySelector('thead th[data-flip-column="name"]');
        const td =
          document.querySelector('tbody tr td[data-flip-column="name"]') ??
          document.querySelector('tbody tr').firstElementChild;
        const handle = th.querySelector(
          '[role=separator], [data-slot*=resize], .cursor-col-resize, [class*=col-resize]',
        );
        const t = th.getBoundingClientRect();
        const h = handle?.getBoundingClientRect();
        const ths = getComputedStyle(th);
        const tds = getComputedStyle(td);
        return {
          dir: getComputedStyle(
            document.querySelector('[data-slot=st-table-layout]'),
          ).direction,
          th: [Math.round(t.left), Math.round(t.right)],
          thY: Math.round(t.y + t.height / 2),
          width: Math.round(t.width),
          handle: h ? [Math.round(h.left), Math.round(h.right)] : null,
          thPosition: ths.position,
          thInsetInlineStart: ths.insetInlineStart,
          tdPosition: tds.position,
          tdInsetInlineStart: tds.insetInlineStart,
        };
      });
    const r = await box();
    result.rtl = r;
    if (r.dir !== 'rtl') fail('rtl', `direction is ${r.dir}`);
    if (!r.handle) throw new Error('no resize handle in the Name header');
    if (Math.abs(r.handle[0] - r.th[0]) > 12) {
      fail(
        'rtl',
        `resize handle ${JSON.stringify(r.handle)} not on the inline-end (left) edge of ${JSON.stringify(r.th)}`,
      );
    }
    if (
      r.thPosition !== 'sticky' ||
      r.tdPosition !== 'sticky' ||
      r.thInsetInlineStart !== '0px' ||
      r.tdInsetInlineStart !== '0px'
    ) {
      fail(
        'rtl',
        `Name not pinned to the inline start: th ${r.thPosition} ${r.thInsetInlineStart}, td ${r.tdPosition} ${r.tdInsetInlineStart}`,
      );
    }
    const x = Math.round((r.handle[0] + r.handle[1]) / 2);
    await page.mouse.move(x, r.thY);
    await page.mouse.down();
    for (let i = 1; i <= 6; i++) await page.mouse.move(x - i * 10, r.thY);
    await page.mouse.up();
    await page.waitForTimeout(300);
    const widened = (await box()).width;
    result.rtl.resized = [r.width, widened];
    const grew = widened - r.width;
    if (grew < 55 || grew > 65) {
      fail(
        'rtl',
        `a 60 px handle drag changed the width by ${grew} px (${r.width} to ${widened})`,
      );
    }
  });

  bucket = null;
  for (const [route, c] of Object.entries(result.pages)) {
    for (const kind of ['warnings', 'errors', 'ariaWarnings']) {
      if (c[kind].length) {
        fail(
          `console ${route}`,
          `${c[kind].length} ${kind}: ${c[kind].slice(0, 3).join(' | ').slice(0, 600)}`,
        );
      }
    }
  }
} finally {
  await browser.close();
}

for (const mode of THEMES) {
  const capture = path.join(out, `default-${mode}.png`);
  const entry = (result.captures[mode] = { diffPixels: null });
  if (!fs.existsSync(capture)) {
    fail(`capture ${mode}`, 'no capture written');
    continue;
  }
  const a = PNG.sync.read(fs.readFileSync(capture));
  entry.size = [a.width, a.height];
  if (args['no-diff']) continue;
  const ref = path.join(reference, `default-${mode}.png`);
  if (!fs.existsSync(ref)) {
    console.log(
      `::notice::no reference for ${base} ${mode}; capture uploaded, commit it as the reference`,
    );
    continue;
  }
  const b = PNG.sync.read(fs.readFileSync(ref));
  if (a.width !== b.width || a.height !== b.height) {
    fail(
      `diff ${mode}`,
      `capture ${a.width}x${a.height}, reference ${b.width}x${b.height}`,
    );
    continue;
  }
  const diff = new PNG({ width: a.width, height: a.height });
  entry.diffPixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
    threshold: 0.1,
    includeAA: false,
  });
  if (entry.diffPixels > MAX_DIFF_PIXELS) {
    fs.writeFileSync(
      path.join(out, `default-${mode}-diff.png`),
      PNG.sync.write(diff),
    );
    fail(
      `diff ${mode}`,
      `${entry.diffPixels} pixels differ from the reference (max ${MAX_DIFF_PIXELS})`,
    );
  }
}

result.failures = failures;
fs.writeFileSync(
  path.join(out, 'result.json'),
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(
  failures.length
    ? `release gate ${base}: ${failures.length} failure(s)`
    : `release gate ${base}: pass`,
);
process.exit(failures.length ? 1 : 0);
