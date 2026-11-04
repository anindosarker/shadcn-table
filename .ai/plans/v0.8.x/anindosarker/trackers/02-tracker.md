# 02: frame and body, tracker

Status: done
Branch `v0.8/frame-body`, worktree 01, PR #98
Gates:
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria` at 89c64f19: green
- `pnpm lint` at 89c64f19: green
- `pnpm check:tailwind`, `pnpm check:icons`, `pnpm check:bases` at 89c64f19: green
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:tailwind`, `check:icons` at d65fc6f2: green
- `pnpm test:radix` at d65fc6f2: green, 480 of 480 (first parallel run hit a setup-file import error on 12 files, rerun green)
- `pnpm test:aria` at d65fc6f2: green, 480 of 480
- `pnpm test:base` at d65fc6f2: 479 of 480, `Global Filter Mode Switch` red under parallel load, isolated rerun of CustomFilterFns green 12 of 12
- `pnpm storybook:build:base`, `storybook:build:radix`, `storybook:build:aria` at d65fc6f2: green
- `pnpm check:bases`, `pnpm registry:build` (no diff), `lib:install` per base (no diff), `node reference/01-check.mjs` at d65fc6f2: green
- Review fixes, gates at 371cd87c: `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:tailwind`, `check:icons`, `check:bases`: green
- `pnpm test:radix` at 371cd87c: green, 480 of 480
- `pnpm test:aria` at 371cd87c: green, 480 of 480
- `pnpm test:base` at 371cd87c: 479 of 480, `Global Filter Mode Switch` red under parallel load again; isolated rerun of CustomFilterFns green 12 of 12
- `storybook:build:base`, `storybook:build:radix`, `storybook:build:aria` at 371cd87c: green
- `registry:build` and `lib:install` per base folded into each fix commit; `node reference/01-check.mjs` at 371cd87c: green, 0 problems
- `DefaultLook` RowMetrics play at 19ec6a31 (radix): green; red with the old cell classes (wrapped row stays 48 px)
- Verifier at c802d041 (diff from 371cd87c touches only this tracker, so every 371cd87c line above stands): `pnpm test:base` run alone, green, 480 of 480
- Verifier at c802d041: Acceptance plays (`DefaultLook`, 6 tests) per base, one base after another: base 6 of 6, radix 6 of 6, aria 6 of 6
- Verifier: judges not rerun (they run inside the workflow script, P7); `check-pages.mjs` not in spec 2.2, not run

- Milestone 01 one pass over 1.6.2 to 1.6.8: done (89c64f19)
- Milestone 02 stories, captures, judges: done (5ecc689a)
- Milestone 03 cleanup and gates once: done (d65fc6f2)

## Attention
- Tints paint on the row (`tableBodyRowVariants` tint and hover) and cells are `bg-inherit`, instead of the cell-level token classes of spec 1.6.4; one row-wide hover with no per-cell overlay.
- `ST_TableBody.tsx` stays byte-identical in all bases: each base's `ST_OverflowText.tsx` holds its own `ST_OverflowTooltipProvider`, so `aria-diff.json` does not list `ST_TableBody.tsx` as spec 1.6.1 says.
- `ST_TableLayout` clears `aria-busy` through a `MutationObserver` when `data-st-view-pending` goes, while spec 1.6.8 leaves the removal to spec 04's hook; spec 04 can drop the observer once its hook removes both.
- `ST_ViewPendingScript` and `ST_OverflowTooltipProvider` are no longer exported from `index.ts` (371cd87c); the public spec 02 surface is `ST_OverflowText`, `ST_ScrollButtons`, `useST_HorizontalOverflow` as spec 1.4 lists.
- `test:base` red on `Global Filter Mode Switch` (CustomFilterFns) under parallel load at d65fc6f2 and 371cd87c, green in isolation; not the P4 known flake. CI is the second run.
- Spec 04: the pending check compares the stored entry against `JSON.stringify(getST_DefaultStoredView(table))` as a raw string (keys columnOrder, columnPinning, columnVisibility, density, viewSettings in that order); `writeStoredView` must serialize the same shape and key order, or a stored view equal to the defaults still flashes the skeleton.
- Wrapped grid cells take `h-auto min-h-*` only in grid layout (19ec6a31); semantic cells keep `h-*`, because `h-auto` there would drop single-line rows below the density height.
- Six of the seven build commits carry no `Claude-Session:` line; no history rewrite (P1). Every later commit and the merge commit carry it.
- `check-pages.mjs --base` not run for spec 02 (docs server not started); CI is the second run.

## Notes
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/base-default-light.png
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/base-default-dark.png
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/radix-default-light.png
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/radix-default-dark.png
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/aria-default-light.png
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/aria-default-dark.png
- Captures from the static Storybook build per base, story `styling-default-look--default`, theme via the `sb-addon-themes-3` storage key. Header cells, toolbar icons and cell badges differ from the reference by design: spec 03, spec 04 and story cell renderers.
