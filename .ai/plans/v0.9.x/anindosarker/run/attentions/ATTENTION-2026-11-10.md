# Attention, 2026-11-10

## A20 The bundle analyzer wrap writes no report under Turbopack
[D63]


- Spec 24 wraps `next.config.mjs` in `@next/bundle-analyzer` behind `ANALYZE=1` (D53, for spec 30's measurements). The docs app builds with Turbopack, and the analyzer prints "not compatible with Turbopack builds, no report will be generated"; `next build --webpack` writes the reports but fails on `node:` imports. So the wrap and its devDependency do nothing today. The canonical tags and the 308 redirect pass; milestone 24 merges with the wrap as specified, and spec 30 measures the home page chunks from the built `/` HTML and Lighthouse instead.

- Options:
  - a) Recommended: remove the wrap and the `@next/bundle-analyzer` devDependency in a small fix milestone; bundle inspection uses `next experimental-analyze` when needed
  - b) keep the wrap as merged (inert until the app builds with webpack)

## A21 The home page cannot reach 450 KB of script inside the home components
[D62] [F30]


- D59 and spec 30 ask for under 450 KB of script transfer on `/`, changing only `components/dev-home/**`. The builder measured 711 KB before and 580 KB after (blocking time 158 ms, under the 300 ms target). Of the first load, all but 19 KB is the shared root layout (posthog-js 114 KB, react-dom 72 KB), which spec 30 puts out of scope; the live demo table adds 167 KB and the docs check "icons: the pick survives a reload" needs it to load without input. Milestone 30 Home JavaScript is stopped, not merged: branch `v0.9/home-javascript` at b2bcf60d holds the 580 KB state (nav and hero links prefetch on hover, touch or focus instead of in the viewport), every check green.

- Options:
  - a) Recommended: merge the branch as it stands (711 to 580 KB) and move the target to what the home components can reach; the root layout (PostHog loading) becomes its own decision
  - b) load the demo table only on visitor intent (437 KB measured) and change the docs check that waits for the table after a reload
  - c) widen spec 30 to `app/layout.tsx` and lazy-load posthog-js and the providers, then rerun the milestone against 450 KB
  - d) drop the branch; the home page stays at 711 KB

## A22 The sidebar Changelog link is marked external

