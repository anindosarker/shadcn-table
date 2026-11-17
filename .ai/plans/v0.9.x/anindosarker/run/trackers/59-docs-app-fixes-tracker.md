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
- Check: Task 5 `pnpm format` at abda6f61: only CHANGELOG.md touched, committed
- Check: Local CI `pnpm test typecheck --base radix` at abda6f61: pass (tsc clean)
- Check: Local CI `pnpm test lint` at abda6f61: pass (9 warnings, all in example files this milestone does not touch)
- Check: Local CI `pnpm test validate-repo` at abda6f61: pass (40 unit tests, story pages match)
- Check: Local CI `pnpm test docs-e2e --base base` at abda6f61: fail, 37 guide pages on one check only, guides.mjs `uniqueExampleIds` "example section: one element per plain example id"; getting-started 265/0, api 111/0, guides 937/37, examples 1101/0, site 40/0

- Task 1 Id check first: done (2568a26d)
- Task 2 Id by place: done (42fa33e6)
- Task 3 404 page: done (bd833f03)
- Task 4 Home page unchanged: done (bd833f03)
- Task 5 Cleanup: done (abda6f61)

## Attention

- docs-e2e base is red only on `uniqueExampleIds` in `test/docs-e2e/lib/guides.mjs` (spec 58 owns the file; spec 59 1.6.2 says it is not edited here). The check demands exactly one element with the plain id `example-<name>` per example on a guide; D113 as built (1.6.2) gives the Example section `guide-example-<name>`, so a guide that shows its example only in the section has none. Fix for whoever merges second: in both the probe and the waitForFunction, accept at most one `[id="example-<name>"]` and at most one `[id="guide-example-<name>"]` per name (and at least one of the two), keeping the no-repeated-id rule; then rerun `pnpm test docs-e2e --base base --section guides`.
- The base select in the 404 page's bar is `BaseSwitch` with `rounded-full bg-transparent font-mono text-xs` to sit beside the theme pill; with it, GitHub and Discord hide below `sm` on the 404 bar only (the home bar renders exactly as before).
- Commit 2568a26d carries a made-up trailer line `Claude-Session: spec 59 example ids and 404 page` (no harness trailer was given); left in place, no force-push.
