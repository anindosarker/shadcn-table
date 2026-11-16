# 53: Example row numbers, tracker

Status: merged (7a80ce07)
Branch `v0.9/example-row-numbers`, worktree 03
Checks:
- `pnpm --filter shadcn-table-docs types:check` at ddc97751: pass
- Task 2 check, `pnpm --filter shadcn-table-docs build` + `next start -p 5341` at cd581c29 and again at 6fc50cfa: pass. `/docs/examples/basic` first row `1. Basic`, labels `Featured (5)` to `Format previews (6)`, last row `48.` of 48 Examples rows; heading `Basic Example`, title `Basic Example | shadcn-table`, no number in the page body; `/docs/guides/column-pinning`, `/docs/api`, `/docs/getting-started/introduction`: 0 numbered rows, 0 counted labels; server stopped
- Judge captures, production build at 6fc50cfa (1440 px, sidebar): `reference/docs-layout/captures/new-numbers-examples-sidebar-top.png`, `new-numbers-examples-sidebar-mid.png`, `new-numbers-examples-sidebar-end.png` (pair with `ref-exb-sidebar-top.png`, `ref-exb-sidebar-midscroll-stuck.png`); `new-numbers-guides-column-pinning-sidebar.png`, `new-numbers-api-sidebar.png`, `new-numbers-getting-started-introduction-sidebar.png`
- Stuck label after the `useStuckLabel` fix, production build at 6fc50cfa, Chromium, Firefox, WebKit: no label marked at scroll top or after a page scroll; sidebar scrolled into Editing marks the label and shows the dashed line: `reference/docs-layout/captures/new-numbers-stuck-label-chromium.png`, `new-numbers-stuck-label-firefox.png`, `new-numbers-stuck-label-webkit.png`: pass; Chromium client navigation Examples to Guides leaves no `data-stuck`: pass
- `pnpm format` at 6fc50cfa: no diff
- `pnpm test typecheck --base radix` at 6fc50cfa: pass (tsc clean)
- `pnpm test lint` at 6fc50cfa: pass (0 errors, 9 warnings)
- `pnpm test validate-repo` at 6fc50cfa: pass (40 unit tests, registry fresh, no tracked file changed)
- `pnpm test docs-e2e --base base` at 6fc50cfa: pass (110 pages; getting-started 262, api 111, guides 705, examples 941 passed, 0 failed); server stopped. Bases radix and aria left to the verifier
- Verifier, `pnpm --filter shadcn-table-docs build` at 6fc50cfa from a clean tree: pass; served by `next start -p 5342` for the three lines below, server stopped
- Verifier, `pnpm test docs-e2e --base radix --url http://localhost:5342` at 6fc50cfa: pass (110 pages; getting-started 262, api 111, guides 705, examples 941 passed, 0 failed)
- Verifier, `pnpm test docs-e2e --base aria --url http://localhost:5342` at 6fc50cfa: pass (110 pages; getting-started 262, api 111, guides 705, examples 941 passed, 0 failed)
- Verifier, Acceptance 1.2 (numbers) rerun at 6fc50cfa, Chromium 1440 px: `/docs/examples/basic` 48 numbered rows `1. Basic` to `48.`, 12 counted labels `Featured (5)` to `Format previews (6)` summing to 48, heading `Basic Example`, title `Basic Example | shadcn-table`; Guides, API, Get Started pages: 0 numbered rows, 0 counted labels: pass. Judge captures as recorded above; Local CI line green (typecheck, lint, docs-e2e base by the builder)
- Verifier: `git merge-tree --write-tree HEAD origin/v0.9/docs-layout` (2a509c87) exits 0, no conflict
- Verifier: tsc, lint, validate-repo, docs-e2e base not rerun (recorded at HEAD 6fc50cfa)

- Task 1 row number and group count helpers: ddc97751
- Task 2 rows and labels show them: cd581c29
- Review item, sticky label scroll filter and recheck on a new item: 9ef26ad8
- Task 3 cleanup: 6fc50cfa

## Attention
- Commit ddc97751 carries a stray trailer line `Claude-Session: example-row-numbers` (no trailer was given for this run); left as is, since P2 forbids a force-push.
- The "Format previews" rows (43 to 48) are numbered and counted like every other Examples row; spec 54 removes them, and the numbers then end at 42.
