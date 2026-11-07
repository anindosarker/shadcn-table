# v0.9.x decisions

## Round 1: discussion, 2026-11-07

### D1 The select filter's clear button sits right of the chevron

- Fixes F1. In the three `ST_FilterTextField.tsx`, the select trigger's `pe-9` becomes `pr-9`, so tailwind-merge drops the base `pr-2` and the chevron moves left of the overlaid clear x.
- One play sets a select filter value and asserts the chevron is left of the clear button; it runs on the shipped code first and must fail there (v0.8.x P11).
- Stays: the clear addon overlaid at the end of the trigger; multi-select unchanged.

### D2 The palette button opens a theme customizer panel

- The docs nav keeps its palette button where it is (`components/theme-preset-switcher.tsx:85`, mounted at `lib/layout.shared.tsx:36` and `dev-home/v12/nav.tsx:63`); the light/dark toggle beside it stays. Clicking it opens a right-side panel instead of the six-preset dropdown. Reference: shadcnstudio.com/theme-generator (screenshot in chat, 2026-11-08).
- Panel layout, top to bottom: header (title, reset, close); Copy (the theme CSS and the preset code), Undo, Redo; Mode Light / Dark; Style; Icon Library (Lucide only, v0.7.x D38); Base Color; Theme; Menu Color; Menu Accent; Presets row with Import (paste a preset code), Random, and a preset select holding Default plus the 42 tweakcn palettes; tabs Colors, Typography, Other.
- Colors tab: one swatch and oklch input per token, light and dark, every token the theme CSS emits. Typography: font and heading font. Other: radius and chart color. Left out from the reference: Contrast, Hold to save, AI, Pro sync.
- Default is the docs' current Emerald look (`themes/emerald.css`), added as the `Default` preset; Reset returns to it. Mechanics ported from `test-projects/next-app/lib/design-system/*` (provider, generated CSS in a `<style>` element, pre-paint script); `themes/*.css`, `lib/theme-presets.ts` and the Random re-roll on load go; the home theme demo (`theme-demo/variants/no-step-3.tsx:203`) calls the new preset API.
- Every page load applies the default unless localStorage holds a user choice; the stored choice carries a timestamp and expires after 2 days.
- Shortcuts through TanStack Hotkeys (`@tanstack/react-hotkeys`, one scope, off while an input, textarea or the search dialog has focus), each shown as a kbd hint beside its control: `r` shuffle, `Shift+R` reset, `c` shuffle the color preset, `p` undo.

### D3 The version bump waits for the owner's approval

- Supersedes v0.8.x D88 on approval and the A23 default. A GitHub Environment `release` with the owner as required reviewer gates the bump job `prepare-release` (`pr.yml:165-222`): the job gets `environment: release`; every other job stays automatic. The owner creates the environment in Settings, Environments, and this decision is the one-time authorization for that setting (v0.8.x P7).
- The release PR (`dev` into `master`) is opened with its label and auto-merge enabled at creation. The run's flow: CI green, Prepare Release waits for review, the owner clicks Review deployments and Approve, the job pushes `chore: version <v>` to `dev`, CI reruns green, auto-merge merges, `release.yml` tags, verifies and publishes. A rejected review fails the job and pushes nothing.
- An agent never approves the deployment, not in the UI and not through `gh api .../actions/runs/<run_id>/pending_deployments`, although the owner's `gh` login could. The run posts "Prepare Release waits for your approval" and continues everything that does not depend on the merge; the owner approves with a click, or says "approve it" in chat for that one release.

### D4 Filter modes are on by default

- `enableColumnFilterModes` defaults to true (`features/stConfigFeature.ts:105`, `:561`, `useST_TableOptions.ts`); a consumer turns it off per table or per column as today. Material React Table defaults it off; this is a deliberate deviation.
- Mode lists stay as they are today for every variant (`shared/utils/filterSummary.utils.ts:46-65`, `ST_FilterOptionMenu.tsx:172`): text, autocomplete, select, date, datetime, time offer all 14 modes; range, date-range, datetime-range, time-range offer between and betweenInclusive; range-slider and checkbox offer none.
- Multi-select adds three menu entries after its 14, labelled Includes any (`arrIncludesSome`, the default fn), Includes all (`arrIncludesAll`) and Excludes (`arrIncludesNone`), with localization keys for the three labels.
- Chip labels show the mode as `/docs/examples/advanced` does today ("Email fuzzy: ..."); the subheader and popover display modes get the same default.
- The column-filtering guide and every docs example drop the explicit `enableColumnFilterModes: true`; one play per display mode asserts the picker appears without the flag (v0.8.x P11).

### D5 The column size reset animates, in CSS

- Double-click on the resize handle (`ST_TableHeadCellResizeHandle.tsx:64-70`) and the "Reset column size" menu item (v0.8.x D5 addendum) keep calling `column.resetSize()` and also set `data-size-resetting` on the table element; the attribute clears on the header cell's `transitionend`, with no timer.
- The transition is Tailwind classes on the th and td class strings, gated by the attribute the way the flip gates `transition-[translate]` (`ST_TableHeadCell.tsx:309`): `[table[data-size-resetting]_&]:transition-[width,min-width]`, 200 ms, ease-out, `motion-reduce:transition-none`. No JS animation, no frame loop, no change to `global.css`.
- Nothing else animates: drags stay instant, other width changes snap as today.
- One play asserts the attribute appears on double-click, clears after the transition, and the width lands on the default; it runs on the shipped code first and must fail there (v0.8.x P11).
