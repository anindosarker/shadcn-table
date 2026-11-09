# 31: Page frame and new pages, tracker

Status: done
Branch `v0.9/docs-frame`, worktree `/Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/04`

Checks:

- `pnpm --filter shadcn-table-docs types:check` at 3e8114a3: pass
- `NEXT_PUBLIC_SITE_URL=http://localhost:5351 pnpm --filter shadcn-table-docs build` at 3e8114a3: pass
- `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/getting-started` at da82b103: pass (5 pages, 0 on every rule)
- `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/guides/tanstack-table-with-shadcn-ui.mdx` at da82b103: pass (0 on every rule)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5351 pnpm --filter shadcn-table-docs build` at da82b103: pass
- Acceptance curls on `next start -p 5351` (production build of 805b2cef, server stopped after): pass (lines in Notes)
- `gh repo view anindosarker/shadcn-table --json repositoryTopics --jq '[.repositoryTopics[].name] | length'` after `gh repo edit ... --add-topic`: pass (`6`)
- `pnpm format` at 67afaff5: pass (no change)
- `pnpm test typecheck --base base` at 67afaff5: pass
- `pnpm test lint` at 67afaff5: pass (exit 0; 9 warnings, all in `apps/shadcn-table-docs/examples/*/advanced` and `expanding-tree-flat-parse`, present on `claude/review`)
- `pnpm test validate-repo` at 67afaff5: pass
- `pnpm test docs-e2e --base base` at 67afaff5: pass (107 pages, 0 failed)
- `pnpm test docs-e2e --base base /docs/getting-started/introduction /docs/getting-started/comparison /docs/guides/tanstack-table-with-shadcn-ui` at 67afaff5: pass (18 passed, 0 failed)
- Review fixes, reruns at 4cb6f290:
  - `pnpm --filter shadcn-table-docs types:check`: pass
  - `NEXT_PUBLIC_SITE_URL=http://localhost:5351 pnpm --filter shadcn-table-docs build`: pass
  - `node tools/docs/check-frontmatter.mjs` on the guide and the comparison page: pass (0 on every rule)
  - `pnpm format`: pass (no change)
  - `pnpm test validate-repo`: pass
  - `pnpm test docs-e2e --base base /docs/getting-started/comparison /docs/guides/tanstack-table-with-shadcn-ui /docs/guides/click-to-copy`: pass (23 passed, 0 failed)
  - curls on `next start -p 5351` (server stopped after): `/docs/guides/click-to-copy` has the Changelog URL only in the sidebar link, no footer card; byline `grep -o 'Updated 20[0-9-]*</p>' | wc -l` prints `1`; guide carries `table.state`; comparison carries `Data grid: RTL support`

Tasks:

- Task 1 schema, byline, dates: done (3e8114a3)
- Task 2 redirect, sidebar link, meta, check script: done (0d900176)
- Task 3 new pages, Introduction, getting-started descriptions: done (da82b103)
- Task 4 Acceptance on a production build, topics: done (805b2cef)
- Task 5 format, changelog: done (67afaff5)

Notes:

- `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' localhost:5351/docs`: `308 http://localhost:5351/docs/getting-started/introduction`
- `curl -s localhost:5351/docs/getting-started/introduction | grep -c 'Updated 20'` prints `2`, not `1`: one line is the byline HTML, the other the RSC payload script carrying the same text. Corrected check `curl -s localhost:5351/docs/getting-started/introduction | grep -o 'Updated 20[0-9-]*</p>' | wc -l` prints `1` (also `1` on comparison, the new guide and `/docs/api`).
- `curl -s localhost:5351/sitemap.xml | grep -c 'tanstack-table-with-shadcn-ui\|getting-started/comparison'`: `2`
- Topics before: none (`repositoryTopics: null`); after: `data-table,nextjs,react,shadcn-ui,tanstack-table,typescript`; gh login `anindosarker`.
- Comparison sources, read 2026-11-10: https://github.com/sadmann7/tablecn (README), https://github.com/sadmann7/tablecn/blob/main/package.json (`@tanstack/react-table ^9.2.4`), https://www.diceui.com/docs/components/base/data-table, https://www.diceui.com/docs/components/radix/data-table (exists; `/aria/` is 404), https://www.diceui.com/docs/components/base/data-grid, https://github.com/KevinVandy/material-react-table (README: TanStack Table V8, MIT), MRT package.json (`@tanstack/react-table 8.20.6`, v3.2.1), https://www.material-react-table.com/docs/getting-started/install, https://www.material-react-table.com/docs/guides/localization (38 locales), https://www.material-react-table.com/docs/examples/export-csv ("does not have a data exporting feature built in"), https://www.material-react-table.com/docs/guides/customize-components, https://ui.shadcn.com/docs/components/data-table (guide, "TanStack Table v9", Base UI / React Aria / Radix UI tabs); licenses via `gh api repos/<r>/license`: all MIT.
- Spec 1.6.4 says `useShadcnTable` sits over `useReactTable`; on the v9 code it builds the hook with `tableFeatures()` and `createTableHook()` (`hooks/stTableHook.tsx`), so the guide says that.
- Spec 1.2 says the demo is `<ExampleSnippet>`; `examples/basic.mdx` renders `<BasicExample />`, so the Introduction uses that (1.6.4 wording).
- Whole `content/docs` on this branch: 105 pages; description outside 120 to 155: 85, duplicates: 2 (`examples/column-pinning` = `examples/sticky-header`, `guides/row-pinning` = `guides/row-selection`), under 150 words: 52, typo matches: 10, missing date: 0. The copy milestones bring these to 0; the spec's audit counts (48 under 150 words, other duplicate pairs) were measured with other thresholds.
- `pnpm test docs-e2e` checks only the routes in its PAGE_CHECKS map; the byline and the two new pages have no named check there (`test/docs-e2e/**` is not owned here). The run with the three routes as arguments covers render, hydration and console errors; the byline, sitemap and sidebar link are proven by the curls above.
- Fable review of the two new pages and the Introduction (1.6.4) is the reviewer's step, not run here.
- Pages on `.mdx` are outside `pnpm format` (its glob is js, mjs, ts, tsx, md).

## Attention

- Spec 1.2 Acceptance `curl -s localhost:5351/docs/getting-started/introduction | grep -c 'Updated 20'` prints `2` (byline HTML plus the RSC payload line), never `1`. The release Integration rerun uses `curl -s localhost:5351/docs/getting-started/introduction | grep -o 'Updated 20[0-9-]*</p>' | wc -l` (prints `1`) in its place.
- Spec 2.2 expects docs-e2e to assert the byline and the two new pages; `test/docs-e2e/lib/*` (not owned here) has no check for `/docs/getting-started/comparison`, `/docs/guides/tanstack-table-with-shadcn-ui` or the byline, so CI does not guard them yet. A later milestone that owns `test/docs-e2e/**` adds them.
- The sidebar Changelog entry in `content/docs/meta.json` carries the fumadocs `external:` prefix, so it stays out of the previous/next footer (the last docs page no longer gets a Next card pointing at GitHub). Revert by dropping the prefix.
