# v0.8.x plan

Release 0.8.0 (D32). Decisions: [decisions.md](decisions.md) D1 to D83 (D12 and D30 superseded, D16 unused). Findings: [findings.md](findings.md) F1 to F60. Ownership: [ownership.md](ownership.md). Sprints: [sprints.md](sprints.md). Epics implement decisions and never re-decide.

## Goals

- The stock table looks and behaves like the owner's header demo (`/header-demo` in `test-projects/next-app`, reference captures under `reference/`, D34): toolbar above the frame, quiet header with a chevron menu, Notion column menu, hairline resize, fixed row heights with rows-only grid lines, pages pagination, no italic empty state (D1 to D7) (D13) (D15)
- Filters live as chips with one editor that stays where it was opened and carries the filter mode picker, sorts in a toolbar editor, table preferences behind one view settings button with pinnable items; one search clear control (D8 to D11) (D35) (D38) (D39)
- Columns reorder by dragging the header, with the Notion-style preview, catch-up slide and highlight; locked columns say so only while a drag is active; pinned edges cast a theme shadow and hidden columns get hover chevrons (D20 to D22) (D37)
- Every tint comes from four theme-derived CSS variables declared inside the components; a library install never touches global CSS (D23) (P8)
- View persistence is opt-in and needs no key; with it on, a stored view never paints after the default order under server rendering (D36)
- Pinning, resizing and ordering are on by default; the actions column sits last and pinned; the layout grows data columns in proportion while narrow columns keep their width (D14) (D31)
- Cut-off text shows a tooltip only when cut; sticky headers cap at 70 percent of the window unless forced by virtualization (D17) (D19)
- Every chrome icon has a key with the demo's Lucide pick and a mapping in all four icon editions; every new string has an optional localization key with English only (D18) (D24)
- Every menu opens from a real trigger; nothing public is removed; `anchorEl` keeps working (D25)
- Docs rewritten and extended for the new look, shipped with 0.8.0 as a minor release with the way back for every flipped default (D32) (D33)
- All three bases identical in every change; registry output regenerated, docs app copies re-installed

## Epics

| # | Epic | Scope |
|---|---|---|
| 01 | [shared surface](epics/01-shared-surface.md) | Types, options, icon keys, strings, state slices and drag helpers every milestone builds on; no default flips. |
| 02 | [frame and body](epics/02-frame-body.md) | Toolbar above the frame, row metrics, tokens, width rule, scroll cues, overflow text, pending-view script. |
| 03 | [header, column menu and dragging](epics/03-header-menu-drag.md) | Quiet header, Notion column menu, hairline resize, header drag with animation and locked columns. |
| 04 | [toolbar chrome](epics/04-toolbar-chrome.md) | Button group, filter chips, sort editor, view settings with pinned items, one search X, real triggers. |
| 05 | [defaults and stories](epics/05-defaults-stories.md) | Stock defaults flipped to the new look; every story and play test follows; changelog lists each way back. |
| 06 | [docs](epics/06-docs.md) | Guides rewritten for the new look and added for each new surface; ship with 0.8.0. |
| 06.1 | [library fixes](epics/06.1-library-fixes.md) | Regressions and defects of the 0.8 chrome fixed in the three bases: filters, cells, group headers, detail panel. |
| 06.2 | [docs and stories follow-up](epics/06.2-docs-follow-up.md) | Docs app and stories match the 0.8 look: icons everywhere, home demo, examples reworked, subheader filters page. |
| 06.3 | [plays](epics/06.3-plays.md) | Every story file has plays, one per behaviour a feature file shows; the suites prove behaviour. |
| 06.4 | [Library follow-up](epics/06.4-library-follow-up.md) | Grouping header breadcrumb, multi-select field, RTL resizing headers, aria range slider, toolbar fade, chip editor width |
| 06.5 | [Docs follow-up](epics/06.5-docs-follow-up.md) | Unbacked routes, sort chip in custom toolbars, short page descriptions, delete confirm dialog, example column sizes |
| 06.6 | [Edition icons](epics/06.6-edition-icons.md) | The Tabler, Phosphor, Remix and Hugeicons editions map the D75 view settings icons to their own sets |
| 07 | [release 0.8.0](epics/07-release.md) | Checks rerun in throwaway apps per base; 0.8.0 released. |
| 07.1 | [Release automation](epics/07.1-release-automation.md) | The install smoke check runs as a CI step with pixel-diffed captures; one PR per release bumps its own version |
| 08 | [Tests and CI](epics/08-tests-and-ci.md) | Every test under test/ with one runner, tools under tools/, 21 PR jobs and 4 release jobs, the PR Summary comment |

Release label: `release:patch` (0.8.1, D78).
