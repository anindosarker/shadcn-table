# v0.9.x findings

## Round 1: discussion, 2026-11-07

### F1 Select filter clear button overlaps the chevron

- Once a select filter has a value, the clear x (`absolute inset-y-0 inset-e-0`, `ST_FilterTextField.tsx:335-347` radix; aria `:369`, base `:340`) sits on top of the `SelectTrigger` chevron. The trigger's `pe-9` never applies: the shadcn `SelectTrigger` base has `pr-2` (`select.tsx:46`), tailwind-merge keeps both classes, and Tailwind 4 emits `padding-right` after `padding-inline-end`, so `pr-2` wins. Same in chips, subheader and popover modes, all three registries. Owner's screenshot `v0.8.x/reference/image/bugs/1793953068792.png`. Resolved by D1.

### F2 The filtering stories show the old filter UI, not the current format

- Owner, 2026-11-08, on the deployed Storybook (`https://storybook.shadcn-table.com/base/`): the filtering stories are not updated to the new format. Stories looked at: `Features/Filtering Examples` (`FilteringChangeModeEnabled`, `FilteringChangeModeEnabledFaceted`, `SubheaderRangeFieldsNarrow`, `FilterFnAndFilterVariants`, `packages/shadcn-table/stories/features/Filtering.stories.tsx:174-702`) and `Features/Filter Chips Examples` (`FilterModePickerTableLevel`, `FilterChips.stories.tsx:300`). Major. Screenshot 2026-11-08 of `FilteringChangeModeEnabled` (Base build): the subheader filter row with one input per column and a "Filter Mode: Fuzzy" helper line under each, no chips; the docs filtering examples moved to chips in v0.8.x (D51) while the stories did not.

### F3 The filtering story's UI jumps

- Owner, 2026-11-08, on `https://storybook.shadcn-table.com/base/?path=/story/features-filtering-examples--filtering-change-mode-enabled`: type a value in one subheader filter field, then close it (blur): the first filter field jumps (layout shift in the filter row). To be reproduced with a play before it is planned (v0.8.x P10, P11).
- Resolved 2026-11-08: the jump is the filter mode menu's exit animation. `useST_MenuAnchor.ts` stored `anchorEl?.getBoundingClientRect()` on close, undefined once the anchor cleared, so the invisible trigger span moved to (0,0) and the Base UI and Radix positioners followed it while the menu faded; the hook now keeps the last measured box (three bases). Play `FilterModeMenuClosesInPlace`, red on base and radix before, green after; merged as a fix from the lead at the merge commit after `546bcabd`.

### F4 Stories carry no explainer

- Owner, 2026-11-08, screenshot of `Features/Filtering Examples/Column Filtering Disabled` (Base build): every story shows the same three-line banner (docs link, base links, source link) and nothing about what the story demonstrates or what to try; a visitor cannot tell what "Column Filtering Disabled" shows. Holds for every story (594 stories, one shared banner from `.storybook/preview.tsx`). To be discussed with the docs restructuring items, not on its own.

### F5 The pagination mode named `default` is not the default

- `paginationDisplayMode` defaults to `pages` (v0.8.x D13, `useST_TableOptions.ts:90`), but the mode value `'default'` names the compact range-and-arrows footer, so the guide (`/docs/guides/pagination#pagination-display-modes`) has to say "by default ('pages') ... set to 'default' for the compact UI". Owner, 2026-11-08: the page reads as wrong. The name comes from Material React Table, where `default` is the default. Renaming the value is a public option change (v0.8.x P7), so the fix is decided with item 6.

### F6 The deployed Storybook runs the plays and shows their end state

- Owner, 2026-11-08, `https://storybook.shadcn-table.com/base/?path=/story/features-pagination-examples--pagination-enabled-default-more-data`: the story opens with the global filter already set to "42459 Eda Springs" and one row left, because its play function runs on load in the static build too. A visitor takes the filtered end state for the example (D59 requires a play per story, so most stories end in some changed state). The static builds under `/base/`, `/radix/` and `/aria/` should render the stories without running the plays (the plays keep running in vitest and in local dev), or the play should restore the initial state; the mechanism is decided with the Storybook items.

### F7 "Default" names the compact pagination across stories and docs

- Owner, 2026-11-08, `Features/Pagination Examples/Pagination Enabled Default More Data` (Base build): the story is titled "Default" and shows the compact footer (`Rows per page`, `1-10 of 551`, four arrows), which is not the default since v0.8.x D13 (`pages`). The same wording runs through the pagination stories (`Pagination Enabled Default`, `... Big Data`, `... No Rows Per Page` and more), the guide, the API page and the examples. Fixing it is bigger than F5: one audit of every story title, docs page and example that says "default" for `paginationDisplayMode: 'default'`, with the rename decided separately from item 6 (the range span). Decided in its own item.

### F8 Two storybook plays time out under machine load and are not on the known-flake list

- `stories/features/ClickToCopy.stories.tsx` "Click Copies Value" (base and radix) and `stories/features/RowOrdering.stories.tsx` "Drag Reorders Rows" (aria, 90 s timeout) failed once each in the E1 verifier runs at load average about 16 and passed on rerun and alone; neither is in the P5 known-flake list, so a loaded run reads them as red.

### F9 Two doc comments name files spec 04 deleted or misstate their list

- `apps/shadcn-table-docs/components/theme-demo/demo-themes.ts:42` still names `lib/theme-presets.ts` and `themes/*.css`, deleted by spec 04; `apps/shadcn-table-docs/lib/install.mjs:52` says `EXTRA_PARTS` holds "parts the examples import", but `sheet` is imported by the theme panel, not by an example.

### F10 The static Storybook test folder matches the build-output ignore line

- `.gitignore`: the line `storybook-static` also matches `test/storybook-static/`, so spec 06 added its two files with `git add -f`; git tracks them now, but a new file in that folder is ignored unless a `!test/storybook-static/` line follows.
