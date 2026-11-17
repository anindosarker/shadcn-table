# 63: Storybook upgrade and the docs branch catch-up, tracker

Status: running
Branch `v0.9/storybook-upgrade-planned`, worktree 08
Checks:
- Baseline `pnpm test storybook-tests --base base|radix|aria` at 57ece654: pass, 654 each
- Baseline `pnpm test storybook-static --base base|radix|aria` at 57ece654: pass (reset pass) each
- Baseline `pnpm test docs-e2e --base base|radix|aria` in worktree 09 at 6ec25203: pass, 116 pages, 2561 checks each
- Baseline captures (`reference/d123-storybook-upgrade/tools/capture.cjs`, `capture-docs.cjs`) rerun on the same builds at 57ece654 / 6ec25203: 69/69 and 18/18 equal (noise floor zero)

- Task 1 Baseline: done (plan files, reference/d123-storybook-upgrade/baseline.md)
- Task 2 Audit: done (plan files, reference/d123-storybook-upgrade/audit.md)

## Attention
- glob advisory GHSA-3g3m-2fjr-6pw4 (Storybook issue 37409) not overridden: the override would go in the root package.json (not owned by this milestone) and force @joshwooding/vite-plugin-react-docgen-typescript 0.9.1 outside @storybook/react-vite's ^0.7.0; dev-only path, nothing shipped. Revert by adding the override if the owner wants it now.
