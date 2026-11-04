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

- Milestone 01 group, chips, picker, sort editor: done (87b7608e)
- Milestone 02 view settings, search, persistence, triggers: done (87b7608e)
- Milestone 03 stories, captures, judges: done (1f1082a4)
- Milestone 04 cleanup and gates once: done (27cf06cf)

## Attention

- The view settings row reads "Row Numbers" (the existing `localization.rowNumbers` text, spec 01's `en.ts`); the reference reads "Row numbers". Changing the English text is a one-line edit in spec 01's file, left as is.
- No `Claude-Session:` line reached this builder from the harness, so the spec 04 commits and PR #100 carry no attribution line.

## Notes

- `vitest --exclude` does not reach the Storybook project's story include, so the two spec 05 files are left out by passing every other story file as a filter.
- In aria, a pick in the Sort picker swaps the open popover to the editor (as in the demo); a click on another trigger while a popover is open only closes it (React Aria modal popover), so the play closes with Escape before opening the chip.
- The aria header-anchored filter editor unmounts under `flushSync` before focusing the chevron: the popover's focus scope otherwise pulls focus back and restores it to the element focused before the editor opened.
- The DefaultLook story does not render `data-st-view-pending` yet (spec 02); the persistence play asserts the mark is absent after the remount, which holds before and after spec 02 merges.
- Captures: agent-browser at 1800 by 1150, light theme by the html class, own Storybook dev servers on 5350 (base), 5351 (radix), 5352 (aria), every view item pinned through the panel first (as the demo shows them). Header, body and cell differences against the references belong to specs 02 and 03.
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/base-chips-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/radix-chips-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/aria-chips-light.png (Status: Done and Priority: High chips, Priority editor open from the toolbar picker); reference `reference/01-chips-light.png`
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/base-sort-editor-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/radix-sort-editor-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/aria-sort-editor-light.png (Status ascending, Priority descending, "2 sorts" chip); reference `reference/01-sort-editor-light.png`
- Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/base-view-settings-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/radix-view-settings-light.png, /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/04/aria-view-settings-light.png (panel open, every item pinned); reference `reference/01-view-settings-light.png`
