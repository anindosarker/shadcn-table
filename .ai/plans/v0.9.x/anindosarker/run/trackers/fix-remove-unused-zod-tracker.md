# Remove unused zod (Q64, D79), tracker

Status: running
Files owned: `apps/shadcn-table-docs/package.json`, `pnpm-lock.yaml`
Depends on: none
Branch `v0.9/fix-remove-unused-zod`, worktree 08
Checks:
- Check: no zod import, `git grep -n "from 'zod'" apps/shadcn-table-docs` at 9fb7cf88: pass (no output)
- Check: docs build, `NEXT_PUBLIC_SITE_URL=http://localhost:5358 pnpm --filter shadcn-table-docs build` at 9fb7cf88: pass
- Check: validate-repo, `pnpm test validate-repo` at 9fb7cf88: pass (40 unit tests, registry valid and fresh)

- Task 1 remove zod from docs package.json, refresh lockfile: done (9fb7cf88)
