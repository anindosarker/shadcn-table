# 01: aria tree, tracker

Deviations and gate results. Plan: [01-aria-tree.md](01-aria-tree.md). Rulings: [decisions.md](decisions.md).

## Phase 00

### Versions and style

- shadcn CLI `4.23.0` (`npx shadcn@4.23.0 init -t vite -b aria -p nova -n aria-init --no-monorepo -y`, then `add` of the 27 parts).
- styleName `aria-nova` (what init wrote into `components.json`; the item JSONs live at `ui.shadcn.com/r/styles/aria-nova/<part>.json`).
- `react-aria-components` `^1.22.1` (installed `1.22.1`, `react-aria` `3.53.1` under it). The aria item JSONs declare only `cn` as a dependency; `react-aria-components` comes from the style. Added to `packages/shadcn-table/package.json` at `^1.22.1` and to `registry/aria/registry.ts` unpinned, mirroring `@base-ui/react` in the base item.

### Parts

alert, badge, button, checkbox, collapsible, combobox, command, dialog, dropdown-menu, field, input-group, input, label, native-select, pagination, popover, progress, radio-group, select, separator, skeleton, slider, spinner, switch, table, textarea, tooltip: all 27 the radix tree has under `components/ui/*.tsx` exist in the aria set. missingParts: none.

Taken as installed through the same transforms as `add-part.mjs`: `import { cn } from "cn"` rewritten to `@/lib/utils`, repo prettier. `lib/utils.ts` is radix's (clsx plus tailwind-merge, the helper every base ships), not the scratch app's `export { cn } from "cn"`. `index.css` is radix's: the aria-nova stylesheet has the same `@import`/`@custom-variant`/`@layer` structure (the scratch app only adds the Geist font import). `components.json`: radix's with `"style": "aria-nova"`.

### Owner attention (halt items, part files)

- `components/ui/label.tsx` fails `tsc:aria`: `TS6133: 'React' is declared but its value is never read` (unused `import * as React from 'react'` as shipped by aria-nova, rejected by `noUnusedLocals`). Not edited (1.6.2: a needed part change is a halt item). `tsc:aria` cannot go green without a ruling: drop the import in the part (recorded fork) or relax the rule for parts.
- `components/ui/checkbox.tsx` is not forked (`forkedUi: []` in `registry/aria/registry.ts`). The aria checkbox renders `CheckIcon` for `isIndeterminate` and has no fill for that state (only `data-selected` paints `bg-primary`); radix and base fork the checkbox to a minus icon on a filled box. Matching that needs the same kind of recorded fork.

### aria-diff.json

37 files (`scripts/registry/aria-diff.json`). Base diff files that compile unchanged on aria: `shared/utils/style.utils.ts` only, and it stays in the list for its runtime shape. Extra files aria needs beyond `base-diff.json`: the 13 button files below, `components/head/ST_TableHeadCellColumnActionsButton.tsx`, `types.ts`.

Red now but kept shared (only error is the `ST_TooltipProps` cascade from `ST_Tooltip.tsx`, `missing delayDuration, disableHoverableContent`; green once `ST_Tooltip` keeps its prop type): `components/buttons/ST_ColumnPinningButtons.tsx`, `components/head/ST_TableHeadCellSortLabel.tsx`, `hooks/display-columns/getST_RowExpandColumnDef.tsx`. `tsc:aria` today is red in the 37 listed files, these 3, and `components/ui/label.tsx`.

Hand run of `check-bases.mjs` with the aria pair (radix against aria, `aria-diff.json`): `check-bases: 142 library files in both trees, 37 allowed to differ` (the aria library is still the radix copy). `pnpm check:bases` (radix against base): unchanged, 23 allowed to differ.

