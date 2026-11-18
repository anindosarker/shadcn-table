# Examples sidebar, docs and Storybook one to one: draft for discussion

Draft of 2026-11-16. Nothing here is decided. It is a discussion aid for the open point of L19 (where the stories sit in the sidebar).

- Model shown: one example is one docs page and one Storybook story with the same name. One sidebar group is one Storybook group, same name and order. Storybook holds the single list; the docs sidebar is generated from it. Test-only stories are hidden from both sidebars and still run. There is no "Fixed bugs" group.
- Sources: `packages/shadcn-table/stories` (story files, titles, exports, `play`), `apps/shadcn-table-docs/content/docs/examples/meta.json` and the page files, `examples/map.tsx`, `lib/storybook-map.ts`, all on wt1 `69bafe30`. The preview pages ending in `-new-format` and `-new-format-2` are left out.
- The tables were not compared. "Both" means the docs example has a story with a clearly matching name. Whether the story renders the same table (options and columns) is not checked yet.
- Example names for story-only rows are the story export names with spaces. They are placeholders.
- No story or story file has a `tags` entry today.

## Counts

| | count |
|---|---|
| Story files | 81 |
| Stories | 652 |
| Stories with a play function | 269 |
| Docs examples | 42 |
| Docs examples linked to a story today (storybook-map) | 33, to 14 different stories |
| Rows in the proposed sidebar | 400 |
| In the docs only today (need a new story) | 22 |
| In Storybook only today (need a new docs page) | 358 |
| In both today (by name) | 20 |
| Stories proposed as test-only | 274 |

## Proposed groups

12 groups replace the 9 docs groups and the 3 Storybook folders with 81 story files.

1. **Showcase** (5 rows). What the library does best; a newcomer sees these first. Fed by: Picked from the docs groups top, Editing, Expanding / Grouping, Remote Data Fetching and Virtualized.
2. **Getting started** (3 rows). The plain starter tables. Fed by: Docs top group; story files Basic, Table Provider.
3. **Sorting, search and pagination** (41 rows). Sorting, the sort popover, global search, paging. Fed by: No docs group today; story files Sorting, Sort Popover, Search, Pagination.
4. **Filtering** (33 rows). Column filters: variants, modes, chips, popover, dates, custom functions. Fed by: Docs Filtering; story files Filtering, Filter Chips, Custom Filter Fns, Date Filters.
5. **Columns** (61 rows). Hide, resize, reorder, drag, pin columns; column menus; header groups. Fed by: Docs Dragging / Ordering and Sticky Pinning (column pages); story files Column Hiding, Column Resizing, Column Ordering, Column Dragging, Column Pinning, Column Actions, Header Groups.
6. **Rows and selection** (74 rows). Select, number, reorder, drag, pin rows; row and cell actions; click to copy. Fed by: Docs Dragging / Ordering and Sticky Pinning (row pages); story files Selection, Row Numbers, Row Actions, Cell Actions, Click To Copy, Row Ordering, Row Dragging, Row Pinning, Row Pinning On Select.
7. **Editing** (24 rows). Edit and create rows: modal, row, cell, table, tree. Fed by: Docs Editing (CRUD); story files Editing, Creating.
8. **Grouping, trees and detail panels** (50 rows). Group by column, aggregate, expand sub rows, open a detail panel. Fed by: Docs Expanding / Grouping; story files Column Grouping, Aggregation, Sub Row Tree, Detail Panel, Nested Table.
9. **Remote data and loading** (19 rows). Server-side data, lazy loading, loading states. Fed by: Docs Remote Data Fetching; story file Loading; five kept stories from Fixed Bugs/useEffects.
10. **Virtualization** (15 rows). Large tables: row and column virtualization, infinite scroll. Fed by: Docs Virtualized; story file Virtualization.
11. **Toolbar, view and export** (28 rows). Toolbars, view settings, density, full screen, icons, saved view, CSV and PDF export. Fed by: Docs top group (Persistent View) and Data Export; story files Toolbar, View Settings, Dense Padding, Full Screen, Icons.
12. **Styling and layout** (47 rows). Look of the table: layout mode, sticky header, alignment, widths, heights, cell and row styles, theming. Fed by: Docs Sticky Pinning (Sticky Header); story file Layout Mode and the 14 files of the Styling folder; RTL from Fixed Bugs.

First in the list: **Advanced** (`advanced`). With L13, `/docs/examples` opens it.

## 1. Showcase

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Advanced | Docs | `advanced` |  | new story from the docs example |
| Editing CRUD | Both | `editing-crud` | features/Editing / EditingEnabledEditModeModalDefault | rename the story |
| Aggregation and Grouping | Both | `aggregation-and-grouping` | features/Aggregation / Aggregation | rename the story |
| React Query | Docs | `react-query` |  | new story from the docs example |
| Virtualized | Docs | `virtualized` |  | new story from the docs example |

Note: an example appears once. These five left their feature groups: Advanced left the starter group, Editing CRUD left Editing, Aggregation and Grouping left Grouping, trees and detail panels, React Query left Remote data and loading, Virtualized left Virtualization.

## 2. Getting started

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Basic | Both | `basic` | Basic / Default | rename the story |
| Minimal | Docs | `minimal` |  | new story from the docs example |
| Custom Headless | Docs | `custom-headless` |  | new story from the docs example |

## 3. Sorting, search and pagination

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Pagination Enabled | Storybook |  | features/Pagination / PaginationEnabled | new docs page from the story |
| Pagination Enabled Big Data | Storybook |  | features/Pagination / PaginationEnabledBigData | new docs page from the story |
| Pagination Enabled Big Data Language | Storybook |  | features/Pagination / PaginationEnabledBigDataLanguage | new docs page from the story |
| Pagination Enabled No Rows Per Page | Storybook |  | features/Pagination / PaginationEnabledNoRowsPerPage | new docs page from the story |
| Pagination Enabled Customize Rows Per Page | Storybook |  | features/Pagination / PaginationEnabledCustomizeRowsPerPage | new docs page from the story |
| Pagination Pages Display Mode | Storybook |  | features/Pagination / PaginationPagesDisplayMode | new docs page from the story |
| Pagination Pages Display Mode No Pages Per Row | Storybook |  | features/Pagination / PaginationPagesDisplayModeNoPagesPerRow | new docs page from the story |
| Custom Pagination Pages Display Mode | Storybook |  | features/Pagination / CustomPaginationPagesDisplayMode | new docs page from the story |
| Custom Pagination Pages Display Mode More Data | Storybook |  | features/Pagination / CustomPaginationPagesDisplayModeMoreData | new docs page from the story |
| Pagination Disabled Or Overriden | Storybook |  | features/Pagination / PaginationDisabledOrOverriden | new docs page from the story |
| Pagination Position Bottom | Storybook |  | features/Pagination / PaginationPositionBottom | new docs page from the story |
| Pagination Position Top | Storybook |  | features/Pagination / PaginationPositionTop | new docs page from the story |
| Pagination Position Top And Bottom | Storybook |  | features/Pagination / PaginationPositionTopAndBottom | new docs page from the story |
| Pagination Position Top And Bottom No Internal Actions | Storybook |  | features/Pagination / PaginationPositionTopAndBottomNoInternalActions | new docs page from the story |
| Customize Pagination Components | Storybook |  | features/Pagination / CustomizePaginationComponents | new docs page from the story |
| Disabled Pagination Components | Storybook |  | features/Pagination / DisabledPaginationComponents | new docs page from the story |
| Search Enabled Default | Storybook |  | features/Search / SearchEnabledDefault | new docs page from the story |
| Search Initial State | Storybook |  | features/Search / SearchInitialState | new docs page from the story |
| Search Initialized State | Storybook |  | features/Search / SearchInitializedState | new docs page from the story |
| Search Contains | Storybook |  | features/Search / SearchContains | new docs page from the story |
| Custom Global Filter Fn | Storybook |  | features/Search / CustomGlobalFilterFn | new docs page from the story |
| Search Global Filter Modes | Storybook |  | features/Search / SearchGlobalFilterModes | new docs page from the story |
| Search Global Filter Mode Options | Storybook |  | features/Search / SearchGlobalFilterModeOptions | new docs page from the story |
| Search Ranked Results Enabled By Default | Storybook |  | features/Search / SearchRankedResultsEnabledByDefault | new docs page from the story |
| Search Disable Ranked Results | Storybook |  | features/Search / SearchDisableRankedResults | new docs page from the story |
| Show Search Right Box By Default | Storybook |  | features/Search / ShowSearchRightBoxByDefault | new docs page from the story |
| Show Search Box Left By Default | Storybook |  | features/Search / ShowSearchBoxLeftByDefault | new docs page from the story |
| Show Search Box Left By Default With Selection | Storybook |  | features/Search / ShowSearchBoxLeftByDefaultWithSelection | new docs page from the story |
| Just A Search Box | Storybook |  | features/Search / JustASearchBox | new docs page from the story |
| Search Disabled | Storybook |  | features/Search / SearchDisabled | new docs page from the story |
| Customize Search Text Box | Storybook |  | features/Search / CustomizeSearchTextBox | new docs page from the story |
| Sort Popover Default | Storybook |  | features/SortPopover / SortPopoverDefault | new docs page from the story |
| Sort Popover Seeded | Storybook |  | features/SortPopover / SortPopoverSeeded | new docs page from the story |
| Sort Popover Single Sort | Storybook |  | features/SortPopover / SortPopoverSingleSort | new docs page from the story |
| Sorting Enabled Default | Storybook |  | features/Sorting / SortingEnabledDefault | new docs page from the story |
| Disable Sorting | Storybook |  | features/Sorting / DisableSorting | new docs page from the story |
| Disable Sorting For Specific Columns | Storybook |  | features/Sorting / DisableSortingForSpecificColumns | new docs page from the story |
| Disable Multi Sorting | Storybook |  | features/Sorting / DisableMultiSorting | new docs page from the story |
| Disable Sorting Removal | Storybook |  | features/Sorting / DisableSortingRemoval | new docs page from the story |
| Sort Ranking | Storybook |  | features/Sorting / SortRanking | new docs page from the story |
| Sorting State Managed | Storybook |  | features/Sorting / SortingStateManaged | new docs page from the story |

