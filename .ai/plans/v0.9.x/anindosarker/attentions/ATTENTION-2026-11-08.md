# Attention, 2026-11-08

## A1 Column size reset listener stays until the width transition ends
[D10]

- Epic 03 said the reset helper listens for `transitionend` with `{ once: true }`; the merged code keeps listening until a `width` or `min-width` transitionend instead, because other transitions (button colors) bubble to the table first and `once` would leave `data-size-resetting` stuck.
- Code: `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/shared/utils/column.utils.ts`, `resetColumnSizeAnimated`. No timer, as D5 says.

- Options:
  - a) Recommended: keep (listener removes itself on the first `width` or `min-width` transitionend)
  - b) revert to `{ once: true }` as the epic wrote it

## A2 Select clear button padding uses ltr:pr-9 rtl:pl-9, not pr-9

- D1 names `pr-9` for the select trigger; the merged code uses `ltr:pr-9 rtl:pl-9`, because `pr-9` fails the logical-direction rule of `pnpm test validate-repo`, which spec 01 Acceptance requires green. The chevron sits left of the clear button as D1 wants, and RTL pads the right side too.
- Code: `components/inputs/ST_FilterTextField.tsx`, the `SelectTrigger` className (three bases).

- Options:
  - a) Recommended: keep `ltr:pr-9 rtl:pl-9`
  - b) revert to `pr-9` with an exception in `test/validate-repo/lib/tailwind-classes.mjs`

## A3 Removing a filter chip returns the column to its initial filter mode

- Not in spec 01: removing a chip or "Clear filters" now resets the column to `table.initialState.columnFilterFns` (first listed mode only when the initial one is not offered). Before, it took the first mode of the list, which with modes on by default turns a multi-select column into `fuzzy` and a select column away from `equals` after one removal.
- Code: the chip remove and clear paths in `ST_FilterOptionMenu.tsx` / `filterSummary.utils.ts` (three bases), merged in `4a61e251`.

- Options:
  - a) Recommended: keep
  - b) revert to the first listed mode

## A4 Existing multi-select labels retranslated in every locale

- Spec 01 asked for three new keys; `filterArrIncludesSome` and `filterArrIncludesAll` already existed, so only `filterArrIncludesNone` is new. The builder also rewrote every locale's `filterArrIncludesSome` to "includes any", and `filterArrIncludesAll` in az, fr, hy, it, pt, pt-BR, ru, tr, uk, zh-Hans, zh-Hant where the old text was an imperative ("include everything").
- Code: `shared/locales/*.ts` (three bases), merged in `4a61e251`.

- Options:
  - a) Recommended: keep the new wording
  - b) revert the existing two keys to their old text, keep only `filterArrIncludesNone`
