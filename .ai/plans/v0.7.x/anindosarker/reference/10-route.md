# Spec 10 baseline: collapsible search reveal

- App: `/Users/anindosarker/Work/Personal/React-table/test-projects/next-app` (Next 16.4.2, `base-nova`), unedited
- Component: `components/demos/collapsible-search-demo.tsx` (`CollapsibleSearchDemo`), rendered by `app/page.tsx`
- Route and port: `http://localhost:5343/`, served with `pnpm exec next dev -p 5343` from the app folder
- Commit of this repo when captured: foundation branch `v0.7/foundation`; the demo is a Base UI part reference, the same for every base
- Viewport 1000 x 700, light scheme, device scale 1; each frame clips the demo's `@container` box (right box first, left box second)
- CSS transitions slowed to a tenth through CDP `Animation.setPlaybackRate`, so the five frames sit at about 0, 50, 100, 150 and 250 ms of real transition time after the trigger
- States: `open-right`, `close-right`, `open-left`, `close-left` (trigger click), `escape-close-right` (Escape inside the open field); files `10-<state>-<frame>.png`, frames 1 to 5
- Focus after each change: open, the search input; close and Escape, the trigger button
- `next dev` rewrites the app's `AGENTS.md` on start; restore it with `git restore AGENTS.md` in the app folder after the capture

Capture script (run from the repo root with `PKG=$PWD/packages/shadcn-table node 10-capture.cjs http://localhost:5343/ .ai/plans/v0.7.x/anindosarker/reference`; the duplicate `escape-open-right` frames it writes were deleted):

```js
// node 10-capture.cjs <url> <outDir>; run with NODE_PATH or from packages/shadcn-table
const path = require('path');
const { chromium } = require(require.resolve('playwright', { paths: [process.env.PKG] }));
const [url, out] = process.argv.slice(2);
const RATE = 0.1; // CSS transitions run at a tenth of their speed
const FRAMES = [0, 50, 100, 150, 250]; // ms of real transition time after the trigger
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1000, height: 700 }, deviceScaleFactor: 1, colorScheme: 'light' });
  await page.goto(url, { waitUntil: 'load', timeout: 180000 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Animation.enable');
  await cdp.send('Animation.setPlaybackRate', { playbackRate: RATE });
  const box = (dir) => page.locator('section[aria-labelledby="collapsible-search-title"] .\\@container').nth(dir === 'right' ? 0 : 1);
  const trigger = (dir) => box(dir).getByRole('button');
  await box('right').waitFor({ timeout: 180000 });
  await page.waitForTimeout(1000);
  const seq = async (state, dir, act) => {
    const t0 = Date.now();
    await act();
    for (let i = 0; i < FRAMES.length; i++) {
      const wait = t0 + FRAMES[i] / RATE - Date.now();
      if (wait > 0) await page.waitForTimeout(wait);
      await box(dir).screenshot({ path: path.join(out, `10-${state}-${i + 1}.png`) });
    }
    await page.waitForTimeout(400 / RATE);
    const focused = await page.evaluate(() => document.activeElement?.tagName + ' ' + (document.activeElement?.getAttribute('type') ?? document.activeElement?.getAttribute('aria-label') ?? ''));
    console.log(state, 'focus after:', focused);
  };
  for (const dir of ['right', 'left']) {
    await seq(`open-${dir}`, dir, () => trigger(dir).click());
    await seq(`close-${dir}`, dir, () => trigger(dir).click());
  }
  await seq('escape-open-right', 'right', () => trigger('right').click());
  await seq('escape-close-right', 'right', () => page.keyboard.press('Escape'));
  await browser.close();
})();
```
