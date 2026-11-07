# 02: Pagination, tracker

Status: merged (de4df68e)
Branch `v0.9/pagination`, worktree 02
Checks:
- `ST_BASE=radix vitest run stories/features/Pagination.stories.tsx` at f3c0fe69 + the two plays (library unchanged): fail as required, 2 failed, 21 passed. Red lines: PagesFooterRowRange `Unable to find an element with the text` (no range span in the pages footer); CompactFooter `Unable to find an element with the text` ('compact' falls through to the custom branch)
- `tsc -p tsconfig.stories.json --noEmit` at the same state: fail as required, `Pagination.stories.tsx: error TS2322: Type '"compact"' is not assignable to type '"default" | "custom" | "pages" | undefined'` (plus pre-existing errors in HeaderGroups, ViewSettings, PinnedItemsCustomToolbar stories, not owned); `pnpm --filter shadcn-table tsc:radix` does not include `stories/`, so it cannot show this red
- `eslint --max-warnings 0 stories/features/Pagination.stories.tsx` at 27fd2e86: pass
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria` at bc55414f: pass
- `ST_BASE=<base> vitest run stories/features/Pagination.stories.tsx stories/features/TableProvider.stories.tsx stories/features/NestedTable.stories.tsx stories/features/RowPinningOnSelect.stories.tsx` at bc55414f, radix, base, aria one after another: pass, 44 of 44 each (PagesFooterRowRange and CompactFooter green)
- `eslint --max-warnings 0` on the changed library and story files at bc55414f: pass
- `pnpm --filter shadcn-table-docs lint` at c3826a06: pass, 0 errors, 9 pre-existing warnings; `eslint --max-warnings 0 stories/features/Pagination.stories.tsx` at c3826a06: pass
- The 1.2 greps at c3826a06 (components/ui-<base> regenerated locally with `pnpm registry:build` and `lib:install <base>`, then restored, not committed): both empty. On the committed tree the first grep still lists the stale docs copies `apps/shadcn-table-docs/components/ui-<base>/.../ST_TablePagination.tsx` and `stConfigFeature.ts` until the merge regenerates them (P9)
- `pnpm test docs-e2e --base base` at c3826a06 (regenerated copies as above): pass, getting-started 181, api 109, guides 689, examples 936, 0 failed
- `pnpm test typecheck --base radix` at c3826a06 with regenerated copies: pass, tsc clean; on the committed tree: fail, 3 errors `examples/.<base>/alternate-pagination/TS.tsx: Type '"compact"' is not assignable to type '"custom" | "default" | "pages" | undefined'` (docs `types:check` reads the stale committed copies under components/ui-<base>; clean after regeneration)
- `pnpm test validate-repo` at c3826a06 with regenerated copies: pass; at c3826a06 and d9fde330 on the committed tree: pass (so the regenerated copies are not committed, P9)
- `pnpm format` at d9fde330: no change beyond the changelog block
- `pnpm test lint` at d9fde330: pass, 9 warnings
- `pnpm test storybook-tests --base radix` at d9fde330: pass, 617 passed
- Verifier, at 0139639b (clean tree; reused unchanged: lint, storybook-tests radix and validate-repo at d9fde330, typecheck radix and docs-e2e base at c3826a06, the diffs since touch only .ai/ and CHANGELOG.md):
  - `pnpm test typecheck --base base` at 0139639b: pass, tsc clean
  - `pnpm test typecheck --base aria` at 0139639b: pass, tsc clean
  - `pnpm test storybook-tests --base base` at 0139639b: pass, 617 passed
  - `pnpm test storybook-tests --base aria` at 0139639b: pass, 617 passed
  - Acceptance (1.2), `ST_BASE=<base> vitest run stories/features/Pagination.stories.tsx -t 'Pages Footer Row Range|Compact Footer'` at 0139639b, base, radix, aria one after another: pass, 2 passed each
  - Acceptance grep 1 at 0139639b: committed tree lists only the six stale generated docs copies under `apps/shadcn-table-docs/components/ui-<base>/` (P9, regenerated at merge); after `pnpm registry:build` and `lib:install <base>` for the three bases: empty (regenerated files restored, not committed)
  - Acceptance grep 2 (`PaginationEnabledDefault`) at 0139639b: empty
  - Acceptance `pnpm test validate-repo` at 0139639b: pass, bases identical, tailwind valid, registry valid, 27 unit tests

- Task 1 Reproduce (plays red on the shipped code): done, 27fd2e86
- Task 2 Library (range span, compact branch, three bases): done, bc55414f
- Task 3 Rename sites (stories, docs, example, docs E2E): done, c3826a06
- Task 4 Cleanup: done, d9fde330

## Attention

- `pnpm test typecheck --base radix` fails on the branch as committed until the docs library copies are regenerated: the docs examples use `'compact'` while `apps/shadcn-table-docs/components/ui-<base>/` still carry the old union (P9 keeps those generated files out of the milestone; validate-repo passes without them). The merge regeneration clears it; the verifier regenerates locally before typecheck radix.


## Notes

- Task 2 also moved the stories' `paginationDisplayMode` values to `'compact'` (1.6.3 sites in the four story files): with the library on `'compact'`, the old `'default'` falls to the custom branch and the task 2 story checks would fail. The story export renames stay in task 3.

- The example line carries the comment `//the compact row range and arrow buttons footer` (1.6.3 "with its comment").
- PagesFooterRowRange uses fixed rows (`searchData`, only row 1 is `Liam`, no other cell holds the letters l-i-a-m in order) so the fuzzy global search leaves exactly one row.
