# 53: Footer link and square corners, tracker

Status: built
Branch `v0.9/footer-link-square-corners`, worktree 05
Checks:
- `pnpm --filter shadcn-table-docs types:check` and eslint on footer.tsx at 99a3fa84: pass
- `pnpm --filter shadcn-table-docs types:check` and eslint on agent-bar.tsx, inline-code.tsx at 0269c568: pass
- `pnpm --filter shadcn-table-docs build`, then `next start` on 5360, Playwright probe at d8571875: footer Storybook href is `https://storybook.shadcn-table.com/<base>/` for base, radix and aria; footer reads "Get Started"; border-radius 0px on the /docs/getting-started/install tab frames and panels, code block figure, copy chip and its button, agent bar and its buttons, /docs/api/table-options prop inline code; /docs/examples/basic table frame 8px; server stopped: pass
- `pnpm test typecheck --base radix` at 4ecc0fec: pass
- `pnpm test lint` at 4ecc0fec: pass (0 errors, 9 warnings, none in milestone files)
- `pnpm test docs-e2e --base base` at 4ecc0fec: pass (110 pages, examples 941 passed, 0 failed)

- Task 1 footer link by base and Get Started label: done, 99a3fa84
- Task 2 square corners: done, d8571875
- Task 3 cleanup: done, 4ecc0fec
