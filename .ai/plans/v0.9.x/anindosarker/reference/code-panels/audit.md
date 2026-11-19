# Code panel audit (spec 66, D142)

Read 2026-11-19 at `origin/claude/review` 55a6150b, pool worktree 08: static Storybook builds of base, radix and aria (`pnpm --filter shadcn-table storybook:build:<base>`) served by `python3 -m http.server`, and a production docs build (`pnpm --filter shadcn-table-docs build`, `next start`). Reader: `read-panels.mjs` in this folder. Measure: D142, the table's own code, complete enough to copy and run, never the test.

## Classes

- table code complete: the panel shows `ShadcnTable` or `useShadcnTable` with its columns and data (or a table instance), and every name it uses is declared in the text, a global, or imported from a package. The Storybook panel shows no import lines at all, so a package import of the story file counts as present there; the docs panels show their imports.
- table code without its columns or data: table code, but names it uses (`columns`, `data`, helpers) are declared only elsewhere in the story file or in a relative import, or it passes neither columns and data nor a table instance.
- wrapper only: no table code; the panel renders a component, or calls a story factory, declared elsewhere (`render: () => <BasicExample />`, `pinStory({...})`).
- with test: the text holds `play`, `expect(`, `userEvent`, `within(` or `storybook/test`. A panel carries this class next to one of the three above.
- pass: table code complete and no test. Every other row fails.

## Storybook Code tab, base

- Ids in `storybook-static/base/index.json`: 645. Rows below: 645.
- Pass 22, fail 623.
- table code without its columns or data: 385
- table code without its columns or data + with test: 120
- wrapper only + with test: 89
- wrapper only: 29
- table code complete: 22
- Sum of the lines above: 645.
- Per failing class (a row can count twice): table code without its columns or data 505, wrapper only 118, with test 209.
- By export shape (shape: rows, pass):
  - arrow: 316, 19
  - object (render one-line): 204, 0
  - arrow + X.play: 103, 3
  - factory call: 11, 0
  - object (render function): 7, 0
  - object (render block): 3, 0
  - object: 1, 0
- An object story with `args` (the story or its meta) first shows its source as written and, once the story rendered, the args one-liner of `preview.tsx` `source.transform` (`() => <ShadcnTable columns={columns} data={data} />`); the rows record the settled text. 5 of the 215 object stories show that one-liner and no test (`basic--default`, two `row-pinning-on-select` stories, `view-settings--persistence` as `() => <ShadcnTable  />`, `render-counts--profiled-thousand-rows`); `search-field--position-left`, the one object story without a play, shows its object. The 7 `pinStory()` factory stories show the one-liner too.

## Storybook Code tab, radix and aria

- radix: 85 ids read (the first story of each of the 85 story files); the text equals base for 85.
- aria: 85 ids read, the same ids; the text equals base for 85.
- The panel text does not depend on the base.

## Docs code panels

Pages read: 692 (every `.mdx` of `content/docs/examples`, `examples/more` and `guides`), all HTTP 200. Each panel is read in Code view with every file of its file tree; a guide's Example section is read for each item of its picker.

| Panel kind | Pages read | Panels | Fail | What the panel shows |
|---|---|---|---|---|
| Example pages (`/docs/examples/<slug>`) | 42 | 42 | 0 | table code complete 42 |
| Story pages (`/docs/examples/more/`) | 603 | 603 | 603 | table code complete + with test 489; table code without its columns or data + with test 114 |
| Guide Example section: example page item | 30 | 35 | 0 | table code complete 35 |
| Guides' own tables (inline example panels) | 31 | 61 | 0 | table code complete 61 |
| Guide Example section: story item without `codeFrom` | 15 | 15 | 15 | table code complete + with test 13; table code without its columns or data + with test 2 |
| Guide Example section: story item with `codeFrom` | 1 | 1 | 0 | table code complete 1 |

- Story pages and story items of a guide show the whole story file: every story of the file, its `meta`, its plays and `storybook/test` imports. "Without its columns or data" there means the file imports `../../.storybook/themes` (or another relative file) that the panel does not list.
- `guides/index.mdx` has no code panel. Code blocks in guide text (fenced snippets) and the option tables (`TableOptionsTable` and the like) are not example panels and are not counted.
- Failing guide Example items without `codeFrom` (15): /docs/guides/click-to-copy (features-click-to-copy--click-to-copy-enabled-with-copy-button-props), /docs/guides/column-hiding (features-column-hiding--column-hidden-on-load), /docs/guides/column-resizing (features-column-resizing--column-widened-on-load), /docs/guides/column-size (styling-custom-column-widths--custom-widths-semantic), /docs/guides/customize-icons (features-icons--provider-icon-set), /docs/guides/density-toggle (features-dense-padding--default-to-dense-padding), /docs/guides/display-columns (styling-styling-display-columns--customize-display-columns), /docs/guides/filter-chips (features-filter-chips--chips-seeded), /docs/guides/global-filtering (features-search--searched-on-load), /docs/guides/localization (features-localization--spanish), /docs/guides/overflow-tooltip (styling-default-look--overflow-tooltip), /docs/guides/row-actions (features-row-actions--custom-row-action-buttons), /docs/guides/sort-editor (features-sort-popover--sort-popover-seeded), /docs/guides/sorting (features-sorting--sorted-on-load), /docs/guides/toolbar-customization (features-toolbar--custom-top-toolbar-actions).

### First three lines

`/docs/examples/basic` (example page):

`/TS.tsx`
```tsx
import { useMemo } from 'react';
import {
  ShadcnTable,
```

`/docs/examples/more/basic--default` (story page):

`/Basic.stories.tsx`
```tsx
import type { Meta, StoryContext, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
```

`/docs/guides/production-ready-tables` (guide Example section, `codeFrom` `server-side-data`, files: `/TS.tsx`, `/components/UsersTable.tsx`, `/hooks/useTableQueryParams.ts`, `/hooks/useUsersQuery.ts`, `/lib/users.service.ts`):