| File | Reason it differs |
| --- | --- |
| `ST_Tooltip.tsx` | no `TooltipContent`/`TooltipProvider`; aria `Tooltip` is the content, `TooltipTrigger` wraps trigger and tooltip; no `asChild`, `delayDuration`, `disableHoverableContent` (`delay` on the trigger) |
| `components/body/ST_TableDetailPanel.tsx` | Collapsible is RAC `Disclosure`: `isExpanded`, not `open` |
| `components/buttons/ST_CopyButton.tsx` | aria `Button` `onClick` takes `MouseEvent<FocusableElement>` (prefer `onPress`) |
| `components/buttons/ST_EditActionButtons.tsx` | `disabled` is `isDisabled` on aria `Button` |
| `components/buttons/ST_ExpandAllButton.tsx` | `MouseEventHandler<HTMLButtonElement>` not assignable to aria `Button` `onClick` |
| `components/buttons/ST_ExpandButton.tsx` | same handler type |
| `components/buttons/ST_GrabHandleButton.tsx` | handler type; drag props spread onto aria `Button` |
| `components/buttons/ST_RowPinButton.tsx` | `onClick`, `onFocus`, `onBlur` handler types (`FocusEvent<Element>`) |
| `components/buttons/ST_ShowHideColumnsButton.tsx` | handler type |
| `components/buttons/ST_ToggleDensePaddingButton.tsx` | handler type |
| `components/buttons/ST_ToggleFiltersButton.tsx` | handler type |
| `components/buttons/ST_ToggleFullScreenButton.tsx` | `onClick`, `onFocus`, `onBlur` handler types |
| `components/buttons/ST_ToggleGlobalFilterButton.tsx` | handler type |
| `components/buttons/ST_ToggleRowActionMenuButton.tsx` | handler type on both buttons |
| `components/head/ST_TableHeadCellColumnActionsButton.tsx` | handler type |
| `components/head/ST_TableHeadCellFilterContainer.tsx` | Collapsible is `Disclosure`: `isExpanded` |
| `components/head/ST_TableHeadCellFilterLabel.tsx` | no `PopoverAnchor`/`PopoverContent`: aria `Popover` is the content, `PopoverTrigger` is a `DialogTrigger`, positioning through `triggerRef`; `isOpen`/`onOpenChange` |
| `components/inputs/ST_EditCellTextField.tsx` | aria `Select` is RAC `Select`: `selectedKey`/`onSelectionChange`, `isOpen`; `SelectValue` takes no `placeholder`; `TextField` shapes |
| `components/inputs/ST_FilterCheckbox.tsx` | `isSelected`, `onChange(isSelected)`, `isIndeterminate`; no `title`, no `onCheckedChange` |
| `components/inputs/ST_FilterRangeSlider.tsx` | RAC `Slider` props: `minValue`/`maxValue`, `value`/`onChange`/`onChangeEnd` with number or number arrays, no `ref` in props |
| `components/inputs/ST_FilterTextField.tsx` | RAC `ComboBox` (`inputValue`/`onInputChange`, object items), RAC `Select`, `Group` for the input group, aria `Button` handlers, `Popover` without `position` |
| `components/inputs/ST_GlobalFilterTextField.tsx` | Collapsible `isExpanded`; aria `Button` handlers and `isDisabled` |
| `components/inputs/ST_SelectCheckbox.tsx` | checkbox and radio props (`isSelected`, `onChange`); no `checked`, `title` |
| `components/menus/ST_ActionMenuItem.tsx` | `DropdownMenuItem` is RAC `MenuItem`: `onAction`, `isDisabled`; `onClick` handler type |
| `components/menus/ST_CellActionMenu.tsx` | no `DropdownMenuContent`: `DropdownMenuTrigger` (`MenuTrigger`) wraps trigger and `DropdownMenu` (`Popover` plus `Menu`) |
| `components/menus/ST_ColumnActionMenu.tsx` | same menu shape; submenus through `DropdownMenuSub` (`SubmenuTrigger`); item `disabled` is `isDisabled` |
| `components/menus/ST_FilterOptionMenu.tsx` | same menu shape |
| `components/menus/ST_RowActionMenu.tsx` | same menu shape; no `asChild` on the trigger; props typed from `DropdownMenuContent` |
| `components/menus/ST_ShowHideColumnsMenu.tsx` | same menu shape |
| `components/menus/ST_ShowHideColumnsMenuItems.tsx` | no `DropdownMenuCheckboxItem`; RAC `Switch` `isSelected`/`onChange`; keep-open through the menu's selection model instead of `onSelect` plus `preventDefault` |
| `components/modals/ST_EditRowModal.tsx` | no `DialogContent`: aria `Dialog` is `ModalOverlay` plus `Modal` plus `Dialog`, `isOpen`/`onOpenChange` |
| `components/toolbar/ST_LinearProgressBar.tsx` | Collapsible `isExpanded`; aria `Progress` exports `ProgressTrack`/`ProgressIndicator`, indeterminate through `isIndeterminate` |
| `components/toolbar/ST_TablePagination.tsx` | RAC `Select` (`selectedKey`/`onSelectionChange`, `isDisabled`); aria `Button` `isDisabled` and handlers |
| `components/toolbar/ST_ToolbarAlertBanner.tsx` | `onClick` event type into the select-all handler; no `asChild`; Collapsible `isExpanded` |
| `hooks/stTableHook.tsx` | no `TooltipProvider` in the aria tooltip part (RAC has no provider; shared delay lives on `TooltipTrigger`) |
| `shared/utils/style.utils.ts` | compiles, but `st-collapsible-*` keyframes read `--radix-collapsible-content-width`; RAC `DisclosurePanel` sets `--disclosure-panel-height`/`--disclosure-panel-width`; `getCommonTooltipProps` returns Radix tooltip props |
| `types.ts` | imports `DialogContent` (absent); `CheckboxProps`, `SliderProps`, radio and dialog prop types derive from the aria parts, `ButtonProps` (`ComponentPropsWithRef<'button'>`) no longer matches the `Button` part |

