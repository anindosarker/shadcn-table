# Popover-mode header widths (F38), tracker

Status: running
Branch `v0.8/fix-popover-widths`, worktree 03, PR #113
Gates:
- Repro on shipped code (9ec16645), `node scripts/check-pages.mjs --base base --url http://localhost:5341 /docs/examples/export-csv /docs/examples/export-pdf /docs/examples/popover-filters` with the new `headerLabelsFit` assertion: red as expected, export-csv and export-pdf `ID(14>0) First Name(72>22) Last Name(71>22)`; popover-filters green (alternate-column-filtering sets no sizes).
- `pnpm --filter shadcn-table-docs types:check` at 67e26904: green
- `pnpm --filter shadcn-table-docs lint` at 67e26904: green (9 existing warnings, 0 errors)
- `pnpm -w check:bases` at 67e26904: green
- `node scripts/check-pages.mjs d --base base --url http://localhost:5341` at 67e26904: green (254 passed)
- `node scripts/check-pages.mjs e --base base --url http://localhost:5341` at 67e26904: green (673 passed)
- `node scripts/check-pages.mjs b --base base --url http://localhost:5341` at 67e26904: green (284 passed)

- Milestone 01 F38 example widths: done (67e26904)

## Attention

- The ID column of export-to-csv and export-to-pdf is 112 px, not 56: in popover mode the header holds the column icon, the label, the funnel and the chevron, and the label measured 0 px wide at 56, 80 and 96 (14 px at 112). Revert to 56 only with a library change to the popover-mode header.
- `export-csv` and `export-pdf` page checks live in cluster D (`scripts/page-checks/d.mjs`), not B or E; the assertion went there, plus a shared `headerLabelsFit` helper in `_helpers.mjs` (inserted after `example`, away from the file end) used by the D, E and B entries.

## Notes

- First Name and Last Name drop `size` (default 180 from `ST_DefaultColumn`); Company 300, City default, Country 220 already fit.
- Headless measurements, `thead th .truncate` scrollWidth/clientWidth, every base at 1440 and 1280 on export-csv, export-pdf and popover-filters: no label clipped.
