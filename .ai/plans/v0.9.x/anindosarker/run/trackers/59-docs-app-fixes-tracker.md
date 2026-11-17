# 59: Docs app: example ids, 404 page, lighter story pages, tracker

Status: running
Branch `v0.9/example-ids-404-page`, worktree 07
Checks:
- Check: Task 1 id check on the code before the fix, `pnpm test docs-e2e --base base --url <next start of d9bed58c + site.mjs> /sitemap.xml` at 2568a26d: fail as intended; served HTML repeats an example id on column-filtering, column-grouping, column-ordering-dnd, detail-panel, expanding-sub-rows, overflow-tooltip, row-ordering-dnd, row-pinning, virtualization (async-loading, pagination, scroll-cues already mount two different examples)
- Check: Task 2 `pnpm test docs-e2e --base base --url <next start> /sitemap.xml` at 42fa33e6: pass
- Check: Task 2 `curl -s <next start>/docs/guides/virtualization | grep -o 'id="[a-z-]*example-enable-row-virtualization[^"]*"' | sort | uniq -d` at 42fa33e6: prints nothing (one `example-`, one `guide-example-`)
- Check: Task 2 `grep -n "idMounts\|subscribeIds" apps/shadcn-table-docs/components/example-playground.tsx` at 42fa33e6: prints nothing
- Check: Task 2 `/docs/examples/basic#example-basic` in Chromium at 42fa33e6: scrolls to the example (scrollY 509, panel top 96 px)
- Check: Task 3 `curl -w %{http_code}` of `/nope`, `/docs/examples/sticky-heder`, `/docs/nope/deeper` at bd833f03: 404 each
- Check: Task 3 `pnpm test docs-e2e --base base --url <next start> --section site` at bd833f03: pass (40 checks)
- Check: Task 3 screenshots `reference/d121-404-page/404-{dark,light}-{desktop,390}.png` at bd833f03: taken
- Check: Task 4 captures of `/` before (42fa33e6) and after (bd833f03), light and dark, 1440 and 390 px: header markup and header pixels identical; whole-page pixel diff within the noise of two captures of the same build (hero animation); server stopped

- Task 1 Id check first: done (2568a26d)
- Task 2 Id by place: done (42fa33e6)
- Task 3 404 page: done (bd833f03)
- Task 4 Home page unchanged: done (bd833f03)
