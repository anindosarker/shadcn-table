# v0.9.x findings

## Round 1: discussion, 2026-11-07

### F1 Select filter clear button overlaps the chevron

- Once a select filter has a value, the clear x (`absolute inset-y-0 inset-e-0`, `ST_FilterTextField.tsx:335-347` radix; aria `:369`, base `:340`) sits on top of the `SelectTrigger` chevron. The trigger's `pe-9` never applies: the shadcn `SelectTrigger` base has `pr-2` (`select.tsx:46`), tailwind-merge keeps both classes, and Tailwind 4 emits `padding-right` after `padding-inline-end`, so `pr-2` wins. Same in chips, subheader and popover modes, all three registries. Owner's screenshot `v0.8.x/reference/image/bugs/1793953068792.png`. Resolved by D1.

### F2 The filtering stories show the old filter UI, not the current format

- Owner, 2026-11-08, on the deployed Storybook (`https://storybook.shadcn-table.com/base/`): the filtering stories are not updated to the new format. Stories looked at: `Features/Filtering Examples` (`FilteringChangeModeEnabled`, `FilteringChangeModeEnabledFaceted`, `SubheaderRangeFieldsNarrow`, `FilterFnAndFilterVariants`, `packages/shadcn-table/stories/features/Filtering.stories.tsx:174-702`) and `Features/Filter Chips Examples` (`FilterModePickerTableLevel`, `FilterChips.stories.tsx:300`). Major. Screenshot 2026-11-08 of `FilteringChangeModeEnabled` (Base build): the subheader filter row with one input per column and a "Filter Mode: Fuzzy" helper line under each, no chips; the docs filtering examples moved to chips in v0.8.x (D51) while the stories did not.

### F3 The filtering story's UI jumps

- Owner, 2026-11-08, on `https://storybook.shadcn-table.com/base/?path=/story/features-filtering-examples--filtering-change-mode-enabled`: type a value in one subheader filter field, then close it (blur): the first filter field jumps (layout shift in the filter row). To be reproduced with a play before it is planned (v0.8.x P10, P11).

### F4 Stories carry no explainer

- Owner, 2026-11-08, screenshot of `Features/Filtering Examples/Column Filtering Disabled` (Base build): every story shows the same three-line banner (docs link, base links, source link) and nothing about what the story demonstrates or what to try; a visitor cannot tell what "Column Filtering Disabled" shows. Holds for every story (594 stories, one shared banner from `.storybook/preview.tsx`). To be discussed with the docs restructuring items, not on its own.

### F5 The pagination mode named `default` is not the default

- `paginationDisplayMode` defaults to `pages` (v0.8.x D13, `useST_TableOptions.ts:90`), but the mode value `'default'` names the compact range-and-arrows footer, so the guide (`/docs/guides/pagination#pagination-display-modes`) has to say "by default ('pages') ... set to 'default' for the compact UI". Owner, 2026-11-08: the page reads as wrong. The name comes from Material React Table, where `default` is the default. Renaming the value is a public option change (v0.8.x P7), so the fix is decided with item 6.
