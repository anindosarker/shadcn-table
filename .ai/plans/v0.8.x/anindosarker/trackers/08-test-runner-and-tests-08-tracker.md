# 08: Test runner and tests (08), tracker (D85, D86, D87, D88)

Status: verified
Branch `v0.8/08-test-runner`, worktree `shadcn-react-table.worktrees/01`, no PR (P1, P3)
Checks:
- Check: frozen install, `pnpm install --frozen-lockfile` at 85ec0484: pass
- Check: registry output, `pnpm registry:build` then `git status --porcelain packages/shadcn-table/registry.json packages/shadcn-table/public` empty at 85ec0484: pass
- Check: docs build, `pnpm --filter shadcn-table-docs build` at 85ec0484: pass (apps/shadcn-table-docs/registry.json unchanged)
- Check: tsc radix, `pnpm --filter shadcn-table tsc:radix` at 85ec0484: pass
- Check: tool unit tests, `node --test "tools/**/*.test.mjs"` at 85ec0484: pass (21)
- Check: generated maps, `git status --porcelain apps/shadcn-table-docs/examples/map.tsx` header line only at 85ec0484: pass
- Check: list, `pnpm test --list` at 1fa03217: pass (eight names)
- Check: typecheck, `pnpm test typecheck` at 1fa03217: pass (3 bases)
- Check: lint, `pnpm test lint` at 1fa03217: pass (9 docs warnings)
- Check: validate-repo, `pnpm test validate-repo` at 1fa03217: pass
- Check: storybook-tests (radix), `pnpm test storybook-tests --base radix` at 1fa03217: pass (609 passed)
- Check: changed, `pnpm test --changed --list` names validate-repo at 1fa03217: pass
- Check: docs-e2e (base), `pnpm test docs-e2e --base base` on agent port 5340, `lsof -i :5320` empty, at a1d000e1: pass (5 clusters, 107 pages)
- Check: validate-production, `pnpm test validate-production` against https://www.shadcn-table.com at a1d000e1: pass (http 28/28, docs-e2e 3/3)
- Check: docs-e2e (radix) live, `pnpm test docs-e2e --base radix --url https://www.shadcn-table.com` (run inside validate-production) at a1d000e1: pass
- Check: installation-e2e (fresh), `pnpm test installation-e2e --scenario fresh` (registry on 5341 through REGISTRY_BASE_URL) at 010f7359: pass
- Check: installation-e2e (nextjs-base), `pnpm test installation-e2e --scenario nextjs-base --no-diff` (registry 5340, next dev 5341) at 010f7359: pass
- Check: shared registry, `lsof -i :5310` unchanged (nothing listening before and after) at 010f7359: pass
- Check: references, `git diff --stat origin/claude/review -- "*.png"` renames only at 010f7359: pass
- Check: browser.mjs, `node --check test/installation-e2e/lib/browser.mjs` at 010f7359: pass
- Check: old paths, `grep -rnE "scripts/release|packages/shadcn-table/scripts|packages/shadcn-table/test|page-checks" package.json packages/*/package.json apps/*/package.json packages/shadcn-table/.storybook packages/shadcn-table/vite.config.ts packages/shadcn-table/registry apps/shadcn-table-docs/lib test tools` empty at 7ed6aa90: pass
- Check: all, `pnpm test --all --no-diff` at 7ed6aa90: pass after one rerun (19 of 20 first; storybook-tests (radix) "Dragging Row When Filtered" failed once, `pnpm test storybook-tests --base radix` rerun 609 passed)
- Check: 2.2 moves, `tsc:radix`, `tsc:baseui`, `tsc:aria` and `test:<base>` per base through `pnpm test --all` at 7ed6aa90: pass
- Check: format, `pnpm format` before each commit, `.ai/plans/**/reference/**` reverted: pass
- Check: act, not named by this milestone block: not run (Docker down)
- Check: scope, `git diff --stat 930d8b33..HEAD` touches only Files owned, CHANGELOG.md and the tracker at 2e8967d9: pass (verifier; three comment-only path edits outside the line, `apps/shadcn-table-docs/lib/{example-files,example-pages,example-variants}.mjs`, named by epic 1.6.8, already under Attention)
- Check: library source, `git diff 930d8b33..HEAD -- packages/shadcn-table/registry/` only `registry/*/registry.ts` (Files owned, import path and comments) at 2e8967d9: pass (verifier)
- Check: frozen install, `pnpm install --frozen-lockfile` at 2e8967d9: pass (verifier)
- Check: list, `pnpm test --list` prints the eight names at 2e8967d9: pass (verifier)
- Check: tool unit tests, `node --test "tools/**/*.test.mjs"` at 2e8967d9: pass (verifier, 21)
- Check: old paths, Task 5 grep at 2e8967d9: pass (verifier, empty)
- Check: registry output, `pnpm registry:build` then `git status --porcelain` empty at 2e8967d9: pass (verifier)
- Check: validate-repo, `pnpm test validate-repo` at 2e8967d9: pass (verifier)
- Check: dispatch run, none named by this milestone block: not applicable (verifier)
- Check: review findings, `Review: none`, no findings to apply: pass (verifier)
- Check: recorded checks at 7ed6aa90 (`pnpm test --all --no-diff` and the rest) not rerun: `git diff --name-only 7ed6aa90..HEAD` is the tracker only (verifier)

