# Attention, 2026-11-08

## A1 Column size reset listener stays until the width transition ends
[D10]

- Epic 03 said the reset helper listens for `transitionend` with `{ once: true }`; the merged code keeps listening until a `width` or `min-width` transitionend instead, because other transitions (button colors) bubble to the table first and `once` would leave `data-size-resetting` stuck.
- Code: `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/shared/utils/column.utils.ts`, `resetColumnSizeAnimated`. No timer, as D5 says.

- Options:
  - a) Recommended: keep (listener removes itself on the first `width` or `min-width` transitionend)
  - b) revert to `{ once: true }` as the epic wrote it

## A2 Select clear button padding uses ltr:pr-9 rtl:pl-9, not pr-9
[D11]

- D1 names `pr-9` for the select trigger; the merged code uses `ltr:pr-9 rtl:pl-9`, because `pr-9` fails the logical-direction rule of `pnpm test validate-repo`, which spec 01 Acceptance requires green. The chevron sits left of the clear button as D1 wants, and RTL pads the right side too.
- Code: `components/inputs/ST_FilterTextField.tsx`, the `SelectTrigger` className (three bases).

- Options:
  - a) Recommended: keep `ltr:pr-9 rtl:pl-9`
  - b) revert to `pr-9` with an exception in `test/validate-repo/lib/tailwind-classes.mjs`

## A3 Removing a filter chip returns the column to its initial filter mode
[D12]

- Not in spec 01: removing a chip or "Clear filters" now resets the column to `table.initialState.columnFilterFns` (first listed mode only when the initial one is not offered). Before, it took the first mode of the list, which with modes on by default turns a multi-select column into `fuzzy` and a select column away from `equals` after one removal.
- Code: the chip remove and clear paths in `ST_FilterOptionMenu.tsx` / `filterSummary.utils.ts` (three bases), merged in `4a61e251`.

- Options:
  - a) Recommended: keep
  - b) revert to the first listed mode

## A4 Existing multi-select labels retranslated in every locale
[D13]

- Spec 01 asked for three new keys; `filterArrIncludesSome` and `filterArrIncludesAll` already existed, so only `filterArrIncludesNone` is new. The builder also rewrote every locale's `filterArrIncludesSome` to "includes any", and `filterArrIncludesAll` in az, fr, hy, it, pt, pt-BR, ru, tr, uk, zh-Hans, zh-Hant where the old text was an imperative ("include everything").
- Code: `shared/locales/*.ts` (three bases), merged in `4a61e251`.

- Options:
  - a) Recommended: keep the new wording
  - b) revert the existing two keys to their old text, keep only `filterArrIncludesNone`

## A5 Admins can bypass the release approval gate
[D16]

- The `release` environment created by spec 05 keeps GitHub's default `can_admins_bypass: true`, because the spec's PUT body does not set it: a repository admin can still merge past the owner's Approve on Prepare Release.
- Setting: `gh api repos/anindosarker/shadcn-table/environments/release` (created in `aeca4d55`, E2 05).

- Options:
  - a) Recommended: keep the default (the owner is the only admin)
  - b) set `can_admins_bypass` to false with one more PUT

## A6 The sheet part lives in the docs only, not in the registry
[D17]

- Spec 04 said `pnpm add-part radix sheet`; the merged code instead lists `sheet` in `EXTRA_PARTS` of `apps/shadcn-table-docs/lib/install.mjs`, so `lib:install <base>` writes `components/ui-<base>/sheet.tsx` for every base and the registry gains no part the library does not use.

- Options:
  - a) Recommended: keep (docs only, like alert-dialog)
  - b) revert: add `sheet` to the registry for radix, base and aria

## A7 The theme shortcuts depend on a six-day-old beta
[D18]

- `@tanstack/react-hotkeys` is `^0.22.0`, a beta published 2026-11-02, added to `apps/shadcn-table-docs/package.json` by spec 04 (D2).

- Options:
  - a) Recommended: keep `^0.22.0`
  - b) pin the exact version `0.22.0`

## A8 Three theme controls change nothing visible in the docs
[D26]

- Menu Color, Menu Accent and Style in the theme panel have no visible effect: the docs `components/ui-<base>/` parts carry no `cn-*` hooks for them to target, and spec 04 does not regenerate those parts. Tokens, fonts and radius do apply.

- Options:
  - a) Recommended: keep the controls; hook the docs parts in a later spec
  - b) hide the three controls until the hooks exist

## A9 The home demo label reads the theme store, not the page attribute
[D19]

- Spec 04 1.6.7 said `no-step-3.tsx` observes `data-design-system` with a MutationObserver; the merged code reads the preset from `useDesignSystem()`, the same store the panel writes, and the label updates on every pick (panel, shortcut, cycle button).

- Options:
  - a) Recommended: keep `useDesignSystem()`
  - b) revert to the MutationObserver as 1.6.7 words it

## A10 Undo in the Colors tab steps back one keystroke at a time

- Each valid keystroke in a Colors tab input is one history entry, so undo walks back through a typed value one valid prefix at a time (spec 04 does not say).

- Options:
  - a) Recommended: keep
  - b) record a token edit on blur, one undo step per edit
