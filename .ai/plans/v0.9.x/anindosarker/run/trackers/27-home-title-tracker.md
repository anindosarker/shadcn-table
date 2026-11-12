# 27: Home title and hero tagline name the category, tracker

Status: merged (0e3d9478)
Branch `v0.9/home-title`, worktree `shadcn-react-table.worktrees/03`
Checks:
- `pnpm --filter shadcn-table-docs types:check` at ecf28f3e: pass
- `pnpm --filter shadcn-table-docs lint` at ecf28f3e: pass (0 errors, 9 warnings, none in the owned files)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5346 pnpm --filter shadcn-table-docs build` at ecf28f3e: pass
- Acceptance curls on `next start -p 5346` at ecf28f3e: pass (lines in Notes)
- `pnpm test typecheck --base base` at 18a30e99: pass
- `pnpm test lint` at 18a30e99: pass (9 warnings)
- `pnpm test validate-repo` at 18a30e99: pass
- `pnpm test docs-e2e --base base` at 18a30e99: pass (examples 939 passed, 0 failed; 4 sections, 107 pages)
- Verifier at 9c37e63e: Local CI and docs-e2e at 18a30e99 not rerun (18a30e99..9c37e63e touches only .ai/)
- `pnpm --filter shadcn-table-docs types:check` at 9c37e63e: pass (verifier; ecf28f3e..HEAD touches home-page.tsx)
- `pnpm --filter shadcn-table-docs lint` at 9c37e63e: pass (verifier; 0 errors, 9 warnings)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5346 pnpm --filter shadcn-table-docs build` at 9c37e63e: pass (verifier)
- Acceptance curls on `next start -p 5346` at 9c37e63e: pass (verifier; both title tags carry the new string, docs title `Introduction | shadcn-table`, `grep -c` 2, `grep -o | wc -l` 8 as in Notes; server stopped)

- Task 1 edits: done (ecf28f3e)
- Task 2 acceptance proof: done (ecf28f3e, no code change)
- Task 3 format and changelog: done (18a30e99)

## Notes

- `curl -s localhost:5346/ | grep -oE '<title>[^<]*</title>|og:title" content="[^"]*"'`: `<title>shadcn-table: data table for shadcn/ui, built on TanStack Table</title>` and `og:title" content="shadcn-table: data table for shadcn/ui, built on TanStack Table"`.
- `curl -s localhost:5346/docs/getting-started/introduction | grep -o '<title>[^<]*</title>'`: `<title>Introduction | shadcn-table</title>`.
- `curl -s localhost:5346/ | grep -c 'data table for shadcn/ui'`: `2`, but that counts lines, not matches: the HTML body is one line and the RSC payload another. `grep -o ... | wc -l` gives 8: `<title>`, `og:title`, `twitter:title` and the eyebrow in the HTML, the same four in the RSC payload. The visible page text carries the phrase once (the eyebrow), as D56 asks.
- `pnpm format` wrapped the eyebrow JSX text over two lines (18a30e99); JSX joins it with one space, so the rendered text is unchanged.

## Attention
