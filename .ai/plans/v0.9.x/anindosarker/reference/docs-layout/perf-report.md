# Docs examples stack: browser performance

Build: wt1, branch `v0.9/preview-docs-examples` at `e702398d`, `next start` production build. Measured 2026-11-08.

## Verdict

**Needs work.** Initial load is fine: LCP is 504 ms on the stack and 112 ms on the single page, CLS at load is 0, and TBT is 62 ms (limits: 2.5 s, 0.1, 200 ms). Scrolling through the stack is the problem. CLS during the scroll is 1.10, which is 11 times the 0.1 limit. The main thread blocks for 26.2 s of TBT-equivalent time, and the longest task is 6.7 s. After the full scroll, a sort click on a table near the bottom takes 1,256 to 1,760 ms from input to paint (median 1,448 ms), against the 200 ms INP limit. The same click on the single page takes 72 ms. Under 4x CPU and Fast 3G, the stack misses the limits on load as well: LCP is 7.2 s and TBT is 1,428 ms.

## Summary

Stack page `/docs/examples`, baseline run (1440x900, no throttling, median of 3). Thresholds are the "good" limits from the table below.

| metric | good under | stack now | verdict |
|---|---|---|---|
| LCP (load) | 2.5 s | 0.50 s | good |
| CLS (load) | 0.1 | 0 | good |
| TBT (load) | 200 ms | 62 ms | good |
| TTFB | 0.8 s | 0.01 s | good |
| transfer | 1.6 MB | 1.19 MB | good |
| DOM nodes after load | 1,400 | 2,864 | poor |
| CLS during scroll | 0.1 | 1.10 | poor |
| blocking time during scroll | 200 ms | 26.2 s | poor |
| sort click after full scroll (INP) | 200 ms | 1,448 ms | poor |
| DOM nodes after full scroll | 1,400 | 19,383 | poor |
| JS heap after full scroll | no threshold | 276 MB | not rated |
| LCP, 4x CPU + Fast 3G | 2.5 s | 7.2 s | poor |
| TBT, 4x CPU + Fast 3G | 200 ms | 1,428 ms | poor |

Single page `/docs/examples/basic`, same run: LCP 0.11 s, sort click 72 ms, 2,864 DOM nodes, 19 MB heap; all good except DOM nodes.

## Thresholds