## 4. Filtering

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Filter Variants | Docs | `filter-variants` |  | new story from the docs example |
| Faceted Values | Docs | `faceted-values` |  | new story from the docs example |
| Filter Switching | Docs | `filter-switching` |  | new story from the docs example |
| Popover Filters | Both | `popover-filters` | features/Filtering / PopoverDisplayMode | rename the story |
| Subheader Filters | Docs | `subheader-filters` |  | new story from the docs example |
| Custom Filter UI | Docs | `custom-filter-ui` |  | new story from the docs example |
| Chips Default | Storybook |  | features/FilterChips / ChipsDefault | new docs page from the story |
| Chips Seeded | Storybook |  | features/FilterChips / ChipsSeeded | new docs page from the story |
| Chips Hidden Column | Storybook |  | features/FilterChips / ChipsHiddenColumn | new docs page from the story |
| Chips Header Editor | Storybook |  | features/FilterChips / ChipsHeaderEditor | new docs page from the story |
| Chips Custom Toolbar | Storybook |  | features/FilterChips / ChipsCustomToolbar | new docs page from the story |
| Range Editor Inputs Fit And Fill Time | Storybook |  | features/FilterChips / RangeEditorInputsFitAndFillTime | new docs page from the story |
| Range Editor Inputs Fit And Fill Date | Storybook |  | features/FilterChips / RangeEditorInputsFitAndFillDate | new docs page from the story |
| Range Editor Inputs Fit And Fill Date Time | Storybook |  | features/FilterChips / RangeEditorInputsFitAndFillDateTime | new docs page from the story |
| Range Editor Inputs Fit And Fill Number | Storybook |  | features/FilterChips / RangeEditorInputsFitAndFillNumber | new docs page from the story |
| Filtering Enabled Default | Storybook |  | features/Filtering / FilteringEnabledDefault | new docs page from the story |
| Popover Display Mode No Sorting | Storybook |  | features/Filtering / PopoverDisplayModeNoSorting | new docs page from the story |
| Column Filtering Disabled | Storybook |  | features/Filtering / ColumnFilteringDisabled | new docs page from the story |
| Filtering Disabled | Storybook |  | features/Filtering / FilteringDisabled | new docs page from the story |
| Filter Highlighting Disabled | Storybook |  | features/Filtering / FilterHighlightingDisabled | new docs page from the story |
| Filter Fn And Filter Variants | Storybook |  | features/Filtering / FilterFnAndFilterVariants | new docs page from the story |
| Filter Fn And Filter Variants Faceted | Storybook |  | features/Filtering / FilterFnAndFilterVariantsFaceted | new docs page from the story |
| Filtering Change Mode Enabled | Storybook |  | features/Filtering / FilteringChangeModeEnabled | new docs page from the story |
| Filtering Change Mode Enabled Hidden | Storybook |  | features/Filtering / FilteringChangeModeEnabledHidden | new docs page from the story |
| Disable Some Filter Types For Certain Columns | Storybook |  | features/Filtering / DisableSomeFilterTypesForCertainColumns | new docs page from the story |
| Filtering Disabled For Certain Columns | Storybook |  | features/Filtering / FilteringDisabledForCertainColumns | new docs page from the story |
| Custom Filter Function Per Column | Storybook |  | features/Filtering / CustomFilterFunctionPerColumn | new docs page from the story |
| Custom Filter Fns | Storybook |  | features/Filtering / CustomFilterFns | new docs page from the story |
| Custom Filter Component | Storybook |  | features/Filtering / CustomFilterComponent | new docs page from the story |
| Customize Filter Text Fields | Storybook |  | features/Filtering / CustomizeFilterTextFields | new docs page from the story |
| Manual Filtering | Storybook |  | features/Filtering / ManualFiltering | new docs page from the story |
| External Set Filter Value | Storybook |  | features/Filtering / ExternalSetFilterValue | new docs page from the story |
| Initial Filters | Storybook |  | features/Filtering / InitialFilters | new docs page from the story |

