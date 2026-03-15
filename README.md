# Shadcn React Table V3
Work in Progress.
## About

### _Quickly Create React Data Tables with Shadcn Design_


PRs are Welcome, but please discuss in [GitHub Discussions](https://github.com/KevinVandy/material-react-table/discussions) or the [Discord Server](https://discord.gg/5wqyRx6fnm) first if it is a large change!

Read the [Contributing Guide](https://github.com/KevinVandy/material-react-table/blob/v3/CONTRIBUTING.md) to learn how to run this project locally.

---

## Comprehensive Repository Overview

### Purpose and Core Functionality

Shadcn React Table is a **fully-featured React data table library** forked from [Material React Table](https://github.com/KevinVandy/material-react-table), redesigned to follow the [shadcn/ui](https://ui.shadcn.com/) philosophy. Unlike traditional npm component libraries that ship pre-built UI, this project generates customizable table components **directly into your codebase**, giving you full ownership and control over the UI.

**Core value proposition:**
- All the power of Material React Table (170+ features built on TanStack Table V8)
- Components live in YOUR project, not hidden in node_modules
- Styled with Tailwind CSS and shadcn/ui design patterns
- Complete TypeScript support with full type inference

### Architecture and Design Patterns

The project follows a **two-package architecture**:

```
shadcn-react-table/
├── packages/
│   ├── shadcn-react-table-core/   # Headless utilities (npm package)
│   │   ├── hooks/                  # useShadcnReactTable, effects, state
│   │   ├── fns/                    # Filter, sort, aggregation functions
│   │   ├── utils/                  # Cell, column, row utilities
│   │   ├── types.ts                # Full TypeScript definitions
│   │   └── locales/                # 38+ language translations
│   │
│   └── shadcn-react-table-cli/    # Component generator (npx command)
│       └── templates/              # React component templates
│           ├── table/              # SRT_Table, Container, Layout
│           ├── body/               # TableBody, Cells, Rows
│           ├── head/               # TableHead, Headers, Sorting
│           ├── toolbar/            # Top/Bottom toolbars, Pagination
│           ├── buttons/            # Density, FullScreen, Filter toggles
│           └── inputs/             # Global filter, search fields
```

**Design Pattern:** Composition over configuration. The CLI generates component files into your `ui/` folder, which import headless logic from the core package. You can customize any component without ejecting or forking.

### Key Technologies

| Category | Technology |
|----------|------------|
| **Framework** | React 18+ |
| **Table Engine** | TanStack Table V8 |
| **Virtualization** | TanStack Virtual |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS, class-variance-authority (CVA) |
| **UI Components** | shadcn/ui primitives |
| **Icons** | Lucide React |
| **Build** | Rollup (core), esbuild (CLI) |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Template Engine** | Eta |

### Authentication and Security Implementation

This is a **UI component library** and does not handle authentication or security directly. Security considerations:
- No external API calls or data persistence
- No sensitive data handling within the library
- Row-level security should be implemented at your data layer
- All data transformations happen client-side

### API Integrations and Third-Party Services

**Internal dependencies (bundled):**
- `@tanstack/react-table` - Core table logic
- `@tanstack/react-virtual` - Row/column virtualization
- `@tanstack/match-sorter-utils` - Fuzzy search ranking

**No external services required.** The library is fully self-contained and works offline.

### Deployment Infrastructure and DevOps Approach

**Monorepo Structure:**
- **Turborepo** for task orchestration and caching
- **pnpm workspaces** for dependency management
- Parallel builds for core and CLI packages

**Package Publishing:**
- `shadcn-react-table-core` → npm (headless utilities)
- `shadcn-react-table-cli` → npm (npx shadcn-rt command)

**Development apps:**
- `apps/test-shadcn/` - Vite development playground
- `apps/material-react-table-docs/` - Next.js documentation site

### Testing Framework and Methodology

- **Storybook** for component visual testing and documentation
- **Test apps** (`test-shadcn`, `test-vite`, `test-remix`) for integration testing
- Manual testing against various React frameworks

### Performance Optimizations and Scalability Features

| Feature | Implementation |
|---------|----------------|
| **Virtualization** | TanStack Virtual for 10,000+ row tables |
| **Memoization** | Configurable memoMode: 'cells', 'rows', or 'table-body' |
| **Lazy Loading** | Async loading UI with skeleton states |
| **Column Virtualization** | Horizontal scrolling optimization |
| **Pagination** | Client-side and server-side support |
| **Debounced Filtering** | Prevents excessive re-renders |

### Accessibility and Internationalization Support

**Accessibility (a11y):**
- Keyboard navigation support
- ARIA attributes on interactive elements
- Focus management for modals and menus
- Screen reader compatible table semantics

**Internationalization (i18n):**
38 built-in locales including:
```
ar, az, bg, cs, da, de, el, en, es, et, fa, fi, fr, he, hr, hu, hy, id, 
it, ja, ko, nl, no, np, pl, pt, pt-BR, ro, ru, sk, sr-Cyrl-RS, sr-Latn-RS, 
sv, tr, uk, vi, zh-Hans, zh-Hant
```

Custom localization is fully supported via the `localization` prop.

### Feature Highlights

All features from Material React Table, including:
- ✅ Sorting (multi-column, custom functions)
- ✅ Filtering (column, global, faceted values)
- ✅ Pagination (client/server-side)
- ✅ Row Selection (checkbox, radio)
- ✅ Row/Column Virtualization
- ✅ Column Resizing & Reordering
- ✅ Column Pinning (sticky columns)
- ✅ Row Pinning & Expansion
- ✅ Drag & Drop (rows and columns)
- ✅ Inline Editing (cell, row, modal, table modes)
- ✅ Aggregation & Grouping
- ✅ Detail Panels
- ✅ Full Screen Mode
- ✅ Density Toggle
- ✅ Click to Copy
- ✅ Custom Toolbars
- ✅ And 150+ more options...

---

## Status

🚧 **Work in Progress** - This project is actively being developed. Components are being ported from Material React Table to use shadcn/ui styling. See `planning/plan.md` for current progress.

<!-- Use the FORCE, Luke! -->
