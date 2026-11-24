# 82: Date filters on the date picker
- Epic: E26

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Every date, date-time and time filter of the table is a browser date box today, rendered in one place per base (`ST_FilterTextField.tsx`). That box becomes `DatePicker` from `shadcn-date-picker`, in the three bases at once (D164); spec 81 has put the picker and the registry mapping in place. In the same milestone the fix that returns a column to its default filter mode after an is-empty filter is cleared lands, taken as built from the held branch (D165), because it edits the same file. The table's own date-box workarounds go; the click fix of the held branch is not merged (D164).

### 1.2 Goals

- A filter with the variant `date`, `datetime`, `time`, `date-range`, `datetime-range` or `time-range` renders `DatePicker` where the browser box stood: in the chips editor, the header editor, the popover filter and the subheader, and for both boxes (Min, Max) of a range (D164).
- A range keeps its two boxes: each is a single `DatePicker` of type `date`, `datetime` or `time`. The picker's own range mode is not used, so the filter value stays a pair and the layout of a range filter does not change (D164: values, modes and layout of the filter are not re-decided).
- The filter value is the same string the browser box gave (`YYYY-MM-DD`, `YYYY-MM-DDTHH:mm`, `HH:mm`), an empty value clears the filter, and filtering, filter modes, chips text and stored view state behave as before (D164).
- A picked value applies at once; a typed value applies on Enter or when focus leaves the box, as today.
- The three options `stFilterDatePickerProps`, `stFilterDateTimePickerProps` and `stFilterTimePickerProps` keep their type `InputProps`. What the picker can take is forwarded: `min`, `max`, `step`, `disabled`, `id`, `className`, `style`, `aria-*`, `data-*`, and the handlers `onFocus`, `onBlur`, `onKeyDown`, which the picker's root receives as the events bubble. The other input-only props no longer have an effect; the changelog names them. A wider change to these options is card Q165, not this spec (D164).
- Each base's core item depends on `anindosarker/shadcn-date-picker/date-picker-<base>` at the pinned tag, so installing the table installs the picker (D164).
- The table's date-box code that the picker makes dead is removed: the native-picker key list, the tighter inset and the minimum width for Chromium's placeholder, and any other line the site map of Task 2 shows as reachable only for the browser box. The click fix `9bfdf247` is not merged (D164).
- Clearing an is-empty (or is-not-empty) filter returns the column to its default filter mode on every column type: commit `fd7059b6` and its play from `8c34979e` (the is-empty play only), from branch `v0.9/filter-input-fixes` (D165).
- The table adds no rule of its own for what the picker or the base library does: popup focus, Tab and page blocking are each base's stock behaviour as the picker's README lists them, by decisions D171 and D174.
- Acceptance: for the picker itself, the Storybook of the tag at `https://date-picker.shadcn-table.com/<base>/` (stories of type date, datetime and time, single). For the filter around it, a capture of `claude/review` before the change, per base, of the six filter places of 1.6.5: the box stands where the browser box stood, with the same height and the same neighbours. For everything else the previous release (0.9.7). Programmatic: the plays and checks of 1.6.5 pass on the three bases.

### 1.3 Current structure

