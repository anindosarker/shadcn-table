# Design plan: the date picker on Radix and on React Aria

Spec: `plan/specs/79-date-picker-radix-and-aria.md`, 1.6.1. Epic E25, D162. Written 2026-11-24 from sources read on that day.

This plan says, for each of the 22 approved files and for each of the two bases, whether the file is a byte copy of the Base UI file or differs, and for each difference which Base UI API is replaced by what, with the source line that proves it. It holds decisions and interfaces. It proposes no change to the Base UI code.

## 0. Sources and short names

| Short name | What it is |
|---|---|
| `B/` | `registry/base/components/date-picker/` in `anindosarker/shadcn-date-picker`: the approved Base UI code, 22 files, read in full from `test-projects/next-app/components/date-picker/` at commit `53f4b4f` (the same bytes, spec 78, 1.6.3) |
| `base-nova/`, `radix-nova/`, `aria-nova/` | the part sources of the three styles, read on 2026-11-24 from `https://ui.shadcn.com/r/styles/<style>/<part>.json` (`main` of the new repository holds no part yet) and saved as `/private/tmp/claude-501/dp-design-parts/<style>/<part>.tsx`. Line numbers are those of the saved files. The files the shadcn CLI wrote into the branch `date-picker-repository` have the same content with the icon placeholder replaced by a lucide import, so their line numbers are a few lines lower in `dialog.tsx`, `calendar.tsx` and `native-select.tsx` |
| `BUI/` | `@base-ui/react@1.9.0/` |
| `RP` | `@radix-ui/react-popover@1.3.1/dist/index.mjs` |
| `RP.d` | `@radix-ui/react-popover@1.3.1/dist/index.d.ts` |
| `RD` | `@radix-ui/react-dialog@1.3.1/dist/index.mjs` |
| `RFS` | `@radix-ui/react-focus-scope@1.3.1/dist/index.mjs` |
| `RPOP` | `@radix-ui/react-popper@1.4.0/dist/index.mjs` |
| `RSLOT` | `@radix-ui/react-slot@1.5.0/dist/index.mjs` |
| `RAC/` | `react-aria-components@1.22.1/dist/` |
| `RA/` | `react-aria@3.53.1/dist/` |
| `RTS/` | `@react-types/shared@3.37.0/src/` |
| `RS/` | `react-stately@3.51.0/dist/types/src/` |
| `FUI` | `@floating-ui/core@1.8.0/dist/floating-ui.core.mjs` |
| cases | `reference/q88-date-filter-demo/date-picker-9-cases.md` (case ids) |
| notes | `reference/q88-date-filter-demo/date-picker-9-design-notes.md`, `review-notes.md` |

- All library paths are under `shadcn-react-table/node_modules/.pnpm/`. The versions are the ones the new repository pins (`radix-ui ^1.8.1`, `react-aria-components ^1.22.1`, `@base-ui/react ^1.9.0`, `react-day-picker ^10.0.2`).
- The parts adapted once in `shadcn-react-table/packages/shadcn-table/registry/{base,radix,aria}/components/ui/` were compared with the style sources: they differ in formatting and the `cn` import only, so they add no fact.
- Five type claims of section 3 were also compiled in a scratch file against the installed `react-aria-components` types (TypeScript 5.8.3, `strict`): marked "compiled" where used.
- Cards: a point this plan must not decide is marked `K1` to `K5`. The facts and the options are staged under `## Attention` in `run/trackers/79-date-picker-radix-and-aria-tracker.md`; the runner files the queue card and writes its id beside the K number there. The version milestones build everything that is not marked.

## 1. Inventory

A file is `identical` only when it imports nothing whose API differs on that base.

| # | File (`B/` prefix) | Radix | React Aria |
|---|---|---|---|
| 1 | `date-picker.tsx` | identical | identical |
| 2 | `types.ts` | differs (one line waits on K2) | differs (one line waits on K2) |
| 3 | `modes/day-picker.tsx` | identical | identical |
| 4 | `modes/day-range-picker.tsx` | identical | identical |
| 5 | `modes/period-picker.tsx` | identical | identical |
| 6 | `modes/period-range-picker.tsx` | identical | identical |
| 7 | `modes/time-range-picker.tsx` | identical | identical |
| 8 | `components/day-calendar.tsx` | identical | differs (waits on K1) |
| 9 | `components/period-views.tsx` | identical | differs |
| 10 | `components/picker-box.tsx` | identical | identical |
| 11 | `components/picker-field.tsx` | identical | differs |
| 12 | `components/picker-popup.tsx` | differs (two sites wait on K2; K4 names a stock difference) | differs (two sites wait on K2; the popover waits on K5) |
| 13 | `components/picker-presets.tsx` | identical | identical |
| 14 | `components/picker-trigger.tsx` | identical | differs |
| 15 | `components/time-columns.tsx` | identical | differs |
| 16 | `components/time-field.tsx` | differs | differs (follows K5) |
| 17 | `components/view-nav.tsx` | differs (waits on K3) | differs (one site waits on K3) |
| 18 | `utils/labels.ts` | identical | identical |
| 19 | `utils/range.ts` | identical | identical |
| 20 | `utils/time.ts` | identical | identical |
| 21 | `utils/values.ts` | identical | identical |
| 22 | `utils/views.ts` | identical | identical |

- Radix: 18 identical, 4 differ (`types.ts`, `components/picker-popup.tsx`, `components/time-field.tsx`, `components/view-nav.tsx`).
- React Aria: 13 identical, 9 differ (`types.ts`, `components/day-calendar.tsx`, `components/period-views.tsx`, `components/picker-field.tsx`, `components/picker-popup.tsx`, `components/picker-trigger.tsx`, `components/time-columns.tsx`, `components/time-field.tsx`, `components/view-nav.tsx`).
- 31 identical and 13 differs: 44 cells.
- `modes/day-picker.tsx`, `modes/period-picker.tsx` and `components/picker-box.tsx` use the type `PopupActions` and the ref `popupActions` (`B/modes/day-picker.tsx:52,65,77`, `B/modes/period-picker.tsx:47,72,83`, `B/components/picker-box.tsx:6,16,22,43`). They are identical under every option of K2 that keeps a ref with a `close()` method. The one option of K2 that drops the ref on React Aria names these three files in the card.
- `diff -rq registry/base/components/date-picker registry/<base>/components/date-picker` must list exactly the differing files of that base.

