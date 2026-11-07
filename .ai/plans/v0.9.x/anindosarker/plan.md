# v0.9.x plan

Decisions: [decisions.md](decisions.md). Sprints: [sprints.md](sprints.md). Epics implement decisions and never re-decide.

## Goals

- Fix the owner's v0.8 notes: filter modes and the select clear button, the pages footer row range and the compact mode, the column size reset animation, the static Storybook reset, the release bump approval, the theme customizer.
- Restructure the docs site: nav order, the examples pages, Storybook discoverability (decisions pending).

## Epics

| # | Epic | Scope |
|---|---|---|
| 01 | [Filter modes on by default, select clear button](epics/01-filtering.md) | Filter mode pickers show without a flag on every variant; the select clear button no longer covers the chevron |
| 02 | [Pages footer row range, compact mode](epics/02-pagination.md) | The pages footer shows the row range; the compact footer is named compact everywhere |
| 03 | [Column size reset animates](epics/03-resize-animation.md) | A double-click or menu reset of a column width animates in CSS, drags stay instant |
