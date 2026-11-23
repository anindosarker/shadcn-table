# 82: Date filters on the date picker, tracker

Status: running
Branch `v0.9/date-filters-on-date-picker`, worktree 06
Checks:

- Check: the is-empty play on the shipped code (P11), `ST_BASE=base pnpm exec vitest run stories/features/DateFilters.stories.tsx` at 36ca2818 with the play in the working tree: fail as intended (`Clear Empty Returns Date Default Mode`: expected `Filter Mode: Equals`, received `JoinedFilter Mode: Fuzzy`; 1 failed, 13 passed)
- Check: `ST_BASE=base|radix|aria pnpm exec vitest run stories/features/DateFilters.stories.tsx` at 6dcd219e with the play: pass (14 passed on base, radix, aria)
- Check: `git log --format=%s -1 --grep='D96' origin/claude/review..HEAD` at df801ff7: pass (prints nothing). Without the range the command prints `docs(plan): v0.9.x D96 superseded by D164`, a plan commit of `claude/review`, not of this milestone
- Check: site map below lists every date-box line of `ST_FilterTextField.tsx` and every story, example, docs and test site: pass
- Check: 36 before captures, `ST_BASE=<base> pnpm exec vitest run stories/features/Spec82Capture.stories.tsx` at df801ff7 on base, radix, aria (12 passed each): pass (`test/.out/spec82/before/<base>-<place>-<width>.png` and `.json`, 36 of each; the capture story is not committed, Notes)

- Task 1 the is-empty reset: done (6dcd219e the fix, df801ff7 the play)
- Task 2 site map and before captures: done (this commit)

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