## 2. Parts

What the picker uses of each part, and what the same part offers in the other two styles. "same" means the same export name, the same prop names and the same `data-slot` values.

### 2.1 popover

| Used by the picker | base-nova | radix-nova | aria-nova |
|---|---|---|---|
| root `Popover` with `open`, `defaultOpen`, `onOpenChange`, `actionsRef` (`B/components/picker-popup.tsx:132-142`) | `base-nova/popover.tsx:7-9`, props of `PopoverPrimitive.Root`; `BUI/popover/root/PopoverRoot.d.ts:21,25,29,41` | `radix-nova/popover.tsx:7-11`, props of `PopoverPrimitive.Root`: `open`, `defaultOpen`, `onOpenChange(open)` (`RP:40-43`, `RP.d:12-16`). No `actionsRef` | the root is `PopoverTrigger` (`aria-nova/popover.tsx:13-19`, a `DialogTrigger`): `isOpen`, `defaultOpen`, `onOpenChange(isOpen)` (`RS/overlays/useOverlayTriggerState.d.ts:1-8`). No `actionsRef` |
| `PopoverTrigger` with `disabled` and `render={trigger}` (`:130`) | `base-nova/popover.tsx:11-13`; `BUI/popover/trigger/PopoverTrigger.d.ts:24` | `radix-nova/popover.tsx:13-17`: a `button`, `asChild` in place of `render` (`RP:100-112`) | no trigger part. The first pressable child of `PopoverTrigger` is the trigger (`RAC/private/Dialog.mjs:88-92`) |
| `PopoverContent` with `aria-label`, `align`, `alignOffset`, `sideOffset`, `className`, `ref`, `initialFocus` (`:148-156`, `:36-44`, `B/components/time-field.tsx:53-58`) | `base-nova/popover.tsx:15-47`: `align`, `alignOffset`, `side`, `sideOffset` `:17-20`, the rest to the popup `:42`; `initialFocus` at `BUI/popover/popup/PopoverPopup.d.ts:47` | `radix-nova/popover.tsx:19-39`: `align` and `sideOffset` named `:21-22`, every other prop of `PopoverPrimitive.Content` passed on `:35` (so `alignOffset`, `side`, `aria-label`, `ref`, `onOpenAutoFocus`). No `initialFocus` | the content is `Popover` (`aria-nova/popover.tsx:21-43`): `placement`, `offset`, `crossOffset` `:23-25`, `className` a string `:27-29`, the rest to the primitive `:40`. No `align`, `alignOffset`, `sideOffset`, `initialFocus`. No export named `PopoverContent` (`:81-87`) |
| CSS variable `--available-height` in a class (`:153`) | `BUI/popover/positioner/PopoverPositionerCssVars.d.ts:10` | `--radix-popover-content-available-height` (`RP:293`) | none; the library writes `max-height` on the element itself (`RA/private/overlays/useOverlayPosition.mjs:117`) |
| stock width `w-72`, overridden by `w-auto` | `base-nova/popover.tsx:39` | `radix-nova/popover.tsx:32` | `aria-nova/popover.tsx:37` |

### 2.2 dialog

| Used by the picker | base-nova | radix-nova | aria-nova |
|---|---|---|---|
| root `Dialog` with `open`, `defaultOpen`, `onOpenChange`, `actionsRef` (`B/components/picker-popup.tsx:68-78`) | `base-nova/dialog.tsx:10-12`; `BUI/dialog/root/DialogRoot.d.ts:40,58` | `radix-nova/dialog.tsx:10-14`: `open`, `defaultOpen`, `onOpenChange(open)`, `modal` default `true` (`RD:34-37`). No `actionsRef` | the root is `DialogTrigger` (`aria-nova/dialog.tsx:19-21`): `isOpen`, `defaultOpen`, `onOpenChange(isOpen)`. No `actionsRef` |
| `DialogTrigger` with `disabled` and `render` (`:66`) | `base-nova/dialog.tsx:14-16` | `radix-nova/dialog.tsx:16-20`: a `button`, `asChild` (`RD:74-86`) | no trigger part; the first pressable child of `DialogTrigger` |
| `DialogContent` with `showCloseButton={false}`, `className`, the app's props (`:84-92`) | `base-nova/dialog.tsx:42-86`, `showCloseButton` `:45`, classes `:56` | `radix-nova/dialog.tsx:50-91`, `showCloseButton` `:53`, the same class list `:64` | the content is `Dialog` (`aria-nova/dialog.tsx:63-109`): overlay, modal and dialog in one; `showCloseButton` `:66`, `isDismissable` default `true` `:67`, `className` goes to the modal `:80`, the children sit one element deeper in `section[data-slot=dialog]` `:84-87`. No export named `DialogContent` (`:177-188`) |
| `DialogClose` with `render={<Button ... />}` (`:96-107`, `:119-121`) | `base-nova/dialog.tsx:22-24` | `radix-nova/dialog.tsx:28-32`: a `button`, `asChild` (`RD:301-311`) | `DialogClose` is itself the style's `Button` with `slot="close"` (`aria-nova/dialog.tsx:23-39`); its default `variant` is `"outline"` `:25` |
| `DialogHeader`, `DialogTitle`, `DialogFooter` with `className` (`:93-95`, `:118`) | `base-nova/dialog.tsx:88-96`, `:125-136`, `:98-123` | same: `radix-nova/dialog.tsx:93-101`, `:130-144`, `:103-128` | same names: `aria-nova/dialog.tsx:111-119`, `:144-159` (a `Heading` with `slot="title"`), `:121-142` |

### 2.3 button

