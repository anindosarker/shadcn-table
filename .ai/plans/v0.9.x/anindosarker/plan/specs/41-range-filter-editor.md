# 41: Range filter editors fit and accept input
- Epic: E12

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

On the live 0.9.3 Filter Variants example (Base UI) the owner opened the Departure Time chip, mode "between inclusive": the editor shows two time inputs side by side, the second runs past the editor's right edge with its clock icon cut off, and the owner could not fill the inputs at all (Q73). From the code: the chip editor popover is a fixed 260 px (`filterEditorClassName = 'w-65'`), and every date-like field (date, datetime, time) keeps a 140 px minimum (`min-w-35`), so two of them plus the 8 px gap need 288 px. The cause of the failed input is not known from the code; with spec 39 merged a typed time value no longer commits per keystroke, which removes the most likely cause (a commit of a partial range value resetting the fields). D86: both inputs of a range filter fit inside the editor and accept input, on the three bases, for time, date, datetime and number ranges.

### 1.2 Goals

- In the chip editor (chip click, the toolbar picker and the header editor) both inputs of a range filter lie fully inside the editor, for `time-range`, `date-range`, `datetime-range` and `range` (number), on the three bases (D86).
- Both inputs take typed values and the filter applies the range (D86).
- The cause of the failed input is found in a browser before the fix and named in the tracker (D86).
- Editors of non-range filters keep their 260 px width.
- Acceptance: programmatic. Play `RangeEditorInputsFitAndFill` in `stories/features/FilterChips.stories.tsx`, one case per variant (`time-range`, `date-range`, `datetime-range`, `range`): open the column's chip editor, assert each input's bounding box lies inside the editor's box (1 px tolerance), fill both inputs, blur, and assert the table shows the expected rows. It fails on the code before the change on the three bases for `time-range` at least (P11, recorded) and passes after for the four variants. `ChipEditorKeepsWidth` still passes.

### 1.3 Current structure

Paths under `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/`.

```
components/toolbar/ST_HeaderFilterEditor.tsx:16      ← export const filterEditorClassName = 'w-65' (base; radix and aria carry the same constant, the files differ elsewhere)
components/toolbar/ST_FilterChips.tsx:118,203        ← PopoverContent className={filterEditorClassName} (chip), editingColumn ? filterEditorClassName : pickerClassName (picker)
components/toolbar/ST_HeaderFilterEditor.tsx:94      ← the header-anchored editor, same class
components/toolbar/ST_FilterEditor.tsx:140-141       ← renders ST_TableHeadCellFilterContainer header open
components/inputs/ST_FilterRangeFields.tsx:17-21     ← 'grid grid-cols-[1fr_1fr] items-start gap-2': Min and Max side by side at every size (v0.8.x D61); identical on the three bases
components/inputs/ST_FilterRangeFields.tsx:50-56     ← two ST_FilterTextField with rangeFilterIndex 0 and 1
components/inputs/ST_FilterTextField.tsx:446-457     ← min widths: isDateFilter 'min-w-35', multi-select 'min-w-30', range 'min-w-18', else 'min-w-24' (isDateFilter wins over range)
components/inputs/ST_FilterTextField.tsx:420-426     ← date-like onChange (spec 39 changes how it commits)
shared/utils/column.utils.ts:252-254                 ← isDateFilter: variant starts with 'date' or 'time'
stories/features/FilterChips.stories.tsx:379         ← ChipEditorKeepsWidth
```

### 1.4 Target structure

