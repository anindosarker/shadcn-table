# 56: Exact stories and merged copies, tracker

Status: running
Branch `v0.9/exact-stories`, worktree 03
Checks:
- Check: Task 1 frozen lockfile, `pnpm install --frozen-lockfile` at 9efbaf7e: pass
- Check: Task 1 package diff, `git diff origin/v0.9/docs-layout -- packages/shadcn-table/package.json apps/shadcn-table-docs/package.json` at 9efbaf7e: pass (only `@storybook/react`, `storybook`, `@faker-js/faker` in the docs app; `@tanstack/react-query`, `export-to-csv`, `jspdf`, `jspdf-autotable` in the package)
- Check: Task 1 `pnpm test lint` with an empty `apps/shadcn-table-docs/stories/.base/` at 9efbaf7e: pass
- Check: Task 1 `pnpm --filter shadcn-table-docs types:check` with an empty `apps/shadcn-table-docs/stories/.base/` at 9efbaf7e: pass

- Check: Task 3 guide example plan, every story id (`features-icons--provider-icon-set`, `features-localization--spanish`) in `storybook-static/base/index.json` and every example slug a page under `content/docs/examples/` at 9ab98e21: pass; no example needed an option enabled, plan unchanged
- Check: Task 4 `lib/storybook-map.ts` 42 keys, 42 different story ids, each in `storybook-static/base/index.json`; preview suffix helper absent at 9ab98e21: pass
- Check: Task 5 each of the 59 removed copy ids absent outside `.ai/` (git grep and `index.json`), no copy export left at 9ab98e21: pass
- Check: Task 6 `pnpm format` at 9ab98e21: pass, no diff
- Check: `pnpm test lint` at 9ab98e21: pass (0 errors, 9 warnings)
- Check: `pnpm test validate-repo` at 9ab98e21: pass
- Check: `pnpm test typecheck --base base` at 9ab98e21: pass
- Check: `pnpm test typecheck --base radix` at 9ab98e21: pass
- Check: `pnpm test typecheck --base aria` at 9ab98e21: pass
- Check: `pnpm test storybook-tests --base base` at 9ab98e21: pass (85 files, 636 tests)
- Check: `pnpm test storybook-static --base base` at 9ab98e21: pass
- Check: `pnpm test docs-e2e --base base` at 9ab98e21: pass (examples 1067 passed, 110 pages)
- Check: `pnpm test storybook-tests --base radix`, `--base aria`: left to the verifier

- Task 1 dependencies and ignore entries: done, 9efbaf7e
- Task 2 a story per example: done, 23e717c2 (run wf_69fd0950-73d)
- Task 3 guide example plan and guide stories: done, fee70bd0; plan final as written (901992db on claude/review), no option enabled (run wf_69fd0950-73d)
- Task 4 storybook map: done, 9b8a41db (run wf_69fd0950-73d)
- Task 5 copies merged: done, 23e717c2; set branches -a to -e deleted on origin (run wf_69fd0950-73d)
- Task 6 cleanup: done, 9ab98e21 (run wf_69fd0950-73d)

## Attention

- The lead and the set builders made a few choices about which story or page each guide and example uses; each one below can be reverted.
- Set builder judgment calls named in the commits: the React Aria copy of a new story takes the markup of the example's aria copy where its components differ (f488a206); the Virtualization copy with column resizing was removed and "Tall Content" shows that table (ce2ef923). The set builders' own run notes did not reach this pass; their commit messages are the record.
- Guide example plan, judgment calls of the lead (the owner's guide checklist of D105 can revert each): `row-numbers` shows the example page `row-virtualization`, which already has row numbers on and links the guide, so no example gets an option enabled (the owner's case was an option enabled for row numbers); `localization` gets a new story "Features/Localization / Spanish", because the one existing story with a language picks it from the browser; 15 guides whose feature is on by default show `basic`; `pagination` shows `remote` and `row-selection` `export-csv` rather than a story of the feature.
- The `advanced` example has no feature group and its sidebar group is Featured, which 1.6.3 does not name: its exact story goes to "Features/Customization" with `minimal` and `custom-headless`. `react-query` (also Featured) goes to "Features/Server Data".
- Dependency specifiers: `@storybook/react` and `storybook` are pinned `10.6.2` in the docs app (1.7 names the version; the package keeps `^10.6.2`); the four story packages are devDependencies of the package. The one `pnpm install` also pruned unused `esbuild@0.23.1` entries and moved `@emnapi` peers in `pnpm-lock.yaml`.