| Used by the picker | base-nova | radix-nova | aria-nova |
|---|---|---|---|
| `variant` `default`, `ghost`, `outline`; `size` `default`, `sm`, `icon`, `icon-xs`, `icon-sm`; `className` | `base-nova/button.tsx:9-33`, `:43-55` | the same class text `radix-nova/button.tsx:10-34`, `:43-64` | the same class text `aria-nova/button.tsx:17-41`, `:50-69`; `className` is a string `:55-59` |
| `disabled` (`B/components/period-views.tsx:254`, `B/components/time-columns.tsx:47`, `B/components/view-nav.tsx:25`) | a prop of the Base UI button | native `disabled` (`radix-nova/button.tsx:49`, `React.ComponentProps<"button">`) | `isDisabled` (`RA/types/src/button/useButton.d.ts:4-5`), written as native `disabled` (`RA/private/button/useButton.mjs:26`). `disabled` does not compile (compiled) |
| `focusableWhenDisabled` (`B/components/view-nav.tsx:26`) | `BUI/button/Button.d.ts:21`; `BUI/utils/useFocusableWhenDisabled.mjs:20-37` | none: a native button | none in the typed props. `aria-disabled` is a prop (`RA/types/src/button/useButton.d.ts:11`, `RA/private/button/useButton.mjs:70`) |
| `onClick` | native | native | a prop: "`onClick` is an alias for `onPress` provided for compatibility with other libraries" (`RTS/events.d.ts:134-139`) |
| `onMouseDown` (`B/components/picker-field.tsx:159`) | native | native | passed to the element (`RA/private/utils/filterDOMProps.mjs:43`, `RAC/private/Button.mjs:82-87`) |
| `ref`, `id`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-pressed`, `aria-current` | native | native | `ref` (`aria-nova/button.tsx:56`), `id` and the three labelling attributes (`RA/private/button/useButton.mjs:59-61`, `labelable: true`), `aria-pressed` and `aria-current` (`RA/private/button/useButton.mjs:68-69`) |
| `aria-invalid` (`B/components/picker-trigger.tsx:63`), `title` (`B/components/view-nav.tsx:42`) | native | native | not passed to the element: the button keeps only the names of `filterDOMProps` with `global: true` (`RAC/private/Button.mjs:82-84`; the lists at `RA/private/utils/filterDOMProps.mjs`, no `title`, no `aria-invalid`). `title` does not compile (compiled). The `render` prop reaches the element: "Overrides the default DOM element with a custom render function" (`RAC/types/src/utils.d.ts:193-208`, `:122`, `RAC/types/src/Button.d.ts:44`) |
| `aria-expanded` set by the trigger, read by the class `aria-expanded:bg-muted` | `BUI/popover/trigger/PopoverTrigger.mjs:117`, `BUI/dialog/trigger/DialogTrigger.mjs:74` | `RP:105`, `RD:84` | `RA/private/overlays/useOverlayTrigger.mjs:37` |
| `data-icon="inline-start"` on the icon, read by `has-data-[icon=inline-start]:pl-2` | `base-nova/button.tsx:23` | `radix-nova/button.tsx:24` | `aria-nova/button.tsx:31` |

### 2.4 button-group

| Used by the picker | base-nova | radix-nova | aria-nova |
|---|---|---|---|
| `ButtonGroup` with `className` and the app's `div` props (`B/components/picker-trigger.tsx:46-49`) | `base-nova/button-group.tsx:25-39` | same signature `radix-nova/button-group.tsx:24-38` | same signature `aria-nova/button-group.tsx:23-37` |
| the stock corner classes of the horizontal variant | `base-nova/button-group.tsx:14` | other selectors, the same result for two direct children `radix-nova/button-group.tsx:13` | descendant selectors `aria-nova/button-group.tsx:12` |

### 2.5 input-group

| Used by the picker | base-nova | radix-nova | aria-nova |
|---|---|---|---|
| `InputGroup` with the app's `div` props, `ref`, `onBlur`, `className` (`B/components/picker-field.tsx:125`) | a `div` with `role="group"` `base-nova/input-group.tsx:11-23` | same `radix-nova/input-group.tsx:11-23` | a React Aria `Group` typed `GroupProps` (`aria-nova/input-group.tsx:12-23`); `role` is `'group' \| 'region' \| 'presentation'`, default `'group'` (`RAC/types/src/Group.d.ts:59`, `RAC/private/Group.mjs:52`); every other prop, `onBlur` included, reaches the `div` (`RAC/private/Group.mjs:49`) |
| `InputGroupInput` with native input props | `base-nova/input-group.tsx:119-133`, `data-slot="input-group-control"` `:125` | `radix-nova/input-group.tsx:117-131`, the same slot `:123` | `aria-nova/input-group.tsx:119-133`, typed `React.ComponentProps<"input">`, the same slot `:125`; the React Aria `Input` passes every prop on (`RAC/private/Input.mjs:53`) |
| `InputGroupAddon` with `align="inline-end"` | `base-nova/input-group.tsx:46-66`, `data-slot` `:54` | same lines `radix-nova/input-group.tsx:46-66` | same lines `aria-nova/input-group.tsx:46-66` |
| `InputGroupButton` with `size="icon-xs"`, `aria-label`, `className`, `onMouseDown`, `onClick` | `base-nova/input-group.tsx:86-105` | `radix-nova/input-group.tsx:86-103` | `aria-nova/input-group.tsx:86-105` (the style's `Button`, so 2.3 applies) |

### 2.6 native-select, field, badge, calendar, use-mobile

| Part | Used by the picker | radix-nova | aria-nova |
|---|---|---|---|
| native-select | `NativeSelect` with `size="sm"`, `aria-label`, `value`, `onChange`; `NativeSelectOption` (`B/components/period-views.tsx:143-154`) | the file is byte-equal to `base-nova/native-select.tsx` | byte-equal |
| field | `Field`, `FieldGroup`, `FieldLabel` with `htmlFor`, `className`, `role` (`B/modes/*.tsx`) | equal but for two import paths (`radix-nova/field.tsx:7-8`); the label is a Radix `Label.Root` | equal but for the imports and one class list (`aria-nova/field.tsx:109`); the label is a React Aria `Label` that takes `htmlFor` (`aria-nova/label.tsx:11-27`) |
| badge | `Badge` with `variant="secondary"` (`B/components/day-calendar.tsx:163`) | same `radix-nova/badge.tsx:29-46` | same `aria-nova/badge.tsx:27-55` |
| calendar | `Calendar`, `CalendarDayButton`, `React.ComponentProps<typeof Calendar>` (`B/components/day-calendar.tsx:14,21,223-257`) | the same react-day-picker calendar: equal to `base-nova/calendar.tsx` but for one import path and one added line, `ref={ref}` on the day button (`radix-nova/calendar.tsx:223`); exports `Calendar`, `CalendarDayButton` `:246` | another calendar: React Aria `Calendar` and `RangeCalendar` (`aria-nova/calendar.tsx:65-124`), no `CalendarDayButton` (`:287`). Section 4 |
| use-mobile | `useIsMobile()` (`B/components/picker-popup.tsx:22,61`) | byte-equal to `base-nova/use-mobile.ts` | byte-equal |

- Three class names of the picker are hooks of the style sheet, not of a base: `cn-dialog-close` (`B/components/picker-popup.tsx:101`), `cn-field` (`B/modes/day-range-picker.tsx:248`), `cn-button-group-orientation-horizontal` (`B/components/picker-trigger.tsx:47`). They are the same text on every base and get what the tree's style sheet gives them.
- The picker's own class names read only these attributes of a part: `data-[slot=input-group-addon]`, `data-[slot=input-group-control]` (`B/modes/day-range-picker.tsx:67`), `aria-disabled` (`B/components/view-nav.tsx:27`), and the react-day-picker and calendar attributes inside `B/components/day-calendar.tsx:44-114`. No Base UI state attribute (`data-open`, `data-popup-open`, `data-side`) is read anywhere in the 22 files.

## 3. Per differing file and base

Each row: the Base UI line, the API, the replacement, the proof. A line that is not listed stays as it is.

### 3.1 `types.ts`, Radix

| Base UI site | Base UI API | On Radix | Proof |
|---|---|---|---|
| `B/types.ts:2` | `import type { Popover as PopoverPrimitive } from "@base-ui/react/popover"` | the line is removed | the only use is `:154` |
| `B/types.ts:4-5`, `:32-50` | the types of `Dialog`, `DialogContent`, `Popover`, `PopoverContent`; `Pick<..., "open" \| "defaultOpen" \| "onOpenChange">` | unchanged text | the four exports and the three root props exist: `radix-nova/dialog.tsx:10-14,50-57`, `radix-nova/popover.tsx:7-11,19-24`, `RP:40-42`, `RD:34-36` |
| `B/types.ts:154` | `PopupActions = PopoverPrimitive.Root.Actions` (`BUI/popover/root/PopoverRoot.d.ts:81-84`) | waits on K2. The name `PopupActions` and its export at `:170` stay | Radix has no actions ref: `RP:36-44` lists every prop of the root |

- Derived public types follow the part: on Radix `onOpenChange` gets one argument (`RP.d:14-16`), and `popoverProps` takes the props of Radix `Popover.Content` (no `initialFocus`, `finalFocus`).

### 3.2 `components/picker-popup.tsx`, Radix

| Base UI site | Base UI API | On Radix | Proof |
|---|---|---|---|
| `:36-44` | `align`, `alignOffset: -8`, `sideOffset: 10` on `PopoverContent` | unchanged | the same three props with the same meaning: `RPOP:103-106`, and both libraries hand `alignOffset` to floating-ui as `alignmentAxis` (`RPOP:148`, `BUI/internals/useAnchorPositioning.mjs:156-164`) |
| `:66`, `:130` | `<DialogTrigger disabled render={trigger} />`, `<PopoverTrigger disabled render={trigger} />` | the same element with `asChild` and `trigger` as its one child | the trigger is a `Primitive.button` (`RP:100-112`, `RD:74-86`); with `asChild` its props, `disabled` and the composed `ref` included, are merged onto the child (`RSLOT:50-54`, `:78-103`) |
| `:71-76`, `:135-140` | `onOpenChange={(nextOpen, details) => ...}`, the app's handler called with both | one argument: `(nextOpen)`; the app's handler called with `nextOpen` | `RP.d:14-16`: `bivarianceHack(open: boolean): void`; `RP:50-55` |
| `:77`, `:141` | `actionsRef={popupActions}` | waits on K2 | no such prop (`RP:36-44`, `RD:30-38` list every prop of the two roots) |
| `:84-92` | `DialogContent` with `showCloseButton={false}` and the class list | unchanged | `radix-nova/dialog.tsx:53`; the stock class list is the same text (`radix-nova/dialog.tsx:64`, `base-nova/dialog.tsx:56`) |
| `:96-107` | `<DialogClose render={<Button variant="ghost" size="icon-sm" className="cn-dialog-close" aria-label />}>` with `XIcon` as child | `<DialogClose asChild>` around that `Button`, the `XIcon` inside the `Button` | `RD:301-311`: a `Primitive.button` whose click closes; the stock part does the same at `radix-nova/dialog.tsx:71-86` |
| `:119-121` | `<DialogClose render={<Button className />}>` with the label as child | `<DialogClose asChild>` around that `Button`, the label inside the `Button` | as above; `radix-nova/dialog.tsx:122-124` |
| `:149` | `aria-label={title}` on the popup | unchanged | the content has `role="dialog"` and takes the rest of the props (`RP:280-285`) |
| `:153` | `max-h-(--available-height)` | `max-h-(--radix-popover-content-available-height)` | `RP:293` (from `--radix-popper-available-height`, `RPOP:164`) |

- Everything else in the file is unchanged: the imports (the same export names, `radix-nova/dialog.tsx:162-173`, `radix-nova/popover.tsx:80-88`), `useIsMobile`, `PhoneDialogContext`, `InputGroupAddon`.
- K4 names a stock difference of the Radix popover (Tab moves in a loop). No option of K4 changes a line of this plan unless the card says so.

### 3.3 `components/time-field.tsx`, Radix

| Base UI site | Base UI API | On Radix | Proof |
|---|---|---|---|
| `:54` | `initialFocus: popupRef` in `popoverProps`: focus goes to the popup itself (C2, R16) | `onOpenAutoFocus`, a handler that prevents the default and focuses `popupRef.current`. It stays before `...popoverProps`, so an app's own handler replaces it, as `initialFocus` can be replaced today | `RP.d:62-65`: "Event handler called when auto-focusing on open. Can be prevented."; `RFS:95-103`: when the event is prevented nothing is focused, so the handler focuses; the content is focusable (`RFS:147`, `tabIndex: -1`) |
| `:49`, `:56` | `popupRef` and `ref: popupRef` | unchanged | `radix-nova/popover.tsx:35` passes `ref` to the content |

### 3.4 `components/view-nav.tsx`, Radix

| Base UI site | Base UI API | On Radix | Proof |
|---|---|---|---|
| `:25-26` | `disabled` with `focusableWhenDisabled`: the arrow is dimmed, does nothing and stays a tab stop (D11) | waits on K3 | `radix-nova/button.tsx:49`: the props are those of a native `button`; `focusableWhenDisabled` does not compile (compiled) |
| `:27` | `aria-disabled:opacity-50` | unchanged | a plain attribute selector |
| `:38-46` | `TodayButton` | unchanged | native `title`, `aria-label`, `onClick` |

### 3.5 `types.ts`, React Aria

| Base UI site | Base UI API | On React Aria | Proof |
|---|---|---|---|
| `:2` | the Base UI type import | removed | as 3.1 |
| `:4` | `import type { Dialog, DialogContent }` | `import type { Dialog, DialogTrigger }` | `aria-nova/dialog.tsx:177-188` |
| `:5` | `import type { Popover, PopoverContent }` | `import type { Popover, PopoverTrigger }` | `aria-nova/popover.tsx:81-87` |
| `:32-35` | `PopoverContentProps`: the props of `PopoverContent` without `children` | the props of `Popover` (the content) without `children`, `isOpen`, `defaultOpen`, `onOpenChange` | the content's own type carries the three open props (`RAC/types/src/Popover.d.ts:7`); they are left out so a time range still refuses them (`B/types.ts:93`) |
| `:37-41` | `PopoverProps`: `open`, `defaultOpen`, `onOpenChange` of the root, and the content props | `isOpen`, `defaultOpen`, `onOpenChange` of `PopoverTrigger`, and the content props | `RS/overlays/useOverlayTriggerState.d.ts:1-8`; compiled |
| `:43-50` | `DialogProps`: the three open props of `Dialog`, and the props of `DialogContent` without `children`, `showCloseButton` | the three open props of `DialogTrigger`, and the props of `Dialog` (the content) without `children`, `showCloseButton`, `isOpen`, `defaultOpen`, `onOpenChange` | `aria-nova/dialog.tsx:63-74`; compiled |
| `:154` | `PopupActions` | waits on K2 | no actions ref on `DialogTrigger` (`RAC/types/src/Dialog.d.ts:6-8`) |

- The open prop is named `isOpen` on React Aria because the type is the part's own, as it is on Base UI. Named in section 5 (U8).

### 3.6 `components/picker-popup.tsx`, React Aria

| Base UI site | Base UI API | On React Aria | Proof |
|---|---|---|---|
| `:7-15`, `:17-21` | imports of `DialogContent`, `PopoverContent`, `PopoverTrigger` (as a trigger part) | `Dialog`, `DialogClose`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `DialogTrigger`; `Popover`, `PopoverTrigger`; and `ButtonContext` from `react-aria-components` | `aria-nova/dialog.tsx:177-188`, `aria-nova/popover.tsx:81-87`, `RAC/types/src/Button.d.ts:61` |
| `:36-38` | `triggerPopover = { align: "start" }` | `{ placement: "bottom start" }`, still `satisfies` the content's props | `aria-nova/popover.tsx:23`; `Placement` holds `'bottom start'` (`RA/types/src/overlays/useOverlayPosition.d.ts:2`); `start` follows the text direction (`RA/private/overlays/useOverlayPosition.mjs:224-226`). The Base UI side is `bottom` by default (`base-nova/popover.tsx:19`) |
| `:40-44` | `boxPopover = { align: "end", alignOffset: -8, sideOffset: 10 }` | `{ placement: "bottom end", crossOffset: 8, offset: 10 }` | `aria-nova/popover.tsx:23-25`. `offset` is the gap on the main axis (`RAC/types/src/Popover.d.ts:50-56`). Sign: floating-ui turns `alignmentAxis` around for an end alignment (`FUI:759-760`), so `-8` moves the popup 8 px to the right; React Aria adds `crossOffset` to the left coordinate as given (`RA/private/overlays/calculatePosition.mjs:169`), so `8`. Section 5 names the right-to-left case |
| `:64-65`, `:128-129` | `open` taken out of the app's props | `isOpen` taken out | 3.5 |
| `:66`, `:130` | `disabled` and `render={trigger}` on the trigger part | no trigger part. The trigger element is rendered as the first child of the root, inside `<ButtonContext.Provider value={{ isDisabled: disabled }}>` | the root makes its pressable child the trigger (`RAC/private/Dialog.mjs:88-92`); the style's `Button` reads `ButtonContext` (`RAC/private/Button.mjs:36`) and `isDisabled` disables it (`RA/private/button/useButton.mjs:26`); compiled. The props `trigger` and `disabled` of `PickerPopup` stay, so the three callers do not change |
| `:68-78` | `<Dialog open defaultOpen onOpenChange actionsRef>` | `<DialogTrigger isOpen defaultOpen onOpenChange>`, the handler with one argument | `aria-nova/dialog.tsx:19-21`; `actionsRef` waits on K2 |
| `:84-92` | `<DialogContent {...contentProps} showCloseButton={false} className>` | `<Dialog {...contentProps} showCloseButton={false} className>`. The class list keeps the Base UI text and adds, for the inner element, `*:data-[slot=dialog]:min-h-0 *:data-[slot=dialog]:grow *:data-[slot=dialog]:flex-col` | `aria-nova/dialog.tsx:63-109`. The children sit in `section[data-slot=dialog]`, which takes over `display` and `gap` only (`:84-87`), so the column direction, the growth and the shrink the Base UI popup has from `flex ... flex-col` must be given to it. The geometry comparison of spec 79, 1.6.4 is the check of these three classes |
| `:96-107` | `<DialogClose render={<Button variant="ghost" size="icon-sm" className="cn-dialog-close" aria-label />}>` | `<DialogClose variant="ghost" size="icon-sm" className="cn-dialog-close" aria-label>` with the `XIcon` | `aria-nova/dialog.tsx:23-39`: it is the `Button`, with `slot="close"`; the dialog closes on its press (`RAC/private/Dialog.mjs:150-158`); the stock part writes its own X this way (`aria-nova/dialog.tsx:90-103`) |
| `:119-121` | `<DialogClose render={<Button className />}>` | `<DialogClose variant="default" className>` with the label | the part's default is `"outline"` (`aria-nova/dialog.tsx:25`); the Base UI `Button` default is `"default"` (`base-nova/button.tsx:45`) |
| `:132-142` | `<Popover open defaultOpen onOpenChange actionsRef>` | `<PopoverTrigger isOpen defaultOpen onOpenChange>`, the handler with one argument | `aria-nova/popover.tsx:13-19`; `actionsRef` waits on K2 |
| `:148-158` | `<PopoverContent aria-label {...} {...contentProps} className>` | `<Popover aria-label {...} {...contentProps} className>` | `aria-nova/popover.tsx:21-43`; `aria-label` is written on the element, which has `role="dialog"` (`RAC/private/Popover.mjs:188-190`) |
| `:153` | `max-h-(--available-height) w-auto overflow-y-auto` | `w-auto overflow-y-auto` | the library sets `max-height` itself (`RA/private/overlays/useOverlayPosition.mjs:117`) |

- Unchanged: `DialogHeader`, `DialogTitle`, `DialogFooter`, `InputGroupAddon`, `useIsMobile`, `PhoneDialogContext`, `LabelsContext` (React contexts cross the portal).
- The popover of this file waits on K5 for whether it stays the stock modal popover. The rows above are written for the stock popover.

### 3.7 `components/time-field.tsx`, React Aria

| Base UI site | Base UI API | On React Aria | Proof |
|---|---|---|---|
| `:49`, `:54`, `:56` | `popupRef`, `initialFocus: popupRef`, `ref: popupRef` | all three removed; `popoverProps` keeps `...popoverProps` and `className` | the stock popover does this by itself: "Focus the popover itself on mount, unless a child element is already focused" (`RAC/private/Popover.mjs:133-137`) |

- This holds for the stock popover. If K5 ends with another popover mode, this file follows the card.

### 3.8 `components/view-nav.tsx`, React Aria

| Base UI site | Base UI API | On React Aria | Proof |
|---|---|---|---|
| `:25-26` | `disabled` with `focusableWhenDisabled` | waits on K3 | 2.3; `focusableWhenDisabled` and `disabled` do not compile (compiled) |
| `:42` | `title={labels.goToToday}` | the `render` prop of the `Button`: a function that returns the same `button` with `title` added | `title` is dropped (2.3); `render` is typed for `'button'` (`RAC/types/src/Button.d.ts:44`, `RAC/types/src/utils.d.ts:193-208`); compiled |

### 3.9 `components/period-views.tsx` and `components/time-columns.tsx`, React Aria

| Base UI site | Base UI API | On React Aria | Proof |
|---|---|---|---|
| `B/components/period-views.tsx:254` | `disabled={cell.disabled}` | `isDisabled={cell.disabled}` | `RA/types/src/button/useButton.d.ts:4-5`; written as native `disabled` (`RA/private/button/useButton.mjs:26`), so `disabled:opacity-50` of the button classes applies as on Base UI |
| `B/components/time-columns.tsx:47` | `disabled={unit.disabled}` | `isDisabled={unit.disabled}` | the same |

- Unchanged in both: `variant`, `size`, `aria-pressed`, `aria-current`, `className`, `ref`, `onClick` (2.3), `NativeSelect` (2.6).

### 3.10 `components/picker-trigger.tsx`, React Aria

| Base UI site | Base UI API | On React Aria | Proof |
|---|---|---|---|
| `:63` | `aria-invalid={ariaInvalid}` on the trigger `Button` | the `render` prop of the `Button`: a function that returns the same `button` with `aria-invalid` added | the attribute is dropped (2.3); `render` as 3.8; compiled |

- Unchanged: `ButtonGroup` (2.4), `ref`, `id`, the three labelling attributes, the X `Button` with `onClick` (2.3). The root of `PickerPopup` renders no element on React Aria either (`RAC/private/Dialog.mjs:64-92`: providers and a `PressResponder`), so the trigger and the X stay the two children of the group.

### 3.11 `components/picker-field.tsx`, React Aria

| Base UI site | Base UI API | On React Aria | Proof |
|---|---|---|---|
| `:15` | `PickerFieldProps = HtmlProps & ...`, spread on `InputGroup` at `:125` | `Omit<HtmlProps, "role"> & ...`. A type change only | `HtmlProps` has `role?: AriaRole`; the part takes `'group' \| 'region' \| 'presentation'` (`RAC/types/src/Group.d.ts:59`), so the spread does not compile as copied and compiles with `role` left out (compiled, both ways). A `role` an app gives still reaches the element through the spread (`RAC/private/Group.mjs:49-52`) |

- Unchanged: `InputGroupInput` and every attribute on it, `InputGroupAddon`, the X `InputGroupButton` with `onMouseDown` and `onClick` (2.3, 2.5), the iOS overlay.

### 3.12 `components/day-calendar.tsx`, React Aria

Waits on K1. Section 4.

## 4. The day calendar on React Aria

### 4.1 Facts, read on 2026-11-24

- `https://ui.shadcn.com/r/styles/aria-nova/calendar.json`: `dependencies` `["cn"]`, `registryDependencies` `["button", "select"]`. The same file of `radix-nova` and of `base-nova`: `dependencies` `["cn", "react-day-picker@latest", "date-fns"]`, `registryDependencies` `["button"]`.
- The `aria-nova` part is built on the React Aria calendar: it imports `Calendar`, `RangeCalendar`, `CalendarGrid`, `CalendarCell`, `CalendarMonthPicker`, `CalendarYearPicker` and the type `DateValue` from `react-aria-components` (`aria-nova/calendar.tsx:6-21`) and exports `Calendar` and `RangeCalendar` (`:287`). It has no `CalendarDayButton`, no `classNames`, no `components`, no `modifiers`: its props are those of the React Aria calendar plus `buttonVariant`, `captionLayout`, `numberOfMonths`, `showWeekNumber`, `headerFormat`, `renderCell` (`:65-81`, `:97-110`).
- Its month and year menus are the style's own `Select` with a popup list, not a native `select` (`aria-nova/calendar.tsx:24-31`, `:243-285`). Report section 3: "The calendars use the native `select` element for the month and the year."
- Its header is fixed: two arrow buttons laid over the top (`:147-176`) and a centred caption (`:179-192`). There is no slot for the picker's caption with the arrows, the Today button and the From or To badge (`B/components/day-calendar.tsx:124-176`).
- `showWeekNumber` only picks a class for the cell corners (`aria-nova/calendar.tsx:38-41`, `:209`); no week number column is drawn. The week picker draws one (`B/components/period-views.tsx:98-112`, `showWeekNumber`, `ISOWeek`).
- Its values are `DateValue` objects of `@internationalized/date` (a dependency of `react-aria-components`, `package.json:58`), not `Date`.
- What `B/components/day-calendar.tsx` takes from the react-day-picker part: `Calendar` and `CalendarDayButton` (`:14`), and through `Calendar` the props `captionLayout="dropdown"`, `hideNavigation`, `fixedWeeks`, `startMonth`, `endMonth`, `disabled` matchers, `className`, `classNames`, `modifiers`, `modifiersClassNames`, `components` with `Root`, `DayButton`, `MonthCaption`, `Week` (`:223-257`); from react-day-picker itself `getDefaultClassNames`, `useDayPicker` and four types (`:5-11`). The native `select` of the caption is react-day-picker's own (`react-day-picker@10.0.2/dist/esm/components/Dropdown.js:16`, `Select.js:9`).
- react-day-picker stays a dependency of the React Aria version whatever happens to this file: `B/types.ts:3` (`PropsBase`, the public `calendarProps`), `B/utils/range.ts:2` (`DateRange`), `B/utils/values.ts:10-11` (`DateLib`, `defaultLocale`, `DayPickerLocale`). With `B/components/day-calendar.tsx:5-11` these are the six import sites of spec 79, 1.3. `react-day-picker` and `date-fns` are installed in the new repository (spec 78, 1.7).

### 4.2 The candidates

| Candidate | Report section 3 | Same look and behaviour | New against the Base UI code |
|---|---|---|---|
| A. `day-calendar.tsx` on React Aria imports `DayPicker` from react-day-picker and carries what the stock react-day-picker part adds | kept: the caption's native `select` is react-day-picker's | can be kept, but only by a copy: the root classes and cell sizes (`radix-nova/calendar.tsx:33-38`), the month-name formatter (`:41-45`), the class map (`:46-135`), `Chevron` (`:147-187`), `WeekNumber` (`:191-199`) and the day button (`:207-244`) with its `ref` and its effect (`:216-219`). The day button cannot be the style's `Button`: react-day-picker gives it `disabled`, `tabIndex` and its own key and focus handlers (`react-day-picker@10.0.2/dist/esm/DayPicker.js:332-336`), and the React Aria button does not put `disabled` or `tabIndex` on the element (section 2.3); it would be a native `button` with `buttonVariants` (`aria-nova/button.tsx:91`). Not provable by reading; the geometry comparison would be the proof | about 150 lines of a stock part inside the picker's file, with three small components, one ref and one effect that `B/components/day-calendar.tsx` does not have; the file is no longer "on the stock shadcn Calendar" (report 2.2); a second copy of shadcn's calendar classes to keep in step |
| B. The react-day-picker calendar part of another style becomes `components/ui/calendar.tsx` of the React Aria tree; `day-calendar.tsx` is a byte copy | kept | not as the part stands: its day button is the style's `Button` (`radix-nova/calendar.tsx:222-242`), so on React Aria the `disabled` and `tabIndex` of each day are lost (as in A). The part would have to be edited | no code in the picker folder; but the part is no longer what the shadcn CLI writes for `aria-nova` (spec 79, 1.6.2), the item can no longer name `calendar` as a registry dependency (the user's style would install the React Aria calendar), and the user's own `components/ui/calendar.tsx` would be replaced. A fix milestone of spec 78 |
| C. `day-calendar.tsx` is rewritten on the stock `aria-nova` `Calendar` and `RangeCalendar` | bends: the month and year menus are not native `select` elements | differs: no caption slot, no week number column, no `fixedWeeks`, no `components`, `classNames` or `modifiers`; `calendarProps` (`B/types.ts:14-30`) has nothing to be passed to; the week picker has no stock way | a new calendar file, new value conversion between `Date` and `DateValue`, a new public `calendarProps` type |

### 4.3 Result

- No candidate keeps all of: report section 3, the same look and behaviour, and the rule of section 6 (nothing new against the Base UI code, stock parts as the CLI writes them). A keeps the first two by copying a stock part into the picker; B keeps the picker's file by replacing a stock part; C keeps the stock part and loses the rule and the look.
- So this plan names no way. `registry/aria/components/date-picker/components/day-calendar.tsx` waits on K1, with the three candidates as the card's options.
- Until the card is decided the React Aria version builds the other 21 files. `B/components/period-views.tsx:30` and the three day modes import `DayCalendar`, so the type check of the React Aria tree and its plays stay red until then; the React Aria milestone records that in its tracker and does not write a stand-in file.

## 5. Behaviour at risk

Stories are the files of spec 78, 1.6.5: `Date`, `DateTime`, `Time`, `Week`, `Month`, `Year` (a single and a range story each) and `Options`.

| Behaviour | Cases | Story | Radix | React Aria |
|---|---|---|---|---|
| Closing from inside the popup after a pick | D4, D5, P3, P6, P11, M10, W10 | `Date`, `Week`, `Month`, `Year`, single | K2 | K2 |
| Focus return after close | R2, D4 | every story with a popup | the trigger gets focus when the content unmounts, unless the close came from a press outside (`RP:204-212`, `RFS:105-118`); Base UI: the trigger (`BUI/popover/popup/PopoverPopup.d.ts:49-57`). Same | `restoreFocus: true` (`RA/private/overlays/Overlay.mjs:45`). Same |
| R2: the X of a trigger gives focus to the trigger | R2 | range stories | unchanged code (`B/components/picker-trigger.tsx:82`) | unchanged code; the `ref` is the `button` (`aria-nova/button.tsx:56`) |
| Tab past the last control closes the popover; no focus trap; no hidden Close button | U2 | `Options` and every popover | K4: Tab moves from the last control to the first (`RP:260`, `RFS:124,135-137`). Escape and a press outside close as on Base UI (`RP:274`) | K5: the stock popover keeps focus inside (`RAC/private/Popover.mjs:216`) |
| Where focus lands when a popover opens | WR1, C2, R16 | range stories, `Time`, `DateTime` | the first control, as on Base UI (`RFS:99`); the clock: the popup (3.3). On a touch screen Base UI focuses the popup instead of the first control (`BUI/popover/popup/PopoverPopup.d.ts:38-39`); Radix always focuses the first control. Named in K4 | the popup itself for every popover (`RAC/private/Popover.mjs:133-137`): C2 and R16 as on Base UI, WR1 one Tab later. Named in K5 |
| The clock inside the date-time popup: a popover in a popover | DT, R16, R20 | `DateTime` | nested layers are tracked by the library; to be confirmed by the plays | nested popovers under a modal popover; to be confirmed by the plays |
| The phone dialog | U4, U5, U6, R5 | `Options` (phone layout), range stories at 390 | the same class list on the same element (3.2); focus on open goes to the first control, as on Base UI (`RFS:99`); scroll lock and focus trap by the library (`RD:126,165,251-252`) | the layout needs the three classes of 3.6; focus on open goes to the dialog element, not the X: "Focus the dialog itself on mount" (`RA/private/dialog/useDialog.mjs:31`); a named stock difference |
| `auto` crossing 768 while open closes the picker | U7 | `Options` | two different roots, as on Base UI; unchanged code | the same |
| Portals and scroll lock of the popover | U1 | every popover | portal to `body` (`radix-nova/popover.tsx:26`), no scroll lock when not modal (`RP:43,132`) | portal to `body`; page scroll is locked and the outside is inert while a stock popover is open (`RA/private/overlays/usePopover.mjs:45-47,54`). Named in K5 |
| The popup scrolls inside the room left | U1 | tall popups at 390 | the Radix variable (3.2). Its collision padding is 0 where Base UI's is 5, so the room is 5 px larger | `max-height` by the library with a padding of 12 (`RA/private/overlays/useOverlayPosition.mjs:31,117`), so the room is 7 px smaller |
| The popover lines up with the box's end or the trigger's start | U1 | every popover | the same props (3.2) | 3.6. In a right-to-left page `crossOffset: 8` moves the wrong way (`RA/private/overlays/calculatePosition.mjs:169` has no direction; floating-ui has, `FUI:51`). A named difference; right-to-left is looked at on Base UI only (D167) |
| Keyboard order inside the popup | C8, D11, WR1 | every popup | the same elements in the same order. D11: K3 | the same elements. D11: K3 |
| An arrow at the end of the list stays a tab stop | D11 | `Date`, `Month`, `Year` | K3 | K3 |
| `disabled` | G2, M14, W14, DT6, R20 | `Options` | the trigger part passes `disabled` to the button (3.2) | `ButtonContext` (3.6); cells and time options by `isDisabled` (3.9) |
| `required`, `min`, `max`, `step`, `aria-invalid`, `aria-describedby` on the browser input | B1 to B10, T4, report section 3 | `Options` | unchanged code; `InputGroupInput` is a native input (`radix-nova/input.tsx:4-16`) | unchanged code; the React Aria `Input` passes every prop on (2.5) |
| `aria-invalid` on a range trigger | PR12, N11, report section 3 | range stories | unchanged code | 3.10 |
| The app's `id` on a range trigger names it | P16 | range stories | unchanged code | the root gives the trigger a generated id (`RAC/private/Dialog.mjs:57`) that is merged with the app's `id`; a plain `id` wins over a generated one (`RA/private/utils/mergeProps.mjs:35`, `RA/private/utils/useId.mjs:84-95`). To be confirmed by the play |
| Open state through `popoverProps` and `dialogProps` | U8 | `Options` | `open`, `defaultOpen`, `onOpenChange(open)`: the handler has no second argument | `isOpen`, `defaultOpen`, `onOpenChange(isOpen)`: the part's own name. A story that passes `open` or a placement prop reads something one base has; that is a fix of spec 78's stories (spec 79, 1.6.3) |
| The X of a box keeps focus where it was | B6 | every box story | unchanged code | unchanged code: `onMouseDown` reaches the button (2.3). `preventFocusOnPress` is the library's own prop for it (`RA/types/src/button/useButton.d.ts:41-47`, "Whether to prevent focus from moving to the button when pressing it") and is the replacement if the play of B6 fails |
| The Today button's tooltip | none | every calendar | native `title` | 3.8 |

- Base UI inserts focus guards beside the trigger while a popover is open, which is why `B/modes/day-range-picker.tsx:67` says `not-last-of-type:mr-0` (notes, section 9 row 23). Radix and React Aria insert nothing beside the trigger, so the class does nothing there and the file stays identical.

## 6. What is not in the versions

- No new prop, state, helper, effect or workaround that the Base UI code does not have. Each place where a base seems to need one:

| Place | What does the job instead | Where |
|---|---|---|
| The trigger element given as a prop | Radix `asChild` (`RSLOT:50-54`); React Aria: the root takes its pressable child (`RAC/private/Dialog.mjs:88-92`) | 3.2, 3.6 |
| A disabled trigger on React Aria | `ButtonContext` of the library (`RAC/types/src/Button.d.ts:61`) | 3.6 |
| Focus on the clock popup | Radix `onOpenAutoFocus` (`RP.d:62-65`); React Aria: the popover's own behaviour (`RAC/private/Popover.mjs:133-137`) | 3.3, 3.7 |
| The room for the popup | the Radix CSS variable (`RP:293`); React Aria's own `max-height` (`RA/private/overlays/useOverlayPosition.mjs:117`) | 3.2, 3.6 |
| `title` and `aria-invalid` on a React Aria button | the `render` prop of the library (`RAC/types/src/utils.d.ts:193-208`) | 3.8, 3.10 |
| The dialog's X and Done on React Aria | the part's `DialogClose` (`aria-nova/dialog.tsx:23-39`) | 3.6 |
| The inner element of the React Aria dialog | three class names on the part's slot (`aria-nova/dialog.tsx:84-87`) | 3.6 |
| Closing after a pick | nothing found on Radix that needs no state; on React Aria a context exists but changes three more files | K2 |
| A dimmed arrow that stays a tab stop | nothing found on either base | K3 |
| Tab leaving a Radix popover | nothing found: `loop: true` is fixed in the library (`RP:260`) | K4 |
| A React Aria popover without trap and scroll lock | `isNonModal` exists but also removes the dialog role and the focus on open (`RAC/private/Popover.mjs:121-124,133-137`) | K5 |
| The day calendar on React Aria | section 4 | K1 |

- Also not in the versions: a 23rd file, a renamed file, a changed comment (the three JSDoc blocks stay where they are: `B/date-picker.tsx:14-21`, `B/utils/values.ts:31,61`), a restyled stock part, a new npm package, a change to `registry/base/**`.
- A part or a package a card's option needs is a fix milestone of spec 78 (spec 79, 1.6.2), never an edit made by a version milestone.
