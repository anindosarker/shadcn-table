# 07: base naming

## 1. Architecture

### 1.1 Overview

Decision 9: the shadcn base concept is called `base` everywhere, the word `edition` goes, identifiers and files renamed to match shadcn's own `BASES` / `PresetBase`. Plus the chevron on the Storybook picker (already committed on the branch). Branches from `v0.6/edition-select-icon` rebased onto `claude/review`.

### 1.2 Goals

- `grep -rni edition` over the repo (excluding `.ai/plans`, `CHANGELOG.md`, `node_modules`, build output, lockfile) returns nothing
- Every identifier, file name, CLI flag, comment, doc and UI string that meant the shadcn base says `base`; values `base`, `radix`, `aria` and labels `Base UI`, `Radix UI`, `React Aria` unchanged
- Hosted registry output under `apps/shadcn-table-docs/public/r` byte-identical; committed `registry.json` catalogs byte-identical
- All gates green on all three bases; Storybook picker shows the chevron and reads `Base`

### 1.3 Current structure

```
packages/shadcn-table/
├── scripts/registry/editions.mjs       ← EDITIONS, REFERENCE_EDITION, DEFAULT_EDITION, EDITION_LABELS, EDITION_PORTS, resolveEdition, editionItemName
├── scripts/registry/editions.d.mts     ← type Edition
├── scripts/registry/lib.mjs, lib.d.mts ← editionItems, editionExampleItems, re-exports
├── .storybook/edition-tool.ts          ← editionHref, EditionTool, title 'Edition', ariaLabel 'Edition'
├── .storybook/themes.ts                ← ST_OTHER_EDITIONS, staticEditionRoot, type Edition
├── .storybook/preview.tsx              ← banner "the {label} edition", "The other editions"
apps/shadcn-table-docs/
├── lib/example-variant-dir.mjs, lib/base-tabs.mjs, lib/install.ts ← import editions.mjs
├── scripts/check-pages.mjs             ← --base <url>, --edition <base>
├── scripts/page-checks/*.mjs           ← EDITION_LABELS, DEFAULT_EDITION
├── content/docs/**/*.mdx, README.md    ← "edition" prose
scripts/release/smoke.mjs, packages/shadcn-table/scripts/check-storybook.mjs, scripts/preview.mjs
.github/workflows/pr.yml                ← job name "bases (edition guard)"
CONTRIBUTING.md, docs/code-of-conduct/coding-standards.md ("## Editions"), README.md, skills/shadcn-table/SKILL.md
```

### 1.4 Target structure

```
packages/shadcn-table/
├── scripts/registry/bases.mjs          ← BASES, REFERENCE_BASE, DEFAULT_BASE, BASE_LABELS, BASE_PORTS, resolveBase, baseItemName
├── scripts/registry/bases.d.mts        ← type Base
├── scripts/registry/lib.mjs, lib.d.mts ← baseItems, baseExampleItems
├── .storybook/base-tool.ts             ← baseHref, BaseTool, title 'Base', ariaLabel 'Base', icon ChevronSmallDownIcon
├── .storybook/themes.ts                ← ST_OTHER_BASES, staticBaseRoot, type Base
├── .storybook/preview.tsx              ← "These stories render shadcn-table on {label}. The other bases: ..."
apps/shadcn-table-docs/
├── scripts/check-pages.mjs             ← --url <url>, --base <base>
├── everything else                     ← imports and names follow
docs/code-of-conduct/coding-standards.md ← "## Bases"
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `## Unreleased` `### Changed`: the chevron line (present) plus one line: "The shadcn base is called base everywhere, in the Storybook picker, the docs and the maintainer scripts; edition is gone." Maintainer-facing renames (`bases.mjs`, `--url`) listed in one line.
- `registry.json` catalogs and `public/r` output: unchanged, proven by `git status` (catalogs) and a `diff -r` of the hosted tree before and after.
- `.ai/plans/v0.6.x/anindosarker/06-shots/`: deleted (reviewed).

#### 1.6.2 Rename

Mechanical, one commit per layer so the diff reads.

- `git mv` the four files; identifiers per decision 9; every importer follows
- Comments and JSDoc: "edition" to "base", sentences reflowed at 80 columns
- `check-pages.mjs`: `--base <url>` to `--url <url>`, `--edition` to `--base`; usage header, CONTRIBUTING page gate section, `page-checks/_helpers.mjs` option parsing
- Storybook strings: tool title and `ariaLabel` `Base`; banner per decision 9; `check-storybook.mjs` matches `[aria-label^="Base"]`
- Prose: README, SKILL.md, `introduction.mdx`, `install.mdx`, `agents.mdx`, CONTRIBUTING, registry README, docs README, standards "## Bases"
- Does NOT touch `.ai/plans/`, `CHANGELOG.md` history, decision texts, the `legacy/` or `v0.3.x` branches, registry item names, hosted paths, `ST_BASE`, `check-bases.mjs` name

**Stays unchanged:** `base-tabs.mjs` values (`radix-ui`, `base-ui`, `react-aria`), `BaseSwitch`, `defaultBase`, `baseLabels` (already right), `pr.yml` matrix.

### 1.7 Dependencies and env: none new (`@storybook/icons` added by the chevron commit)

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: scripts and Storybook

- 1.6.2 for `packages/shadcn-table` and `scripts/`; `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:bases`, `registry:build` with the catalogs unchanged, hosted `diff -r` empty, the three `storybook:build:<base>` green, `check-storybook.mjs` green on a local serve

#### 2.1.2 Phase 2: docs app and prose

- 1.6.2 for `apps/shadcn-table-docs`, root docs, SKILL.md; docs `types:check`, `lint`, `build` green; `check-pages.mjs a --base base` and the other two bases green with the renamed flags

#### 2.1.3 Final phase: cleanup and gates

- 1.6.1; the `grep -rni edition` gate; `pnpm format`; CI-only PR into `claude/review`, `release:patch`

### 2.2 Gates

- `grep -rni edition --exclude-dir=node_modules --exclude-dir=.ai --exclude-dir=storybook-static --exclude-dir=.next --exclude=CHANGELOG.md --exclude=pnpm-lock.yaml .` empty
- `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:bases`, `registry:build` green, catalogs and hosted output unchanged
- `test:base`, `test:radix`, `test:aria` green
- `check-storybook.mjs` green against the local three-folder build; docs `build`, `check-pages.mjs` green for all three bases
- `pr.yml` green; after release, `smoke.mjs` green
