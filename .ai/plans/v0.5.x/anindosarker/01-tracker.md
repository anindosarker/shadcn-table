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

## Phase 01, inputs-tooltip

Worktree `09`, branch `v0.5/09`.

- `ST_Tooltip.tsx`: `TooltipTrigger` wraps the child and `Tooltip` (the content, `placement` from `side`); `isOpen` from `open`, `delay` from `delayDuration`, `closeDelay={0}` for `disableHoverableContent`; `ST_TooltipProps` keeps `delayDuration`/`disableHoverableContent` as own props (the 3 cascade files compile); the trigger node for the aria-label effect comes from a stable merged ref on the cloned child (`assignRef`), as TooltipTrigger takes no ref.
- `components/head/ST_TableHeadCellFilterContainer.tsx`: `isExpanded`; hoisted `st-collapsible` style and `aria-[hidden=false]`/`aria-hidden` animate classes with `st-collapsible-down`/`-up` (DisclosurePanel has no state data attribute, only `aria-hidden`).
- `components/head/ST_TableHeadCellFilterLabel.tsx`: aria `Popover` as content with `isOpen`, `onOpenChange`, `placement="top"`, `triggerRef={{ current: anchorEl }}`; anchor state `FocusableElement`; `onKeyDown` (Enter closes) on a `contents` div inside, as Popover takes no onKeyDown.
- `components/inputs/ST_EditCellTextField.tsx`: RAC `Select` with `selectedKey={value || null}`, `onSelectionChange`, `isDisabled`, `placeholder` ('' in form modes, since RAC shows its own text otherwise), `aria-label`; `SelectItem id`; repeated option values offered once.
- `components/inputs/ST_FilterCheckbox.tsx`: `isSelected`, `isIndeterminate`, `onChange(isSelected)`; indeterminate classes on `data-indeterminate`; no `title` (not a RAC checkbox prop).
- `components/inputs/ST_FilterRangeSlider.tsx`: `minValue`/`maxValue` (read from the props too), `onChange`/`onChangeEnd` through `toArray`; ref and `onKeyDown` on the wrapper div, focus target `[data-slot="slider-thumb"] input`; user `ref` branch dropped (not in the aria Slider props).
- `components/inputs/ST_FilterTextField.tsx`: autocomplete is RAC `ComboBox` (`allowsCustomValue`, `inputValue`/`onInputChange`, `selectedKey`/`onSelectionChange`, object items with `id`, `textValue`), item-press label echo skipped by a ref, typing drops the chosen option; its clear is the shared end adornment (the part's `ComboboxClear` cannot clear typed text) and `handleClear` clears the column filter for it; select is RAC `Select` (`selectedKey`, `placeholder`, `aria-label`, `isDisabled`, no `position`, no trigger `title`); multi-select is `ComboBox selectionMode="multiple"` with `value`/`onChange`, `ComboboxChipList` chips; combobox anchor and chips input read off the wrapper div (InputGroup and ComboboxChipsInput take no ref); `isDisabled` on the clear button; repeated option values offered once.
- `components/inputs/ST_GlobalFilterTextField.tsx`: `isExpanded`; `aria-hidden` animate classes; `isDisabled`; menu open handler takes `MouseEvent<FocusableElement>`.
- `components/inputs/ST_SelectCheckbox.tsx`: `isSelected`/`isDisabled`/`isIndeterminate`; selection still in `onClick` (shiftKey); `satisfies CheckboxProps | RadioProps`; `RadioGroup aria-label`; no `title`, no `as any`.

Checks: `tsc:aria` clean in these 9 files except `ST_TableHeadCellFilterLabel.tsx:131` (`{...rest}` typed by `types.ts` `ButtonProps = ComponentPropsWithRef<'button'>`; clean once `types.ts` types it from the `Button` part, verified locally). `lint` clean. Stories on `ST_BASE=aria` with temporary uncommitted stubs for `TooltipProvider`, `DropdownMenuContent`, `DialogContent`: 433 of 446 pass; the 13 failures are menus, modal, detail panel, and 4 shared-story assumptions below. Hand run of `check-bases` with the aria pair: 142 library files, 37 allowed to differ, 0 problems.

Owner attention:

- Shared stories read the checkbox role element as Radix's button: `RowPinningOnSelect.stories.tsx:79` and `RenderCounts.stories.tsx:565`, `:782` read `aria-checked` (the RAC checkbox role element is a native `<input type="checkbox">`: state in `checked`/`indeterminate`, no attribute); `RowPinning.stories.tsx:135` hit-tests the role element's center (the RAC input is visually hidden). Fix in the stories (`toBeChecked`/`toBePartiallyChecked`, hit-test the `data-slot="checkbox"` label), not in the library.
- `components/ui/tooltip.tsx` wraps the trigger in RAC `Focusable`, which warns `<Focusable> child must have an interactive ARIA role.` for every non-button child (the `span` wrappers kept for disabled buttons, the filter checkbox `Label`): about 1,200 dev warnings per story run.
- `st-collapsible-down`/`-up` keyframes reading `--disclosure-panel-height` are expected from the `style.utils.ts` port (rest cluster), as in the base tree.
