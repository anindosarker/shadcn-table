# 49: Home hero line and sentence carry the search words, tracker

Status: running
Branch `v0.9/home-hero-wording`, worktree 06
Checks:
- Check: docs types, `NODE_OPTIONS=--max-old-space-size=8192 pnpm --filter shadcn-table-docs types:check` at dc7f05fd: pass
- Check: docs lint, `pnpm --filter shadcn-table-docs lint` at dc7f05fd: pass (9 warnings, 0 errors)
- Check: acceptance eyebrow and pitch, `curl -s localhost:5352/ | sed ...` on a production build (`NEXT_PUBLIC_SITE_URL=http://localhost:5352`) at dc7f05fd: pass (both new texts present, both old fragments absent)
- Check: acceptance title, `curl -s localhost:5352/ | grep -o '<title>[^<]*</title>'` at dc7f05fd: pass (`<title>shadcn-table: React Data Table for shadcn/ui and TanStack</title>`)
- Check: acceptance unchanged files, `git diff origin/claude/review -- apps/shadcn-table-docs/lib/shared.ts apps/shadcn-table-docs/app/layout.tsx` at 0e71838a: pass (empty)
- Check: screenshots, hero at 1280 and 390 px at dc7f05fd: pass (no overflow; `run/trackers/49-shots/hero-1280.png`, `run/trackers/49-shots/hero-390.png`)
- Check: typecheck, `pnpm test typecheck --base base` at dc7f05fd: pass
- Check: lint, `pnpm test lint` at 0e71838a: pass (9 warnings)
- Check: validate-repo, `pnpm test validate-repo` at 0e71838a: pass
- Check: docs-e2e, `pnpm test docs-e2e --base base --url http://localhost:5352` against `next start -p 5352` of a production build at 0e71838a: pass (getting-started 233, api 109, guides 701, examples 939, 0 failed)
- Check: acceptance eyebrow and pitch rerun on that build at 0e71838a: pass

- Task 1 The two texts: done (dc7f05fd)
- Task 2 Acceptance and screenshots: done (d1eb142f)
- Task 3 Format and changelog: done (0e71838a)

## Attention

- `pnpm --filter shadcn-table-docs types:check` runs out of heap at the default Node limit on this machine; it passed with `NODE_OPTIONS=--max-old-space-size=8192`.
