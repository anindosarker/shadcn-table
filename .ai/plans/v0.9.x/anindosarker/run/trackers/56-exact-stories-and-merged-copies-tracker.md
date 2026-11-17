# 56: Exact stories and merged copies, tracker

Status: running
Branch `v0.9/exact-stories`, worktree 03
Checks:
- Check: Task 1 frozen lockfile, `pnpm install --frozen-lockfile` at 9efbaf7e: pass
- Check: Task 1 package diff, `git diff origin/v0.9/docs-layout -- packages/shadcn-table/package.json apps/shadcn-table-docs/package.json` at 9efbaf7e: pass (only `@storybook/react`, `storybook`, `@faker-js/faker` in the docs app; `@tanstack/react-query`, `export-to-csv`, `jspdf`, `jspdf-autotable` in the package)
- Check: Task 1 `pnpm test lint` with an empty `apps/shadcn-table-docs/stories/.base/` at 9efbaf7e: pass
- Check: Task 1 `pnpm --filter shadcn-table-docs types:check` with an empty `apps/shadcn-table-docs/stories/.base/` at 9efbaf7e: pass

- Task 1 dependencies and ignore entries: done, 9efbaf7e
- Task 2 a story per example: planned
- Task 3 guide example plan and guide stories: running; plan written (`reference/docs-layout/guide-example-plan.md`: 46 lines, 44 example pages, 1 existing story, 1 new story, no option enabled), stories and checks open
- Task 4 storybook map: planned
- Task 5 copies merged: planned
- Task 6 cleanup: planned

## Attention

- Guide example plan, judgment calls of the lead (the owner's guide checklist of D105 can revert each): `row-numbers` shows the example page `row-virtualization`, which already has row numbers on and links the guide, so no example gets an option enabled (the owner's case was an option enabled for row numbers); `localization` gets a new story "Features/Localization / Spanish", because the one existing story with a language picks it from the browser; 15 guides whose feature is on by default show `basic`; `pagination` shows `remote` and `row-selection` `export-csv` rather than a story of the feature.
- The `advanced` example has no feature group and its sidebar group is Featured, which 1.6.3 does not name: its exact story goes to "Features/Customization" with `minimal` and `custom-headless`. `react-query` (also Featured) goes to "Features/Server Data".
- Dependency specifiers: `@storybook/react` and `storybook` are pinned `10.6.2` in the docs app (1.7 names the version; the package keeps `^10.6.2`); the four story packages are devDependencies of the package. The one `pnpm install` also pruned unused `esbuild@0.23.1` entries and moved `@emnapi` peers in `pnpm-lock.yaml`.
