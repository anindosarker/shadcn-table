# Attention, 2026-11-01

## A28 The pinned-edge shadow sits on the cell, not on its `::before` backdrop

- Spec 06.1 1.6.2 put the outward shadow on the pinned cell's `::before`; body cells are `overflow-hidden` (`ST_TableBodyCell.tsx:39`), which clipped it, so the builder moved it to the cell itself (`data-[pinned=true]:shadow-[...]` with the `rtl:` mirror) and the RTL story reads the cell's computed `box-shadow`. Same color, blur and direction as decided (D47). Spec text 1.4, 1.6.2 and 1.6.4 still say `::before`.
- Keep (spec wording updated at triage) or revert (needs the clipping solved another way).

## A29 Sub-agent sandboxes cannot spawn the three judges

- The 06.1 coder, fixer and verifier each reported no agent-spawn tool, so the judged Acceptance clause was self-judged by each and the three fable judges ran from the main session afterwards (result in `trackers/06.1-tracker.md`). Every judged spec of this template has the same gap.
- Process: the workflow template gives the judged clause to the main session (a judges step after verify), or the verifier gets an agent tool.

## A30 The `pages` CI job takes 14 to 15 minutes per base, not the 8 the spec estimated

- Each leg builds the docs app, installs Chromium and runs the five page-check clusters; the build and the Playwright install dominate. The job runs the five clusters to the end and reports red once (`fail-fast: false` on the matrix), a builder judgment call. Accept, or split the build into a shared artifact later.

## A31 A local `next start` on a port other than 5320 looks for `.next-<port>`

- `next start -p <port>` sets `PORT`, so `next.config.mjs` resolves `distDir` to `.next-<port>` and finds no build unless `NEXT_DIST_DIR=.next` is set (the 0.7.0 gotcha, unchanged by 08.1). CI starts on 5320 and is unaffected. Accept, or make `distDir` depend on `next dev` only.

## A32 The five aria anchor spans needed a React Aria role to stay warning-free

- `Pressable` checks an interactive role on any non-native element even with `isDisabled`, and nothing else registers the `MenuTrigger` press responder, so the 10.1 builder gave the spans `role="button"` under `aria-hidden`, which D26 had dropped (F39, F49). The review flagged the contradiction; the run kept D26 and switched the anchor to an `<a>` element without `href` or role (React Aria skips the role check for `a`), still `aria-hidden`, `tabIndex -1` and `inert`.
- Keep the `<a>` anchor (D26 holds, one addendum naming the element) or accept `role="button"` on a hidden span.

## A33 `ST_TableLayout` changed in the three bases, against spec 10.1 1.6.4

- The layout picks `onKeyDown` and `tabIndex` from `containerProps` instead of spreading them, so the new `data-st-full-screen` attribute never reached the built-in container; the builder added that one line per base. Keep.

## A34 Aria checkboxes and the grouping value lost their hover tooltips

- Spec 10.1 replaces the tooltip wrappers on aria `ST_SelectCheckbox`, `ST_FilterCheckbox` and the row-expand grouping value with `aria-label` or `title`, since React Aria's `Focusable` cannot wrap them without a warning. This supersedes the D42 line that kept those wrappers. Base and radix still show the tooltips. Accept the aria difference, or find a tooltip form for them later.

## A35 The aria progress bar's `aria-label` is the English "Loading"

- No `ST_Localization` key names the loading state; adding one widens the type and every locale file. The label is overridable through `stLinearProgressProps`. Accept, or add a localization key in a later cycle.

## A36 The full-screen Escape listener matches any table's container

- The document capture listener matches `[data-st-full-screen]` anywhere, so with two tables on a page Escape on a non-editable element inside table B leaves table A's full screen. One table per page is unaffected. A tighter match needs a container ref in `containerProps` (type widening, D29). Accept for 0.7.1, or widen later.

## A37 The aria multi-select chip list got an `aria-label` beyond the spec's table

- Zero React Aria warnings needed one more label than spec 10.1 1.6.2 listed: the `TagGroup` of the multi-select filter chips in aria `ST_FilterTextField.tsx` now carries the filter label as `aria-label`. Same localization string the field uses. Keep.

## A38 A consumer lint reports one unused disable directive in the installed library

- `gate-base` `npx eslint components/ui/shadcn-table` (stock `eslint-config-next`) prints one warning: `shared/utils/utils.ts:32` "Unused eslint-disable directive (no problems were reported from '@typescript-eslint/no-deprecated')". The directive guards the `navigator.platform` fallback (D11) and is needed under the library's type-aware config only; a consumer without `no-deprecated` sees it as unused, so D17's zero-problem goal misses by one warning. The 0.7.0 base gate never ran (A21), so this is the first time it shows. Everything else in the 09.1 gate passed in all three apps.
- Options: a) replace the `navigator.platform` fallback with a non-deprecated read (`navigator.userAgent`) so no directive is needed (amends D11); b) keep the directive and accept one consumer warning; c) note in the install docs that `reportUnusedDisableDirectives` may flag it.
