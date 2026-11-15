# 52: Docs filter facts, tracker

Status: merged (e4b69548)
Branch `v0.9/docs-filter-facts`, worktree 07
Checks:
- Check: docs types, `pnpm --filter shadcn-table-docs types:check` at 823baa01: pass
- Check: guide renders, production build (`pnpm --filter shadcn-table-docs build`, `next start -p 5349`) `/docs/guides/column-filtering` at 823baa01: pass
- Check: grep, `grep -c "columnFilterModeOptions: \['contains'\]" apps/shadcn-table-docs/examples/<base>/react-query/TS.tsx` at 823baa01: pass (5 on base, radix, aria)
- Check: First Name filter mode menu lists one mode (Contains), `/docs/examples/react-query` on 5349 at 823baa01: pass; screenshots `test/.out/spec52/react-query-firstname-mode-base.png`, `test/.out/spec52/react-query-firstname-mode-radix.png`, `test/.out/spec52/react-query-firstname-mode-aria.png`
- Check: typed text filter "Eulah" on First Name filters the rows (aria) at 823baa01: pass
- Check: content diff, `git diff origin/claude/review --stat -- apps/shadcn-table-docs/content` at f3a441e7: pass (only `column-filtering.mdx`)
- Check: typecheck, `pnpm test typecheck --base radix` at f3a441e7: pass
- Check: lint, `pnpm test lint` at f3a441e7: pass (9 warnings, none in owned files)
- Check: validate-repo, `pnpm test validate-repo` at f3a441e7: pass
- Check: docs E2E, `pnpm test docs-e2e --base base --url http://localhost:5349` at f3a441e7: pass (2004 passed, 0 failed; server stopped)
- Check (verifier): Local CI and 2.2 lines above are valid for HEAD 85a63e2c (`git diff --name-only f3a441e7..HEAD` touches only the tracker); not rerun
- Check (verifier): Acceptance grep, `grep -c "columnFilterModeOptions: \['contains'\]"` at 85a63e2c: pass (5 on base, radix, aria)
- Check (verifier): Acceptance content diff, `git diff origin/claude/review --stat -- apps/shadcn-table-docs/content` at 85a63e2c: pass (only `column-filtering.mdx`)
- Check (verifier): Acceptance docs E2E, production build, `next start -p 5349`, `pnpm test docs-e2e --base base --url http://localhost:5349` at 85a63e2c: pass (getting-started 255, api 109, guides 701, examples 939 passed, 0 failed; server stopped)
- Check (verifier): Acceptance menu, First Name filter mode menu on `/docs/examples/react-query` on 5349 at 85a63e2c: pass (one item, Contains, on base, radix, aria); screenshots refreshed at `test/.out/spec52/react-query-firstname-mode-<base>.png`
- Check (verifier): P11 plays: none required; the spec adds no play and fixes no library behaviour (docs wording and example options only)
- Check (D99): format, `pnpm format` at 8f5b4ecc: pass (no diff)
- Check (D99): grep, `grep -c "columnFilterModeOptions: \['contains'\]"` and `grep -c "filterFn: 'contains'"` on `apps/shadcn-table-docs/examples/<base>/react-query/TS.tsx` at 8f5b4ecc: pass (5 and 5 on base, radix, aria)
- Check (D99): registry, `pnpm -w registry:items` at 9ac8432b: pass (no generated file changed)
- Check (D99): typecheck, `pnpm test typecheck --base radix` at 8f5b4ecc: pass
- Check (D99): lint, `pnpm test lint` at 8f5b4ecc: pass (9 warnings, none in owned files)
- Check (D99): validate-repo, `pnpm test validate-repo` at 8f5b4ecc: pass
- Check (D99): First Name filter mode menu on `/docs/examples/react-query`, production build, `next start -p 5349` at 8f5b4ecc: pass (one item, Contains, checked; mode button reads "contains", not auto; base, radix, aria); screenshots `test/.out/spec52/react-query-firstname-mode-base.png`, `test/.out/spec52/react-query-firstname-mode-radix.png`, `test/.out/spec52/react-query-firstname-mode-aria.png`
- Check (D99): typed "Eulah" in the First Name filter at 8f5b4ecc: pass (1 row on base, radix, aria; request `/api/data?start=0&size=10&filters=[{"id":"firstName","value":"Eulah"}]&globalFilter=&sorting=[]`, same shape as before)
- Check (D99): docs E2E, `pnpm test docs-e2e --base base --url http://localhost:5349` at 8f5b4ecc: pass (getting-started 255, api 109, guides 701, examples 939 passed, 0 failed; server stopped)

- Task 1 Guide wording: done (51f5ae5b)
- Task 2 React Query text columns: done (823baa01)
- Task 3 Cleanup and changelog: done (f3a441e7)
- D99 filterFn contains on the five text columns: done (9ac8432b) (D99)

## Attention
