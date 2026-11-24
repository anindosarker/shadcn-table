# 82: Date filters on the date picker, tracker

Status: running
Branch `v0.9/date-filters-on-date-picker`, worktree 06
Checks:

- Check: the is-empty play on the shipped code (P11), `ST_BASE=base pnpm exec vitest run stories/features/DateFilters.stories.tsx` at 36ca2818 with the play in the working tree: fail as intended (`Clear Empty Returns Date Default Mode`: expected `Filter Mode: Equals`, received `JoinedFilter Mode: Fuzzy`; 1 failed, 13 passed)
- Check: `ST_BASE=base|radix|aria pnpm exec vitest run stories/features/DateFilters.stories.tsx` at 6dcd219e with the play: pass (14 passed on base, radix, aria)
- Check: `git log --format=%s -1 --grep='D96' origin/claude/review..HEAD` at df801ff7: pass (prints nothing). Without the range the command prints `docs(plan): v0.9.x D96 superseded by D164`, a plan commit of `claude/review`, not of this milestone
- Check: site map below lists every date-box line of `ST_FilterTextField.tsx` and every story, example, docs and test site: pass
- Check: 36 before captures, `ST_BASE=<base> pnpm exec vitest run stories/features/Spec82Capture.stories.tsx` at df801ff7 on base, radix, aria (12 passed each): pass (`test/.out/spec82/before/<base>-<place>-<width>.png` and `.json`, 36 of each; the capture story is not committed, Notes)

- Check: `pnpm test typecheck --base base`, `--base radix`, `--base aria` at 595e0a50: pass (tsc clean on each)
- Check: `grep -rn "type=\"date\"\|type=\"datetime-local\"\|type=\"time\"" packages/shadcn-table/registry/*/components/ui/shadcn-table` at 595e0a50: pass (prints nothing)
- Check: `git diff --stat origin/claude/review -- 'packages/shadcn-table/registry/*/components/date-picker' 'packages/shadcn-table/registry/*/components/ui/*.tsx' tools package.json pnpm-lock.yaml` at 595e0a50: pass for what it guards (no picker file, no shadcn part, no tool, no package file changed). It prints 9 lines, all under `components/ui/shadcn-table/`, which the second pattern also matches in git: `ST_FilterTextField.tsx`, `ST_ColumnActionMenu.tsx`, `ST_HeaderFilterEditor.tsx` per base, the milestone's own edits
- Check: `pnpm -w registry:build` at 595e0a50: pass, tree clean after; core items of `packages/shadcn-table/registry.json`: `shadcn-table-base-core`, `shadcn-table-core` hold `anindosarker/shadcn-date-picker/date-picker-base#v0.1.0`, `shadcn-table-radix-core` `date-picker-radix#v0.1.0`, `shadcn-table-aria-core` `date-picker-aria#v0.1.0`; no item holds a file under `components/date-picker`
- Check: `pnpm test storybook-tests --base aria` at e955e6e9: fail, 1 of 636 (`FilterChips` "Range Editor Inputs Fit And Fill Date": two rows where one was expected). Not a flake: the typed date of Max was never applied (Notes, blur). Fixed in a4c07921
- Check: `pnpm test storybook-tests --base base`, `--base radix`, `--base aria` at 595e0a50: pass (636 passed on each)
- Check: the new plays, `ST_BASE=base|radix|aria pnpm exec vitest run stories/features/DateFilters.stories.tsx --reporter=verbose` at 595e0a50: pass (23 passed on each; in the passed list: Pick Day In Chips Editor, Typed Date Applies On Enter, Typed Date Applies On Leave, Clear Button Empties Date Filter, Range Min Picked Max Typed, Pick Day In Date Time Popup, Pick Minute In Time Popup)
- Check: nested popups by play at 595e0a50, base, radix, aria: pass (Pick Day In Chips Editor: the outer editor stays open after a pick; Escape Closes Picker Popup First; Escape In Date Time Popup Keeps Editor)
- Check: 36 after captures, `ST_BASE=<base> pnpm exec vitest run stories/features/Spec82Capture.stories.tsx` at 595e0a50 on base, radix, aria (12 passed each): pass (`test/.out/spec82/after/`); compared with the before records, table "The look" below
- Check: `pnpm lib:install base`, `radix`, `aria` at a4c07921: pass, each leaves `apps/shadcn-table-docs/components/ui-<base>/date-picker/date-picker.tsx`; the copies committed as 595e0a50
- Check: `pnpm --filter shadcn-table-docs types:check` at 595e0a50: pass
- Check: `pnpm test docs-e2e --base base`, `--base radix`, `--base aria` at 595e0a50: pass (5 sections, 117 pages, 0 failed on each)
- Check: `pnpm test lint` at 595e0a50: pass (0 errors, 9 warnings)
- Check: `pnpm test validate-repo` at 595e0a50: pass (bases identical, date picker matches, registry fresh, story pages match, 52 unit tests)
- Check: `grep -c '^#### Spec 82' CHANGELOG.md` at 595e0a50: pass (prints `1`)
- Check: `pnpm test installation-e2e --no-diff` at 595e0a50, nextjs-base, nextjs-radix, nextjs-aria: pass (`built, browser pass, no diff` on each; the table with the picker installs and `next build` passes)
- Check: `pnpm test installation-e2e --no-diff` at 595e0a50, fresh, existing, base, aria (the Vite scenarios): red, waits on Q166. Each fails at its `tsc` step with the one line `src/components/date-picker/utils/values.ts(98,7): error TS2591: Cannot find name 'process'.` and stops there. In each kept scratch app: `src/components/date-picker/date-picker.tsx` is present, `tsc -b` prints that one error and no other, `vite build` passes. Not run, because the scenario ends at its first failed step: the locale and example-basic install with their two builds, and the package.json asserts
- Local CI at 595e0a50 (the commits after it change this tracker and the plan reference only): typecheck, lint, validate-repo, storybook-tests, docs-e2e green on base, radix, aria; installation-e2e green on the three Next scenarios, red on the four Vite scenarios, waits on Q166

