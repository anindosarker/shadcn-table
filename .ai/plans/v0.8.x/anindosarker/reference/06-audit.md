# 06-docs: rewrite every guide v0.8 changes, add one guide per new surface, update prop lists, st-components, example code and page checks; gate check-pages.mjs per base on an agent-owned dev server (5340-5360).

| file | lines | D | status | change |
|---|---|---|---|---|
| apps/shadcn-table-docs/content/docs/guides/meta.json | 1-56 | D33 | refactor | Register each new guide slug under its section separator (sidebar); fumadocs reads only this file for the sidebar. |
| apps/shadcn-table-docs/lib/routes.ts | 403-625 | D33 | refactor | Add each new guide to the Guides items (sections at 408,448,470,524,564,582,604); guides/index.mdx TableOfContentsList renders from here, not meta.json. |
| apps/shadcn-table-docs/content/docs/guides/column-icons.mdx | new | D3, D33 | new | New guide: columnDef.icon in header, chips, picker, columns menu, view settings rows; no default icons shipped; custom Header still possible. |
| apps/shadcn-table-docs/content/docs/guides/filter-chips.mdx | new | D9, D5, D33 | new | New guide: chips default mode, + Filter picker, Clear filters, hidden-column chip, menu Filter item, filterChips state. |
| apps/shadcn-table-docs/content/docs/guides/sort-editor.mdx | new | D10, D33 | new | New guide: enableSortPopover, rule rows, drag reorder, Add sort/Delete sort, chip label, stacking without Shift. |
| apps/shadcn-table-docs/content/docs/guides/view-settings.mdx | new | D11, D36, D7, D33 | new | New guide: enableViewSettings rows, pins (Columns, Density default), Reset view; opens with the opt-in line for persistViewSettings, key rule, id, nonce, no-flash script. |
| apps/shadcn-table-docs/content/docs/guides/overflow-tooltip.mdx | new | D17, D33 | new | New guide: ellipsis default, tooltip only when cut off, enableCellOverflowTooltip, columnDef.overflowTooltip, ST_OverflowText for custom cells. |
| apps/shadcn-table-docs/content/docs/guides/scroll-cues.mdx | new | D22, D33 | new | New guide: pinned-edge shadow, hover chevrons, enableScrollButtons, data-overflow-start/end, localization scrollLeft/scrollRight. |
| apps/shadcn-table-docs/content/docs/guides/tint-tokens.mdx | new | D23, D33 | new | New guide: --st-stripe, --st-hover, --st-selected, --st-edge-shadow defaults, order rule, override via stTableLayoutProps.className or ancestor. |
| apps/shadcn-table-docs/content/docs/guides/column-drag-animation.mdx | new | D37, D20, D21, D33 | new | New guide (or column-ordering-dnd section): header preview slide, drop slide and highlight, reduced-motion fallback, locked overlay, limits. |
| apps/shadcn-table-docs/content/docs/guides/column-filtering.mdx | 5, 10-36, 126-148 | D9 | refactor | Intro and Display Modes section: chips is default; subheader, popover, custom selectable; add columnFilterDisplayMode to relevant options. |
| apps/shadcn-table-docs/content/docs/examples/popover-filters.mdx | 6 | D9 | refactor | Drop 'default sub-header location' wording; chips is default. |
| apps/shadcn-table-docs/examples/{radix,base,aria}/customize-filter-variants/TS.tsx | 95 | D9 | refactor | Add columnFilterDisplayMode: 'subheader' beside showColumnFilters so thead inputs still render (page checks expect them). |
| apps/shadcn-table-docs/examples/{radix,base,aria}/enable-filter-facet-values/TS.tsx | 55 | D9 | refactor | Add columnFilterDisplayMode: 'subheader'. |
| apps/shadcn-table-docs/examples/{radix,base,aria}/customize-filter-modes/TS.tsx | 64 | D9 | refactor | Add columnFilterDisplayMode: 'subheader'. |
| apps/shadcn-table-docs/examples/{radix,base,aria}/customize-filter-components/TS.tsx | 93 | D9 | refactor | Add columnFilterDisplayMode: 'subheader'. |
| apps/shadcn-table-docs/example-groups/FilteringExamples.tsx | 10-28 | D9 | refactor | Optionally add a Filter Chips tab for the new chips example; keep existing tabs. |
| apps/shadcn-table-docs/content/docs/guides/sorting.mdx | 8-40, 89-123 | D4, D5, D10 | refactor | Multi-Sorting and Sorting Removal: no header-click or Shift sort; menu Notion rule and sort editor; add enableSortPopover to options. |
| apps/shadcn-table-docs/examples/{radix,base,aria}/multi-sorting/TS.tsx | 42 | D4, D10 | refactor | isMultiSortEvent shift comment is stale once label click no longer sorts; rework example around the sort editor. |
| apps/shadcn-table-docs/content/docs/guides/column-actions.mdx | 5, 52-78 | D2, D4, D5, D21, D25 | refactor | Label and chevron open menu; new default item list and omit rules; Fixed position item; trigger prop; Justify section reflects chevron at cell end. |
| apps/shadcn-table-docs/content/docs/guides/column-ordering-dnd.mdx | 8-33, 95-103 | D20, D21, D37 | refactor | On by default; header cell is drag source; showColumnDragHandle; cancel rule; auto-scroll; locked columns; link animation guide. |
| apps/shadcn-table-docs/content/docs/guides/column-grouping.mdx | 99-106 | D20 | refactor | enableColumnDragging: false wording about 'drag handle buttons' rechecked against grip-off default. |
| apps/shadcn-table-docs/content/docs/guides/column-pinning.mdx | 22-34, 51-64 | D14, D22, D31 | refactor | Pinning on by default (enableColumnPinning: false to turn off); drop grid-no-grow advice, pinned columns do not grow; mention edge shadow. |
| apps/shadcn-table-docs/content/docs/guides/column-resizing.mdx | 46-58, 77-90 | D6, D14, D31, D5 | refactor | Resizing on by default; no auto grid-no-grow; handle look, double-click reset, Reset column size menu rule. |
| apps/shadcn-table-docs/content/docs/guides/column-size.mdx | 33-39, 71-81 | D31 | refactor | Layout modes list: grid is default, display and pinned columns grow: false, no resize auto-switch. |
| apps/shadcn-table-docs/content/docs/guides/display-columns.mdx | 26 | D31, D14 | refactor | st-row-spacer only when grid-no-grow is set explicitly; note actions column last, pinned, 48 px, row numbers locked. |
| apps/shadcn-table-docs/content/docs/examples/custom-headless.mdx | 10 | D31 | refactor | Sentence says resizing gives default grid-no-grow and spacer column; false after D31. |
| apps/shadcn-table-docs/content/docs/guides/row-actions.mdx | 84-121 | D14 | refactor | positionActionsColumn default 'last', pinned end, 48 px, dots icon, hidden header label; how to restore first. |
| apps/shadcn-table-docs/content/docs/guides/pagination.mdx | 100-112 | D13 | refactor | pages is default; default mode is the alternate now; footer hairline. |
| apps/shadcn-table-docs/examples/{radix,base,aria}/alternate-pagination/TS.tsx | 13 | D13 | refactor | Switch to paginationDisplayMode: 'default' to show the alternate UI (or keep and reword); a.mjs needle follows. |
| apps/shadcn-table-docs/content/docs/guides/density-toggle.mdx | 6, 18-46 | D7, D11, D17 | refactor | Density is a view settings select pinned by default; row heights 40/48/56; compact nowrap note replaced by truncation default. |
| apps/shadcn-table-docs/content/docs/guides/column-hiding.mdx | 5, 98-100, 122-128 | D11, D25 | refactor | Columns menu opens from the pinned Columns button or settings row; menu takes trigger. |
| apps/shadcn-table-docs/content/docs/guides/toolbar-customization.mdx | 8-34, 82-110, 165-167 | D1, D8, D10, D11 | refactor | Toolbar above frame; group order and active style; new options and buttons; snippet still valid with ST_ShowHideColumnsButton but add new buttons. |
| apps/shadcn-table-docs/content/docs/guides/global-filtering.mdx | 140-142, 193-210 | D35, D8 | refactor | Toggle never disabled, clears and closes; no inline X unless showClearSearchButton; search sits left of the group. |
| apps/shadcn-table-docs/content/docs/guides/full-screen-toggle.mdx | 36-52 | D1, D28 | refactor | Replace class string with the padded fixed wrapper keeping the frame; add one-table-at-a-time and Escape sentence. |
| apps/shadcn-table-docs/content/docs/guides/sticky-header.mdx | 16-29 | D19 | refactor | Default cap 70vh via --st-sticky-max-height; virtualized forced sticky keeps clamp; set the variable instead of maxHeight. |
| apps/shadcn-table-docs/content/docs/guides/virtualization.mdx | 80-82 | D19 | refactor | Forced sticky keeps full-height clamp; mention --st-sticky-max-height override. |
| apps/shadcn-table-docs/content/docs/guides/customize-components.mdx | 212-225, 263-326 | D1, D7, D11, D22, D23 | refactor | Theme values list to --st-* tokens; layout styling for frame; stripe example vs striped setting; pinned styling vs edge shadow. |
| apps/shadcn-table-docs/content/docs/guides/customize-components.mdx | 328-340 | D15 | keep | Empty row text unchanged; optional note on muted non-italic look. |
| apps/shadcn-table-docs/content/docs/guides/customize-icons.mdx | 22-40 | D18 | refactor | List the new icon keys and the per-edition substitutes; grid-line glyphs shipped by library. |
| apps/shadcn-table-docs/content/docs/guides/localization.mdx | 28-57 | D24 | refactor | New keys optional, English only, other locales fall back; new wording keys beside old ones. |
| apps/shadcn-table-docs/content/docs/guides/state-management.mdx | 157-161 | D36 | refactor | 'Persistent state is not built in' becomes false; link persistViewSettings, keep manual pattern for sorts and filters. |
| apps/shadcn-table-docs/content/docs/guides/row-pinning.mdx | 58-66 | D7 | refactor | Row height estimates 37/53/69 to the shipped D7 values. |
| apps/shadcn-table-docs/content/docs/guides/detail-panel.mdx | 176-187 | D7 | refactor | estimateSize 37/58/73 to shipped values. |
| apps/shadcn-table-docs/examples/{radix,base,aria}/enable-row-pinning-sticky/TS.tsx | 58 | D7 | refactor | Row height literals to shipped values. |
| apps/shadcn-table-docs/examples/{radix,base,aria}/enable-row-pinning-select/TS.tsx | 65 | D7 | refactor | Row height literals to shipped values. |
| apps/shadcn-table-docs/examples/{radix,base,aria}/enable-detail-panel-virtualized/TS.tsx | 60-64 | D7 | refactor | Estimate literals to shipped values. |
| apps/shadcn-table-docs/content/docs/getting-started/usage.mdx | 162 | D20 | refactor | enableColumnOrdering: true as 'enable a feature' example is now a default; pick another option. |
| apps/shadcn-table-docs/content/docs/guides/best-practices.mdx | 191, 198, 240 | D9, D13 | refactor | showColumnFilters default and paginationDisplayMode: 'pages' in shared defaults are no-ops now; reword. |
| apps/shadcn-table-docs/content/docs/api/st-components.mdx | 104-132, 184-214 | D2, D9, D10, D11, D17, D22, D25 | refactor | Fix SortLabel/ColumnActionsButton text; add headings for ST_FilterChips, ST_ColumnPicker, ST_SortPopover, ST_ViewSettingsButton, ST_OverflowText, ST_ScrollButtons, menus with trigger. |
| apps/shadcn-table-docs/lib/prop-tables/tableOptions.ts | 263, 293-294, 314-315, 324, 508-509, 682, 878-879, 1756-1757 | D9, D10, D11, D13, D14, D17, D20, D22, D31, D35, D36 | refactor | Update defaults (pinning, resizing, ordering true; layoutMode 'grid'; positionActionsColumn 'last'); add rows for new options and missing columnFilterDisplayMode, paginationDisplayMode. |
| apps/shadcn-table-docs/lib/prop-tables/columnOptions.ts | 223, 396 | D3, D17, D21, D31 | refactor | Add icon and overflowTooltip rows; note locked meaning of enableColumnOrdering: false; grow note for display and pinned columns. |
| apps/shadcn-table-docs/lib/prop-tables/stateOptions.ts | 190-199 | D9, D11 | refactor | Add filterChips and viewSettings state rows if exposed on ST_TableState. |
| apps/shadcn-table-docs/scripts/page-checks/a.mjs | 191-215, 367-421 | D13, D33 | refactor | Update hard-coded counts: table-options 199, column-options 63, state-options 33, pagination rows 8, st-components h5 30; alternate-pagination needle. |
| apps/shadcn-table-docs/scripts/page-checks/b.mjs | 100-124, 192-246, 302-310 | D2, D6, D11, D20 | refactor | Fix selectors: 'Show/Hide columns' button, thead Move grip, thead separator, justify-between, density button; add entries for new b-range guides. |
| apps/shadcn-table-docs/scripts/page-checks/c.mjs | 116-145, 315-342 | D4, D19, D33, D35 | refactor | Recheck sort marker (no button when unsorted), search toggle, sticky; add entries for new c-range guides. |
| apps/shadcn-table-docs/scripts/page-checks/e.mjs | 44-86 | D9 | keep | Filter example thead checks stay valid only if the four examples pin subheader mode. |
| apps/shadcn-table-docs/examples/map.tsx, example-groups/map.tsx | generated | D33 | refactor | Regenerate with node scripts/example-map.mjs after adding example folders; never edit by hand. |
| apps/shadcn-table-docs/registry.json | generated | D33 | refactor | pnpm registry:items adds example-<slug>-<base> items for new examples; no existing item removed (P5). |
| apps/shadcn-table-docs/components/ui-{radix,base,aria}/ | generated | D33 | refactor | Reinstall with pnpm lib:install <base> after library specs merge (needs pnpm -w registry:build first). |
| apps/shadcn-table-docs/scripts/check-pages.mjs | 12-24, 57-66 | D33 | keep | Gate: node scripts/check-pages.mjs --base <radix/base/aria> --url http://localhost:<5340-5360>, dev server PORT=<port> pnpm dev; no edit needed. |