## 5. Columns

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Column DnD Ordering | Both | `column-ordering` | features/ColumnOrdering / ColumnOrderingEnabled | rename the story |
| Column Pinning | Both | `column-pinning` | features/ColumnPinning / ColumnPinningEnabled | rename the story |
| Column Actions Enabled Default | Storybook |  | features/ColumnActions / ColumnActionsEnabledDefault | new docs page from the story |
| Column Actions Disabled | Storybook |  | features/ColumnActions / ColumnActionsDisabled | new docs page from the story |
| Column Actions Disabled Per Column | Storybook |  | features/ColumnActions / ColumnActionsDisabledPerColumn | new docs page from the story |
| Column Actions Enabled Per Column | Storybook |  | features/ColumnActions / ColumnActionsEnabledPerColumn | new docs page from the story |
| Custom Column Actions | Storybook |  | features/ColumnActions / CustomColumnActions | new docs page from the story |
| Custom Column Actions Per Column | Storybook |  | features/ColumnActions / CustomColumnActionsPerColumn | new docs page from the story |
| Column Dragging Disabled Per Column | Storybook |  | features/ColumnDragging / ColumnDraggingDisabledPerColumn | new docs page from the story |
| Column Hiding Enabled Default | Storybook |  | features/ColumnHiding / ColumnHidingEnabledDefault | new docs page from the story |
| Column Hiding Disabled | Storybook |  | features/ColumnHiding / ColumnHidingDisabled | new docs page from the story |
| Column Hiding Disabled But With Ordering | Storybook |  | features/ColumnHiding / ColumnHidingDisabledButWithOrdering | new docs page from the story |
| Column Hiding Disabled But With Pinning | Storybook |  | features/ColumnHiding / ColumnHidingDisabledButWithPinning | new docs page from the story |
| Column Hiding Disabled Per Column | Storybook |  | features/ColumnHiding / ColumnHidingDisabledPerColumn | new docs page from the story |
| Column Hiding With Header Groups | Storybook |  | features/ColumnHiding / ColumnHidingWithHeaderGroups | new docs page from the story |
| Column Hiding Columns Not Visible In Show Hide | Storybook |  | features/ColumnHiding / ColumnHidingColumnsNotVisibleInShowHide | new docs page from the story |
| Column Hiding With Columns Hidden And Not Visible In Show Hide | Storybook |  | features/ColumnHiding / ColumnHidingWithColumnsHiddenAndNotVisibleInShowHide | new docs page from the story |
| Column Ordering Disabled | Storybook |  | features/ColumnOrdering / ColumnOrderingDisabled | new docs page from the story |
| Display Column Ordering Enabled | Storybook |  | features/ColumnOrdering / DisplayColumnOrderingEnabled | new docs page from the story |
| Column Ordering Disabled Per Column | Storybook |  | features/ColumnOrdering / ColumnOrderingDisabledPerColumn | new docs page from the story |
| Column Ordering With Select | Storybook |  | features/ColumnOrdering / ColumnOrderingWithSelect | new docs page from the story |
| Column Ordering With Pinning | Storybook |  | features/ColumnOrdering / ColumnOrderingWithPinning | new docs page from the story |
| Column Ordering No Drag Handles | Storybook |  | features/ColumnOrdering / ColumnOrderingNoDragHandles | new docs page from the story |
| Column Ordering State Managed | Storybook |  | features/ColumnOrdering / ColumnOrderingStateManaged | new docs page from the story |
| Column Ordering State Managed Custom | Storybook |  | features/ColumnOrdering / ColumnOrderingStateManagedCustom | new docs page from the story |
| Column Ordering Enabled With Column Virtualization | Storybook |  | features/ColumnOrdering / ColumnOrderingEnabledWithColumnVirtualization | new docs page from the story |
| Column Pinning Disabled | Storybook |  | features/ColumnPinning / ColumnPinningDisabled | new docs page from the story |
| Column Pinning Initial | Storybook |  | features/ColumnPinning / ColumnPinningInitial | new docs page from the story |
| Column Pinning Disabled Per Column | Storybook |  | features/ColumnPinning / ColumnPinningDisabledPerColumn | new docs page from the story |
| Column Pinning With Select | Storybook |  | features/ColumnPinning / ColumnPinningWithSelect | new docs page from the story |
| Column Pinning With Detail Panel | Storybook |  | features/ColumnPinning / ColumnPinningWithDetailPanel | new docs page from the story |
| Column Resizing Enabled Default On Change | Storybook |  | features/ColumnResizing / ColumnResizingEnabledDefaultOnChange | new docs page from the story |
| Column Resizing Disabled | Storybook |  | features/ColumnResizing / ColumnResizingDisabled | new docs page from the story |
| Column Resizing Enabled Default On Change RTL | Storybook |  | features/ColumnResizing / ColumnResizingEnabledDefaultOnChangeRTL | new docs page from the story |
| Column Resizing Enabled Default On Change Grid | Storybook |  | features/ColumnResizing / ColumnResizingEnabledDefaultOnChangeGrid | new docs page from the story |
| Column Resizing Default On Change Grid With Individual Shrink | Storybook |  | features/ColumnResizing / ColumnResizingDefaultOnChangeGridWithIndividualShrink | new docs page from the story |
| Column Resizing Enabled Default On Change Grid RTL | Storybook |  | features/ColumnResizing / ColumnResizingEnabledDefaultOnChangeGridRTL | new docs page from the story |
| Column Resizing Enabled Default On Change Semantic | Storybook |  | features/ColumnResizing / ColumnResizingEnabledDefaultOnChangeSemantic | new docs page from the story |
| Column Resizing Enabled Default On Change Semantic RTL | Storybook |  | features/ColumnResizing / ColumnResizingEnabledDefaultOnChangeSemanticRTL | new docs page from the story |
| Column Resizing Enabled No Column Actions | Storybook |  | features/ColumnResizing / ColumnResizingEnabledNoColumnActions | new docs page from the story |
| Column Resizing Disabled Some Columns | Storybook |  | features/ColumnResizing / ColumnResizingDisabledSomeColumns | new docs page from the story |
| Column Resizing Enabled On End | Storybook |  | features/ColumnResizing / ColumnResizingEnabledOnEnd | new docs page from the story |
| Column Resizing Enabled On End RTL | Storybook |  | features/ColumnResizing / ColumnResizingEnabledOnEndRTL | new docs page from the story |
| Column Resizing Custom Default Widths | Storybook |  | features/ColumnResizing / ColumnResizingCustomDefaultWidths | new docs page from the story |
| Column Resizing With Pinning | Storybook |  | features/ColumnResizing / ColumnResizingWithPinning | new docs page from the story |
| Column Resizing With Header Groups | Storybook |  | features/ColumnResizing / ColumnResizingWithHeaderGroups | new docs page from the story |
| Column Resizing With Header Groups Grid Grow | Storybook |  | features/ColumnResizing / ColumnResizingWithHeaderGroupsGridGrow | new docs page from the story |
| Column Resizing Layout Grid Grow | Storybook |  | features/ColumnResizing / ColumnResizingLayoutGridGrow | new docs page from the story |
| Column Resizing Layout Grid Grow RTL | Storybook |  | features/ColumnResizing / ColumnResizingLayoutGridGrowRTL | new docs page from the story |
| Header Groups | Storybook |  | features/HeaderGroups / HeaderGroups | new docs page from the story |
| Header Groups With Sticky Header | Storybook |  | features/HeaderGroups / HeaderGroupsWithStickyHeader | new docs page from the story |
| Header And Footer Groups | Storybook |  | features/HeaderGroups / HeaderAndFooterGroups | new docs page from the story |
| Header Groups With Column Ordering | Storybook |  | features/HeaderGroups / HeaderGroupsWithColumnOrdering | new docs page from the story |
| Header Groups With Column Pinning | Storybook |  | features/HeaderGroups / HeaderGroupsWithColumnPinning | new docs page from the story |
| Header Groups With Colum Resizing | Storybook |  | features/HeaderGroups / HeaderGroupsWithColumResizing | new docs page from the story |
| Header Groups With Colum Resizing Grid | Storybook |  | features/HeaderGroups / HeaderGroupsWithColumResizingGrid | new docs page from the story |
| Header Groups With Semantic Colum Resizing | Storybook |  | features/HeaderGroups / HeaderGroupsWithSemanticColumResizing | new docs page from the story |
| Mixed Header Groups | Storybook |  | features/HeaderGroups / MixedHeaderGroups | new docs page from the story |
| Deep Mixed Header Groups | Storybook |  | features/HeaderGroups / DeepMixedHeaderGroups | new docs page from the story |
| Header Groups With Row Virtualization | Storybook |  | features/HeaderGroups / HeaderGroupsWithRowVirtualization | new docs page from the story |
| Header Groups With Column Virtualization | Storybook |  | features/HeaderGroups / HeaderGroupsWithColumnVirtualization | new docs page from the story |

