<div align="center">

# shadcn-table

A full-featured React data table built on TanStack Table v9, installed into your codebase through the shadcn CLI.

[![Release](https://img.shields.io/github/v/release/anindosarker/shadcn-table?label=release)](https://github.com/anindosarker/shadcn-table/releases)
[![License](https://img.shields.io/github/license/anindosarker/shadcn-table)](LICENSE)
[![Stars](https://img.shields.io/github/stars/anindosarker/shadcn-table?style=flat)](https://github.com/anindosarker/shadcn-table/stargazers)
[![Discord](https://img.shields.io/badge/discord-join-5865F2?logo=discord&logoColor=white)](https://discord.gg/hsF37t6EKe)

[Docs](https://www.shadcn-table.com) · [Storybook](https://storybook.shadcn-table.com) · [Discord](https://discord.gg/hsF37t6EKe)

</div>

https://github.com/user-attachments/assets/ba6a036b-c894-4d13-a9e4-25a4922669dd

Three editions, one per shadcn base: Radix UI, Base UI and React Aria.

## Quick start

Radix:

```bash
pnpm dlx shadcn@latest init --base radix
pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/radix/shadcn-table.json
```

<details>
<summary>Base UI, React Aria and other install forms</summary>

The registry is served under one path per shadcn base. The project's base is the `style` in `components.json` (`radix-*`, `base-*` or `aria-*`).

Base UI:

```bash
pnpm dlx shadcn@latest init --base base
pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/base/shadcn-table.json
```

React Aria (an `aria-*` style such as `aria-nova`):

```bash
pnpm dlx shadcn@latest init --base aria
pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/aria/shadcn-table.json
```

Namespace form, any base (`{style}` resolves to the project's style):

```bash
pnpm dlx shadcn@latest registry add @st=https://www.shadcn-table.com/r/{style}/{name}.json
pnpm dlx shadcn@latest add @st/shadcn-table
```

GitHub addresses, as a fallback: `anindosarker/shadcn-table/shadcn-table` (Radix UI), `anindosarker/shadcn-table/shadcn-table-base` (Base UI) and `anindosarker/shadcn-table/shadcn-table-aria` (React Aria).

</details>

## Features

- **Data:** sorting, filtering (column and global, faceted values), grouping and aggregation
- **Scale:** pagination, row and column virtualization for large data sets
- **Rows:** selection, expanding, detail panels, pinning
- **Columns:** ordering, resizing, hiding, pinning and drag-and-drop
- **Editing:** in cell, row, modal and table modes
- **Layout:** toolbars, density toggle and full-screen mode
- **i18n:** 38 locales, installed as separate registry items

## Community

- [Discord](https://discord.gg/hsF37t6EKe) for questions and help
- [GitHub Discussions](https://github.com/anindosarker/shadcn-table/discussions) for proposals
- [Issues](https://github.com/anindosarker/shadcn-table/issues) for bugs

## AI agents

A skill file is served at `/SKILL.md` on the docs site: `npx skills add anindosarker/shadcn-table`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. A port of [material-react-table](https://github.com/KevinVandy/material-react-table) by Kevin Vandy, MIT.
