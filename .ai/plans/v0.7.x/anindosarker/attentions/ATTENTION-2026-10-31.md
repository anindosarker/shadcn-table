# Attention, 2026-10-31

## A1 Changelog spec blocks are `#### Spec NN` under `### Changed`, not `### Spec NN`

- The foundation wrote the per-spec blocks of `CHANGELOG.md` as `#### Spec NN` headings under `### Changed`, because `scripts/release/next-version.mjs` throws on any `### ` heading outside Breaking, Removed, Added, Changed, Fixed, Docs, which would fail the `release impact` job and the version PR. Each line inside a block keeps its category as the leading label (`Fixed`, `Added`, `Docs`, `Breaking`).
- Keep: the release step regroups the lines under the standard headings before the `dev` into `master` PR, so 0.7.0 ships a standard changelog. Revert: teach the release scripts the `### Spec NN` blocks instead.
- Options:
  - a) Recommended: keep; the release step (spec 09, inline) regroups the block lines into the standard headings.
  - b) Revert to `### Spec NN` and change `next-version.mjs` to accept them.

## A2 The foundation edited `eslint.config.js`, which D34 reserved for S1

- After the `eslint-plugin-react-hooks` 7.1.1 bump, `lint` crashed: plugin 7 has no flat `recommended-latest`. The foundation's first config block now registers the plugin and names the two plugin 5 rules (`rules-of-hooks` error, `exhaustive-deps` warn), same rule set as before, no React Compiler rules, so `lint` stayed green on PR #70. S1's lead step replaces that block with the 02 1.6.2 config.
- Keep (the change is dead once S1 merges) or revert (only possible by pinning plugin 5 again, against D17).
