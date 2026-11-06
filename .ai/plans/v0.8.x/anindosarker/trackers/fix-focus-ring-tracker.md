# Filter editor focus ring (F31), tracker

Status: merged (24ed9c7ad64ad4a3403a8ff8dab9f0d05ce19355)
Branch `v0.8/fix-focus-ring`, worktree 03, PR #109
Files owned: `components/head/ST_TableHeadCellFilterContainer.tsx` in the three bases; `stories/fixed-bugs/FilterEditorFocusRing.stories.tsx`
Depends on: 06.1
Gates:
- `pnpm test:base stories/fixed-bugs/FilterEditorFocusRing.stories.tsx` on the shipped code (c5724f8a plus the story): red as expected, Chip Editor Ring and Subheader Row Ring fail with "filter container padding-top: expected 0 to be greater than or equal to 3"; the first draft's rect check failed on the same `overflow-hidden` CollapsibleContent (group top minus 3 px above the panel top)
- `pnpm tsc:radix` at 90e55d1b: green
- `pnpm tsc:baseui` at 90e55d1b: green
- `pnpm tsc:aria` at 90e55d1b: green
- `pnpm lint` at 90e55d1b: green
- `pnpm check:bases` at 90e55d1b: green
- `pnpm check:tailwind` at 90e55d1b: green
- `pnpm test:radix stories/fixed-bugs/FilterEditorFocusRing.stories.tsx stories/features/FilterChips.stories.tsx stories/fixed-bugs/FilterPopover.stories.tsx` at 90e55d1b: green (3 files, 17 tests)
- `pnpm test:base` same three files at 90e55d1b: green (3 files, 17 tests)
- `pnpm test:aria` same three files at 90e55d1b: green (3 files, 17 tests)
- `pnpm test:base` at 90e55d1b: green (78 files, 539 tests)
- `pnpm test:radix` at bad2eb22: green (78 files, 539 tests), verifier
- `pnpm test:aria` at bad2eb22: green (78 files, 539 tests), verifier
- `pnpm storybook:build:aria` at bad2eb22: green, verifier
- tsc per base, lint, check:bases, check:tailwind, test:base at 90e55d1b: still valid (90e55d1b..bad2eb22 touches only the tracker and CHANGELOG.md), verifier

- Milestone 01 fix and plays: done (90e55d1b)

## Attention

- Radix gets `-m-0.75 p-0.75` too, though its CollapsibleContent has no `overflow-hidden` at rest: keeps the three bases' room for the ring the same during the open animation. No `box-content`: Base UI and React Aria set the panel height variable from `scrollHeight`, which includes the padding, so border-box height is the full content (the plays assert `scrollHeight <= clientHeight`). Revert the radix line if the owner wants radix untouched.

## Notes

- The padding check targets the filter container (`[data-slot="collapsible-content"]`) only; the table scroll box clips too and is covered by the rect check alone.
