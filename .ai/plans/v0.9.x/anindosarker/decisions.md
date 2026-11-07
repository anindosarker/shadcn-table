# v0.9.x decisions

## Round 1: discussion, 2026-11-07

### D1 The select filter's clear button sits right of the chevron

- Fixes F1. In the three `ST_FilterTextField.tsx`, the select trigger's `pe-9` becomes `pr-9`, so tailwind-merge drops the base `pr-2` and the chevron moves left of the overlaid clear x.
- One play sets a select filter value and asserts the chevron is left of the clear button; it runs on the shipped code first and must fail there (v0.8.x P11).
- Stays: the clear addon overlaid at the end of the trigger; multi-select unchanged.

### D2 The palette button opens the theme customizer

- The docs nav keeps its palette button where it is (`components/theme-preset-switcher.tsx:85`, mounted at `lib/layout.shared.tsx:36` and `dev-home/v12/nav.tsx:63`); the light/dark toggle next to it stays. Reference: shadcnstudio.com's header palette button.
- The button opens a modal instead of the six-preset dropdown. The modal holds the next-app customizer panel as it is in `test-projects/next-app/components/theme-controls.tsx:101`: color preset (the 42 tweakcn palettes), style, base color, theme, chart color, font, heading font, radius, menu accent, menu color, preset code paste and copy, example presets, Shuffle and Reset.
- Mechanics ported from next-app `lib/design-system/*`: the provider, generated CSS in a `<style>` element on `:root[data-design-system]`, the pre-paint script, localStorage `st-design-system`. The static `themes/*.css`, `lib/theme-presets.ts` and the Random mode go; the home theme demo calls the new preset API.
- Global keyboard shortcuts, inactive while an input or textarea has focus: `r` shuffles the theme, `Shift+R` resets to the default, `c` shuffles the color preset, `p` returns to the previous theme (the shuffle history, back one step).
