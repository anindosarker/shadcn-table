# Docs layout decisions recheck, 2026-11-16

L1 to L12 and LQ1 to LQ21 checked against `origin/claude/review` at `0a51c6f8`, compared with the preview branch `v0.9/preview-docs-examples` at `cd43cf4d`. The check is read-only, done with `git show` and `git merge-tree`. Paths are under `apps/shadcn-table-docs/` unless they start with another folder. Release decisions D<n> and cards Q<n> come from `.ai/plans/v0.9.x/anindosarker/decisions.md` and `queue.md` on review. There is no release folder newer than v0.9.x.

## Summary

| id | status | note |
|---|---|---|
| L1 | preview only | `bb5fa1b6`. Review still has api before examples (`content/docs/meta.json:4-7`, `lib/layout.shared.tsx:9-12`, `nav.tsx:12-15`). Getting Started now also has `comparison` (D71). |
| L2 | preview only | `766458b3` to `e702398d`, `cd43cf4d`. Not on review. `page.tsx` conflicts with the review JSON-LD. |
| L3 | not built | The preview spy still writes the pathname (`examples-scroll-spy.tsx:64-67` on `cd43cf4d`). |
| L4 | not built | Review added `components/sidebar-item.tsx` (pathname match, :47). The hash links must go there. |
| L5 | not built | No back-to-top button on the preview or on review. |
| L6 | not built | No `useWindowVirtualizer` on the preview. `@tanstack/react-virtual` 3.11.2 is still a dependency. |
| L7 | stale | Amended by L10. Only L10's form exists on the preview. |
| L8 | preview only | `d74def4d`. Review keeps "Quick Examples" (`examples/meta.json:2`, `lib/routes.ts:106`), the indent rules (`global.css:271-281`) and `ps-5` (`sidebar-subgroup.tsx:35`). |
| L9 | preview only | `11ff81ef`, `9f5a51ef`, `07b5f1eb`, `cd43cf4d`. Review added a top-level Changelog row (D60). Its fit with root sections is not verified. |
| L10 | preview only | `b4def583` to `8949be4c`. The `global.css` sidebar link rule conflicts with review `e1e829c5` (`:264`). |
| L11 | in force | A process rule with no code. Nothing on review contradicts it. |
| L12 | not built (counts stale) | Only the toolbar button and `lib/storybook-map.ts` exist, on the preview. Stories are now 81 files and 652 exports. Release Q4 sends this item to the docs lead. |
| LQ1 | still true | `components/dev-home/v12/footer.tsx:40-41` still uses `storybookUrl.radix`. |
| LQ2 | dropped, holds | `example-playground.tsx:69-71` lists Preview, Code and Both. |
| LQ3 | still true | Lines moved: examples block `routes.ts:106`, Storybook `:393`. |
| LQ4 | still true | `filter-variants` is unchanged on review. Not profiled. |
| LQ5 | preview only | `07b5f1eb`, folded into L9. |
| LQ6 | still true (partly preview) | `agent-bar.tsx:105` `rounded-lg` and `inline-code.tsx:7` `rounded-md` remain. The skeleton exists only on the preview. |
| LQ7 | still true | `sidebar-subgroup.tsx:34-47` still collapses, on review and on the preview. |
| LQ8 | open, scope grew | Stack plus L12 is now 42 + 81 = 123 blocks. Review's per-page canonical and JSON-LD do not change the SEO-neutral argument. |
| LQ9 to LQ20 | follow their L item | LQ9, LQ10, LQ15 to LQ18 are preview only (L1, L2, L7 and L10, L8, L9, L10). LQ11 to LQ14 and LQ20 are not built (L3 to L6, L12). LQ19 is in force (L11). |
| LQ21 | changed | The MDX explainer sentence is gone (`1853327f`, D74). `getRowCanExpand` is now at `:231`. |

Counts:

- Decisions: preview only 6 (L1, L2, L8, L9, L10, plus LQ5 via L9); not built 5 (L3, L4, L5, L6, L12); stale 1 (L7); in force 1 (L11); already on review 0; contradicted 0.
- One release decision contradicts the plan: D45 put the docs restructuring in 0.9.2, but 0.9.2 shipped E9 (D52). 0.9.3 and 0.9.4 shipped without it.

## 1. Branch state