```
components/toolbar/ST_HeaderFilterEditor.tsx   ← the editor width for a range filter of date-like fields grows to fit both inputs; 260 px stays the width for every other filter
components/inputs/ST_FilterRangeFields.tsx     ← only if the fit needs it (track sizing); Min and Max stay side by side (v0.8.x D61)
components/inputs/ST_FilterTextField.tsx       ← only if the input fix needs it (the cause found in Task 1)
stories/features/FilterChips.stories.tsx       ← RangeEditorInputsFitAndFill
CHANGELOG.md (P9)                              ← #### Spec 41 under ### Fixed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 41 Range filter editors fit and accept input` under `## Unreleased`, `### Fixed` (D86).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-<base>/`.

#### 1.6.2 Editor width (D86)

`components/toolbar/ST_HeaderFilterEditor.tsx`, status `refactor`, three bases.

- `filterEditorClassName` stays the export every caller uses; it becomes a function of the column (or a second exported class for date-like range filters) so that an editor holding two date-like fields is at least as wide as both minimum widths, the gap and the popover padding (288 px of content today), capped at the viewport width minus the popover's side offset. The three call sites (`ST_FilterChips.tsx` chip and picker, `ST_HeaderFilterEditor.tsx`) pass the column; `ST_FilterChips.tsx` is edited only at those two lines.
- `useST_PopupResize` in the picker keeps animating the width change between the column list and the editor.
- Does NOT stack Min and Max (v0.8.x D61), shrink the date-like minimum width below what Chromium's native placeholder needs (the comment at `ST_FilterTextField.tsx:445`), or change the subheader and popover display modes.

#### 1.6.3 Input (D86)

- Task 1 reproduces on the code before the change, in a browser on the three bases: open the Departure Time chip editor (story or the Filter Variants example on a production build), type an hour, minutes and AM or PM into each field, and record what each field shows after every key and what `columnFilters` holds. The cause named there is fixed at its source in `ST_FilterTextField.tsx` or `ST_FilterRangeFields.tsx`. If the input already works after spec 39 (typed values held until Enter or blur), the tracker says so with the record and no input code changes.

**Stays unchanged:** `ST_FilterEditor.tsx`, `ST_TableHeadCellFilterContainer.tsx`, `shared/**`, the slider.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Filter editor fixes

Regrouped 2026-11-13 by the lead (owner: too many serial sprints): specs 41, 42, 43, 44 and 45 change the same files (`ST_FilterTextField.tsx` per base, `FilterChips.stories.tsx`), so their work runs in this one milestone: one builder, one worktree, one check run, one merge. Each spec keeps its own Goals, Components and Acceptance; its tracker gets the same `Status: merged (<sha>)` as this milestone's.

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/toolbar/ST_FilterChips.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/toolbar/ST_FilterChips.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/toolbar/ST_FilterChips.tsx`, `test/docs-e2e/lib/helpers.mjs`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`
- Depends on: 39, Live demo ten columns
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`, `pnpm test docs-e2e --base aria`
- Task 1: The play first (P11) and the browser record of 1.6.3 on the code before the change, three bases. Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Range Editor Inputs Fit And Fill"` fails as required; the per-key record and the named cause are in the tracker
- Task 2: The width (1.6.2) and the input fix (1.6.3). Checks: the play passes for the four variants on the three bases; `ChipEditorKeepsWidth` passes; `pnpm test typecheck --base <base>`
- Task 3: Section 3.1 (was spec 42: React Aria multi-select opens on click): its tasks 1 and 2, the play first (P11), the fix and the removal of the ArrowDown fallback in `test/docs-e2e/lib/helpers.mjs`. Checks: section 3.1, its 2.2
- Task 4: Section 3.2 (was spec 43: Escape closes the filter editor): its tasks before the regenerate step, the plays first (P11). Checks: section 3.2, its 2.2
- Task 5: Section 3.3 (was spec 44: React Aria select filter chevron): its tasks before the regenerate step, the play first (P11). Checks: section 3.3, its 2.2
- Task 6: Section 3.4 (was spec 45: Filter Mode caption gap): the captures and the nine lines. Checks: section 3.4, its 2.2
- Task 7: Regenerate once (`pnpm lib:install` per base, `pnpm registry:build`), `pnpm format`, one changelog block per decision (D82, D83, D85, D86, D87). Checks: 2.2 of this spec and of sections 3.1 to 3.4, the Local CI lines once at the end

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria` green
- `RangeEditorInputsFitAndFill` on the three bases, with the before-the-change failure recorded
- One screenshot per base of the open time range editor after the change, paths in the tracker
- Review: none (layout class and one input fix proven by the play; P7 untouched)

## 3. Folded specs

Specs 42 to 45 were written as separate specs and folded into this one on 2026-11-14: their work ran as tasks 3 to 6 of the milestone `Filter editor fixes`. Each keeps its text below, headings two levels down.

### 3.1 React Aria multi-select filter opens on click (was spec 42)


#### 1. Architecture

##### 1.1 Overview

On React Aria the multi-select filter's option list opens only on ArrowDown or on the chevron; a click into its input does nothing. Base UI and Radix open the list on that click. The run found it in the browser check of the live demo (Q68), and the docs E2E helper carries a workaround for it. D82: React Aria opens on click like the other two bases.

##### 1.2 Goals

- On React Aria a click into the multi-select filter's input opens the option list (D82).
- Keyboard opening (ArrowDown), the chevron, typing to narrow and chip removal work as today.
- The docs E2E workaround is removed.
- Acceptance: programmatic. Play `MultiSelectOpensOnClick` in `stories/features/FilterChips.stories.tsx`: open a multi-select column's chip editor, click the combobox input once, assert an option is visible within 1000 ms with no key press. It passes on Base UI and Radix before the change, fails on React Aria before the change (P11, recorded) and passes on the three bases after. `pnpm test docs-e2e --base aria` green with the ArrowDown fallback removed from `liveDemoFilters`.

##### 1.3 Current structure

```
packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx
  ├── isMultiSelectFilter branch (about :627-690)  ← <Combobox selectionMode="multiple" ...> with ComboboxChips, ComboboxChipList, ComboboxChipsInput, ComboboxTrigger, ComboboxContent
  ├── ComboboxChips onClick                        ← e.stopPropagation() only
  └── ComboboxChipsInput onKeyDown                 ← stopPropagation, then the user's onKeyDown
packages/shadcn-table/registry/aria/components/ui/combobox.tsx:248,326 ← ComboboxChips, ComboboxChipsInput (the shadcn React Aria part; passes props through to the React Aria ComboBox; no menuTrigger set)
packages/shadcn-table/registry/{base,radix}/.../ST_FilterTextField.tsx ← their comboboxes open on click; not changed
test/docs-e2e/lib/helpers.mjs:729-741             ← "A React Aria combobox opens its list on ArrowDown, not on a click": presses ArrowDown when no option shows
packages/shadcn-table/stories/features/FilterChips.stories.tsx:488 ← MultiSelectArrayModes (existing multi-select play)
```

##### 1.4 Target structure

```
registry/aria/.../components/inputs/ST_FilterTextField.tsx ← the multi-select combobox opens its list when its input is clicked or focused by a click
stories/features/FilterChips.stories.tsx                  ← MultiSelectOpensOnClick
test/docs-e2e/lib/helpers.mjs                             ← the ArrowDown fallback and its comment removed
CHANGELOG.md (P9)                                         ← #### Spec 42 under ### Fixed
```

##### 1.5 Flow: none

##### 1.6 Components

###### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 42 React Aria multi-select filter opens on click` under `## Unreleased`, `### Fixed` (D82).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-aria/`.

###### 1.6.2 Open on click (D82)

`registry/aria/.../components/inputs/ST_FilterTextField.tsx`, status `refactor`.

- The multi-select `<Combobox>` opens on a click into its input through React Aria's own mechanism: the ComboBox `menuTrigger="focus"` prop (the list opens when the input takes focus, which a click does), passed on the `Combobox` of this branch. Before choosing it the builder reads the React Aria ComboBox documentation for the installed `react-aria-components` version and records the prop and its behaviour in the tracker; if `menuTrigger` does not reach the primitive through the shadcn part, the prop is passed through the part's existing props and the part file is not edited.
- The chip editor focuses the filter input when it opens (`initialFocus`, `focusFilterInput`): the play asserts the list's state right after the editor opens and records it; if focus on open also opens the list, that is accepted (Base UI and Radix behaviour is compared in the same play and recorded).
- Does NOT edit `registry/aria/components/ui/combobox.tsx` (a stock shadcn part), the autocomplete branch, or Base UI and Radix.

###### 1.6.3 Docs E2E helper

`test/docs-e2e/lib/helpers.mjs`, status `refactor`.

- In `liveDemoFilters`, the Status case clicks the combobox and picks `Suspended`; the `ArrowDown` fallback and its two comment lines go.

**Stays unchanged:** every other filter variant, `ST_FilterChips.tsx`, the React Aria ui parts.

##### 1.7 Dependencies and env: none

#### 2. Instructions for AI

##### 2.1 Milestones

###### Work, in milestone `Filter editor fixes` of spec 41 (was milestone: React Aria multi-select opens on click)

Regrouped 2026-11-13 by the lead: this spec's work runs as a task of the milestone `Filter editor fixes` (spec 41), which owns the files; the regenerate, format and Local CI steps run once there. The lines below describe the work only.

- Files owned: `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`, `test/docs-e2e/lib/helpers.mjs`
- Depends on: 41
- Review: none
- Local CI: `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`, `pnpm test docs-e2e --base aria`
- Task 1: The play first (P11): passes on Base UI and Radix, fails on React Aria before the change; record the three results. Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Multi Select Opens On Click"`
- Task 2: The fix (1.6.2) and the helper (1.6.3). Checks: the play passes on the three bases; `MultiSelectArrayModes` passes on React Aria; `pnpm test typecheck --base aria`
- Task 3: Regenerate (`pnpm lib:install aria`, `pnpm registry:build`), `pnpm format`, the changelog block. Checks: 2.2

##### 2.2 Checks

- The Local CI lines green
- `MultiSelectOpensOnClick` on the three bases, with the React Aria failure before the change recorded
- Review: none (one prop on one base, proven by the play; P7 untouched)

### 3.2 Escape closes the filter editor after a select pick (was spec 43)


#### 1. Architecture

##### 1.1 Overview

In the chips mode a filter's value editor is a popover. After a value is picked in a select filter, Escape closes the editor on Radix but leaves it open on Base UI and React Aria; on React Aria the open editor also blocks the Clear filters button until a click outside (Q69, the run's browser check of the live demo). From the code: the filter inputs stop Escape from bubbling to the popover, and `closeOnEscape` closes the editor in the capture phase only when the event target is an `HTMLInputElement`; after a select pick the focus sits on the select trigger, a button, so neither path closes the editor. D83: Escape closes the editor on Base UI and React Aria as on Radix, and Clear filters stays clickable.

##### 1.2 Goals

- After a value is picked in a select filter inside the chip editor, one Escape closes the editor on the three bases (D83).
- Escape pressed while the select's own option list is open closes that list only; the next Escape closes the editor.
- With a chip editor open, one click on Clear filters clears the filters and removes the chips on the three bases (D83).
- Escape in a text filter input closes the editor as today.
- Acceptance: programmatic. Plays in `stories/features/FilterChips.stories.tsx`: `EscapeClosesEditorAfterSelectPick` (open a select column's chip editor, pick an option, press Escape once: the editor is gone and the chip shows the value) and `ClearFiltersClickableWithEditorOpen` (open a chip editor, click Clear filters once: no chip remains and all rows show). Before the change (P11, recorded per base): the first fails on Base UI and React Aria and passes on Radix; the second fails on React Aria. After: both pass on the three bases.

##### 1.3 Current structure

Paths under `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/`.

```
components/toolbar/ST_HeaderFilterEditor.tsx:29-38 (base; aria :33-42) ← closeOnEscape: closes only when event.key === 'Escape' && event.target instanceof HTMLInputElement
components/toolbar/ST_FilterChips.tsx:120,205     ← PopoverContent onKeyDownCapture={closeOnEscape(...)} (chip editor, picker)
components/toolbar/ST_HeaderFilterEditor.tsx:94   ← the same on the header editor
components/inputs/ST_FilterTextField.tsx:414-417  ← inputs: onKeyDown stopPropagation
components/inputs/ST_FilterTextField.tsx (select branch) ← SelectTrigger onKeyDown: e.stopPropagation(), then the user's onKeyDown (base about :556-561, aria about :598-603, radix :549-551)
components/toolbar/ST_FilterChips.tsx:345-355     ← the Clear filters button: clearFilterChips(table)
registry/radix/...                                ← closes on Escape today; its files are not changed unless the play shows a regression
```

- Why Radix closes and the other two do not is not read from the code; Task 1 records, per base, where focus sits after the pick and which element handles Escape.
- Why Clear filters is blocked on React Aria is not known from the code (a React Aria popover may render an underlay or mark the outside inert); Task 1 records what the click hits.

##### 1.4 Target structure

```
components/toolbar/ST_HeaderFilterEditor.tsx (base, aria) ← closeOnEscape also closes when Escape comes from the select trigger with its list closed
components/inputs/ST_FilterTextField.tsx (base, aria)     ← only if the trigger's own handler must let the capture handler act (the cause found in Task 1)
components/toolbar/ST_FilterChips.tsx (base, aria)        ← only if the Clear filters fix sits in the popover's props (the cause found in Task 1)
stories/features/FilterChips.stories.tsx                  ← the two plays
CHANGELOG.md (P9)                                         ← #### Spec 43 under ### Fixed
```

##### 1.5 Flow: none

##### 1.6 Components

###### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 43 Escape closes the filter editor after a select pick` under `## Unreleased`, `### Fixed`: Escape and Clear filters with an open filter editor (D83).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-base/`, `ui-aria/`.

###### 1.6.2 Escape (D83)

- `closeOnEscape` treats every focusable control of the filter field as its input: an Escape whose target is inside the editor and is an input or the select trigger closes the editor, unless that control's own popup (the select or combobox list) is open, in which case the popup takes the Escape. The check for an open popup reads the control's own state attribute (`aria-expanded="true"` on the trigger), not a timer.
- The fix sits at the root: no second key listener on `document`, no delayed close.

###### 1.6.3 Clear filters with an open editor (D83)

- The record of Task 1 names what swallows the click on React Aria. The fix makes the chip editor a non-modal popover there, in the popover's own props at the three call sites if the React Aria popover part offers it, so that one click outside both closes the editor and reaches the button, as on Base UI and Radix. The builder reads the React Aria Popover documentation for the installed version and records the prop used.
- Does NOT edit `registry/aria/components/ui/popover.tsx` or any other stock ui part, and does NOT change `clearFilterChips`.

**Stays unchanged:** Radix files (unless a play regresses there), `ST_FilterEditor.tsx`, `ST_GlobalFilterTextField.tsx`, the header popover display mode.

##### 1.7 Dependencies and env: none

#### 2. Instructions for AI

##### 2.1 Milestones

###### Work, in milestone `Filter editor fixes` of spec 41 (was milestone: Escape closes filter editor)

Regrouped 2026-11-13 by the lead: this spec's work runs as a task of the milestone `Filter editor fixes` (spec 41), which owns the files; the regenerate, format and Local CI steps run once there. The lines below describe the work only.

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/toolbar/ST_FilterChips.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/toolbar/ST_FilterChips.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`
- Depends on: 42
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: The two plays first (P11) on the three bases and the per-base record: focus target after the pick, the element that handles Escape, what a click on Clear filters hits on React Aria. Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Escape Closes Editor After Select Pick"` and `-t "Clear Filters Clickable With Editor Open"` fail and pass as 1.2 states
- Task 2: The fixes of 1.6.2 and 1.6.3. Checks: both plays pass on the three bases; `RemoveAndClear` and `SelectClearBesideChevron` pass; `pnpm test typecheck --base <base>`
- Task 3: Regenerate (`pnpm lib:install base`, `pnpm lib:install aria`, `pnpm registry:build`), `pnpm format`, the changelog block. Checks: 2.2

##### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria` green
- The two plays on the three bases with the before-the-change results recorded per base
- Review: none (keyboard handling of one popover, proven by plays; P7 untouched)

### 3.3 React Aria select filter chevron at the right end (was spec 44)


#### 1. Architecture

##### 1.1 Overview

On the live 0.9.3 Filter Variants example with React Aria, the City filter (mode equals) shows its chevron right after the placeholder "Filter by City", in the middle of the input, not at the input's right end (Q75, owner's screenshot). On Base UI and Radix the chevron sits at the right end. From the code: the React Aria `SelectTrigger` is `flex w-full items-center justify-between`, so its chevron sits at the trigger's right end; the trigger is as wide as its parent, the React Aria `Select` root element, which carries no width class inside the filter's input group. D87: the chevron sits at the input's right end, as on the other two bases.

##### 1.2 Goals

- On React Aria the select filter's chevron sits at the right end of its input, with and without a value, in the chip editor, the subheader row and the popover mode (D87).
- With a value, the chevron stays clear of the overlaid clear button (the existing `ltr:pr-9 rtl:pl-9` rule).
- Acceptance: programmatic. Play `SelectChevronAtInputEnd` in `stories/features/FilterChips.stories.tsx`: open a select column's chip editor with no value; the chevron icon's right edge is within 12 px of the input group's right edge. It passes on Base UI and Radix before the change, fails on React Aria before the change (P11, recorded with the measured distance) and passes on the three bases after. `SelectClearBesideChevron` still passes on the three bases.

##### 1.3 Current structure

```
packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx
  └── isSelectFilter branch (about :580-626) ← <Select aria-label placeholder value onChange> (no className) wrapping <SelectTrigger className="w-full flex-1 rounded-none border-0 ..."> and <SelectValue />
packages/shadcn-table/registry/aria/components/ui/select.tsx:57-77  ← SelectValue: 'flex flex-1 text-left'
packages/shadcn-table/registry/aria/components/ui/select.tsx:79-101 ← SelectTrigger: 'flex w-full items-center justify-between gap-1.5 ...', the ChevronDownIcon after its children
packages/shadcn-table/registry/base/.../ST_FilterTextField.tsx:540-562 ← Base UI: the trigger is a direct child of the InputGroup, 'w-full flex-1'
packages/shadcn-table/stories/features/FilterChips.stories.tsx:552 ← SelectClearBesideChevron
```

- Task 1 confirms in a browser which element is narrower than the input group (the `Select` root is the expected one) and records its measured width.

##### 1.4 Target structure

```
registry/aria/.../components/inputs/ST_FilterTextField.tsx ← the Select root of the filter field spans the input group (a width class on the Select of this branch)
stories/features/FilterChips.stories.tsx                  ← SelectChevronAtInputEnd
CHANGELOG.md (P9)                                         ← #### Spec 44 under ### Fixed
```

##### 1.5 Flow: none

##### 1.6 Components

###### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 44 React Aria select filter chevron` under `## Unreleased`, `### Fixed` (D87).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-aria/`.

###### 1.6.2 Width (D87)

`registry/aria/.../components/inputs/ST_FilterTextField.tsx`, status `refactor`.

- The `Select` of the select branch gets the classes that make it fill the input group (`w-full min-w-0 flex-1`), so the trigger's `w-full` resolves against the whole field and its `justify-between` puts the chevron at the end. If the record of Task 1 names another element, the class goes on that element in this file.
- Does NOT edit `registry/aria/components/ui/select.tsx` (a stock shadcn part), the multi-select branch, or Base UI and Radix.

**Stays unchanged:** every other file.

##### 1.7 Dependencies and env: none

#### 2. Instructions for AI

##### 2.1 Milestones

###### Work, in milestone `Filter editor fixes` of spec 41 (was milestone: React Aria select filter chevron)

Regrouped 2026-11-13 by the lead: this spec's work runs as a task of the milestone `Filter editor fixes` (spec 41), which owns the files; the regenerate, format and Local CI steps run once there. The lines below describe the work only.

- Files owned: `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`
- Depends on: 43
- Review: none
- Local CI: `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: The play first (P11) and the browser record of the narrow element on React Aria. Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Select Chevron At Input End"` passes on base and radix, fails on aria with the distance recorded
- Task 2: The class (1.6.2). Checks: the play and `SelectClearBesideChevron` pass on the three bases; one screenshot of the React Aria City editor, path in the tracker
- Task 3: Regenerate (`pnpm lib:install aria`, `pnpm registry:build`), `pnpm format`, the changelog block. Checks: 2.2

##### 2.2 Checks

- The Local CI lines green
- `SelectChevronAtInputEnd` on the three bases, with the React Aria failure before the change recorded
- Review: none (one class on one base; P7 untouched)

### 3.4 Filter Mode caption gap (was spec 45)


#### 1. Architecture

##### 1.1 Overview

Under a filter input the library shows a caption "Filter Mode: <mode>" when filter modes are on and the display mode is not chips. Its top margin is `mt-0.75` (3 px), which the owner found too tight on the live popover filters example (Q71). D85: the margin becomes `mt-1.5` (6 px); the line height and every other class stay.

##### 1.2 Goals

- The caption's top margin is 6 px in the nine places that render it: text field, range fields and range slider on Base UI, Radix and React Aria (D85).
- `leading-[0.8rem]` and the other caption classes are unchanged (D85).
- Acceptance: programmatic. `grep -rn "mt-0.75 block text-xs" packages/shadcn-table/registry/*/components/ui/shadcn-table/components/inputs` prints nothing; `grep -rc "mt-1.5 block text-xs leading-\[0.8rem\] whitespace-nowrap text-muted-foreground" packages/shadcn-table/registry/*/components/ui/shadcn-table/components/inputs | awk -F: '{s+=$2} END {print s}'` prints 9. Reference (P10): a capture of the popover filters story on `claude/review` before the change next to one after, per base, paths in the tracker; the caption sits 3 px lower and nothing else moves.

##### 1.3 Current structure

Paths under `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/inputs/`.

```
ST_FilterTextField.tsx:662 (base), :646 (radix), :705 (aria)   ← <label className="mt-0.75 block text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
ST_FilterRangeFields.tsx:60 (the three bases, identical file)   ← <p className="mt-0.75 block text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
ST_FilterRangeSlider.tsx:138 (base), :128 (radix), :146 (aria)  ← the same <p>
```

- `components/head/ST_TableHeadCellFilterContainer.tsx:72` (base, radix) and `:90` (aria) carry `pt-0.75 -mt-0.75` for the subheader collapse; that is another rule and stays.

##### 1.4 Target structure

```
the nine lines of 1.3      ← mt-1.5 in place of mt-0.75
CHANGELOG.md (P9)          ← #### Spec 45 under ### Changed
```

##### 1.5 Flow: none

##### 1.6 Components

###### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 45 Filter Mode caption gap` under `## Unreleased`, `### Changed`: the caption sits 6 px under the filter input (D85).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-<base>/`.

###### 1.6.2 Caption margin (D85)

- In each of the nine lines `mt-0.75` becomes `mt-1.5`. Nothing else in the class list or the markup changes.
- Does NOT touch `ST_TableHeadCellFilterContainer.tsx`.

**Stays unchanged:** every other file; no story changes (no behaviour changes, so no new play).

##### 1.7 Dependencies and env: none

#### 2. Instructions for AI

##### 2.1 Milestones

###### Work, in milestone `Filter editor fixes` of spec 41 (was milestone: Filter Mode caption gap)

Regrouped 2026-11-13 by the lead: this spec's work runs as a task of the milestone `Filter editor fixes` (spec 41), which owns the files; the regenerate, format and Local CI steps run once there. The lines below describe the work only.

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`
- Depends on: 44
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: Capture the popover filters story with a filter popover open on `claude/review` before the change, per base; change the nine lines; capture again. Checks: the two `grep` lines of 1.2; the capture paths in the tracker
- Task 2: Regenerate (`pnpm lib:install` per base, `pnpm registry:build`), `pnpm format`, the changelog block. Checks: 2.2

##### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria` green
- The `grep` lines of 1.2; the before and after captures per base
- Review: none (one class value in nine lines the owner approved; P7 untouched)

