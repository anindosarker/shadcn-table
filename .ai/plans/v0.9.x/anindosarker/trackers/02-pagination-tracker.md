# 02: Pagination, tracker

Status: running
Branch `v0.9/pagination`, worktree 02
Checks:
- `ST_BASE=radix vitest run stories/features/Pagination.stories.tsx` at f3c0fe69 + the two plays (library unchanged): fail as required, 2 failed, 21 passed. Red lines: PagesFooterRowRange `Unable to find an element with the text` (no range span in the pages footer); CompactFooter `Unable to find an element with the text` ('compact' falls through to the custom branch)
- `tsc -p tsconfig.stories.json --noEmit` at the same state: fail as required, `Pagination.stories.tsx: error TS2322: Type '"compact"' is not assignable to type '"default" | "custom" | "pages" | undefined'` (plus pre-existing errors in HeaderGroups, ViewSettings, PinnedItemsCustomToolbar stories, not owned); `pnpm --filter shadcn-table tsc:radix` does not include `stories/`, so it cannot show this red
- `eslint --max-warnings 0 stories/features/Pagination.stories.tsx` at 27fd2e86: pass
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria` at task 2: pass
- `ST_BASE=<base> vitest run stories/features/Pagination.stories.tsx stories/features/TableProvider.stories.tsx stories/features/NestedTable.stories.tsx stories/features/RowPinningOnSelect.stories.tsx` at task 2, radix, base, aria one after another: pass, 44 of 44 each (PagesFooterRowRange and CompactFooter green)
- `eslint --max-warnings 0` on the changed library and story files at task 2: pass

- Task 1 Reproduce (plays red on the shipped code): done, 27fd2e86
- Task 2 Library (range span, compact branch, three bases): done, this commit
- Task 3 Rename sites (stories, docs, example, docs E2E): planned
- Task 4 Cleanup: planned

## Attention


## Notes

- Task 2 also moved the stories' `paginationDisplayMode` values to `'compact'` (1.6.3 sites in the four story files): with the library on `'compact'`, the old `'default'` falls to the custom branch and the task 2 story checks would fail. The story export renames stay in task 3.

- PagesFooterRowRange uses fixed rows (`searchData`, only row 1 is `Liam`, no other cell holds the letters l-i-a-m in order) so the fuzzy global search leaves exactly one row.
