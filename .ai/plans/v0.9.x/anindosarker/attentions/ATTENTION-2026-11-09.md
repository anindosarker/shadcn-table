# Attention, 2026-11-09

## A16 The label event rebuilds the Validate PR failure lines instead of keeping the block verbatim


- On a `labeled` or `unlabeled` run only Validate PR reruns; spec 18 1.6.2 says the previous comment's failures block is carried over verbatim. The builder carries it over except the `- **Validate PR**` lines, which are rebuilt from the new record, so a relabel that fixes the label does not leave a stale Validate PR failure in the block. Merged in b501c14f (`tools/release/pr-summary.mjs`, `buildComment`).

- Options:
  - a) Recommended: keep (amend spec 18 1.6.2: "verbatim except the Validate PR lines")
  - b) revert: the block verbatim, a stale Validate PR failure stays until the next full run

## A17 The four called workflows skip every step on the bump commit, not the job

