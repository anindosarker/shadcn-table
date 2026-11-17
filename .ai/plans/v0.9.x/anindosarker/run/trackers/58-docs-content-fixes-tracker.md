# 58: Guide placement, Basic steps and three page names, tracker

Status: running
Branch `v0.9/docs-content-fixes`, worktree 03
Checks:
- Check: D122 hotfix on branch point, `git merge-base --is-ancestor 77a4a0c2 origin/v0.9/docs-layout` at d9bed58c: pass
- Check: tables once, `<GuideExamples>` and example tags in async-loading, pagination, scroll-cues, click-to-copy at d9bed58c: pass (one copy each; the other tables show other examples)
- Check: D130 merged (d9bed58c, merge 55); production-ready-tables Example section already first h2 above the guide's text; per 1.3 nothing moves there
- Check: placement, first `## ` heading of 16 guides is `## Example` right after the first paragraph (line 6) at c1cd9e7b: pass
- Check: `git diff origin/v0.9/docs-layout --color-moved=zebra -- apps/shadcn-table-docs/content/docs/guides` at c1cd9e7b: pass (moved lines only, 0 plain added or removed)
- Check: Task 3 greps (old addresses and titles in content, lib, test/docs-e2e; old storybook-map keys) at b897e634: pass (print nothing)
- Check: `git diff origin/v0.9/docs-layout --stat -- apps/shadcn-table-docs/examples apps/shadcn-table-docs/registry.json packages/shadcn-table/registry.json tools/registry` at b897e634: pass; at 0dc11326 registry.json shows 12 title lines (see Attention)
- Check: example frontmatter `title` diff at b897e634: pass (3 title lines)
- Check: production build `pnpm --filter shadcn-table-docs build` at 31e6fee7 (content equal to 0dc11326): pass
- Check: `curl -sI` /docs/examples/react-query, editing-crud-inline-row, virtualized on `next start -p 5340` at 0dc11326: pass (308, location the new address)
- Check: new pages h1, `<title>`, breadcrumb, playground title, Storybook button story id, example picker list (Playwright, port 5340) at 0dc11326: pass
- Check: `pnpm test typecheck --base radix` at 0dc11326: pass
- Check: `pnpm test lint` at 0dc11326: pass (0 errors, 9 warnings)
- Check: `pnpm test validate-repo` at 0dc11326: pass
- Check: `pnpm test docs-e2e --base base --url http://localhost:5340` (own production build of 0dc11326) at 0dc11326: pass (api 111, examples 1105, getting-started 265, guides 1020; 0 failed)
- Check: `pnpm test docs-e2e --base radix --url http://localhost:5340` at 0dc11326: pass (same counts, 0 failed)
- Check: `pnpm test docs-e2e --base aria --url http://localhost:5340` at 0dc11326: pass (same counts, 0 failed)
- Check: `pnpm test storybook-static --base base` at 0dc11326: pass
- Check: server on 5340 stopped: pass

Task 5 Basic steps, production build, port 5340, labels as shown on screen (no label corrected):
- base: step 1 header `First Name` opens the column menu, item `Sort ascending`, rows Jane, Joe, John, Joshua, Kevin; step 2 toolbar button `Filter` (shown "+ Filter"), picker rows First Name, Last Name, Address, City, `State`, field placeholder `Filter by State`, `Nebraska` leaves 2 rows (Joshua, Kevin); step 3 chip `State fuzzy: Nebraska` opens a popup with `Remove filter`, 5 rows return; step 4 `Show/Hide search` button, field placeholder `Search`, `Ohio` leaves 1 row (Jane)
- radix: same labels and results as base
- aria: same labels and results as base

- Task 1 start state: done (d9bed58c)
- Task 2 placement: done (c1cd9e7b)
- Task 3 page names: done (b897e634)
- Task 4 nothing else renamed: done (b897e634)
- Task 5 Basic steps: done (412d69a1)
- Task 7 cleanup: done (0dc11326)

## Attention
- registry.json is generated from the example page frontmatter (tools/registry/examples.mjs:181), so the three items `example-react-query-*`, `example-editing-crud-row-*`, `example-virtualized-*` keep their names but carry the new titles (12 lines). Task 4's "registry.json diff prints nothing" cannot hold with a fresh generator; committed the regenerated file (validate-repo registry-fresh needs it). Names and hosted paths are unchanged (P7).
- Link texts "React Query" (async-loading :8, :10; column-filtering :355; toolbar-customization :225) name the library, not the page title, and stay; their addresses follow. "React-Query Example" (advanced.mdx :9) was taken as the old title and became "Server-Side Pagination Example".
- production-ready-tables keeps its intro (paragraph ending "You need four pieces:", the list, the diagram, one line) above the Example section, as 1.3 says; moving the section after the first paragraph would cut the sentence from its list. The guides.mjs placement check expects 4 intro blocks there and 0 on full-screen-toggle.
