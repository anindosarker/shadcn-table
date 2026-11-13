# 39: Typed filters use one debounce hook, tracker

Status: done
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
- Check: `grep -rn "debounce(" packages/shadcn-table/registry/*/components/ui/shadcn-table` at the Task 3 commit: prints nothing
- Check: `pnpm --filter shadcn-table-docs types:check` at the Task 3 commit (after `pnpm registry:build` and `pnpm --filter shadcn-table-docs lib:install base|radix|aria`): pass
- Check: `CustomFilterDebounce`, `ST_BASE=<base> pnpm exec vitest run stories/features/Filtering.stories.tsx -t "Custom Filter Debounce"` on base, radix, aria at the Task 3 commit: pass
- Check: `pnpm test docs-e2e --base base --url http://localhost:5340` (own `next start` of the production build) at 744cdd11: fail, live-demo range filter (Age) `rows=1` on two pages and the api prop table counts `213` and `66`; fixed in c2af36ba (see Attention)
- Check: `pnpm test docs-e2e --base base --url http://localhost:5340` at c2af36ba: pass (getting-started 233, api 109, guides 701, examples 939)
- Check: `pnpm test typecheck --base base|radix|aria` at c2af36ba: pass (with `NODE_OPTIONS=--max-old-space-size=8192`)
- Check: `pnpm test lint` at c2af36ba: pass (9 warnings, none in this milestone's files)
- Check: `pnpm test validate-repo` at c2af36ba: pass (registry fresh)
- Check: `pnpm test storybook-tests --base base` at 744cdd11: `ClickToCopy` "Click Copies Value" failed (P5 known flake), rerun pass 627; at c2af36ba: pass 627
- Check: `pnpm test storybook-tests --base radix` at c2af36ba: pass 627
- Check: `pnpm test storybook-tests --base aria` at c2af36ba: pass 627
- Check: P7, `git diff origin/claude/review -- …/index.ts …/types.ts | grep '^-export'` at c2af36ba: prints nothing
- Check: review plays before the fix (P11), `ST_BASE=<base> pnpm exec vitest run stories/features/Filtering.stories.tsx -t "Controlled Rerender|Chip Editor Escape"` on base, radix, aria at 9ad7e4ed (plays added, library unchanged): the same lines on the three bases:
  - `ControlledRerenderKeepsTypedFilter`: `Expected the element to have value: Ada Received: ` (equal array per parent render reset the typed text)
  - `ChipEditorEscapeKeepsTypedDate`: `expected [] to deeply equal [ { id: 'birthDate', …(1) } ]`
  - `ChipEditorEscapeKeepsTypedText`: pass (the hook's unmount flush already covered text)
- Check: `ST_BASE=<base> pnpm exec vitest run stories/features/Filtering.stories.tsx stories/features/Search.stories.tsx stories/features/FilterChips.stories.tsx` on base, radix, aria at fc3529b6: pass (72 of 72 each)
- Check: `pnpm test typecheck --base base|radix|aria` at fc3529b6: pass (with `NODE_OPTIONS=--max-old-space-size=8192`)
- Check: `pnpm test lint` at 179466f8: fail, `react-hooks/refs` "Cannot access refs during render" (typed date ref); at fc3529b6: pass (9 warnings, none in this milestone's files)
- Check: `pnpm test validate-repo` at fc3529b6: pass (registry fresh)
- Check: `pnpm test storybook-tests --base base`, `--base radix`, `--base aria` (one after another) at fc3529b6: pass 630 each
- Check: `pnpm test docs-e2e --base base --url http://localhost:5340` (own `next start` of the production build) at fc3529b6: pass (getting-started 233, api 109, guides 701, examples 939)
- Check: P7, `git diff origin/claude/review -- …/index.ts …/types.ts | grep '^-export'` at fc3529b6: prints nothing

- Task 1 plays first: done (5b7254f9)
- Task 2 hook, column filter field, global search: done (35c9fc00); the three options and their defaults (1.6.5) landed here, since the field reads them
- Task 3 options docs, CustomFilterDebounce, util removal, guide lines: done (2ac0faec); the generated docs copies and `registry.json` were regenerated here, because the docs type check reads them
- Task 4 regenerate, format, changelog: done (744cdd11, c2af36ba)
- Review fixes: done (179466f8, fc3529b6)

## Browser record (1.6.3)

- Chromium (Playwright headless, the storybook-tests browser): a typed digit raises `keydown` first; `input` and `change` follow only once every segment holds a value, then after each later digit (`0002-01-01`, `0020-01-01`, `0202-01-01`, `2026-01-01`). `time` and `datetime-local` behave the same; Tab inside `datetime-local` moves between segments with a `keydown` and no `blur`. Playwright `fill` (the docs E2E path) raises `input` and `change` with no `keydown`, so it commits at once. The segment order follows the machine locale (day first here), so the play types `01012`, which reads the same in either order.
- Space, F4 and Alt+ArrowDown or Alt+ArrowUp open the native picker from the keyboard and do not mark the value as typed, so a keyboard pick applies at once; the open picker cannot be driven headless, so the keyboard pick itself is not recorded in a browser.
- WebKit and Firefox: not installed for Playwright on this machine; not recorded. The native picker pick cannot be driven headless; the rule treats any change with no key press since the last commit as a pick.

## Attention

- `ST_FilterChips.tsx` (three bases, not owned by this spec) re-focused the chip editor's first input on every table change, because its focus effect depends on the `table` object, which changes with each filter write; with blur now committing, typing Min then clicking Max put the Max text into Min (docs E2E live-demo range filter). Fixed in c2af36ba: the effect focuses once per opened column.
- `test/docs-e2e/lib/api.mjs` (listed as unchanged in 1.6) counts the option table rows; the counts went from 211 to 213 and 65 to 66 for the three new option rows (c2af36ba).
- Clear filters often leaves the column filter value unchanged (it was never committed), so the outside-change sync of 1.6.3 cannot see it; the field also drops a pending call when the column filters array was replaced or the column's chip was removed since the last key, which covers Clear filters and Remove filter, including the unmount flush.
- React Aria's chip editor popover takes the first outside press to close itself, which flushes the typed text (the unmount rule); `TypeThenClearFiltersStaysCleared` clicks Clear filters a second time when the button is still there.
- `ClearCancelsPendingSearch` asserts the global filter is unset (`null`): the old search debounce read the live input value, so after a clear its late call wrote `""`, not the old text.
- The pending-call guard and the outside-change sync compare the column filters by content, not by array identity, so a controlled parent that rebuilds an equal array per render keeps the typed text; a stored view with the same content as the current filters therefore no longer drops a pending call (the same as the spec's value-based sync).
- A typed date, datetime or time value still unapplied when the field unmounts without a blur (Escape in a chip editor) is applied, under the same guard as the debounced typed filters.
- Specs 41 and 43 cite `ST_FilterChips.tsx` line numbers that moved by 6 lines with the focus fix of c2af36ba.
- `pnpm --filter shadcn-table-docs types:check` (inside `typecheck --base radix`) ran out of heap once under machine load at the default heap; it passed later at the default heap and with `--max-old-space-size=8192`.
