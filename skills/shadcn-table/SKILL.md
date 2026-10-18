---
name: shadcn-table
description: Install and use shadcn-table, a data table for shadcn/ui built on TanStack Table. Use when a project needs a table with sorting, filtering, pagination, selection, editing, grouping, pinning or virtualization, or when it already has components/ui/shadcn-table.
---

# shadcn-table

A shadcn registry item: the table source is copied into the project, not installed as an npm package. The project owns the files.

## Install

1. Requirements: shadcn/ui on the **Radix** base, Tailwind CSS v4, React 18 or newer. Base UI and React Aria are not supported.
   No shadcn/ui yet: `pnpm dlx shadcn@latest init --base radix`
2. `pnpm dlx shadcn@latest add anindosarker/shadcn-table/shadcn-table`
3. Verify: `components/ui/shadcn-table/index.ts` exists and the project type-checks.

What the command adds: `components/ui/shadcn-table/` (the table), the shadcn/ui parts it uses in `components/ui/` when missing, and the npm packages `@tanstack/react-table`, `@tanstack/react-virtual`, `@tanstack/match-sorter-utils`, `highlight-words`, `class-variance-authority`, `lucide-react`, `radix-ui`. Re-run with `--overwrite` to update; local edits in that directory are replaced.

Other languages are separate items, one per locale code: `pnpm dlx shadcn@latest add anindosarker/shadcn-table/shadcn-table-locale-de`, imported from `@/components/ui/shadcn-table/locales/de`.

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
- Styling: the table uses the project's shadcn/ui tokens; override per part with the `st*Props` options (`stTableBodyCellProps`, `stTableHeadCellProps`, ...) taking a `className`.

## Reference

Read before changing options, as markdown:

- Table options: `https://www.shadcn-table.com/llms.mdx/docs/api/table-options/content.md`
- Column options: `https://www.shadcn-table.com/llms.mdx/docs/api/column-options/content.md`
- Table instance API: `https://www.shadcn-table.com/llms.mdx/docs/api/table-instance-apis/content.md`
- All pages: `https://www.shadcn-table.com/llms.txt`; one feature guide per page under `https://www.shadcn-table.com/llms.mdx/docs/guides/<feature>/content.md`

## Examples

Every docs example installs as its own item next to the table, with its data:

```bash
pnpm dlx shadcn@latest add anindosarker/shadcn-table/example-<slug>
```

It lands in `components/examples/<slug>/<slug>.tsx` with a default export. Slugs match `/docs/examples/<slug>`; `example-basic`, `example-advanced`, `example-editing-crud`, `example-virtualized`, `example-react-query` cover the common starting points. Prefer copying from an example over writing a feature from scratch.
