# 02: Pagination, tracker

Status: running
Branch `v0.9/pagination`, worktree 02
Checks:
- `ST_BASE=radix vitest run stories/features/Pagination.stories.tsx` at f3c0fe69 + the two plays (library unchanged): fail as required, 2 failed, 21 passed. Red lines: PagesFooterRowRange `Unable to find an element with the text` (no range span in the pages footer); CompactFooter `Unable to find an element with the text` ('compact' falls through to the custom branch)
- `tsc -p tsconfig.stories.json --noEmit` at the same state: fail as required, `Pagination.stories.tsx: error TS2322: Type '"compact"' is not assignable to type '"default" | "custom" | "pages" | undefined'` (plus pre-existing errors in HeaderGroups, ViewSettings, PinnedItemsCustomToolbar stories, not owned); `pnpm --filter shadcn-table tsc:radix` does not include `stories/`, so it cannot show this red
- `eslint --max-warnings 0 stories/features/Pagination.stories.tsx` at task 1: pass

- Task 1 Reproduce (plays red on the shipped code): planned
- Task 2 Library (range span, compact branch, three bases): planned
- Task 3 Rename sites (stories, docs, example, docs E2E): planned
- Task 4 Cleanup: planned

## Attention


## Notes

- PagesFooterRowRange uses fixed rows (`searchData`, only row 1 is `Liam`, no other cell holds the letters l-i-a-m in order) so the fuzzy global search leaves exactly one row.
