# Home demo plays only with room for its popovers (F48, D63), tracker

Status: running
Branch `v0.8/fix-demo-viewport`, worktree 02, PR #122
Gates:
- Repro on shipped code (b8435a27), Chromium 1440x900, dev server :5341: at scrollY 0 the toolbar's Sort button bottom is at y 743 (157 px above the bottom edge, the lowest the page allows at 900 px tall); the replay plays (`Now showing: Sorting`, `data-running`) and the Sort popover's top is at y 473, above the Sort button's top (711): flipped over the hero. The new home checks fail there: `demo: holds on Starting with the toolbar near the bottom edge` (room=157px, status `Now showing: Sorting`, running) and the follow-on `demo: plays only with room for its popovers` (timeout).
- Fix verified at fdf0f8a2, Chromium 1440x900: scrollY 0 (157 px room) holds on `Starting`, no popover, after 8 s; demo scrolled in view (Sort button top 100) plays, Sort popover top 138 below the button bottom 132; scrolled back to scrollY 0 mid-step: popover closed, not running, status stays `Now showing: Sorting` for 6 s; scrolled back: running, moves on to `Search`.
- Fix verified at fdf0f8a2, Chromium 1280x720: toolbar 80 px above the bottom edge (Sort bottom 640) holds on `Starting`; with the Sort button top at 100 (room 588 px) it plays with the popover below (top 138, button bottom 132), pauses and resumes as above. The whole demo plus 360 px never fits 720 px, but the condition is room under the toolbar, so it plays.
- Measured popover reach below the toolbar's Sort button bottom (full replay, all three bases): sort editor 252 px, filter picker 250 px (its Status select 198 px), view settings 309 px at 1440 and 1280; the filter picker under the wrapped chips row 340 px at 390 px wide. The view settings panel flips at less than 310 px of room. Hence `POPOVER_ROOM_PX = 360`.
- `pnpm --filter shadcn-table-docs types:check` at fdf0f8a2: green
- `pnpm --filter shadcn-table-docs lint --quiet` at fdf0f8a2: green (no errors)
- `node scripts/check-pages.mjs e / --base base --url http://localhost:5341` at fdf0f8a2: green (43 passed)
- `node scripts/check-pages.mjs e / --base radix --url http://localhost:5341` at fdf0f8a2: green (43 passed)
- `node scripts/check-pages.mjs e / --base aria --url http://localhost:5341` at fdf0f8a2: green (43 passed)

- Milestone 01 D63 start condition: done (fdf0f8a2)

## Attention

- `apps/shadcn-table-docs/scripts/page-checks/_helpers.mjs` (outside the story's file list) changed in `demoLoop`: it scrolled only the step status into view, which after the base reloads left the toolbar 157 px above the bottom edge, so the demo held and the radix and aria holds timed out. It now centres the whole demo. `demoLoop` has no caller besides the home entry in `e.mjs`.
- The demo now holds on "Starting" on first load at 1440x900 and any viewport where the toolbar sits within 360 px of the bottom edge: a visitor sees it play only after scrolling the demo up. This is what D63 asks; noted because it changes the first impression of the home page.

## Notes

- Visibility is a passive scroll and resize listener plus a ResizeObserver on the table and `document.body`, throttled to one frame: the Sort button's top must be at or below the sticky nav's bottom (`.v4-nav`) and its bottom plus 360 px at or above `innerHeight`. A pause lands the step through the existing beats cleanup (`land()` closes the popover), so resume starts the step's hold and moves on.
