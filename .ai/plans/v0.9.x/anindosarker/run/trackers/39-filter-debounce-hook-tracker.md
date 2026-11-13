# 39: Typed filters use one debounce hook, tracker

Status: running
Branch `v0.9/filter-debounce-hook`, worktree 03
Checks:
- Check: plays before the change (P11), `ST_BASE=<base> pnpm exec vitest run stories/features/Filtering.stories.tsx stories/features/Search.stories.tsx -t "<play>"` on base, radix, aria at the Task 1 commit (library code unchanged): fail as required, the same line on the three bases:
  - `TypeThenClearFiltersStaysCleared`: `expected [ { id: 'firstName', value: 'Ada' } ] to deeply equal []`
  - `TypeThenEnterAppliesAtOnce`: `expected <tr …> … Expected: "1" Received: "4"` (rows not filtered within 100 ms of Enter)
  - `HalfTypedYearAppliesNothing`: `expected [ { id: 'birthDate', …(1) } ] to deeply equal []` (the half-typed `0002-01-01` applied on the pause)
  - `ClearCancelsPendingSearch`: `Expected element to have text content: null Received: ""` (the pending call writes after the clear)
  - `TypeThenClearFiltersStaysCleared` rerun after its second click was added (React Aria): same line on the three bases, with the old `ST_FilterTextField.tsx` of `origin/claude/review` in place
- Check: typecheck, `pnpm test typecheck --base base|radix|aria` at the Task 2 commit: pass (radix with `NODE_OPTIONS=--max-old-space-size=8192`, see Attention)
- Check: plays, `ST_BASE=<base> pnpm exec vitest run stories/features/Filtering.stories.tsx stories/features/Search.stories.tsx stories/features/FilterChips.stories.tsx` on base, radix, aria at the Task 2 commit: pass (68 of 68 each)
- Check: `cmp` of the three `hooks/useST_DebouncedCallback.ts` at the Task 2 commit: identical

- Task 1 plays first: done (5b7254f9)
- Task 2 hook, column filter field, global search: running

## Browser record (1.6.3)

- Chromium (Playwright headless, the storybook-tests browser): a typed digit raises `keydown` first; `input` and `change` follow only once every segment holds a value, then after each later digit (`0002-01-01`, `0020-01-01`, `0202-01-01`, `2026-01-01`). `time` and `datetime-local` behave the same; Tab inside `datetime-local` moves between segments with a `keydown` and no `blur`. Playwright `fill` (the docs E2E path) raises `input` and `change` with no `keydown`, so it commits at once. The segment order follows the machine locale (day first here), so the play types `01012`, which reads the same in either order.
- WebKit and Firefox: not installed for Playwright on this machine; not recorded. The native picker pick cannot be driven headless; the rule treats any change with no key press since the last commit as a pick.

## Attention