- Heads after `git fetch origin`:
  - `origin/claude/review`: `0a51c6f8` ("docs(plan): v0.9.x Q84 fact").
  - `origin/dev` and `origin/master`: both `7b379866` (merge of PR #138, 2026-11-14).
  - Latest release tag: `v0.9.4`, on `7b379866`.
  - Review is 100 commits ahead of dev.
- Preview branch:
  - `origin/v0.9/preview-docs-examples` is at `cd43cf4d`, unchanged since the handoff.
  - Merge base with review: `873d775c` ("release PR 0.9.2 opened", 2026-11-10).
  - Review is 672 commits ahead of that base. The preview has 24 commits review lacks, 23 of them non-merge.
- Docs app on review since the merge base: 232 files, +5307/-1468. By group:
  - **layout, nav, sidebar:** `app/docs/layout.tsx` (adds an `Item: SidebarItem` override), new `components/sidebar-item.tsx`, `components/sidebar-section.tsx` (exports `SECTION_CLASS`, `SECTION_LABEL_CLASS`, `ITEM_CLASS`), `components/dev-home/v12/nav.tsx` (`IntentLink`), new `components/dev-home/shared/intent-link.tsx`.
  - **examples:**
    - New: `examples/{base,radix,aria}/live-demo/` (D78, D84).
    - Changed: `examples/*/react-query/TS.tsx` (D95), `examples/map.tsx:183,399` (`LiveDemoExample`), `components/example-icons.tsx`.
    - `lib/example-source.ts` (D69, `3cc75fb0`), `lib/example-variants.mjs`, `lib/example-files.mjs`.
  - **content meta:** `content/docs/meta.json` (Changelog external row), `getting-started/meta.json` (adds `comparison`), `guides/meta.json` (adds `tanstack-table-with-shadcn-ui`).
  - **content pages:** 16 MDX files: getting-started x5, the new `comparison.mdx`, `api/st-components.mdx`, examples `detail-panel`, `lazy-detail-panel` and `lazy-sub-rows`, and six guides including the new one.
  - **global.css:** one change. `:264` scopes the sidebar link rule to `a:where(:not([data-external]))` (`e1e829c5`).
  - **lib:** new `structured-data.ts`, `llms.ts`, `posthog-client.ts`, `posthog-options.ts`. Changed: `source.ts` (`searchTitle` schema, `toPlainMarkdown`), `shared.ts` (`siteDescription`), `analytics.ts`, `install.mjs`, `prop-tables/*`.
  - **other:**
    - Library sync: 49 files x3 under `components/ui-{base,radix,aria}`.
    - Prop-table client split: 17 files.
    - SEO and config: `app/layout.tsx`, `app/(home)/page.tsx`, `app/opengraph-image.tsx`, the llms routes, `proxy.ts`, `next.config.mjs`.
    - Build config: `tsconfig.{build,preview,ui-base,ui-aria}.json`, `package.json`, `registry.json`, `app/api/data/*`, `components/json-ld.tsx`, `components/posthog-provider.tsx`.
- Merge check: `git merge-tree --write-tree cd43cf4d origin/claude/review` exits 1 with 4 content conflicts. No throwaway worktree was needed.
  - `content/docs/meta.json`: the preview's `"api"` last versus review's Changelog external row. Keep both.
  - `app/docs/layout.tsx:6-11`: preview imports versus review's `SidebarItem` import and `Item` override.
  - `app/docs/[[...slug]]/page.tsx:21-45`: preview `ExamplesStack` imports and branch versus review `JsonLd` imports and the two `<JsonLd>` lines.
  - `app/global.css:264-271`: the preview's `[role='presentation'] a` scope versus review's `a:where(:not([data-external]))`. They need one combined selector.
  - Auto-merged cleanly: `nav.tsx`, `getting-started/meta.json` (`root: true` plus `comparison`), `guides/meta.json`, `lib/source.ts`.
  - The merged result is not built or type-checked.

## 2. Decisions L1 to L12

- **L1** sets the nav order to Docs, Examples, Guides, API in four places.
  - Status: preview only (`bb5fa1b6`).
  - Review is unchanged: `content/docs/meta.json:4-7`, `lib/layout.shared.tsx:9-12`, `components/dev-home/v12/nav.tsx:12-15`, `footer.tsx:16-19`.
  - Stale detail: Getting Started is now introduction, install, usage, agents, comparison (`getting-started/meta.json:4`, D71).
  - Stale detail: the root has a 5th entry, an external Changelog row (`content/docs/meta.json:8`, D60).
- **L2** makes `/docs/examples` one lazy continuous page with a scroll-spy.
  - Status: preview only (`766458b3`, `091c7e38`, `4c682d59`, `47e3b58e`, `ab924f86`, `e702398d`, `cd43cf4d`).
  - `ae89917d`, which sets pageSize 10, is equivalent to D24 on review ("persistent view example starts at ten rows"). Not verified whether the same lines match.
- **L3** (spy writes `/docs/examples#<slug>`): not built. On `cd43cf4d`, `examples-scroll-spy.tsx:64-67` still calls `replaceState` with the pathname URL.
- **L4** has sidebar example links scroll the stack.
  - Status: not built.
  - Review now renders every sidebar page row through `components/sidebar-item.tsx`. Its active state compares the pathname at `:47`, so the hash-aware active state and href belong in that file.
- **L5** (back-to-top button): not built; nothing matches on the preview or on review.
- **L6** (virtualized stack): not built; no `useWindowVirtualizer` in the preview components.
- **L7** (section row under the header): stale; L10 amended it, and only the L10 form was built.
- **L8** makes groups flush left with 9px labels and titles the section "Examples".
  - Status: preview only (`d74def4d`).
  - Review: `examples/meta.json:2` "Quick Examples", `lib/routes.ts:106` "Quick Examples", indent and guide-line rules at `global.css:271-281`, `sidebar-subgroup.tsx:35` `ps-5`.
- **L9** gives each section its own sidebar.
  - Status: preview only (`11ff81ef`, `9f5a51ef`, `07b5f1eb`, `cd43cf4d`).
  - Review has no `"root"` key in any meta.json and no `sidebar-root-heading.tsx`.
  - New on review: the external Changelog row at the top level of the tree (D60, `0d900176`, `344f739b`, `e1e829c5`). With every section as a root, whether fumadocs still shows a top-level non-folder row is not verified.
- **L10** puts section tabs in the sidebar and search in the header centre.
  - Status: preview only (`b4def583`, `4e26896e`, `449443ce`, `6e0c4da9`, `8949be4c`).
  - The `global.css` rule conflicts with review `e1e829c5`. Both scope the same `#nd-sidebar a` rule.
- **L11** (agents never start preview servers): in force; a process rule with no code.
- **L12** turns stories into docs pages and adds a Storybook link-back addon.
  - Status: not built.
  - On the preview only: the toolbar Storybook button (`0160f596`, `ae316d45`, `64f2cfb5`) and `lib/storybook-map.ts`. Release Q4 says the map has 33 slugs.
  - Review still has 68 `<StorybookLink>` uses in `content/` (68 files). Their removal waits on L12.
  - Stale counts: the stories are 81 files and 652 exports (features 40, fixed-bugs 25, styling 15, Basic 1), not 79 and 594.
  - Release Q4 (`queue.md:303-308`) is the same item. The owner sent it to the docs lead on 2026-11-14. 76 stories in 28 files already carry JSDoc; none has `parameters.docs.description`.
  - D98 renames 11 filtering stories "Subheader" and drops the subheader pin from 10. Generated pages would pick up those names.
- Release decisions that touch these areas:
  - D45 (docs restructuring as 0.9.2) did not happen: D52 made 0.9.2 = E9.
  - D60 and D71 add the comparison page last in Getting Started. D72 moves the TanStack guide last in Fundamentals. D60 adds the sidebar Changelog link. D74 restores the old page wording.
  - E8 (`plan/epics/E8.md`) is still an empty shell for the docs restructuring.
  - No D item covers nav order, examples pages or Storybook links.

## 3. Cards LQ1 to LQ21

- **LQ21:** changed.
  - Still true: `examples/base/enable-detail-panel-conditionally/TS.tsx:50-58` forces `rotate(-90deg)`, and `:61-69` returns null without `address`.
  - Still true in `ST_ExpandButton.tsx`: `disableHoverListener` at `:78`; `disabled` at `:87` for base and radix, `isDisabled` at `:86` for aria. The `enable-detail-panel-conditionally` example is unchanged since the merge base.
  - Line moved: `getRowCanExpand` is at `useST_TableOptions.ts:231`, not `:228`.
  - Story lines still hold: `DetailPanel.stories.tsx:193`, `:240`, `:665`.
  - Fact gone: `content/docs/examples/detail-panel.mdx:7` no longer has the "only for rows that have an address" sentence. D74 (`1853327f`) restored the pre-spec-31 wording, so the page now says nothing about disabled rows.
- **LQ7:** still true. `sidebar-subgroup.tsx:34-47` uses Collapsible and ChevronDown, on review and on the preview.
- **LQ8:** still open. The arguments hold; blocks grow to 123 with L12; review's SEO work changes nothing for the stack (section 5); `perf-report.md` (measured on `e702398d`) was not re-measured.
- **LQ6:** still true for `agent-bar.tsx:105` (`rounded-lg`) and `prop-tables/inline-code.tsx:7` (`rounded-md`, now confirmed).
  - `example-skeleton.tsx` exists only on the preview.
  - The table frame is still rounded on purpose (`ST_TableLayout.tsx:30` `rounded-md`).
  - fumadocs `tabs.js` and `codeblock.js` lines were not verified (node_modules are not in git). The version is unchanged at `@fumadocs/base-ui@16.17.5`.
- **LQ4:** still true; `filter-variants` unchanged since the merge base; not profiled.
- **LQ3:** still true.
  - `lib/routes.ts:11`, examples block `:106`, Storybook entry `:393` (the queue cites `:107` and `:392`).
  - Consumers: `components/table-of-contents-list.tsx:7`, `content/docs/api/index.mdx:5,7`, `examples/index.mdx:10`, `guides/index.mdx:8`.
  - No home-page import of `routes.ts` was found on review.
- **LQ1:** still true (`footer.tsx:40-41` `storybookUrl.radix`). **LQ2:** dropped, still right (3 tabs at `example-playground.tsx:69-71`).
- **LQ5, LQ9 to LQ20:** follow their decision (summary table). LQ5 is `07b5f1eb`; LQ14's numbers were not re-measured; LQ17's lookup fix `cd43cf4d` is preview only.

## 4. Facts in `docs-layout-research.md` that are now wrong

| fact | old | new on review |
|---|---|---|
| Sidebar root (:12) | 4 entries | 4 folders plus an external Changelog row (`content/docs/meta.json:8`) |
| Getting Started (:13) | introduction, install, usage, agents | plus `comparison` (`getting-started/meta.json:4`) |
| `/docs` redirect (:13) | `next.config.mjs:66-77`, temporary | `next.config.mjs:99-101`, permanent. A slash redirect was added at `:93-96` |
| Guides (:16) | 46 pages | +1, `tanstack-table-with-shadcn-ui` (`guides/meta.json:13`). Exact page count not rechecked |
| routes.ts lines (:17, :46) | examples `:107`, Storybook `:392` | `:106`, `:393` |
| `/dev` routes (:25) | `/dev`, `/dev/theme/1-9` | removed (D51) |
| Route handlers (:26) | no sitemap, robots or OG | `app/sitemap.ts`, `app/robots.ts` (D50, before the merge base), `app/opengraph-image.tsx` (D55) |
| proxy (:27) | `proxy.ts:2-21`, no matcher | matcher `['/docs', '/docs/:path*']` at `proxy.ts:35-37` (D66) |
| Example folders (:31) | 117 per base | 118 (`live-demo` added) |
| Example source (:32) | read from `examples/<base>/<name>` | read from generated `examples/.<base>/sources.json` (`lib/example-source.ts:19-36`, D69) |
| Playground modes (:34) | Both is absent from the tab list | Both is listed (`example-playground.tsx:71`) |
| Stories (:41) | 79 files, 594 stories, features 38 | 81 files, 652 exports, features 40 |
| Prior decisions (:68) | "no decision covers nav order, sidebar structure" | D60 (sidebar Changelog link), D71 (comparison placement), D72 (guide placement) |
| Framework (:63) | Next 16.3.8, React 19.3, fumadocs-core 16.17.5, mdx 15.4.7, base-ui 16.17.5 | unchanged |
| Docs example MDX (:33) | 43 files including index | unchanged (43), 42 in `examples/meta.json` |
| StorybookLink (:45) | 68 pages | unchanged (68) |

## 5. SEO on review since the merge base

Each item names its effect on the examples stack.

- **Canonical, D53** (`4476e6e8`): `app/layout.tsx:24` sets `alternates: { canonical: './' }`.
  - Stack: `/docs/examples` gets canonical `/docs/examples`. A `replaceState` URL never changes the server head, and a hash (L3) is never part of a canonical.
  - The current preview spy, which writes the pathname, leaves a client URL whose head names the index. This is harmless because crawlers do not run the spy.
- **Trailing-slash 308, D53:** `next.config.mjs:93-96`. Stack: none; the spy writes slash-less URLs.
- **`/docs` 308, D60:** `next.config.mjs:99-101`. Stack: none.
- **JSON-LD, D54** (`c003c0ef`, `4116b792`):
  - Docs pages: `TechArticle` and `BreadcrumbList` at `app/docs/[[...slug]]/page.tsx:47-48`, built in `lib/structured-data.ts:62-115`.
  - Home: `WebSite` and `SoftwareSourceCode` at `app/(home)/page.tsx:14-15`.
  - Stack: the index emits one TechArticle for itself only, and the stacked blocks emit none. That is consistent with "single pages are the indexed content".
  - Risk with L9: `breadcrumbJsonLd` calls `getBreadcrumbItemsFromPath` without `includeRoot` (`structured-data.ts:87`). Once every section is a root folder, the section crumb likely drops, as the handoff gotcha says for the visible breadcrumb. Not verified by a build.
  - This is also the `page.tsx` merge conflict.
- **Titles and description, D56, D73, D76:**
  - `app/layout.tsx:16` `siteTitle`.
  - `lib/shared.ts` `siteDescription`.
  - `searchTitle` frontmatter: schema in `lib/source.ts`, used at `page.tsx:104`, set at `content/docs/getting-started/comparison.mdx:3`.
  - Stack: none.
- **OG image, D55:** `app/opengraph-image.tsx` (`30c28957`). Home only. **Security headers, D57:** `next.config.mjs:72-85`. Stack: none for either.
- **Markdown and llms, D58** (`c5cb3050`, `38afefa3`):
  - `lib/llms.ts:208-226` builds one llms.txt section per top-level tree node, in tree order.
  - `app/llms.mdx/docs/[[...slug]]/route.ts:18` sets `Vary: Accept`.
  - `toPlainMarkdown` runs in `lib/source.ts`.
  - Stack: L1 reorders the llms.txt sections. With L9 roots the index pages are emitted as children, through `collect`.
  - A Markdown request for `/docs/examples` returns the index MDX only, never the stack.
- **Proxy matcher, D66** (`71cb18bb`): `proxy.ts:35-37`. Stack: none; `replaceState` makes no request.
- **Sitemap and robots, D50:** before the merge base and unchanged since.
  - The sitemap lists `/docs/examples` and every single example page from `source.getPages()`. A hash URL is never in it.

## 6. Examples stack files on review

- `app/docs/[[...slug]]/page.tsx`: JSON-LD (`:22-23`, `:47-48`) and `searchTitle` (`:104`). Conflicts with the preview's stack branch.
- `components/example-playground.tsx`: no change on review since the merge base. Only the preview touched it (`0160f596`, `ae316d45`, `64f2cfb5`).
- `components/mdx/example-snippet.tsx`: no change on review. It still calls `readExampleFiles(name, base)`, the same signature the preview's `lib/load-example-block.tsx` path uses.
- `lib/example-source.ts`: rewritten on review (D69, `3cc75fb0`).
  - It now reads `examples/.<base>/sources.json` and throws on an unknown name (`:44-54`).
  - The preview never edited it, so the merge is clean. Each lazy block fetch now parses the whole per-base JSON on every call, because nothing caches it. Not measured. A re-run of `perf-report.md` should cover it.
- `content/docs/examples/*`: `detail-panel.mdx`, `lazy-detail-panel.mdx`, `lazy-sub-rows.mdx` changed (D74 wording). `meta.json` and `index.mdx` are unchanged on review.
- `examples/*`:
  - `live-demo` is new. It is used on the Introduction (`introduction.mdx:33`) and Usage (`usage.mdx:178`) pages, not in the examples section.
  - `react-query/TS.tsx` changed (D95).
- Example count: examples-section pages unchanged at 42 (43 MDX with the index), so the stack size is the same; example folders 117 to 118 per base.
