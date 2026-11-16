# Examples sidebar with the story pages, draft for discussion

Draft of 2026-11-16 for the open point of L19: where the story pages sit in the Examples sidebar. Nothing here is decided. Sources: `content/docs/examples/meta.json` (42 example pages), `packages/shadcn-table/stories` (81 story files), `apps/shadcn-table-docs/lib/storybook-map.ts` (example to story map), all on wt1 `69bafe30`.

Legend:

- plain row: an example page that exists today
- `+` row: a new page from a story file that has no example page today
- `(story: X)`: the story file the page pairs with today, through the toolbar Storybook button
- `(no story)`: an example page with no story today; L19 gives it a new story

## Counts

| | rows |
|---|---|
| Example pages today | 42 |
| Story files | 81 |
| Story files already paired with an example page | 14 |
| New pages from unpaired story files | 67 (Features 28, Styling 14, Fixed bugs 25) |
| Sidebar rows after | 109 |
| Example pages with no story today | 9 |

## Proposed sidebar (new feature pages placed in the group they belong to)

### No group label (top of the section)

- Basic Example (story: Basic)
- Minimal Example (no story)
- Advanced Example (no story)
- Custom Headless Example (no story)
- Persistent View Example (no story)

### Data Export Examples

- CSV Export Example (no story)
- PDF Export Example (no story)

### Dragging / Ordering Examples

- Column DnD Ordering Example (story: ColumnOrdering)
- Row DnD Ordering Example (story: RowOrdering)
- Row Dragging Example (story: RowDragging)
- `+` Column Dragging

### Editing (CRUD) Examples

- Editing CRUD Example (story: Editing)
- Editing CRUD Inline Row Example (story: Editing)
- Editing CRUD Inline Cell Example (story: Editing)
- Editing CRUD Inline Table Example (story: Editing)
- Editing CRUD Tree Example (story: Editing)
- `+` Creating

### Expanding / Grouping Examples

- Expanding Tree Example (story: SubRowTree)
- Expanding Parsed Tree Example (story: SubRowTree)
- Column Grouping Example (story: ColumnGrouping)
- Customized Grouping Example (story: ColumnGrouping)
- Aggregation and Grouping Example (story: Aggregation)
- Detail Panel Example (story: DetailPanel)
- Chart Detail Panel Example (story: DetailPanel)
- `+` Header Groups
- `+` Nested Table

### Filtering Examples

- Filter Variants Example (story: Filtering)
- Faceted Values Example (story: Filtering)
- Filter Switching Example (story: Filtering)
- Popover Filters Example (story: Filtering)
- Subheader Filters Example (story: Filtering)
- Custom Filter UI Example (story: Filtering)
- `+` Custom Filter Functions
- `+` Date Filters
- `+` Filter Chips
- `+` Search

### Sticky Pinning Examples

- Sticky Header Example (story: StickyHeader, in the Styling folder)
- Column Pinning Example (story: ColumnPinning)
- Sticky Row Pinning Example (story: RowPinning)
- Static Row Pinning Example (story: RowPinning)
- Sticky Row Selection Example (story: RowPinning)
- `+` Row Pinning On Select

### Remote Data Fetching Examples

- React Query Example (no story)
- Remote Example (no story)
- Dynamic Columns Example (no story)
- Lazy Detail Panel Example (story: DetailPanel)
- Lazy Sub-Rows Example (story: SubRowTree)
- `+` Loading

### Virtualized Examples

- Virtualized Example (story: Virtualization)
- Row Virtualization Example (story: Virtualization)
- Column Virtualization Example (story: Virtualization)
- Infinite Scrolling Example (story: Virtualization)

### NEW GROUP: Sorting / Pagination / Selection Examples

- `+` Sorting
- `+` Sort Popover
- `+` Pagination
- `+` Selection
- `+` Row Numbers

### NEW GROUP: Column Examples

- `+` Column Hiding
- `+` Column Resizing

### NEW GROUP: Action / Menu Examples

- `+` Cell Actions
- `+` Column Actions
- `+` Row Actions
- `+` Click To Copy

### NEW GROUP: Toolbar / Display Examples

- `+` Toolbar
- `+` View Settings
- `+` Dense Padding
- `+` Full Screen
- `+` Icons
- `+` Layout Mode
- `+` Table Provider

### NEW GROUP: Styling Examples (14)

- `+` Alignment
- `+` Caption
- `+` Column Widths
- `+` Custom Table Body
- `+` Default Look
- `+` Render Counts
- `+` Row Heights
- `+` Styling Display Columns
- `+` Table Body Cell Styles
- `+` Table Body Row Styles
- `+` Table Dimensions
- `+` Table Head Cell Styles
- `+` Table Paper
- `+` Theming

### NEW GROUP: Fixed Bugs (25)

- `+` Aria Tooltips
- `+` Callback Refs
- `+` Cell Action Menu Edit
- `+` Filter Editor Focus Ring
- `+` Filter Popover
- `+` Headless Display Column
- `+` Headless Full Screen
- `+` Menu Focus Return
- `+` Menu Openers
- `+` Modal Exit
- `+` Multi Select Filter
- `+` Pagination Disabled
- `+` Panel Collapse
- `+` Pinned Items Custom Toolbar
- `+` RTL
- `+` Search Field
- `+` Click Propagation
- `+` Data Types
- `+` Dragging Virtual When Filtered
- `+` Fullscreen With Appbar
- `+` Grid Layout
- `+` Loading
- `+` Mobile Date Pickers
- `+` Sticky Footer
- `+` Use Effects

## Points to settle in the discussion

- One story file pairs with several example pages today: Editing with 5, Filtering with 6, Virtualization with 4, Detail Panel with 3, Sub Row Tree with 3, Row Pinning with 3, Column Grouping with 2. All of them open the same single story. L19 wants an exact story per example page, so these need new stories built from the examples.
- A paired story file holds many more stories than its example pages show. Where do those extra stories go: as tabs on one of the example pages, or as one more page per file (for example "Editing, all variations")?
- "Fixed Bugs" pages exist to prove a bug stays fixed. Do visitors need them in the docs, or do they stay in Storybook only? Without them the sidebar is 84 rows.
- Two pages would be called "Loading" (Features and Fixed Bugs); "Sticky Header" sits in the Styling folder but belongs with Sticky Pinning.
- The four new feature groups are my grouping; the Guides sidebar has similar groups and could lend its names.
- Page names in this draft are the story file names with spaces; the real titles come from the stories.