Each measured value below carries a rating against these ranges: G = good, NI = needs improvement, P = poor, `-` = no published threshold. Sources: web.dev Web Vitals (https://web.dev/articles/vitals) and the Lighthouse audits.

| Metric | Good | Needs improvement | Poor | Source |
|---|---|---|---|---|
| LCP | ≤ 2.5 s | ≤ 4 s | > 4 s | Web Vitals |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 | Web Vitals |
| INP | ≤ 200 ms | ≤ 500 ms | > 500 ms | Web Vitals |
| TBT | ≤ 200 ms | ≤ 600 ms | > 600 ms | Lighthouse |
| TTFB | ≤ 0.8 s | ≤ 1.8 s | > 1.8 s | Web Vitals |
| FCP | ≤ 1.8 s | ≤ 3 s | > 3 s | Web Vitals |
| DOM nodes | ≤ 800 | ≤ 1,400 | > 1,400 | Lighthouse "avoid an excessive DOM size" |
| Total transfer | ≤ 1.6 MB | - | > 1.6 MB (warning) | Lighthouse "avoid enormous network payloads" |
| DCL, load, hydration, heap, per-block load time, POST size and duration | - | - | - | no published threshold |

## Load: stack vs single page (items 1 to 4)

Baseline values are the median of 3 runs. Throttled values come from 1 run.

| Metric | Stack base | Single base | Stack throttled | Single throttled |
|---|---|---|---|---|
| TTFB | 17 ms G | 20 ms G | 10 ms (1) | 7 ms (1) |
| FCP | not measured | not measured | not measured | not measured |
| DOMContentLoaded | 174 ms - | 69 ms - | 2,586 ms - | 2,389 ms - |
| load | 239 ms - | 252 ms - | 6,334 ms - | 6,435 ms - |
| Hydration (2) | 816 ms - | 680 ms - | 9,478 ms - | 8,502 ms - |
| Last long task before idle | 809 ms - | none | 9,442 ms - | 8,478 ms - |
| LCP | 504 ms G (`p` in `section#basic`) | 112 ms G (`p`) | 7,212 ms P | 2,376 ms G |
| CLS at load | 0 G | 0 G | 0 G | 0 G |
| TBT (load + 5 s) | 62 ms G (4 long tasks, max 96 ms) | 0 ms G | 1,428 ms P (14, max 341 ms) | 378 ms NI (6, max 177 ms) |
| Total transfer | 1,190 KB G | 1,146 KB G | 1,186 KB G | 1,146 KB G |
| HTML | 63.4 KB - | 21.8 KB - | 63.4 KB - | 21.8 KB - |
| JS | 775 KB / 34 chunks - | 773 KB / 33 chunks - | 775 KB / 34 - | 773 KB / 33 - |
| Fonts / CSS / fetch | 136 KB (2) / 59 KB (6) / 156 KB (20) - | same | same | same |
| JS heap after load | 19.1 MB - | 20.0 MB - | 26.4 MB - | 22.5 MB - |
| JS heap after full scroll | 276.1 MB - | n/a | 253.0 MB - | n/a |
| DOM nodes after load | 2,864 P | 619 G | 2,864 P | 619 G |
| DOM nodes after full scroll | 19,383 P | n/a | 19,383 P | n/a |

1. TTFB under throttling is not credible. The CDP latency emulation does not show up in `responseStart` for the document. Treat it as not measured.
2. No `[data-hydrated]` marker exists. Hydration is taken as the first time `thead th button` carries React props (`__reactProps$*`), polled every 10 ms. It agrees with the last long task before idle to within 40 ms.

## Scroll run (stack)

- **Method:** scroll in 600 px steps with 250 ms pauses.
- **Blocks measured:** 40. The first two blocks, `basic` and `minimal`, are server-rendered and were loaded at the start.
- **Block time:** from the block's top coming within 800 px of the viewport to its `[role=status]` skeleton disappearing.
- **Medians:** the base column takes each block's median over 3 runs, then the median across blocks.

| Measure | Base (3 runs) | Throttled (1 run) |
|---|---|---|
| Block ready, median | 1,381 ms | 7,593 ms |
| Block ready, p95 | 3,952 ms | 31,256 ms |
| Worst blocks | `filter-variants` 7,830, `chart-detail-panel` 7,202, `lazy-detail-panel` 3,952, `lazy-sub-rows` 3,896 ms | `filter-switching` 32,878, `faceted-values` 31,506, `chart-detail-panel` 31,256 ms |
| Server-function POSTs (`next-action`) | 39 per run | 39 |
| POST bytes | 319 to 345 KB total; median 8.5 KB, max 21.7 KB | 367 KB total |
| POST duration | median 69 ms, p95 545 ms, max 1,219 ms | median 643, p95 982 ms |
| POSTs aborted (`ERR_ABORTED`) | 4 to 6 per run | 1 |
| Other requests during scroll | about 152 requests, 1.17 MB, incl. 43 JS chunks (359 KB) | 151 requests, 1.21 MB |
| Long tasks during scroll | 91; sum 30.9 s; max 6,677 ms | 137; sum 116.3 s; max 27,631 ms |
| TBT-equivalent during scroll (TBT range applied to the scroll window) | 26.2 s P | 109.5 s P |
| CLS during scroll (total, no input) | 1.104 P | 5.359 P |
| Largest shift | 0.256 to 0.572 (see below) | 0.591 |
| rAF gaps over 50 ms | 92; worst 6,700 ms | 99; worst 27,699 ms |
| Scroll wall time to bottom | 34 to 40 s | 123 s |

## Interaction after full scroll (item 6)

The header has no sort icon until the column is sorted, so sorting goes through the column menu (`ST_TableHeadCellSortLabel.tsx:15`). Each click below is measured with `PerformanceEventTiming`. The target is the `infinite-scrolling` table, the last block, first sortable column. `aria-sort` became `ascending` in every run.

| Click | Stack base (3 runs) | Stack throttled | Single base (3 runs) | Single throttled |
|---|---|---|---|---|
| Open "Column Actions" menu (INP range) | 984 / 1,088 / 1,248 ms P | 2,528 ms P | 56 / 56 / 64 ms G | 168 ms G |
| "Sort ascending" item (INP range) | 1,256 / 1,448 / 1,760 ms P | 3,432 ms P | 64 / 72 / 80 ms G | 344 ms NI |
| Input delay part of the sort click | 16 to 25 ms | 64 ms | 5 to 6 ms | 24 ms |

Input delay is small, so almost all of the time goes into processing and rendering the click.

## What costs the most

- **Forced style and layout in React render work, during scroll.** Long-animation-frame attribution, base run 1:
  - `MessagePort.onmessage` (React scheduler, chunk `0t-0fg56ogvie.js`) totals 22.2 s over 72 frames. 19.6 s of that is forced style and layout.
  - The single worst frame is 6,677 ms with 6,580 ms forced layout, at about 16 s into the run.
  - Under throttling the same frame type reaches 27.6 s, with 27.3 s forced layout.
  - The worst frame probably belongs to the `filter-variants` mount (7.8 s block time). This is not attributed per block: it is an inference from timing.
- **DOM size grows as blocks mount.** The page goes from 2,864 to 19,383 nodes and from 19 to 276 MB of JS heap. Every forced layout scales with it. The sort click is 1,057 ms of `onclick` handler on the stack, 1,025 ms of it forced layout. The same handler takes 47 ms on the 619-node single page.
- **Skeleton-to-table height mismatch causes layout shift.** Largest shifts per run:
  - 0.572: `p` in `section#column-grouping` and `section#customized-grouping`.
  - 0.276: `div.mt-6.flex.flex-col`, `p` in `section#expanding-tree` and `section#editing-crud-tree`.
  - 0.256: unnamed `div`s.
  - The `p` intro text of the next sections moves when a table replaces its skeleton.
- **Other main-thread work.**
  - `setTimeout` callbacks in chunk `3x2h-p3-w8u-u.js`: 2.6 s over 10 calls, 2.3 s forced layout.
  - rAF `tick` in chunk `1frzrqjvr3e49.js`: up to 1,032 ms in one frame.
- **Network is not the bottleneck at baseline.** Server-function POST median is 69 ms and total is about 330 KB. The 43 lazy JS chunks fetched during the scroll total 359 KB. The initial JS is the same on both pages (775 vs 773 KB; largest chunks `0__21gz8w4ie0.js` 117 KB and `2pe04i3992-tc.js` 102 KB). The stack only adds 41.6 KB of HTML.

## Method

- **Tool:** Playwright 1.64.1 headless Chromium.
  - CDP session for `Network` (bytes from `encodedDataLength`, POSTs found by the `next-action` header), `Performance`, `Emulation`.
  - Init-script `PerformanceObserver` for `longtask`, `layout-shift` (with source nodes), `largest-contentful-paint`, `event` (threshold 16 ms) and `long-animation-frame`.
  - rAF gap recorder; `performance.memory` via `--enable-precise-memory-info`.
- **Scripts:** `/private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/c29166ba-c8b5-4799-9709-68b893adc6f4/scratchpad/docs-perf/measure.mjs` (one run) and `summ.cjs` (medians). Raw JSON is in `out/` under the same directory.
- **Viewport:** 1440x900. Cold cache: a new browser and context for every run.
- **Throttled run:** `Emulation.setCPUThrottlingRate` 4, plus `Network.emulateNetworkConditions` Fast 3G (562.5 ms latency, 180,000 B/s down, 84,375 B/s up).
- **Runs:** 3 baseline runs and 1 throttled run per page. Each run measures after load plus 5 s.
- **TBT:** the sum of long-task time over 50 ms, for tasks that start before load plus 5 s.
- **CLS:** the total of non-input shifts, not the session-window value.
- **INP:** not measured as a page-level value. Only the two scripted clicks above.
- **Frames dropped:** not measured with the `Overlay` domain. The rAF gaps over 50 ms stand in for it.
