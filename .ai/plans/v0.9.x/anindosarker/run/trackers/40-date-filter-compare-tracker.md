# 40: Date filters compare dates, tracker

Status: running
Branch `v0.9/date-filter-compare`, worktree 04
Checks:
- Check: P11 before the change, `ST_BASE=<base> pnpm exec vitest run stories/features/DateFilters.stories.tsx` at 0c5d4fa4: fail as required on base, radix and aria. `GreaterThanOnDateColumn`: `expected [ 'Ann', 'Ben', 'Cara', 'Dan', …(2) ] to deeply equal [ 'Dan', 'Eve' ]` (every row kept); `LessThanOnDateColumn`: `expected [ 'No results found' ] to deeply equal [ 'Ann', 'Finn' ]` (no row kept); identical line on the three bases. Also failing before: Equals, BetweenInclusive, TimeOfDay, PlainDateVariant; IsoStringColumnUnchanged passed
- Check: `ST_BASE=<base> pnpm exec vitest run stories/features/DateFilters.stories.tsx stories/features/CustomFilterFns.stories.tsx stories/features/Filtering.stories.tsx` at b652d149: pass, 49 of 49 on base, radix and aria
- Check: `cmp` of `filterFns.ts` and `column.utils.ts` base against radix and aria at b652d149: identical
- Check: `pnpm test typecheck --base base` at a27fd299: pass
- Check: `pnpm test typecheck --base radix` at b652d149: fail, docs `types:check` exit 134 (heap out of memory at the default 4.5 GB limit), twice; package `tsc:radix` clean
- Check: `NODE_OPTIONS=--max-old-space-size=8192 pnpm test typecheck --base radix` at a27fd299: pass
- Check: `pnpm test typecheck --base aria` at a27fd299: pass
- Check: `pnpm test lint` at a27fd299: pass, 9 warnings, none in the milestone's files
- Check: `pnpm test validate-repo` at a27fd299: pass
- Check: `pnpm test storybook-tests --base base` at a27fd299: pass, 629
- Check: `pnpm test storybook-tests --base radix` at a27fd299: pass, 629
- Check: `pnpm test storybook-tests --base aria` at a27fd299: 1 failed, 628 passed (name not in the record), rerun once: pass, 629
- Check: P7 `git diff origin/claude/review -- packages/shadcn-table/registry/*/components/ui/shadcn-table/index.ts | grep '^-export'` at a27fd299: empty

- Task 1 Plays first: done (0c5d4fa4)
- Task 2 Comparison helper and default mode: done (b652d149)
- Task 3 Regenerate, format, changelog: done (a27fd299)

## Attention

- The docs `types:check` step of `pnpm test typecheck --base radix` runs out of the default Node heap on this machine (about 4.7 GB resident when it passes with `NODE_OPTIONS=--max-old-space-size=8192`); the milestone touches no docs source beyond the generated copies, so this is not caused here, but every radix typecheck will hit it until the step gets a larger heap.
- The first aria storybook-tests run had one failure whose name the record does not keep; the rerun was green, so it is taken as a load flake.
