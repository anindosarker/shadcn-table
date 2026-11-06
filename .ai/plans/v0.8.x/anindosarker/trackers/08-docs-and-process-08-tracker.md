# 08: Docs and process (08), tracker (D85, D86, D87, D88, D89, D90, D91)

Status: merged (85d27dab)
Branch `v0.8/08-docs-process`, worktree `shadcn-react-table.worktrees/01`, no PR (P1, P3)
Checks:

- Check: old names in docs, `grep -rnE "scripts/release|packages/shadcn-table/scripts|packages/shadcn-table/test|page-checks|install\.yml|check:bases|check:tailwind|check:icons|release:prepare|check-pages|release impact|version bump" CONTRIBUTING.md docs/code-of-conduct packages/shadcn-table/registry/README.md apps/shadcn-table-docs/README.md` at c9c575cd: pass (empty)
- Check: test names in docs, every `pnpm test <name>` the docs name against `pnpm test --list` at c9c575cd: pass (typecheck, lint, storybook-tests, docs-e2e, validate-repo, installation-e2e, validate-production, `--changed`)
- Check: docs-e2e sections, `pnpm test docs-e2e --base base` at a35d882f: pass (4 sections, 107 pages, 1 worker, 12 min 22 s with the build)
- Check: docs-e2e one section, `pnpm test docs-e2e --section api --base base` at a35d882f: pass (1 section, 10 pages)
- Check: act list, `act -l` at 0bd150b5: pass (pr.yml `PR checks` nine jobs, the four called workflows with their matrix jobs, release.yml `Release` four jobs); `actionlint .github/workflows/*.yml`: pass
- Check: run name, `gh workflow run pr.yml --ref v0.8/08-docs-process -f installation-e2e-only=false` at 0bd150b5, run 42254086380: pass (`gh run list` shows `PR checks: all`; contexts `Typecheck / Typecheck (base)` and so on); the run itself fail on `Installation E2E / Installation E2E (nextjs-base)` only (ENOTEMPTY in the temp dir cleanup after the browser phase, see Attention), every other test job and PR Summary green
- Check: docs-e2e four contexts, `pnpm test docs-e2e --base base` at 2770c169: pass (107 pages, 4 min 45 s with the build, under 8 min)
- Check: dispatch run 42256775917, `gh workflow run pr.yml --ref v0.8/08-docs-process -f installation-e2e-only=false` at 2770c169: attempt 1 fail (`Installation E2E / Installation E2E (nextjs-radix)`, the same ENOTEMPTY cleanup error after a passing browser phase), attempt 2 (`gh run rerun --failed`) pass; nineteen test jobs and PR Summary green, Validate PR and Prepare Release skipped; Docs E2E Tests base 8 min 27 s, radix 8 min 53 s, aria 9 min 9 s (under 10 min)
- Check: 2.2 workflows grep, `grep -rnE "scripts/release|packages/shadcn-table/scripts|packages/shadcn-table/test|page-checks|install\.yml" .github package.json packages/*/package.json apps/*/package.json` at 2770c169: pass (empty)
- Check: validate-repo, `pnpm test validate-repo` at 2770c169: pass (27 unit tests; under `packages/shadcn-table/registry/` only `README.md` changed)
- Check: format, `pnpm format` before each commit, `.ai/plans/**/reference/**` reverted: pass
- Check: ruleset 25521193 nested contexts: pending (Task 4, main session, D80)
- Check: old names in docs, Task 1 grep at 158980c7: pass (empty) (verifier)
- Check: test names in docs, `pnpm test <name>` in the docs and the PR template against `pnpm test --list` at 158980c7: pass (eight names; docs name typecheck, lint, storybook-tests, docs-e2e, validate-repo, installation-e2e, validate-production, `--changed`, `--list`) (verifier)
- Check: docs-e2e one section, `pnpm test docs-e2e --section api --base base` at 158980c7: pass (1 section, 10 pages, 109 assertions) (verifier)
- Check: act list, `act -l` at 158980c7: pass (pr.yml `PR checks` nine jobs, four called workflows, release.yml `Release` four jobs); `actionlint .github/workflows/*.yml`: pass (verifier)
- Check: dispatch runs, `gh run view <id> --json conclusion,jobs` at 158980c7: 42256775917 (head 2770c169, attempt 2) success, nineteen test jobs success, PR Summary success, Validate PR and Prepare Release skipped; display title `PR checks: all` on both 42254086380 and 42256775917: pass (verifier)
- Check: files, `git diff --stat 81ddd4f0..HEAD` at 158980c7: pass (Files owned, CHANGELOG.md and the tracker, plus `test/docs-e2e/test.mjs` required by Tasks 3 and 5, see Attention) (verifier)
- Check: format, `prettier --check` on the changed files at 158980c7: pass (verifier)
- Check: process.md, `grep -n "packages/shadcn-table/scripts" .ai/plans/v0.8.x/anindosarker/process.md` at 158980c7: pending (Task 2, main session; line 67 still matches) (verifier)
- Check: review findings, Review: none: pass (no findings to apply) (verifier)
- Check: skipped as recorded at 2770c169 with only plan files and CHANGELOG.md changed since: `pnpm test docs-e2e --base base`, 2.2 workflows grep, `pnpm test validate-repo` (verifier)

