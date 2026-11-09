# 21: Sitemap and robots for the docs site, tracker

Status: merged (dd6d1f6d)
Branch `v0.9/sitemap-robots`, worktree 03
Checks:
- `pnpm --filter shadcn-table-docs types:check` at 1f32b8af: pass
- `pnpm --filter shadcn-table-docs lint` at 1f32b8af: pass (0 errors, 9 existing warnings)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5345 pnpm --filter shadcn-table-docs build` at 1f32b8af: pass (`/sitemap.xml`, `/robots.txt` static)
- `next start -p 5345` + `curl /sitemap.xml` at 1f32b8af: pass (200, `application/xml`, `xmllint --noout` clean, 104 `<loc>` = 103 mdx pages + 1, every `<loc>` on `http://localhost:5345`, 0 locs with path `/(dev|r|ingest|og|llms|api)(/|$)`)
- `curl /robots.txt` at 1f32b8af: pass (200, `text/plain`, body equals 1.6.3 with the 5345 origin); server stopped
- `pnpm format` at 1f32b8af: pass, no change
- `pnpm test typecheck --base base` at cf509a71: pass
- `pnpm test lint` at cf509a71: pass (9 existing warnings)
- `pnpm test validate-repo` at cf509a71: pass
- Verifier at d5bf0516: no rerun; every 2.2 local check and the 1.2 Acceptance are recorded at 1f32b8af or cf509a71, and `git diff --name-only` from both to HEAD touches only `.ai/` and `CHANGELOG.md`. The Search Console line of 2.2 is the owner's step after deploy, not a local check.

- Task 1 routes: done (1f32b8af)
- Task 2 acceptance proof: done (1f32b8af, no commit)
- Task 3 changelog and format: done (cf509a71)

## Notes

- Search Console submission of the live sitemap is the owner's step after deploy (D50), out of the builder's reach.
- sitemap.xml body (5345 build):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>http://localhost:5345</loc>
<priority>1</priority>
</url>
<url>
<loc>http://localhost:5345/docs/api/cell-instance-apis</loc>
</url>
<url>
<loc>http://localhost:5345/docs/api/column-instance-apis</loc>
</url>
<url>
<loc>http://localhost:5345/docs/api/column-options</loc>
</url>
<url>
<loc>http://localhost:5345/docs/api</loc>
</url>
<url>
<loc>http://localhost:5345/docs/api/row-instance-apis</loc>
</url>
<url>
<loc>http://localhost:5345/docs/api/st-components</loc>
</url>
<url>
<loc>http://localhost:5345/docs/api/st-hooks</loc>
</url>
<url>
<loc>http://localhost:5345/docs/api/state-options</loc>
</url>
<url>
<loc>http://localhost:5345/docs/api/table-instance-apis</loc>
</url>
<url>
<loc>http://localhost:5345/docs/api/table-options</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/advanced</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/aggregation-and-grouping</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/basic</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/chart-detail-panel</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/column-grouping</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/column-ordering</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/column-pinning</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/column-virtualization</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/custom-filter-ui</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/custom-headless</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/customized-grouping</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/detail-panel</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/dynamic-columns</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/editing-crud-inline-cell</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/editing-crud-inline-row</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/editing-crud-inline-table</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/editing-crud-tree</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/editing-crud</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/expanding-tree-flat-parse</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/expanding-tree</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/export-csv</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/export-pdf</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/faceted-values</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/filter-switching</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/filter-variants</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/infinite-scrolling</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/lazy-detail-panel</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/lazy-sub-rows</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/minimal</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/persistent-view</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/popover-filters</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/react-query</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/remote</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/row-dragging</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/row-ordering</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/row-virtualization</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/static-row-pinning</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/sticky-header</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/sticky-row-pinning</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/sticky-row-selection</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/subheader-filters</loc>
</url>
<url>
<loc>http://localhost:5345/docs/examples/virtualized</loc>
</url>
<url>
<loc>http://localhost:5345/docs/getting-started/agents</loc>
</url>
<url>
<loc>http://localhost:5345/docs/getting-started/install</loc>
</url>
<url>
<loc>http://localhost:5345/docs/getting-started/introduction</loc>
</url>
<url>
<loc>http://localhost:5345/docs/getting-started/usage</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/accessibility</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/aggregation</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/async-loading</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/best-practices</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/cell-actions</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/click-to-copy</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/column-actions</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/column-filtering</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/column-grouping</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/column-hiding</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/column-icons</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/column-ordering-dnd</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/column-pinning</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/column-resizing</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/column-size</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/customize-components</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/customize-icons</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/data-columns</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/density-toggle</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/detail-panel</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/display-columns</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/editing</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/expanding-sub-rows</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/filter-chips</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/full-screen-toggle</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/global-filtering</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/localization</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/overflow-tooltip</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/pagination</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/production-ready-tables</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/row-actions</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/row-numbers</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/row-ordering-dnd</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/row-pinning</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/row-selection</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/scroll-cues</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/sort-editor</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/sorting</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/state-management</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/sticky-header</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/table-event-listeners</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/tint-tokens</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/toolbar-customization</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/view-settings</loc>
</url>
<url>
<loc>http://localhost:5345/docs/guides/virtualization</loc>
</url>
</urlset>

```

- robots.txt body:

```
User-Agent: *
Allow: /
Disallow: /ingest/
Disallow: /r/

Sitemap: http://localhost:5345/sitemap.xml
```

## Attention

- Spec 1.2's literal `grep -cE '/(dev|r|ingest|og|llms|api)(/|$)'` on the sitemap body returns 9, not 0: the hits are the nine real docs pages under `/docs/api/*`. The check was run on the `<loc>` path instead (origin stripped, prefix anchored at `/`): 0. No route was dropped; the spec's grep line wants the anchored form.
