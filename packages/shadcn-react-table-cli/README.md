# shadcn-react-table-cli

Code generator to scaffold shadcn-style DataTable files into your app.

- Writes UI files into `src/components/ui/data-table/*`
- Uses `shadcn-react-table-core` for headless logic
- You fully own and customize the generated files

## Install

Use via workspace or install locally as a dev dependency.

```bash
# build (workspace)
pnpm -w --filter shadcn-react-table-cli run build
```

## Usage

From your app directory (or any project root containing `src/`):

```bash
node ../../packages/shadcn-react-table-cli/dist/cli.js add data-table
```

This generates:

```
src/components/ui/data-table/index.tsx
```

The generated component expects:
- Tailwind available in your app
- `shadcn-react-table-core` installed (peer deps react/react-dom/@tanstack/react-table)

## Customize

- Edit `src/components/ui/data-table/index.tsx` freely (markup, classes, slots)
- Swap primitives (Button, DropdownMenu, Dialog) to your app’s shadcn components
- Extend with toolbar/menus/slots as your design system requires

## Roadmap

- Sub-templates: toolbar, menus, row actions, selection, filters
- `diff` command to compare local files with the latest template
- Presets (default/minimal) for different starting points
