# shadcn-table

A full-featured React data table built on TanStack Table v8, installed into your codebase through the shadcn CLI. A port of material-react-table to shadcn/ui.

## Status

v0.2. Radix and Base UI bases, one edition each; React Aria is not supported.

## Install

The registry is served under one path per shadcn base. The project's base is the `style` in `components.json` (`radix-*` or `base-*`).

Radix:

```bash
pnpm dlx shadcn@latest init --base radix
pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/radix/shadcn-table.json
```

Base UI:

```bash
pnpm dlx shadcn@latest init --base base
pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/base/shadcn-table.json
```

Namespace form, either base (`{style}` resolves to the project's style):

```bash
pnpm dlx shadcn@latest registry add @st=https://www.shadcn-table.com/r/{style}/{name}.json
pnpm dlx shadcn@latest add @st/shadcn-table
```

GitHub addresses, as a fallback: `anindosarker/shadcn-table/shadcn-table` (Radix) and `anindosarker/shadcn-table/shadcn-table-base` (Base UI).

## Features

- Sorting, filtering (column and global, faceted values), grouping and aggregation
- Pagination, row and column virtualization for large data sets
- Row selection, expanding, detail panels, row pinning, column pinning
- Column ordering, resizing, hiding, and drag-and-drop
- Editing in cell, row, modal and table modes
- Toolbars, density toggle and full-screen mode
- 38 locales, installed as separate registry items

## Docs

- Docs: https://shadcn-table.com
- Storybook: https://storybook.shadcn-table.com

## Community

- Discord for questions and help: https://discord.gg/hsF37t6EKe
- [GitHub Discussions](https://github.com/anindosarker/shadcn-table/discussions) for proposals
- [Issues](https://github.com/anindosarker/shadcn-table/issues) for bugs

## AI agents

A skill file is served at `/SKILL.md` on the docs site: `npx skills add anindosarker/shadcn-table`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. A port of [material-react-table](https://github.com/KevinVandy/material-react-table) by Kevin Vandy, MIT.
