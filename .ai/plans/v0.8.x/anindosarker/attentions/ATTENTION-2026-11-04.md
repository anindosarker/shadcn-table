# Attention, 2026-11-04

## A1 The view settings row says "Row Numbers", the demo says "Row numbers"

- The localization key `rowNumbers` already existed with the text "Row Numbers" (title case), used by the current row numbers display column; spec 01 listed it among the new keys with "Row numbers" (sentence case, the demo's style). The builder kept the existing text so no current caller changes.
- Options:
  - a) Recommended: keep "Row Numbers" for the existing key; spec 04 renders the view settings row with it (one string, title case like `showHideColumns`).
  - b) Change the key's text to "Row numbers" in the 39 locale files' English fallback (`en.ts` only; other locales keep their own casing).
