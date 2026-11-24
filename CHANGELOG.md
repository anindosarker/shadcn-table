# Changelog

All notable changes to shadcn-table are recorded here, newest first, in the
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. Entries are
written while the work happens, under `## Unreleased`, below `### Breaking`,
`### Removed`, `### Added`, `### Changed`, `### Fixed` or `### Docs`. The release pull request's
last check renames that heading to the version and the date; merging it
publishes the section as the GitHub release notes.

## Unreleased

### Docs

#### Spec 93

- In the docs theme panel, `C` and a pick in the Presets list change the colours only: the corner radius, style and fonts stay as they were, so one page can be compared in different colour sets. `R` still changes the whole look (D195).

## 0.9.9 - 2026-11-24

### Changed

#### Spec 87

- A date, date-time or time filter in a range (the `date-range`, `datetime-range` and `time-range` variants, and a date, date-time or time column in the Between or Between inclusive mode) is one date picker in range mode in place of two boxes, on Base UI, Radix UI and React Aria, in the chips editor, the header editor, the popover filter and under the headers. A date or date-time range is one box whose popup holds the Min and Max ends and a calendar for each; a time range is one picker with a time box per end. One end alone still filters; a picked day applies at once, a typed end on Enter or when focus leaves it. The filter value stays the pair `[min, max]`; filter modes, filter functions and saved views are unchanged (D183).
- For such a range, `stFilterTextFieldProps`, `stFilterDatePickerProps`, `stFilterDateTimePickerProps` and `stFilterTimePickerProps` are called once, with `rangeFilterIndex: 0`, and apply to the one box: a function that returned other props for index 1 no longer has a second box to apply them to (D183).
- `table.refs.filterInputRefs`: for a time range `<column id>-0` and `-1` hold the two end inputs as before; a date or date-time range holds its end inputs in its popup, so the box has none and `-0` is empty while the popup is closed (D183).
- Opening a date or date-time range filter in the chips editor or the header editor, or from the filter button in a header in subheader mode, puts keyboard focus on its range box, as 0.9.8 put it in the Min box. `filterInputRefs` and its type are unchanged (D189).
- Fixed: in the chips editor, changing the mode between a range mode (Between, Between inclusive) and a single mode (Less Than and the rest) empties the value, as the header mode menu already does; a Between pair switched to Less Than no longer leaves the table without rows (D190).
- Fixed: a `className` passed in `stFilterTextFieldProps` (or in a date picker's props) sizes the whole filter box on every filter kind, so a width class no longer pushes the calendar button past the box's border. The class lands on the box, no longer on the inner input, select trigger, multi-select chips or picker group: a class meant for the input's text now styles the box (D184).

## 0.9.8 - 2026-11-24

### Added

#### Spec 81

- Contributors: each base's tree holds the date picker of `anindosarker/shadcn-date-picker` at one pinned tag (`DATE_PICKER_TAG` in `tools/registry/lib.mjs`), written by `pnpm add-date-picker <base>` and checked by `pnpm test validate-repo`; a library file that imports `@/components/date-picker/...` gives its base's core item the picker item as a registry dependency (D164). Nothing a user installs changes yet.

### Changed

#### Spec 81.1

- Contributors: the pinned date picker tag is `v0.1.1` (no `process.env` read, right-to-left grid arrows); the trees are rewritten from it and the tree type-check no longer loads Node types.

#### Spec 82

- Date, date-time and time filters use the date picker of [shadcn-date-picker](https://github.com/anindosarker/shadcn-date-picker) in place of the browser's date box, on Base UI, Radix UI and React Aria: in the filter editor of the chips mode, in the popover filter, under the headers, and in both boxes (Min, Max) of a range. The box takes typed values as before and adds a clear button and a button that opens a calendar or a clock. A picked value applies at once; a typed value applies on Enter or when focus leaves the box. Filter values (`YYYY-MM-DD`, `YYYY-MM-DDTHH:mm`, `HH:mm`), filter modes and saved views are unchanged (D164).
- Installing the table installs the picker: each base's core item depends on `anindosarker/shadcn-date-picker/date-picker-<base>` at the tag `v0.1.1`, which adds `components/date-picker/`, the shadcn parts it uses and the packages `react-day-picker`, `date-fns` and `cn` to the app (D164).
- `stFilterDatePickerProps`, `stFilterDateTimePickerProps` and `stFilterTimePickerProps` keep their type. Passed on to the picker: `min`, `max`, `step` (date-time and time filters), `disabled`, `id`, `className` and `style` (on the picker's box), `aria-*` and `data-*` attributes, and `onFocus`, `onBlur` and `onKeyDown`, which now also fire for the picker's buttons and popup. No longer any effect: `value`, `onChange`, `type`, `ref`, `placeholder`, `name`, `readOnly`, `autoFocus` and the other input-only props, and `step` on a date filter (D175).
- The year of a typed date takes four digits and the box moves on to the next part by itself; the browser's box took up to six.
- Escape in a box inside a popup that a filter field opened, such as the time box of the date and time picker, closes that popup and leaves the filter editor open.
- Fixed: clearing an "is empty" or "is not empty" filter returns the column to its own default filter mode on every column type, `equals` for a date column, in place of `fuzzy` (D165).
- Fixed: a day picked in the calendar of a date filter applies at once, also when it is the day just typed in the box, which before waited for Enter or for focus to leave the box (Q171).

### Docs

#### Spec 70

- The home page header, and the 404 page that shares it, shows the library version after the name, as the docs header does: small muted text such as `v0.9.7`, read from the package at build time, linking to the GitHub releases (D152).

#### Spec 74

- On a phone the example toolbar is two rows with a More menu: previous, the example name and next, then Preview, Code, Both, the base switcher and a More button whose menu holds Open in Storybook, Copy prompt, Copy install command, Fullscreen and the open-in entries; tablet and desktop keep today's toolbar (D156).

#### Spec 76

- The docs site's analytics SDK `posthog-js` goes from 1.438.13 to 1.453.2 (D159).

#### Spec 77

- The docs site's PostHog proxy sends the remote config requests (`/ingest/array/*`) to PostHog's assets host, as PostHog's Next.js proxy guide does (D160).
- The docs site's PostHog init sets the dated `defaults: '2026-08-30'` of PostHog's Next.js install guide; page views on history changes now come from them (D161).

## 0.9.7 - 2026-11-19

### Docs

#### Spec 68

- The docs header shows the library version after the name, top left on every page and at phone width: small muted text such as `v0.9.7`, read from the package at build time, linking to the GitHub releases (D147).
- The Storybook toolbar shows the library version right after the base switcher, such as `v0.9.7`, on the three bases: a link to the GitHub releases, read from the package at build time (D150).

## 0.9.6 - 2026-11-19

### Fixed

#### Spec 66 Storybook Code tab

- The Code tab of every story in the three Storybooks shows the table's own code, complete enough to copy and run: the imports it needs, its columns, data, types and helpers, and the story's table as one component (the default export, named after the story). It no longer shows a wrapper such as `render: () => <BasicExample />`, a one-liner without its columns and data, or the story's test (D142).
- The 19 stories that showed the same table as another story in their group and only added a check are merged into the story they copy; each check now runs as a step of that story, and their pages under More examples are gone (D106, D142).

#### Spec 66 Docs code panels

- The Code view of every story page under More examples, and of every guide Example item that shows a story, shows that story's own code on the selected base, the same text as the Storybook Code tab, as one file named after the story. It no longer shows the whole story file with every story and test in it. The Production-Ready Tables guide keeps its five example files (D142, D131).

## 0.9.5 - 2026-11-18

### Added

#### Spec 59 Example ids and 404 page

- A wrong address on the docs site shows the site's own 404 page with the HTTP status 404, inside the home page's top bar (with the base select) and footer: "404", "This page does not exist", the docs search box and links to Get Started, Examples, Guides and API, in light and dark and on phones (D121).

#### Spec 62 Touch drag for columns and rows

- Columns and rows reorder by touch on phones and tablets, on Base UI, Radix UI and React Aria: a finger on a grip drags at once, a finger resting on a draggable header cell for about 300 ms drags it, and a copy of the dragged header or row follows the finger until the drop. A drag from a grip does not scroll the page by itself: a row held near the top or bottom edge scrolls the table, or the page when the table has no scroll of its own, as a mouse drag does; a swipe anywhere else, and on a header cell before the hold, scrolls as before. The handlers passed in `stColumnDragHandleProps` and `stRowDragHandleProps` run for a touch drop too, with the pointer event in place of the drag event. Mouse dragging is unchanged (D108, D132).

#### Spec 62 Touch drag in menus and toolbars

- The columns in `Show/Hide columns`, the sort rules in the sort popover and a column dropped on the grouping drop zone reorder or group by touch too, on Base UI, Radix UI and React Aria: a finger on a menu grip or a sort rule handle drags at once, a copy of the menu row or rule follows the finger, and the menu or popover stays open. The drag does not scroll the page behind the popup. A touch drag that leaves the drop zone, or is cancelled over it, groups nothing. Mouse dragging is unchanged (D108, D132).

### Changed

#### Spec 58 Docs content fixes

- On every guide the Example section follows the first intro paragraph; notes and further intro blocks come after it, word for word (D117).
- The Basic example's Try it steps add a column filtering step and end with a search for `Ohio` (D118).
- Three example pages take their sidebar name as title and address: Server-Side Pagination Example at `/docs/examples/server-side-pagination`, Inline Editing Example at `/docs/examples/inline-editing` and Virtualization Example at `/docs/examples/virtualization`. The old addresses `react-query`, `editing-crud-inline-row` and `virtualized` redirect permanently (D119).

#### Spec 54

- Every example page lists two to four Try it steps directly above its table and links its guides under Related guides below it; the View Extra Storybook line is gone, the toolbar's Storybook button replaces it. Titles, descriptions and the page text are unchanged (D104).
- The six format comparison pages and the Format previews sidebar group are removed.

#### Spec 63 Storybook upgrade

- The project Storybook moves from 10.6.2 to 10.6.7, the latest stable release: `storybook` and every `@storybook/*` package, with `@storybook/addon-vitest` still pinned exact. No configuration change was needed; the story tests, the three static builds and their story ids, and screenshots of a fixed set of stories are the same as before on Base UI, Radix UI and React Aria. The `glob` advisory that comes in through Storybook's docgen plugin (Storybook issue 37409) is not fixed by 10.6.7 and stays until Storybook updates the plugin; it is a development dependency only (D123).

#### Spec 64 Guide stories

- Four new stories show their feature in use on load, each with its docs page under More examples: Sorted On Load (the Sorting guide's table, sorted by State, then by City descending), Column Hidden On Load (Address hidden, listed unticked in the columns menu), Column Widened On Load (First Name at 400 px) and Searched On Load (the search box open with `John`). Each has a play and Try it steps (D140).

#### Spec 64 Guide examples

- Thirteen guides open with a table that shows their feature in use on load: Column Size, Density Toggle, Overflow Tooltip, Filter Chips, Global Filtering, Sort Editor, Row Selection, Toolbar Customization, Row Actions, Display Columns, Sorting, Column Hiding and Column Resizing. Row Selection and Sorting no longer show that table a second time further down; Row Selection's explainer line moved up with it (D140, D122).

#### Spec 55 Guide example block

- An example shown twice on one docs page has two different element ids: the first keeps `example-<name>`, a further one gets a suffixed id (D105).

#### Spec 55 Guide pages

- Every guide opens with a live example: an Example section right before its first section shows the best example for the guide, linked to its example page or its story page under More examples. A table the guide showed only as a copy of that example is removed; the guide's text is unchanged (D105).
- Guide sections are h2 and their sub-sections h3.
- When the plain id of an example passes from one mount to another (a picker swap), the next mount takes it over, so no two elements ever share it.
- The five guide comparison pages are removed.

### Fixed

#### Spec 59 Missing docs page

- A wrong docs address loaded directly, such as `/docs/examples/sticky-heder`, now gets the site's 404 page from the server with the HTTP status 404, as any other wrong address does; the saved design system and sidebar width apply on it, and the browser console no longer reports a script tag.

#### Spec 53 Section tab hover

- The first section tab (Get Started) on the docs site has the same padding on both sides as the others, so its label sits centred over its underline and inside the hover fill, the same fill as the page bar's other controls.

#### Spec 52 Docs filter facts

- The column filtering guide says `'date'`, `'datetime'` and `'time'` columns default to `equals` and compare by local day, to the minute or by time of day, also when the accessor returns a `Date`; text columns keep `fuzzy` (D94).
- The React Query example offers only the Contains filter mode on its five text columns, the one mode its mock API applies (D95).
- On the React Query example those five text columns also filter with `contains`, so the one mode offered, Contains, shows as active (D99).

#### Spec 53 Sidebar state script

- The docs sidebar's saved width and collapsed state now apply when the docs are opened from the home page, and the browser console no longer reports a script tag on that step.

#### Spec 57 Stories match their examples

- The column pinning example and its story lock the ID column with `enablePinning: false`; the option it set before, `enableColumnPinning`, does nothing on a column, so the ID column could still be pinned (D114).
- The chart detail panel story draws its chart with recharts and the five editing CRUD stories confirm a delete in a modal alert dialog, as their docs examples do. Both are story-only: nothing changes in what the registry ships (D115).
- The first line above every Storybook story reads "View documentation for this example", the whole line one link to the story's docs page (D124).

#### Spec 59 Example ids and 404 page

- An example shown in a guide's Example section and again further down carries two different element ids already in the served HTML: `guide-example-<name>` in the Example section, `example-<name>` elsewhere; example pages and inline examples keep `example-<name>`, so links to `#example-<name>` still work (D113).

#### Spec 59 Lighter story pages

- The 596 story pages no longer each carry the whole "More examples" list of the Examples sidebar: the served page holds the current row with its number and sub-group label, and the browser lists every row right after. The docs build's story pages drop from 1166 MB to 245 MB; the sidebar looks as before (D116).

#### Spec 60 Sticky header switch and resize grip

- `enableStickyHeader` sets how the table starts; the `Sticky header` switch in `View settings` then turns the sticky header off and on, also when the option is `true`. Full screen still keeps the header sticky (D120).
- A column's resize grip starts a drag from anywhere on it, its right half included, on pinned and sticky header cells too; the hairline is drawn at the same pixel as before (D126).

#### Spec 60 Sub-row selection and copy button

- Ticking a parent row ticks all its sub-rows, unticking it unticks them, and ticking the last unticked sub-row ticks the parent; before, ticking a parent left its sub-rows unticked (D125).
- The Click to copy button stays inside a narrow cell and truncates its text, and hovering it shows "Click to copy" instead of the cell's overflow tooltip on Base UI, Radix UI and React Aria (D127).

#### Spec 61 Pinned rows with row virtualization

- With `enableRowVirtualization` and a sticky `rowPinningDisplayMode`, a pinned row stays in view at the top or the bottom of the body while the other rows scroll, as it does without virtualization, also for several pinned rows, with the sticky header, and for a row far outside the rendered range; before, it scrolled away. The Row Pinning guide no longer says the two do not combine (D128).

#### Spec 61.1 Select all in select-sticky mode keeps the table virtualized

- With `enableRowVirtualization` and a sticky `rowPinningDisplayMode`, pinned rows stay in view while they fit in the table's scroll box; a taller stack scrolls with the virtualized rows instead, so the table stays virtualized. For example, Select all in `'select-sticky'` mode no longer renders every row at once. On Base UI, Radix UI and React Aria.

#### Spec 62.1 Column auto-scroll stops when the drag leaves the table

- A column dragged out of a table that scrolls sideways, for example onto the grouping drop zone, no longer keeps scrolling the table from the last pointer or finger position inside it; the table scrolls again when the drag comes back over its edge, on Base UI, Radix UI and React Aria.

#### Spec 62.2 Touch drag blocks page scroll from before the touch starts

- A touch drag keeps the page still once it has started even when an element under the finger stops the `touchmove` event, and a header cell that cannot drag no longer keeps a page-wide touch listener, on Base UI, Radix UI and React Aria; the listener stays on the page from before the touch starts, as WebKit on iOS needs (D108, D132).

### Docs

#### Spec 53 Preview lands on review

- The docs have four sections, Get Started, Examples, Guides and API, in a tab row under the top bar; the row starts with the sidebar's hide and show button and has a dashed rule below it (D101).
- Each section has its own sidebar: flush groups, sticky group labels with a dashed line while stuck (also in Firefox and Safari), no heading row; the sidebar hides, resizes between 220 and 480 px and keeps both over a reload (D102).
- The Examples sidebar opens on Featured, groups the examples by demand with short row labels, and `/docs/examples` opens the first example, Basic (D103).
- The Guides overview lists every guide under its group heading again, read from the sidebar's order.

#### Spec 53 Footer link and square corners

- The home page footer's Storybook link opens the Storybook of the selected base, no longer always the Radix one; its first Docs link reads "Get Started" (D107, D101).
- The last rounded frames in the docs content are square: the tab frames and panels, the code tab frames, the code block copy chip, the agent bar and inline code in the prop tables. The table frame and the scroll controls stay rounded (D107).

#### Spec 56 Story group names

- Storybook story groups are in Title Case with spaces and without the word "Examples" ("Features/Aggregation Examples" is "Features/Aggregation", "sticky-footer" is "Sticky Footer", "useEffects" is "Use Effects"); the folder "Fixed Bugs" is "Miscellaneous" (D106).
- Story links follow the new names: the docs toolbar Storybook button opens the same story as before, and the Storybook GitHub link opens the folder of the story shown (D106).

#### Spec 56 Story pages in the docs

- Every Storybook story without an example page has a docs page under "More examples" (594 pages), in Storybook's groups and order; each shows the story itself in the example playground, its story file in the Code tab and a Storybook button to it, on the selected base (D106, D103).
- "More examples" keeps the open or closed state the visitor left it in after a reload; its group labels have no toggle (D103).
- Each Storybook story's intro line links its docs page (D106).
- `pnpm test validate-repo` fails when a story has no docs page or a page has no story, and `pnpm test storybook-static` checks the pages against the built Storybook (D106).

#### Spec 56 Exact stories and merged copies

- Every docs example has one exact story with its columns, options and data, each with a play; new groups "Features/Customization", "Features/Export", "Features/Server Data" and "Features/Localization" hold the examples no group covered, and the server examples serve their rows from inside the story (D106).
- The docs toolbar Storybook button of each of the 42 example pages opens that page's own story; no two pages share one (D106).
- 59 stories that only copied another story's table are gone; a copy's check, where it had one, is now a step of the play on the story it copied (D106).
- The Localization guide's example is the new story "Features/Localization / Spanish" (D105).

#### Spec 56 Story fixes

- The Styling story pages under "More examples" show their styles (row and cell colors, stripes, widths, caption position); the docs style sheet now reads the story files.
- Seven stories do what their names say: the custom global filter no longer throws on the Age column, the secondary color checkbox and the lime green sort arrow show on every base, the drag buttons of Columns Hold While Dragging sit below the table out of the drop zone's way, the custom aggregate cell counts each group, Click To Copy Disabled Per Column copies the other columns, and the two Original row number stories have their virtualization the right way round.
- `pnpm test typecheck` type checks the story files, and the docs type check now covers the React Aria story copies too.

#### Spec 56 Story text checklist

- `pnpm test validate-repo` fails a story page under "More examples" that has no description, not 2 to 4 Try it steps directly above its table, or no Related guides links below it, and names the page (D104, D106).
- Plays guard three of the fixed stories: Custom Global Filter Fn, Click To Copy Disabled Per Column and Column Grouping Enabled Custom Aggregate.

#### Spec 53 Example row numbers

- Each Examples sidebar row starts with its running number ("1. Basic"), counted through the whole section in sidebar order, and each Examples group label ends with its row count ("Featured (5)"); both are computed from the sidebar's order and show in the sidebar only, never in Get Started, Guides or API (D103).
- The sticky sidebar labels check their dashed line only on a scroll of the sidebar, no longer on every page or table scroll.

#### Spec 55 Guide tables shown once

- The Async Loading, Pagination and Scroll Cues guides show their main table once, in the Example section at the top; the copy further down is gone, and its explainer line now sits between the Example heading and the table (D122).

#### Spec 55 Click to Copy guide

- The Click to Copy guide shows its own click to copy example on top, in place of the Advanced example, and no longer repeats it at the end; every cell of that example copies, since click to copy is on for the whole table (D122).

#### Spec 55 Production-Ready Tables guide

- The Production-Ready Tables guide shows its own server-side table once, in the Example section at the top, under the line about the network tab; the React Query example is no longer shown there (D130).
- The guide's Code view still lists the five files of the `server-side-data` example the guide walks through (D131).
- New story Features/Server Data / Production-Ready Table, with its page under More examples: the guide's table, whose play checks that each page change, sort, search and filter change sends exactly one request to `/api/users`.

#### Spec 63 Docs branch catch-up

- Three new story pages under More examples, each with its description, Try it steps and Related guides: Touch Hold On Range Slider, Touch Drag Scrolls Page and Row Pinning Select Sticky With Virtualization (D139, spec 61.1, D104).
- The description and Try it steps of Sub Row Tree With Selection and the Try it steps of Row Pinning Sticky With Virtualization describe the fixed behaviour: ticking a row ticks its sub-rows, and a pinned row stays in view while the virtualized rows scroll (D125, D128).
- The docs app's Storybook packages, used to mount the stories, move to 10.6.7 with the library's (D123).

## 0.9.4 - 2026-11-13

### Added

#### Spec 39 Typed filters wait for you to finish typing

- A new hook, `useST_DebouncedCallback(fn, wait)`, returns `run`, `flush`, `cancel` and `isPending`; it calls the latest `fn`, reads `wait` on each call and flushes a pending call on unmount. Typed column filters (text, number, autocomplete, each range end) and the global search use it (D88).
- Table options `columnFilterDebounceMs` and `globalFilterDebounceMs` and column option `filterDebounceMs` set the wait; the default is 500 ms for both, with or without `manualFiltering` (was 200 ms, 400 ms for filters and 250 ms, 500 ms for search) (D88).
- Enter and blur apply a typed filter or search at once. The field's clear button, Clear filters, Remove filter, the column menu clear, a stored view, the search clear button, Escape and closing the search drop the pending call, so a cleared filter no longer comes back (D88).
- Date, datetime and time filters apply a complete value: a typed value applies on Enter, blur or when its chip editor closes, a value picked in the native picker at once, never a half-typed year (D88).
- A controlled `state.columnFilters` rebuilt on every parent render (equal content, new array) no longer drops a typed filter inside the wait.
- The chips mode editor focuses its input once when it opens, not on every table change: typing Min and then clicking Max no longer moves focus back to Min.
- Select and multi-select filters apply the picked value at once instead of after a 1 ms timer.

### Changed

#### Spec 45 Filter Mode caption gap

- The "Filter Mode: <mode>" caption under a filter input sits 6 px below it instead of 3 px (`mt-1.5`), in the text field, the range fields and the range slider on the three bases (D85).

#### Spec 49 Home hero wording

- The home hero line above the `shadcn-table` heading reads "The open-source shadcn data table for React, built on TanStack Table." and the sentence below it reads "A production-ready data table library built with TanStack Table and shadcn/ui. Sorting, filtering, pagination, grouping, pinning, virtualization, and more, all built in." (D90). The heading, the title tag and the meta description are unchanged.

#### Fix D91

- The table context and the defaults context move to a `context/` folder, one file per context (three bases). `hooks/stTableHook.tsx` becomes `context/ST_TableContext.tsx` (`tableContext`, `useTableContext`, `useSTContext`, `ST_TableProvider`) and its factory `createSTTableHook` moves to `hooks/createSTTableHook.ts`; `hooks/useST_Defaults.tsx` becomes `context/ST_DefaultsContext.tsx` (`ST_DefaultsContext`, `ST_DefaultsProvider`, `useST_Defaults`). Every exported name is unchanged, so imports through `index.ts` keep working; an import from one of the old file paths moves to the new one. A project that installed the library through the shadcn CLI keeps its two old files after an update until it deletes them.

### Fixed

#### Spec 40 Date filter compare

- Date, datetime and time filters now work on columns that hold `Date` values (D81): `equals`, `notEquals`, `greaterThan`, `greaterThanOrEqualTo`, `lessThan`, `lessThanOrEqualTo`, `between` and `betweenInclusive` read a `YYYY-MM-DD` filter value as local midnight and compare by calendar day, an `HH:mm` value by time of day and a `YYYY-MM-DDTHH:mm` value to the minute (to the second when the value has seconds). Before, they compared the filter string with the date's text form, so "greater than" kept every row and "less than" none. A string row value holding a full ISO date and time (`2025-11-02T14:15:00.000Z`) compares the same way, as a date. Filter values stay strings; number columns and date-only `YYYY-MM-DD` string columns filter as before (three bases).
- A column with `filterVariant: 'date'`, `'datetime'` or `'time'` and no `filterFn` filters by `equals` (by day for a date) instead of `fuzzy`, which matched no `Date` row.
- `greaterThan`, `lessThan` and the other comparison modes on a column of ISO date-time strings (`2025-11-02T14:15:00.000Z`) now compare dates by local day, time or minute instead of comparing text; a date column of such strings without a `filterFn` matches by day instead of by prefix.

#### Spec 40 React Query route dates

- The React Query example's Last Login filter shows only matching rows in every mode it offers (D81). The example now offers the eight date comparison modes and sends the chosen mode with each filter; its mock route compares by that mode (it always kept later dates before), reads a `YYYY-MM-DD` value as local midnight, compares by calendar day, and keeps its random `lastLogin` dates for the life of the server instead of drawing new ones on every request (three bases).

#### Spec 41 Range filter editors fit and accept input

- In the chips mode, the value editor of a time, date or datetime range (the `*-range` variants or a between mode) is 308 px wide instead of 260 px, so both Min and Max fields and their picker icons lie inside it (capped at the viewport width less 1 rem); every other filter keeps the 260 px editor (D86, three bases). Typing into both fields applies the range on Enter or blur since spec 39.

#### Spec 42 React Aria multi-select filter opens on click

- On React Aria a click into the multi-select filter's input opens its option list, as on Base UI and Radix; before, only ArrowDown or the chevron opened it (D82).

#### Spec 43 Escape closes the filter editor after a select pick

- After a value is picked in a select filter, one Escape closes the chips mode value editor on Base UI and React Aria, as on Radix; an Escape while a select or combobox list is open closes only the list (D83).

#### Spec 44 React Aria select filter chevron

- On React Aria the select filter's chevron sits at the right end of its input instead of right after the placeholder (D87).

#### Fix Q76

- The docs app's type check (`types:check` and the one in `build`) no longer runs out of memory at Node's default heap. The three library copies declare the same `@tanstack/react-table` feature maps, so in one program every copy's types were compared with the first copy's (21.7M instantiations, about 4.3 GB of heap against a 4.2 GB limit). The build's program now holds the app and the radix copy; the new `types:bases` checks the base and aria copies with their examples, one copy per program as an install has it (14.4M instantiations, peak heap about 1.9 GB). The same files are checked as before.

### Docs

#### Spec 46 Live demo with ten columns

- The live demo on the Introduction and Usage pages has ten columns (D84): First Name, Last Name, Email, City, State, Department, Age, Salary, Joined, Status. Department has a select filter and Salary a range filter shown in US dollars; the four filters of before work as they did. At the docs content width the table scrolls sideways, so pinning, hiding and reordering have columns to act on; no column is pinned by default (three bases).

#### Spec 47 Comparison page

- A Comparison page, last in Getting Started, compares shadcn-table with TanStack Table, the shadcn/ui data-table recipe, Material React Table and AG Grid; every cell is sourced from the project's own docs or repository, and the page `<title>` names the compared libraries through the new optional `searchTitle` frontmatter field (D71).

## 0.9.3 - 2026-11-12

### Added

#### Spec 26 Home page Open Graph image

- The home page has a social preview image: `app/opengraph-image.tsx` renders a 1200x630 PNG card like the docs cards, and Next.js adds `og:image` and `twitter:image` to `/` from it (D55).

#### Spec 28 Security response headers

- Every response of the docs site carries `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN` and `Permissions-Policy: camera=(), microphone=(), geolocation=()` (D57). No `Content-Security-Policy` yet.

#### Spec 25 JSON-LD structured data

- The home page and every docs page carry Schema.org JSON-LD: `/` a `WebSite` and a `SoftwareSourceCode`, each docs page a `TechArticle` and a `BreadcrumbList` (Docs > section > page, absolute URLs), typed with `schema-dts` (D54).

### Changed

#### Spec 30 API page payload

- The API option tables (table, column and state options; table, column, row and cell instance APIs, and their subsets on the guide pages) render a light HTML table first, name, type and description per option with the `<name>-prop` style anchors, and hydrate into the interactive table with search, copy and pinning as before (D59). `/docs/api/table-options` HTML drops from 1.94 MB to 268 KB.

#### Spec 30 Home JavaScript

- The home page loads less JavaScript: the nav and hero links prefetch the docs on hover, touch or focus instead of as soon as they show, so the docs route's scripts no longer download with the home page. Lighthouse (desktop) script transfer for `/` drops from 711 KB to 580 KB; `jspdf`, `jspdf-autotable` and `recharts` stay out of the home load (D59, D62).

#### Spec 33 Home title, hero line and description

- The home page title and `og:title` read "shadcn-table: React Data Table for shadcn/ui and TanStack"; docs page titles keep `<page> | shadcn-table`. The hero line says "The open-source React data table for shadcn/ui, built on TanStack Table."; the H1 stays "shadcn-table" (D73).
- The search description of `/` (`description`, `og:description`, `twitter:description`) reads "Open-source React data table for shadcn/ui, built on TanStack Table. Sorting, filtering, pagination, grouping, pinning. Installs as source via shadcn CLI." (D73). It is one shared `siteDescription`, read by the root layout, the home page metadata and JSON-LD, the OG image and the `llms.txt` summary (D76).

#### Spec 34 posthog-js loads after hydration

- Analytics load after the page is interactive: posthog-js is fetched in its own chunk on the first idle moment or interaction, and events raised before that are queued and sent on init. The home page's first script load drops from 421 KB to 317 KB (Lighthouse desktop, before the deferred loads) (D70).

#### Spec 35 Example sources are read per example

- Docs builds no longer trace the whole examples tree: the example generator writes each base's code-view sources to one file, read from a fixed path, so the build's "file pattern matches 10568 files" warning is gone. The code view shows the same files (D69).

#### Spec 36 validate-repo fails on a stale generated registry

- The repository check (`pnpm test validate-repo`, run by CI) regenerates the registries with `pnpm -w registry:build`, `registry:items` and `registry:hosted` and fails on a diff, naming each stale tracked file, such as `apps/shadcn-table-docs/registry.json` after an example description changed without a regeneration (D68).

### Fixed

#### Spec 29 Markdown delivery and llms.txt shape

- A docs page served as Markdown (`Accept: text/markdown` or `/llms.mdx/docs/.../content.md`) now answers `Vary: Accept` and `text/markdown; charset=utf-8`, so a cache no longer hands Markdown to a browser or HTML to an agent (D58).
- `/llms.txt` follows llmstxt.org: the `# shadcn-table` heading, a one-line summary, then one section per docs folder (Getting Started, API Reference, Quick Examples, Guides) with a link and description per page, on absolute URLs (D58).
- `/llms-full.txt`, the per-page Markdown and the "Copy page" button carry plain Markdown: MDX imports, JSX components and frontmatter are gone; headings, prose, component prose (a callout body) and code blocks stay (D58).

#### Spec 24 Canonical URLs and trailing-slash redirect

- Every docs site page names its canonical URL: the root metadata sets `alternates.canonical` to `./`, so `/` and each docs page carry one `<link rel="canonical">` with their own slash-less URL on `NEXT_PUBLIC_SITE_URL`. A path with a trailing slash answers 308 to the slash-less path; the PostHog proxy under `/ingest` keeps its slash (D53).

#### Fix D66 The docs proxy runs only on docs paths

- The docs site's `proxy.ts` (Markdown delivery for `Accept: text/markdown`) runs only on docs paths instead of on every request, so pages, assets and the `/ingest` proxy no longer pass through it; a docs URL still answers Markdown to an agent (D66).

#### Fix Docs build type check

- The docs builds and `types:check` read `tsconfig.build.json` (the preview build `tsconfig.preview.json`), which exclude the other build folders, so a stale `.next` or `.next-preview` folder naming deleted routes can no longer fail them.

#### Fix D77 Filter mode menu position in the popover filter

- With `columnFilterDisplayMode: 'popover'` on Base UI and Radix, the filter mode menu opens next to its "Change filter mode" button instead of several hundred pixels away; the menu's anchor renders in `document.body`, out of the popover's transformed positioner. React Aria was already right (D77).

#### Fix D79 Docs app drops the unused zod dependency

- The docs app no longer lists `zod` as a dependency; nothing in it imports `zod` since spec 32 removed the page byline (D79).

#### Fix D80 Filter mode menu opened during the popover animation

- A click on "Change filter mode" while the filter popover still animates in now opens the menu next to the button: the menu's anchor is measured again when an animation around it ends, and on React Aria it renders in `document.body` like on Base UI and Radix (D80). React Aria showed the menu about 117 px off before.

### Docs

#### Spec 31 Page frame and new pages

- `/docs` redirects permanently (308) to the Introduction, and the sidebar's last entry links the changelog (D60).
- New guide: "TanStack Table with shadcn/ui", last under Fundamentals (D60, D72).
- The Introduction shows the install command and the basic example; the getting-started pages have new descriptions (D60).

#### Spec 32 Docs wording

- Inherited typos fixed on six pages: the Detail Panel, Lazy Detail Panel and Lazy Sub Rows example descriptions, and the Column Ordering, Editing and Column Size guides (D74).

#### Fix D78 Richer live demo on Usage and Introduction

- New example `live-demo` (registry item `example-live-demo`, all three bases): 20 members with text filters on First Name and Last Name, a select filter on State, a range filter on Age, a date filter on Joined and a multi-select filter on Status (D78).
- The Usage page's Live Example and the Introduction's demo show it in place of the Basic Example; the tutorial steps and the Basic Example itself are unchanged (D78).

## 0.9.2 - 2026-11-09

### Added

#### Spec 21 Sitemap and robots for the docs site

- The docs site serves `/sitemap.xml` (the home page and every docs page, absolute URLs on `NEXT_PUBLIC_SITE_URL`) and `/robots.txt` (allow all, disallow `/ingest/` and `/r/`, sitemap URL) from Next.js metadata routes (D50).

### Removed

#### Spec 22 Remove the /dev preview routes

- The docs site no longer serves the `/dev` homepage variant index and the `/dev/theme` and `/dev/theme/1` to `/dev/theme/9` theming previews; they return 404. Their dev-only theme-demo components are deleted with them; git history keeps them.

## 0.9.1 - 2026-11-08

### Added

#### Spec 12 Stored view persists rows per page

- `persistViewSettings` stores rows per page (D25): `ST_StoredView` gains `pageSize?: number`, saved on every page size change and applied at mount over `initialState.pagination.pageSize`, on the three bases. The page index is not stored, and a page index change alone writes nothing. A stored view without `pageSize`, or with one that is not a positive integer, keeps the initial page size. Reset view returns the page size to `initialState`. The view settings guide, the state management guide and the `persistViewSettings` API entry list the new field.
- A restored rows per page keeps the initial page index instead of remapping it to keep the top row (F22).
- The `PersistenceKeepsPageIndex` play covers it: a table on its third page with a stored rows per page remounts on the third page (D33).

#### Spec 14 ST_DefaultsProvider; the docs icon library select

- New: `ST_DefaultsProvider` and `useST_Defaults`, exported from the library index on all three bases (D27). The provider's `icons` prop (`Partial<ST_Icons>`) applies to every table below it: `useST_TableOptions` merges `ST_Default_Icons`, then the nearest provider's `icons`, then the table's own `icons` option, which still wins key by key. Nested providers merge over their parent; a table outside any provider behaves as before. The `ST_Defaults` type is added beside `ST_Icons`. Documented in the ST Components API page and the custom icons guide; the `ProviderIconSet` story covers it.
- Docs: the theme panel's Icon Library select is enabled and offers Lucide, Tabler, Phosphor, Hugeicons and Remix Icon. A pick switches the icons of every example table (the home demo and the docs examples, all three base copies), persists with the rest of the theme config, and Reset returns to Lucide; Random keeps the current icon set. The docs chrome stays Lucide. `pnpm lib:install <base>` also installs the four icon set maps as `components/ui-<base>/shadcn-table/icons/<set>.ts`, loaded only once picked. `@tabler/icons-react`, `@phosphor-icons/react`, `@hugeicons/react`, `@hugeicons/core-free-icons` and `@remixicon/react` are new dependencies of the docs app.

### Changed

#### Spec 19 PR Summary reads job outputs

- Every test job hands its record to PR Summary as a job output instead of the artifact `test-out-<job>` (D38): a last step (`if: always()`) runs `tools/release/record-output.mjs`, which prints the `test/.out/` record as one line `<key>=<JSON>` with at most five errors of 400 characters each, appended to `$GITHUB_OUTPUT`. Lint, Validate Repo and Validate PR output `record`; Typecheck, Storybook Tests and Docs E2E Tests output `base`, `radix` and `aria`, Installation E2E one output per scenario, each mirrored under `workflow_call.outputs`. PR Summary passes `toJSON(needs)` as `NEEDS` to `pr-summary.mjs`, whose new `recordsFromNeeds` reads every output (a local run without `NEEDS` still reads `test/.out/`). A failed leg's output still reaches the caller (GitHub run 42509826313). The `test-out-*` uploads of `pr.yml`, `typecheck.yml`, `storybook-tests.yml` and `docs-e2e.yml` and PR Summary's download go; `installation-e2e.yml` keeps its upload, which carries the captures of the reference refresh.

#### Spec 18 PR Summary: grouped table, failures, changelog

- The sticky PR Summary comment (`tools/release/pr-summary.mjs`) is a grouped table (D37): the PR title, one line with the release label, the run link and the status (all green, jobs failed or skipped), one `Job | Result` table with a bold group row per matrix job and its bases or scenarios under it, a collapsed block listing every error line of the failed jobs, and a changelog section with the `## Unreleased` counts by heading and the entry titles. Without `## Unreleased` it reads the top version section. The Prepare Release row of the draft is left out: the comment is written before that job runs.
- On a label event the rows of the other jobs and the failures block are kept; the title, the status line, the Validate PR row and the changelog section are rebuilt.

#### Spec 16 CI: test jobs skip the version bump commit

- A new first job of `pr.yml`, `head`, reads the pull request's head commit and sets `bumped` when it is the `chore: version <v>` commit Prepare Release pushes as `github-actions[bot]` (D35). On that commit Typecheck, Storybook Tests, Docs E2E Tests and Installation E2E skip every matrix leg (a `skip` input on the four called workflows), Lint and Validate Repo skip, Validate PR and PR Summary still run, and Prepare Release is skipped with its needs, so the bump push runs no second test pass and prompts nobody. Any other head runs every job as before.

#### Spec 17 CI: Node 24 action majors

- Every `uses:` in `.github/workflows/*.yml` moves to the major that runs on Node 24 (D36): `actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-artifact@v7`, `actions/download-artifact@v8`, `actions/cache@v6`, `pnpm/action-setup@v6`. No `with:` input changes; pnpm still comes from `packageManager`, and the jobs keep `node-version: 22`. The "Node.js 20 is deprecated" annotations of each run go away.

### Fixed

#### Fix F22 Restoring a stored rows per page remaps the page index

- A stored rows per page restored at mount keeps the initial page index: `applyView` sets the page size through `setPagination` instead of `setPageSize`, which remapped the page index to keep the top row (three bases).

### Docs

#### Spec 11 Persistent view example: ten rows

- The persistent view example opens at 10 rows per page instead of 50 on every base (D24, F14); the stored view still does not keep the page size. The docs E2E check of `/docs/examples/persistent-view` clears the stored view, reloads and asserts 10 body rows and a rows-per-page select reading 10.

#### Spec 08 Theme panel: Copy and Import removed

- The theme panel drops the Copy menu (Copy CSS, Copy preset code) and the Import popover (D21); the toolbar row keeps Undo and Redo, the Presets row Random and the preset select. `encodeConfig`, `decodeConfig` and `importPreset` are gone; Random still picks from create's curated presets half the time.

#### Spec 13 Docs parts carry the design-system hooks

- Style, Menu Color and Menu Accent in the docs theme panel now reach the docs parts (D26). `pnpm lib:install <base>` gains a second phase: every shadcn part it installs under `components/ui-<base>/` is replaced by its hooked source from shadcn-ui/ui `apps/v4/registry/bases/<base>/ui/` at a pinned commit (`SHADCN_UI_SHA`), with the imports pointed at the docs folders and each icon placeholder turned into its Lucide icon, so the parts carry the `cn-*` classes the style layers target and `cn-menu-target` for the menu color loop. The library copy in `shadcn-table/` is unchanged. The docs E2E check of `/docs/guides/view-settings` picks a Style, Menu Color `inverted` and Menu Accent `bold` in the theme panel and reads the open menu.

#### Spec 09 Theme panel: shortcut row, Mod+Z undo

- One row under the theme panel's header holds Reset (`Shift+R`), Undo (`Mod+Z`), Redo (`Mod+Shift+Z`), Random (`R`) and Next preset (`C`) (D22): icon buttons named by their label, each with a tooltip carrying the label and its key, since the labeled buttons do not fit the 360 px panel. The header keeps the title and the close button, the Presets row the preset select. Undo moves from `P` to `Mod+Z` (Cmd on macOS, Ctrl elsewhere), redo gains `Mod+Shift+Z`, and `P` is no longer bound.

#### Spec 10 Theme panel: color picker

- Each token swatch in the theme panel's Colors tab is a button (`Pick <token>`) that opens a popover with a `react-colorful` hex picker above a copy of the token's text field (D23, F13). Dragging writes the token live as hex; closing the popover records one undo step, so `Mod+Z` returns to the value from before it opened. Typed values keep one undo step per change (A10), and an invalid value still applies nothing. `react-colorful` 5.8.1 is a new dependency of the docs app.

#### Spec 15 Docs: one style sheet per style, loaded on demand

- Docs: the root stylesheet no longer carries the eight theme styles (D29). `lib/build-styles.mjs` compiles each `styles/style-<name>.css` against the docs' Tailwind theme into `public/styles/style-<name>.css` (generated, git-ignored; run by `predev` and `build`, minified in `build`), and every page links only the active style's sheet: the pre-paint script links the stored or default style render-blocking, and a style change loads the new sheet before it switches the `style-<name>` class. The root stylesheet of `/` drops from about 2.8 MB to 337 KB; opening the theme panel and toggling light and dark stay under 300 ms of long tasks. `@tailwindcss/node` is a new devDependency of the docs app.
- Docs E2E: the perf budgets are 600 ms under --ci (F28).

## 0.9.0 - 2026-11-08

### Changed

#### Epic 01 Filtering

- Filter modes are on by default (D4): `enableColumnFilterModes` defaults to `true`, so the mode picker shows in the chips, subheader and popover display modes without the flag; `enableColumnFilterModes: false` on the table or a column hides it. Material React Table defaults it off; this is a deliberate deviation. The mode lists stay as they were: every mode for text, autocomplete, select, date, datetime and time, the two between modes for the range variants, none for range-slider and checkbox. A chip now names the mode ("Status fuzzy: Done").
- A multi-select filter offers Includes any (`arrIncludesSome`, still the default), Includes all (`arrIncludesAll`) and Excludes (the new `arrIncludesNone` filter fn) after its 14 modes; `ST_Localization` gains `filterArrIncludesNone`, `filterArrIncludesSome` reads "Includes any", and every locale carries the three labels.
- Removing a filter chip, or "Clear filters", puts the column back on its initial filter mode instead of the first mode of its list, so a multi-select or select column keeps its default fn.
- Fixed (D1, F1): a select filter with a value shows its chevron left of the clear button instead of under it; the trigger takes `ltr:pr-9 rtl:pl-9` in place of `pe-9`, which lost to the shadcn trigger's `pr-2`.

#### Epic 02 Pagination

- The `pages` footer, the default, shows the row range between Rows per page and the page buttons (D6): `1-10 of 200`, localized, following the filtered count, `1-2 of 2` on one page.
- `paginationDisplayMode: 'default'` is renamed `'compact'`, with no alias (D6): the option type is `'compact' | 'custom' | 'pages'` and `'default'` is a type error. The stories, the pagination guide, the API entry and the alternate-pagination example name the compact footer `'compact'`, and the pagination story names drop "Default" (D7).

#### Epic 03 Resize animation

- A column size reset animates (D5): the double click on the resize handle and the Reset column size menu item mark the table with `data-size-resetting`, the header and body cells transition their width back to the default in 200 ms ease-out, and the mark clears on the width `transitionend`. Drags and every other width change stay instant; `prefers-reduced-motion: reduce` gets no transition.

#### Spec 05 Release approval

- The version bump waits for the owner's approval (D3): the release PR's `prepare-release` job runs in the GitHub Environment `release`, whose one required reviewer is the owner, so Prepare Release shows "Waiting for review" until the owner approves the deployment; a rejected review fails the job and pushes nothing. Every other `pr.yml` job stays automatic.

### Fixed

#### Spec 06 Storybook reset

- The deployed Storybook resets each story after its play (D8, F6): the static builds run the play with the Interactions panel logging every step, then remount the story in its initial state; Rerun runs the play and resets again. `storybook dev`, vitest and a failing play keep the end state. `pnpm test storybook-static` checks it on a local static build or, with `--url`, on the deployed site.

#### Fix F3

- Anchored menus keep their position while they close: `useST_MenuAnchor.ts` keeps the last measured anchor box through the exit animation instead of dropping to (0,0), so the filter mode menu no longer jumps the subheader filter row as it fades (three bases).

#### Fix F11 Dev server clean

- The docs dev server loads `/`, `/docs` and the example pages without errors (D20, F11): the theme panel formats its kbd hints only in the browser, so TanStack Hotkeys no longer warns about a server-formatted label, and the search dialog renders only in the browser, so a theme panel opened before hydration ends no longer causes an `aria-hidden` hydration mismatch on the home page.

### Docs

#### Spec 04 Theme customizer

- The palette button in the docs and home navs opens a theme customizer panel on the right (D2) in place of the six-preset dropdown: Copy (theme CSS or preset code), Undo, Redo, Mode, Style, Icon Library, Base Color, Theme, Menu Color, Menu Accent, Presets (Import a preset code, Random, Default plus 42 tweakcn palettes) and the tabs Colors (per-token editing for the current mode), Typography and Other.
- A fresh visitor sees the Emerald look as the `Default` preset; a stored choice (`st-design-system` in localStorage) applies before first paint and is dropped after 2 days. The old `st-theme` key is removed.
- Shortcuts through TanStack Hotkeys, each shown as a kbd hint: `R` shuffle, `Shift+R` reset, `C` another color preset, `P` undo; off while typing or while the search dialog is open.
- The home theme demo cycles six palettes through the design system. The six `themes/*.css` files, `lib/theme-presets.ts` and `components/theme-preset-switcher.tsx` are gone.

## 0.8.2 - 2026-11-06

### Changed

#### Epic 08 release run

- Validate Production runs the 28 HTTP checks on the deployed site only; the live Docs E2E pass per base is gone (D92): the PR run already ran Docs E2E on the same commit, and the live pass took 26 of the 32 minutes of the 0.8.1 release run.

## 0.8.1 - 2026-11-06

### Changed

#### Spec 07.1 gate step

- The release gate is a step of `install.yml` (D78): a Next.js app per base (`nextjs-base`, `nextjs-radix`, `nextjs-aria` rows) runs `packages/shadcn-table/test/release/gate.mjs` (Playwright) against `next dev` of the gate pages: zero console warnings and errors, the persisted view marked before first paint and restored, the RTL pinned header and resize handle.
- The two default captures per base are compared with the references under `packages/shadcn-table/test/release/reference/` by `pixelmatch` (at most 500 differing pixels); the captures, any diff image and `result.json` upload as the `gate-<base>` artifact (D79). `install.yml` gains a `workflow_dispatch` trigger to refresh the references.

#### Spec 07.1 version bump

- One pull request per release, `dev` into `master` (D83): its last check, `version bump (release:prepare)`, runs `scripts/release/prepare.mjs` (`pnpm release:prepare`) once every other job is green, bumps both `package.json` files, renames `## Unreleased` to the version and the date and commits `chore: version <v>` to `dev`; `release impact` reads the labels live, takes `master` PRs from `dev` only and passes the bumped head.
- `release.yml` runs once, on the merge: the `version` job, `scripts/release/version-pr.mjs` and the `release/next` branch are gone; `decide` chooses release or nothing.

#### Epic 08 Test runner and tests

- One test runner (D85): `pnpm test <name>` runs a test from `test/<name>/` (`typecheck`, `lint`, `storybook-tests`, `docs-e2e`, `validate-repo`, `installation-e2e`, `validate-pr`, `validate-production`), per base or per scenario, with `--list`, `--all`, `--changed`, `--base`, `--scenario` and `--ci`; every run ends with one summary line and a JSON record under `test/.out/`.
- The checks move without changing their assertions: `check-bases`, `check-icons` and `check-tailwind` become `validate-repo` (with `shadcn registry validate` and the tool unit tests), `check-pages.mjs` and `page-checks/` become `docs-e2e` (it builds and serves the docs on a free agent port without `--url`), the release smoke becomes `validate-production`, the install shell of `install.yml` becomes `installation-e2e` with the release gate as its browser phase and the six reference captures under `test/installation-e2e/fixtures/reference/`.
- The registry scripts move to `tools/registry/`, the release scripts to `tools/release/` (`decide.mjs` is `check-release.mjs`, `prepare.mjs` is `prepare-release.mjs`), the two previews merge into `tools/preview.mjs`, and the docs `install.mjs` and `example-map.mjs` move to `apps/shadcn-table-docs/lib/`. `scripts/`, `packages/shadcn-table/scripts/`, `packages/shadcn-table/test/` and `apps/shadcn-table-docs/scripts/` are gone, with `check-aria-warnings.mjs` and `check-storybook.mjs`; the root `check:*` and `release:prepare` scripts are removed.
- `playwright`, `pixelmatch` and `pngjs` are root devDependencies (the package keeps `playwright`); the package `storybook:build` writes `storybook-static/version.txt`, and the Vercel Storybook build runs it.

#### Epic 08 Tools and workflows

- `pr.yml` runs twenty-one jobs (D86, D87): `Typecheck`, `Storybook Tests` and `Docs E2E Tests` per base, `Lint`, `Validate Repo`, `Installation E2E` per scenario and `Validate PR`, each `pnpm test <name> --ci` with its records uploaded as `test-out-<job>`; `PR Summary` rewrites one sticky comment per PR from those records (the version line, the changelog counts, one line per job, the run link); `version-bump` is `Prepare Release`. `install.yml` is folded into `Installation E2E` and deleted; a `workflow_dispatch` with `installation-e2e-only` runs the seven install jobs with `--no-diff` and uploads the captures.
- `release.yml` runs four jobs: `Check Release`, `Verify Deployment` (waits until www and storybook serve the version on `/version.txt`, then tags), `Validate Production` (`pnpm test validate-production`) and `Publish Release`; the post-merge install jobs are gone.
- New tools `tools/release/verify-deployment.mjs`, `publish-release.mjs` and `pr-summary.mjs` (with `pr-summary.test.mjs`); the PR template names `pnpm test --changed`.

#### Epic 08 Docs and process

- `CONTRIBUTING.md`, `coding-standards.md`, `planning-guidelines.md` and the registry and docs READMEs name `test/`, `tools/` and `pnpm test <name>` with the CI job names (D88).
- Docs E2E page lists follow the docs sections (D89): `getting-started`, `api`, `guides`, `examples` under `test/docs-e2e/lib/`, every page once; `pnpm test docs-e2e --section <name>` runs one.
- `pr.yml` is `PR checks` with nine jobs, the four matrices as called workflows (`typecheck.yml`, `storybook-tests.yml`, `docs-e2e.yml`, `installation-e2e.yml`), check contexts such as `Typecheck / Typecheck (base)`; runs are named `PR checks: <PR title>` or `PR checks: all`, `release.yml` is `Release` (D90).
- Docs E2E runs four browser contexts per section and CI caches the Next build and Chromium, installed without `--with-deps` (D91).

## 0.8.0 - 2026-11-05

### Added

#### Row drop slide (D57)

- D57: a row drop inside one table slides the rows into their new places and flashes the dropped row with the column drop highlight (`useST_RowFlip`); a drop into another table, reduced motion, row virtualization and more than 200 rows skip the slide.

#### Spec 01

- Options, none with a default: `enableViewSettings`, `enableSortPopover`, `enableScrollButtons`, `enableCellOverflowTooltip`, `persistViewSettings`, `nonce`, `showClearSearchButton`, `showColumnDragHandle`, `showSortIndex`; `columnFilterDisplayMode` accepts `'chips'`.
- Column options: `icon` (the column-type icon before the header label) and `overflowTooltip`.
- Icon keys, with a glyph in the Lucide, Tabler, Phosphor, Hugeicons and Remix editions: `AddIcon`, `ArrowUpwardIcon`, `DeleteIcon`, `GridLinesAllIcon`, `GridLinesColumnsIcon`, `GridLinesNoneIcon`, `GridLinesRowsIcon`, `LockIcon`, `PushPinOffIcon`, `RowNumbersOffIcon`, `RowNumbersOnIcon`, `SettingsIcon`, `SingleLineIcon`, `StickyHeaderOffIcon`, `StickyHeaderOnIcon`, `StripedOffIcon`, `StripedOnIcon`, `SwapVertIcon`, `WrapTextIcon`; the grid line glyphs ship as `ST_GridLinesAllIcon`, `ST_GridLinesRowsIcon` and `ST_GridLinesColumnsIcon`.
- Localization keys, optional, English only (other locales fall back to English): column menu `sortAscending`, `sortDescending`, `filter`, `pinToStart`, `pinToEnd`, `fixedPosition`, `fixed`, `hideThisColumn`, `columnMenu`, `sortedAscending`, `sortedDescending`; filter chips `addFilter`, `filterBy`, `noColumns`, `removeFilter`, `deleteAllFilters`, `clearFilters`, `backToColumns`, `isEmpty`, `isNotEmpty`, `showColumnToEditFilter`, `rangeSummary`, `yes`, `no`, `beforeValue`, `afterValue`; sort editor `sort`, `sortBy`, `ascending`, `descending`, `dragToReorder`, `removeSortOn`, `addSort`, `deleteSort`, `sortsCount`; view settings `viewSettings`, `columns`, `density`, `wrapCellText`, `singleLineCells`, `gridLines`, `stickyHeader`, `alternatingRowColors`, `pinToToolbar`, `unpinFromToolbar`, `resetView`, `columnsShown`, `gridLinesNone`, `gridLinesRows`, `gridLinesColumns`, `gridLinesAll`, `densityCompact`, `densityComfortable`, `densitySpacious`; scroll cues `scrollLeft`, `scrollRight`.
- State slices: `viewSettings` (`setViewSettings`, `resetViewSettings`, `onViewSettingsChange`), `filterChips` (`setFilterChips`, `onFilterChipsChange`) and `columnFlipPending` (`setColumnFlipPending`); `table.refs.tableRef` points at the `<table>`.
- Helpers: `getST_ColumnDropTargetProps`, `isColumnDragCancelled` and `applyColumnReorder` for column drags; the view storage functions `getViewSettingsKey`, `readStoredView`, `writeStoredView`, `removeStoredView`, `subscribeStoredView`, `getStoredViewSnapshot`, `getServerSnapshot` and `escapeForScript`.
- A column drag ended with Escape or dropped outside the table no longer reorders the columns, from the header grip and from the columns menu.
- The sticky header scroll box height reads `--st-sticky-max-height` when the table root sets it.

#### Spec 02

- The top toolbar sits above the table frame; the frame (`rounded-md border bg-background shadow`) holds the scroll box and the bottom toolbar with no inner padding, also in full screen, which now pads the window instead of stripping the frame. `stTableLayoutProps.className` restores the old box.
- Body rows are 40, 48 and 56 px tall at compact, comfortable and spacious with `px-2`, `px-3` and `px-4` cell padding; rows are split by hairlines, none under the last row, and `viewSettings.gridLines` draws column lines; hover tints the whole row evenly. The bottom toolbar's top edge is the same hairline; the empty row is 96 px, muted, not italic.
- The table root declares the tint tokens `--st-stripe`, `--st-hover`, `--st-selected` and `--st-edge-shadow` with dark twins; rows and pinned cells read them, and an ancestor or `stTableLayoutProps.className` overrides them. Pinned inner-edge cells cast the edge shadow towards the scrolling columns.
- With `layoutMode: 'grid'` data columns share the spare width in proportion to their sizes, while display and pinned columns keep their width; past the frame every column keeps its set width and the table scrolls sideways. Display columns default to `grow: false`; the row actions column is 48 px with a visually hidden header label and moves through the columns menu (`displayColumnDefOptions['st-row-actions']` sets it back).
- `enableScrollButtons: true` shows hover chevrons in the header row on a side with hidden columns; a click scrolls 80 percent of the unpinned width. `useST_HorizontalOverflow` and `ST_ScrollButtons` are exported for custom layouts.
- `enableCellOverflowTooltip: true` truncates plain text cells on one line and shows the full value in a tooltip only when it is cut off; `viewSettings.wrapText` shows the text in full; `columnDef.overflowTooltip` sets it per column; `ST_OverflowText` is exported for custom cells.
- The sticky header box caps at `var(--st-sticky-max-height, 70vh)` when the header is sticky by choice (`enableStickyHeader` or `viewSettings.stickyHeader`); a header forced sticky by row virtualization keeps the full-height rule.
- With `persistViewSettings` on, a server-rendered table renders one inline script (with the `nonce` option) that marks the root `data-st-view-pending` and `aria-busy` before first paint when a stored view differs from the defaults; the body shows a skeleton bar while marked. Nothing is rendered with persistence off.

#### Spec 03

- Header look: no band, a medium-weight muted label, the column `icon` before it, a full-opacity chevron at the end and a static sort arrow only while sorted; 40 px at every density, a hairline between columns only when grid lines are `columns` or `all`; the header row shadow and the 0.97 opacity are gone.
- The header label and the chevron open the same column menu, a second click on the chevron closes it, and a label click never sorts.
- The column menu lists only what applies, in order: Sort ascending, Sort descending, Clear sort; Filter, Clear filter; Pin to start, Pin to end, Unpin, Reset column size, Group by, Fixed position (disabled, locked columns); Hide. The active sort direction is the one disabled item, and sorting from the menu stacks onto the other columns' sorts. Show all columns leaves the menu (the columns menu has it).
- The resize handle is a full-height hairline: invisible at rest, lit while the pointer is over the header, primary while resizing, reset on double-click; a resize never starts a column drag.
- Columns drag by the header cell where they can be dragged; the grip renders only with `showColumnDragHandle`. While a column drags, the other headers slide aside to open a gap and the dragged header sits in it, faded with a dashed outline; on drop the body slides to catch up and the moved column highlights; Escape or a drop outside slides the headers back. Reduced motion keeps the static dashed feedback and the highlight. Near the inner edges of the unpinned area the table scrolls sideways.
- Locked columns (`enableColumnOrdering: false`) show striped "Fixed" headers only while another column drags.
- `ST_ColumnActionMenu` and `ST_FilterOptionMenu` accept a `trigger` element with optional `open` / `onOpenChange` beside `anchorEl` / `setAnchorEl`, which are now optional.
- New exports: `useST_ColumnFlip`, `useST_DragAutoScroll`, `ST_TableHeadCellLockedOverlay`, `getST_ColumnDragHandlers`.

#### Spec 04

- Filter chips (`columnFilterDisplayMode: 'chips'`): one chip per filtered column with its icon, label, mode and value; the toolbar filter button and "+ Filter" open a searchable column picker that swaps in place to the value editor (back button, 150 ms glide); Filter in a column menu opens the editor on the header cell; "Clear filters" clears every value and chip. `columnFilterDisplayMode: 'subheader'` keeps the filter row.
- Sort editor (`enableSortPopover`): the toolbar Sort button opens a column picker, then the editor with one row per rule (drag to reorder, column, direction, remove), "Add sort" and "Delete sort"; a sort chip before the filter chips opens it. `enableSortPopover: false` keeps today's toolbar.
- View settings (`enableViewSettings`): one panel for Columns, Density, Wrap cell text, Grid lines, Sticky header, Alternating row colors and Row numbers, each with a pin that places it in the toolbar as an icon button (Columns and Density pinned by default), and "Reset view". `enableViewSettings: false` keeps the columns and density buttons.
- `useST_ViewPersistence`, mounted with `persistViewSettings`: the view settings, pins, density, column visibility, order and pinning are saved to `localStorage` on every change and applied once after hydration; "Reset view" deletes the stored view.
- The search toggle is never disabled: open, one click clears the search and closes the field; the field's inline clear button renders only with `showClearSearchButton: true`.
- `ST_ShowHideColumnsMenu` and `ST_RowActionMenu` take a `trigger` element (with `open` and `onOpenChange`) beside `anchorEl`; the columns and row action buttons open their menus from it, so focus returns through the primitive.
- A drop in the columns menu slides header and body together and highlights the moved column.
- Exports: `ST_FilterChips`, `ST_FilterEditor`, `ST_FilterPickerButton`, `ST_ColumnPicker`, `ST_SortPopover`, `ST_ViewSettingsButton`, `ST_ViewSettingsItems`, `useST_PopupResize`, `useST_ViewPersistence` and the filter summary helpers.

### Changed

#### View settings icons (D75)

- Lucide defaults for the view settings: grid lines `Frame`, `Equal`, `Equal` rotated and `Square`; Columns `Columns3Cog`; density `ListChevronsDownUp`, mirrored `ListIndentDecrease`, `ListChevronsUpDown`.

#### Edition icons (06.6)

- The Tabler, Phosphor, Remix and Hugeicons editions take their own icons for grid lines, Columns and density (D77): Tabler `IconFrame`, `IconEqual`, `IconEqual` rotated, `IconTableOptions`; Phosphor `HashStraightIcon`, `EqualsIcon`, `EqualsIcon` rotated, `ArrowsInLineVerticalIcon`, mirrored `TextOutdentIcon`, `ArrowsOutLineVerticalIcon`; Remix `RiHashtag`, `RiEqualLine`, `RiEqualLine` rotated, `RiSquareLine`, `RiKanbanView`, `RiContractUpDownLine`, mirrored `RiIndentDecrease`, `RiExpandUpDownLine`; Hugeicons `FrameIcon`, `EqualIcon`, `EqualIcon` rotated, `Columns3CogIcon`, `ListChevronsDownUpIcon`, mirrored `ListIndentDecreaseIcon`, `UnfoldMoreIcon`.
- The drawn glyph file `components/icons/ST_GridLineIcons.tsx` and its `index.ts` export are removed (D76; added in this cycle, never released).

#### Spec 05

The stock table takes the v0.8 look by default. Each line names the option that restores the old behaviour.

- `enableColumnOrdering` defaults to `true`: headers are drag sources. Set `enableColumnOrdering: false` to restore static headers.
- `enableColumnPinning` defaults to `true`: the column menu has the pin items. Set `enableColumnPinning: false` to restore.
- `enableColumnResizing` defaults to `true`: headers have the resize handle. Set `enableColumnResizing: false` to restore.
- `paginationDisplayMode` defaults to `'pages'`: numbered page buttons. Set `paginationDisplayMode: 'default'` to restore the range text with previous and next.
- `columnFilterDisplayMode` defaults to `'chips'`: filters live in the toolbar chip row. Set `columnFilterDisplayMode: 'subheader'` to restore the inputs under the headers.
- `layoutMode` defaults to `'grid'` and no longer switches to `'grid-no-grow'` when resizing is on. Set `layoutMode: 'semantic'` (or `'grid-no-grow'` with resizing) to restore.
- `positionActionsColumn` defaults to `'last'`. Set `positionActionsColumn: 'first'` to restore.
- With `enableRowActions` and no `columnPinning` of its own, a table pins the actions column to the end (`initialState.columnPinning.end: ['st-row-actions']`), so `resetColumnPinning()` keeps it pinned. Pass your own `initialState.columnPinning` (for example `{ start: [], end: [] }`) to restore.
- `enableSortPopover` defaults to `true`: the toolbar sort editor. Set `enableSortPopover: false` to restore.
- `enableViewSettings` defaults to `true`: one view settings button replaces the separate columns and density buttons. Set `enableViewSettings: false` to restore.
- `enableScrollButtons` defaults to `true`: hover chevrons on a side with hidden columns. Set `enableScrollButtons: false` to restore.
- `enableCellOverflowTooltip` defaults to `true`: cut-off text shows a tooltip. Set `enableCellOverflowTooltip: false` to restore.

#### Spec 06.4 grouping

- D68: under `groupedColumnMode: 'remove'` the grouping column's header is a breadcrumb: the expand-all button, then per grouped column its icon and header name, a chevron between segments. It replaces "State, Gender" behind the first grouped column's icon (F41), and renders without `enableExpandAll` too. `'reorder'` is unchanged.
- D73: under `'remove'` the grouping column's default `size` is the sum of the grouped columns' sizes (each falls back to `defaultColumn.size`, then 180), recomputed as grouping changes. `displayColumnDefOptions['st-row-expand'].size` still wins.

#### Spec 06.4 filters

- The `multi-select` filter field ends in a chevron, vertically centred however many rows its chips take; its clear button shows once a value exists and the empty slot takes no room; the chips and the typing input wrap inside the field. On radix and base typing highlights the first match and Enter picks it (D72).
- The chip editor popover is 260 px wide (`w-65`): a multi-select's chips wrap and the field grows in height instead of widening the editor (F55).

### Fixed

#### Spec 06.1 toolbar

- With a custom `renderTopToolbar` in chips mode, the column menu's Filter item opens the header-anchored editor again: the new exported `ST_HeaderFilterEditor` is mounted by the table layout, outside the toolbar, and `ST_FilterChips` renders the chips row only.
- The sort editor hides "Add sort" once the rule count reaches `maxMultiSortColCount`.
- The columns menu shows the column icon before its label.
- `localization.rowNumbers` reads "Row numbers" in English and "Zeilennummern" in German.

#### Spec 06.1 cells

- Display cells (select, expand, pin, drag, row numbers, actions) centre their control in the body and the header, so the header and row checkboxes share one x; row numbers render as muted tabular digits.
- A group header spans exactly its leaves: it grows only by its growing leaves, keeps its width when every leaf is pinned or has `grow: false`, and sticks with its leaves when they are all pinned to one side.
- With `renderRowActions` the actions column shows the "Actions" header label, is 96 px wide by default (`displayColumnDefOptions['st-row-actions'].size` wins) and centres every control it returns; without it the column stays 48 px with the dots button.
- The popover filter funnel no longer adds its own margin beside the header label.
- With `renderDetailPanel`, a row whose panel renders nothing keeps a disabled expand button and Expand all skips it, instead of opening an empty detail row; rows with sub rows still expand.

#### Fix F29

- A `multi-select` filter on a column of plain values keeps the rows whose value is picked; array values still match on any overlap and an empty selection keeps every row (`arrIncludesSome`, the variant's default).

#### Fix F31

- The focused filter input shows the full focus ring and rounded edge in the chip editor, the header-anchored editor and the subheader filter row; the filter container no longer clips them.

#### Fix F36

- The view items pinned to the toolbar render before `ST_ViewSettingsButton` wherever it is placed, so pins show in a custom `renderTopToolbar` or `renderToolbarInternalActions`; the stock toolbar keeps its order and renders them once.

#### Fix F19, F28, F30, F39, F40, F41, D56

- F19: the popover-mode header funnel is a 24 px icon button (it was a 12 px target), 30% opaque at rest and full while active or hovered.
- F28: under `layoutMode: 'semantic'` the body select checkbox is centred in its cell.
- F30: a Columns menu reorder slides each header by the distance it moved, not by the table's offset from the page edge.
- F39: while a column resizes, the header hairline and the body guide are one 1 px line ending on the column's trailing edge; the body guide no longer is a 2 px border inside the cell.
- F40: every built-in toolbar button fades and zooms in once on mount, as the pinned view items do; none under reduced motion.
- F41: under `groupedColumnMode: 'remove'` the grouping column's header shows the first grouped column's icon.
- D56: the export to CSV and export to PDF examples run on the chips filter default instead of popover mode.

#### Fix F43

- `renderTopToolbarCustomActions` and `renderBottomToolbarCustomActions` re-render when the row selection, filters or sorting change, so an action that reads the selected rows enables once a row is selected; the rest of the toolbar does not re-render.

#### Fix F44

- Subheader filters fit their columns: the filter row takes the label row's inline padding per density and a bottom padding, and adds no width to its column, so a column keeps its `size` and clips a wider filter.
- The range slider's "Filter Mode" caption renders below the track, like the text field's caption, and the slider stays inside its cell.
- Range filters keep Min and Max side by side at every column width (D61); their "Filter Mode" caption spans the whole range group instead of the Min field.
- The subheader filters example sizes its columns to fit their filters.

#### Fix F47

- A column drop or a Columns menu reorder slides the moved column on top of the cells it passes, under the pinned columns, instead of under the cells that follow it in the DOM; the lift lasts only for the slide.

#### Spec 06.4 filters

- The built-in toolbar buttons fade in from 0 opacity on mount, the same animation as the pinned view items, instead of from 10 percent (D70).
- The aria `range-slider` filter reads `min` and `max` from `stFilterSliderProps` as radix and base do, so its thumbs start at the given bounds instead of 0; aria `SliderProps` accepts the two keys (F46).
- In an RTL table a column drag preview lays the columns right to left: every header stays inside the table and only the dragged and target columns shift (F50).

#### Fix F57

- Under `groupedColumnMode: 'remove'` with grouping active, the grouping column aligns its header (expand-all button, then the breadcrumb), its group cells and its row chevrons to the start instead of the centre; the narrow expand column stays centred.

#### Fix F58

- With grouping active, the expand column aligns its chevrons to the start under `groupedColumnMode: false` and `'reorder'` too, so the depth indent steps right from the cell's start; without grouping the narrow control column stays centred.

### Docs

#### Home demo pace

- The home demo holds each step 1.2 s after it lands (was 2.2 s) with a 3.6 s floor per step (was 5.2 s), so the loop runs about 25 s instead of 34 s.

#### Fix F56

- The header-width page check waits for the web font before measuring, so CI measures Inter, not the Linux fallback.

#### Theme demo speed

- The home page theme demo cycles its five themes in 25 s instead of 40 s: 25 ms per typed character, a 0.7 s reply, a 2.2 s hold per theme.

#### Spec 06

- New guides for the v0.8 surfaces: Column Icons, Filter Chips, Sort Editor, View Settings and Persistence, Overflow Tooltip, Scroll Cues and Tint Tokens.
- Guides rewritten for the v0.8 defaults and chrome: column actions, column filtering, column ordering (header dragging, locked columns, drag animation), column grouping, column pinning, column resizing, column size, display columns, row actions, pagination, density, column hiding, toolbar, global filtering, full screen, sticky header, virtualization, styling, icons, localization, state management, row pinning, detail panel, usage and best practices; the ST Components API page lists the new toolbar components, `ST_OverflowText`, `ST_ScrollButtons`, `ST_TableHeadCellLockedOverlay` and the menus' `trigger` prop.
- The prop tables list every new option, column option and state slice with its shipped default.
- New Persistent View example (`persistViewSettings` with column icons) in all three bases; the Multi-Sorting example works through the sort editor.

#### Spec 06.2

- Every example column carries a Lucide icon; loop-built columns take theirs from a lookup by key.
- The home demo renders the stock table on the header demo's data, and its replay plays the sort editor, search, a cell edit, a filter chip, a column move and the view settings.
- The Persistent View example renders the header demo's 50 rows and 15 columns.
- The filtering examples use the filter chips; the new Subheader Filters Example keeps the filter row under the headers with the filter variants and the filter mode picker (`columnFilterDisplayMode: 'subheader'`).
- The docs prose spacing no longer clips the pagination of the example previews; the Chart Detail Panel example draws its lines; the editing examples put the actions column first; the custom toolbar examples show the view settings button.

#### Spec 06.2 stories

- Every Storybook story column carries a Lucide icon, the same pick per field as the docs examples.
- The Default Look story renders the stock table: columns, data, `getRowId` and the row actions only.

#### Fix F32

- The home demo shows seven columns (Name, Status, Assignee, Project, Due, Estimate, Priority) that fit its frame, so the Editing step's estimate change is in view.

#### Fix F38

- The Export to CSV and Export to PDF examples (popover filter mode) let the First Name and Last Name columns take the default width and size the ID column at 112 px, so no header label is cut off beside the funnel and the chevron.

#### Docs polish

- The home demo plays each step on the table's own controls before its state lands: the sort editor, the search box typing "billing", the Estimate cell edit, the Filter picker and its Status select, the Project column move and the view settings switch, each with a pulse on the control it uses.
- The home demo's seven columns take the persistent-view definitions and read their headers in full: the demo band runs gutter to gutter with the steps beside the table from 1440px and under it below.
- The home theme demo types its prompts at a reading pace, answers after a short beat and cycles the five themes in about 40 s; the mock app's member table stays inside its frame at every screen height.
- The persistent view example uses the header demo's column definitions: filter variants, filter fns, select options, status, priority and tag chips, progress, PR link and archived cells, sizes and the priority sort; Name is orderable, every view settings item is pinned and 50 rows show per page.
- The advanced example's Activate, Deactivate and Contact buttons and row action items open a dialog with the selected names instead of a browser alert.

#### Fix F45

- The home demo keeps every step active, with its check mark and "Now showing" label, for its whole run (at least 5.2 s), and the step titles name the feature: Sort editor, Global search, Cell editing, Filter chips, Column order, Striped rows.

#### Home demo polish

- The home demo replay leaves no tooltip, focus ring or page scroll behind when it closes a popover, keeps the table frame and the step list in place (a page of ten rows fits, the status keeps one height), slides the moved column over the others, opens the filter from the "+ Filter" pill and types the new estimate with no empty field.

#### Fix F48

- The home demo plays only while its toolbar has room for the popovers below it (360 px under the toolbar, below the sticky nav): until then it holds on "Starting", scrolled away mid-step it pauses with its popover closed, and it resumes when the room is back, so the sort, filter and view settings popovers never flip up over the hero.

#### Fix F49

- The home demo's cue marks the editor or panel a control opens as well as the control: the sort picker, the "Due" chip and its sort editor, the filter picker, the "Status" chip editor and the "Status: In Review" chip, and the view settings panel; the cue inside a popover now shows (it was invisible there), and the last step is titled "Alternating row colors".

#### Spec 06.5

- The sidebar no longer lists About, Changelog and Roadmap, which had no page behind them (F42).
- The Advanced and External Toolbar examples show the sort chip in their custom toolbars while a sort is set, as the stock toolbar does (F51).
- The Persistent View, Subheader Filters and Custom Headless pages are shorter; Persistent View says it stores the view in localStorage (F52).
- The editing examples confirm a delete with a shadcn AlertDialog instead of a browser confirm, in the three bases (F53).
- Example columns with an icon are wide enough to show their whole header label (F54).

## 0.7.4 - 2026-11-03

### Fixed

- Single-row selection is one radio group per table: arrow keys move between rows and screen readers announce the row count.
- The loading state is localizable (`localization.loading`); every progress bar carries it as its label.

## 0.7.3 - 2026-11-02

### Fixed

- The row select checkbox is centred in its cell and the select-all checkbox sits on the header line, the same in every base.

## 0.7.2 - 2026-11-02

### Fixed

- Loading placeholders no longer cause a hydration warning on server-rendered tables; the platform helper reads `navigator.userAgent` instead of the deprecated `navigator.platform`.
- React Aria: the select and filter checkboxes and grouped values show their tooltips again.

### Docs

- The Column Dragging story and guide show that dragging needs column ordering or grouping as its drop target.
- A docs `next start` on any port serves the default build; the per-port build directory applies to `next dev` only.

## 0.7.1 - 2026-11-01

### Fixed

- Pinned columns are opaque and their edge shadow falls on the scrolled columns, so they read on top in light mode too; the bottom toolbar shadow falls on the table body.
- React Aria: the library logs no development warnings; Escape on the focused full-screen toggle leaves full screen.
- The search field shows its focus ring after a click on the toggle.

### Docs

- The docs page checks run on every pull request; a dev server on another port no longer rewrites the docs `tsconfig.json`.

## 0.7.0 - 2026-10-31

### Breaking

- shadcn-table needs React 19.2 or later and Tailwind CSS 4.3 or later.

### Added

- `useST_FullScreenContainer(table)` for headless layouts; the toolbar buttons accept the shadcn Button `size` and `variant` props by type.
- Icon editions: `shadcn-table-tabler`, `shadcn-table-phosphor`, `shadcn-table-hugeicons` and `shadcn-table-remixicon` install the table with that icon library instead of Lucide; `shadcn-table` stays the Lucide edition. Switch later with the edition item and `--overwrite`.

### Changed

- `ST_Checkbox` moved to `components/inputs/`, `ST_Tooltip` to `components/buttons/`, `useST_MediaQuery` to `hooks/`; barrel imports are unchanged, deep imports follow the new paths.
- `react` and `react-dom` move to `^19.2.0` (consumer minimum React 19.2, for `useEffectEvent`); the library lint adds `eslint-plugin-react-hooks` 7.1.1 and `@eslint-community/eslint-plugin-eslint-comments` 4.8.1.
- Public types no longer use `any`: `DropdownOption.value` is `string`, `enableRowPinning` callbacks receive `ST_Row`, the `ST_TableRefs` ref maps are non-null, `row.columnFiltersMeta` is `RankingInfo`, the row selection handlers accept `ST_SelectionEvent`, `flexRender` takes `Renderable<never>` and `object` props.
- No deprecated TanStack or DOM API is used: the function registries come from the individual `*Fn_*` exports, state reads go through `table.Subscribe` and `table.atoms`, in the library, the stories and the docs examples; `getDefaultColumnOrderIds` and the display column helpers take only the `columnOrder`, `creatingRow` and `grouping` state they read; `table.atoms` is typed per row type.
- `tailwindcss` and `@tailwindcss/vite` move to `^4.3.3` (consumer minimum Tailwind 4.3, for `scrollbar-thin` and canonical classes).
- Tailwind classes use their canonical forms (`z-1` for `z-[1]`, `min-h-25` for `min-h-[100px]` and 20 more), so Tailwind 4.3 IntelliSense reports no hints in the installed files; same CSS.
- Direction classes are logical (`ms-`, `me-`, `inset-s-`, `inset-e-`, `text-start`, `text-end`) and pinned offsets use the inline axis, so the table follows `dir` on any ancestor; set `columnResizeDirection: 'rtl'` on RTL pages for the drag math.
- Toolbar and header shadows take their color from the theme instead of fixed `rgba` values.
- Two shared hooks, `useST_ComposedRef` (one callback ref for the internal and the user's ref) and `useST_MenuAnchor` (the anchor of the five menus).
- Library comments state contracts only: porting history, restated code and repeated rationale are gone, and the five menus share one anchor hook.
- `getCommonToolbarStyles` is gone from `shared/utils/style.utils.ts`; nothing in the library used it.
- The package adds the Tabler, Phosphor, Hugeicons and Remix Icon React packages as development dependencies for the icon sets.
- `ST_Icons` values are typed `ComponentType<ST_IconProps>`; the table's own files import icons through `icons.ts` only; the checkbox's indeterminate dash is the new `IndeterminateIcon` key.
- The library files without an icon map are the new `shadcn-table-core` item; `shadcn-table`, the icon set items, the locale items and the example items depend on it.

### Fixed

- The installed table lints clean under `eslint-config-next` 16 with the React Compiler rules: hooks run unconditionally, no ref is touched during render, no state is set inside an effect.
- Column definitions are rebuilt when a column resize or a drag ends, also when the owner's table selector leaves those slices out.
- A Min or Max value in a range filter filters the rows, and range inputs on number columns take numbers only.
- Clearing the sort with the default `enableGlobalFilterRankedResults` stays cleared.
- A `className` in `stPaginationProps` lands on the pagination's outer element, so it can change the padding.
- The search field and the progress bar, alert banner, detail panel and column filter panels open and close smoothly in every base; the search field focuses its input on open, is inert while closed, and Escape clears a typed value first, then closes the empty field and returns focus to the toggle.
- Every menu opener announces `aria-haspopup` and `aria-expanded`, a second click on it closes its menu, Tab skips the anchor spans, a menu follows its opener on resize and scroll, and focus returns to the opener in every base.
- Show and hide columns toggles a column with Enter and Space; the pin buttons and drag handle sit beside the menu item and take Tab.
- Parts used as designed in `ST_TableHeadCellFilterLabel`, `ST_ColumnActionMenu`, `ST_ActionMenuItem`, `ST_EditCellTextField`, `ST_FilterTextField`, `ST_TableContainer`, `ST_EditRowModal`, `ST_FilterRangeSlider`, `ST_ToolbarAlertBanner`, `ST_SelectCheckbox` and the React Aria tooltips: the filter popover opens from its trigger with the input focused, filter modes open as a submenu, helper text describes the edit input, the filter chip clear button has a name, the edit modal plays its exit, and the slider composes a consumer ref.
- The React Aria resize handle takes its width and height.
- The checkbox's indeterminate dash reads `icons.IndeterminateIcon` from the table icons.

### Docs

- The Localization guide installs any locale with the base, package manager and locale selectors and shows its import; every example toolbar has a base select.
- The docs name the registry namespace `@shadcn-table` (was `@st`); a project that registered `@st` keeps working, the name is local to its `components.json`.
- The install command picks the icon library edition and offers a short registry-namespace form, served for any `style` of a base; the install page covers projects created with shadcn create; the headless example documents the spacer column and the full-screen container hook.

## 0.6.4 - 2026-10-29

### Docs

- The API reference index explains versioning: everything exported is public, the three bases stay at parity, TanStack Table is pinned to `^9`, renamed options keep an alias for one minor, upgrade is `shadcn add --overwrite` plus this changelog.

## 0.6.3 - 2026-10-29

### Changed

- The Storybook base picker shows a chevron before the base name.
- The shadcn base is called base everywhere, in the Storybook picker, the docs and the
  maintainer scripts; edition is gone.
- Maintainer renames: `scripts/registry/bases.mjs` (`BASES`, `REFERENCE_BASE`, `DEFAULT_BASE`,
  `BASE_LABELS`, `BASE_PORTS`, `resolveBase`, `baseItemName`), `.storybook/base-tool.ts`,
  `check-pages.mjs --url <url> --base <base>` (was `--base <url> --edition <base>`), and
  `check-storybook.mjs --url <url>` (was `--base <url>`).

## 0.6.2 - 2026-10-29

### Changed

- Base UI is listed first wherever the editions appear: the docs edition tabs and menus, the
  Storybook edition switch, the README, the install pages and the agent skill read Base UI,
  Radix UI, React Aria. The README's quick start installs the Base UI edition; Radix UI and
  React Aria sit in the fold.
- The docs header's edition switch is a select button showing the current edition, opening a
  menu with the three editions; the edition tabs on the install, init and best-practices pages
  stay tabs. The Storybook edition switch is the toolbar's own select, like the viewport and
  background pickers, in place of three buttons.
- Maintainers: every edition script names its edition. `storybook`, `storybook:build` and
  `test` become `storybook:radix`, `storybook:build:radix` and `test:radix` (the `:base` and
  `:aria` scripts are unchanged); the root `storybook:build` builds all three, Base UI first.
  `ST_BASE` unset or unknown now means the Base UI tree, not Radix UI, for `vite`, `vitest`
  and `storybook`.

## 0.6.1 - 2026-10-28

### Changed

- Base UI is the edition shown first: the docs edition tabs and the command bar open on Base UI
  until the reader picks one (a stored pick is kept), and the Storybook root
  (`storybook.shadcn-table.com/`) redirects to the Base UI build. The three Storybook builds
  live under `/radix/`, `/base/` and `/aria/`; `/base/` and `/aria/` links keep working, old
  root links land on Base UI. The Storybook edition tool marks the current edition's button.
- Every committed registry item is named by its edition: the GitHub-namespace addresses of the
  Radix UI items are `anindosarker/shadcn-table/shadcn-table-radix`,
  `shadcn-table-radix-locale-<code>` and `example-<slug>-radix`. The plain GitHub addresses
  (`anindosarker/shadcn-table/shadcn-table`, `shadcn-table-locale-<code>`, `example-<slug>`)
  now install the Base UI edition, as aliases of the `-base` items; before, they installed
  the Radix UI items. The hosted item names are unchanged:
  `/r/radix/shadcn-table.json`, `/r/radix/shadcn-table-locale-<code>.json` and
  `/r/radix/example-<slug>.json` as before.

### Fixed

- The Base UI and React Aria hosted locale items' descriptions name the hosted item
  `shadcn-table` (`/r/base/` and `/r/aria/` said `shadcn-table-base` and `shadcn-table-aria`).
- shadcn parts re-added by a deterministic `add-part`: `pnpm add-part <edition> <part>` now
  writes the same bytes whatever the invocation order (the `'use client'` directive is set per
  file from the upstream item, `font-heading` survives the CLI's class resolution), and every
  part of every edition was re-added once with it. Repo-internal; nothing changes for users.
- Radix UI and Base UI: installing shadcn-table no longer replaces the project's
  `components/ui/checkbox.tsx` with a fork. The indeterminate dash on the select-all and
  partially selected row checkboxes is drawn by the library's own `ST_Checkbox` wrapper on
  every edition, and `checkbox` arrives as a plain registry dependency. The checkbox filter's
  unset state on React Aria now shows the same dash as on Radix UI and Base UI instead of a
  check.

## 0.6.0 - 2026-10-28

### Changed

- Docs examples per edition: `apps/shadcn-table-docs/examples/<edition>/<slug>/` holds one
  hand-written set per edition (Radix UI, Base UI, React Aria) in place of one Radix source
  rewritten per base; the code view, the GitHub link and the agent prompt show the selected
  edition's source, and `pnpm check:bases` guards the three sets the way it guards the
  library trees (`scripts/registry/examples-<edition>-diff.json`). GitHub-namespace example
  items are `example-<slug>`, `example-<slug>-base` and `example-<slug>-aria`; the hosted
  `/r/<edition>/example-<slug>.json` names are unchanged. `custom-headless` renders the shadcn
  `Table` parts on Radix UI and Base UI and the React Aria `Table` collection on React Aria.

### Fixed

- Registry example items for Base UI and React Aria: `/r/base/example-<slug>.json` and
  `/r/aria/example-<slug>.json` carried the Radix source (`asChild`, `disabled` on `Button`,
  `onValueChange` on `RadioGroup`, the Radix tooltip composition), which those editions' parts
  reject; they now carry that edition's code.
- React Aria edition: the `label` part is what shadcn ships (`add-part.mjs` output), the hand
  edit that dropped its unused `import * as React` is reverted, and `shadcn-table-aria` lists
  `label` as a registryDependency like every other part instead of shipping its own copy.
  Unused locals and parameters are checked by ESLint (`@typescript-eslint/no-unused-vars`, `_`
  prefix tolerated, parts ignored), no longer by `noUnusedLocals` and `noUnusedParameters` in
  the tsconfigs.

## 0.5.1 - 2026-10-28

### Changed

- Release flow: `.github/workflows/pr.yml` replaces `ci.yml` and adds a `release impact` job
  that asks every pull request for one `release:` label (`release:patch`, `release:minor`,
  `release:major`, `release:skip`); the `registry` and `install` jobs now run on every pull
  request. `.github/workflows/release.yml` computes the next version from that label or the
  `## Unreleased` headings (`scripts/release/next-version.mjs`), opens or updates the
  `chore: version <v>` pull request from `release/next`, and on its merge tags, smokes,
  installs, publishes the GitHub release and comments on the shipped pull requests.
  `scripts/release.mjs` and the root `release` script are gone.

## 0.5.0 - 2026-10-28

### Added

- React Aria edition: a third edition of the table on shadcn's React Aria parts (`aria-nova`
  style, `react-aria-components`), same API. Registry item `shadcn-table-aria` plus its 38
  locale items (`shadcn-table-aria-locale-<code>`). Install on an `aria-*` style with
  `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/aria/shadcn-table.json`, or
  `pnpm dlx shadcn@latest add @st/shadcn-table` with the `@st` namespace registered.
- Docs: the edition switch offers Radix UI, Base UI and React Aria; every example renders
  on the selected edition, and the install page, the agent skill and the registry addresses
  list the React Aria commands.

### Changed

- `ST_PartPropTypes` gains `button` and `select`. `table.options` and `column.columnDef`
  hold the button and select `st*Props` (`stCopyButtonProps`, `stExpandButtonProps`,
  `stPaginationProps` and the like) tree-neutral, like the checkbox, slider and dialog
  ones, so one program can hold several editions; the options as written
  (`ST_TableOptions`, `ST_ColumnDef`) keep the edition's types.

## 0.4.0 - 2026-10-28

### Breaking

- Sub-components no longer take a `table` prop. They read it from the `row`, `cell`,
  `header` or `column` they render (`instance.table`), or from the `ST_TableProvider`
  context; wrap hand-composed pieces in `ST_TableProvider`.
- Renderers and `st*Props` callbacks of components that render a row, cell, header or
  column (`Cell`, `GroupedCell`, `Header`, `Footer`, `renderRowActions`,
  `renderRowActionMenuItems`, `renderColumnActionsMenuItems`, `renderDetailPanel`,
  `stRowDragHandleProps` and the like) receive `instance.table`, which has no `state`. Read
  `table.store.state` or `table.atoms.<slice>.get()` there. `table.store.state` is typed over
  `ST_RowData`; cast the row slices (`draggingRow`, `hoveredRow`) through
  `ST_TableState<TData>` when the row type matters.
- The props types of components that render no row, cell, header or column
  (`ST_TableLayoutProps`, `ST_TableContainerProps`, `ST_TableProps`, `ST_TableBodyProps`,
  `ST_TableHeadProps`, `ST_TableFooterProps`, the toolbar, toggle button, menu and modal
  props) no longer take a `TData` parameter. Drop the type argument.
- `ST_TopToolbarProps` is removed; `ST_TopToolbar` takes no props.
- `memoMode` is removed, with the memoized row and cell components
  (`Memo_ST_TableBodyRow`, `Memo_ST_TableBodyCell`) it switched to.
- `expandRowsFn` is removed. It was never implemented.
- The `stFeatures` value is no longer exported. `ST_Features` stays, as a type.
- `filterFns`, `sortFns` and `aggregationFns` names are resolved by TanStack Table core. A
  `filterFn`, `globalFilterFn`, `sortFn` or `aggregationFn` string must be a built-in name or
  one registered through the table option of the same name; an unknown name logs core's
  development warning and filters, sorts or aggregates nothing. A column's `filterFn` keeps
  the name: `columnDef.filterFn` holds the current filter mode name instead of the resolved
  function, and `columnDef._filterFn` is removed.
- Every ST setter (`table.setDensity`, `setIsFullScreen`, `setShowAlertBanner`,
  `setShowToolbarDropZone`, `setDraggingColumn`, `setHoveredColumn`, `setDraggingRow`,
  `setHoveredRow`, `setCreatingRow`, `setEditingCell`, `setEditingRow`,
  `setColumnFilterFns`, `setGlobalFilterFn`, `setShowColumnFilters`, `setShowGlobalFilter`
  and `setActionCell`) hands its `on*Change` handler a function updater, as TanStack's own
  setters do since v9. A handler resolves it with `functionalUpdate` or a React state
  setter.

### Added

- mk (Macedonian) locale.
- `ST_TableProvider` puts a table on the context the library's components read.
  `ShadcnTable` renders it around its layout.
- `ST_TableProvider` renders the table's `table.AppTable`. Swapping its `table` prop for a
  different table remounts the subtree.
- `useShadcnTable` takes an optional selector as its second argument, as `useTable` does,
  so the owner re-renders only on the state it selects.
- `@tanstack/react-store` is a dependency.
- `getColumnFilterFnName` and `selectST_TransformState` are exported from the barrel.
- Docs: the `localization-i18n-mk` example, and a "Compose with ST_TableProvider" section
  in the toolbar customization guide, linked from the ST components page.

### Changed

- Components subscribe to the state slices they render. A state change re-renders the
  components that show it, not the whole table; `ShadcnTable` itself re-renders only on
  the slices its column and data transforms read.
- Docs: examples and guides compose sub-components without a `table` prop, under
  `ST_TableProvider` outside `ShadcnTable`. Locale imports read
  `@/components/ui/shadcn-table/shared/locales/<code>` in the guides, `/SKILL.md` and the
  registry README. The prop tables follow the name resolution in core, the function
  updater on the ST `on*Change` handlers and the unset `show*` loading slices.
- The table's keyframes ship inside the components as a hoisted `<style>` tag; `shadcn add`
  no longer writes to your global CSS. Remove the `st-` keyframes and the
  `.st-progress-indeterminate` rule an earlier install added there. A strict Content Security
  Policy needs a nonce or `style-src 'unsafe-inline'` for the tag.
- `row.table`, `cell.table`, `column.table` and `header.table` are typed
  `ST_CoreTableInstance`, the core table without state; read `table.store.state` or
  subscribe. The `table` argument of every part prop, renderer and handler that also
  receives a row, cell, column or header, and of `createRow`, has the same type.

### Removed

- Docs: the memoization guide and the `memoMode` and `expandRowsFn` prop table entries.

### Fixed

- The row action Edit button hands the edit modal the live row; a spread copy lost the v9 row prototype and `row.getAllCells` threw.
- `isLoading` and `isSaving` default to `false`, and every loading slice (`isLoading`,
  `isSaving`, `showLoadingOverlay`, `showProgressBars`, `showSkeletons`) is in the table
  store from the first render. The three `show*` slices start unset, so they still follow
  `isLoading` and `isSaving` until they are set.
- The core table at `row.table`, `cell.table` and `header.getContext().table` carries the
  ST state, refs and setters.
- A custom `aggregationFn` name typechecks: `ST_AggregationOption` accepts any string, as
  `ST_FilterOption` and `ST_SortingOption` do.
- `enablePagination: false` with `manualPagination: false` shows every row instead of the
  first page.
- With `enableFilters`, `enableColumnFilters` and `enableGlobalFilter` all `false`, filters
  in state no longer filter the rows.
- Row pinning on select (`rowPinningDisplayMode: 'select-*'`) follows the selection state:
  a Shift range pins every row in it under controlled `rowSelection` or an external
  `atoms.rowSelection` too, select all pins the rows it selects (it cleared every pin), and
  programmatic selection (`row.toggleSelected`, `table.toggleAllRowsSelected`) pins and
  unpins.
- Under `rowPinningDisplayMode: 'select-*'`, unselect all (the select-all checkbox, its
  keyboard toggle and `Clear selection`) clears every pin, rows pinned by hand included, as
  0.3.3 did.
- Rows pinned together on select (a Shift range, select all) keep the row model order,
  whatever order the selection lists them in. Under `select-sticky` the rows pinned on
  another page show above or below the page rows in row model order; they came first.
- Under `rowPinningDisplayMode: 'select-*'` the pagination label covers the pinned rows
  kept from other pages (`keepPinnedRows`): select all with `selectAllMode: 'all'` on 8 rows
  at page size 5 reads `1-8 of 8`, the rows the body shows, not `1-5 of 8`.
- Sticky pinned rows (`rowPinningDisplayMode: 'sticky'` or `'select-sticky'`) stay below
  the table head: with more pinned rows than the container holds they covered the head and
  its select-all checkbox. A pinned stack taller than the container keeps its rows below the
  head and sticks them at the top only. Pinned rows kept from another page take their place
  in the sticky offsets; they were offset by minus one row.
- Switching a column's filter mode re-filters the current filter value with the new mode.
  While a column or global filter is set, a controlled `onColumnFiltersChange` receives an
  identity updater (`(old) => [...old]`) on each `setColumnFilterFns` and `setGlobalFilterFn`
  call so the row model re-filters; a handler that only stores the value needs no change.
- Editing a cell from the cell action menu (`editDisplayMode: 'cell'`) keeps the edit input
  focused when the menu closes.
- Rendering an ST display column header headless
  (`flexRender(header.column.columnDef.Header, header.getContext())`) no longer throws.
- A callback `ref` in `stTableLayoutProps`, `stTableContainerProps`, `stTableHeadProps`,
  `stTableFooterProps`, `stTopToolbarProps` or `stBottomToolbarProps` receives the node;
  only ref objects did.
- Those six refs follow React 19 ref cleanup: a cleanup the callback ref returns runs on
  unmount, and a callback that returns none, or a ref object, gets `null`. The
  `stTableContainerProps` and `stBottomToolbarProps` refs never got `null`, and no cleanup
  ran.
- Both installed trees type-check in one program: a project holding the Radix UI and the
  Base UI copy no longer fails with TS2717 on `stConfigFeature`, and each copy types
  `stFilterCheckboxProps`, `stFilterSliderProps`, `stSelectCheckboxProps`,
  `stSelectAllCheckboxProps`, `stEditRowDialogProps` and `stCreateRowModalProps` for its
  own parts. `table.options` and `column.columnDef` hold them as `ST_PartProps` (`object`).

## 0.3.3 - 2026-10-22

### Removed

- The "Migrating to v1" docs page and its sidebar entry. The table has shipped on TanStack
  Table v9 since 0.3.0; there is no v1 and no migration to document.
- Version-specific wording in the docs: the v9 and v8 mentions on the install page, the
  API option pages, the aggregation guide and the prop tables.

### Changed

- The prop tables link to the current TanStack Table docs (`/table/latest/`) instead of
  the v8 docs.
- Releases happen by merging a pull request. `pnpm release <version>` now bumps the
  versions, closes the `Unreleased` changelog section, pushes a `release/<version>` branch
  and opens the pull request; `release.yml` runs on every push to `master`, tags
  `v<version>` when the tag is missing, then verifies production and creates the GitHub
  release as before. Pushing a `v*` tag by hand still works.

## 0.3.2 - 2026-10-21

### Fixed

- Docs site: broken internal links on eight docs pages, the `custom-headless` example
  (crashed on `r.state`), the detail-panel conditional check and the localization tab
  count, so the release smoke passes on production.

## 0.3.1 - 2026-10-21

### Added

- Automated releases: `pnpm release <version>` bumps both `package.json` versions,
  commits `chore: version <version>`, tags `v<version>` and pushes; the tag runs
  `.github/workflows/release.yml`, which waits for production to serve the version,
  smokes the hosted registry, Storybook, `/SKILL.md` and the docs pages, installs the
  table per base from the public URL and creates the GitHub release from this file.
  Any failed check means no release.
- `GET /version.txt` on the docs site returns the library version.
- `release.yml` on `workflow_dispatch` with `dry_run` runs every check and skips the
  release.
- Privacy-preserving analytics on the docs site with PostHog, sent through a first-party
  `/ingest` proxy; no cookie banner, no session replay. The events are listed in
  `CONTRIBUTING.md`.

### Changed

- The CI install matrix (fresh, existing, base, nextjs) lives in the reusable
  `.github/workflows/install.yml`; `ci.yml` and `release.yml` both call it.
- The library source is two complete trees, `registry/radix` and `registry/base`, kept in
  step by the CI guard `pnpm check:bases`; registry scripts live under `scripts/registry`.
  Install addresses are unchanged.
- Docs pages are far lighter: example code is highlighted in the browser on demand
  (`/docs/guides/editing` went from 4.7 MB to 1.05 MB).
- The docs app is back at `apps/shadcn-table-docs`, with one installed copy per base
  (`components/ui-radix`, `components/ui-base`) and one installer,
  `scripts/install.mjs <base>`. The example code view shows `@/components/ui` imports,
  as a user has them.

### Fixed

- The install command bar on the home page stacks on small screens and no longer
  overflows at 390 and 440 px.
- The docs home page no longer crashes with React error #185 ("Maximum update depth
  exceeded") about 9 seconds after load: the live demo opened its edited salary cell from
  an effect that re-ran on every render, because `useShadcnTable` returns a new table
  object each render. The effect now runs only when the replayed row changes.
- `radix-ui` is bumped to 1.8.1, which carries Radix's fix for the React 19 re-render loop
  in `Select` composed refs (`@radix-ui/react-select` 2.4.1,
  `@radix-ui/react-compose-refs` 1.1.5). The registry item already installs the fixed
  version for new users.
- Docs: internal links to pages that do not exist (`/docs/api/props`,
  `/docs/features/*`, `/docs/guides/aggregation-and-grouping` and other old guide paths,
  in pages and in the option tables) point at the right pages. The custom headless example
  renders again: it passed `header.getContext()`, whose `table` has no `table.state`, to
  the select-all header. The one-panel-at-a-time detail panel example opens its panel.
  The command bar's copy button is named "Copied" again after a click, not only its text.

## 0.3.0 - 2026-10-20

Everything since v0.1.1 in one branch for review: the Base UI edition, the shared-source
layout, and the TanStack Table v9 port.

### Install

- Radix UI: `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/radix/shadcn-table.json`
- Base UI: `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/base/shadcn-table.json`
- Namespace: `shadcn registry add @st=https://www.shadcn-table.com/r/{style}/{name}.json`,
  then `shadcn add @st/shadcn-table`
- GitHub addresses still work: `anindosarker/shadcn-table/shadcn-table` and
  `anindosarker/shadcn-table/shadcn-table-base`.

### Added

- Base UI edition: two editions of the table, one per shadcn base, same API. Registry
  items `shadcn-table` (Radix UI) and `shadcn-table-base` (Base UI), 37 locale items each,
  114 base-neutral example items.
- Hosted registry per base on the docs site: `https://www.shadcn-table.com/r/radix/<name>.json`
  and `/r/base/<name>.json`, namespace form
  `@st=https://www.shadcn-table.com/r/{style}/{name}.json`.
- Docs: site-wide base selector (header pill and the command-bar dropdown on the home
  page); install commands, rendered examples and code views follow it. Storybook ships
  both editions (`/` and `/base/`) with a toolbar button to the other edition;
  `pnpm storybook:all` runs both locally.
- CI: library and test matrix on both editions, install scenarios fresh, existing, base,
  nextjs.
- Detail-panel rows get a `getRowCanExpand` default (v9 refuses to expand rows without
  `subRows`).

### Changed

- TanStack Table v9 (`@tanstack/react-table` 9.3.1): full v9 API, no legacy hook, no
  compatibility layer. Public renames are listed on the docs page
  getting-started/migrating-v1 (17 items): `sortFn`, `sortFns`, `columnResizing`,
  `columnPinning: { start, end }`, `table.state`, `constructAggregationFn` definitions,
  native Shift-click range selection, `getIsSomeRowsSelected` semantics, exports
  `stFeatures` / `ST_Features`.
- Structure: one shared library source `packages/shadcn-table/shared/` plus 23 Base UI
  override files under `bases/base/components/ui/shadcn-table/`; resolution base-first
  then shared (tsconfig paths and a Vite resolver). No stub `package.json` files inside
  `bases/`.
- All registry scripts under `packages/shadcn-table/registry/`; docs app folder
  `apps/docs`; `tsc:radix` / `tsc:baseui`.
- Installed output unchanged: 92 files per item, same targets.

### Known

- Base UI tooltips have no skip-delay grouping. React Aria is not supported.
- Sidebar "Extra Storybook Examples" and the dev-home footer link the Radix UI Storybook
  regardless of the selector; home page tiles render Radix UI only.

## 0.1.1 - 2026-10-18

Patch release. Install or update with the same command; `--overwrite` updates an existing
install: `pnpm dlx shadcn@latest add anindosarker/shadcn-table/shadcn-table --overwrite`.

### Fixed

- Cell action menu stays open on a real right-click (Chrome on macOS fired the right
  button's pointerup into the first menu item).
- Icon buttons wrapped in `ST_Tooltip` without a name now get the tooltip title as
  `aria-label` (column pin, column filter, show/hide columns).
- `<caption>` renders at the bottom by default, like MRT; `[&>caption]:caption-top` on
  `stTableProps` restores the top.
- `ST_Tooltip` and `useST_MediaQuery` are exported from the barrel.

### Added

- `stTableBodyRowProps.hover`: `false` removes the row hover background.
- `stEditTextFieldProps.helperText` and `error`: inline validation text under the edit
  field, `aria-invalid` on error.

### Docs

- Guide samples no longer pass MUI-only props (`color`, `variant`, `startIcon`, `stTheme`).
- Docs app lint is clean and part of CI.

## 0.1.0 - 2026-10-18

First public release of shadcn-table: a full-featured React data table for shadcn/ui,
built on TanStack Table v8, installed into your app with the shadcn CLI. A port of
material-react-table to shadcn/ui (Radix base).

Install: `pnpm dlx shadcn@latest init --base radix`, then
`pnpm dlx shadcn@latest add anindosarker/shadcn-table/shadcn-table`. Docs:
https://www.shadcn-table.com. Storybook: https://storybook.shadcn-table.com.

### Added

- Sorting, filtering (column, global, faceted, filter modes), grouping, aggregation,
  expanding and tree data, row and column pinning, column ordering, resizing, hiding,
  density, full screen.
- Editing (cell, row, modal, table), row selection, row actions, cell actions, click to
  copy, detail panels, row numbers, row and column virtualization, sticky header and
  footer, pagination.
- 38 locales as separate registry items (`anindosarker/shadcn-table/shadcn-table-locale-<code>`).
- Every docs example installable as `anindosarker/shadcn-table/example-<slug>`.
- AI agent entry points: https://www.shadcn-table.com/SKILL.md,
  `npx skills add anindosarker/shadcn-table`, https://www.shadcn-table.com/llms.txt.

### Requirements

- React 18+, Tailwind CSS v4, shadcn/ui on the Radix base. Base UI and React Aria are not
  supported in this release.

### Known

- Cell action menu does not stay open on a real right-click in some browsers.
- Tooltip triggers have no accessible name.
- `<caption>` renders at the top; no caption-bottom default.
- A few docs samples still pass MUI-era props the types do not declare.