`/TS.tsx`
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; //note: this is TanStack React Query V5
import { UsersTable } from './components/UsersTable';
//react query setup in App.tsx
```
## Same-table stories

Found by comparing, per story, its table expression (the arrow, or the object's `render` and `args` with the meta's) together with every top-level declaration of the story file it uses, play, parameters and tags left out; equal texts within one story group are the same table. 13 groups, 19 copies; every copy has a play of its own and no other difference.

- Basic: "Default" and "Basic" are different tables; both stay. "Default" is the meta's `<ShadcnTable columns data />` with 4 flat columns (First Name, Last Name, Age, City) over 8 people (Ada Lovelace to Ken Thompson). "Basic" is the docs example `basic` (`BasicExample`, `useShadcnTable` plus `<ShadcnTable table />`) with 5 columns on nested data read through dot accessor keys (`name.firstName`, `name.lastName`, `address`, `city`, `state`, sized 150 and 200) over 5 addresses (John Doe to Joshua Rolluffs).
- Features/Column Action: "Menu Sort Stacks", "Label Opens Menu" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Label Opens Menu" is a copy of "Menu Sort Stacks", its play moves onto "Menu Sort Stacks" and the copy is deleted (ids `features-column-action--label-opens-menu`).
- Features/Column Dragging: "Column Dragging Enabled", "Column Dragging Cancelled", "Drop Highlights Column" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Column Dragging Cancelled", "Drop Highlights Column" are copies of "Column Dragging Enabled", their plays move onto "Column Dragging Enabled" and the copies are deleted (ids `features-column-dragging--column-dragging-cancelled`, `features-column-dragging--drop-highlights-column`).
- Features/Column Resizing: "Resize Guides Meet Edge", "Drag Resizes Column", "Double Click Resets Width", "Resize Menu Item Resets" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Drag Resizes Column", "Double Click Resets Width", "Resize Menu Item Resets" are copies of "Resize Guides Meet Edge", their plays move onto "Resize Guides Meet Edge" and the copies are deleted (ids `features-column-resizing--drag-resizes-column`, `features-column-resizing--double-click-resets-width`, `features-column-resizing--resize-menu-item-resets`).
- Features/Filtering: "Mode Picker By Default Popover", "Mode Menu Next To Button Popover", "Mode Menu Next To Button During Popover Animation" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Mode Menu Next To Button Popover", "Mode Menu Next To Button During Popover Animation" are copies of "Mode Picker By Default Popover", their plays move onto "Mode Picker By Default Popover" and the copies are deleted (ids `features-filtering--mode-menu-next-to-button-popover`, `features-filtering--mode-menu-next-to-button-during-popover-animation`).
- Features/Filtering: "Type Then Clear Filters Stays Cleared", "Chip Editor Escape Keeps Typed Text", "Chip Editor Escape Keeps Typed Date" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Chip Editor Escape Keeps Typed Text", "Chip Editor Escape Keeps Typed Date" are copies of "Type Then Clear Filters Stays Cleared", their plays move onto "Type Then Clear Filters Stays Cleared" and the copies are deleted (ids `features-filtering--chip-editor-escape-keeps-typed-text`, `features-filtering--chip-editor-escape-keeps-typed-date`).
- Features/Filtering: "Subheader: Type Then Enter Applies At Once", "Subheader: Half Typed Year Applies Nothing" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Subheader: Half Typed Year Applies Nothing" is a copy of "Subheader: Type Then Enter Applies At Once", its play moves onto "Subheader: Type Then Enter Applies At Once" and the copy is deleted (ids `features-filtering--half-typed-year-applies-nothing`).
- Features/Row Ordering: "Drop Slides Rows", "Drop No Slide Reduced Motion", "Drag Reorders Rows" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Drop No Slide Reduced Motion", "Drag Reorders Rows" are copies of "Drop Slides Rows", their plays move onto "Drop Slides Rows" and the copies are deleted (ids `features-row-ordering--drop-no-slide-reduced-motion`, `features-row-ordering--drag-reorders-rows`).
- Features/Virtualization: "Scroll Renders Further Rows", "Column Virtualization Scrolls Headers" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Column Virtualization Scrolls Headers" is a copy of "Scroll Renders Further Rows", its play moves onto "Scroll Renders Further Rows" and the copy is deleted (ids `features-virtualization--column-virtualization-scrolls-headers`).
- Miscellaneous/Headless Full Screen: "Escape Leaves Full Screen", "Pointer Click Then Escape" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Pointer Click Then Escape" is a copy of "Escape Leaves Full Screen", its play moves onto "Escape Leaves Full Screen" and the copy is deleted (ids `miscellaneous-headless-full-screen--pointer-click-then-escape`).
- Miscellaneous/Headless Full Screen: "Table Layout Pointer Click Then Escape", "Escape In Search Keeps Full Screen" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Escape In Search Keeps Full Screen" is a copy of "Table Layout Pointer Click Then Escape", its play moves onto "Table Layout Pointer Click Then Escape" and the copy is deleted (ids `miscellaneous-headless-full-screen--escape-in-search-keeps-full-screen`).
- Miscellaneous/Menu Focus Return: "Column Action Menu", "Show Hide Columns Menu" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Show Hide Columns Menu" is a copy of "Column Action Menu", its play moves onto "Column Action Menu" and the copy is deleted (ids `miscellaneous-menu-focus-return--show-hide-columns-menu`).
- Miscellaneous/Menu Openers: "Column Actions", "Show Hide Columns" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Show Hide Columns" is a copy of "Column Actions", its play moves onto "Column Actions" and the copy is deleted (ids `miscellaneous-menu-openers--show-hide-columns`).
- Styling/Render Counts: "Columns Hold While Resizing", "Columns Hold While Dragging" render the same table (same columns, data and options; the stories differ only in their play). Verdict (D106, D110): merge; "Columns Hold While Dragging" is a copy of "Columns Hold While Resizing", its play moves onto "Columns Hold While Resizing" and the copy is deleted (ids `styling-render-counts--columns-hold-while-dragging`).

## Card Q133 lookup

- "Code panel shows `docs.source.originalSource`, object stories include play": corrected. 209 of 215 object stories show their play; 5 object stories with `args` settle on the args one-liner of `source.transform` and show no test (see the base section), as do the 7 `pinStory()` factory stories; 1 object story has no play.
- "39 of 42 E14 exact stories are object stories whose render wraps a component defined in the same file (32 one-line, 7 `WithQueryClient`); 3 inline render functions": confirmed, 32, 7 and 3. Of the 3 render functions, `features-detail-panel--lazy-detail-panel` also shows only a wrapper; the other 2 show table code without its data. All 42 fail.
- "Each wrapped component is defined higher in the same story file, nothing is imported": confirmed for the 39.
- "59 test stories of the wrapper shape existed in 0.9.4 already" (spec 1.3): confirmed, 59 object stories of `v0.9.4` render `<X />` (no props, X declared in the file) and have a play; 68 when `<X prop />` counts too. At 55a6150b: 63 (74 with props).
- "v0.9.4 had no exact stories; its arrow stories with `X.play` kept play out": confirmed for the shape at 55a6150b: 0 of 419 arrow stories (103 with `X.play`) show a test.
- "Docs example pages show `examples/base/<slug>/TS.tsx`; `more/` pages show the whole story file": confirmed, 42 example pages show their example folder (all pass), 603 story pages show the whole story file with its tests (all fail).
- "'Default' and 'Basic' under Basic are different tables": confirmed (above).
- Spec 1.3 "85 files; about 400 arrow functions, about 215 objects with render and play, 63 of them one-line wrappers": confirmed with exact counts: 85 files, 419 arrow exports, 215 object exports (214 with their own `render`, 1 with the meta's; 214 with a play), 63 one-line `<X />` wrappers, and 11 factory-call exports not in the spec's count.

## Storybook rows (base)

Names: what the panel uses and does not declare or import (first four).

| Id | Export | Code tab shows | D142 | Names not in the panel |
|---|---|---|---|---|
| `basic--default` | object {play} | table code without its columns or data | fail | columns, data |
| `basic--basic` | object {render, play} (render one-line) | wrapper only + with test | fail | BasicExample, addresses |
| `features-aggregation--aggregation` | arrow | table code without its columns or data | fail | columns, data |
| `features-aggregation--aggregation-with-selection` | arrow | table code without its columns or data | fail | columns, data |
| `features-aggregation--aggregation-expanded-default` | arrow | table code without its columns or data | fail | columns, data |
| `features-aggregation--aggregation-remove-mode` | arrow | table code without its columns or data | fail | columns, data |
| `features-aggregation--aggregation-false-mode` | arrow | table code without its columns or data | fail | columns, data |
| `features-aggregation--aggregation-remove-mode-custom-grouped-cell` | arrow | table code without its columns or data | fail | columns, data |
| `features-aggregation--aggregation-grouped-and-expanded-default` | arrow | table code without its columns or data | fail | columns, data |
| `features-aggregation--multi-aggregation-per-column` | arrow | table code without its columns or data | fail | averageAge, averageSalary, data |
| `features-aggregation--grouped-row-shows-aggregate` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-aggregation--aggregation-and-grouping` | object {name, render, play} (render one-line) | wrapper only + with test | fail | AggregationAndGroupingTable, exampleAverageSalary, exampleMaxAge |
| `features-cell-action--cell-actions-enabled` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-cell-action--cell-actions-enabled-conditionally` | arrow | table code without its columns or data | fail | columns, data |
| `features-cell-action--cell-actions-enabled-custom` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-cell-action--cell-actions-with-click-to-copy` | arrow | table code without its columns or data | fail | columns, data |
| `features-cell-action--cell-actions-with-built-ins` | arrow | table code without its columns or data | fail | columns, data |
| `features-click-to-copy--click-to-copy-enabled` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-click-to-copy--click-to-copy-enabled-with-column-resizing` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-click-to-copy--click-to-copy-enabled-per-column` | arrow | table code without its columns or data | fail | data |
| `features-click-to-copy--click-to-copy-disabled-per-column` | arrow + X.play | table code without its columns or data | fail | data |
| `features-click-to-copy--click-to-copy-enabled-with-copy-button-props` | arrow + X.play | table code without its columns or data | fail | contactColumns, contacts |
| `features-column-action--column-actions-enabled-default` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-action--column-actions-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-action--column-actions-disabled-per-column` | arrow | table code without its columns or data | fail | data |
| `features-column-action--column-actions-enabled-per-column` | arrow | table code without its columns or data | fail | data |
| `features-column-action--custom-column-actions` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-action--custom-column-actions-per-column` | arrow | table code without its columns or data | fail | data |
| `features-column-action--menu-items-follow-the-column-state` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | closeMenu, menuColumns, menuData, menuItem, ... |
| `features-column-action--menu-sort-stacks` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | headerCell, menuColumns, menuData, menuItem, ... |
| `features-column-action--menu-reset-size-after-resize` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | closeMenu, menuColumns, menuData, menuItem, ... |
| `features-column-action--label-opens-menu` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | body, closeMenu, headerCell, menuColumns, ... |
| `features-column-dragging--column-dragging-enabled` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyCell, centreOf, columns, data, ... |
| `features-column-dragging--column-dragging-cancelled` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | centreOf, columns, data, dragEnd, ... |
| `features-column-dragging--column-dragging-locked-column` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | centreOf, columns, data, dragEnd, ... |
| `features-column-dragging--column-dragging-with-grip` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, headerCell, headerNames, ... |
| `features-column-dragging--touch-hold-on-range-slider` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | agedData, centreOf, ghost, headerCell, ... |
| `features-column-dragging--column-dragging-disabled-per-column` | arrow | table code without its columns or data | fail | data |
| `features-column-dragging--drop-highlights-column` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, dragEnd, dragOverSlot, ... |
| `features-column-dragging--moved-column-on-top` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyCell, columns, data, dragEnd, ... |
| `features-column-grouping--column-grouping-enabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--column-grouping-enabled-reorder` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-column-grouping--grouping-column-mode-remove` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-column-grouping--grouping-column-mode-false` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--grouping-column-mode-remove-custom-header` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--grouping-column-mode-remove-paginate-pre-expand` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--grouping-column-mode-remove-custom-grouped-cell` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--column-grouping-enabled-with-selection` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--column-grouping-enabled-with-selection-remove` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--column-grouping-no-drag-handles` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--column-grouping-enabled-drop-zone-bottom` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--column-grouping-enabled-custom-aggregate` | arrow + X.play | table code without its columns or data | fail | data |
| `features-column-grouping--column-grouping-banner-on-bottom` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--grouping-columns-set-state` | arrow | table code complete | pass |  |
| `features-column-grouping--column-grouping-drop-zone-always-visible` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--grouping-state-managed` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-grouping--grouping-and-dragging-with-some-disabled-grouping` | arrow | table code without its columns or data | fail | data |
| `features-column-grouping--grouped-header-width-sums-columns` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, headerCell, textNode, ... |
| `features-column-grouping--grouped-header-width-override` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, headerCell, thWidth |
| `features-column-grouping--grouped-expand-aligns-start-all-modes` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-column-grouping--expand-group-shows-rows` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-column-grouping--column-grouping` | object {render, play} (render one-line) | wrapper only + with test | fail | ColumnGroupingTable, headerCell |
| `features-column-grouping--customized-grouping` | object {render, play} (render one-line) | wrapper only + with test | fail | CustomizedGroupingTable, headerCell |
| `features-column-hiding--column-hiding-enabled-default` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-hiding--column-hiding-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-hiding--column-hiding-disabled-but-with-ordering` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-hiding--column-hiding-disabled-but-with-pinning` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-hiding--column-hiding-disabled-per-column` | arrow | table code without its columns or data | fail | data |
| `features-column-hiding--column-hiding-with-header-groups` | arrow | table code without its columns or data | fail | data |
| `features-column-hiding--column-hiding-columns-not-visible-in-show-hide` | arrow | table code without its columns or data | fail | data |
| `features-column-hiding--column-hiding-with-columns-hidden-and-not-visible-in-show-hide` | arrow | table code without its columns or data | fail | data |
| `features-column-hiding--column-hiding-keyboard-toggle` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-column-hiding--menu-items-show-icons` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-column-hiding--menu-reorder-with-table-offset` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, headerLeft, menuRow, ... |
| `features-column-hiding--column-hidden-on-load` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-column-ordering--column-ordering-enabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-ordering--column-ordering-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-ordering--display-column-ordering-enabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-ordering--column-ordering-disabled-per-column` | arrow + X.play | table code without its columns or data | fail | data |
| `features-column-ordering--column-ordering-with-select` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-ordering--column-ordering-no-drag-handles` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-ordering--column-ordering-state-managed` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-ordering--column-ordering-state-managed-custom` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-ordering--column-ordering-enabled-with-column-virtualization` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-ordering--menu-reorder-moves-column` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | centreOf, columns, data, firstRowIds, ... |
| `features-column-ordering--column-dnd-ordering` | object {name, render, play} (render one-line) | wrapper only + with test | fail | ColumnDndOrderingTable, dataHeaderIds, firstRowIds, headerIds, ... |
| `features-column-pinning--column-pinning-enabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-pinning--column-pinning-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-pinning--column-pinning-initial` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-column-pinning--column-pinning-disabled-per-column` | arrow | table code without its columns or data | fail | data |
| `features-column-pinning--column-pinning-with-select` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-pinning--column-pinning-with-detail-panel` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-pinning--pin-start-sticks` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyCell, columnMenuAction, columns, data, ... |
| `features-column-pinning--column-pinning` | object {render, play} (render one-line) | wrapper only + with test | fail | ColumnPinningTable, columnMenuAction, header, headerIds |
| `features-column-resizing--column-resizing-enabled-default-on-change` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-enabled-default-on-change-rtl` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-enabled-default-on-change-grid` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-default-on-change-grid-with-individual-shrink` | arrow | table code without its columns or data | fail | data |
| `features-column-resizing--column-resizing-enabled-default-on-change-grid-rtl` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-enabled-default-on-change-semantic` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-enabled-default-on-change-semantic-rtl` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-enabled-no-column-actions` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-disabled-some-columns` | arrow | table code without its columns or data | fail | data |
| `features-column-resizing--column-resizing-enabled-on-end` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-enabled-on-end-rtl` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-custom-default-widths` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-with-pinning` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-with-header-groups` | arrow | table code complete | pass |  |
| `features-column-resizing--column-resizing-with-header-groups-grid-grow` | arrow | table code complete | pass |  |
| `features-column-resizing--column-resizing-layout-grid-grow` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--column-resizing-layout-grid-grow-rtl` | arrow | table code without its columns or data | fail | columns, data |
| `features-column-resizing--resize-guides-meet-edge` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, expectResizeGuidesMeetEdge |
| `features-column-resizing--drag-resizes-column` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, dragFirstNameHandle, firstNameCells, ... |
| `features-column-resizing--double-click-resets-width` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, dragFirstNameHandle, firstNameCells, ... |
| `features-column-resizing--resize-menu-item-resets` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, dragFirstNameHandle, firstNameHeader, ... |
| `features-column-resizing--reset-size-animates` | object {render, play} (render one-line) | wrapper only + with test | fail | ResetSizeAnimatesTable, firstNameHeader |
| `features-column-resizing--column-widened-on-load` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, dragFirstNameHandle, firstNameHeader, ... |
| `features-creating--create-row-index-top` | arrow | table code without its columns or data | fail | data |
| `features-creating--create-row-index-bottom` | arrow | table code without its columns or data | fail | data |
| `features-creating--create-row-index-index` | arrow | table code without its columns or data | fail | data |
| `features-creating--create-row-index-index-virtualized` | arrow | table code without its columns or data | fail | data |
| `features-creating--create-row-index-index-expanding` | arrow | table code without its columns or data | fail | expandingData |
| `features-creating--create-with-custom-edit-cell` | arrow | table code without its columns or data | fail | data |
| `features-creating--create-row-appears` | object {render, play} (render function) | table code without its columns or data + with test | fail | data |
| `features-custom-filter-fns--custom-column-filter-fn` | arrow + X.play | table code without its columns or data | fail | data, lengthEquals |
| `features-custom-filter-fns--custom-global-filter-fn` | arrow + X.play | table code without its columns or data | fail | columns, data, lengthEquals |
| `features-custom-filter-fns--default-fuzzy-global-filter` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-custom-filter-fns--custom-sort-fn` | arrow + X.play | table code without its columns or data | fail | data |
| `features-custom-filter-fns--custom-aggregation-fn` | arrow + X.play | table code without its columns or data | fail | data |
| `features-custom-filter-fns--aggregation-fn-array` | arrow + X.play | table code without its columns or data | fail | data |
| `features-custom-filter-fns--two-tables-different-registries` | arrow + X.play | table code without its columns or data | fail | data, lengthEquals |
| `features-custom-filter-fns--unknown-filter-fn-name` | object {beforeEach, render, play} (render one-line) | table code without its columns or data + with test | fail | data, firstNameCells, unknownNameWarn |
| `features-custom-filter-fns--global-filter-mode-switch` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyText, columns, data, firstNameCells |
| `features-custom-filter-fns--programmatic-global-filter-mode` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyText, modeColumns, modeData |
| `features-custom-filter-fns--programmatic-column-filter-mode` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyText, modeColumns, modeData |
| `features-custom-filter-fns--column-filter-mode-switch` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyText, firstNameCells, modeData |
| `features-customization--minimal` | object {render, play} (render one-line) | wrapper only + with test | fail | MinimalTable |
| `features-customization--custom-headless` | object {render, play} (render one-line) | wrapper only + with test | fail | CustomHeadlessTable |
| `features-customization--advanced` | object {render, play} (render one-line) | wrapper only + with test | fail | AdvancedTable |
| `features-date-filters--greater-than-on-date-column` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--less-than-on-date-column` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--equals-matches-calendar-day` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--between-inclusive-on-date-column` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--time-of-day-on-date-column` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--plain-date-variant-defaults-to-equals` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--iso-string-column-unchanged` | arrow + X.play | wrapper only | fail | DateTable |
| `features-date-filters--not-equals-on-date-column` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--date-time-on-date-column` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--date-time-greater-than-on-date-column` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--time-with-seconds-on-date-column` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--date-filter-value-on-date-column` | arrow + X.play | wrapper only | fail | DateTable, joinedColumn |
| `features-date-filters--iso-date-time-string-column-by-day` | arrow + X.play | wrapper only | fail | DateTable |
| `features-dense-padding--dense-padding-toggle-enabled-default` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-dense-padding--dense-padding-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-dense-padding--default-to-dense-padding` | arrow | table code without its columns or data | fail | columns, data |
| `features-detail-panel--detail-panel-enabled-semantic` | arrow + X.play | table code complete | pass |  |
| `features-detail-panel--detail-panel-enabled-grid` | arrow | table code complete | pass |  |
| `features-detail-panel--detail-panel-enabled-grid-no-grow` | arrow | table code complete | pass |  |
| `features-detail-panel--custom-expand-rotation` | arrow | table code complete | pass |  |
| `features-detail-panel--detail-panel-enabled-conditional` | arrow | table code complete | pass |  |
| `features-detail-panel--detail-panel-enabled-conditional-hide` | arrow | table code complete | pass |  |
| `features-detail-panel--detail-panel-single-expand` | arrow + X.play | table code complete | pass |  |
| `features-detail-panel--detail-panel-expand-column-last` | arrow | table code complete | pass |  |
| `features-detail-panel--detail-panel-expanded-by-default` | arrow | table code complete | pass |  |
| `features-detail-panel--detail-panel-expand-all-disabled` | arrow | table code complete | pass |  |
| `features-detail-panel--detail-panel-expand-all-disabled-grid` | arrow | table code complete | pass |  |
| `features-detail-panel--detail-panel-expand-all-disabled-grid-no-grow` | arrow | table code complete | pass |  |
| `features-detail-panel--panel-renders` | object {render, play} (render one-line) | wrapper only + with test | fail | PanelTable, expectPanelRenders |
| `features-detail-panel--panel-renders-virtualized` | object {render, play} (render one-line) | wrapper only + with test | fail | PanelTable, expectPanelRenders |
| `features-detail-panel--conditional-panel-disables-empty-row` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | conditionalMembers, members |
| `features-detail-panel--detail-panel` | object {render, play} (render function) | table code without its columns or data + with test | fail | expandButtonOf, panelPeople, panelPeopleColumns |
| `features-detail-panel--chart-detail-panel` | object {render, play} (render function) | table code without its columns or data + with test | fail | chartPeople, chartPeopleColumns, expandButtonOf |
| `features-detail-panel--lazy-detail-panel` | object {render, play} (render function) | wrapper only + with test | fail | LazyDetailPanelTable |
| `features-editing--editing-enabled-edit-mode-modal-default` | arrow + X.play | table code without its columns or data | fail | data |
| `features-editing--editing-feature-enabled-conditionally` | arrow | table code without its columns or data | fail | data |
| `features-editing--editing-enabled-edit-mode-row` | object {render, play} (render function) | table code without its columns or data + with test | fail | data, firstNameCell |
| `features-editing--editing-validation-helper-text` | arrow + X.play | table code without its columns or data | fail | data |
| `features-editing--editing-enabled-edit-mode-row-custom-save` | arrow | table code without its columns or data | fail | data |
| `features-editing--editing-enabled-edit-mode-row-virtualized` | arrow | table code without its columns or data | fail | data |
| `features-editing--editing-enabled-edit-mode-cell` | object {render, play} (render function) | table code without its columns or data + with test | fail | data, firstNameCell |
| `features-editing--editing-enabled-edit-mode-cell-with-row-actions` | arrow | table code without its columns or data | fail | data |
| `features-editing--editing-enabled-edit-mode-table` | arrow | table code without its columns or data | fail | data |
| `features-editing--edit-select-variant` | arrow | table code without its columns or data | fail | data, usStates |
| `features-editing--edit-select-variant-alternate` | arrow | table code without its columns or data | fail | data |
| `features-editing--editing-customize-input` | arrow | table code without its columns or data | fail | data, usStates |
| `features-editing--editing-enabled-async` | arrow | table code without its columns or data | fail | data |
| `features-editing--editing-nested-data` | arrow | table code without its columns or data | fail | nestedData |
| `features-editing--editing-enabled-edit-mode-table-with-grouped-rows` | arrow | table code without its columns or data | fail | data |
| `features-editing--enable-editing-conditionally` | arrow | table code without its columns or data | fail | data |
| `features-editing--enable-editing-conditionally-cell` | arrow | table code without its columns or data | fail | data |
| `features-editing--enable-editing-conditionally-table` | arrow | table code without its columns or data | fail | data |
| `features-editing--editing-cell-manual-on-change` | arrow | table code without its columns or data | fail | data |
| `features-editing--modal-edit-saves` | object {render, play} (render one-line) | wrapper only + with test | fail | EditingEnabledEditModeModalDefault, data, firstNameCell |
| `features-editing--editing-crud` | object {name, render, play} (render one-line) | wrapper only + with test | fail | CrudRowOrModalTable, WithQueryClient, deleteThroughDialog, slow |
| `features-editing--inline-editing` | object {render, play} (render one-line) | wrapper only + with test | fail | CrudRowOrModalTable, WithQueryClient, crudCell, deleteThroughDialog, ... |
| `features-editing--editing-crud-inline-cell` | object {name, render, play} (render one-line) | wrapper only + with test | fail | CrudCellOrTableTable, WithQueryClient, crudCell, deleteThroughDialog, ... |
| `features-editing--editing-crud-inline-table` | object {name, render, play} (render one-line) | wrapper only + with test | fail | CrudCellOrTableTable, WithQueryClient, crudCell, deleteThroughDialog, ... |
| `features-editing--editing-crud-tree` | object {name, render, play} (render one-line) | wrapper only + with test | fail | CrudTreeTable, WithQueryClient, crudCell, deleteThroughDialog, ... |
| `features-export--csv-export` | object {name, render, play} (render one-line) | wrapper only + with test | fail | CsvExportTable, data, selectTwoRows |
| `features-export--pdf-export` | object {name, render, play} (render one-line) | wrapper only + with test | fail | PdfExportTable, data, selectTwoRows |
| `features-filter-chips--chips-default` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyRows, chipOf, columns, data, ... |
| `features-filter-chips--chips-seeded` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | ST_BASE, bodyRows, chipOf, columns, ... |
| `features-filter-chips--chips-hidden-column` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | chipOf, columns, data, options |
| `features-filter-chips--chips-header-editor` | object {render, play} (render function) | table code without its columns or data + with test | fail | chipOf, columns, data, options |
| `features-filter-chips--filter-mode-picker-table-level` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, modeItem, options |
| `features-filter-chips--chips-custom-toolbar` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyRows, columns, data, options |
| `features-filter-chips--chip-editor-keeps-width` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, options, statuses |
| `features-filter-chips--mode-picker-by-default-chips` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | data, modeMenuItems, options, plainColumns |
| `features-filter-chips--multi-select-array-modes` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyRows, data, modeMenuItems, options, ... |
| `features-filter-chips--select-clear-beside-chevron` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | chipOf, data, options, plainColumns |
| `features-filter-chips--range-editor-inputs-fit-and-fill-time` | factory rangeEditorCase() | wrapper only | fail | rangeEditorCase |
| `features-filter-chips--range-editor-inputs-fit-and-fill-date` | factory rangeEditorCase() | wrapper only | fail | rangeEditorCase |
| `features-filter-chips--range-editor-inputs-fit-and-fill-date-time` | factory rangeEditorCase() | wrapper only | fail | rangeEditorCase |
| `features-filter-chips--range-editor-inputs-fit-and-fill-number` | factory rangeEditorCase() | wrapper only | fail | rangeEditorCase |
| `features-filter-chips--multi-select-opens-on-click` | object {render, play} (render block) | wrapper only + with test | fail | ChipEditorKeepsWidth |
| `features-filter-chips--escape-closes-editor-after-select-pick` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyRows, chipOf, data, options, ... |
| `features-filter-chips--select-chevron-at-input-end` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | data, options, selectStatusColumns |
| `features-filtering--filtering-enabled-default` | arrow | table code without its columns or data | fail | columns, data |
| `features-filtering--chips-display-mode` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-filtering--popover-display-mode` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-filtering--popover-display-mode-no-sorting` | arrow | table code without its columns or data | fail | columns, data |
| `features-filtering--column-filtering-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-filtering--filtering-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-filtering--filter-highlighting-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-filtering--filter-fn-and-filter-variants` | arrow | table code without its columns or data | fail | data |
| `features-filtering--filter-fn-and-filter-variants-faceted` | arrow | table code without its columns or data | fail | data |
| `features-filtering--multi-select-field-controls` | object {name, render, play} (render one-line) | table code without its columns or data + with test | fail | ST_BASE, columns, data, filterHeaderCell |
| `features-filtering--range-slider-custom-bounds` | object {name, render, play} (render one-line) | table code without its columns or data + with test | fail | data, filterHeaderCell, thumbValues |
| `features-filtering--filtering-change-mode-enabled` | arrow | wrapper only | fail | ChangeModeTable |
| `features-filtering--filter-mode-menu-closes-in-place` | object {name, render, play} (render one-line) | wrapper only + with test | fail | ChangeModeTable, menuExiting |
| `features-filtering--filtering-change-mode-enabled-faceted` | object {name, render, play} (render one-line) | table code without its columns or data + with test | fail | data, sliderCaptionBelowTrack, subheaderInputsInsideCell |
| `features-filtering--subheader-range-fields-narrow` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | data |
| `features-filtering--filtering-change-mode-enabled-hidden` | arrow | table code without its columns or data | fail | data |
| `features-filtering--disable-some-filter-types-for-certain-columns` | arrow | table code without its columns or data | fail | data |
| `features-filtering--filtering-disabled-for-certain-columns` | arrow | table code without its columns or data | fail | data |
| `features-filtering--custom-filter-function-per-column` | arrow | table code without its columns or data | fail | data |
| `features-filtering--custom-filter-fns` | arrow | table code without its columns or data | fail | data |
| `features-filtering--custom-filter-component` | arrow | table code without its columns or data | fail | data |
| `features-filtering--customize-filter-text-fields` | arrow | table code without its columns or data | fail | data |
| `features-filtering--manual-filtering` | arrow | table code without its columns or data | fail | columns, data |
| `features-filtering--external-set-filter-value` | arrow | table code without its columns or data | fail | columns, data |
| `features-filtering--initial-filters` | arrow | table code without its columns or data | fail | data |
| `features-filtering--range-filter-min-value` | object {name, render, play} (render one-line) | table code without its columns or data + with test | fail | scoreColumns, scoreData |
| `features-filtering--mode-picker-by-default-subheader` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | filterHeaderCell, openModeMenuItems, scoreColumns, scoreData |
| `features-filtering--mode-picker-by-default-popover` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | filterHeaderCell, openModeMenuItems, scoreColumns, scoreData |
| `features-filtering--mode-menu-next-to-button-popover` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | filterHeaderCell, scoreColumns, scoreData |
| `features-filtering--mode-menu-next-to-button-during-popover-animation` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | filterHeaderCell, scoreColumns, scoreData |
| `features-filtering--type-then-clear-filters-stays-cleared` | object {render, play} (render one-line) | wrapper only + with test | fail | DebounceTable, columnFilterState, debounceRows, sleep |
| `features-filtering--type-then-enter-applies-at-once` | object {name, render, play} (render one-line) | wrapper only + with test | fail | DebounceTable, debounceRows |
| `features-filtering--half-typed-year-applies-nothing` | object {name, render, play} (render one-line) | wrapper only + with test | fail | DebounceTable, columnFilterState, sleep |
| `features-filtering--controlled-rerender-keeps-typed-filter` | object {name, render, play} (render one-line) | wrapper only + with test | fail | RerenderingDebounceTable, columnFilterState, debounceRows, sleep |
| `features-filtering--chip-editor-escape-keeps-typed-text` | object {render, play} (render one-line) | wrapper only + with test | fail | DebounceTable, columnFilterState, openChipEditor, sleep |
| `features-filtering--chip-editor-escape-keeps-typed-date` | object {render, play} (render one-line) | wrapper only + with test | fail | DebounceTable, columnFilterState, openChipEditor |
| `features-filtering--custom-filter-debounce` | object {name, render, play} (render one-line) | wrapper only + with test | fail | DebounceTable, columnFilterState, debounceColumns, debounceRows, ... |
| `features-filtering--filter-variants` | object {render, play} (render one-line) | wrapper only + with test | fail | FilterVariantsTable, addChip, exampleRows, pickInChipEditor |
| `features-filtering--faceted-values` | object {render, play} (render one-line) | wrapper only + with test | fail | FacetedValuesTable, addChip, exampleRows, pickInChipEditor |
| `features-filtering--filter-switching` | object {render, play} (render one-line) | wrapper only + with test | fail | FilterSwitchingTable, addChip |
| `features-filtering--popover-filters` | object {render, play} (render one-line) | wrapper only + with test | fail | PopoverFiltersTable, exampleRows |
| `features-filtering--subheader-filters` | object {render, play} (render one-line) | wrapper only + with test | fail | SubheaderFiltersTable, exampleRows |
| `features-filtering--custom-filter-ui` | object {name, render, play} (render one-line) | wrapper only + with test | fail | CustomFilterUiTable, exampleRows |
| `features-full-screen--full-screen-toggle-enabled-default` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-full-screen--disable-full-screen-toggle` | arrow | table code without its columns or data | fail | columns, data |
| `features-full-screen--default-full-screen-on` | arrow | table code without its columns or data | fail | columns, data |
| `features-full-screen--controlled-full-screen` | arrow | table code without its columns or data | fail | columns, data |
| `features-header-groups--header-groups` | arrow | table code without its columns or data | fail | columns, data |
| `features-header-groups--header-groups-with-sticky-header` | arrow | table code without its columns or data | fail | columns, data |
| `features-header-groups--header-and-footer-groups` | arrow | table code without its columns or data | fail | data |
| `features-header-groups--header-groups-with-column-ordering` | arrow | table code without its columns or data | fail | columns, data |
| `features-header-groups--header-groups-with-column-pinning` | arrow | table code without its columns or data | fail | columns, data |
| `features-header-groups--header-groups-with-colum-resizing` | arrow | table code without its columns or data | fail | columns, data |
| `features-header-groups--header-groups-with-colum-resizing-grid` | arrow | table code without its columns or data | fail | columns, data |
| `features-header-groups--header-groups-with-semantic-colum-resizing` | arrow | table code without its columns or data | fail | columns, data |
| `features-header-groups--mixed-header-groups` | arrow | table code without its columns or data | fail | data |
| `features-header-groups--deep-mixed-header-groups` | arrow | table code without its columns or data | fail | data |
| `features-header-groups--header-groups-with-row-virtualization` | arrow | table code without its columns or data | fail | columns, data |
| `features-header-groups--header-groups-with-column-virtualization` | arrow | table code without its columns or data | fail | columns, data |
| `features-header-groups--group-edges-match-leaves` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, expectGroupEdgesMatchLeaves |
| `features-header-groups--group-edges-match-leaves-no-grow` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, expectGroupEdgesMatchLeaves |
| `features-icons--provider-icon-set` | object {render, play} (render one-line) | wrapper only + with test | fail | IconTable |
| `features-layout-mode--default-grid` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, dataIds, headerWidth |
| `features-layout-mode--semantic` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, dataIds, headerWidth |
| `features-layout-mode--grid` | arrow | table code without its columns or data | fail | columns, data |
| `features-layout-mode--grid-no-grow` | arrow | table code without its columns or data | fail | columns, data |
| `features-loading--loading` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns |
| `features-loading--loading-5` | arrow | table code without its columns or data | fail | columns |
| `features-loading--loading-with-progress-bars` | arrow | table code without its columns or data | fail | columns |
| `features-loading--loading-with-progress-bars-no-overlay` | arrow | table code without its columns or data | fail | columns |
| `features-loading--loading-with-some-data` | arrow | table code without its columns or data | fail | blankData, columns, data |
| `features-loading--loading-with-selection` | arrow | table code without its columns or data | fail | columns |
| `features-loading--loading-with-detail-panel-example` | arrow | table code without its columns or data | fail | columns |
| `features-loading--skeleton-display-columns` | arrow | table code without its columns or data | fail | columns |
| `features-loading--reloading-example` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-loading--only-top-progress-bar` | arrow | table code without its columns or data | fail | columns, data |
| `features-localization--spanish` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-nested-table--nested-detail-panel-table` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | PaginationReader, innerColumns, innerRows, outerColumns, ... |
| `features-pagination--pagination-enabled` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-pagination--pagination-compact-more-data` | arrow + X.play | table code without its columns or data | fail | columns, moreData |
| `features-pagination--pagination-enabled-big-data` | arrow | table code without its columns or data | fail | bigData, columns |
| `features-pagination--pagination-enabled-big-data-language` | arrow | table code without its columns or data | fail | bigData, columns |
| `features-pagination--pagination-enabled-no-rows-per-page` | arrow | table code without its columns or data | fail | columns, data |
| `features-pagination--pagination-enabled-customize-rows-per-page` | arrow | table code without its columns or data | fail | columns, data |
| `features-pagination--pagination-pages-display-mode` | arrow | table code without its columns or data | fail | columns, data |
| `features-pagination--pagination-pages-display-mode-no-pages-per-row` | arrow | table code without its columns or data | fail | columns, data |
| `features-pagination--custom-pagination-pages-display-mode-more-data` | arrow + X.play | table code without its columns or data | fail | columns, moreData |
| `features-pagination--pagination-disabled-or-overriden` | arrow | table code without its columns or data | fail | columns, data |
| `features-pagination--pagination-disabled-manual-pagination-false` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-pagination--pagination-position-bottom` | arrow | table code without its columns or data | fail | columns, data |
| `features-pagination--pagination-position-top` | arrow | table code without its columns or data | fail | columns, data |
| `features-pagination--pagination-position-top-and-bottom` | arrow | table code without its columns or data | fail | columns, data |
| `features-pagination--pagination-position-top-and-bottom-no-internal-actions` | arrow | table code without its columns or data | fail | columns, data |
| `features-pagination--customize-pagination-components` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-pagination--disabled-pagination-components` | arrow | table code without its columns or data | fail | columns, data |
| `features-pagination--pages-footer-row-range` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, footerRangeText, searchData |
| `features-pagination--compact-footer` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, footerRangeText |
| `features-row-actions--row-actions-enabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-actions--row-actions-enabled-conditionally` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-actions--row-actions-enabled-conditionally-per-row` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-actions--row-actions-and-editing-enabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-actions--row-actions-and-editing-cell-enabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-actions--row-actions-first-column` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-actions--custom-row-action-buttons` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-actions--custom-row-action-buttons-first-column` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-actions--two-controls-visible` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-row-actions--row-actions-complete-override` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-dragging--row-dragging-enabled` | arrow | table code without its columns or data | fail | columns, initData |
| `features-row-dragging--row-dragging-enabled-grid` | arrow | table code without its columns or data | fail | columns, initData |
| `features-row-dragging--row-dragging-enabled-grid-no-grow` | arrow | table code without its columns or data | fail | columns, initData |
| `features-row-dragging--drag-between-tables` | object {render, play} (render one-line) | wrapper only + with test | fail | TwoTables, initData, touchDragRow |
| `features-row-dragging--row-dragging` | object {render, play} (render one-line) | wrapper only + with test | fail | RowDraggingTables, listData |
| `features-row-number--enable-row-numbers-static` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-number--numbers-centred` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `features-row-number--enable-row-numbers-conditionally` | arrow | wrapper only | fail | EnableRowNumbersConditionally |
| `features-row-number--enable-row-numbers-static-grid` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-number--enable-row-numbers-static-grid-no-grow` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-number--enable-row-numbers-original` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-number--enable-row-numbers-original-virtual` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-number--enable-row-numbers-static-virtual` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-ordering--row-ordering-enabled` | arrow | table code without its columns or data | fail | columns, initData |
| `features-row-ordering--row-ordering-with-select` | arrow | table code without its columns or data | fail | columns, initData |
| `features-row-ordering--row-ordering-with-pinning` | arrow | table code without its columns or data | fail | columns, initData |
| `features-row-ordering--row-and-column-ordering` | arrow | table code without its columns or data | fail | columns, initData |
| `features-row-ordering--row-ordering-with-row-virtualization` | arrow | table code without its columns or data | fail | columns, initData |
| `features-row-ordering--row-ordering-with-column-virtualization` | arrow | table code without its columns or data | fail | fakeColumns, fakeData |
| `features-row-ordering--drop-slides-rows` | object {render, play} (render one-line) | wrapper only + with test | fail | SlideTable, bodyRows, dragFirstRowTwoDown, highlightsIn, ... |
| `features-row-ordering--drop-no-slide-reduced-motion` | object {render, play} (render one-line) | wrapper only + with test | fail | SlideTable, dragFirstRowTwoDown, highlightsIn, recordAnimations, ... |
| `features-row-ordering--drag-reorders-rows` | object {render, play} (render one-line) | wrapper only + with test | fail | SlideTable, bodyRows, dragFirstRowTwoDown, rowNum, ... |
| `features-row-ordering--row-dnd-ordering` | object {name, render, play} (render one-line) | wrapper only + with test | fail | RowDndOrderingTable, bodyRows, firstNames |
| `features-row-ordering--touch-drag-scrolls-page` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyRows, centreOf, columns, ghost, ... |
| `features-row-pinning--row-pinning-sticky-default-enabled` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-enabled-conditionally` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-sticky-no-pagination` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-sticky-custom-row-height` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-select-sticky-mode` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-select-sticky-with-virtualization` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-top-and-bottom-mode` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-top-mode` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-select-top-mode` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-bottom-mode` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-select-bottom-mode` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-with-sticky-header` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-with-grid-layout` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-sticky-with-virtualization` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-pinning-top-with-virtualization` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--row-and-column-pinning` | arrow | table code without its columns or data | fail | columns, data |
| `features-row-pinning--sticky-row-pinning` | object {render, play} (render one-line) | wrapper only + with test | fail | StickyRowPinningTable, pinData, pinnedEmails, rowWith |
| `features-row-pinning--static-row-pinning` | object {render, play} (render one-line) | wrapper only + with test | fail | StaticRowPinningTable, bodyRows, pinData, pinnedEmails, ... |
| `features-row-pinning--sticky-row-selection` | object {render, play} (render one-line) | wrapper only + with test | fail | StickyRowSelectionTable, pinData, pinnedEmails, rowWith |
| `features-row-pinning-on-select--shift-range-internal-state` | object {args, render, play} (render one-line) | table code without its columns or data | fail | rowPinningDisplayMode, source |
| `features-row-pinning-on-select--shift-range-controlled-state` | object {args, render, play} (render one-line) | table code without its columns or data | fail | rowPinningDisplayMode, source |
| `features-row-pinning-on-select--shift-range-external-atom` | factory pinStory() | table code without its columns or data | fail | rowPinningDisplayMode, source |
| `features-row-pinning-on-select--select-top-internal-state` | factory pinStory() | table code without its columns or data | fail | rowPinningDisplayMode, source |
| `features-row-pinning-on-select--select-top-controlled-state` | factory pinStory() | table code without its columns or data | fail | rowPinningDisplayMode, source |
| `features-row-pinning-on-select--select-top-external-atom` | factory pinStory() | table code without its columns or data | fail | rowPinningDisplayMode, source |
| `features-row-pinning-on-select--select-bottom-internal-state` | factory pinStory() | table code without its columns or data | fail | rowPinningDisplayMode, source |
| `features-row-pinning-on-select--select-bottom-controlled-state` | factory pinStory() | table code without its columns or data | fail | rowPinningDisplayMode, source |
| `features-row-pinning-on-select--select-bottom-external-atom` | factory pinStory() | table code without its columns or data | fail | rowPinningDisplayMode, source |
| `features-row-pinning-on-select--select-all-page-mode` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-row-pinning-on-select--select-all-all-mode` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-row-pinning-on-select--unselect-all-clears-hand-pins` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-row-pinning-on-select--programmatic-toggle-selected` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-search--search-enabled-default` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, escapeClearsThenCloses, toggleClearsAndCloses |
| `features-search--search-initial-state` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--search-initialized-state` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--search-contains` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, typingFiltersRows |
| `features-search--custom-global-filter-fn` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-search--search-global-filter-modes` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--search-global-filter-mode-options` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--search-ranked-results-enabled-by-default` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--search-disable-ranked-results` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--show-search-right-box-by-default` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--show-search-box-left-by-default` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--show-search-box-left-by-default-with-selection` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--just-a-search-box` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--search-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--customize-search-text-box` | arrow | table code without its columns or data | fail | columns, data |
| `features-search--clear-cancels-pending-search` | object {render, play} (render one-line) | wrapper only + with test | fail | SearchWithClearButton, bodyRowTexts, data, searchInput, ... |
| `features-search--searched-on-load` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyRowTexts, columns, rowCountText, searchInput, ... |
| `features-selection--selection-enabled` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-selection--checkboxes-align` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | SELECT_CONTROL, columns, data |
| `features-selection--disable-select-all` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--selection-enabled-grid` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--selection-enabled-grid-no-grow` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--batch-selection-disabled` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--selection-enabled-conditionally` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--selection-enabled-conditionally-with-initial` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--selection-enabled-with-row-click` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--manual-selection` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--select-all-mode-all` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--select-all-mode-all-conditionally` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--select-all-mode-page` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--select-all-disabled-custom-header` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--single-selection-radio` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-selection--single-selection-radio-with-row-click` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-selection--select-checkbox-secondary-color` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--alert-banner-bottom` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--alert-banner-head-overlay` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--custom-alert-banner-head-overlay` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--multi-select-row-with-hold-shift` | arrow | table code without its columns or data | fail | columns, data |
| `features-selection--checkboxes-align-semantic` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | SELECT_CONTROL, columns, data |
| `features-server-data--server-side-pagination` | object {name, render, play} (render one-line) | wrapper only + with test | fail | ReactQueryExample, WithQueryClient, nextPage, rowNames, ... |
| `features-server-data--remote-data-fetching` | object {render, play} (render one-line) | wrapper only + with test | fail | RemoteExample, nextPage, rowNames, showsRows |
| `features-server-data--dynamic-columns` | object {render, play} (render one-line) | wrapper only + with test | fail | DynamicColumnsExample, WithQueryClient, columnNames, nextPage, ... |
| `features-server-data--production-ready-table` | object {name, render, beforeEach, play} (render one-line) | wrapper only + with test | fail | UsersTable, WithQueryClient, answerUsers, firstNames, ... |
| `features-sort-popover--sort-popover-default` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, options, pickerThenEditor |
| `features-sort-popover--sort-popover-seeded` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, options, reorderRemoveDelete |
| `features-sort-popover--sort-popover-single-sort` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, options, singleSortHasNoAdd |
| `features-sort-popover--max-multi-sort-caps-add` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, options, ruleIds |
| `features-sorting--sorting-enabled-default` | arrow | table code without its columns or data | fail | columns, data |
| `features-sorting--disable-sorting` | arrow | table code without its columns or data | fail | columns, data |
| `features-sorting--disable-sorting-for-specific-columns` | arrow | table code without its columns or data | fail | data |
| `features-sorting--disable-multi-sorting` | arrow | table code without its columns or data | fail | columns, data |
| `features-sorting--disable-sorting-removal` | arrow | table code without its columns or data | fail | columns, data |
| `features-sorting--sort-ranking` | arrow | table code without its columns or data | fail | data |
| `features-sorting--sorting-state-managed` | arrow | table code without its columns or data | fail | columns, data |
| `features-sorting--clear-sort-stays-cleared` | object {render, play} (render one-line) | wrapper only + with test | fail | ClearSortTable, bodyNames |
| `features-sorting--sorted-on-load` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyCities, employeeColumns, employees |
| `features-sub-row-tree--sub-row-tree-enabled-default` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, expandAllCollapseAll, expandShowsChildren |
| `features-sub-row-tree--sub-row-tree-layout-grid` | arrow | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--sub-row-tree-layout-grid-no-grow` | arrow | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--sub-row-tree-enabled-position-last` | arrow | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--sub-row-tree-enabled-default-rtl` | arrow | table code without its columns or data | fail | columns, data, localizationHE |
| `features-sub-row-tree--sub-row-tree-enabled-default-rtl-and-position-last` | arrow | table code without its columns or data | fail | columns, data, localizationHE |
| `features-sub-row-tree--sub-row-tree-disable-expand-all` | arrow | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--sub-row-tree-filter-from-leaf-rows` | arrow | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--sub-row-tree-max-leaf-row-filter-depth-0` | arrow | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--sub-row-tree-max-leaf-row-filter-depth-1` | arrow | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--sub-row-tree-max-leaf-row-filter-depth-and-filter-from-leaf-rows` | arrow | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--sub-row-tree-with-selection` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--sub-row-tree-with-selection-no-sub-row-selection` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--sub-row-tree-with-single-selection` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `features-sub-row-tree--expanding-tree` | object {render, play} (render one-line) | wrapper only + with test | fail | ExpandingTreeTable, rowFirstNames, rowOf |
| `features-sub-row-tree--expanding-parsed-tree` | object {render, play} (render one-line) | wrapper only + with test | fail | ExpandingParsedTreeTable, rowFirstNames, rowOf |
| `features-sub-row-tree--lazy-sub-rows` | object {name, render, play} (render one-line) | wrapper only + with test | fail | LazySubRowsApp, rowFirstNames, rowOf |
| `features-table-provider--hand-composition` | object {render, play} (render one-line) | wrapper only + with test | fail | HandComposedTable, bodyText, data, dataCellClass |
| `features-table-provider--controlled-input-in-custom-toolbar` | arrow + X.play | table code without its columns or data | fail | ControlledToolbar, columns, data |
| `features-table-provider--provider-with-two-tables` | arrow + X.play | wrapper only | fail | ProvidedTable, data |
| `features-table-provider--table-swap-without-key` | object {render, play} (render one-line) | wrapper only + with test | fail | SwappedTable |
| `features-table-provider--portals-read-context` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyText, columns, data |
| `features-table-provider--no-provider-throws` | object {render, play} (render one-line) | wrapper only + with test | fail | MessageBoundary |
| `features-table-provider--option-change-after-mount` | object {render, play} (render one-line) | wrapper only + with test | fail | OptionChangeTable, bodyText |
| `features-toolbar--toolbar-enabled-default` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, internalButtonsOrder |
| `features-toolbar--top-toolbar-hidden` | arrow | table code without its columns or data | fail | columns, data |
| `features-toolbar--bottom-toolbar-hidden` | arrow | table code without its columns or data | fail | columns, data |
| `features-toolbar--no-toolbars` | arrow | table code without its columns or data | fail | columns, data |
| `features-toolbar--hide-toolbar-internal-actions` | arrow | table code without its columns or data | fail | columns, data |
| `features-toolbar--custom-toolbar-internal-actions` | arrow | table code without its columns or data | fail | columns, data |
| `features-toolbar--table-title` | arrow | table code without its columns or data | fail | columns, data |
| `features-toolbar--custom-top-toolbar-actions` | arrow | table code without its columns or data | fail | columns, data |
| `features-toolbar--custom-bottom-toolbar-actions` | arrow | table code without its columns or data | fail | columns, data |
| `features-toolbar--custom-top-toolbar-selection-actions` | arrow | table code without its columns or data | fail | columns, data, disabledProps |
| `features-toolbar--custom-bottom-toolbar-selection-actions` | arrow | table code without its columns or data | fail | columns, data, disabledProps |
| `features-toolbar--toolbar-alert-banner-bottom` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bottomToolbarAlertBanner, columns, data, disabledProps |
| `features-toolbar--toolbar-alert-banner-bottom-with-actions-also-bottom` | arrow | table code without its columns or data | fail | columns, data, disabledProps |
| `features-toolbar--render-custom-top-toolbar` | arrow | table code without its columns or data | fail | columns, data |
| `features-toolbar--render-custom-bottom-toolbar` | arrow | table code without its columns or data | fail | columns, data |
| `features-toolbar--internal-buttons-animate-in` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | animatesIn, columns, data, internalButtonsGroup |
| `features-toolbar--custom-actions-render` | object {render, play} (render one-line) | wrapper only + with test | fail | CustomBottomToolbarActions, CustomTopToolbarActions, data |
| `features-toolbar--custom-actions-follow-selection` | object {render, play} (render one-line) | wrapper only + with test | fail | CustomBottomToolbarSelectionActions, CustomTopToolbarSelectionActions, data |
| `features-view-settings--view-settings-default` | object {render, play} (render one-line) | wrapper only + with test | fail | ViewSettingsTable, panelRowsAndRowNumbers, pinUnpinAndSteppers |
| `features-view-settings--view-settings-seeded` | object {render, play} (render one-line) | wrapper only + with test | fail | ViewSettingsTable, resetView, toolbarGroupOrder |
| `features-view-settings--view-settings-persisted` | arrow | table code without its columns or data | fail |  |
| `features-view-settings--persistence` | object {render, beforeEach, play} (render block) | table code without its columns or data | fail |  |
| `features-view-settings--persistence-keeps-page-index` | object {render, beforeEach, play} (render one-line) | wrapper only + with test | fail | Persistence, STORAGE_KEY, ViewSettingsPersisted, manyTasks, ... |
| `features-view-settings--persistence-with-display-columns` | object {render, beforeEach, play} (render one-line) | wrapper only + with test | fail | Persistence, STORAGE_KEY, ViewSettingsPersisted, openPanel |
| `features-view-settings--row-numbers-keep-alignment` | object {render, beforeEach, play} (render one-line) | wrapper only + with test | fail | STORAGE_KEY, ViewSettingsTable, openPanel |
| `features-view-settings--edition-icons-render` | object {render, play} (render one-line) | wrapper only + with test | fail | EDITIONS, VIEW_SETTINGS_ICON_KEYS |
| `features-view-settings--persistent-view` | object {render, beforeEach, play} (render one-line) | wrapper only + with test | fail | PERSISTENT_VIEW_KEY, PersistentViewTable, openPanel, persistentTasks |
| `features-virtualization--enable-row-virtualization-dense` | arrow | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--enable-row-virtualization-comfortable` | arrow + X.play | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--enable-row-virtualization-spacious` | arrow | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--enable-row-virtualization-tall-content` | arrow | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--virtualization-conditionally-wont-toggle` | arrow | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--enable-row-virtualization-with-detail-panel` | arrow | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--enable-row-virtualization-sticky-footer` | arrow | table code without its columns or data | fail | longData |
| `features-virtualization--enable-column-virtualization` | arrow + X.play | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--enable-column-virtualization-with-pinning` | arrow | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--enable-column-virtualization-short-columns` | arrow | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--enable-column-virtualization-with-footer` | arrow | table code without its columns or data | fail | longData |
| `features-virtualization--enable-column-virtualization-sticky-footer` | arrow | table code without its columns or data | fail | longData |
| `features-virtualization--row-and-column-virtualization` | arrow + X.play | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--row-and-column-virtualization-with-features` | arrow | table code without its columns or data | fail | longColumns, longData |
| `features-virtualization--max-virtualization` | arrow + X.play | table code without its columns or data | fail | fakeColumns, fakeData |
| `features-virtualization--empty-data-virtualization` | arrow | table code without its columns or data | fail | fakeColumns |
| `features-virtualization--scroll-renders-further-rows` | object {render, play} (render one-line) | wrapper only + with test | fail | MaxVirtualization, fakeData, indexes, scrollBox |
| `features-virtualization--column-virtualization-scrolls-headers` | object {render, play} (render one-line) | wrapper only + with test | fail | MaxVirtualization, fakeColumns, fakeData, scrollBox |
| `features-virtualization--virtualization` | object {render, play} (render one-line) | wrapper only + with test | fail | VirtualizedTable, rowNumbers, scrollToEnd, scrollToLastRow |
| `features-virtualization--row-virtualization` | object {render, play} (render one-line) | wrapper only + with test | fail | RowVirtualizationTable, rowNumbers, scrollToLastRow |
| `features-virtualization--column-virtualization` | object {render, play} (render one-line) | wrapper only + with test | fail | ColumnVirtualizationTable, exampleColumns500, exampleData500, scrollToEnd |
| `features-virtualization--infinite-scrolling` | object {render, play} (render one-line) | wrapper only + with test | fail | InfiniteScrollingApp, rowNumbers, scrollToEnd |
| `miscellaneous-aria-tooltips--select-filter-and-group-value` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | ST_BASE, body, columns, data, ... |
| `miscellaneous-callback-refs--callback-ref-on-provider-container` | object {render, play} (render one-line) | wrapper only + with test | fail | MountToggle, ProviderTable, assertCallbackRef, providerRecorder |
| `miscellaneous-callback-refs--callback-ref-on-table-container-props` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | MountToggle, assertCallbackRef, columns, data, ... |
| `miscellaneous-callback-refs--ref-object-on-table-container-props` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | MountToggle, columns, containerRef, data, ... |
| `miscellaneous-callback-refs--virtualized-data-set-after-mount` | object {render, play} (render one-line) | wrapper only + with test | fail | VirtualizedTableLoadedAfterMount |
| `miscellaneous-cell-action-menu-edit--cell-action-menu-edit-keeps-focus` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `miscellaneous-filter-editor-focus-ring--chip-editor-ring` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, expectRingNotClipped |
| `miscellaneous-filter-editor-focus-ring--subheader-row-ring` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, expectRingNotClipped |
| `miscellaneous-filter-popover--opens-with-input-focused` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `miscellaneous-filter-popover--opens-with-row-selection` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | employees, sizedColumns |
| `miscellaneous-filter-popover--empty-mode-chip-clear-has-name` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `miscellaneous-filter-popover--funnel-is-clickable` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | employees, sizedColumns |
| `miscellaneous-headless-display-column--headless-display-column-headers` | arrow + X.play | wrapper only | fail | HeadlessHeaders |
| `miscellaneous-headless-display-column--headless-display-column-header-components` | arrow + X.play | wrapper only | fail | HeadlessHeaders |
| `miscellaneous-headless-full-screen--escape-leaves-full-screen` | object {render, play} (render one-line) | wrapper only + with test | fail | HeadlessTable |
| `miscellaneous-headless-full-screen--pointer-click-then-escape` | object {render, play} (render one-line) | wrapper only + with test | fail | HeadlessTable |
| `miscellaneous-headless-full-screen--table-layout-pointer-click-then-escape` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, isFullScreen |
| `miscellaneous-headless-full-screen--escape-in-search-keeps-full-screen` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, isFullScreen |
| `miscellaneous-menu-focus-return--column-action-menu` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | click, columns, data, expectFocusReturn, ... |
| `miscellaneous-menu-focus-return--row-action-menu` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | click, columns, data, expectFocusReturn, ... |
| `miscellaneous-menu-focus-return--cell-action-menu` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, expectFocusReturn, waitForRows |
| `miscellaneous-menu-focus-return--filter-option-menu` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | click, columns, data, expectFocusReturn, ... |
| `miscellaneous-menu-focus-return--show-hide-columns-menu` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | click, columns, data, expectFocusReturn, ... |
| `miscellaneous-menu-openers--column-actions` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | body, columns, data, expectOpener, ... |
| `miscellaneous-menu-openers--row-actions` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, expectOpener, waitForRows |
| `miscellaneous-menu-openers--show-hide-columns` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, expectOpener, waitForRows |
| `miscellaneous-menu-openers--filter-mode` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, expectOpener, waitForRows |
| `miscellaneous-modal-exit--edit-modal-plays-exit` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, isClosing |
| `miscellaneous-multi-select-filter--subheader-string-column` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyNames, columns, data, pick |
| `miscellaneous-multi-select-filter--chips-string-column` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyNames, columns, data, pick |
| `miscellaneous-multi-select-filter--subheader-array-column` | object {render, play} (render block) | wrapper only + with test | fail | SubheaderStringColumn, bodyNames, pick |
| `miscellaneous-multi-select-filter--empty-selection-keeps-every-row` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | bodyNames, columns, data |
| `miscellaneous-pagination-disabled--pagination-disabled-twenty-five-rows` | arrow + X.play | table code without its columns or data | fail | columns, twentyFive |
| `miscellaneous-pagination-disabled--column-filters-with-every-filter-flag-off` | arrow + X.play | table code without its columns or data | fail | columns, people |
| `miscellaneous-panel-collapse--progress-and-banner-collapse` | object {render, play} (render one-line) | wrapper only + with test | fail | PanelsTable, progressBars |
| `miscellaneous-pinned-items-custom-toolbar--custom-top-toolbar` | arrow + X.play | table code without its columns or data | fail | columns, data, options |
| `miscellaneous-pinned-items-custom-toolbar--stock-toolbar` | arrow + X.play | table code without its columns or data | fail | columns, data, options |
| `miscellaneous-rtl--right-to-left` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data |
| `miscellaneous-search-field--position-right` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, openCloseAndEscape, ringAfterPointerOpen, ... |
| `miscellaneous-search-field--position-left` | object {render} (render one-line) | table code without its columns or data | fail | columns, data |
| `miscellaneous-search-field--inline-clear-button` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | columns, data, panelOf |
| `miscellaneous-click-propagation--row-click-and-row-menu-actions` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `miscellaneous-click-propagation--row-click-and-row-button-actions` | arrow | table code without its columns or data | fail | columns, data |
| `miscellaneous-data-types--null-column` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `miscellaneous-dragging-virtual-when-filtered--dragging-row-when-filtered` | arrow + X.play | table code without its columns or data | fail | columns, initData |
| `miscellaneous-app-bar-overlaps-with-full-screen-modal--fullscreen-is-above-appbar` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `miscellaneous-grid-layout--center-align-in-grid-layout-mode` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `miscellaneous-grid-layout--right-align-in-grid-layout-mode` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `miscellaneous-loading-data--nested-loading-data-with-initial-expanded` | arrow | table code complete | pass |  |
| `miscellaneous-loading-data--nested-loading-data-with-initial-filter` | arrow | table code complete | pass |  |
| `miscellaneous-loading-data--nested-loading-data-with-initial-group` | arrow | table code complete | pass |  |
| `miscellaneous-loading-data--nested-loading-data-with-initial-page` | arrow | table code complete | pass |  |
| `miscellaneous-loading-data--nested-loading-data-with-initial-sort` | arrow | table code complete | pass |  |
| `miscellaneous-loading-data--accessor-key-while-loading` | arrow + X.play | table code complete | pass |  |
| `miscellaneous-mobile-date-pickers--mobile-date-time-pickers` | arrow + X.play | table code without its columns or data | fail | data |
| `miscellaneous-sticky-footer--pinned-columns-with-sticky-footer` | arrow + X.play | table code without its columns or data | fail | mockColumns, mockData |
| `miscellaneous-use-effects--filter-modes-refetch` | arrow + X.play | table code without its columns or data | fail | data |
| `miscellaneous-use-effects--filter-options-async` | arrow | table code without its columns or data | fail | data |
| `miscellaneous-use-effects--edit-options-async` | arrow | table code without its columns or data | fail | data |
| `miscellaneous-use-effects--render-row-actions-async` | arrow | table code without its columns or data | fail | data |
| `miscellaneous-use-effects--render-row-action-menu-items-async` | arrow | wrapper only | fail | RenderRowActionMenuItemsAsync |
| `miscellaneous-use-effects--delayed-faceted-values` | arrow | table code without its columns or data | fail | data |
| `miscellaneous-use-effects--prevent-unnecessary-pagination-change-by-out-of-bounds-check` | arrow | table code complete | pass |  |
| `styling-table-alignment--default-left` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-alignment--default-left-grid` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-alignment--right-cells` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-alignment--right-cells-grid` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-alignment--center-cells` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-table-alignment--center-cells-grid` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-alignment--center-cells-with-grab-handle` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-alignment--center-cells-with-grab-handle-no-sorting` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-alignment--center-cells-no-column-actions` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-alignment--right-align-number-column` | arrow | table code without its columns or data | fail | data |
| `styling-caption--bottom-caption` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-caption--top-caption` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-custom-column-widths--custom-widths-semantic` | arrow | table code without its columns or data | fail | data |
| `styling-custom-column-widths--custom-widths-grid` | arrow | table code without its columns or data | fail | data |
| `styling-custom-column-widths--custom-widths-grid-no-grow` | arrow + X.play | table code without its columns or data | fail | data |
| `styling-custom-column-widths--custom-widths-grid-no-grow-individual-grow` | arrow | table code without its columns or data | fail | data |
| `styling-custom-column-widths--custom-widths-grid-individual-shrink` | arrow | table code without its columns or data | fail | data |
| `styling-custom-column-widths--small-widths-semantic` | arrow | table code without its columns or data | fail | data |
| `styling-custom-column-widths--small-widths-grid` | arrow | table code without its columns or data | fail | data |
| `styling-custom-column-widths--small-widths-grid-no-grow` | arrow | table code without its columns or data | fail | data |
| `styling-custom-column-widths--small-widths-grid-no-grow-individual-grow` | arrow | table code without its columns or data | fail | data |
| `styling-custom-table-body--custom-table-body` | arrow | table code without its columns or data | fail | columns, data |
| `styling-custom-table-body--custom-empty-rows-jsx` | arrow + X.play | table code without its columns or data | fail | columns |
| `styling-default-look--default` | arrow | wrapper only | fail | DefaultLookTable |
| `styling-default-look--row-metrics` | arrow + X.play | wrapper only | fail | DefaultLookTable, fewRows, longNoteRows |
| `styling-default-look--scroll-cues` | arrow + X.play | wrapper only | fail | DefaultLookTable, columns, fewRows |
| `styling-default-look--overflow-tooltip` | arrow + X.play | wrapper only | fail | DefaultLookTable, columns, fewRows |
| `styling-default-look--pending-view` | arrow + X.play | wrapper only | fail | DefaultLookTable, fewRows, pendingKey |
| `styling-default-look--sticky-heights` | arrow + X.play | wrapper only | fail | DefaultLookTable |
| `styling-render-counts--root-skips-state-renders` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | countingDisplayColumnDefOptions, firstNames, numbered, numberedColumns, ... |
| `styling-render-counts--hook-selector-skips-state-renders` | object {render, play} (render one-line) | wrapper only + with test | fail | HookSelectorTable, firstNames, hookRenders |
| `styling-render-counts--hook-selector-follows-transform-state` | object {render, play} (render one-line) | wrapper only + with test | fail | HookPaginationSelectorTable, firstNames |
| `styling-render-counts--columns-hold-while-resizing` | object {render, play} (render one-line) | wrapper only + with test | fail | FrozenColumnsTable, expectHeldUntilRelease, firstNames |
| `styling-render-counts--columns-hold-while-dragging` | object {render, play} (render one-line) | wrapper only + with test | fail | FrozenColumnsTable, expectHeldUntilRelease, firstNames |
| `styling-render-counts--data-replacement` | object {render, play} (render one-line) | wrapper only + with test | fail | DataReplacementTable, firstNames |
| `styling-render-counts--controlled-pagination` | object {render, play} (render one-line) | wrapper only + with test | fail | ControlledPaginationTable, firstNames |
| `styling-render-counts--profiled-thousand-rows` | object {args, render, play} (render one-line) | table code without its columns or data | fail | positionToolbarAlertBanner |
| `styling-render-counts--row-model-follows-state` | object {render, play} (render one-line) | table code without its columns or data + with test | fail | rowNames, tree, treeColumns |
| `styling-render-counts--controlled-density-and-selection` | object {render, play} (render one-line) | wrapper only + with test | fail | ControlledDensityAndSelectionTable, bodyText, dataCellClass |
| `styling-render-counts--external-atoms-density-and-selection` | object {render, play} (render one-line) | wrapper only + with test | fail | ExternalAtomsTable, bodyText, dataCellClass |
| `styling-row-height--set-row-height` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-sticky-header--sticky-header-disabled-default` | arrow | table code without its columns or data | fail | columns, data |
| `styling-sticky-header--enable-sticky-header` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-sticky-header--sticky-header-shorter-table` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-sticky-header--disable-sticky-footer` | arrow | table code without its columns or data | fail | columnsWithFooters, data |
| `styling-sticky-header--enable-sticky-footer` | arrow | table code without its columns or data | fail | columnsWithFooters, data |
| `styling-sticky-header--sticky-header` | object {render, play} (render one-line) | wrapper only + with test | fail | StickyHeaderExample, contacts |
| `styling-styling-display-columns--customize-display-columns` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-style-table-body-cells--default-table-body-cell-styles` | arrow | table code without its columns or data | fail | columns, data |
| `styling-style-table-body-cells--style-all-mui-table-body-cell` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-style-table-body-cells--style-mui-table-body-cell-conditionally-in-1-column` | arrow | table code without its columns or data | fail | data |
| `styling-style-table-body-cells--custom-cell-render` | arrow | table code without its columns or data | fail | data |
| `styling-style-table-body-rows--default-table-body-row-styles` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-style-table-body-rows--disable-row-hover-effect` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-style-table-body-rows--style-mui-table-body-row` | arrow | table code without its columns or data | fail | columns, data |
| `styling-style-table-body-rows--style-custom-striped-rows` | arrow | table code without its columns or data | fail | columns, data |
| `styling-style-table-body-rows--style-custom-striped-rows-detail-panel` | arrow | table code without its columns or data | fail | columns, data |
| `styling-style-table-body-rows--conditionally-style-mui-table-row` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-dimensions--max-width-and-centered` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-table-dimensions--max-height` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-dimensions--min-height` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-dimensions--min-height-parent` | arrow | table code without its columns or data | fail | columns, data |
| `styling-table-dimensions--container-height` | arrow | table code without its columns or data | fail | columns, data |
| `styling-style-table-head-cells--default-table-head-cell-styles` | arrow | table code without its columns or data | fail | columns, data |
| `styling-style-table-head-cells--color-sort-icon` | arrow | table code without its columns or data | fail | columns, data |
| `styling-style-table-head-cells--style-all-mui-table-head-cell` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-style-table-head-cells--style-table-head-cells-individually` | arrow | table code without its columns or data | fail | data |
| `styling-style-table-head-cells--custom-head-cell-renders` | arrow | table code without its columns or data | fail | data |
| `styling-table-paper--no-box-shadow` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-theming--default-theme` | arrow | table code without its columns or data | fail | columns, data |
| `styling-theming--custom-light-theme` | arrow + X.play | table code without its columns or data | fail | columns, data |
| `styling-theming--custom-dark-theme` | arrow | table code without its columns or data | fail | columns, data |

## Rerun 2026-11-19 (Docs code panels milestone)

Read with `read-panels.mjs` (this folder, unchanged) in pool worktree 08 on branch `v0.9/docs-code-panels` at 2543c800: the static Storybook of base built at 2543c800 (`pnpm --filter shadcn-table storybook:build:base`, served by `python3 -m http.server`), and the production docs build of 96b4acda (`next start`; the docs app and the story files are the same at 2543c800, the later commits touch only `test/docs-e2e/lib/examples.mjs` and `CHANGELOG.md`). Servers stopped after each read.

### Storybook Code tab, base

- Ids in `storybook-static/base/index.json`: 626 (645 at the first read, minus the 19 same-table copies merged by the Storybook Code tab milestone). Read: 626, in 1081 s.
- Pass 624, fail 0 of the table stories; 2 rows read "other": table code complete 624, other 2.
- The 623 rows that failed at the first read: 602 pass, 19 are gone (the merged copies), 2 read "other": `features-table-provider--no-provider-throws` (renders `ST_TablePagination` without its provider to show the error) and `features-view-settings--edition-icons-render` (an icon grid). Neither story renders a table; their panels show the story's whole code with its imports and no test, and the reader has no table to find, so it files them under "other". The 22 rows that passed still pass.

### Docs code panels

Pages read: 673 (every `.mdx` of `content/docs/examples`, `examples/more` and `guides`; 692 at the first read minus the 19 merged story pages), all HTTP 200, in 881 s (three runs of about 225 pages).

| Panel kind | Pages read | Panels | Fail | What the panel shows |
|---|---|---|---|---|
| Example pages (`/docs/examples/<slug>`) | 42 | 42 | 0 | table code complete 42 |
| Story pages (`/docs/examples/more/`) | 584 | 584 | 0 (2 other) | table code complete 582; other 2 (the two stories above, `/NoProviderThrows.tsx`, `/EditionIconsRender.tsx`) |
| Guide Example section: example page item | 30 | 35 | 0 | table code complete 35 |
| Guides' own tables (inline example panels) | 31 | 61 | 0 | table code complete 61 |
| Guide Example section: story item without `codeFrom` | 15 | 15 | 0 | table code complete 15 |
| Guide Example section: story item with `codeFrom` | 1 | 1 | 0 | table code complete 1 (the five files of `server-side-data`) |

- Every story page and every guide story item without `codeFrom` shows one file, `<StoryExport>.tsx`: the story's own code text on the selected base, the same text as the Storybook Code tab; no `meta`, no play, no `storybook/test`.
- The rows that failed at the first read: 603 story pages (584 pass or read "other" as above, 19 gone with the merged copies) and 15 guide story items (15 pass).
