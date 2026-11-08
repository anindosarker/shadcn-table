# Attention, 2026-11-09

## A16 The label event rebuilds the Validate PR failure lines instead of keeping the block verbatim


- On a `labeled` or `unlabeled` run only Validate PR reruns; spec 18 1.6.2 says the previous comment's failures block is carried over verbatim. The builder carries it over except the `- **Validate PR**` lines, which are rebuilt from the new record, so a relabel that fixes the label does not leave a stale Validate PR failure in the block. Merged in b501c14f (`tools/release/pr-summary.mjs`, `buildComment`).

- Options:
  - a) Recommended: keep (amend spec 18 1.6.2: "verbatim except the Validate PR lines")
  - b) revert: the block verbatim, a stale Validate PR failure stays until the next full run

## A17 The four called workflows skip every step on the bump commit, not the job


- Spec 16 1.6.4 put `if: ${{ !inputs.skip }}` on the matrix job of `typecheck.yml`, `storybook-tests.yml`, `docs-e2e.yml` and `installation-e2e.yml`. The builder found that a job-level `if:` is read before the matrix expands, so GitHub reports one skipped job named `Typecheck (${{ matrix.base }})` and the required leg contexts stay "Expected" (actions/runner#952, closed unfixed). Merged 8631dc07: every step carries the `if:` instead, so on the bump commit each leg runs no step and reports success under its own context; D35's outcome (no second test run, Prepare Release skipped through Lint and Validate Repo) holds. act expands the legs either way, so only the 0.9.1 release run confirms it.

- Options:
  - a) Recommended: keep (spec 16 1.6.4 already reads this way); the 0.9.1 run is the proof, a context left "Expected" there is a new item
  - b) revert to the job-level `if:` and prove it on a throwaway PR first