## 6. Rows and selection

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Row DnD Ordering | Both | `row-ordering` | features/RowOrdering / RowOrderingEnabled | rename the story |
| Row Dragging | Both | `row-dragging` | features/RowDragging / RowDraggingEnabled | rename the story |
| Sticky Row Pinning | Both | `sticky-row-pinning` | features/RowPinning / RowPinningStickyDefaultEnabled | rename the story |
| Static Row Pinning | Docs | `static-row-pinning` |  | new story from the docs example |
| Sticky Row Selection | Both | `sticky-row-selection` | features/RowPinning / RowPinningSelectStickyMode | rename the story |
| Cell Actions Enabled | Storybook |  | features/CellActions / CellActionsEnabled | new docs page from the story |
| Cell Actions Enabled Conditionally | Storybook |  | features/CellActions / CellActionsEnabledConditionally | new docs page from the story |
| Cell Actions With Click To Copy | Storybook |  | features/CellActions / CellActionsWithClickToCopy | new docs page from the story |
| Cell Actions With Built Ins | Storybook |  | features/CellActions / CellActionsWithBuiltIns | new docs page from the story |
| Click To Copy Enabled | Storybook |  | features/ClickToCopy / ClickToCopyEnabled | new docs page from the story |
| Click To Copy Enabled With Column Resizing | Storybook |  | features/ClickToCopy / ClickToCopyEnabledWithColumnResizing | new docs page from the story |
| Click To Copy Enabled Per Column | Storybook |  | features/ClickToCopy / ClickToCopyEnabledPerColumn | new docs page from the story |
| Click To Copy Disabled Per Column | Storybook |  | features/ClickToCopy / ClickToCopyDisabledPerColumn | new docs page from the story |
| Row Actions Enabled | Storybook |  | features/RowActions / RowActionsEnabled | new docs page from the story |
| Row Actions Enabled Conditionally | Storybook |  | features/RowActions / RowActionsEnabledConditionally | new docs page from the story |
| Row Actions Enabled Conditionally Per Row | Storybook |  | features/RowActions / RowActionsEnabledConditionallyPerRow | new docs page from the story |
| Row Actions And Editing Enabled | Storybook |  | features/RowActions / RowActionsAndEditingEnabled | new docs page from the story |
| Row Actions And Editing Cell Enabled | Storybook |  | features/RowActions / RowActionsAndEditingCellEnabled | new docs page from the story |
| Row Actions First Column | Storybook |  | features/RowActions / RowActionsFirstColumn | new docs page from the story |
| Custom Row Action Buttons | Storybook |  | features/RowActions / CustomRowActionButtons | new docs page from the story |
| Custom Row Action Buttons First Column | Storybook |  | features/RowActions / CustomRowActionButtonsFirstColumn | new docs page from the story |
| Row Actions Complete Override | Storybook |  | features/RowActions / RowActionsCompleteOverride | new docs page from the story |
| Row Dragging Enabled Grid | Storybook |  | features/RowDragging / RowDraggingEnabledGrid | new docs page from the story |
| Row Dragging Enabled Grid No Grow | Storybook |  | features/RowDragging / RowDraggingEnabledGridNoGrow | new docs page from the story |
| Enable Row Numbers Static | Storybook |  | features/RowNumbers / enableRowNumbersStatic | new docs page from the story |
| Enable Row Numbers Conditionally | Storybook |  | features/RowNumbers / enableRowNumbersConditionally | new docs page from the story |
| Enable Row Numbers Static Grid | Storybook |  | features/RowNumbers / enableRowNumbersStaticGrid | new docs page from the story |
| Enable Row Numbers Static Grid No Grow | Storybook |  | features/RowNumbers / enableRowNumbersStaticGridNoGrow | new docs page from the story |
| Enable Row Numbers Original | Storybook |  | features/RowNumbers / enableRowNumbersOriginal | new docs page from the story |
| Enable Row Numbers Original Virtual | Storybook |  | features/RowNumbers / enableRowNumbersOriginalVirtual | new docs page from the story |
| Enable Row Numbers Static Virtual | Storybook |  | features/RowNumbers / enableRowNumbersStaticVirtual | new docs page from the story |
| Row Ordering With Select | Storybook |  | features/RowOrdering / RowOrderingWithSelect | new docs page from the story |
| Row Ordering With Pinning | Storybook |  | features/RowOrdering / RowOrderingWithPinning | new docs page from the story |
| Row And Column Ordering | Storybook |  | features/RowOrdering / RowAndColumnOrdering | new docs page from the story |
| Row Ordering With Row Virtualization | Storybook |  | features/RowOrdering / RowOrderingWithRowVirtualization | new docs page from the story |
| Row Ordering With Column Virtualization | Storybook |  | features/RowOrdering / RowOrderingWithColumnVirtualization | new docs page from the story |
| Row Pinning Enabled Conditionally | Storybook |  | features/RowPinning / RowPinningEnabledConditionally | new docs page from the story |
| Row Pinning Sticky No Pagination | Storybook |  | features/RowPinning / RowPinningStickyNoPagination | new docs page from the story |
| Row Pinning Sticky Custom Row Height | Storybook |  | features/RowPinning / RowPinningStickyCustomRowHeight | new docs page from the story |
| Row Pinning Top And Bottom Mode | Storybook |  | features/RowPinning / RowPinningTopAndBottomMode | new docs page from the story |
| Row Pinning Top Mode | Storybook |  | features/RowPinning / RowPinningTopMode | new docs page from the story |
| Row Pinning Select Top Mode | Storybook |  | features/RowPinning / RowPinningSelectTopMode | new docs page from the story |
| Row Pinning Bottom Mode | Storybook |  | features/RowPinning / RowPinningBottomMode | new docs page from the story |
| Row Pinning Select Bottom Mode | Storybook |  | features/RowPinning / RowPinningSelectBottomMode | new docs page from the story |
| Row Pinning With Sticky Header | Storybook |  | features/RowPinning / RowPinningWithStickyHeader | new docs page from the story |
| Row Pinning With Grid Layout | Storybook |  | features/RowPinning / RowPinningWithGridLayout | new docs page from the story |
| Row Pinning Sticky With Virtualization | Storybook |  | features/RowPinning / RowPinningStickyWithVirtualization | new docs page from the story |
| Row Pinning Top With Virtualization | Storybook |  | features/RowPinning / RowPinningTopWithVirtualization | new docs page from the story |
| Row And Column Pinning | Storybook |  | features/RowPinning / RowAndColumnPinning | new docs page from the story |
| Shift Range External Atom | Storybook |  | features/RowPinningOnSelect / ShiftRangeExternalAtom | new docs page from the story |
| Select Top Internal State | Storybook |  | features/RowPinningOnSelect / SelectTopInternalState | new docs page from the story |
| Select Top Controlled State | Storybook |  | features/RowPinningOnSelect / SelectTopControlledState | new docs page from the story |
| Select Top External Atom | Storybook |  | features/RowPinningOnSelect / SelectTopExternalAtom | new docs page from the story |
| Select Bottom Internal State | Storybook |  | features/RowPinningOnSelect / SelectBottomInternalState | new docs page from the story |
| Select Bottom Controlled State | Storybook |  | features/RowPinningOnSelect / SelectBottomControlledState | new docs page from the story |
| Select Bottom External Atom | Storybook |  | features/RowPinningOnSelect / SelectBottomExternalAtom | new docs page from the story |
| Disable Select All | Storybook |  | features/Selection / DisableSelectAll | new docs page from the story |
| Selection Enabled Grid | Storybook |  | features/Selection / SelectionEnabledGrid | new docs page from the story |
| Selection Enabled Grid No Grow | Storybook |  | features/Selection / SelectionEnabledGridNoGrow | new docs page from the story |
| Batch Selection Disabled | Storybook |  | features/Selection / BatchSelectionDisabled | new docs page from the story |
| Selection Enabled Conditionally | Storybook |  | features/Selection / SelectionEnabledConditionally | new docs page from the story |
| Selection Enabled Conditionally With Initial | Storybook |  | features/Selection / SelectionEnabledConditionallyWithInitial | new docs page from the story |
| Selection Enabled With Row Click | Storybook |  | features/Selection / SelectionEnabledWithRowClick | new docs page from the story |
| Manual Selection | Storybook |  | features/Selection / ManualSelection | new docs page from the story |
| Select All Mode All | Storybook |  | features/Selection / SelectAllModeAll | new docs page from the story |
| Select All Mode All Conditionally | Storybook |  | features/Selection / SelectAllModeAllConditionally | new docs page from the story |
| Select All Mode Page | Storybook |  | features/Selection / SelectAllModePage | new docs page from the story |
| Select All Disabled Custom Header | Storybook |  | features/Selection / SelectAllDisabledCustomHeader | new docs page from the story |
| Select Checkbox Secondary Color | Storybook |  | features/Selection / SelectCheckboxSecondaryColor | new docs page from the story |
| Alert Banner Bottom | Storybook |  | features/Selection / AlertBannerBottom | new docs page from the story |
| Alert Banner Head Overlay | Storybook |  | features/Selection / AlertBannerHeadOverlay | new docs page from the story |
| Custom Alert Banner Head Overlay | Storybook |  | features/Selection / CustomAlertBannerHeadOverlay | new docs page from the story |
| Multi Select Row With Hold Shift | Storybook |  | features/Selection / MultiSelectRowWithHoldShift | new docs page from the story |
| Row Click And Row Button Actions | Storybook |  | fixed-bugs/click-propogation / RowClickAndRowButtonActions | new docs page from the story |

## 7. Editing

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Editing CRUD Inline Row | Both | `editing-crud-inline-row` | features/Editing / EditingEnabledEditModeRow | rename the story |
| Editing CRUD Inline Cell | Both | `editing-crud-inline-cell` | features/Editing / EditingEnabledEditModeCell | rename the story |
| Editing CRUD Inline Table | Both | `editing-crud-inline-table` | features/Editing / EditingEnabledEditModeTable | rename the story |
| Editing CRUD Tree | Docs | `editing-crud-tree` |  | new story from the docs example |
| Create Row Index Top | Storybook |  | features/Creating / CreateRowIndexTop | new docs page from the story |
| Create Row Index Bottom | Storybook |  | features/Creating / CreateRowIndexBottom | new docs page from the story |
| Create Row Index Index | Storybook |  | features/Creating / CreateRowIndexIndex | new docs page from the story |
| Create Row Index Index Virtualized | Storybook |  | features/Creating / CreateRowIndexIndexVirtualized | new docs page from the story |
| Create Row Index Index Expanding | Storybook |  | features/Creating / CreateRowIndexIndexExpanding | new docs page from the story |
| Create With Custom Edit Cell | Storybook |  | features/Creating / CreateWithCustomEditCell | new docs page from the story |
| Editing Feature Enabled Conditionally | Storybook |  | features/Editing / EditingFeatureEnabledConditionally | new docs page from the story |
| Editing Enabled Edit Mode Row Custom Save | Storybook |  | features/Editing / EditingEnabledEditModeRowCustomSave | new docs page from the story |
| Editing Enabled Edit Mode Row Virtualized | Storybook |  | features/Editing / EditingEnabledEditModeRowVirtualized | new docs page from the story |
| Editing Enabled Edit Mode Cell With Row Actions | Storybook |  | features/Editing / EditingEnabledEditModeCellWithRowActions | new docs page from the story |
| Edit Select Variant | Storybook |  | features/Editing / EditSelectVariant | new docs page from the story |
| Edit Select Variant Alternate | Storybook |  | features/Editing / EditSelectVariantAlternate | new docs page from the story |
| Editing Customize Input | Storybook |  | features/Editing / EditingCustomizeInput | new docs page from the story |
| Editing Enabled Async | Storybook |  | features/Editing / EditingEnabledAsync | new docs page from the story |
| Editing Nested Data | Storybook |  | features/Editing / EditingNestedData | new docs page from the story |
| Editing Enabled Edit Mode Table With Grouped Rows | Storybook |  | features/Editing / EditingEnabledEditModeTableWithGroupedRows | new docs page from the story |
| Enable Editing Conditionally | Storybook |  | features/Editing / EnableEditingConditionally | new docs page from the story |
| Enable Editing Conditionally Cell | Storybook |  | features/Editing / EnableEditingConditionallyCell | new docs page from the story |
| Enable Editing Conditionally Table | Storybook |  | features/Editing / EnableEditingConditionallyTable | new docs page from the story |
| Editing Cell Manual On Change | Storybook |  | features/Editing / EditingCellManualOnChange | new docs page from the story |