```
registry/<base>/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx   (base tree, line numbers; radix and aria hold the same branch)
  :109-148   stFilterDatePickerProps, stFilterDateTimePickerProps, stFilterTimePickerProps read from the table and the column
  :268-279   handleChange (debounced) and handlePick (at once)
  :280-310   isDateTyped, typedDate, commit on unmount, commitTypedValue: a typed date applies on Enter or blur
  :505-526   onBlur, onKeyDown: the key list that tells typing from the native picker
  :528-541   commonDatePickerProps: className px-1.5, onChange (typed or picked), value
  :566-577   min-w-35 for a date filter (Chromium's placeholder)
  :590-610   the three branches: InputGroupInput type="time" | "datetime-local" | "date"
  the box sits in the table's own InputGroup with the filter mode button before it and the clear button after it
registry/<base>/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx  ← two ST_FilterTextField, rangeFilterIndex 0 and 1
registry/<base>/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx:29   ← date and time variants in the header editor
registry/<base>/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu.tsx    ← the clear action (D165 edits it)
registry/<base>/components/ui/shadcn-table/features/stConfigFeature.ts:220-253, 659-692   ← the three options, InputProps
registry/<base>/components/ui/shadcn-table/shared/utils/column.utils.ts:216-218, 259   ← isDateFilter
packages/shadcn-table/stories/features/DateFilters.stories.tsx, Filtering.stories.tsx, FilterChips.stories.tsx, ViewSettings.stories.tsx, ServerData.stories.tsx, Customization.stories.tsx
packages/shadcn-table/stories/miscellaneous/mobile-date-pickers.stories.tsx
apps/shadcn-table-docs/content/docs/guides/column-filtering.mdx
apps/shadcn-table-docs/examples/<base>/{advanced,react-query,persistent-view,subheader-filters,live-demo,customize-filter-variants}/TS.tsx, server-side-data/components/UsersTable.tsx   ← examples with date filters
test/docs-e2e/lib/helpers.mjs:1048-1051, test/docs-e2e/lib/examples.mjs   ← fill 'input[type="date"]'
origin/v0.9/filter-input-fixes   ← fd7059b6 (the fix of D165: ST_FilterTextField.tsx 4 lines and ST_ColumnActionMenu.tsx 5 lines per base), 8c34979e (plays in DateFilters.stories.tsx: is-empty reset, and the centre click of D96), 9bfdf247 (the click fix of the superseded decision D96; not merged), 7adbfce1 (docs copies and changelog of spec 50, not merged)
```

The picker (`registry/<base>/components/date-picker/`, spec 81): `DatePicker` takes `type`, `value: string`, `onChange(value: string)`, `min`, `max`, `step`, `disabled`, div props on its root, and `calendarProps`, `popoverProps`, `presets`, `labels`. It renders its own `InputGroup` with the browser input, its own clear button (hidden while empty) and the button that opens the popup. `onChange` fires on every valid typed value and on a pick.

### 1.4 Target structure

```
registry/<base>/.../inputs/ST_FilterTextField.tsx      ← the three branches render DatePicker (type "time" | "datetime" | "date") inside the table's InputGroup; fd7059b6's lines; dead date-box code removed
registry/<base>/.../menus/ST_ColumnActionMenu.tsx      ← fd7059b6's lines
registry/<base>/.../features/stConfigFeature.ts        ← types unchanged; the JSDoc of the three options says what is forwarded
packages/shadcn-table/stories/features/*.stories.tsx   ← plays drive the picker's input and popup; the is-empty play of 8c34979e; no centre-click play
packages/shadcn-table/stories/miscellaneous/mobile-date-pickers.stories.tsx   ← kept, changed or removed as Task 2's read of its purpose says, the reason in the tracker
apps/shadcn-table-docs/content/docs/guides/column-filtering.mdx   ← date filter text says date picker; no sentence about the browser's date box
test/docs-e2e/lib/helpers.mjs, examples.mjs            ← the date steps use the picker's input
packages/shadcn-table/registry.json, registry.json, apps/shadcn-table-docs/components/ui-<base>/**, public/r/**   ← generated (P9): + the picker dependency on the three core items, + the picker copy per base in the docs app
tools/registry/{base,aria}-diff.json                   ← only if the three trees' edits differ by more than the allow lists hold (P9)
CHANGELOG.md                                           ← #### Spec 82 under ## Unreleased: ### Changed (date filters use the date picker; the input-only props that stop having an effect), ### Fixed (is-empty reset)
```

**Stays unchanged:** the filter variants, modes and filter functions; `types.ts` and `index.ts` exports (P7); the picker's files and the parts (spec 81; never edited here); `tools/registry/*.mjs`, `package.json`, `pnpm-lock.yaml` (spec 81 owns them; a need found here is a fix milestone of spec 81); the table's range layout.

### 1.5 Flow

```
filter variant date | datetime | time (single or one box of a range)
  ST_FilterTextField ── DatePicker type=… value=filterValue min/max/step/disabled from the three options
      typed in the box ──> onChange(value) ──> kept as the draft ── Enter or focus leaves the picker ──> commitFilterValue
      picked in the popup ──> onChange(value) ──> handlePick ──> commitFilterValue at once
      picker's clear ──> onChange("") ──> handlePick(null)
  table's own clear button and filter mode button: as today

clear an is-empty filter (any variant) ──> column filter mode back to the column's default (fd7059b6)
```

