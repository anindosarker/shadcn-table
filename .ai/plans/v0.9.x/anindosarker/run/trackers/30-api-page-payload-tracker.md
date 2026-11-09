# 30: API page payload, tracker

Status: done
Branch `v0.9/api-page-payload`, worktree 06 (`/Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/06`)
Checks:

- `pnpm --filter shadcn-table-docs types:check` at 21bd1d41: pass
- `pnpm --filter shadcn-table-docs lint` at 21bd1d41: pass (0 errors, 9 existing warnings in examples)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5350 pnpm --filter shadcn-table-docs build` at abd7435c (before) and 21bd1d41 (after): pass
- `curl -s -o api.html -w '%{size_download}' localhost:5350/docs/api/table-options` at 21bd1d41: 268282 (under 819200): pass
- `grep -c 'enableColumnFilters' api.html` at 21bd1d41: 1: pass
- `pnpm test docs-e2e --base base --url http://localhost:5350 --section api` at 21bd1d41: pass (109 passed, 0 failed)
- `pnpm format` at d10b2e5f: pass (no change)
- `pnpm test typecheck --base base` at d10b2e5f: pass
- `pnpm test lint` at d10b2e5f: pass (0 errors, 9 existing warnings)
- `pnpm test validate-repo` at d10b2e5f: pass
- `pnpm test docs-e2e --base base` at d10b2e5f: pass (getting-started 205, api 109, guides 692, examples 939 passed, 0 failed)
- Playwright probe on 5350 at 21bd1d41: pass (211 rows hydrated; search `enableColumnFilters` leaves 2 rows; clicking `#enableColumnFilters-prop` copies `enableColumnFilters`; name column header sticky (pinned); JavaScript disabled: 211 static rows with `#enableColumnFilters-prop`)

- Task 1 static table, shell, client moves: done (21bd1d41)
- Task 2 production proof: done (57bf33a1)
- Task 3 cleanup: done (d10b2e5f)

## Notes

- API page HTML before (abd7435c) and after (21bd1d41), bytes, `<tr` count:

| Page | Before | After |
| --- | --- | --- |
| `/docs/api/table-options` | 1937039 (423 tr) | 268282 (212 tr) |
| `/docs/api/column-options` | 774287 (131 tr) | 237012 (66 tr) |
| `/docs/api/state-options` | 527710 (71 tr) | 223010 (36 tr) |
| `/docs/api/table-instance-apis` | 1175076 (277 tr) | 239792 (139 tr) |
| `/docs/api/column-instance-apis` | 630446 (111 tr) | 238485 (56 tr) |
| `/docs/api/row-instance-apis` | 519275 (79 tr) | 235441 (40 tr) |
| `/docs/api/cell-instance-apis` | 320081 (19 tr) | 228052 (10 tr) |

- Anchors: the static rows carry the same ids as the interactive copy buttons (`<name>-prop`, `-column-option`, `-state-option`, `-table-instance-api`, `-column-instance-api`, `-row-instance-api`, `-cell-instance-api`); guide subsets (for example `/docs/guides/sorting`) get them too.
- `prop-table-shell.tsx` is one generic client shell (a context carrying the static rows plus `PropTableFallback` as the `loading` component); the `dynamic(() => import('./<x>-table.client'), { ssr: false, loading: PropTableFallback })` call sits in each `<x>-table.tsx`, since next/dynamic needs the literal import and `loading` gets no props.
- The static wrapper has no table id, so the docs-e2e `names()` locator (`#props-table table tbody tr td:nth-child(3)`) only matches the hydrated table.
- The changelog heading is `#### Spec 30 API page payload` (P9, a spec with several milestones), not the spec title of 1.6.1.

## Attention
