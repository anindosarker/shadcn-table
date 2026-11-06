# 08: Tools and workflows (08), tracker (D85, D86, D87, D88)

Status: running
Branch `v0.8/08-tools-workflows`, worktree `shadcn-react-table.worktrees/01`, no PR (P1, P3)
Checks:
- Check: tool unit tests, `node --test "tools/**/*.test.mjs"` at 2b6a1e62: pass (27)
- Check: syntax, `node --check` on `tools/release/{verify-deployment,publish-release,pr-summary}.mjs` at 2b6a1e62: pass
- Check: verify-deployment live, `node tools/release/verify-deployment.mjs --version 0.8.1 --timeout-min 1` at 2b6a1e62: fail (environment: www serves `0.8.0`, storybook `/version.txt` is 404 because `storybook:build` writing it is not on master yet; the tool exits 1 with both bodies as specified; the success path proven with stubbed bodies through the exported `poll`)
- Check: actionlint, `actionlint .github/workflows/*.yml` at 9c569d0a: pass
- Check: act list, `act -l` at 9c569d0a: pass (pr.yml job ids typecheck, lint, storybook-tests, docs-e2e, validate-repo, installation-e2e, validate-pr, pr-summary, prepare-release, with the matrices the twenty-one names; release.yml Check Release, Verify Deployment, Validate Production, Publish Release; no install.yml)
- Check: act jobs, `act pull_request -j validate-repo` and `-j lint`: act unavailable (Docker down); natively `pnpm test validate-repo --ci` at 9c569d0a: pass (27 unit tests); `pnpm test lint --ci` at 9c569d0a: pass (9 warnings)
- Check: old paths, `grep -rnE "scripts/release|packages/shadcn-table/scripts|packages/shadcn-table/test|page-checks|install\.yml" .github` at 9c569d0a: pass (empty)
- Check: dispatch run 42238797293, `gh workflow run pr.yml --ref v0.8/08-tools-workflows -f installation-e2e-only=false` at 9c569d0a: attempt 1 fail (Docs E2E Tests (radix), cluster e "@1440 demo: pauses when scrolled away mid-step", timing; no docs change on the branch), attempt 2 (`gh run rerun --failed`) pass, 19 test jobs green, PR Summary green, Validate PR and Prepare Release skipped; PR Summary of attempt 2 still printed the attempt 1 radix record (two `test-out-docs-e2e-radix` artifacts merged), fixed in de2d9644 with `overwrite: true`
- Check: artifact, `gh run download 42238797293 -n test-out-validate-repo` holds `validate-repo.json` at 9c569d0a: pass
- Check: dispatch run 42245855728, `gh workflow run pr.yml --ref v0.8/08-tools-workflows -f installation-e2e-only=false`, `gh run watch` equivalent, at de2d9644: pass (first attempt; nineteen test jobs green, PR Summary green with the comment in the step summary and no stale line, Validate PR and Prepare Release skipped)
- Check: artifact, `gh run download 42245855728 -n test-out-validate-repo` holds `validate-repo.json` at de2d9644: pass; artifact names `test-out-typecheck-<base>`, `test-out-lint`, `test-out-storybook-tests-<base>`, `test-out-docs-e2e-<base>`, `test-out-validate-repo`, `test-out-installation-e2e-<scenario>` (18 on a dispatch; `test-out-validate-pr` on a PR only)
- Check: 2.2 workflows grep, `grep -rnE "scripts/release|packages/shadcn-table/scripts|packages/shadcn-table/test|page-checks|install\.yml" .github package.json packages/*/package.json apps/*/package.json` at de2d9644: pass (empty)
- Check: list, `pnpm test --list` at de2d9644: pass (eight names)
- Check: validate-repo, `pnpm test validate-repo` at de2d9644: pass (27 unit tests; no file under `packages/shadcn-table/registry/` changed)
- Check: format, `pnpm format` before each commit, `.ai/plans/**/reference/**` reverted: pass
- Check: ruleset 25521193: pending (Task 3, main session)

- Task 1 Release tools: done (2b6a1e62)
- Task 2 Workflows: done (92d777c6, da8fc551, 9c569d0a, de2d9644; runs 42238797293, 42245855728)
- Task 3 Repository settings: pending (main session, D80; after run 42245855728, before `dev` fast-forwards; the ruleset PUT is not recorded here yet)
- Task 4 Cleanup and checks once: done (this commit)

## Attention

- The Task 1 check `verify-deployment --version 0.8.1` cannot pass today: production serves 0.8.0 (0.8.1 is not live) and storybook.shadcn-table.com has no `/version.txt` until the next release deploys `storybook:build`. Recorded as fail (environment); the first release run of the new `release.yml` is the live proof.

- `validate-repo` on CI reports `0 unit tests` (run 42238797293): Node 22 prints TAP (`# tests 27`) when stdout is not a TTY, and `test/validate-repo/lib/unit.mjs` parses the spec reporter's `ℹ tests`. The tests run and pass (exit 0 governs); only the count is wrong. Fix outside this milestone's files: `--test-reporter=spec` in `unit.mjs`. Main session or a small fix.
- `pr.yml` follows 1.6.10 literally: the `ready_for_review` trigger and the draft guard of the old `version-bump` are gone, so Prepare Release bumps a draft release PR once its jobs are green.
- Docs E2E Tests (radix) cluster e "@1440 demo: pauses when scrolled away mid-step" failed once on CI and passed on rerun; not in the P5 flake list.

## Notes

- PR Summary on a label event rewrites lines 1 and 2 and also the Validate PR line from the new record (1.6.9 says "keeps the previous job lines"; the Validate PR line would otherwise contradict line 1); every other job line and the previous run link are kept.
- PR Summary exits 0 whatever the jobs did (the job lines carry failures; Prepare Release needs every job); it writes the comment to `$GITHUB_STEP_SUMMARY` on every event and posts it only on a pull request.
- Every test job runs `pnpm install` (the runner imports every `run.mjs`, and `docs-e2e` imports `playwright`); Chromium is installed for Storybook Tests, Docs E2E Tests and the three Next Installation E2E scenarios.
- `release.yml` Validate Production also uploads `test-out-validate-production` (not named by the epic; harmless).
- Review round 1: the `release.yml` Validate Production upload gained `overwrite: true`, like the `pr.yml` uploads.
