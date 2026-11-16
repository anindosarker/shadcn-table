# 53: Footer link and square corners, tracker

Status: merged (702fa247)
Branch `v0.9/footer-link-square-corners`, worktree 05
Checks:
- `pnpm --filter shadcn-table-docs types:check` and eslint on footer.tsx at 99a3fa84: pass
- `pnpm --filter shadcn-table-docs types:check` and eslint on agent-bar.tsx, inline-code.tsx at 0269c568: pass
- `pnpm --filter shadcn-table-docs build`, then `next start` on 5360, Playwright probe at d8571875: footer Storybook href is `https://storybook.shadcn-table.com/<base>/` for base, radix and aria; footer reads "Get Started"; border-radius 0px on the /docs/getting-started/install tab frames and panels, code block figure, copy chip and its button, agent bar and its buttons, /docs/api/table-options prop inline code; /docs/examples/basic table frame 8px; server stopped: pass
- `pnpm test typecheck --base radix` at 4ecc0fec: pass
- `pnpm test lint` at 4ecc0fec: pass (0 errors, 9 warnings, none in milestone files)
- `pnpm test docs-e2e --base base` at 4ecc0fec: pass (110 pages, examples 941 passed, 0 failed)
- `pnpm --filter shadcn-table-docs build` (2.2): recorded at d8571875; only `CHANGELOG.md` changed since, not rerun (verifier)
- `pnpm test validate-repo` at 4ecc0fec (verifier): pass (40 unit tests, registry valid and fresh, no tracked file changed)
- `pnpm test docs-e2e --base radix` at 4ecc0fec (verifier): pass (110 pages; getting-started 262, api 111, guides 705, examples 941 passed, 0 failed); server stopped
- `pnpm test docs-e2e --base aria` at 4ecc0fec (verifier): pass (110 pages; getting-started 262, api 111, guides 705, examples 941 passed, 0 failed); server stopped
- Acceptance 1.2 at 4ecc0fec (verifier): pass. Production build served by `next start` on 5346 (stopped), 24 frame captures (4 pages x 1440/920/390 x open/hidden) in the verifier scratchpad, not committed (the captures folder belongs to milestone "Preview lands on review"); spot judge of `examples-basic-1440-open` against `ref-examples-basic-1440-open.png` (same tab row and labels minus EX A/EX B, no line between top bar and row, dashed rule below, hide button first, no heading row, flush groups), `guides-column-pinning-920-hidden` and `getting-started-introduction-390-open` (drawer): frame unchanged by this milestone. Merge-tree of HEAD with `origin/v0.9/docs-layout` (f36ff8ec) is clean. The Examples numbers part belongs to milestone "Example row numbers". Local CI line of this milestone all green

- Task 1 footer link by base and Get Started label: done, 99a3fa84
- Task 2 square corners: done, d8571875
- Task 3 cleanup: done, 4ecc0fec