### What the aria parts do differently (port notes)

- Tooltip: `TooltipTrigger` wraps the trigger and the `Tooltip`; the trigger child is wrapped in RAC `Focusable`; delay is `delay`/`closeDelay` on `TooltipTrigger`; no provider.
- Menus: `DropdownMenuTrigger` is `MenuTrigger` (wraps trigger and menu); `DropdownMenu` is `Popover` plus `Menu` (the content); items are RAC `MenuItem` with `onAction`, `isDisabled`, and a check mark from `selectionMode` on the menu (no checkbox or radio item exports); submenus are `DropdownMenuSub` (`SubmenuTrigger`) with `DropdownMenuSubTrigger` and `DropdownMenuSubContent`. No `DropdownMenuPortal`.
- Dialog: `DialogTrigger` (RAC) around trigger and `Dialog`; `Dialog` renders `ModalOverlay` plus `Modal` plus `Dialog` with a close button; controlled through `isOpen`/`onOpenChange`; `DialogTitle` is RAC `Heading`.
- Popover: `Popover` is the content (RAC `Popover`); `PopoverTrigger` is RAC `DialogTrigger`; no anchor part (`triggerRef` on `Popover`).
- Button: RAC `Button`: `onPress`, `isDisabled`, `onClick` typed `MouseEvent<FocusableElement>`, no `asChild`; `LinkButton` for links.
- Checkbox: `isSelected`, `onChange(isSelected)`, `isIndeterminate`; state in `data-selected`/`data-indeterminate`, not `data-state`.
- Switch: `isSelected`, `onChange(isSelected)`.
- Slider: RAC `Slider` with `minValue`/`maxValue`, `value` a number or number array, `onChange`/`onChangeEnd`.
- Select: RAC `Select` (`selectedKey`, `onSelectionChange`, `isOpen`, `onOpenChange`); exports `SelectPopover`, `SelectList`, `SelectInput`, `SelectEmpty`; no scroll buttons.
- Combobox: RAC `ComboBox` exported as `Combobox`, plus `ComboboxChipList`; items are objects with keys.
- Collapsible: RAC `Disclosure` (`isExpanded`, `onExpandedChange`), `DisclosurePanel` sets `--disclosure-panel-height`/`--disclosure-panel-width`.
- Progress: RAC `ProgressBar` with `ProgressTrack`, `ProgressIndicator`, `ProgressLabel`, `ProgressValue`.

