# Docs polish (F32, F33, F34, F35, F37), tracker

Status: verified
Branch `v0.8/docs-polish`, worktree 02, PR #112
Gates:
- `pnpm --filter shadcn-table-docs types:check` at fe725e75: green
- `pnpm --filter shadcn-table-docs lint` at fe725e75: green (9 warnings, none new: the advanced example's `<img>` and earlier ones)
- `pnpm -w check:bases` at fe725e75: green
- `node scripts/check-pages.mjs b --base radix --url http://localhost:5355` at fe725e75: green (283 passed)
- `node scripts/check-pages.mjs d --base radix --url http://localhost:5355` at fe725e75: green (255 passed; the advanced dialog check also green on base and aria)
- `node scripts/check-pages.mjs e --base radix --url http://localhost:5355` at fe725e75: green (672 passed, demo loop on the three bases)
- `node .ai/plans/v0.8.x/anindosarker/reference/06.2-check.mjs apps/shadcn-table-docs/examples/radix` at fe725e75: green (217 files, no reports)
- `pnpm --filter shadcn-table-docs types:check` at fe725e75 (verifier): reused, `fe725e75..7971d3a1` touches only the tracker and CHANGELOG.md
- `pnpm --filter shadcn-table-docs lint` at fe725e75 (verifier): reused, same reason
- `pnpm --filter shadcn-table-docs build` at 7971d3a1 (verifier): green
- `node scripts/check-pages.mjs --base radix --url http://localhost:5345` (all clusters) at 7971d3a1 (verifier): green (1845 passed, 0 failed)
- `node scripts/check-pages.mjs --base base --url http://localhost:5345` (all clusters) at 7971d3a1 (verifier): green (1845 passed, 0 failed)
- `node scripts/check-pages.mjs --base aria --url http://localhost:5345` (all clusters) at 7971d3a1 (verifier): green (1845 passed, 0 failed)
- `node .ai/plans/v0.8.x/anindosarker/reference/06.2-check.mjs apps/shadcn-table-docs/examples/{radix,base,aria}` at 7971d3a1 (verifier): green (217 files each, no reports)
- CI: pending on PR #112

- Milestone 01 persistent view as the demo (F35, D55): done (58787918)
- Milestone 02 home demo headers and interactions (F32, F33): done (0bba3663)
- Milestone 03 theme demo pacing and frame (F34): done (fe725e75)
- Milestone 04 advanced example dialog (F37): done (63af748f)

## Attention

- The docs build regenerates `apps/shadcn-table-docs/registry.json` with new `registryDependencies` (`dialog` for the advanced examples, `badge` for persistent-view) that the branch does not commit; the verifier restored the file, since P9 leaves `registry.json` to the merger. The merger must regenerate it, or the hosted advanced and persistent-view items install without those parts.
- Home demo frame is about 1085 px at 1440 px, not the 960 px F32 named: the header demo's seven sizes plus the actions column total 1218 px, so 960 px cannot show them without scrolling. The demo band now runs gutter to gutter (`v12-wide`, as the theme demo) with a 240 px steps panel beside the table from 1440 px and the steps under it below; Name is 196 px (demo 260), Estimate 136 (120) and Priority 132 (120), because "Estimate" and "Priority" truncate at 120 px beside the header menu button. Revert path: `components/dev-home/v12/v12.css` (1440 px rule) and the three sizes in `signal-table.tsx`.
- Theme demo fix lives in `components/theme-demo/variants/whole-app.tsx` and `whole-app-site.tsx`, outside the story's listed files (`theme-demo.tsx` only mounts `WholeApp`): pacing constants (45 ms a character, 500 ms send, 1200 ms think, 8 s per theme) and the height thresholds (6 rows from 800 px, header from 860 px, form from 1000 px, toolbar and charts from 720 px). The table did not overflow at 1440x900; it overflowed at heights 780 to 850 and 920 to 999, and at 700.
- Persistent view tags cell shows "+n" as a Badge with a `title` listing every tag, not the demo's popover: the Popover part's API differs per base, and the example must stay identical on the three bases.
- Persistent view makeData gained `progress`, `prLink` and `archived` (the two draws it skipped to stay in step with the header demo), so the example has all 18 demo columns; the home demo reads the same file.

## Notes

- Column table, persistent-view example versus header demo (`header-demo.tsx`). Every column carries an `icon` (D45; the demo sets none). Both have Name as the only column with `enableColumnFilterModes` and the same eight `columnFilterModeOptions`.

| Column | Variant (ex / demo) | Filter fn | Renderer | Size (ex / demo) | Sorting |
| --- | --- | --- | --- | --- | --- |
| Name | text / text | default | plain / plain | 260 / 260 | default; orderable in the example (demo locks it, owner F35) |
| Status | select, statuses / same | default | Badge secondary + dot / same (OverflowText swapped for `truncate`) | 150 / 150 | default |
| Assignee | select, assignees / same | default | plain / plain (the demo has no assignee renderer) | 160 / 160 | default |
| Project | select, projects / same | default | plain / plain | 130 / 130 | default |
| Due | date / date | lessThan / lessThan | plain / plain (no due renderer in the demo) | 130 / 130 | default; locked (`enableColumnOrdering: false`) in both |
| Estimate | range / range | default | `{n}h` tabular / same (demo overflow tooltip meta dropped) | 120 / 120 | default |
| Priority | select, priorities / same | default | dot + label / same | 120 / 120 | `sortFn` by rank / same |
| Tags | multi-select, tags / same | arrIncludesSome / same | outline Badges, first 2 then "+n" / same, "+n" without popover (see Attention) | 200 / 200 | `enableSorting: false`, `enableGlobalFilter: false` in both |
| Reporter | select, reporters / same | default | plain / plain | 150 / 150 | default |
| Team | select, teams / same | default | plain / plain | 120 / 120 | default; locked in both |
| Sprint | select, sprints / same | default | plain / plain | 120 / 120 | default |
| Created | date / date | lessThan / same | plain / plain | 130 / 130 | default |
| Updated | date / date | lessThan / same | plain / plain | 130 / 130 | default |
| Story points | range / range | default | tabular number / same | 130 / 130 | default |
| Progress | range / range | default | bar + percent / same | 150 / 150 | default |
| PR link | text / text | default | link without the github.com prefix / same (title attribute for the full URL instead of the overflow tooltip meta) | 160 / 160 | default |
| Archived | checkbox / checkbox | default | square check icon / same | 110 / 110 | default; `enableGlobalFilter: false` in both |
| Notes | text / text | default | plain / plain | 260 / 260 | default |

- Home demo: the same seven definitions (Name to Priority) with Name 196, Estimate 136, Priority 132 (Attention), Estimate the only editable column.
- Home demo steps are beats in `signal-demo.tsx` (pulse, then the control: Sort picker and its Due option, search toggle and typing, the Estimate cell edit, Filter picker, Status option, the select and "In Review", the Project header and the D37 flip, View settings and the Alternating row colors switch); each step's state lands after its beats and on an interrupt, and the replay's clicks are untrusted events, so only a visitor's own pointer or key stops the replay. The loop reaches View settings about 26 s after it starts; `DEMO_TIMEOUT_MS` in `_helpers.mjs` went from 30 s to 45 s.
- Dev server port 5341 was taken by worktree 03; this run used 5355 and stopped it.