- Task 1 the is-empty reset: done (6dcd219e the fix, df801ff7 the play)
- Task 2 site map and before captures: done (dc3eadea)
- Task 3 the picker in the box, three bases: done (c1c0c02c, 483eb7aa the box height, a4c07921 the blur)
- Task 4 the plays: done (a00f7e0b)
- Task 5 the look: done (captures at 595e0a50, table below, one item under Attention)
- Task 6 examples, guide, docs copies, tests, changelog: done (8d3933d1, e955e6e9, 595e0a50)

## The look

Before against after per place, base and width (rect records of the box, its group, its container and every button and caption near it). The table's own group keeps its position, height (32 px) and neighbours in every row; `buttons` means the picker's input is 54 px narrower inside the same group because the picker's clear button and popup button (24 px each) stand at its end.

| Place | Width | base | radix | aria |
|---|---|---|---|---|
| chips editor | 1280 | same group; buttons | same group; buttons | same group; buttons |
| chips editor | 390 | same group; buttons | same group; buttons | same group; buttons |
| header editor | 1280 | same group; buttons | same group; buttons | same group; buttons |
| header editor | 390 | same group; buttons | same group; buttons | same group; buttons |
| popover filter | 1280 | group 169 to 195 px wide, so the popover 189 to 215 px, centred as before; buttons | as base | group 164 to 191 px, popover 184 to 211 px; buttons |
| popover filter | 390 | group 184 to 205 px, popover 204 to 225 px; buttons | as base | group 179 to 201 px, popover 199 to 221 px; buttons |
| subheader single | 1280 | same group; buttons | same group; buttons | same group; buttons |
| subheader single | 390 | same group; buttons: the input is 68 px (122 before) and shows `dd/mm` of the date (Attention) | as base | as base, input 72 px (127 before) |
| subheader range | 1280 | same groups; buttons in each | as base | as base |
| subheader range | 390 | same groups; buttons: Min's input is 52 px (106 before), Max's 84 px (138 before) (Attention) | as base | as base, Min 56 px (111 before) |
| chips row | 1280 | same | same | same |
| chips row | 390 | same | same | same |