## 8. Grouping, trees and detail panels

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Column Grouping | Both | `column-grouping` | features/ColumnGrouping / ColumnGroupingEnabled | rename the story |
| Customized Grouping | Both | `customized-grouping` | features/ColumnGrouping / GroupingColumnModeRemove | rename the story |
| Expanding Tree | Both | `expanding-tree` | features/SubRowTree / SubRowTreeEnabledDefault | rename the story |
| Expanding Parsed Tree | Docs | `expanding-tree-flat-parse` |  | new story from the docs example |
| Detail Panel | Both | `detail-panel` | features/DetailPanel / DetailPanelEnabledConditional | rename the story |
| Chart Detail Panel | Docs | `chart-detail-panel` |  | new story from the docs example |
| Aggregation With Selection | Storybook |  | features/Aggregation / AggregationWithSelection | new docs page from the story |
| Aggregation Expanded Default | Storybook |  | features/Aggregation / AggregationExpandedDefault | new docs page from the story |
| Aggregation Remove Mode | Storybook |  | features/Aggregation / AggregationRemoveMode | new docs page from the story |
| Aggregation False Mode | Storybook |  | features/Aggregation / AggregationFalseMode | new docs page from the story |
| Aggregation Remove Mode Custom Grouped Cell | Storybook |  | features/Aggregation / AggregationRemoveModeCustomGroupedCell | new docs page from the story |
| Aggregation Grouped And Expanded Default | Storybook |  | features/Aggregation / AggregationGroupedAndExpandedDefault | new docs page from the story |
| Multi Aggregation Per Column | Storybook |  | features/Aggregation / MultiAggregationPerColumn | new docs page from the story |
| Column Grouping Enabled Reorder | Storybook |  | features/ColumnGrouping / ColumnGroupingEnabledReorder | new docs page from the story |
| Grouping Column Mode False | Storybook |  | features/ColumnGrouping / GroupingColumnModeFalse | new docs page from the story |
| Grouping Column Mode Remove Custom Header | Storybook |  | features/ColumnGrouping / GroupingColumnModeRemoveCustomHeader | new docs page from the story |
| Grouping Column Mode Remove Paginate Pre Expand | Storybook |  | features/ColumnGrouping / GroupingColumnModeRemovePaginatePreExpand | new docs page from the story |
| Grouping Column Mode Remove Custom Grouped Cell | Storybook |  | features/ColumnGrouping / GroupingColumnModeRemoveCustomGroupedCell | new docs page from the story |
| Column Grouping Enabled With Selection | Storybook |  | features/ColumnGrouping / ColumnGroupingEnabledWithSelection | new docs page from the story |
| Column Grouping Enabled With Selection Remove | Storybook |  | features/ColumnGrouping / ColumnGroupingEnabledWithSelectionRemove | new docs page from the story |
| Column Grouping No Drag Handles | Storybook |  | features/ColumnGrouping / ColumnGroupingNoDragHandles | new docs page from the story |
| Column Grouping Enabled Drop Zone Bottom | Storybook |  | features/ColumnGrouping / ColumnGroupingEnabledDropZoneBottom | new docs page from the story |
| Column Grouping Enabled Custom Aggregate | Storybook |  | features/ColumnGrouping / ColumnGroupingEnabledCustomAggregate | new docs page from the story |
| Column Grouping Banner On Bottom | Storybook |  | features/ColumnGrouping / ColumnGroupingBannerOnBottom | new docs page from the story |
| Grouping Columns Set State | Storybook |  | features/ColumnGrouping / GroupingColumnsSetState | new docs page from the story |
| Column Grouping Drop Zone Always Visible | Storybook |  | features/ColumnGrouping / ColumnGroupingDropZoneAlwaysVisible | new docs page from the story |
| Grouping State Managed | Storybook |  | features/ColumnGrouping / GroupingStateManaged | new docs page from the story |
| Grouping And Dragging With Some Disabled Grouping | Storybook |  | features/ColumnGrouping / GroupingAndDraggingWithSomeDisabledGrouping | new docs page from the story |
| Detail Panel Enabled Grid | Storybook |  | features/DetailPanel / DetailPanelEnabledGrid | new docs page from the story |
| Detail Panel Enabled Grid No Grow | Storybook |  | features/DetailPanel / DetailPanelEnabledGridNoGrow | new docs page from the story |
| Custom Expand Rotation | Storybook |  | features/DetailPanel / CustomExpandRotation | new docs page from the story |
| Detail Panel Enabled Conditional Hide | Storybook |  | features/DetailPanel / DetailPanelEnabledConditionalHide | new docs page from the story |
| Detail Panel Expand Column Last | Storybook |  | features/DetailPanel / DetailPanelExpandColumnLast | new docs page from the story |
| Detail Panel Expanded By Default | Storybook |  | features/DetailPanel / DetailPanelExpandedByDefault | new docs page from the story |
| Detail Panel Expand All Disabled | Storybook |  | features/DetailPanel / DetailPanelExpandAllDisabled | new docs page from the story |
| Detail Panel Expand All Disabled Grid | Storybook |  | features/DetailPanel / DetailPanelExpandAllDisabledGrid | new docs page from the story |
| Detail Panel Expand All Disabled Grid No Grow | Storybook |  | features/DetailPanel / DetailPanelExpandAllDisabledGridNoGrow | new docs page from the story |
| Sub Row Tree Layout Grid | Storybook |  | features/SubRowTree / SubRowTreeLayoutGrid | new docs page from the story |
| Sub Row Tree Layout Grid No Grow | Storybook |  | features/SubRowTree / SubRowTreeLayoutGridNoGrow | new docs page from the story |
| Sub Row Tree Enabled Position Last | Storybook |  | features/SubRowTree / SubRowTreeEnabledPositionLast | new docs page from the story |
| Sub Row Tree Enabled Default RTL | Storybook |  | features/SubRowTree / SubRowTreeEnabledDefaultRTL | new docs page from the story |
| Sub Row Tree Enabled Default RTL And Position Last | Storybook |  | features/SubRowTree / SubRowTreeEnabledDefaultRTLAndPositionLast | new docs page from the story |
| Sub Row Tree Disable Expand All | Storybook |  | features/SubRowTree / SubRowTreeDisableExpandAll | new docs page from the story |
| Sub Row Tree Filter From Leaf Rows | Storybook |  | features/SubRowTree / SubRowTreeFilterFromLeafRows | new docs page from the story |
| Sub Row Tree Max Leaf Row Filter Depth0 | Storybook |  | features/SubRowTree / SubRowTreeMaxLeafRowFilterDepth0 | new docs page from the story |
| Sub Row Tree Max Leaf Row Filter Depth1 | Storybook |  | features/SubRowTree / SubRowTreeMaxLeafRowFilterDepth1 | new docs page from the story |
| Sub Row Tree Max Leaf Row Filter Depth And Filter From Leaf Rows | Storybook |  | features/SubRowTree / SubRowTreeMaxLeafRowFilterDepthAndFilterFromLeafRows | new docs page from the story |
| Sub Row Tree With Selection | Storybook |  | features/SubRowTree / SubRowTreeWithSelection | new docs page from the story |
| Sub Row Tree With Selection No Sub Row Selection | Storybook |  | features/SubRowTree / SubRowTreeWithSelectionNoSubRowSelection | new docs page from the story |
| Sub Row Tree With Single Selection | Storybook |  | features/SubRowTree / SubRowTreeWithSingleSelection | new docs page from the story |

