# v0.9.x findings

## Round 1: discussion, 2026-11-07

### F1 Select filter clear button overlaps the chevron

- Once a select filter has a value, the clear x (`absolute inset-y-0 inset-e-0`, `ST_FilterTextField.tsx:335-347` radix; aria `:369`, base `:340`) sits on top of the `SelectTrigger` chevron. The trigger's `pe-9` never applies: the shadcn `SelectTrigger` base has `pr-2` (`select.tsx:46`), tailwind-merge keeps both classes, and Tailwind 4 emits `padding-right` after `padding-inline-end`, so `pr-2` wins. Same in chips, subheader and popover modes, all three registries. Owner's screenshot `v0.8.x/reference/image/bugs/1793953068792.png`. Resolved by D1.

### F2 The filtering stories show the old filter UI, not the current format

- Owner, 2026-11-08, on the deployed Storybook (`https://storybook.shadcn-table.com/base/`): the filtering stories are not updated to the new format. Stories looked at: `Features/Filtering Examples` (`FilteringChangeModeEnabled`, `FilteringChangeModeEnabledFaceted`, `SubheaderRangeFieldsNarrow`, `FilterFnAndFilterVariants`, `packages/shadcn-table/stories/features/Filtering.stories.tsx:174-702`) and `Features/Filter Chips Examples` (`FilterModePickerTableLevel`, `FilterChips.stories.tsx:300`). Major. The exact elements that differ from the docs examples are to be listed when the item is discussed; the docs filtering examples moved to chips in v0.8.x (D51) while the stories did not.