- Task 1 Dependencies and the tools move: done (85ec0484)
- Task 2 Runner and the wrappers: done (1fa03217)
- Task 3 docs-e2e and validate-production: done (a1d000e1)
- Task 4 installation-e2e: done (010f7359)
- Task 5 Cleanup and checks once: done (7ed6aa90)

## Attention

- Files outside "Files owned" edited, comments only: `apps/shadcn-table-docs/lib/{example-files,example-pages,example-variants}.mjs` name `tools/registry/` and `lib/example-map.mjs`; without it the Task 5 grep over `apps/shadcn-table-docs/lib` is not empty (1.6.8 lists them as path comments of the move commit).
- Path comments 1.6.8 names but outside "Files owned", left stale: `apps/shadcn-table-docs/.gitignore:6`, `apps/shadcn-table-docs/next.config.mjs:27`, `packages/shadcn-table/tsconfig.{radix,baseui,aria}.json` ("read by scripts/registry/build.mjs"); one line each for the main session or "Docs and process (08)".
- `lint` summary reads `9 warnings`, not `0 warnings`: the docs app's `eslint` has no `--max-warnings 0` and reports 9 warnings today (no-img-element, exhaustive-deps in the generated example variants); the test passes as the old CI did. Adding `--max-warnings 0` to the docs lint is a behaviour change left to the owner.
- `validate-pr` outside a pull request (no `PR` env, so locally and in `--all`) passes with `not a pull request, skipped` and the changelog counts; the epic is silent on the local case.
- `validate-pr` on a PR into master with no `release:` label fails (1.6.7 "exactly one"); the old shell let such a PR pass as "no release".

## Notes

- Dependencies: `pnpm add -Dw playwright@^1.64.1 pixelmatch@8.0.0 pngjs@7.0.0` and `pnpm --filter shadcn-table remove pixelmatch pngjs` (two pnpm commands, one lockfile change in 85ec0484); both trees resolve playwright 1.64.1.
- `tools/preview.mjs`: root mode as before; package mode is `--package` (`pnpm --filter shadcn-table preview` runs `node ../../tools/preview.mjs --package`).
- `tools/registry/build.mjs` imports `registry/<base>/registry.ts` through `PKG` (the relative import no longer resolved from `tools/`); output identical.
- `tailwind-classes` resolves `@tailwindcss/node` and `@tailwindcss/oxide` from the package (createRequire on `packages/shadcn-table/package.json`); it checks every base in one call.
- `--changed --list` names the matching tests without running them; used for the Task 2 check (a plain `--changed` on this branch runs nearly every test).
- `--all` and `--changed` ignore `--base`/`--scenario` on tests without them; flags the runner does not own (`--no-diff`) go to every test.
- Inside `--all`, `validate-production` runs `docs-e2e --url` as a child runner, which rewrites `test/.out/docs-e2e-<base>.json` with the live-site records; in CI each job has its own `.out`.
- `browser.mjs` keeps its `::error::` lines and the `release gate <base>: pass` last line (behaviour unchanged, 1.6.6).
- `packages/shadcn-table/public/` is not tracked, so the registry output check covers `registry.json`; it was unchanged after the move.
- The old `pr.yml`, `release.yml` and `install.yml` still name the removed paths until "Tools and workflows (08)" merges (Local CI line of the block).
