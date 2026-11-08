# 20: Release 0.9.1, Integration, tracker

Status: running
Branch `v0.9/release-0-9-1-integration`, worktree 03
Checks:
- Check: record-output unit test, `node --test tools/release/record-output.test.mjs` at 5d29d199: pass (6 of 6; green expected, the cases describe the shipped capRecord, P11 not applicable)
- Check: storybook-static negation, `git check-ignore -q test/storybook-static/new.mjs` at 5d29d199: pass (exit 1)
- Check: header sentence gone, `grep -c "spec 18's act check" tools/release/pr-summary.mjs` at 5d29d199: pass (0)
- Check: validate-repo, `pnpm test validate-repo` at 5d29d199: pass (40 unit tests)
- Check: lint, `pnpm test lint` at 5d29d199: pass (0 errors, 9 warnings)
- Check: one Unreleased, `grep -c '^## Unreleased' CHANGELOG.md` at 1744fec8: pass (1)
- Check: block list of 1.6.1, `## Unreleased` headings at 1744fec8: pass (Added: Spec 12, 14; Changed: Spec 19, 18, 16, 17; Fixed: Fix F22; Docs: Spec 11, 08, 13, 09, 10, 15; no Breaking or Removed)
- Check: changelog section well-formed, `node tools/release/prepare-release.mjs --check --base-version 0.9.0` at 1744fec8: pass (exit 2, not bumped)
- Check (verifier): recorded checks reused, `git diff --name-only 5d29d199..433d16d2` touches only CHANGELOG.md and .ai/: no rerun at 433d16d2
- Check (verifier): fix merges in master, `git merge-base --is-ancestor <sha> origin/master` at 433d16d2: pass (F20, F23, F24, F25 fixes 0adce149, ea276251, 50ef8dd5, 634739d3 in master; F22 3d5b0b13, 938765e6 not, listed under Fixed)

- Task 1 Ride-alongs (D46: .gitignore negation, record-output.test.mjs, pr-summary header): done, 5d29d199
- Task 2 Changelog pass (on this branch; the fast-forward of dev is the merger's later step): done, 1744fec8

## Attention

- F20, F23, F24, F25 get no `#### Fix F<n>` line in 0.9.1 although spec 20 Task 2 names one per fix: they shipped in 0.9.0 (verified ancestry of origin/master); revert by adding the four lines under `### Fixed`.
- F21 gets no `#### Fix F21` line in 0.9.1: it has no fix merge (the fix is the P5 `--no-diff` rule in process.md, no shipped code); revert by adding a line under `### Fixed` if the owner wants it listed.

## Notes

- F20, F23, F24, F25 shipped in 0.9.0 (fix merges 0adce149, ea276251, 50ef8dd5, 634739d3 are in origin/master); no new line. Their claude/review merges (db8a27fc, 1fb91e9f and ca006472, dbc43fd6, fff96d29) carry the same test-only fixes. The 0.9.0 section lists none of them (test files only).
- F22 (merges 3d5b0b13, 938765e6) is not in origin/master: `#### Fix F22` under `### Fixed`.
