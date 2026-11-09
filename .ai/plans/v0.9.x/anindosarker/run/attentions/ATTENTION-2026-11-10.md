# Attention, 2026-11-10

## A20 The bundle analyzer wrap writes no report under Turbopack


- Spec 24 wraps `next.config.mjs` in `@next/bundle-analyzer` behind `ANALYZE=1` (D53, for spec 30's measurements). The docs app builds with Turbopack, and the analyzer prints "not compatible with Turbopack builds, no report will be generated"; `next build --webpack` writes the reports but fails on `node:` imports. So the wrap and its devDependency do nothing today. The canonical tags and the 308 redirect pass; milestone 24 merges with the wrap as specified, and spec 30 measures the home page chunks from the built `/` HTML and Lighthouse instead.

- Options:
  - a) Recommended: remove the wrap and the `@next/bundle-analyzer` devDependency in a small fix milestone; bundle inspection uses `next experimental-analyze` when needed
  - b) keep the wrap as merged (inert until the app builds with webpack)

## A21 The home page cannot reach 450 KB of script inside the home components

