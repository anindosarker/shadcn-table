# 10: bug fixes and parts as designed, tracker

Status: built, review pending
Branch `v0.7/bug-fixes`, worktree `bug-fixes`, PR #74 (workstream S2)
Gates:
- `pnpm --filter shadcn-table lint` at a190f38f (before the ride-along): red, 6 errors (`icons/hugeicons.ts:94` deprecated `LayoutThreeColumnIcon`, `icons/remixicon.ts:47` unused `_children`, per base; the task text had the two files swapped)
- `pnpm --filter shadcn-table lint` at 382a33a4: green, exit 0, 0 problems
- `pnpm check:icons` at 174fac3c: green, 35 keys, 0 problems in 4 maps per base
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria` at 43af46f6 (last library change): green
- `pnpm --filter shadcn-table exec tsc -p tsconfig.stories.json` at 382a33a4: green
- `eslint-disable` count (`grep -rc "eslint-disable" ... | awk`) at 382a33a4: base 53, radix 53, aria 55, equal to the 02 tracker expectation; no disable added or removed
- `pnpm check:tailwind` at 43af46f6: green, 0 not canonical or physical (base 1233, radix 1213, aria 1224 candidates)
- `pnpm check:bases` at 43af46f6: green (150 library files, 24 and 38 allowed to differ; 216 example files, 2 and 10); no new `base-diff.json` or `aria-diff.json` entry
- `pnpm registry:build` at dbf4702c, committed in 5bea26a0: item names unchanged, the three `hooks/useST_FullScreenContainer.ts` paths added, and the `switch` registryDependency dropped from all four `shadcn-table` items (no base imports the Switch part any more, so a fresh install no longer adds it)
- `pnpm --filter shadcn-table-docs lib:install base`, then `radix`, then `aria` at dbf4702c, committed in 5bea26a0: green
- `pnpm --filter shadcn-table test:base` (port 5341), `test:radix` (5344), `test:aria` (5347), run concurrently at 5bea26a0: green, 70 files, 466 tests each; 382a33a4 adds two render-only stories (`SearchField` `PositionRight`, `PositionLeft`), run with `RTL` per base: green, 4 tests each
- `pnpm --filter shadcn-table-docs types:check` at 5bea26a0: green; `lint`: exit 0, 0 errors, 9 warnings (the same 9 as the 02 record); `build`: green, tree clean after
- `grep -rn "queueMicrotask"` over the registry at 43af46f6: only `shared/utils/cell.utils.ts` per base
- Acceptance play tests, `test:base`, `test:radix`, `test:aria` at 5bea26a0: green: `Filtering` `RangeFilterMinValue`, `Sorting` `ClearSortStaysCleared`, `SearchField` `OpenCloseAndEscape`, `MenuOpeners` (four openers: `aria-expanded`, second-click close, anchor span follows a resize, focus return, Tab skips the span), `ColumnHiding` `ColumnHidingKeyboardToggle`, `FilterPopover`, `ModalExit`, `HeadlessFullScreen`, `RTL`
- Range and clear-sort play tests against the pre-fix code (a190f38f `useST_Effects.ts` and the mutating range updater, base, then restored): both fail, so they catch F27 and F28
- Judged capture (search reveal) at 382a33a4: `capture10.cjs` (the `reference/10-route.md` script pointed at Storybook dev, `fixed-bugs-search-field--position-right` and `--position-left`), Storybook dev on 5350 (base), 5351 (radix), 5352 (aria), run concurrently, servers stopped. 90 frames in the session scratchpad `s10/cap/10-<base>-<state>-<frame>.png` (the `escape-open-right` frames are the setup step, like the reference), side-by-side sheets `s10/sheet-<state>.png`, scratchpad `/private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table-shadcn-react-table/e001baee-c356-4fbd-b566-06e1457b6659/scratchpad/s10/`. Comparison against `reference/10-*`: every base opens in the same eased width-and-opacity sequence (frame 1 near closed, frames 3 to 5 at full 224 px width, no jump), closes by shrinking and fading to nothing by frame 3, and the Escape close matches the click close; focus after open is the Search input, after close and Escape the toggle; closed panel `inert`, opacity 0. Differences: Storybook renders the dark theme (the reference is light), the library field has its icon and clear addons, and the panel grows toward the toolbar buttons from the field's own edge. Three judges pending (main session).
- CI run 41197634475 (PR #74) at 07d8bd52: green, all 15 checks
- Review fixes, rerun after the last code change (ac83ecbd library, 3633b9f6 regenerated docs copies):
  - `pnpm registry:build` and `pnpm --filter shadcn-table-docs lib:install base`, `radix`, `aria` at ac83ecbd, committed in 3633b9f6: green, `registry.json` unchanged
  - `pnpm --filter shadcn-table lint`, `tsc:radix`, `tsc:baseui`, `tsc:aria`, `exec tsc -p tsconfig.stories.json` at 3633b9f6: green
  - `pnpm check:tailwind` at 3633b9f6: green, 0 not canonical or physical (aria 1231 candidates); `pnpm check:bases` at 3633b9f6: green, registry/aria 39 allowed to differ (`components/head/ST_TableHeadCellResizeHandle.tsx` added to `aria-diff.json`)
  - `eslint-disable` count at 3633b9f6: base 53, radix 53, aria 55, unchanged; `grep -rn "queueMicrotask"` at 3633b9f6: only `shared/utils/cell.utils.ts` per base
  - `pnpm --filter shadcn-table test:base` (port 5341), `test:radix` (5344), `test:aria` (5347), concurrently at 3633b9f6: green, 71 files, 469 tests each (new: `PanelCollapse` `ProgressAndBannerCollapse`; `MenuOpeners` `ColumnActions` filter-by-column step; `SearchField` `OpenCloseAndEscape` clear-then-close step)
  - `pnpm --filter shadcn-table-docs types:check` at 3633b9f6: green; `lint`: exit 0, 0 errors, the same 9 warnings; `build`: green
  - New play tests against the pre-fix code: `PanelCollapse` fails on the ec656f3d parent aria toolbar files (progress gone at once); the `MenuOpeners` filter-by-column step passes on the pre-fix code too (see the declined finding under Attention)
  - CI run: pending (PR #74) at 3633b9f6

- Ride-alongs: done (174fac3c icons lint, 4bcae752 Remix type fix, bc3ffa65 checkbox `indeterminateIcon`, 5bea26a0 registry and docs copies)
- Milestone 01 reproduce and 1.6.2 to 1.6.8: done (43af46f6 library, 382a33a4 stories)
- Final milestone gates: done (5bea26a0 regenerated outputs, gates above)

Reproduction (2.1.1 step 0), next-app `/header-demo` on `pnpm exec next dev -p 5341`, `AGENTS.md` restored after:
- F27 reproduced: Filter, pick Estimate, the chip popover shows Min and Max as `type="text"` inputs; Min `30` leaves all 20 rows (estimates 35, 3, 16, ... unfiltered)
- F28 not reproducible there: the demo sets `enableGlobalFilterRankedResults: false` as its workaround (not edited, P5); reproduced instead by `ClearSortStaysCleared` failing on the a190f38f code after an owner re-render
- F61 not reproducible there: the demo renders its own row action `DropdownMenu` with the button as trigger and its own column menus; reproduced instead by the `MenuOpeners` second-click step

Notes:
- `eslint-disable` count unchanged (base 53, radix 53, aria 55), so `trackers/02-tracker.md` keeps its expected count.
- `useST_MenuAnchor` adds a capture-phase `pointerdown` note while open: a press on the open menu's opener closes the menu as an outside press, and `toggle` then ignores that press's click; the flag clears on the next press. The openers call the hook themselves for `openerProps` and `toggle`; the menus keep their own call for `spanProps`, `rect` and focus.
- Two hook instances per open menu (opener and menu) both register the resize, capture scroll and `pointerdown` listeners while open, and the opener re-renders on scroll through `setMeasured` though it reads only `openerProps` and `toggle`. Accepted as is: spec 1.6.5 gives the opener the anchor state, and a `measure: false` option would grow the D26 interface again.
- `localization.toggleVisibility` is no longer read by any base (the column Switch and its tooltip went); the key stays in `ST_Localization` and the 20 locale files for compatibility (P5, no public option removed).
- Base and radix `ST_FilterOptionMenu` gain `isSubMenu` (as aria has) for the filter-mode `DropdownMenuSub`.
- `isNumberColumn` sits in `shared/utils/column.utils.ts`, which `index.ts` re-exports whole, so it is public.
- The edit modal keeps the last row in state while it plays its exit; `ST_TableContainer` mounts it whenever a display mode is `modal`, and no longer selects `actionCell`.
- Aria detail panel, progress bar and stacked alert banner keep their content mounted until their collapse transition ends, through one `useCollapsingChildren` hook in aria `shared/utils/style.utils.ts` (internal, not re-exported; the file is already on `aria-diff.json`). The overlay banner has no transition and drops its content at once.
- 2c38ea8e was pushed with one lint error (React Compiler `preserve-manual-memoization` on an aria `useCallback`), fixed in 7b4370db.

## Attention

- TanStack store issue draft (D22), for the owner to file on `TanStack/store`:
  - Title: `Atom notifies subscribers when an undefined value is set to undefined`
  - Version: `@tanstack/store` 0.11.2 (through `@tanstack/react-store` 0.11.2, `@tanstack/react-table` 9.3.1)
  - Repro: `const a = createAtom<string | undefined>(undefined); a.subscribe(() => console.log('notified')); a.set(undefined);` logs `notified`. `dist/atom.js:134` reads `if (oldValue === void 0 || !compare(oldValue, newValue))`, so any update of an atom whose value is `undefined` counts as a change, even with `Object.is` equality.
  - Expected: no notification when `compare(oldValue, newValue)` holds, `undefined` included (or a documented reason for the special case).
  - Impact: a table's `globalFilter` atom (`undefined` by default) notified on every state sync, which re-applied the last sort after the user cleared it; shadcn-table now guards with `Object.is` itself.
- `ButtonProps` is `ComponentPropsWithRef<'button'> & Pick<ComponentProps<typeof Button>, 'size' | 'variant'>` (aria: its omit type plus the same pick), not `ComponentProps<typeof Button>` as 1.6.3 writes: the full part type drops props the library passes (`title`, drag handlers, `onClick` on `Element` in aria) and broke `tsc` in all three bases, and removing them breaks "no public type removed". `SelectProps` omits `size` and `variant` so it stays as it was. Revert means retyping every `ButtonProps` user.
- Aria search panel keeps React Aria's `group` role with `aria-label` (the search label) instead of `role="none"`: `DisclosurePanel` types allow only `group` and `region`.
- `--st-search-width: 14rem` sits on the Collapsible root as D25 says; the field `className` lands on the input, so it cannot change the token. A consumer overrides it from an ancestor, for example `[&_[data-slot=collapsible]]:[--st-search-width:20rem]` on the toolbar.
- Radix search panel uses `duration-200!`: Radix sets an inline `transition-duration: 0s` while it measures the panel, which otherwise snaps the width. Base adds `data-starting-style:w-12 data-starting-style:opacity-0` beside `data-closed:` so the open transition starts from the closed box (Base UI un-hides the panel on open). Closed, radix (`forceMount`) and aria (`hidden="until-found"`) keep an invisible 48 px box; base hides it.
- `useST_MenuAnchor` exposes `anchorRef` beside `focusAnchor`, a member beyond the D26 interface fixed in the foundation: base `finalFocus` takes a ref or an element, not a focus call, so the base menus pass `anchorRef`. Revert: keep only `focusAnchor` and have base return `false` from `finalFocus` and call `focusAnchor()` itself.
- Escape in the search field clears a typed value first and closes the field on the next press (an empty field closes at once), like a native search input; D25 says only "Escape closes it". Revert: drop the clear step so Escape always closes, leaving the filter applied behind the closed field.
- Aria popover filter focuses its input through a mount ref callback on the popover content (`focusFilterInput`), not `autoFocus` as D28 names: the popover hosts four filter variants (text, range fields, range slider, checkbox) and only the table's `filterInputRefs` reaches all of them; `autoFocus` would need a new prop threaded through `ST_TableHeadCellFilterContainer` into each input.
- Review finding "`focusFilterOnCloseRef` never reset" declined: `ST_ColumnActionMenu` renders only while `anchorEl` is set (`ST_TableHeadCellColumnActionsButton`), so every open is a fresh mount with the flag false. The new `MenuOpeners` `ColumnActions` step (filter by column, reopen, Escape, focus on the opener) passes before and after.
- "Filter by column" does not hand focus to the column's filter input in base and aria (radix does), found while writing that step. Base: the menu unmounts in the same commit that mounts the filter row, so `finalFocus` runs before the input's ref is set and falls back to the opener. Aria: `handleFilterByColumn` focuses the input before the hidden filter row renders. D28 (F43) asks for the primitive's close-focus hook; a fix needs either a menu that stays mounted while closed or focusing the input after the filter row commits. Not fixed in this round.
- The cell context menu does not close on a second right-click on the same cell: the cell has no opener button, a native context menu reopens there too, and a per-cell hook would cost a hook per cell. `ST_CellActionMenu` stays mounted (F53) but its inner content still unmounts on close, so it shows no exit animation.
- Aria `ST_SelectCheckbox` and `ST_FilterCheckbox` keep their tooltip wrappers: React Aria `Checkbox` and `RadioGroup` are not `Focusable` triggers. Pagination, filter field and sort label buttons are the triggers now.
- `ST_ActionMenuItem` keeps `onOpenSubMenu` (public prop) but only shows a submenu arrow; nothing calls it.
- The RTL story asserts the resize handle at the header cell's inline-end edge (the left side in RTL, D31's direction-neutral `end`), not the inline-start edge the 1.6.8 row names.
- The sort label tooltip moved inside its span. The resize handle keeps only its own base's orientation selector (`data-[orientation=vertical]` base and radix, `aria-[orientation=vertical]` aria), so `components/head/ST_TableHeadCellResizeHandle.tsx` joins `aria-diff.json`.
- No harness reminder gave a `Claude-Session:` line (ATTENTION A5), so the commits and the PR #74 body carry none.
