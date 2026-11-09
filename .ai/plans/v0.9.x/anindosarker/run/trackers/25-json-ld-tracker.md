# 25: JSON-LD structured data, tracker

Status: running
Branch `v0.9/json-ld`, worktree `shadcn-react-table.worktrees/03`
Checks:
- `pnpm --filter shadcn-table-docs types:check` at 4116b792: pass
- `pnpm --filter shadcn-table-docs types:check` at c003c0ef: pass
- `pnpm --filter shadcn-table-docs lint` at c003c0ef: pass (0 errors, 9 warnings, none in the owned files)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5344 pnpm --filter shadcn-table-docs build` at c003c0ef: pass
- Acceptance curls of 1.2 on `next start -p 5344` at c003c0ef: pass (Notes)

- Task 1 JsonLd component and builders: done (4116b792)
- Task 2 page wiring: done (c003c0ef)
- Task 3 Acceptance proof on port 5344: done (c003c0ef)

## Notes

- `/` type list: `WebSite,SoftwareSourceCode`.
- `/docs/getting-started/introduction` type list: `TechArticle,BreadcrumbList`; `itemListElement` length 3: `http://localhost:5344/docs`, `http://localhost:5344/docs/getting-started/introduction`, `http://localhost:5344/docs/getting-started/introduction`. The section item is not `.../docs/getting-started`: the folder has no index page (that URL answers 307), so it takes the section's first page, as 1.2 allows.
- `/docs/api/table-options` (section with an index): `TechArticle,BreadcrumbList`, items `.../docs`, `.../docs/api`, `.../docs/api/table-options`.
- `breadcrumbJsonLd` resolves the path with `findPath` from `fumadocs-core/page-tree` and passes it to `getBreadcrumbItemsFromPath` (what `getBreadcrumbItems` does internally, and what `components/docs-breadcrumb.tsx` calls), so the folder nodes are at hand for the first-page fallback without a second tree search.
- Rich Results test on the deployed pages is owner-side after deploy (D54), outside this run.
