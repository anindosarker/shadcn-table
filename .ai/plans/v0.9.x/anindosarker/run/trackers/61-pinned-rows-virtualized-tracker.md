# 61: Pinned rows stay in view with row virtualization, tracker

Status: running
Branch `v0.9/pinned-rows-virtualized`, worktree 06
Checks:

- `ST_BASE=base vitest run stories/features/RowPinning.stories.tsx`, afc48d1e on the pre-fix library: fail as required (P11). `Row Pinning Sticky With Virtualization`: after the scroll to the middle "row 0 rendered" is undefined (the pinned row left the rendered range); the other 17 plays pass

- Task 1 The play first: afc48d1e
