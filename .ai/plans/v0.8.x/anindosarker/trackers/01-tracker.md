# 01: shared surface, tracker

Status: done (88f29ad5)
Branch `v0.8/shared-surface`, worktree 01, PR #97
Gates:
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria` after the lucide-react bump at 016a792f: green
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria`, `tsc -p tsconfig.stories.json` at 64f4efe1: green
- `pnpm lint` at 64f4efe1: green
- `pnpm check:tailwind`, `pnpm check:icons`, `pnpm check:bases` at 64f4efe1: green
- `node .ai/plans/v0.8.x/anindosarker/reference/01-check.mjs` at 64f4efe1: green
- `test:radix`, `test:base`, `test:aria` (73 files, 475 tests each, own browser API ports 5341 to 5343) at 88f29ad5: green
- `storybook:build:base` at 88f29ad5: green
- `pnpm install --frozen-lockfile` at 88f29ad5: green, tree clean
- `pnpm format` at 88f29ad5: no change

- Milestone 01 dependency, captures and changelog: done (92cfca14)
- Milestone 02 types, options, slices, helpers, icons, strings: done (64f4efe1)
- Milestone 03 cleanup and gates once: done (88f29ad5)

## Attention

- `rowNumbers` already was a required localization key with the text "Row Numbers"; it is kept as is (existing texts stay), so the view settings row reads "Row Numbers" unless spec 04 or the owner changes the English text to the spec's "Row numbers".
- No `Claude-Session:` line reached this builder from the harness, so the spec 01 commits and PR #97 carry no attribution line.

## Notes

- lucide-react `^1.64.0` resolves to 1.67.0; no alias in `icons.ts` was renamed (tsc green in all three bases without an edit). The docs app keeps its own lucide-react (1.59.0), which has every new glyph.
- Captures: agent-browser at 1800 by 1150, theme by `set media light|dark` (the demo follows the system theme). The demo already overflows at 1800, so `scroll-cues` keeps that width, scrolls the box 400 px and hovers the body so both chevrons and edge shadows show.
- `chips`: Status: Done plus Priority: High with the Priority editor open; in dark it opened from the + Filter pill, in light from the toolbar filter popover (Back to columns, Priority). In light the demo blanked the whole document (body emptied, no console error) when the + Filter pill was clicked a second time, repeatably.
- `ST_TableHeadCellFilterContainer` needed no edit: `open` already reaches the Collapsible through `CollapseProps` in radix and base (spread after the computed value, so it wins) and is an explicit prop in aria (`open ?? ...`).
- The columns menu rows now accept the drop (`dragover` prevents default, `dropEffect` `move`, `none` on a locked row); without it every menu drop would read as cancelled.
- `overflowTooltip` types its `table` as `ST_CoreTableInstance`, like every other column option callback.
- `viewSettings` is seeded in `useST_TableInstance` from `enableStickyHeader` and `enableRowNumbers` (a feature's `getInitialState` cannot read options); `resetViewSettings()` restores `initialState.viewSettings`.
- `readStoredView(key, columnIds?)` takes the table's column ids for the drop-on-unknown-id rule; without them it only parses.
- Set-map substitutes carry the maps' existing comment form, `// Stands in for Lucide <name>.`