## 9. Remote data and loading

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Remote Data Fetching | Docs | `remote` |  | new story from the docs example |
| Dynamic Columns | Docs | `dynamic-columns` |  | new story from the docs example |
| Lazy Detail Panel | Docs | `lazy-detail-panel` |  | new story from the docs example |
| Lazy Sub-Rows | Docs | `lazy-sub-rows` |  | new story from the docs example |
| Loading: Loading | Storybook |  | features/Loading / Loading | new docs page from the story |
| Loading: Loading5 | Storybook |  | features/Loading / Loading5 | new docs page from the story |
| Loading With Progress Bars | Storybook |  | features/Loading / LoadingWithProgressBars | new docs page from the story |
| Loading With Progress Bars No Overlay | Storybook |  | features/Loading / LoadingWithProgressBarsNoOverlay | new docs page from the story |
| Loading With Some Data | Storybook |  | features/Loading / LoadingWithSomeData | new docs page from the story |
| Loading With Selection | Storybook |  | features/Loading / LoadingWithSelection | new docs page from the story |
| Loading With Detail Panel Example | Storybook |  | features/Loading / LoadingWithDetailPanelExample | new docs page from the story |
| Skeleton Display Columns | Storybook |  | features/Loading / SkeletonDisplayColumns | new docs page from the story |
| Reloading Example | Storybook |  | features/Loading / ReloadingExample | new docs page from the story |
| Only Top Progress Bar | Storybook |  | features/Loading / OnlyTopProgressBar | new docs page from the story |
| Filter Options Async | Storybook |  | fixed-bugs/useEffects / FilterOptionsAsync | new docs page from the story |
| Edit Options Async | Storybook |  | fixed-bugs/useEffects / EditOptionsAsync | new docs page from the story |
| Render Row Actions Async | Storybook |  | fixed-bugs/useEffects / RenderRowActionsAsync | new docs page from the story |
| Render Row Action Menu Items Async | Storybook |  | fixed-bugs/useEffects / renderRowActionMenuItemsAsync | new docs page from the story |
| Delayed Faceted Values | Storybook |  | fixed-bugs/useEffects / DelayedFacetedValues | new docs page from the story |

## 10. Virtualization

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Row Virtualization | Both | `row-virtualization` | features/Virtualization / EnableRowVirtualizationDense | rename the story |
| Column Virtualization | Both | `column-virtualization` | features/Virtualization / EnableColumnVirtualization | rename the story |
| Infinite Scrolling | Docs | `infinite-scrolling` |  | new story from the docs example |
| Enable Row Virtualization Spacious | Storybook |  | features/Virtualization / EnableRowVirtualizationSpacious | new docs page from the story |
| Enable Row Virtualization Tall Content | Storybook |  | features/Virtualization / EnableRowVirtualizationTallContent | new docs page from the story |
| Virtualization Conditionally Wont Toggle | Storybook |  | features/Virtualization / VirtualizationConditionallyWontToggle | new docs page from the story |
| Enable Row Virtualization With Column Resizing | Storybook |  | features/Virtualization / EnableRowVirtualizationWithColumnResizing | new docs page from the story |
| Enable Row Virtualization With Detail Panel | Storybook |  | features/Virtualization / EnableRowVirtualizationWithDetailPanel | new docs page from the story |
| Enable Row Virtualization Sticky Footer | Storybook |  | features/Virtualization / EnableRowVirtualizationStickyFooter | new docs page from the story |
| Enable Column Virtualization With Pinning | Storybook |  | features/Virtualization / EnableColumnVirtualizationWithPinning | new docs page from the story |
| Enable Column Virtualization Short Columns | Storybook |  | features/Virtualization / EnableColumnVirtualizationShortColumns | new docs page from the story |
| Enable Column Virtualization With Footer | Storybook |  | features/Virtualization / EnableColumnVirtualizationWithFooter | new docs page from the story |
| Enable Column Virtualization Sticky Footer | Storybook |  | features/Virtualization / EnableColumnVirtualizationStickyFooter | new docs page from the story |
| Row And Column Virtualization With Features | Storybook |  | features/Virtualization / RowAndColumnVirtualizationWithFeatures | new docs page from the story |
| Empty Data Virtualization | Storybook |  | features/Virtualization / EmptyDataVirtualization | new docs page from the story |

## 11. Toolbar, view and export

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Persistent View | Docs | `persistent-view` |  | new story from the docs example |
| CSV Export | Docs | `export-csv` |  | new story from the docs example |
| PDF Export | Docs | `export-pdf` |  | new story from the docs example |
| Dense Padding Toggle Enabled Default | Storybook |  | features/DensePadding / DensePaddingToggleEnabledDefault | new docs page from the story |
| Dense Padding Disabled | Storybook |  | features/DensePadding / DensePaddingDisabled | new docs page from the story |
| Default To Dense Padding | Storybook |  | features/DensePadding / DefaultToDensePadding | new docs page from the story |
| Full Screen Toggle Enabled Default | Storybook |  | features/FullScreen / FullScreenToggleEnabledDefault | new docs page from the story |
| Disable Full Screen Toggle | Storybook |  | features/FullScreen / DisableFullScreenToggle | new docs page from the story |
| Default Full Screen On | Storybook |  | features/FullScreen / DefaultFullScreenOn | new docs page from the story |
| Controlled Full Screen | Storybook |  | features/FullScreen / ControlledFullScreen | new docs page from the story |
| Toolbar Enabled Default | Storybook |  | features/Toolbar / ToolbarEnabledDefault | new docs page from the story |
| Top Toolbar Hidden | Storybook |  | features/Toolbar / TopToolbarHidden | new docs page from the story |
| Bottom Toolbar Hidden | Storybook |  | features/Toolbar / BottomToolbarHidden | new docs page from the story |
| No Toolbars | Storybook |  | features/Toolbar / NoToolbars | new docs page from the story |
| Hide Toolbar Internal Actions | Storybook |  | features/Toolbar / HideToolbarInternalActions | new docs page from the story |
| Custom Toolbar Internal Actions | Storybook |  | features/Toolbar / CustomToolbarInternalActions | new docs page from the story |
| Table Title | Storybook |  | features/Toolbar / TableTitle | new docs page from the story |
| Custom Top Toolbar Actions | Storybook |  | features/Toolbar / CustomTopToolbarActions | new docs page from the story |
| Custom Bottom Toolbar Actions | Storybook |  | features/Toolbar / CustomBottomToolbarActions | new docs page from the story |
| Custom Top Toolbar Selection Actions | Storybook |  | features/Toolbar / CustomTopToolbarSelectionActions | new docs page from the story |
| Custom Bottom Toolbar Selection Actions | Storybook |  | features/Toolbar / CustomBottomToolbarSelectionActions | new docs page from the story |
| Toolbar Alert Banner Bottom | Storybook |  | features/Toolbar / ToolbarAlertBannerBottom | new docs page from the story |
| Toolbar Alert Banner Bottom With Actions Also Bottom | Storybook |  | features/Toolbar / ToolbarAlertBannerBottomWithActionsAlsoBottom | new docs page from the story |
| Render Custom Top Toolbar | Storybook |  | features/Toolbar / renderCustomTopToolbar | new docs page from the story |
| Render Custom Bottom Toolbar | Storybook |  | features/Toolbar / renderCustomBottomToolbar | new docs page from the story |
| View Settings Default | Storybook |  | features/ViewSettings / ViewSettingsDefault | new docs page from the story |
| View Settings Seeded | Storybook |  | features/ViewSettings / ViewSettingsSeeded | new docs page from the story |
| View Settings Persisted | Storybook |  | features/ViewSettings / ViewSettingsPersisted | new docs page from the story |

## 12. Styling and layout

