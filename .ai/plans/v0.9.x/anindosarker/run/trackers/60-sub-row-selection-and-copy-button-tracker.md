# 60: Sub-row selection and copy button, tracker

Status: done (built; ready for merge into claude/review)
Branch `v0.9/sub-row-selection-copy-button`, worktree 07
Checks:

- `ST_BASE=<b> vitest run SubRowTree ClickToCopy` on aabc920a + plays (P11), base, radix, aria: fail as required. `SubRowTreeWithSelection` ticks the parent only ([true,false,...]) on all three; `ClickToCopyEnabledWithColumnResizing` button box overflows the narrowed cell on all three (base right 677 > cell 516); with the box asserts off, aria shows the cell's overflow tooltip beside "Click to copy", base shows "Click to copy" alone
- `ST_BASE=<b> vitest run SubRowTree Selection` on dddeb233, base, radix, aria: 38 passed each (incl. `SubRowTreeWithSelectionNoSubRowSelection`, `SubRowTreeWithSingleSelection` plays, `Features/Selection` plays)
- `ST_BASE=<b> vitest run ClickToCopy DefaultLook` on 9950103b, base, radix, aria: 11 passed each (incl. `ClickCopiesValue`, the overflow tooltip plays)
- `tsc:baseui|radix|aria` and eslint on the owned files, per task: clean
- `pnpm format` and `pnpm registry:build` on 73f3075e: no file changed (registry.json unchanged); `tools/registry/aria-diff.json` still lists `ST_OverflowText` and `ST_CopyButton`
- `pnpm test typecheck --base base|radix|aria` on 73f3075e: tsc clean x3
- `pnpm test lint` on 73f3075e: pass (9 warnings, all pre-existing in `apps/shadcn-table-docs/examples/*`)
- `pnpm test validate-repo` on 73f3075e: pass (bases identical, registry fresh, 40 unit tests)
- `pnpm test storybook-tests --base base` on 73f3075e: 652 passed

- Task 1 Plays first: done, add281eb
- Task 2 Sub-row selection: done, dddeb233
- Task 3 Copy button: done, 9950103b
- Task 4 Cleanup: done, 73f3075e

## Attention

- The `ClickToCopyEnabledWithColumnResizing` play hovers the header cell before the button: React Aria opens a hover tooltip only after an earlier pointer move set the pointer modality, which the play's synthetic resize drag does not do. A real pointer always moves first.
- The overflow tooltip of `ST_OverflowText` no longer opens while a button inside it is hovered or keyboard-focused (all three bases), so a narrowed copy cell shows "Click to copy" but not the full value; the full value stays readable by widening the column.
