# shadcn-react-table

A full-featured React data table built on [TanStack Table](https://tanstack.com/table) and [shadcn/ui](https://ui.shadcn.com), ported from [Material React Table](https://www.material-react-table.com). Sorting, filtering, grouping, pinning, virtualization, editing, drag and drop, detail panels and the rest of the Material React Table feature set, rendered with shadcn/ui parts and Tailwind CSS.

Like every shadcn/ui component, the table is installed as source into your project, not as an npm dependency. You own the files and can change anything.

Docs and live examples: the docs site in `apps/shadcn-react-table-docs` (deployment pending; run it locally, see [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)).

## Install

A shadcn/ui project (Tailwind CSS v4, `shadcn init` done) with React 18 or newer:

```bash
pnpm dlx shadcn@latest add anindosarker/shadcn-react-table/shadcn-react-table
```

This copies the table into `components/ui/shadcn-react-table` and installs `@tanstack/react-table`, `@tanstack/react-virtual`, `lucide-react` and the shadcn/ui parts it is built from.

```tsx
import {
  ShadcnReactTable,
  useShadcnReactTable,
} from '@/components/ui/shadcn-react-table';

const table = useShadcnReactTable({ columns, data });
return <ShadcnReactTable table={table} />;
```

Every docs example is also a registry item: `pnpm dlx shadcn@latest add anindosarker/shadcn-react-table/example-<slug>` installs the example with its data next to the library.

Built and tested against the `radix-nova` shadcn/ui parts. Other Radix themes work; Base UI and React Aria packages are planned.

## Repository

| Path | Contents |
| --- | --- |
| `packages/shadcn-react-table` | Library source, Storybook, tests, registry build |
| `apps/shadcn-react-table-docs` | Docs site (Next.js + fumadocs) and the 113 examples |
| `apps/test-shadcn` | Vite playground against the library source |

Architecture, setup and the commands for every part: [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md). Contribution rules: [CONTRIBUTING.md](CONTRIBUTING.md).

## Status

Work in progress. The feature port from Material React Table is complete; the docs and registry are being finished. Issues and PRs welcome.

## License

MIT
