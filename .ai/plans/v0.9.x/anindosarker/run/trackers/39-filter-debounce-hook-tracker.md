# 39: Typed filters use one debounce hook, tracker

Status: running
Branch `v0.9/filter-debounce-hook`, worktree 03
Checks:
- Check: plays before the change (P11), `ST_BASE=<base> pnpm exec vitest run stories/features/Filtering.stories.tsx stories/features/Search.stories.tsx -t "<play>"` on base, radix, aria at the Task 1 commit (library code unchanged): fail as required, the same line on the three bases:
  - `TypeThenClearFiltersStaysCleared`: `expected [ { id: 'firstName', value: 'Ada' } ] to deeply equal []`
  - `TypeThenEnterAppliesAtOnce`: `expected <tr …> … Expected: "1" Received: "4"` (rows not filtered within 100 ms of Enter)
  - `HalfTypedYearAppliesNothing`: `expected [ { id: 'birthDate', …(1) } ] to deeply equal []` (the half-typed `0002-01-01` applied on the pause)
  - `ClearCancelsPendingSearch`: `Expected element to have text content: null Received: ""` (the pending call writes after the clear)

- Task 1 plays first: running

## Browser record (1.6.3)

## Attention
