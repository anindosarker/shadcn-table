# 01: examples per edition, tracker

Branch `v0.6/examples-per-edition`, worktree 07, from `claude/review` at 03d95c95.

## Phases

- Phase 01 (layout): c3bcf345 `refactor(docs): examples per edition, wrappers replaced by the generated map`, b1061737 `feat(docs): code view, GitHub link and prompt follow the selected edition`. Gate `types:check`: radix green, 115 wrappers all the one-line `ExampleSnippet` form (none listed for halt); the base and aria errors are the phase 02 work list below. `lint`: 0 errors (the pre-existing `advanced` img and `expanding-tree-flat-parse` useMemo warnings, now once per edition folder).

## Phase 02 work list (files failing `types:check` after phase 01)

- base: `react-query/TS.tsx`, `server-side-data/components/UsersTable.tsx` (TooltipTrigger `asChild`)
- aria: `advanced/TS.tsx`, `custom-top-toolbar/TS.tsx`, `editing-crud-cell/TS.tsx`, `editing-crud-table/TS.tsx`, `export-to-csv/TS.tsx`, `export-to-pdf/TS.tsx` (Button `disabled`), `enable-column-grouping/TS.tsx` (RadioGroup `onValueChange`), `react-query/TS.tsx`, `server-side-data/components/UsersTable.tsx` (Tooltip composition)
- every edition: `custom-headless/TS.tsx` (plan 1.6.1)

## Owner attention

- `readExampleExportName(exampleDir)` became `exampleExportName(slug)` (sync, slug in, `<PascalCase(slug)>Example` out) and `findExamplePage(slug, pages)` takes the slug alone; the two callers (`example-prompt.ts`, `examples.mjs`) no longer pass an export name.
- `examples/map.tsx` is formatted by prettier inside the generator, so `pnpm format` leaves it unchanged (the long locale exports wrap).
- `tsconfig.json` `exclude` lists `examples/radix`, `examples/base`, `examples/aria` in place of the old `examples/*/...` globs (the committed sources import `@/components/ui/`, which the docs app does not have; only the generated `.<edition>` copies are type-checked).
