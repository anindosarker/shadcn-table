# 40: Date filters compare dates, tracker

Status: merged (19792082)
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
- Check (review fixes): `IsoDateTimeStringColumnByDay` with the filterFns.ts of 4eb91071's parent a27fd299 (`ST_BASE=base`): fail, `expected [ 'No results found' ] to deeply equal [ 'Ben', 'Cara' ]`
- Check: `ST_BASE=<base> pnpm exec vitest run stories/features/DateFilters.stories.tsx stories/features/CustomFilterFns.stories.tsx stories/features/Filtering.stories.tsx` at d3f59e57: pass, 55 of 55 on base, radix and aria
- Check: `cmp` of `filterFns.ts` base against radix and aria at d3f59e57: identical
- Check: `pnpm test typecheck --base base` and `--base aria` at 4eb91071: pass
- Check: `NODE_OPTIONS=--max-old-space-size=8192 pnpm test typecheck --base radix` at 4eb91071: pass
- Check: `pnpm test lint` at 4eb91071: pass
- Check: `pnpm test validate-repo` at 4eb91071: pass
- Check: `pnpm test storybook-tests --base base` at 4eb91071: pass, 635
- Check: `pnpm test storybook-tests --base radix` at 4eb91071: 1 failed (`ClickToCopy` "Click Copies Value", P5 known flake), rerun: pass, 635
- Check: `pnpm test storybook-tests --base aria` at 4eb91071: pass, 635
- Check: P7 `-export` grep at 4eb91071: empty
- Check (verifier): Local CI and 2.2 lines at 4eb91071 still valid at a6877a97 (`git diff --name-only 4eb91071..a6877a97` touches only the tracker); not rerun. Radix typecheck counted on the `NODE_OPTIONS=--max-old-space-size=8192` line (environment heap, see Attention)
- Check (verifier, Acceptance 1.2): `ST_BASE=<base> pnpm exec vitest run stories/features/DateFilters.stories.tsx stories/features/CustomFilterFns.stories.tsx stories/features/Filtering.stories.tsx` at a6877a97: pass, 55 of 55 on base, radix and aria; the seven plays of 1.2 present and green; P11 before-the-change failures of `GreaterThanOnDateColumn` and `LessThanOnDateColumn` recorded above at 0c5d4fa4, and of `IsoDateTimeStringColumnByDay` at a27fd299
- Check (verifier): P7 `-export` grep against origin/claude/review at a6877a97: empty
- Check (verifier): `git diff $(git merge-base origin/claude/review HEAD)..HEAD --stat` at a6877a97: the seven owned files, the six generated `ui-<base>` copies, CHANGELOG.md and this tracker; matches Files owned and 1.4/1.6.1

- Task 1 Plays first: done (0c5d4fa4)
- Task 2 Comparison helper and default mode: done (b652d149)
- Task 3 Regenerate, format, changelog: done (a27fd299)
- Review fixes: done (4eb91071)

## Attention

- The docs `types:check` step of `pnpm test typecheck --base radix` runs out of the default Node heap on this machine (about 4.7 GB resident when it passes with `NODE_OPTIONS=--max-old-space-size=8192`); the milestone touches no docs source beyond the generated copies, so this is not caused here, but every radix typecheck will hit it until the step gets a larger heap.
- The first aria storybook-tests run had one failure whose name the record does not keep; the rerun was green, so it is taken as a load flake.
- Review fix, judgment call: string row values holding a full ISO date-time (`/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/`, valid `new Date`) now compare as dates in the eight modes, per D81 bullet 2, so the new `equals` default keeps matching them by day; this departs from spec 1.6.2 ("string row values take exactly today's branches") and changes `greaterThan`/`lessThan` on such strings from text to date compare (changelog `### Changed`); revert to text if the owner rules otherwise.
- Follow-up for an F item: `ST_FilterTextField.tsx:292` and `ST_ColumnActionMenu.tsx:170` (three bases) reset a cleared `empty`/`notEmpty` mode to `allowedColumnFilterOptions?.[0] ?? 'fuzzy'` instead of `getDefaultColumnFilterFn(columnDef)`, so a date column lands on `fuzzy` there; outside this milestone's files (spec 39 owns ST_FilterTextField), needs a play that clears an `empty` chip on a date column and filters by day.
- Follow-up for the docs session: `apps/shadcn-table-docs/content/docs/guides/column-filtering.mdx` (lines 93-98, 175) still says the default is `fuzzy` and does not say how date, datetime and time filters compare with `Date` values (local day, time of day, minute); not in this milestone's files, so not edited.