- Task 1 Docs of 1.6.13: done (c9c575cd)
- Task 2 `process.md` P5 and P9: pending (main session, D88)
- Task 3 Docs E2E page lists by section (D89): done (a35d882f)
- Task 4 Workflow and run names (D90): done (0bd150b5, run 42254086380); the ruleset rewrite to the nested contexts is pending (main session)
- Task 5 Faster Docs E2E (D91): done (2770c169, run 42256775917)
- Task 6 Cleanup and checks once: done (this commit)

## Attention

- `release.yml` run name: `run-name` cannot read `packages/shadcn-table/package.json` and no API renames a run, so a push run is named `Release` (Check Release writes the version to its step summary) and only a dispatch reads `Release <version>` from its `version` input. Revert path if the list must read `Release 0.8.1` on the merge: have Check Release dispatch release.yml with the version.
- `pr.yml` run-name: the dispatch input is the boolean `installation-e2e-only`, so a dispatch reads `PR checks: all` or `PR checks: installation-e2e-only`.
- The home page `/` was in clusters a (command bar) and e (landing and demo loop); it is one entry in `getting-started.mjs` now (command bar first, then the landing), with `/docs` and `getting-started/production-ready-tables`; `guides/pagination` moved from a to `guides.mjs`. F61's pause check therefore lives in `getting-started.mjs`, not `examples.mjs`.
- `test/docs-e2e/test.mjs` is outside the Files owned line (`test/docs-e2e/lib/`), but Tasks 3 and 5 require it (sections, `--section`, `--workers`, four contexts); changed here.
- Installation E2E Next scenarios failed twice in a row on CI with `ENOTEMPTY ... rmdir <tmp>/app` (nextjs-base on run 42254086380, nextjs-radix on 42256775917), in `fs.rmSync(tmp)` of `test/installation-e2e/test.mjs:428` after the browser phase passed: `next dev` children still write while the temp dir is removed. Not in this milestone's files; a fix milestone should stop the server's process group before the removal (or retry the rm). Probably a new known flake (an F item).
- Chromium installs without `--with-deps` in `docs-e2e.yml` and `installation-e2e.yml` (D91); `storybook-tests.yml` keeps `--with-deps` (D91 names only the two).

## Notes

- `helpers.mjs` left unchanged (Task 3); its header still says `lib/<cluster>.mjs`.
- `--workers <n>` overrides the four contexts; default 4 (D91).
- The Next build cache key hashes the docs `ts`, `tsx`, `mdx`, `mjs` and `css` sources under the lockfile hash, restored by the lockfile prefix.
- The first dispatch after the cache change missed both caches (expected); later runs hit them.
