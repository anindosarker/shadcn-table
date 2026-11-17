# 60: Sub-row selection and copy button, tracker

Status: done (38508a1f)
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
- `pnpm test storybook-tests --base radix` on 73f3075e (verifier): 652 passed on the second run; the first run had 1 failed, 651 passed, in `ClickToCopy.stories.tsx` (`ClickToCopyEnabledWithColumnResizing` play, load avg 29), and `ST_BASE=radix vitest run ClickToCopy` alone passed 5/5
- `pnpm test storybook-tests --base aria` on 73f3075e (verifier): 652 passed
- Acceptance 1.2 on 73f3075e (verifier): storybook-tests base, radix, aria green; typecheck x3, lint, validate-repo green (recorded above on the same commit); plays recorded failing before the fix (first line): pass

- Task 1 Plays first: done, add281eb
- Task 2 Sub-row selection: done, dddeb233
- Task 3 Copy button: done, 9950103b
- Task 4 Cleanup: done, 73f3075e

## Attention

- The `ClickToCopyEnabledWithColumnResizing` play hovers the header cell before the button: React Aria opens a hover tooltip only after an earlier pointer move set the pointer modality, which the play's synthetic resize drag does not do. A real pointer always moves first.
- The overflow tooltip of `ST_OverflowText` no longer opens while a button inside it is hovered or keyboard-focused (all three bases), so a narrowed copy cell shows "Click to copy" but not the full value; the full value stays readable by widening the column.
- The new `ClickToCopyEnabledWithColumnResizing` play failed once in a full radix run under load (load avg 29) and passed on the rerun and alone; it may belong on the P5 known-flake list if it recurs.
