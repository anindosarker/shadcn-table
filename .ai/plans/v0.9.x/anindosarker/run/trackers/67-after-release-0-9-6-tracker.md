# 67: Release 0.9.6, After release 0.9.6, tracker

Status: done (ad717f7c)
Branch `master`, worktree 03 for Task 3 (detached, operations only)
Checks:
- Check: release.yml, run 44454822363 at 022f8770: Check Release, Verify Deployment, Validate Production, Publish Release all `success`
- Check: tag, `git ls-remote --tags origin v0.9.6` at 022f8770: one line (022f8770), pass
- Check: release, `gh release view v0.9.6 --json tagName --jq .tagName`: `v0.9.6`, pass
- Check: version files, `https://www.shadcn-table.com/version.txt` and `https://storybook.shadcn-table.com/version.txt`: both `0.9.6`, pass
- Check: live Code tab, `https://storybook.shadcn-table.com/base/?path=/story/basic--basic`: pass; has `useShadcnTable(`, `<ShadcnTable`, columns, data; no `play`, `expect(`, `render: () => <BasicExample`. First lines: `import {` / `  ShadcnTable,` / `  useShadcnTable,` / `  type ST_ColumnDef,` / `} from '@/components/ui/shadcn-table';`
- Check: live Code tab, `https://storybook.shadcn-table.com/radix/?path=/story/basic--basic`: pass, same assertions, same first five lines
- Check: live Code tab, `https://storybook.shadcn-table.com/aria/?path=/story/basic--basic`: pass, same assertions, same first five lines
- Check: live Code tab, wrapper story of 0.9.4, `https://storybook.shadcn-table.com/base/?path=/story/features-aggregation--aggregation-and-grouping`: pass; hook, `<ShadcnTable`, columns, data; no `play`, `expect(`, one-line wrapper render. First lines: `import {` / `  type ST_ColumnDef,` / `  ShadcnTable,` / `  useShadcnTable,` / `} from '@/components/ui/shadcn-table';`
- Check: live Code tab, `WithQueryClient` story, `https://storybook.shadcn-table.com/base/?path=/story/features-editing--editing-crud`: pass; `<ShadcnTable` (no hook in this story), columns, data, QueryClient setup inline; no `play`, `expect(`, wrapper render. First lines: `import { type ReactNode, useMemo, useState } from 'react';` / `import {` / `  QueryClient,` / `  QueryClientProvider,` / `  useMutation,`
- Check: live docs panel, `https://www.shadcn-table.com/docs/examples/more/features-sorting--sorted-on-load`: pass; file `/SortedOnLoad.tsx`, `<ShadcnTable`, columns, data; no `play`, `expect(`. First lines: `import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';` / `import { Building2Icon, DollarSignIcon, MapIcon, UserIcon } from 'lucide-react';` / `type Employee = {` / `  firstName: string;` / `  lastName: string;`
- Check: live docs panel, `https://www.shadcn-table.com/docs/examples/more/features-aggregation--aggregation-with-selection`: pass; file `/AggregationWithSelection.tsx`, `<ShadcnTable`, columns, data; no `play`, `expect(`. First lines: `import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';` / `import {` / `  CakeIcon,` / `  DollarSignIcon,` / `  MapIcon,`
- Check: live docs panel, `https://www.shadcn-table.com/docs/examples/basic`: pass; still the example's file `/TS.tsx` with its source. First lines: `import { useMemo } from 'react';` / `import {` / `  ShadcnTable,` / `  useShadcnTable,` / `  type ST_ColumnDef,`
- Check: branches, `git rev-parse origin/claude/review origin/dev origin/master`: `claude/review` ad717f7c (`merge: master 0.9.6`), `dev` and `master` 022f8770. Not one sha three times: `claude/review` carries plan commits past `master`, as for 0.9.5
- Check: `git ls-remote --heads origin v0.9/filter-input-fixes`: one line, pass
- Check: validate-repo, `pnpm test validate-repo` at ad717f7c: pass

- Task 1: done (022f8770, run 44454822363)
- Task 2: done (022f8770); browser closed
- Task 3: done (ad717f7c)

## Attention

## Notes

- The live checks matched the words `columns` and `data` in each panel; the full "every name declared" test of `read-panels.mjs` ran in CI (Docs E2E `story code panels`), not against the live site.
- `/docs/examples/more/features-aggregation--aggregation-and-grouping` is a 404 on the live docs: no docs page of that id exists in the page list (the story is a Storybook story only), so `features-aggregation--aggregation-with-selection` was the second story page.
- `/docs/examples/basic`: one file name shown, no file tree; other file tabs were not checked.
