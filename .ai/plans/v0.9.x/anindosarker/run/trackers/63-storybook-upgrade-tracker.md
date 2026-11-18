# 63: Storybook upgrade and the docs branch catch-up, tracker

Status: done (8262cd41)
Branch `v0.9/storybook-upgrade-planned`, worktree 08
Checks:
- Baseline `pnpm test storybook-tests --base base|radix|aria` at 57ece654: pass, 654 each
- Baseline `pnpm test storybook-static --base base|radix|aria` at 57ece654: pass (reset pass) each
- Baseline `pnpm test docs-e2e --base base|radix|aria` in worktree 09 at 6ec25203: pass, 116 pages, 2561 checks each
- Baseline captures (`reference/d123-storybook-upgrade/tools/capture.cjs`, `capture-docs.cjs`) rerun on the same builds at 57ece654 / 6ec25203: 69/69 and 18/18 equal (noise floor zero)
- `pnpm ls storybook -r` at 3f35b7a4: one version, storybook 10.6.7 (shadcn-table; the docs app has no Storybook dependency on claude/review)
- `pnpm ls --filter shadcn-table --depth 0 | grep storybook` at 3f35b7a4: every @storybook/* 10.6.7, @storybook/icons 2.2.0, storybook-dark-mode 5.0.0
- `npx storybook doctor` (packages/shadcn-table) at 3f35b7a4: "Checking the health of your Storybook.. Your Storybook project looks good! Done", no error
- `pnpm why glob -r` at 3f35b7a4: glob 13.0.6 via @storybook/react-vite 10.6.7 > @joshwooding/vite-plugin-react-docgen-typescript 0.7.0 (in audit.md)
- `pnpm test typecheck --base base|radix|aria` at 3f35b7a4: pass, tsc clean each
- `pnpm test lint` at 3f35b7a4: pass, 9 warnings (all in apps/shadcn-table-docs, files this milestone does not touch)
- `pnpm test storybook-tests --base base` at 4d441d7b (after the merge of origin/claude/review): pass, 654
- `pnpm test storybook-tests --base aria` at 4d441d7b: pass, 654
- `pnpm test storybook-tests --base radix` at 4d441d7b: 1 failed under load average near 40, rerun pass, 654
- vitest json-reporter runs per base at 4d441d7b (test names): names equal the baseline on base, radix, aria; aria and radix runs had the load flakes ClickToCopy "Click Copies Value" and FilterChips "Range Editor Inputs Fit And Fill Date Time" (94 s timeout), both green in the runs above
- `pnpm test storybook-static --base base|radix|aria` at 4d441d7b: pass (reset pass) each; story ids equal the baseline (diff empty), 654 each
- `tools/capture.cjs` on the three static builds at 4d441d7b (port 5341) against captures/before: 69 compared, 0 differ; dark mode toggle and base tool work on each base
- Task 5 preview: no GitHub deployment or status for 3f35b7a4 or 4d441d7b (`gh api .../deployments?sha=`, `.../status`); local stand-in: the capture run above, fixed set base 20/20, radix 20/20, aria 20/20 equal, shell 3/3 each
- `pnpm format` at 4d441d7b + changelog: no change besides CHANGELOG.md
- `pnpm test validate-repo` at e6baba6f: pass, 40 unit tests
- `pnpm test lint` at e6baba6f: pass, 9 warnings (apps/shadcn-table-docs, untouched)
- `pnpm test typecheck --base base|radix|aria` at e6baba6f: pass, tsc clean each
- Verifier (2.2) at e6baba6f: every Local CI check recorded green at HEAD (typecheck x3, lint, validate-repo) or at 4d441d7b, whose diff to HEAD is CHANGELOG.md only (storybook-tests x3, storybook-static x3); `test/.out` records confirm sha and status; no heavy check rerun (owner load rule)
- Verifier Acceptance (1.2) rerun at e6baba6f against the baseline: story ids of `storybook-static/<base>/index.json` vs `lists/before`: base 654/654, radix 654/654, aria 654/654, diff empty each; test names `lists/after` vs `lists/before`: equal on base, radix, aria (aria differs only in the [passed]/[failed] status of the two load flakes, green in the recorded `pnpm test storybook-tests` runs); captures 69/69 equal (compare.md); docs-e2e is the catch-up milestone's (docs branch)
- Verifier: worktree 08 clean (`git status --short` empty); no server started

- Task 1 Baseline: done (plan files, reference/d123-storybook-upgrade/baseline.md)
- Task 2 Audit: done (plan files, reference/d123-storybook-upgrade/audit.md)
- Task 3 Upgrade: done (3f35b7a4)
- Task 4 Compare: done (plan files, reference/d123-storybook-upgrade/compare.md, captures/after, lists/after)
- Task 5 Preview: done, local stand-in (no preview deployment; see Attention)
- Task 6 Cleanup: done (e6baba6f)

## Attention
- glob advisory GHSA-3g3m-2fjr-6pw4 (Storybook issue 37409) not overridden: the override would go in the root package.json (not owned by this milestone) and force @joshwooding/vite-plugin-react-docgen-typescript 0.9.1 outside @storybook/react-vite's ^0.7.0; dev-only path, nothing shipped. Revert by adding the override if the owner wants it now.
- No hosting preview exists for the branch (no deployment or commit status on 3f35b7a4 or 4d441d7b); the deployed Storybook check of Task 5 used the three local static builds on port 5341 as the stand-in: the fixed set and the shell equal the baseline on base, radix and aria.
- Verifier did not rerun the heavy Acceptance commands at e6baba6f: each was recorded green at e6baba6f or at 4d441d7b (diff to HEAD: CHANGELOG.md only), and the owner's load note rules out repeats. origin/claude/review has moved to 95ed1e46 (spec 61/62 virtualization and RowPinning story, CHANGELOG.md): the merge into claude/review will meet a CHANGELOG.md block conflict (P9: keep both) and runs on code not covered by these runs; CI on the release PR is the second run.
