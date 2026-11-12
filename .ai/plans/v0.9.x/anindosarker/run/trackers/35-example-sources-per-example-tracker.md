# 35: Example sources are read per example, tracker

Status: running
Branch `v0.9/example-sources-per-example`, worktree 05
Checks:
- Check: before, file pattern warnings, `NEXT_PUBLIC_SITE_URL=http://localhost:5349 pnpm --filter shadcn-table-docs build 2>&1 | grep -c "matches .* files"` at 59a003a9: 1 (matches 10568 files)
- Check: before, build wall time, `time NEXT_PUBLIC_SITE_URL=http://localhost:5349 pnpm --filter shadcn-table-docs build` at 59a003a9: 2:26.92 total
- Check: before, types:check wall time, `time pnpm --filter shadcn-table-docs types:check` at 59a003a9: 1:53.56 total
- Check: before, snapshot of `readExampleFiles` for 117 examples on base, radix and aria, `node snapshot.mjs` at 59a003a9: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/18a7d8fb-53ed-4e77-8be8-85309efc0f16/scratchpad/before.json (script snapshot.mjs beside it)

- Task 1 before numbers and snapshot: done (this commit)