## baseDiffs
- Docs examples: examples/base and examples/aria are byte-identical to radix except files in packages/shadcn-table/scripts/registry/examples-{base,aria}-diff.json (advanced, custom-headless, custom-top-toolbar, editing-crud-*, enable-column-grouping, export-to-*, react-query, server-side-data).
- aria example copies use onPress/isDisabled instead of onClick/disabled (custom-top-toolbar/TS.tsx:50-74); any new example with buttons needs an aria variant and an examples-aria-diff.json entry.
- D25 trigger shape differs per base (radix asChild, base render, aria equivalent); guides have no per-base Tabs today, so a trigger snippet must be base-neutral or add per-base tabs.
- Prop tables and docs chrome import only components/ui-radix (table-options-table.tsx:4-7); base and aria copies render only inside examples.
- components/ui-base lacks command.tsx and tabs.tsx that ui-radix has; lib:install per base adds what each library copy needs.

## stories
- apps/shadcn-table-docs/scripts/page-checks/a.mjs:176-228 (usage, pagination), 363-421 (api pages, hard-coded counts)
- apps/shadcn-table-docs/scripts/page-checks/b.mjs:100-124 column-actions, 125-166 column-filtering, 192-203 column-hiding, 205-214 column-ordering-dnd, 216-246 pinning and resizing, 255-292 customize-*, 302-310 density
- apps/shadcn-table-docs/scripts/page-checks/c.mjs:116-145 full-screen and global-filtering, 146 guides index, 150-195 localization, 240-258 row-actions, 315-342 sorting, state, sticky, 349-372 toolbar
- apps/shadcn-table-docs/scripts/page-checks/d.mjs:105-131 column-ordering and column-pinning example pages
- apps/shadcn-table-docs/scripts/page-checks/e.mjs:44-86 filter example pages, 185-194 sticky-header
- apps/shadcn-table-docs/scripts/page-checks/_helpers.mjs:13-27 names() reads td:nth-child(3), 539-592 demoLoop on home
- apps/shadcn-table-docs/components/dev-home/v12/signal-demo.tsx:103-121 and signal-table.tsx:145-175 (home demo, Filtering step uses showColumnFilters)