| Example | Today in | Docs page today | Story today | To do |
|---|---|---|---|---|
| Sticky Header | Both | `sticky-header` | styling/StickyHeader / EnableStickyHeader | rename the story |
| Default Grid | Storybook |  | features/LayoutMode / DefaultGrid | new docs page from the story |
| Layout Mode: Semantic | Storybook |  | features/LayoutMode / Semantic | new docs page from the story |
| Layout Mode: Grid | Storybook |  | features/LayoutMode / Grid | new docs page from the story |
| Grid No Grow | Storybook |  | features/LayoutMode / GridNoGrow | new docs page from the story |
| Grid With Resizing | Storybook |  | features/LayoutMode / GridWithResizing | new docs page from the story |
| Grid No Grow With Resizing | Storybook |  | features/LayoutMode / GridNoGrowWithResizing | new docs page from the story |
| Right To Left | Storybook |  | fixed-bugs/RTL / RightToLeft | new docs page from the story |
| Default Left | Storybook |  | styling/Alignment / DefaultLeft | new docs page from the story |
| Default Left Grid | Storybook |  | styling/Alignment / DefaultLeftGrid | new docs page from the story |
| Right Cells | Storybook |  | styling/Alignment / RightCells | new docs page from the story |
| Right Cells Grid | Storybook |  | styling/Alignment / RightCellsGrid | new docs page from the story |
| Center Cells Grid | Storybook |  | styling/Alignment / CenterCellsGrid | new docs page from the story |
| Center Cells With Grab Handle | Storybook |  | styling/Alignment / CenterCellsWithGrabHandle | new docs page from the story |
| Center Cells With Grab Handle No Sorting | Storybook |  | styling/Alignment / CenterCellsWithGrabHandleNoSorting | new docs page from the story |
| Center Cells No Column Actions | Storybook |  | styling/Alignment / CenterCellsNoColumnActions | new docs page from the story |
| Right Align Number Column | Storybook |  | styling/Alignment / RightAlignNumberColumn | new docs page from the story |
| Custom Widths Semantic | Storybook |  | styling/ColumnWidths / CustomWidthsSemantic | new docs page from the story |
| Custom Widths Grid | Storybook |  | styling/ColumnWidths / CustomWidthsGrid | new docs page from the story |
| Custom Widths Grid No Grow Individual Grow | Storybook |  | styling/ColumnWidths / CustomWidthsGridNoGrowIndividualGrow | new docs page from the story |
| Custom Widths Grid Individual Shrink | Storybook |  | styling/ColumnWidths / CustomWidthsGridIndividualShrink | new docs page from the story |
| Small Widths Semantic | Storybook |  | styling/ColumnWidths / SmallWidthsSemantic | new docs page from the story |
| Small Widths Grid | Storybook |  | styling/ColumnWidths / SmallWidthsGrid | new docs page from the story |
| Small Widths Grid No Grow | Storybook |  | styling/ColumnWidths / SmallWidthsGridNoGrow | new docs page from the story |
| Small Widths Grid No Grow Individual Grow | Storybook |  | styling/ColumnWidths / SmallWidthsGridNoGrowIndividualGrow | new docs page from the story |
| Custom Table Body | Storybook |  | styling/CustomTableBody / CustomTableBody | new docs page from the story |
| Default Look: Default | Storybook |  | styling/DefaultLook / Default | new docs page from the story |
| Sticky Header Disabled Default | Storybook |  | styling/StickyHeader / StickyHeaderDisabledDefault | new docs page from the story |
| Disable Sticky Footer | Storybook |  | styling/StickyHeader / disableStickyFooter | new docs page from the story |
| Enable Sticky Footer | Storybook |  | styling/StickyHeader / enableStickyFooter | new docs page from the story |
| Default Table Body Cell Styles | Storybook |  | styling/TableBodyCellStyles / DefaultTableBodyCellStyles | new docs page from the story |
| Style Mui Table Body Cell Conditionally In1 Column | Storybook |  | styling/TableBodyCellStyles / StyleMuiTableBodyCellConditionallyIn1Column | new docs page from the story |
| Custom Cell Render | Storybook |  | styling/TableBodyCellStyles / CustomCellRender | new docs page from the story |
| Style Mui Table Body Row | Storybook |  | styling/TableBodyRowStyles / StyleMuiTableBodyRow | new docs page from the story |
| Style Custom Striped Rows | Storybook |  | styling/TableBodyRowStyles / StyleCustomStripedRows | new docs page from the story |
| Style Custom Striped Rows Detail Panel | Storybook |  | styling/TableBodyRowStyles / StyleCustomStripedRowsDetailPanel | new docs page from the story |
| Conditionally Style Mui Table Row | Storybook |  | styling/TableBodyRowStyles / ConditionallyStyleMuiTableRow | new docs page from the story |
| Max Height | Storybook |  | styling/TableDiminsions / maxHeight | new docs page from the story |
| Min Height | Storybook |  | styling/TableDiminsions / minHeight | new docs page from the story |
| Min Height Parent | Storybook |  | styling/TableDiminsions / minHeightParent | new docs page from the story |
| Container Height | Storybook |  | styling/TableDiminsions / ContainerHeight | new docs page from the story |
| Default Table Head Cell Styles | Storybook |  | styling/TableHeadCellStyles / DefaultTableHeadCellStyles | new docs page from the story |
| Color Sort Icon | Storybook |  | styling/TableHeadCellStyles / ColorSortIcon | new docs page from the story |
| Style Table Head Cells Individually | Storybook |  | styling/TableHeadCellStyles / StyleTableHeadCellsIndividually | new docs page from the story |
| Custom Head Cell Renders | Storybook |  | styling/TableHeadCellStyles / CustomHeadCellRenders | new docs page from the story |
| Default Theme | Storybook |  | styling/Theming / DefaultTheme | new docs page from the story |
| Custom Dark Theme | Storybook |  | styling/Theming / CustomDarkTheme | new docs page from the story |

## Test-only stories

Rule, applied by script and not judged story by story:

- A story with a play function is test-only, unless it is the name match of a docs example.
- Every story in the `fixed-bugs` folder is test-only, unless it is in the keep list below.
- A story without a play function in `features`, `styling` or `Basic` is an example.

