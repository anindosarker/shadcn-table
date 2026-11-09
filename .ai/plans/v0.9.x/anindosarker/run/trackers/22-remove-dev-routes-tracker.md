# 22: Remove the /dev preview routes, tracker

Status: running
Branch `v0.9/remove-dev-routes`, worktree 04
Parent: 295d9afb2bb2268d822ae1870b9f49064cf696a1 (view a deleted file with `git show /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/04/295d9afb2bb2268d822ae1870b9f49064cf696a1pps/shadcn-table-docs/app/dev/theme/9/page.tsx`)

Checks:
- `pnpm --filter shadcn-table-docs types:check` at Task 1 commit: pass
- `git ls-files app/dev theme-demo/variants | grep -vE whole-app` at Task 1 commit: empty
- goal 2 grep (`/dev` route references in apps/shadcn-table-docs) at Task 2 commit: empty
- `pnpm --filter shadcn-table-docs types:check` at Task 2 commit: pass
- `pnpm --filter shadcn-table-docs lint` at Task 2 commit: pass (0 errors, 9 pre-existing warnings, none in owned files)
- `pnpm --filter shadcn-table-docs build` then `next start -p 5340` at c1618384: pass; curl status lines:
  - `/dev 404`
  - `/dev/theme 404`
  - `/dev/theme/1 404`
  - `/dev/theme/9 404`
  - `/ 200`
  - server on 5340 stopped after the proof

Tasks:
- Task 1 route removal: done (a31e0390)
- Task 2 ride-alongs: done (c1618384)
- Task 3 acceptance proof: done (tracker commit)

Notes:
- Importer grep before removal: theme-chips imported only by terminal, stage, tokens variants; matches-app and matches-paste only by matches; the other variants by app/dev only. All eleven removed.
- The worktree's install lacked `@tailwindcss/node` (declared in apps/shadcn-table-docs/package.json); `pnpm install --frozen-lockfile` fixed it, no lockfile change.

## Attention
