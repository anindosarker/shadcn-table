# 68: Version labels, tracker

Status: running
Branch `v0.9/version-labels`, worktree 03
Checks:
- Red: docs-e2e `header version`, `pnpm test docs-e2e --base base /docs/getting-started/install` at 5d16e986 (before the cherry-pick): fail, `FAIL /docs/getting-started/install @1440 header version v0.9.6: []` and `... header version at 390 v0.9.6: []`, the only 2 fails of 35
- Check: cherry-pick diff, `git diff a3d61fe9 HEAD -- apps/shadcn-table-docs/components/site-nav.tsx apps/shadcn-table-docs/lib/layout.shared.tsx` at 26bef0e1: empty
- Check: docs-e2e, `pnpm test docs-e2e --base base` at 26bef0e1: pass, 2637 checks, `header version` and `header version at 390` passed

- Task 1 The docs check and the header label: 26bef0e1
- Task 2 The title check and the Storybook title: planned
- Task 3 The changelog block: planned

## Attention

## Notes
