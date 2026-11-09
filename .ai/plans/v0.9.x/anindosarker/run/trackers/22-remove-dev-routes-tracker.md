# 22: Remove the /dev preview routes, tracker

Status: running
Branch `v0.9/remove-dev-routes`, worktree 04
Parent: 295d9afb2bb2268d822ae1870b9f49064cf696a1 (view a deleted file with `git show /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/04/295d9afb2bb2268d822ae1870b9f49064cf696a1pps/shadcn-table-docs/app/dev/theme/9/page.tsx`)

Checks:
- `pnpm --filter shadcn-table-docs types:check` at Task 1 commit: pass
- `git ls-files app/dev theme-demo/variants | grep -vE whole-app` at Task 1 commit: empty

Notes:
- Importer grep before removal: theme-chips imported only by terminal, stage, tokens variants; matches-app and matches-paste only by matches; the other variants by app/dev only. All eleven removed.

## Attention
