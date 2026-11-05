# Multi-select filter on scalar values (F29), tracker

Status: merged (ec118670)
Branch `v0.8/fix-multiselect`, worktree 01, PR #106
Gates:
- `pnpm test:radix stories/fixed-bugs/MultiSelectFilter.stories.tsx` on the shipped code (10ec402c plus the story): red as expected, Subheader String Column and Chips String Column show "No results found" after picking two states, Empty Selection Keeps Every Row shows no rows; Subheader Array Column green
- `pnpm tsc:radix` at fd7c5f40: green
- `pnpm tsc:baseui` at fd7c5f40: green
- `pnpm tsc:aria` at fd7c5f40: green
- `pnpm lint` at fd7c5f40: green
- `pnpm check:bases` at fd7c5f40: green
- `pnpm test:radix stories/fixed-bugs/MultiSelectFilter.stories.tsx` at fd7c5f40: green (4 of 4)
- `pnpm test:base stories/fixed-bugs/MultiSelectFilter.stories.tsx` at fd7c5f40: green (4 of 4)
- `pnpm test:aria stories/fixed-bugs/MultiSelectFilter.stories.tsx` at fd7c5f40: green (4 of 4)
- `pnpm test:radix` at fd7c5f40: green (77 files, 537 tests)
- `pnpm check:tailwind` at 56344d68: green (0 not canonical in the three bases), verifier
- `pnpm test:base` at 56344d68: green (77 files, 537 tests), verifier
- `pnpm test:aria` at 56344d68: green (77 files, 537 tests), verifier
- `pnpm --filter shadcn-table storybook:build:base` at 56344d68: green, verifier
- tsc per base, lint, check:bases, test:radix: recorded at fd7c5f40, valid (only tracker and CHANGELOG.md changed since), verifier

- Milestone 01 fix and plays: done (fd7c5f40)

## Attention

- The scalar-tolerant fn `arrIncludesSomeOrValue` replaces table-core's under the registered name `arrIncludesSome` instead of a new `arrIncludesSomeOrValue` key, and `column.utils.ts` keeps `'arrIncludesSome'` as the multi-select default. A new key has no `localization.filterArr...` label, so the active-filter tooltip and the filter mode label would read "undefined", and the label lives in `types.ts` and the locales, outside this story's files. Side effect: an explicit `filterFn: 'arrIncludesSome'` now also matches scalar values (before it matched none). Revert: register the new key, add an optional `filterArrIncludesSomeOrValue` key per D24, point the default at it.

## Notes

- The plays set `enableFacetedValues` so the State options come from the data, as in the docs examples; the aria combobox opens from ArrowDown, not a click.
- Initial `columnFilters` with `[]` bypass `autoRemove`; table-core's `arrIncludesSome` then dropped every row, the new fn keeps them (Empty Selection Keeps Every Row).
