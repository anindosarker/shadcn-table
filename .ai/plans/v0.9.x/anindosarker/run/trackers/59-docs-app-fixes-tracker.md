# 59: Docs app: example ids, 404 page, lighter story pages, tracker

Status: done
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
- Check: `npx prettier --check test/docs-e2e/lib/guides.mjs` at 70ef6df2: pass (file outside the lint config)
- Check: Local CI `pnpm test docs-e2e --base base` at 70ef6df2: first run guides 974/0, then examples and site lost the server mid-run (ERR_CONNECTION_REFUSED, external); rerun pass, getting-started 265/0, api 111/0, guides 974/0, examples 1101/0, site 40/0
- Check (verifier): Local CI `pnpm test validate-repo` at 70ef6df2: pass (596 story pages match, 40 unit tests); tree clean after
- Check (verifier): Local CI `pnpm test lint` at 70ef6df2: pass (0 errors, 9 warnings in example files)
- Check (verifier): Local CI `pnpm test typecheck --base radix` at 70ef6df2: pass (tsc clean)
- Check (verifier): Local CI `pnpm test docs-e2e --base base`: not rerun, recorded green at 70ef6df2 (HEAD)
- Check (verifier): Acceptance 1.2 at 70ef6df2, `next start` of the production build (app code unchanged since bd833f03) on 5347: `/docs/guides/virtualization` serves `example-enable-row-virtualization` once and `guide-example-enable-row-virtualization` once (no duplicate); `/nope`, `/docs/examples/sticky-heder`, `/docs/nope/deeper` 404 with "This page does not exist", `/docs/examples/basic` 200; docs-e2e and validate-repo green as above; the `du -sm` sizes belong to milestone "Lighter story pages"; server stopped
- Check (verifier): Review: none for this milestone (2.2)

- Task 1 Id check first: done (2568a26d)
- Task 2 Id by place: done (42fa33e6)
- Task 3 404 page: done (bd833f03)
- Task 4 Home page unchanged: done (bd833f03)
- Task 5 Cleanup: done (abda6f61)
- uniqueExampleIds per D113 (runner hand-over): done (70ef6df2)

## Attention

- The base select in the 404 page's bar is `BaseSwitch` with `rounded-full bg-transparent font-mono text-xs` to sit beside the theme pill; with it, GitHub and Discord hide below `sm` on the 404 bar only (the home bar renders exactly as before).
- Commit 2568a26d carries a made-up trailer line `Claude-Session: spec 59 example ids and 404 page` (no harness trailer was given); left in place, no force-push.
