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
[D23]

- Each valid keystroke in a Colors tab input is one history entry, so undo walks back through a typed value one valid prefix at a time (spec 04 does not say).

- Options:
  - a) Recommended: keep
  - b) record a token edit on blur, one undo step per edit

## A11 Random in the theme panel keeps its curated presets through a private decoder
[D31]

- Spec 08 removed the preset-code codec, but the Random button (kept by D21) decoded its curated presets with it; the builder kept Random working with a private `curatedPreset` decoder and a `sameLook` compare in `apps/shadcn-table-docs/lib/design-system/config.ts`, so `decodePreset` from `shadcn/preset` stays imported. Merged in 9d582dcd.

- Options:
  - a) Recommended: keep
  - b) revert: drop `SHUFFLE_PRESETS`, Random shuffles by `randomFields` only, `decodePreset` import gone

## A12 How dev takes the installation reference refresh while E4 sits on claude/review
[D30]

- The 0.9.0 suite on `dev` (df90bd27) is green except the installation-e2e reference diff (F20); the fix milestone refreshes six PNGs on a branch cut from df90bd27 and merges it into `claude/review`. P1 says `dev` is then fast-forwarded from `claude/review` again, but `claude/review` now also carries the E4 merges 11 (d7ee15f3) and 08 (9d582dcd), which D15 keeps out of 0.9.0. The Release PR waits on this.

- Options:
  - a) Recommended: merge the fix branch `v0.9/refresh-installation-references` into `dev` directly (`dev` = df90bd27 plus the six PNGs), the one exception to P1 for this release; `claude/review` keeps everything.
  - b) fast-forward `dev` to `claude/review`: 0.9.0 ships E4 08 and 11 (and whatever else merges before the PR opens).

## A13 The F22 fix has no play that fails on the shipped code
[D33]

- Fix milestone `stored-view-page-index` (F22, merged 811045dc) changed how a stored rows-per-page is restored so the page index stays, but no story play exercises a table with `initialState.pagination.pageIndex` above 0, so P11 (a fix's play fails on the shipped code first) has no red line; the spec 12 `Persistence` play stays green before and after.

- Options:
  - a) Recommended: accept as is; the behavior is covered by the three typechecks and the Persistence play, the page-index case is a one-line spec clause
  - b) a follow-up fix milestone adds a `Persistence` play variant with `pageIndex: 2` in `ViewSettings.stories.tsx`, red on 117a81b5, green on 811045dc

## A14 The pre-paint script creates the style sheet link, not the layout
- Spec 15 section 1.6.3 has `app/layout.tsx` render the active style's `<link>` and the pre-paint script swap it; built that way, a page with a stored style failed React 19 hydration (error #418, links in `<head>` matched by href) and a second link appeared. The builder moved the link creation into the pre-paint script in `lib/design-system/config.ts` (`blocking=render`), `app/layout.tsx` renders no link; every check green, merged in 5df252e9.

- Options:
  - a) Recommended: keep (amend spec 15 1.6.3 to match)
  - b) revert to a server-rendered link in `app/layout.tsx` and solve the hydration mismatch another way (the script would then suppress or match the default link)

## A15 Every per-style sheet build runs through the optimizer, not only --minify

- Spec 15 section 1.6.2 says only `--minify` passes a sheet through the optimizer and `predev` leaves it readable; `lib/build-styles.mjs` runs `optimize()` on every build (the flag only adds minification) so the flattened nesting and prefixes match the root bundle. Recorded under the tracker's Notes by the builder; merged in 5df252e9.

- Options:
  - a) Recommended: keep (amend spec 15 1.6.2)
  - b) revert: optimizer only under `--minify`