### 1.6 Components

#### 1.6.1 The is-empty reset fix (D165)

- `git cherry-pick fd7059b6` first, before any other edit, so the commit applies cleanly. From `8c34979e` only the is-empty reset play is taken; the centre-click play belongs to D96 and is left out.
- The play fails on `origin/claude/review` before the cherry-pick; that failure goes to the tracker (P11).

#### 1.6.2 The picker in the filter box (D164)

- The three branches at `ST_FilterTextField.tsx:590-610` render `DatePicker` with `type` `time`, `datetime`, `date`. The picker's root is the nested input group: it takes the class the file already has for a group inside the table's group (`nestedGroupClassName`), so the table's group still draws the one border and focus ring.
- One clear control per box: where the table's own clear button and the picker's would both show, the table's stays (it also resets the filter mode, 1.6.1) and the picker's is hidden by the stock means the picker offers; if it offers none, the two are compared in the capture and the choice is a queue card, not a guess.
- Typed against picked: the picker gives no key information, so the file tells them apart by where the change came from. A change while the picker's input has focus is typed and is held as the draft; it commits on Enter in the input and when focus leaves the picker (the root's `onBlur`, with the popup counted as inside). A change from the popup, a preset or the clear control commits at once. Keys pressed inside the popup never count as typing.
- The draft that is not committed when the box unmounts is committed on unmount, as today (`:288-300`).
- `presentation` is left at the picker's default (popover). The popup opens from a box that is itself inside a popover in the chips editor, the header editor and the popover filter: a pick must apply and close the picker's popup, and must leave the outer popover open, on the three bases.
- Forwarded options: as Goals. `onChange` and `value` from the options are not passed to the picker.
- The same edit in the three trees; a base that needs a different line gets the smallest one and a row in its diff allow list (P9).

#### 1.6.3 Dead code

- After 1.6.2 the site map lists each date-box line with `removed` or `still used by <what>`. Only lines with no remaining reader are removed: no refactor of what stays.

#### 1.6.4 Stories, examples, docs

- Plays that typed into `input[type=date|datetime-local|time]` still find that input inside the picker; each play is run before it is edited and changed only where it fails. New plays in `DateFilters.stories.tsx`: pick a day from the popup in the chips editor (value applied at once, outer editor open); type a date and press Enter; type and leave the box; clear; a range with Min picked and Max typed; one datetime and one time pick.
- The examples and the guide: text and "Try it" steps that name the browser's date box are reworded; example code changes only where it used an input-only prop that no longer has an effect.
- Story pages and docs copies are regenerated with the project's scripts, never edited by hand (P9).

#### 1.6.5 Checks

- Plays of the six story files on the three bases.
- The six filter places, captured before and after per base at 1280 wide and 390 wide: chips editor, header editor, popover filter, subheader single, subheader range (Min and Max), filter chips row with a date value. One tracker line per place and base: same position, height and neighbours, or the named difference.
- Nested popups on the three bases, by play: outer popover stays open after a pick; Escape closes the picker's popup first.
- `grep -rn "type=\"date\"\|type=\"datetime-local\"\|type=\"time\"" packages/shadcn-table/registry/*/components/ui/shadcn-table` prints nothing.
- The core item of each base in `packages/shadcn-table/registry.json` holds `anindosarker/shadcn-date-picker/date-picker-<base>#v0.1.0`; no item holds a file under `components/date-picker`.
- Installation E2E: a fresh app of each scenario installs the table and gets `components/date-picker/date-picker.tsx`; `tsc` and the build pass.

### 1.7 Dependencies and env

