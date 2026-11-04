# Attention, 2026-11-04

## A1 The view settings row says "Row Numbers", the demo says "Row numbers"

- The localization key `rowNumbers` already existed with the text "Row Numbers" (title case), used by the current row numbers display column; spec 01 listed it among the new keys with "Row numbers" (sentence case, the demo's style). The builder kept the existing text so no current caller changes.
- Options:
  - a) Recommended: keep "Row Numbers" for the existing key; spec 04 renders the view settings row with it (one string, title case like `showHideColumns`).
  - b) Change the key's text to "Row numbers" in the 39 locale files' English fallback (`en.ts` only; other locales keep their own casing).

## A2 v0.8 commits carry no Claude-Session line

- Workflow sub-agents receive no harness reminder, so spec 01's eight commits, PR #97 and the round ABC commits so far have no `Claude-Session:` line; P5 requires it. The main session cannot derive the URL. Pushed commits are not rewritten (P1).
- Options:
  - a) Recommended: the owner pastes the session URL; the workflow agent rules carry it from then on (commits, PR bodies, merge commits).
  - b) Accept the gap on branch commits; merge commits carry the line once supplied.
  - c) No line anywhere for v0.8.0, noted in the handoff.

## A3 Header cells show no vertical hairline between them at rest

- The demo captures (`reference/01-default-light.png`, `01-default-dark.png`) show a hairline between every header cell at rest; the built header shows one only on the hovered or open cell. The build follows the D2 addendum (the band is told apart by the muted label, the bottom hairline and the chevrons only) and D6 (the resize hairline is invisible at rest); the demo at capture time disagrees with that text. Spec 03's judges passed 3 of 3 on the decisions.
- Options:
  - a) Recommended: keep as built (D2 addendum and D6 as written; the shadcn data tables the owner checked show no column dividers in the header).
  - b) Follow the capture: a `border-e` hairline on every header cell at rest, and D2 and D6 get an addendum.

## A4 The sort editor ignores maxMultiSortColCount

- "Add sort" stays available until every sortable column has a rule (`components/toolbar/ST_SortPopover.tsx:86`), so a table with `maxMultiSortColCount` set can exceed it through the editor. Found by spec 06 while documenting; recorded as F7. Choice: fix before 0.8.0 (one fix story, delays the release by one round) or ship and fix in 0.8.1.
- Options:
  - a) Recommended: fix in 0.8.1; the release gate does not cover it and the option is rarely set.
  - b) Fix story now, before the release workflow runs.

## A5 The columns menu shows no column icon

- D3 says the optional `columnDef.icon` shows in the header, the chips and the columns menu; the shipped `ST_ShowHideColumnsMenuItems.tsx` renders no icon. The docs describe what shipped (header, chips, column picker).
- Options:
  - a) Recommended: keep as shipped for 0.8.0, D3 addendum; add the icon in 0.8.1.
  - b) Fix story now.

## A6 Every built-in display column is locked during a drag

- D21 says only the row numbers column is locked; shipped, `ST_DefaultDisplayColumn.enableColumnOrdering: false` (`hooks/useST_TableOptions.ts:23`) locks select, expand, pin, drag and numbers; only row actions is draggable. The docs describe what shipped.
- Options:
  - a) Recommended: keep (display columns at fixed positions is the conventional behaviour), D21 addendum.
  - b) Unlock all but row numbers per D21, fix story.

## A7 Tint tokens cannot be set from an ancestor

- D23 reads as if a consumer could set `--st-stripe` and the other three on any ancestor; shipped, `ST_TableLayout.tsx:23-24` declares the four tokens on the table root, so only `stTableLayoutProps.className` overrides them. The tint-tokens guide says so.
- Options:
  - a) Recommended: keep; override through the root className is the documented way, D23 addendum.
  - b) Declare the tokens as fallbacks (`var(--st-stripe, <default>)`) so an ancestor value wins; fix story.

## A8 The docs home demo still shows subheader filters

- `apps/shadcn-table-docs/components/dev-home/v12/signal-table.tsx:156` pins `columnFilterDisplayMode: 'subheader'` so its scripted Filtering step keeps typing into the header input; the first table a visitor sees is the 0.7 look, not the shipped chips (spec 06 review, minor).
- Options:
  - a) Recommended: rework the demo's Filtering step to open the chip editor, in 0.8.1 with the release notes review.
  - b) Fix story now.
