---
name: shadcn-table
description: Install and use shadcn-table, a data table for shadcn/ui built on TanStack Table. Use when a project needs a table with sorting, filtering, pagination, selection, editing, grouping, pinning or virtualization, or when it already has components/ui/shadcn-table.
---

# shadcn-table

A shadcn registry item: the table source is copied into the project, not installed as an npm package. The project owns the files. One edition per shadcn base, Radix and Base UI, served under `/r/radix/` and `/r/base/` on the docs site.

## Install

1. Requirements: shadcn/ui on the **Radix** or the **Base UI** base, Tailwind CSS v4, React 18 or newer. React Aria is not supported.
   No `components.json` yet: run `pnpm dlx shadcn@latest init` first (`--base radix` or `--base base`; the default is Base UI) and ask the user which base they want.
2. Detect the base: read `style` in `components.json`. `radix-*` is Radix UI, `base-*` is Base UI. Add the table for that base:
   - Radix: `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/radix/shadcn-table.json`
   - Base UI: `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/base/shadcn-table.json`
     Fallback when the site is unreachable, GitHub addresses: `anindosarker/shadcn-table/shadcn-table` (Radix UI) and `anindosarker/shadcn-table/shadcn-table-base` (Base UI).
3. Verify: `components/ui/shadcn-table/index.ts` exists and the project type-checks. The edition for the other base does not type-check; reinstall the right one with `--overwrite`.

What the command adds: `components/ui/shadcn-table/` (the table), the shadcn/ui parts it uses in `components/ui/` when missing, and the npm packages `@tanstack/react-table`, `@tanstack/react-virtual`, `@tanstack/match-sorter-utils`, `highlight-words`, `class-variance-authority`, `lucide-react`, plus `radix-ui` (Radix UI) or `@base-ui/react` (Base UI). Re-run with `--overwrite` to update; local edits in that directory are replaced.

Other languages are separate items, one per locale code, under the same base path: `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/<base>/shadcn-table-locale-de.json`, imported from `@/components/ui/shadcn-table/locales/de`. GitHub fallback: `anindosarker/shadcn-table/shadcn-table-locale-de` (Radix UI), `anindosarker/shadcn-table/shadcn-table-base-locale-de` (Base UI).

## Use

```tsx
import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';

type Person = { name: string; age: number };

export function PeopleTable({ data }: { data: Person[] }) {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'age', header: 'Age' },
    ],
    [],
  );
  const table = useShadcnTable({ columns, data });
  return <ShadcnTable table={table} />;
}
```

Rules:

- `columns` and `data` must be stable: `useMemo`, `useState`, or module scope. Inline arrays re-render forever.
- All features are table options passed to `useShadcnTable` (`enableRowSelection`, `enableColumnFilters`, `enableGrouping`, `enableRowVirtualization`, `renderDetailPanel`, ...). Do not wrap the table to add behaviour before checking the option exists.
- Column behaviour is a column option (`filterVariant`, `enableSorting`, `Cell`, `size`, `aggregationFn`, ...).
- The table is built on TanStack Table v9 and uses its names: `sortFn` (not `sortingFn`), `columnPinning: { start, end }` and `column.pin('start' | 'end')` (not left/right), `columnResizing` state (not `columnSizingInfo`), `table.state` (not `table.getState()`), `getPaginatedRowModel()`. Custom aggregations are `constructAggregationFn({ aggregate })` definitions.
- Styling: the table uses the project's shadcn/ui tokens; override per part with the `st*Props` options (`stTableBodyCellProps`, `stTableHeadCellProps`, ...) taking a `className`.

## Reference

Read before changing options, as markdown:

- Table options: `https://www.shadcn-table.com/llms.mdx/docs/api/table-options/content.md`
- Column options: `https://www.shadcn-table.com/llms.mdx/docs/api/column-options/content.md`
- Table instance API: `https://www.shadcn-table.com/llms.mdx/docs/api/table-instance-apis/content.md`
- All pages: `https://www.shadcn-table.com/llms.txt`; one feature guide per page under `https://www.shadcn-table.com/llms.mdx/docs/guides/<feature>/content.md`

## Examples

Every docs example installs as its own item next to the table, with its data, under the same base path as the table (install the table first):

```bash
pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/<base>/example-<slug>.json
```

GitHub fallback, the same item on both bases: `anindosarker/shadcn-table/example-<slug>`.

It lands in `components/examples/<slug>/<slug>.tsx` with a default export. Slugs match `/docs/examples/<slug>`; `example-basic`, `example-advanced`, `example-editing-crud`, `example-virtualized`, `example-react-query` cover the common starting points. Prefer copying from an example over writing a feature from scratch.
