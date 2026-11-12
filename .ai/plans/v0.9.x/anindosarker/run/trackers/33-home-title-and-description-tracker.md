# 33: Home title, hero line and one shared site description, tracker

Status: merged (02c6a98a)
Branch `v0.9/home-title-and-description`, worktree 07
Checks:
- Check: types, `pnpm --filter shadcn-table-docs types:check` at 807f548a: pass
- Check: docs lint, `pnpm --filter shadcn-table-docs lint` at 807f548a: pass (0 errors, 9 existing warnings)
- Check: description source grep, `grep -rn "Open-source React data table for shadcn/ui, built on TanStack Table. Sorting" apps/shadcn-table-docs ... | wc -l` at 807f548a: pass (1)
- Check: old sentence grep, `grep -rn "production-ready table library" apps/shadcn-table-docs/app apps/shadcn-table-docs/lib` at 807f548a: pass (nothing)
- Check: home tags, production build with `NEXT_PUBLIC_SITE_URL=http://localhost:5343`, `next start -p 5343`, `curl -s localhost:5343/ | grep -oE ...` at 807f548a: pass; `<title>shadcn-table: React Data Table for shadcn/ui and TanStack</title>`, `og:title` the same, `description`, `og:description`, `twitter:description` all "Open-source React data table for shadcn/ui, built on TanStack Table. Sorting, filtering, pagination, grouping, pinning. Installs as source via shadcn CLI."
- Check: hero line, `curl -s localhost:5343/ | grep -c 'The open-source React data table for'` at 807f548a: pass (2)
- Check: docs title, `curl -s localhost:5343/docs/getting-started/introduction | grep -o '<title>[^<]*</title>'` at 807f548a: pass (`<title>Introduction | shadcn-table</title>`)
- Check: llms.txt, `curl -s localhost:5343/llms.txt | sed -n 3p` at 807f548a: pass (`> ` plus the description)
- Check: JSON-LD, `curl -s localhost:5343/ | grep -o '"description":"[^"]*"' | head -1` at 807f548a: pass (the description)
- Check: OG image, `curl localhost:5343/opengraph-image` at 807f548a: pass (200 image/png, card shows the new description)
- Check: typecheck, `pnpm test typecheck --base base` at ee4e9ed5: pass
- Check: lint, `pnpm test lint` at ee4e9ed5: pass (9 warnings)
- Check: validate-repo, `pnpm test validate-repo` at ee4e9ed5: pass
- Check: docs-e2e, `pnpm test docs-e2e --base base --url http://localhost:5343` (fresh `pnpm --filter shadcn-table-docs build`, `next start -p 5343`) at ee4e9ed5: pass (4 sections, 107 pages, 0 failed)
- Check (verifier): local CI and 2.2 lines all valid (recorded at ee4e9ed5 or 807f548a; later commits touch only .ai/ and CHANGELOG.md); none rerun
- Check (verifier): Acceptance 1.2 rerun at a0a4a6ad: source greps pass (1; nothing); fresh build with `NEXT_PUBLIC_SITE_URL=http://localhost:5343`, `next start -p 5343`: title, `og:title`, `description`, `og:description`, `twitter:description` exact; hero line count 2; docs title `<title>Introduction | shadcn-table</title>`; `llms.txt` line 3 the blockquote description; JSON-LD description exact; `/opengraph-image` 200 image/png; `pnpm test docs-e2e --base base --url http://localhost:5343` pass (4 sections, 107 pages, 0 failed); server stopped

- Task 1 shared constant, title, hero line: done (807f548a)
- Task 2 Acceptance on a production build: done (807f548a)
- Task 3 cleanup and changelog: done (ee4e9ed5)

## Attention