| Story file | Hidden | Stays as example | For example |
|---|---|---|---|
| Basic | 1 | 1 | RendersRows |
| features/Aggregation | 1 | 8 | GroupedRowShowsAggregate |
| features/CellActions | 3 | 4 | CellActionsEnabledCustom, RightClickOpensMenu, MenuItemRuns |
| features/ClickToCopy | 1 | 4 | ClickCopiesValue |
| features/ColumnActions | 4 | 6 | MenuItemsFollowTheColumnState, MenuSortStacks, MenuResetSizeAfterResize |
| features/ColumnDragging | 6 | 1 | ColumnDraggingEnabled, ColumnDraggingCancelled, ColumnDraggingLockedColumn |
| features/ColumnGrouping | 8 | 17 | GroupedHeaderHasIcon, GroupedHeaderWidthSumsColumns, GroupedHeaderWidthOverride |
| features/ColumnHiding | 3 | 8 | ColumnHidingKeyboardToggle, MenuItemsShowIcons, MenuReorderWithTableOffset |
| features/ColumnOrdering | 2 | 10 | MenuReorderMovesColumn, LockedColumnStaysPut |
| features/ColumnPinning | 3 | 6 | PinStartSticks, UnpinRestores, PinnedEdgeShadow |
| features/ColumnResizing | 7 | 18 | DragPreviewRTL, ResizeGuidesMeetEdge, ResizeGuidesMeetEdgeOnEnd |
| features/Creating | 1 | 6 | CreateRowAppears |
| features/CustomFilterFns | 12 | 0 | CustomColumnFilterFn, CustomGlobalFilterFn, DefaultFuzzyGlobalFilter |
| features/DateFilters | 13 | 0 | GreaterThanOnDateColumn, LessThanOnDateColumn, EqualsMatchesCalendarDay |
| features/DensePadding | 1 | 3 | ToggleChangesRowHeight |
| features/DetailPanel | 5 | 10 | DetailPanelEnabledSemantic, DetailPanelSingleExpand, PanelRenders |
| features/Editing | 4 | 18 | EditingValidationHelperText, CellEditSaves, RowEditSaveCancel |
| features/FilterChips | 16 | 9 | AddThroughPicker, RemoveAndClear, HiddenColumnNotice |
| features/Filtering | 18 | 19 | ChipsDisplayMode, MultiSelectFieldControls, RangeSliderCustomBounds |
| features/FullScreen | 1 | 4 | ToggleFullScreen |
| features/HeaderGroups | 2 | 12 | GroupEdgesMatchLeaves, GroupEdgesMatchLeavesNoGrow |
| features/Icons | 1 | 0 | ProviderIconSet |
| features/LayoutMode | 2 | 6 | GridGrowsColumns, SemanticLayoutRenders |
| features/Loading | 2 | 10 | SkeletonsWhileLoading, ProgressBarShown |
| features/NestedTable | 1 | 0 | NestedDetailPanelTable |
| features/Pagination | 7 | 16 | PaginationCompactMoreData, PaginationDisabledManualPaginationFalse, NextPageChangesRows |
| features/RowActions | 1 | 9 | TwoControlsVisible |
| features/RowDragging | 1 | 3 | DragBetweenTables |
| features/RowNumbers | 1 | 7 | NumbersCentred |
| features/RowOrdering | 3 | 6 | DropSlidesRows, DropNoSlideReducedMotion, DragReordersRows |
| features/RowPinning | 3 | 15 | PinRowTopMode, PinRowSticky, UnpinRow |
| features/RowPinningOnSelect | 6 | 7 | ShiftRangeInternalState, ShiftRangeControlledState, SelectAllPageMode |
| features/Search | 4 | 15 | TypingFiltersRows, ToggleClearsAndCloses, EscapeClearsThenCloses |
| features/Selection | 5 | 17 | SelectionEnabled, CheckboxesAlign, SingleSelectionRadio |
| features/SortPopover | 4 | 3 | PickerThenEditor, ReorderRemoveDelete, SingleSortHasNoAdd |
| features/Sorting | 1 | 7 | ClearSortStaysCleared |
| features/SubRowTree | 2 | 14 | ExpandShowsChildren, ExpandAllCollapseAll |
| features/TableProvider | 7 | 0 | HandComposition, ControlledInputInCustomToolbar, ProviderWithTwoTables |
| features/Toolbar | 5 | 15 | InternalButtonsAnimateIn, InternalButtonsOrder, CustomActionsRender |
| features/ViewSettings | 9 | 3 | PanelRowsAndRowNumbers, PinUnpinAndSteppers, ResetView |
| features/Virtualization | 5 | 14 | EnableRowVirtualizationComfortable, RowAndColumnVirtualization, MaxVirtualization |
| fixed-bugs/AriaTooltips | 1 | 0 | SelectFilterAndGroupValue |
| fixed-bugs/CallbackRefs | 4 | 0 | CallbackRefOnProviderContainer, CallbackRefOnTableContainerProps, RefObjectOnTableContainerProps |
| fixed-bugs/CellActionMenuEdit | 1 | 0 | CellActionMenuEditKeepsFocus |
| fixed-bugs/FilterEditorFocusRing | 2 | 0 | ChipEditorRing, SubheaderRowRing |
| fixed-bugs/FilterPopover | 4 | 0 | OpensWithInputFocused, OpensWithRowSelection, EmptyModeChipClearHasName |
| fixed-bugs/HeadlessDisplayColumn | 2 | 0 | HeadlessDisplayColumnHeaders, HeadlessDisplayColumnHeaderComponents |
| fixed-bugs/HeadlessFullScreen | 4 | 0 | EscapeLeavesFullScreen, PointerClickThenEscape, TableLayoutPointerClickThenEscape |
| fixed-bugs/MenuFocusReturn | 5 | 0 | ColumnActionMenu, RowActionMenu, CellActionMenu |
| fixed-bugs/MenuOpeners | 4 | 0 | ColumnActions, RowActions, ShowHideColumns |
| fixed-bugs/ModalExit | 1 | 0 | EditModalPlaysExit |
| fixed-bugs/MultiSelectFilter | 4 | 0 | SubheaderStringColumn, ChipsStringColumn, SubheaderArrayColumn |
| fixed-bugs/PaginationDisabled | 2 | 0 | PaginationDisabledTwentyFiveRows, ColumnFiltersWithEveryFilterFlagOff |
| fixed-bugs/PanelCollapse | 1 | 0 | ProgressAndBannerCollapse |
| fixed-bugs/PinnedItemsCustomToolbar | 4 | 0 | CustomTopToolbar, StockToolbar, PinInCustomToolbar |
| fixed-bugs/SearchField | 6 | 0 | OpenCloseAndEscape, PositionRight, PositionLeft |
| fixed-bugs/click-propogation | 1 | 1 | RowClickAndRowMenuActions |
| fixed-bugs/data-types | 1 | 0 | NullColumn |
| fixed-bugs/dragging-virtual-when-filtered | 1 | 0 | DraggingRowWhenFiltered |
| fixed-bugs/fullscreen-with-appbar | 1 | 0 | FullscreenIsAboveAppbar |
| fixed-bugs/gridLayout | 2 | 0 | CenterAlignInGridLayoutMode, RightAlignInGridLayoutMode |
| fixed-bugs/loading | 6 | 0 | NestedLoadingDataWithInitialExpanded, NestedLoadingDataWithInitialFilter, NestedLoadingDataWithInitialGroup |
| fixed-bugs/mobile-date-pickers | 1 | 0 | MobileDateTimePickers |
| fixed-bugs/sticky-footer | 1 | 0 | PinnedColumnsWithStickyFooter |
| fixed-bugs/useEffects | 2 | 5 | FilterModesRefetch, PreventUnnecessaryPaginationChangeByOutOfBoundsCheck |
| styling/Alignment | 1 | 9 | CenterCells |
| styling/Caption | 2 | 0 | BottomCaption, TopCaption |
| styling/ColumnWidths | 1 | 8 | CustomWidthsGridNoGrow |
| styling/CustomTableBody | 1 | 1 | CustomEmptyRowsJSX |
| styling/DefaultLook | 5 | 1 | RowMetrics, ScrollCues, OverflowTooltip |
| styling/RenderCounts | 11 | 0 | RootSkipsStateRenders, HookSelectorSkipsStateRenders, HookSelectorFollowsTransformState |
| styling/RowHeights | 1 | 0 | SetRowHeight |
| styling/StickyHeader | 1 | 4 | StickyHeaderShorterTable |
| styling/StylingDisplayColumns | 1 | 0 | CustomizeDisplayColumns |
| styling/TableBodyCellStyles | 1 | 3 | StyleAllMuiTableBodyCell |
| styling/TableBodyRowStyles | 2 | 4 | DefaultTableBodyRowStyles, DisableRowHoverEffect |
| styling/TableDiminsions | 1 | 4 | MaxWidthAndCentered |
| styling/TableHeadCellStyles | 1 | 4 | StyleAllMuiTableHeadCell |
| styling/TablePaper | 1 | 0 | NoBoxShadow |
| styling/Theming | 1 | 2 | CustomLightTheme |

Files hidden completely: 32 of 81.

### Fixed-bugs stories kept as examples

| Story today | Joins group | Why |
|---|---|---|
| fixed-bugs/useEffects / FilterOptionsAsync | Remote data and loading | options or data that arrive after the first render |
| fixed-bugs/useEffects / EditOptionsAsync | Remote data and loading | options or data that arrive after the first render |
| fixed-bugs/useEffects / RenderRowActionsAsync | Remote data and loading | options or data that arrive after the first render |
| fixed-bugs/useEffects / renderRowActionMenuItemsAsync | Remote data and loading | options or data that arrive after the first render |
| fixed-bugs/useEffects / DelayedFacetedValues | Remote data and loading | options or data that arrive after the first render |
| fixed-bugs/RTL / RightToLeft | Styling and layout | the only right-to-left table; has a play function |
| fixed-bugs/click-propogation / RowClickAndRowButtonActions | Rows and selection | row click together with row action buttons |

Fixed-bugs stories without a play function that the rule hides: fixed-bugs/PinnedItemsCustomToolbar / CustomTopToolbar; fixed-bugs/PinnedItemsCustomToolbar / StockToolbar; fixed-bugs/SearchField / PositionRight; fixed-bugs/SearchField / PositionLeft; fixed-bugs/loading / NestedLoadingDataWithInitialExpanded; fixed-bugs/loading / NestedLoadingDataWithInitialFilter; fixed-bugs/loading / NestedLoadingDataWithInitialGroup; fixed-bugs/loading / NestedLoadingDataWithInitialPage; fixed-bugs/loading / NestedLoadingDataWithInitialSort; fixed-bugs/useEffects / PreventUnnecessaryPaginationChangeByOutOfBoundsCheck.

## Points to settle

- First group: which examples are in Showcase and in what order; the first one is what `/docs/examples` opens.
- Size: one row per story gives 400 rows. Either accept it, or hide more stories (for example the layout and RTL variants of the same table), or keep one page per story file with tabs as in L12.
- Test-only rule: "has a play function" hides stories that are also good examples (Column Dragging keeps 1 of 7; Custom Filter Fns, Date Filters, Table Provider, Nested Table, Icons, Caption, Row Heights, Table Paper, Render Counts and Styling Display Columns keep none). Pick which of these get an example back.
- The 20 "Both" rows are name matches only. Each needs the table compared before the story counts as the exact pair (L19).
- Shared names: the docs title or the story name wins on a "Both" row; story-only rows need real titles.
- Group names and the split of today's "Dragging / Ordering" and "Sticky Pinning" pages between Columns and Rows and selection.
- Sticky Header moves from Sticky Pinning to Styling and layout, next to its story file; or it goes to Columns.
- Storybook folders: the proposed groups replace Features, Fixed Bugs and Styling as the top level, so the story titles change and story ids (and existing links) change with them.
