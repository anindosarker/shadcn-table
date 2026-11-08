# Attention, 2026-11-09

## A16 The label event rebuilds the Validate PR failure lines instead of keeping the block verbatim
[D43]


- On a `labeled` or `unlabeled` run only Validate PR reruns; spec 18 1.6.2 says the previous comment's failures block is carried over verbatim. The builder carries it over except the `- **Validate PR**` lines, which are rebuilt from the new record, so a relabel that fixes the label does not leave a stale Validate PR failure in the block. Merged in b501c14f (`tools/release/pr-summary.mjs`, `buildComment`).

- Options:
  - a) Recommended: keep (amend spec 18 1.6.2: "verbatim except the Validate PR lines")
  - b) revert: the block verbatim, a stale Validate PR failure stays until the next full run

## A17 The four called workflows skip every step on the bump commit, not the job
[D44]


- Spec 16 1.6.4 put `if: ${{ !inputs.skip }}` on the matrix job of `typecheck.yml`, `storybook-tests.yml`, `docs-e2e.yml` and `installation-e2e.yml`. The builder found that a job-level `if:` is read before the matrix expands, so GitHub reports one skipped job named `Typecheck (${{ matrix.base }})` and the required leg contexts stay "Expected" (actions/runner#952, closed unfixed). Merged 8631dc07: every step carries the `if:` instead, so on the bump commit each leg runs no step and reports success under its own context; D35's outcome (no second test run, Prepare Release skipped through Lint and Validate Repo) holds. act expands the legs either way, so only the 0.9.1 release run confirms it.

- Options:
  - a) Recommended: keep (spec 16 1.6.4 already reads this way); the 0.9.1 run is the proof, a context left "Expected" there is a new item
  - b) revert to the job-level `if:` and prove it on a throwaway PR first

## A18 The getting-started perf budgets are 600 ms under --ci, 300 ms locally
[D48]


- D29 accepts the panel open and light/dark toggle at under 300 ms of long tasks; the 0.9.1 release run (42514739346) measured the toggle at 342 to 351 ms on GitHub runners on two of three bases, twice, so the release PR was red on the budget, not the code (F28). The fix milestone keeps 300 ms locally (D29's measure) and uses 600 ms under `--ci` so the release can ship; the fix merges into `claude/review` and `dev` before the PR reruns (merged 629dcf81: `PERF_BUDGET_MS` is 600 when `process.env.CI === 'true'`, which GitHub sets; a local `--ci` run keeps 300 ms because `test/run.mjs --ci` does not set `CI`).

- Options:
  - a) Recommended: keep (amend D29's acceptance line: 300 ms locally, 600 ms on GitHub runners)
  - b) revert: one budget of 300 ms everywhere, the release run reruns until the runner is fast enough (or the perf checks leave the CI run)

## A19 The release label minor ships 0.10.0, D45 names 0.9.1
[D49]


- D45 names the release 0.9.1 and the label `release:minor` (new public API: `ST_DefaultsProvider`, `pageSize` in the stored view); on 0.9.0 that label bumps to 0.10.0 (Validate PR on PR 135, run 42518019709: "Ships as 0.10.0 (release:minor)"). Prepare Release waits; the runner did not approve (a tag and a publish cannot be undone). Everything else is green; the D36 and D38 proof lines are recorded in `trackers/20-release-pr-0-9-1-tracker.md`.

- Options:
  - a) Recommended: ship 0.10.0 as labelled (semver: new public API is a minor), rename spec 20 and the trackers to 0.10.0 after the merge; the runner approves on the ruling
  - b) relabel PR 135 `release:patch` (`gh pr edit 135 --remove-label release:minor --add-label release:patch`), a new `labeled` run, then approve: ships 0.9.1 with new API under a patch number
