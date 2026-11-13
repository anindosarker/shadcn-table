# 52: Docs filter facts, tracker

Status: running
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

- Task 1 Guide wording: done (51f5ae5b)
- Task 2 React Query text columns: done (823baa01)
- Task 3 Cleanup and changelog: done (f3a441e7)

## Attention

- The five text columns keep their default `fuzzy` filter function (the spec adds only `columnFilterModeOptions`), so the mode button reads "auto" and the one listed mode, Contains, shows unchecked until picked; adding `filterFn: 'contains'` to those columns would make the menu show it as active.