## risks
- Four filter examples set showColumnFilters: true with no mode; under chips default thead inputs vanish and b.mjs:131-166 plus e.mjs:44-86 go red unless they pin columnFilterDisplayMode: 'subheader' in all 3 bases.
- Home demo Filtering step (signal-demo.tsx:103-121) relies on showColumnFilters showing subheader inputs; chips default hides them; demoLoop on '/' may still pass but shows nothing; pin mode in signal-table.tsx.
- b.mjs:205-214 expects thead button[aria-label="Move"]; D20 turns the grip off by default, so the check goes red; d.mjs:111 already accepts thead [draggable="true"].
- b.mjs:232-235 expects thead [data-slot="separator"]; D6 drops the short separator; red unless the selector follows the new handle.
- b.mjs:196-201 opens a button labelled 'Show/Hide columns'; D11 replaces it with a pinned Columns view button whose label may differ.
- c.mjs:321-326 multi-sorting marker needs th [aria-label*=Sort]; D2 renders nothing when unsorted and no button when sorted; example has initial sorting, so the arrow needs an aria-label or the check changes.
- b.mjs:243-245 checks Persian columnActions label on localization-i18n-fa; if the chevron trigger reads a new English-only key (D24), the check goes red.
- Hard-coded counts in a.mjs: 199 table options, 63 column, 33 state, 8 pagination rows, 30 st-components h5; every added row or heading must update them.
- lib/prop-tables/*.ts say 'Generated by scripts/sync-mrt-docs.mjs... Do not edit' but that script is not in the repo; hand edits are the only path.
- tableOptions.ts rows are typed keyof ST_TableOptions from components/ui-radix; new option rows fail types:check until ui-radix is reinstalled from the merged library.
- columnFilterDisplayMode and paginationDisplayMode are missing from tableOptions.ts (declared in features/stConfigFeature.ts:76,380); pagination.mdx onlyOptions lists the latter but it never renders.
- Prop tables themselves render ShadcnTable (table-options-table.tsx:82-130): new defaults (view settings, sort popover, chips, pinned actions, ordering) change their chrome; enableTopToolbar={!onlyOptions} limits it to api pages.
- Prop-table row names read td:nth-child(3) (_helpers.mjs:14); any new default display column before the name column (row numbers, expand) shifts the index.
- Existing persistent-state example (sessionStorage, persistent-state/TS.tsx:57-61) overlaps D36; state-management.mdx:157 says persistence is not built in.
- customize-table-styles example stripes rows by tbody className; b.mjs:262-265 asserts that; overlaps D11 striped and D23 --st-stripe; keep or the check changes.
- Example slugs feed registry items (apps registry.json, pnpm registry:items); renaming or removing a slug removes a public item (P5). Add slugs, never rename.
- check:bases fails if a docs example edit misses a base or a new example file exists in one base only.
- check-pages default url 5320 is the owner's server (P5): run own PORT=<5340-5360> pnpm dev with --url; one run per --base.
- Docs merge after library workstreams (D33); defaults, labels and row heights must be read from shipped code, not decisions, or text drifts.
- Duplicate D4, D11, D28 headings in decisions.md; D28 first copy asks for one full-screen sentence in the first docs spec, second says no work.

## notes
- New guide registration needs three places: guides/meta.json (sidebar), lib/routes.ts Guides items (index page TOC), page-checks cluster entry (check-pages.mjs:7-10 asks for one per page with examples or prop tables).
- Example wiring: examples/<base>/<slug>/TS.tsx in all 3 bases, then node scripts/example-map.mjs (writes examples/map.tsx and example-groups/map.tsx), lib/example-variants.mjs runs on predev/build; MDX uses <PascalSlugExample /> without import.
- Example page: content/docs/examples/<slug>.mdx plus examples/meta.json and routes.ts examples items; frontmatter title feeds the registry item title.
- check-pages: node apps/shadcn-table-docs/scripts/check-pages.mjs --base radix|base|aria --url http://localhost:<port> [a-e] [/docs/path]; Playwright from packages/shadcn-table/node_modules; default base is Base UI.
- Docs setup order: pnpm -w registry:build, pnpm lib:install radix|base|aria, node scripts/example-map.mjs, pnpm --filter shadcn-table-docs types:check and lint.
- No guide mentions anchorEl, ST_ToggleGlobalFilterButton, renderEmptyRowsFallback beyond customize-components:336, or showResetColumnSizeMenuItem.
- skills/shadcn-table/SKILL.md and llms routes contain no changed defaults; no edit needed.
- Pre-existing nit: state-management.mdx:27 uses density 'xs' (not a valid value); fix while rewriting.
- Demo strings for new guides: view-settings.tsx:208-214 row labels, aria-label 'View settings' :439; sort-popover.tsx:36-37,114,185; filter-bar.tsx:176,236.
