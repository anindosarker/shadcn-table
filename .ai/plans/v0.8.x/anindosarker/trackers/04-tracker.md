# 04: toolbar chrome, tracker

Status: done (27cf06cf)
Branch `v0.8/toolbar-chrome`, worktree 03, PR #100
Gates:
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria` at 87b7608e: green
- `pnpm lint` at 87b7608e: green
- `pnpm check:tailwind`, `pnpm check:bases` at 87b7608e: green
- `node scripts/check-aria-warnings.mjs --url http://localhost:5352` (own aria Storybook) at 87b7608e: 0 warnings
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria` at 27cf06cf: green
- `pnpm lint`, `check:tailwind`, `check:icons` at 27cf06cf: green
- `pnpm check:bases` (root) at 27cf06cf: green
- `node .ai/plans/v0.8.x/anindosarker/reference/01-check.mjs` at 27cf06cf: green
- `test:base`, `test:radix` (`vitest run` with the 74 story files other than `fixed-bugs/MenuOpeners` and `fixed-bugs/MenuFocusReturn`, browser API ports 5341, 5342) at 27cf06cf: green, 491 tests each
- `test:aria` (same 74 files, port 5343) at 27cf06cf: 490 of 491; `fixed-bugs/PanelCollapse` "Progress And Banner Collapse" failed under the three parallel runs and passed three of three runs alone (load timing, story untouched by this spec): green
- `storybook:build:base`, `storybook:build:radix`, `storybook:build:aria` at 27cf06cf: green
- `node scripts/check-aria-warnings.mjs --url http://localhost:5352` (built aria Storybook served on 5352) at 27cf06cf: 0 warnings
- CI run 41778704538 (ddbdb214): red only on the two excluded `fixed-bugs/MenuOpeners` plays (Row Actions, Show Hide Columns) in the three bases; every other job green
- Review round 1 fixes, at 466cc4a4:
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria`, `pnpm lint`: green
- `pnpm check:bases`, `check:tailwind`, `check:icons` (root): green
- `test:base`, `test:radix`, `test:aria` (the same 74 story files, port 5341, one base after another): green, 493 tests each
- `storybook:build:base`, `storybook:build:radix`, `storybook:build:aria` (one after another): green
- `node scripts/check-aria-warnings.mjs --url http://localhost:5352` (built aria Storybook served on 5352): 0 warnings
- Verifier, at 3c6fca21 (466cc4a4..HEAD touches only this tracker, so every builder line at 466cc4a4 stands):
- `node .ai/plans/v0.8.x/anindosarker/reference/01-check.mjs` (verifier): green, 3 bases, 0 problems
- Acceptance rerun (verifier): `vitest run` on `FilterChips`, `SortPopover`, `ViewSettings`, `Search`, `ColumnHiding`, `DensePadding`, `Toolbar`, `fixed-bugs/SearchField`, `fixed-bugs/HeadlessFullScreen` per base, port 5341, one base after another: green, 9 files, 77 tests each in base, radix, aria
- Judges on the light and dark captures: not run by the verifier (the workflow's judge stage, P7)

- Milestone 01 group, chips, picker, sort editor: done (87b7608e)
- Milestone 02 view settings, search, persistence, triggers: done (87b7608e)
- Milestone 03 stories, captures, judges: done (1f1082a4)
- Milestone 04 cleanup and gates once: done (27cf06cf)

## Attention

- The view settings row reads "Row Numbers" (the existing `localization.rowNumbers` text, spec 01's `en.ts`); the reference reads "Row numbers". Changing the English text is a one-line edit in spec 01's file, left as is.
- No `Claude-Session:` line reached this builder from the harness, so the spec 04 commits and PR #100 carry no attribution line.
- Chips mode now offers filter modes as the subheader does: the column's `enableColumnFilterModes` and `columnFilterModeOptions` win over the table's, a table-level flag with no list offers every mode, and checkbox and range slider columns offer none. A table that sets `enableColumnFilterModes` at table level now shows the mode picker on every text, select and date column in chips mode.
- A half-open range chip reads "Min 5" or "Max 20" (`localization.min` / `max`) instead of the earlier literal `≥ 5` / `≤ 20`; new `minSummary` / `maxSummary` keys would sit in spec 01's files.

## Notes

- Review round 1: `MenuOpeners` (spec 05's file, excluded here) still asserts the anchor span the two trigger menus no longer render; spec 05 rewrites it on the integration branch. The chip flash stays an inline `element.animate()` until spec 03's highlight helper merges; the chip-row separator keeps `h-4! self-center!` because the parts' `data-vertical:self-stretch` and `aria-[orientation=vertical]:self-stretch` outrank a plain `self-center`.

- `vitest --exclude` does not reach the Storybook project's story include, so the two spec 05 files are left out by passing every other story file as a filter.
- In aria, a pick in the Sort picker swaps the open popover to the editor (as in the demo); a click on another trigger while a popover is open only closes it (React Aria modal popover), so the play closes with Escape before opening the chip.
- The aria header-anchored filter editor unmounts under `flushSync` before focusing the chevron: the popover's focus scope otherwise pulls focus back and restores it to the element focused before the editor opened.
- The DefaultLook story does not render `data-st-view-pending` yet (spec 02); the persistence play asserts the mark is absent after the remount, which holds before and after spec 02 merges.
- Captures: agent-browser at 1800 by 1150, light theme by the html class, own Storybook dev servers on 5350 (base), 5351 (radix), 5352 (aria), every view item pinned through the panel first (as the demo shows them). Header, body and cell differences against the references belong to specs 02 and 03.
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/base-chips-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/radix-chips-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/aria-chips-light.png (Status: Done and Priority: High chips, Priority editor open from the toolbar picker); reference `reference/01-chips-light.png`
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/base-sort-editor-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/radix-sort-editor-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/aria-sort-editor-light.png (Status ascending, Priority descending, "2 sorts" chip); reference `reference/01-sort-editor-light.png`
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/base-view-settings-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/radix-view-settings-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/aria-view-settings-light.png (panel open, every item pinned); reference `reference/01-view-settings-light.png`
- Captures (dark, `dark` class on `html`, built Storybooks at 466cc4a4 served on 5350 to 5352): /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/base-chips-dark.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/radix-chips-dark.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/aria-chips-dark.png; reference `reference/01-chips-dark.png`
- Captures (dark, `dark` class on `html`, built Storybooks at 466cc4a4 served on 5350 to 5352): /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/base-sort-editor-dark.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/radix-sort-editor-dark.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/aria-sort-editor-dark.png; reference `reference/01-sort-editor-dark.png`
- Captures (dark, `dark` class on `html`, built Storybooks at 466cc4a4 served on 5350 to 5352): /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/base-view-settings-dark.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/radix-view-settings-dark.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/aria-view-settings-dark.png; reference `reference/01-view-settings-dark.png`
