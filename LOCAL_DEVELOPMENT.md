# Local development

Commands to run each part of the workspace. Node.js 20.9+, pnpm 10.

```bash
pnpm install
pnpm --filter shadcn-react-table exec playwright install --with-deps chromium   # once, for tests and page checks
```

## Library (`packages/shadcn-react-table`)

```bash
pnpm storybook                                   # http://localhost:6006
pnpm --filter shadcn-react-table tsc
pnpm --filter shadcn-react-table lint
pnpm test                                        # Vitest browser mode over the stories
pnpm --filter shadcn-react-table storybook:build
```

## Playground (`apps/test-shadcn`)

```bash
pnpm --filter test-shadcn dev                    # imports the library source directly, no build step
```

## Registry

### Build

```bash
pnpm registry:build      # library item: packages/shadcn-react-table/registry.json + public/r/*.json
pnpm registry:items      # example items: apps/shadcn-react-table-docs/registry.json
```

### Run locally and install into a test project

Repo root, two terminals:

```bash
REGISTRY_BASE_URL=http://localhost:5310/r pnpm registry:build   # locale items point at the local server
pnpm registry:serve                                             # http://localhost:5310
```

`registry:build` with `REGISTRY_BASE_URL` rewrites the committed `public/r/*.json`; revert with `git checkout -- packages/shadcn-react-table/public` before committing.

Fresh app anywhere (radix base, nova preset; the library needs radix):

```bash
pnpm create vite my-app --template react-ts && cd my-app && pnpm i
pnpm dlx shadcn@latest init --base radix --preset nova
pnpm dlx shadcn@latest add http://localhost:5310/r/shadcn-react-table.json
pnpm dlx shadcn@latest add http://localhost:5310/r/shadcn-react-table-locale-de.json   # optional, one per locale
```

Mount it in `src/App.tsx`:

```tsx
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table';

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];
const data = [
  { name: 'Ada', age: 36 },
  { name: 'Linus', age: 54 },
];

export default function App() {
  return <ShadcnReactTable columns={columns} data={data} />;
}
```

Re-run the `add` command after library changes (rebuild first); it overwrites the installed files.

### Install from a pushed branch

```bash
pnpm dlx shadcn@latest add anindosarker/shadcn-react-table/shadcn-react-table#<branch-or-sha>
pnpm dlx shadcn@latest add anindosarker/shadcn-react-table/example-basic#<branch-or-sha>
```

Example items resolve only through GitHub.

### Validate (same as CI)

```bash
pnpm --filter shadcn-react-table exec shadcn registry validate "anindosarker/shadcn-react-table#<branch-or-sha>"
pnpm --filter shadcn-react-table-docs exec shadcn add "anindosarker/shadcn-react-table/shadcn-react-table#<branch-or-sha>" --dry-run
```

## Docs site (`apps/shadcn-react-table-docs`)

```bash
pnpm --filter shadcn-react-table-docs dev          # http://localhost:5320
pnpm --filter shadcn-react-table-docs types:check
pnpm --filter shadcn-react-table-docs build
```

Update the committed library copy after library changes:

```bash
pnpm registry:build
pnpm --filter shadcn-react-table-docs lib:install
git checkout -- apps/shadcn-react-table-docs/app/global.css      # lib:install rewrites it
```

Page checks against a running dev server:

```bash
cd apps/shadcn-react-table-docs
node scripts/check-pages.mjs --base http://localhost:5320        # all pages
node scripts/check-pages.mjs e --base http://localhost:5320      # one cluster (a to e)
```

Next.js appends `<distDir>/types/**/*.ts` lines to `tsconfig.json` on every `dev` and `build`; keep only the default `.next/...` pair.
