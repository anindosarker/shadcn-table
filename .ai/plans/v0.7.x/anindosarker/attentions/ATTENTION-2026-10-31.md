# Attention, 2026-10-31

## A1 Changelog spec blocks are `#### Spec NN` under `### Changed`, not `### Spec NN`

- The foundation wrote the per-spec blocks of `CHANGELOG.md` as `#### Spec NN` headings under `### Changed`, because `scripts/release/next-version.mjs` throws on any `### ` heading outside Breaking, Removed, Added, Changed, Fixed, Docs, which would fail the `release impact` job and the version PR. Each line inside a block keeps its category as the leading label (`Fixed`, `Added`, `Docs`, `Breaking`).
- Keep: the release step regroups the lines under the standard headings before the `dev` into `master` PR, so 0.7.0 ships a standard changelog. Revert: teach the release scripts the `### Spec NN` blocks instead.
- Options:
  - a) Recommended: keep; the release step (spec 09, inline) regroups the block lines into the standard headings.
  - b) Revert to `### Spec NN` and change `next-version.mjs` to accept them.
- Owner, 2026-10-31 in chat: option a accepted; the release step regroups the lines under the standard headings. Not to be discussed again.

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

## A9 Tailwind 4.3.3 canonicalizes `start-*` and `end-*` to `inset-s-*` and `inset-e-*`

- D31 and spec 06 1.6.4 name `start-*` and `end-*` as the logical forms, but `check:tailwind` (canonicalizeCandidates on 4.3.3) rewrites them to `inset-s-*` and `inset-e-*`, so S1 wrote `inset-s-0`, `inset-e-0`, `inset-e-1`, `inset-e-[14%]` and `data-[pinned=true]:before:inset-s-0`. Same CSS (`inset-inline-start`, `inset-inline-end`). Keep, or amend D31's wording.

## A10 `ST_CellActionMenu` reads the action cell ref inside the `Subscribe` render prop

- 07 1.6.2 says the anchor is read at the component top; set C instead renders a file-local inner component under the kept `Subscribe source={table.atoms.actionCell}` and passes `anchorEl={table.refs.actionCellRef.current}` from that render prop, because a read at the top that feeds `useST_MenuAnchor` is a `react-hooks/refs` error and the element exists only in the ref set B's `ST_TableBodyCell` writes. `closeMenu` no longer nulls `actionCellRef`; the inner component's unmount cleanup does. Keep, or have `ST_TableBodyCell` publish the element through state next to `setActionCell` (S2 or a follow-up).

## A11 `useST_Rows` no longer memoizes the rows

- D9 and 02 1.6.6 hoist the getter results to locals as memo dependencies; set A removed the memo instead, because a memo on `getST_Rows(table)` with the slices as dependencies fails `exhaustive-deps` and with `table` alone would go stale. The ten slice subscriptions stay and the rows are read on each body render; `RenderCounts` stories show the same re-render set. Keep, or restore the memo with one reasoned `exhaustive-deps` disable (+1 on the expected count per base).

## A12 Aria `Select` moved from `selectedKey` and `onSelectionChange` to `value` and `onChange`

- `react-aria-components` 1.22.1 deprecates `selectedKey` and `onSelectionChange` on `Select`; `no-deprecated` reported 8 hits in aria `ST_EditCellTextField`, `ST_FilterTextField` and `ST_TablePagination`, outside the D11 and D13 lists. Set C migrated them to `value` and `onChange` with the same selection behavior and no disable. Revert means a reasoned disable per line and +8 on the aria expected count.

## A13 Three smaller S1 judgment calls

- The body cell skeleton width is drawn once at mount in the `useState` initializer (D8), not when loading first turns on: a column resized before loading starts keeps its mount-time skeleton width.
- `Editing.stories.tsx` lost four `@ts-expect-error column id is a string key of Person` lines (`tsc -p tsconfig.stories.json` reported them unused after the immutable row copy); `GroupingColumnsSetState` and `VirtualizedDataSetAfterMount` set their after-mount data in a `setTimeout` instead of synchronously in the effect (`set-state-in-effect`).
- `ST_SelectCheckbox` (base, radix): the radio now receives every common prop except `checked` and `title` through one `as ComponentProps<typeof RadioGroupItem>` cast on an entries filter; spec 04 1.6.2's row and its 2.1.1 cast list still describe the earlier pick form. Spec text to update at triage.

## A14 Spec 06 shadows are lighter under `color-mix`

- The S1 verifier's pixel comparison against `reference/06-*` found every element at the same position and every shadow present, but the light-mode pinned-edge and bottom-toolbar shadows lighter (peak 240 vs 223, 245 vs 234) and a faint new sticky-header band in dark mode, the expected effect of D32's `color-mix(in oklab, var(--foreground) 15%, transparent)` and `10%`. Three judges run on the captures (result in `trackers/06-tracker.md`). If a stronger light-mode shadow is wanted, raise the percentages per site.
