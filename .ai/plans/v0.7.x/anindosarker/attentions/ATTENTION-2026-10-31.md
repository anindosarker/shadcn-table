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

## A15 Install command keeps two code paths that build the same string

- In `apps/shadcn-table-docs/components/mdx/install-command.tsx` the default form returns `editionAddCommand(library, base, pm, overwrite)` while the fallthrough `addCommand(installed, base, pm)` builds the same URL when `installed` is the edition item. The S5 review called one path redundant; the fixer kept both because spec 08 1.6.5 binds the default command to `editionAddCommand` and it has no other caller. Accept, or amend the spec and drop one path at triage.

## A16 TanStack store issue to file (D22)

- The issue draft (title, version, repro, expected, impact) sits under `## Attention` in `trackers/10-tracker.md`: `@tanstack/store` 0.11.2 `atom.js:134` notifies subscribers when an `undefined` atom is set to `undefined`. The library guards with `Object.is` itself; the owner files the issue on `TanStack/store`.

## A17 `ButtonProps` is widened by intersection, not replaced by the Button part type

- D29 and spec 10 1.6.3 say `ButtonProps = React.ComponentProps<typeof Button>`. S2 made it `ComponentPropsWithRef<'button'> & Pick<ComponentProps<typeof Button>, 'size' | 'variant'>` (aria: its omit type plus the same pick): the full part type drops props the library passes (`title`, drag handlers, aria `onClick` on `Element`), broke `tsc` in every base, and would remove public props. Keep, or amend D29 to the intersection form.

## A18 Spec 10 judgment calls recorded in the tracker, each with a revert path

- `useST_MenuAnchor` exposes `anchorRef` beside `focusAnchor` (base `finalFocus` takes a ref or element); the D26 interface grew by one member.
- Escape in the search field clears a typed value first and closes on the next press (empty field closes at once); D25 says only "Escape closes it".
- Aria search panel keeps React Aria's `group` role with `aria-label` instead of `role="none"` (`DisclosurePanel` allows `group` and `region` only). Radix panel uses `duration-200!` against Radix's inline `transition-duration: 0s` while measuring.
- Aria popover filter focuses its input through a mount ref callback, not `autoFocus` (D28): four filter variants, one ref map.
- "Filter by column" hands focus over with `flushSync` in base and aria (React Aria menus have no close-focus hook); radix keeps `onCloseAutoFocus`.
- The cell context menu does not close on a second right-click on the same cell (no opener button); its inner content still unmounts on close, so no exit animation.
- Aria `ST_SelectCheckbox` and `ST_FilterCheckbox` keep their tooltip wrappers: React Aria `Checkbox` and `RadioGroup` are not `Focusable` triggers.
- The RTL story asserts the resize handle at the header cell's inline-end edge (D31's direction-neutral `end`), where spec 10 1.6.8 names the inline-start edge. Spec text or assertion to settle at triage.
- `ST_ActionMenuItem` keeps the public `onOpenSubMenu` prop but only shows a submenu arrow; nothing calls it.
- The search width token `--st-search-width` sits on the Collapsible root; the field `className` lands on the input, so a consumer overrides it from an ancestor selector.

## A19 Review round 2 left one major that the round 2 fix closed

- Spec 10's second review round found the "Filter by column" focus hand-off missing in base and aria; the round 2 fixer fixed it (1e9c8327, with a play-test assertion that fails before and passes after). The template returns `review-open` when round 2 ends with a major, so the main session ran one incremental confirmation review of the fixer's commits plus verify before merging, beyond the two review rounds the process names. Accept, or make a confirmation round part of the process.

## A20 Search field input shows no focus ring after a pointer-opened reveal

- Spec 10's judged Acceptance passed 2 of 3. The dissenting judge: after the toggle button is clicked, the input receives focus (the capture logs confirm `document.activeElement` is the input in every base) but shows no ring or caret in the frames, while the owner's Base UI demo (the reference) shows a 3 px ring. The input group styles focus with `focus-visible`, which Chromium does not apply to script focus that follows a pointer click; the Escape path shows the toggle's ring as the reference does. Accept the styling difference, or make the field show `focus-within` styling after a programmatic open.