- Spec 81 merged: the trees, the tag constant, the mapping, the docs install.
- No new package.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date filters use the date picker

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/menus/ST_ColumnActionMenu.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/features/stConfigFeature.ts`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/features/stConfigFeature.ts`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/features/stConfigFeature.ts`, `packages/shadcn-table/stories/features/DateFilters.stories.tsx`, `packages/shadcn-table/stories/features/Filtering.stories.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`, `packages/shadcn-table/stories/features/ViewSettings.stories.tsx`, `packages/shadcn-table/stories/features/ServerData.stories.tsx`, `packages/shadcn-table/stories/features/Customization.stories.tsx`, `packages/shadcn-table/stories/miscellaneous/mobile-date-pickers.stories.tsx`, `apps/shadcn-table-docs/content/docs/guides/column-filtering.mdx`, `test/docs-e2e/lib/helpers.mjs`, `test/docs-e2e/lib/examples.mjs`
- Depends on: Date picker item in the table trees
- Review: fable
- Local CI: `pnpm test typecheck`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests`, `pnpm test docs-e2e`, `pnpm test installation-e2e`, the last three one base at a time (P5)
- Task 1: The is-empty reset (1.6.1, D165). Checks: the is-empty play fails on `origin/claude/review`, the line in the tracker; after the cherry-pick `pnpm exec vitest run stories/features/DateFilters.stories.tsx` passes that play on the three bases (`ST_BASE=base|radix|aria`); `git log --format=%s -1 --grep='D96'` on the milestone branch prints nothing
- Task 2: The site map and the before captures. Checks: the tracker lists every date-box line of `ST_FilterTextField.tsx` (base line numbers, the radix and aria equals) and every story, example, docs and test site that drives a date box, each with what happens to it; the purpose of `mobile-date-pickers.stories.tsx` in one line; 36 before captures (six places, three bases, two widths) under `test/.out/spec82/before/`
- Task 3: The picker in the box on Base UI, then the same on Radix and React Aria (1.6.2, 1.6.3, D164). Checks: `pnpm test typecheck --base base`, `--base radix`, `--base aria` green; the grep of 1.6.5 prints nothing; `git diff --stat origin/claude/review -- 'packages/shadcn-table/registry/*/components/date-picker' 'packages/shadcn-table/registry/*/components/ui/*.tsx' tools package.json pnpm-lock.yaml` prints nothing; `pnpm -w registry:build` and the core item check of 1.6.5 pass
- Task 4: The plays (1.6.4). Checks: `pnpm test storybook-tests --base base`, `--base radix`, `--base aria` green, each new play of 1.6.4 in the passed list; the nested popup plays of 1.6.5 pass on the three bases
- Task 5: The look (1.6.5). Checks: 36 after captures under `test/.out/spec82/after/`; 36 tracker lines, `same` or the named difference with its cause; a difference a user would notice that no decision covers is a queue card with its two captures
- Task 6: Examples, the guide, docs copies, docs and install tests, the changelog (1.6.4, 1.6.5). Checks: `pnpm lib:install base`, `radix`, `aria` leave `apps/shadcn-table-docs/components/ui-<base>/date-picker/date-picker.tsx`; `pnpm --filter shadcn-table-docs types:check` green; `pnpm test docs-e2e --base base`, `--base radix`, `--base aria` green; `pnpm test installation-e2e` green with the picker file present in each scratch app; `pnpm test lint` and `pnpm test validate-repo` green; `grep -c '^#### Spec 82' CHANGELOG.md` prints `1`

### Milestone: A popup pick of the typed day filters at once

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/stories/features/DateFilters.stories.tsx`
- Depends on: Filter debounce hook, Date filter compare, Filter editor fixes, Filter input fixes, Date filters use the date picker
- Review: none
- Starts: S43
- Task 1: A popup pick of the typed day filters at once (Q171). Checks: a new play in DateFilters.stories.tsx (type a date, open the popup, pick that same day, the table filters without leaving the box) fails on origin/claude/review after spec 82 merged, the failure line in the tracker (P11); after the fix it passes on base, radix and aria; no file under registry/*/components/date-picker changes (git diff --stat prints nothing for them); pnpm test typecheck, pnpm test lint, pnpm test validate-repo, pnpm test storybook-tests one base at a time, green

### 2.2 Checks

- Local CI as in the milestone block.
- Review: `fable` on the whole diff (a library component in three bases, a new install dependency of every core item, a behaviour every date filter user sees).
