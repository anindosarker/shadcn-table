# Richer live demo (Q63), tracker

Status: done
Files owned: apps/shadcn-table-docs/examples/{base,radix,aria}/live-demo/TS.tsx, apps/shadcn-table-docs/examples/{base,radix,aria}/live-demo/makeData.ts, apps/shadcn-table-docs/content/docs/getting-started/usage.mdx, apps/shadcn-table-docs/content/docs/getting-started/introduction.mdx, test/docs-e2e/lib/getting-started.mjs, test/docs-e2e/lib/helpers.mjs; generated: apps/shadcn-table-docs/examples/map.tsx, apps/shadcn-table-docs/registry.json; shared: CHANGELOG.md
Depends on: none
Branch `v0.9/fix-richer-live-demo`, worktree 06
Checks:
- Check: typecheck, `pnpm test typecheck --base base` at faf61b70: pass (tsc clean)
- Check: typecheck, `pnpm test typecheck --base radix` at faf61b70: pass (tsc clean)
- Check: typecheck, `pnpm test typecheck --base aria` at faf61b70: pass (tsc clean)
- Check: lint, `pnpm test lint` at faf61b70: pass (9 warnings, pre-existing)
- Check: validate-repo, `pnpm test validate-repo` at faf61b70: pass, "bases identical, icon maps complete, tailwind valid, registry valid, registry fresh, 40 unit tests"
- Check: browser on a production build, `pnpm --filter shadcn-table-docs build` then `next start -p 5352` and `pnpm test docs-e2e --base <b> --url http://localhost:5352 /docs/getting-started/usage /docs/getting-started/introduction` for base, radix, aria at 550daab4: pass; on both pages the live-demo panel renders 10 rows, and the select (State, Ohio: 3 rows), range (Age 30 to 40: 6), date (Joined after 2023-01-01: 6) and multi-select (Status Suspended: 4) filters open from the Filter button and filter rows
- Check: docs-e2e, `pnpm test docs-e2e --base base --url http://localhost:5352` (production build of faf61b70) at faf61b70: pass, 4 sections, 108 pages
- Check: docs-e2e, `pnpm test docs-e2e --base radix --url http://localhost:5352` (same build) at faf61b70: pass, 4 sections, 108 pages
- Check: docs-e2e, `pnpm test docs-e2e --base aria --url http://localhost:5352` (same build) at faf61b70: pass, 4 sections, 108 pages
- Check: format, `pnpm format` at faf61b70: no change
- Check: browser, production build at 92ff50df, base usage: select, range, date, multi-select pass (verifier, Playwright: 6 columns, 1-10 of 20; State Ohio 3 rows, Age 30 to 40 6, Joined after 2023-01-01 6, Status Invited and Suspended 9, Clear filters restores 10 of 20 each time; no console error), screenshot /tmp/e11-richer-demo/base-usage.png
- Check: browser, production build at 92ff50df, base introduction: select, range, date, multi-select pass (verifier, Playwright: 6 columns, 1-10 of 20; State Ohio 3 rows, Age 30 to 40 6, Joined after 2023-01-01 6, Status Invited and Suspended 9, Clear filters restores 10 of 20 each time; no console error), screenshot /tmp/e11-richer-demo/base-introduction.png
- Check: browser, production build at 92ff50df, radix usage: select, range, date, multi-select pass (verifier, Playwright: 6 columns, 1-10 of 20; State Ohio 3 rows, Age 30 to 40 6, Joined after 2023-01-01 6, Status Invited and Suspended 9, Clear filters restores 10 of 20 each time; no console error), screenshot /tmp/e11-richer-demo/radix-usage.png
- Check: browser, production build at 92ff50df, radix introduction: select, range, date, multi-select pass (verifier, Playwright: 6 columns, 1-10 of 20; State Ohio 3 rows, Age 30 to 40 6, Joined after 2023-01-01 6, Status Invited and Suspended 9, Clear filters restores 10 of 20 each time; no console error), screenshot /tmp/e11-richer-demo/radix-introduction.png
- Check: browser, production build at 92ff50df, aria usage: select, range, date, multi-select pass (verifier, Playwright: 6 columns, 1-10 of 20; State Ohio 3 rows, Age 30 to 40 6, Joined after 2023-01-01 6, Status Invited and Suspended 9, Clear filters restores 10 of 20 each time; no console error), screenshot /tmp/e11-richer-demo/aria-usage.png
- Check: browser, production build at 92ff50df, aria introduction: select, range, date, multi-select pass (verifier, Playwright: 6 columns, 1-10 of 20; State Ohio 3 rows, Age 30 to 40 6, Joined after 2023-01-01 6, Status Invited and Suspended 9, Clear filters restores 10 of 20 each time; no console error), screenshot /tmp/e11-richer-demo/aria-introduction.png

- Task 1 map: done (b75514a0)
- Task 2 example per base: done (b75514a0, 550daab4)
- Task 3 embeds and generated files: done (b75514a0, regenerated after merge 6bb4350b with no diff)
- Task 4 docs e2e: done (550daab4)
- Task 5 checks: done (faf61b70)
- Task 6 cleanup and changelog: done (faf61b70)

## Attention
- The example is named `live-demo` (registry item `example-live-demo`); its columns are First Name, Last Name, State, Age, Joined and Status with Active, Invited and Suspended as the statuses.
- The Introduction's sentence before the demo now reads "A live demo: sorting, filtering, search, pagination and column hiding, all on by default, with select, range, date and multi-select filters on State, Age, Joined and Status."; the Usage Live Example got one new sentence before the demo.
- A `filterVariant: 'date'` column whose accessor returns a `Date` does not filter in the chips editor: the native date input sets a `YYYY-MM-DD` string, `greaterThan` then compares it with the Date's `toString()`, so every row matches; the live demo keeps Joined as an ISO string (as persistent-view does), but the advanced and react-query examples use a Date accessor with the date filter.
- On React Aria the multi-select filter's option list opens on ArrowDown or the chevron, not on a click into its input as on Base UI and Radix.
- Verifier: in the chip editor, Escape after picking a State value leaves the editor popover open on Base UI and React Aria (Radix closes it); on React Aria the open editor also blocks the Clear filters button until an outside click closes it. This is library behavior, not part of this fix.
- Verifier: at the docs content width the Status column is partly cut off and needs the table's horizontal scroll on both pages.