- Popover filter: its width follows its content; the picker's input is 107 to 117 px by its own content where the browser box took 135 to 150 px, plus the two buttons. The mode button and the mode caption keep their place in the group.
- aria at 1280, subheader and chips row: the hidden rows-per-page select (1 px tall, off screen) reads 43 px wide where it read 47; nothing a user sees.

## Site map

Date-box lines of `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx` at 36ca2818 (radix holds the same lines at the same numbers up to 538, one line later after; aria about 40 lines later: 320, 322-337, 339-347, 552-573, 575-587, 622-624, 657-677).

| Lines (base) | What | Verdict |
|---|---|---|
| 109-112, 136-149 | the three options read and merged per column | still used by the picker: the forwardable props go to `DatePicker` |
| 268-278 | `handleChange` (debounced), `handlePick` (at once) | still used: a pick, a preset and the picker's clear go through `handlePick` |
| 280-283 | `isDateTyped` and its comment (a change with no key press is a pick in the native picker) | removed: the picker gives no key information; typed or picked is told by where the change came from |
| 284-300 | `typedDate`, the commit on unmount | still used by the typed draft |
| 302-310 | `commitTypedValue` | still used; reads `typedDate` in place of `isDateTyped` |
| 419-420 | `!isDateFilter` on the table's own clear button | still used: a date box never showed the table's clear button, so the picker's is the one clear control and nothing is hidden |
| 493-497 | the input ref into `filterInputRefs` | still used by the other inputs; the date box sets the same entry from the picker's input (the picker takes no input ref) |
| 505-508 | `onBlur` of the common props | still used by the text and number inputs; the date box commits from the picker root's `onBlur` |
| 509-525 | `onKeyDown`: the native-picker key list (513-523) | removed (513-523); Enter and `stopPropagation` stay for the other inputs |
| 528-540 | `commonDatePickerProps`: `px-1.5` inset, `onChange` by key flag, `value` | removed |
| 569-571 | `min-w-35` for a date filter, comment about Chromium's placeholder | still used by the picker's box (comment reworded): without it a range box in a narrow column is 74 px wide and its input 16 px (capture `after` at 390, first try); see Attention |
| 590-610 | three `InputGroupInput` branches, `type="time"`, `"datetime-local"`, `"date"` | replaced by one `DatePicker` |

Other library sites:

| Site | Verdict |
|---|---|
| `components/inputs/ST_FilterRangeFields.tsx` | unchanged: two `ST_FilterTextField`, each a single picker |
| `components/toolbar/ST_HeaderFilterEditor.tsx:18-21` comment (126 px of native placeholder), `:36` `w-77` for a date range | width unchanged; the comment loses the placeholder clause |
| `components/toolbar/ST_HeaderFilterEditor.tsx:55-68` `closeOnEscape` (base, aria; radix has none) | changes: an Escape in an input of a popup the field opened (the time box of the datetime popup) closed the whole editor; one condition added, Notes |
| `components/menus/ST_ColumnActionMenu.tsx` | fd7059b6 only |
| `features/stConfigFeature.ts:220-253, 659-692` | types unchanged; JSDoc added |
| `shared/utils/column.utils.ts:259` `isDateFilter` | unchanged, still used |

Stories, examples, docs, tests that drive a date box:

| Site | What happens |
|---|---|
| `stories/features/DateFilters.stories.tsx` | 13 value plays unchanged; + the is-empty play, + the plays of 1.6.4 and the nested popup plays |
| `stories/features/Filtering.stories.tsx:1531-1558` (typed date, Escape closes the chip editor), `:1593-1625` (half typed year) | run first; changed only where they fail (Task 4) |
| `stories/features/FilterChips.stories.tsx:697-830` (range editor inputs fit and fill, date, datetime, time) | run first; changed only where they fail |
| `stories/features/ViewSettings.stories.tsx:744, 845, 853`, `ServerData.stories.tsx:533, 1128`, `Customization.stories.tsx:796` | date columns; run first; changed only where they fail |
| `stories/miscellaneous/mobile-date-pickers.stories.tsx` | kept; its header comment and play wording change (Task 4). Purpose: the port of MRT's mobile date pickers story, six date, datetime and time columns with subheader filters, and the story of the docs page `examples/more/miscellaneous-mobile-date-pickers--mobile-date-time-pickers` |
| `apps/shadcn-table-docs/content/docs/examples/more/miscellaneous-mobile-date-pickers--mobile-date-time-pickers.mdx` | description and Try it steps name the browser's date field: reworded |
| `apps/shadcn-table-docs/content/docs/guides/column-filtering.mdx:97-105` | reworded where it names the browser's box; a line on what the three options pass on |
| `apps/shadcn-table-docs/examples/<base>/{advanced,react-query,persistent-view,subheader-filters,live-demo,customize-filter-variants}/TS.tsx`, `server-side-data/components/UsersTable.tsx` | `filterVariant` only, no input-only prop: code unchanged |
| `test/docs-e2e/lib/helpers.mjs:1048-1051` | fills `input[type="date"]` in the chips editor: the picker's input, then applied as a typed date is |
| `test/docs-e2e/lib/examples.mjs:993-994` | counts `thead input[type="date"]`: the picker's input still matches |

## Notes

- Captures: `test/.out/spec82/` is git-ignored, so the 72 captures stay in worktree 06. They come from one capture-only story (six places, two widths, a screenshot and a rect record of the box, its container and every button and caption near it) run under vitest, kept outside the repo and removed from the tree after each run.
- Files outside the owned list: `components/toolbar/ST_HeaderFilterEditor.tsx` per base (site map: an Escape in an input of a popup the field opened closed the whole editor; one condition, `currentTarget.contains(target)`, and the comment; radix has no `closeOnEscape`, its comment only). Needed by the nested popup check of 1.6.5.
- Blur (a4c07921): the picker's popup is a portal, so a move of focus into it is known only when its focus event bubbles to the box; the commit of a typed date on blur therefore waits one timer tick and the focus event cancels it. On React Aria the editor's focus scope puts focus back in the box on the next frame after a blur to nothing, and when that frame came before the timer the commit was cancelled: the typed date stayed unapplied (the failed play above; proved by a 100 ms timer, which fails the three range plays every time, and passes them with the fix). Now a blur with no next element commits at once; only a move to another element waits the tick.
- The table's own clear button never showed in a date box before (site map 419-420), so the picker's clear button is the one clear control per box; nothing is hidden.
- `min-w-35` stays on the date box: without it a range box in a narrow column is 74 px wide and its input 16 px.
- installation-e2e runs with `--no-diff` locally (P5).

## Attention

- In a narrow column a date filter under the header now shows only part of its date, because the picker's two buttons take 54 px of the box.
  - Seen at 390 wide: single box, input 122 px before, 68 px after (`dd/mm` visible of `dd/mm/yyyy`); range, Min 106 to 52 px, Max 138 to 84 px. The box, its height and its neighbours do not move. At 1280 the date shows in full. Captures: `.ai/plans/v0.9.x/anindosarker/reference/spec82-narrow-date-box/` (before and after, single and range, base; radix and aria the same).
  - The clear button keeps its 24 px while the box is empty (the picker hides it, it does not remove it).
  - Recommended: keep as built; the value is still typed and picked in full, and the calendar opens from the button. A wider minimum for date columns is a layout change of every date column (D164 does not re-decide the layout).
  - Other option: raise the date box minimum from 140 px so the full date shows; date columns under the header get wider and a table scrolls sideways sooner on a phone.
