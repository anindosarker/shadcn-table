# shadcn-react-table-core (headless)

Headless core for building shadcn/Tailwind data tables on TanStack Table v8.

- No UI/CSS; you own all markup and styles
- Exposes hooks, types, and light utils only

## Install

Peer deps: react (>=18), react-dom (>=18), @tanstack/react-table (>=8)

```bash
pnpm add shadcn-react-table-core @tanstack/react-table
```

## API

- `useDataTable<TData>({ columns, data })` – wraps `useReactTable` with `getCoreRowModel`
- `ColumnDef<TData>` – re-export from `@tanstack/react-table`

## Minimal usage

```tsx
import { type ColumnDef, useDataTable } from 'shadcn-react-table-core'

type Person = { name: string; email: string; age: number }

const columns: ColumnDef<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'age', header: 'Age' },
]

export function DataTable({ data }: { data: Person[] }) {
  const table = useDataTable({ columns, data })
  return (
    <table className="w-full text-sm">
      <thead className="border-b">
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id}>{h.isPlaceholder ? null : (h.column.columnDef.header as any)}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{cell.getValue() as any}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## Why headless?

- Own-your-UI like shadcn; no node_modules Tailwind scanning
- Core can grow features (sorting, filters, selection, virtualization) without dictating UI
