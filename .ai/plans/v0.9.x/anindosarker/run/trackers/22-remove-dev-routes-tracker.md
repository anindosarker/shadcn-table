# 22: Remove the /dev preview routes, tracker

Status: merged (3e254708fcaeec199c2d9ba4ee3121c85d304bb7)
Branch `v0.9/remove-dev-routes`, worktree 04
Parent: 295d9afb2bb2268d822ae1870b9f49064cf696a1 (view a deleted file with `git show 295d9afb:apps/shadcn-table-docs/app/dev/theme/9/page.tsx`)

Checks:
- `pnpm --filter shadcn-table-docs types:check` at a31e0390: pass
- `git ls-files app/dev theme-demo/variants | grep -vE whole-app` at a31e0390: empty
- goal 2 grep (`/dev` route references in apps/shadcn-table-docs) at c1618384: empty
- `pnpm --filter shadcn-table-docs types:check` at c1618384: pass
- `pnpm --filter shadcn-table-docs lint` at c1618384: pass (0 errors, 9 pre-existing warnings, none in owned files)
- `pnpm --filter shadcn-table-docs build` then `next start -p 5340` at c1618384: pass; curl status lines:
  - `/dev 404`
  - `/dev/theme 404`
  - `/dev/theme/1 404`
  - `/dev/theme/9 404`
  - `/ 200`
  - server on 5340 stopped after the proof
- `pnpm format` at 3e5e06d8: no changes
- `pnpm test typecheck --base base` at 3e5e06d8: pass
- `pnpm test lint` at 3e5e06d8: pass (0 errors, 9 pre-existing warnings)
- `pnpm test validate-repo` at 3e5e06d8: pass
- `pnpm test docs-e2e --base base` at 3e5e06d8: pass (4 sections, 107 pages; examples 939 passed, 0 failed)
- verifier at 250ab5b1: `git ls-files app/dev theme-demo/variants | grep -vE whole-app` empty; goal 2 grep empty; every other 2.2 and 1.2 check recorded at c1618384 or 3e5e06d8, later diff only .ai/ and CHANGELOG.md, not rerun

Tasks:
- Task 1 route removal: done (a31e0390)
- Task 2 ride-alongs: done (c1618384)
- Task 3 acceptance proof: done (39b1da77)
- Task 4 cleanup and changelog: done (3e5e06d8)

Notes:
- Importer grep before removal: theme-chips imported only by terminal, stage, tokens variants; matches-app and matches-paste only by matches; the other variants by app/dev only. All eleven removed.
- The worktree's install lacked `@tailwindcss/node` (declared in apps/shadcn-table-docs/package.json); `pnpm install --frozen-lockfile` fixed it, no lockfile change.

## Attention
