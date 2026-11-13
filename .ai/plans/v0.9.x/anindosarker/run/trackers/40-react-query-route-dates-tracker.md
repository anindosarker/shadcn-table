# 40: Date filters compare dates, React Query route dates, tracker

Status: running
Branch `v0.9/react-query-route-dates`, worktree 07
Checks:
- Check: Task 1 reproduction, production build (`pnpm --filter shadcn-table-docs build`, `next start -p 5346`) at 9387a606, base, Playwright, locale en-GB: done, record below

- Task 1 Reproduce before the change: done
- Task 2 Route and example fix: planned
- Task 3 Format, changelog: planned

## Task 1 record (9387a606, before the change)

- `curl` of `/api/data?start=0&size=100&filters=[{"id":"lastLogin","value":"2025-11-02"}]` twice: total 26, then total 17; every returned `lastLogin` after 2025-11-02 both times, but no value repeats between the two responses (`getData()` re-randomizes `lastLogin` per call).
- Mode "greater than" (the column's default), date typed digit by digit `0`,`2`,`1`,`1`,`2`,`0`,`2`,`5`: the input shows `0002-11-02`, `0020-11-02`, `0202-11-02`, `2025-11-02`; no request while typing (spec 39 commits on Enter). After Enter one request, `filters=[{"id":"lastLogin","value":"2025-11-02"}]`: total 22, page dates 2025-12-20 to 2026-10-20 plus one 2025-11-02 16:19 local; the 10 rows shown are those returned. Shot: `40-shots/before-base-greater-than.png`.
- The filter chip's mode menu offers 14 modes for Last Login (`enableColumnFilterModes` defaults to true): Fuzzy, Contains, Starts With, Ends With, Equals, Not Equals, Between, Between Inclusive, Greater Than, Greater Than Or Equal To, Less Than, Less Than Or Equal To, Empty, Not Empty.
- Mode "less than", same typing: one request, `filters=[{"id":"lastLogin","value":"2025-11-02"}]` (no mode in it): total 26, every returned and shown row dated after 2025-11-02 (2025-11-08 to 2026-09-30). Shot: `40-shots/before-base-less-than.png`.
- Cause: the example offers every filter mode but sends only the value, and the route always keeps `lastLogin > value`; any mode other than "greater than" shows rows that do not match it ("less than" shows only later rows). Second defect: `getData()` draws new random `lastLogin` values on every request, so pages, refetches and the same filter return different rows from one request to the next. The date-only value is read as UTC midnight (`new Date('2025-11-02')`), not local midnight. The client sends no half-typed date.