### Gate helpers

- `tsconfig.aria.json` (copy of `tsconfig.baseui.json` on `registry/aria`), scripts `tsc:aria`, `test:aria`, `storybook:aria` (6008), `storybook:build:aria`; `vite.config.ts` and `.storybook/main.ts` take `ST_BASE` from the list `radix`, `base`, `aria` (radix otherwise).
- Not touched in this part: `tsconfig.json` references (adding `tsconfig.aria.json` would turn `tsc -b` red until the port), `.storybook/themes.ts` and `edition-tool.ts` (still two-way, label aria as Radix UI; part 02 or 03), `check-bases.mjs`, `add-part.mjs`, `build.mjs` (part 02).
- `pnpm tsc:radix`, `pnpm tsc:baseui`, stories tsc, `pnpm check:bases`: pass.

## Phase 01, modals-toolbar-rest

Branch `v0.5/rest`. `tsc:aria` clean in every file below (left: the `ST_TooltipProps` cascade until `v0.5/09` merges, and `label.tsx`). With `v0.5/08` and `v0.5/09` merged locally: `tsc:aria` only `label.tsx`; `ST_BASE=aria vitest run` 439 of 446, the 7 failures in files outside this cluster (below).

- `types.ts`: `ButtonProps` is native button props with `isDisabled` for `disabled`, a string `value`, and `onClick`/`onFocus`/`onBlur` typed on `Element`, so it spreads onto the aria `Button` and still onto the plain `<button>` of the shared `ST_TableHeadCellSortLabel`; `SelectProps` builds on it unchanged. `DialogProps` is `Partial<ComponentProps<typeof Dialog>>` (aria `Dialog` is overlay, modal and dialog in one, `children` required); `DialogContent` import dropped.
- `components/buttons/ST_CopyButton.tsx`: `title={undefined}` dropped (RAC `Button` has no `title`, and drops it).
- `components/buttons/ST_EditActionButtons.tsx`: `disabled` to `isDisabled` on both save buttons.
- `components/buttons/ST_ExpandAllButton.tsx`: `isDisabled`; `title={undefined}` dropped.
- `components/buttons/ST_ExpandButton.tsx`: `isDisabled`; handler event `MouseEvent`; `title={undefined}` dropped.
- `components/buttons/ST_GrabHandleButton.tsx`: RAC `Button` drops `draggable`, `onDragStart`, `onDragEnd`; they go on the `<button>` through the `Button` `render` prop (RAC's own mechanism; `usePress` skips `preventDefault` on a draggable target). `title={undefined}` dropped.
- `components/buttons/ST_RowPinButton.tsx`: handler event `MouseEvent`.
- `components/buttons/ST_ShowHideColumnsButton.tsx`, `ST_ToggleRowActionMenuButton.tsx`, `components/head/ST_TableHeadCellColumnActionsButton.tsx`: handler event `MouseEvent`; `currentTarget` (typed `Element`) narrowed with `instanceof HTMLElement` before `setAnchorEl`; `title={undefined}` dropped. Menu props (`anchorEl`, `setAnchorEl`, `handleEdit`) match `v0.5/08`.
- `components/buttons/ST_ToggleDensePaddingButton.tsx`, `ST_ToggleFiltersButton.tsx`, `ST_ToggleFullScreenButton.tsx`: `title={undefined}` dropped.
- `components/buttons/ST_ToggleGlobalFilterButton.tsx`: `isDisabled`; `title={undefined}` dropped.
- `components/modals/ST_EditRowModal.tsx`: one aria `Dialog` (no `DialogContent`), `isOpen`, the content props and class on it; `aria-describedby={undefined}` dropped.
- `components/toolbar/ST_LinearProgressBar.tsx`: `Collapsible` `isExpanded`; `Progress` `isIndeterminate` plus `value`; the bar renders only while expanded (RAC keeps a collapsed panel's children mounted, Radix unmounts them); `st-collapsible-*` keyframes as in base.
- `components/toolbar/ST_TablePagination.tsx`: RAC `Select` `isDisabled`, `selectedKey`, `onSelectionChange` (null skipped), `SelectItem` `id`; page buttons `isDisabled`.
- `components/toolbar/ST_ToolbarAlertBanner.tsx`: `isExpanded`; Alert renders only while expanded; grouping chip through the aria `Badge` `render` function (chip `onClick` composed after the toggle, as Slot did); the clear-selection event cast to `MouseEvent<HTMLButtonElement>` for `getST_SelectAllHandler` (RAC types it on `FocusableElement`); keyframes as in base.
- `components/body/ST_TableDetailPanel.tsx`: `isExpanded`; the detail panel renders only while expanded (the DetailPanel plays count it); keyframes as in base.
- `hooks/stTableHook.tsx`: no `TooltipProvider` (RAC has none).
- `shared/utils/style.utils.ts`: `stCollapsibleKeyframes` gains the height pair (as in base) and both pairs read `--disclosure-panel-height`/`--disclosure-panel-width`; `v0.5/09`'s `ST_TableHeadCellFilterContainer` uses the height pair. `getCommonTooltipProps` unchanged: `v0.5/09` keeps `delayDuration`/`disableHoverableContent` on `ST_TooltipProps`.

Selector: the panel marks state only through `aria-hidden`, so the classes are `aria-[hidden=false]:animate-[st-collapsible-down…] aria-hidden:animate-[st-collapsible-up…]` (same as `v0.5/09`). Close is not animated: the content unmounts with the collapse, and RAC drives the variable to `0px` before the up keyframe could run.

Check-bases by hand (script copy with the aria pair): `142 library files in both trees, 37 allowed to differ`; every file above is listed in `aria-diff.json`. `pnpm check:bases`: pass. `pnpm lint`: pass.

Extra checks (throwaway story, not committed, both editions pass): grab handles are `<button draggable="true">` and `dragstart` marks the dragged header; grouping chip removes the grouping and the banner closes; clear-selection; rows-per-page select changes the page size and next page disables at the end; density, full screen, expand all (detail panels mount and unmount), row pin, search, filters, show/hide columns menu.

Failures outside this cluster on the merged tree (owner attention for the lead):
- `Filtering > Filter Fn And Filter Variants Faceted`: RAC collection `Duplicate key "Dejon"` (faceted options, `ST_FilterTextField`).
- `RowPinningOnSelect > Select All Page Mode`, `Select All All Mode`, `RenderCounts > Profiled Thousand Rows`, `External Atoms Density And Selection`: no `aria-checked` on the checkbox (RAC checkbox state is on the hidden input).
- `RowPinning > Row Pinning Select Sticky Mode`: hit test on the select-all checkbox (RAC's input is visually hidden).
- `TableProvider > Portals Read Context`: the play presses Escape, then hovers "Toggle density"; RAC `TooltipTrigger` opens on hover only when the interaction modality is pointer, so no tooltip.
- Dev warning `<Focusable> child must have an interactive ARIA role.`: the `<span>` wrappers around disabled-capable buttons inside `ST_Tooltip` (expand, expand all, pagination; kept so the tooltip still shows over a disabled button, as in radix).
