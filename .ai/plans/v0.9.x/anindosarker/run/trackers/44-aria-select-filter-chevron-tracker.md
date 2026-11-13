# 44: React Aria select filter chevron at the right end, tracker

Status: running
Runs in milestone Filter editor fixes, tracker 41-range-filter-editor-tracker.md

- P11 before the change, `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Select Chevron At Input End"` at 0f0f9f54: base pass, radix pass, aria fail: `chevron 109.953125 px from the input's right end: expected 109.953125 to be less than or equal to 12`.
- Narrow element on React Aria (chip editor, no value): the `Select` root (`data-slot="select"`, the part's `w-fit`) is 134 px inside a 235 px input group; the trigger is 134 px, as wide as that root. Fix: `className="w-full min-w-0 flex-1"` on the `Select` of the select branch.
- After: the play and `SelectClearBesideChevron` pass on base, radix and aria. Screenshot of the React Aria City editor: `41-shots/after-aria-select-chevron-city.png`.
