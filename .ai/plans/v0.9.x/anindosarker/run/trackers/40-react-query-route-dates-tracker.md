# 40: Date filters compare dates, React Query route dates, tracker

Status: running
Branch `v0.9/react-query-route-dates`, worktree 07
Checks:
- Check: Task 1 reproduction, production build (`pnpm --filter shadcn-table-docs build`, `next start -p 5346`) at 9387a606, base, Playwright, locale en-GB: done, record below
- Check: `curl -s 'localhost:5346/api/data?start=0&size=100&filters=%5B%7B%22id%22%3A%22lastLogin%22%2C%22value%22%3A%222025-11-02%22%7D%5D'` twice, production build at 636a19d2: pass; total 21 both times, every `lastLogin` after 2025-11-02 local midnight, the two responses byte-identical (`cmp`). `lastLogin` values, both runs: 2026-10-14T22:51 2026-01-02T14:20 2026-04-04T08:41 2026-01-24T23:11 2026-04-17T05:16 2025-11-27T02:16 2026-01-29T12:28 2026-02-09T06:00 2026-04-29T22:27 2026-11-08T01:40 2026-10-13T19:46 2026-05-04T03:30 2026-07-25T16:05 2026-01-08T13:12 2025-11-25T04:26 2026-09-29T05:34 2026-09-28T14:50 2026-03-28T05:59 2026-07-27T02:40 2026-07-14T23:58 2025-11-23T06:47 (UTC, to the minute)
- Check: page on the three bases (stored base pick, label read back: Base UI, Radix UI, React Aria), production build on 5346 at 636a19d2: pass. Greater than 2025-11-02 typed digit by digit: request carries `"mode":"greaterThan"`, total 21, the 10 shown rows dated 2025-11-27 to 2026-11-08; less than: `"mode":"lessThan"`, total 179, shown rows 2019 to 2024 (21 + 179 = 200); between inclusive 2026-01-01 to 2026-03-31 (filled): total 6, shown rows 2026-01-02 to 2026-03-28; equals 2026-01-31 (base): 1 row, 31/01/2026 14:47. Mode menu offers the eight date modes. Shots: `40-shots/after-base-greater-than.png`, `40-shots/after-radix-greater-than.png`, `40-shots/after-aria-greater-than.png`
- Check: `pnpm --filter shadcn-table-docs types:check` at 636a19d2: pass
- Check: `pnpm test typecheck --base base` at 130eff41: pass
- Check: `pnpm test lint` at 130eff41: pass, 9 warnings, none in the milestone's files
- Check: `pnpm test validate-repo` at 130eff41: pass
- Check: `pnpm test docs-e2e --base base --url http://localhost:5346` against the production build of 636a19d2 (130eff41 adds only CHANGELOG.md): pass, getting-started 233, api 109, guides 701, examples 939, 0 failed; server stopped after
- Check: P7 `git diff origin/claude/review -- packages/shadcn-table/registry/*/components/ui/shadcn-table/index.ts | grep '^-export'` at 130eff41: empty

- Task 1 Reproduce before the change: done (d8c21b56)
- Task 2 Route and example fix: done (636a19d2)
- Task 3 Format, changelog: done (130eff41)

## Task 1 record (9387a606, before the change)

- `curl` of `/api/data?start=0&size=100&filters=[{"id":"lastLogin","value":"2025-11-02"}]` twice: total 26, then total 17; every returned `lastLogin` after 2025-11-02 both times, but no value repeats between the two responses (`getData()` re-randomizes `lastLogin` per call).
- Mode "greater than" (the column's default), date typed digit by digit `0`,`2`,`1`,`1`,`2`,`0`,`2`,`5`: the input shows `0002-11-02`, `0020-11-02`, `0202-11-02`, `2025-11-02`; no request while typing (spec 39 commits on Enter). After Enter one request, `filters=[{"id":"lastLogin","value":"2025-11-02"}]`: total 22, page dates 2025-12-20 to 2026-10-20 plus one 2025-11-02 16:19 local; the 10 rows shown are those returned. Shot: `40-shots/before-base-greater-than.png`.
- The filter chip's mode menu offers 14 modes for Last Login (`enableColumnFilterModes` defaults to true): Fuzzy, Contains, Starts With, Ends With, Equals, Not Equals, Between, Between Inclusive, Greater Than, Greater Than Or Equal To, Less Than, Less Than Or Equal To, Empty, Not Empty.
- Mode "less than", same typing: one request, `filters=[{"id":"lastLogin","value":"2025-11-02"}]` (no mode in it): total 26, every returned and shown row dated after 2025-11-02 (2025-11-08 to 2026-09-30). Shot: `40-shots/before-base-less-than.png`.
- Cause: the example offers every filter mode but sends only the value, and the route always keeps `lastLogin > value`; any mode other than "greater than" shows rows that do not match it ("less than" shows only later rows). Second defect: `getData()` draws new random `lastLogin` values on every request, so pages, refetches and the same filter return different rows from one request to the next. The date-only value is read as UTC midnight (`new Date('2025-11-02')`), not local midnight. The client sends no half-typed date.

## Attention

- In a date column's Between or Between Inclusive mode, typing a date digit by digit into the Min or Max field (react-query example, base, production build) clears the field on the first key and commits `null` for that bound; a filled or picked value works; the range fields are library code outside this milestone.
- The react-query example still offers every filter mode on its text columns while its route matches those by "contains" only; this milestone restricts and sends modes for Last Login only, as spec 40 scopes it.
