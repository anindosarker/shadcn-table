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

## A3 The checkbox dash reads the default icon map, not the table's `icons` option

- D30's addendum says the checkbox reads `IndeterminateIcon` through the table icons. Spec 11 (S3) made `ST_Checkbox.tsx` render `ST_Default_Icons.IndeterminateIcon` imported from `icons.ts`, because `ST_Checkbox` has no `table` prop; a consumer `icons={{ IndeterminateIcon }}` override does not reach the dash. The S3 review flagged this as the decision contradiction (`ST_Checkbox.tsx:22` in every base).
- The run keeps D30 as accepted and hands the wiring to workstream S2 (which owns the library tree after S1 merges) as a named ride-along: `ST_SelectCheckbox.tsx` and `ST_FilterCheckbox.tsx` hold `table` and pass `table.options.icons.IndeterminateIcon` to a new `ST_Checkbox` prop, default map as the fallback. S3 merges without it.
- Options:
  - a) Recommended: keep the S2 ride-along; no decision change.
  - b) Amend D30 to the import form ("the checkbox reads `IndeterminateIcon` from `icons.ts`") and drop the ride-along.

## A4 Spec 11's Acceptance expects a removed icon package, which D30 says stays

- The Acceptance line of spec 11 1.2 expects no `@tabler/icons-react` in the scratch `package.json` after installing the Tabler set and then Lucide with `--overwrite`. D30 says the previous icon package stays in `package.json` (the shadcn CLI never removes a dependency), so that clause cannot pass; every other clause passed. The builder did not block.
- Reword the Acceptance clause to D30 (one `icons.ts` importing `lucide-react`, the previous package allowed to remain), or add a removal step to the Icons guide in spec 08 (S5).

## A5 No `Claude-Session` trailer is available to this run

- No harness reminder in this session, nor in any sub-agent, gives a `Claude-Session:` line. The main session's first commits reuse the trailer of the plan-writing session (`session_015VBrypUJXYCcQD6zrN4yeT`); several sub-agent commits carry none, some later ones reuse the same old line. Pushed history stays as it is (no force-push, P1).
- Decide the rule for runs without a reminder: reuse the previous session's line, or omit the trailer.

## A6 A docs dev server on a port other than 5320 rewrites `apps/shadcn-table-docs/tsconfig.json`

- `next dev` with `PORT` not 5320 writes `.next-<port>/types` into the `include` list and reformats the file; `.prettierignore` (`*.json`) hides the change from `pnpm format`. S4 committed and reverted such a rewrite by accident. Pin `typescript.tsconfigPath` in `next.config.mjs`, or add a gate that diffs the file.

## A7 React Aria dev console warnings from the rendered library

- On the docs dev server with the React Aria base selected, the console shows `<Focusable> child must have an interactive ARIA role.` and a missing `aria-label` warning from the library; they appear with the header select alone, so they predate S4. Production `check-pages` reports no console errors; Base UI and Radix show none. Library side (S1 or S2 scope) or accept.

## A8 Docs example items now list `lucide-react` as a dependency

- Spec 11 made `shadcn-table-core` icon-free, so `examples.mjs` no longer skips `lucide-react`: the 17 examples per base that import it list it in `dependencies`. A project on another icon set that installs such an example also gets `lucide-react`. Keep, or rewrite those examples to the table icons later.
