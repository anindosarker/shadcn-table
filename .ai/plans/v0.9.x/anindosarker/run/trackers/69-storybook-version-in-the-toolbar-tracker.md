# 69: Storybook version in the toolbar (Q138), tracker

Status: running
Branch `v0.9/storybook-toolbar-version`, worktree 07
Checks:
- Red first (P11): `pnpm test storybook-static --base base --ids 0:3` at 5a771cd1 (check alone on the code before the change): fail on that check alone, `FAIL manager toolbar version "v0.9.6": 0 items; title "shadcn-table v0.9.6 (Base UI)" (expected "shadcn-table (Base UI)")`; every other line PASS
- `pnpm test typecheck --base base` at bd104e7d (tree as committed): pass

- Task 1 Storybook version in the toolbar: running

## Attention
