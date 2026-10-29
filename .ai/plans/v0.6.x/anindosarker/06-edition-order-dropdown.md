# 06: edition order and dropdown selectors

## 1. Architecture

### 1.1 Overview

Decision 8: Base UI first everywhere the editions are listed, one order source, both edition selectors become dropdowns, no unnamed edition in any script. Follows part 05 (`DEFAULT_EDITION`, builds under `/<edition>/`). Branches from `claude/review`.

### 1.2 Goals

- `EDITIONS` is `['base', 'radix', 'aria']` and every listed order in docs, Storybook, README, SKILL.md, CONTRIBUTING follows it; `grep -rn "radix.*base.*aria"` over user-visible text finds only the `pr.yml` matrices and CLI usage strings
- The docs header shows one select button labelled with the current edition; its menu lists Base UI, Radix UI, React Aria; choosing one switches the site the way the pill tabs did (same storage, same analytics event)
- The Storybook toolbar shows one `Select` labelled with the current edition; choosing another opens the same story in that edition's build (static: `../<edition>/`, dev: that edition's port)
- `ST_BASE` unset: `vite`, `vitest`, `storybook` run the Base UI tree (`DEFAULT_EDITION`), never Radix UI; every `package.json` script names its edition
- Ports unchanged: Radix UI 6006, Base UI 6007, React Aria 6008, from one table
- vitest browser `testTimeout` 90 s; `pnpm format` covers `.mjs`; `05-shots/` gone

### 1.3 Current structure

```
packages/shadcn-table/
├── scripts/registry/editions.mjs       ← EDITIONS radix first; resolveEdition falls back to REFERENCE_EDITION
├── scripts/registry/editions.d.mts     ← tuple type radix first
├── scripts/preview.mjs                 ← ports 6006 + EDITIONS index, child named `storybook` for the reference
├── .storybook/edition-tool.ts          ← three IconButtons, bottom bar on the current one, port = index arithmetic
├── .storybook/themes.ts                ← ST_OTHER_EDITIONS in EDITIONS order
├── .storybook/main.ts                  ← resolveEdition(process.env.ST_BASE)
├── vite.config.ts                      ← resolveEdition(process.env.ST_BASE)
├── vitest.config.ts                    ← testTimeout 45_000
├── package.json                        ← storybook / storybook:base / storybook:aria, storybook:build (radix) / :base / :aria, test / test:base / test:aria
apps/shadcn-table-docs/
├── lib/install.ts                      ← bases = ['radix','base','aria'] (own copy), baseLabels
├── components/base-selector.tsx        ← BaseSwitch: fumadocs Tabs pill in the header; BaseTabs on content pages
├── components/agent-bar.tsx            ← "Choose base" DropdownMenuRadioGroup over bases
├── components/theme-demo/variants/terminal.tsx ← initCommand('radix', ...), libraryAddCommand('radix', ...)
├── content/docs/**/*.mdx               ← prose "Radix UI, Base UI or React Aria"
package.json                            ← storybook, storybook:all, storybook:build; format glob without mjs
turbo.json                              ← storybook, storybook:build tasks
vercel.json                             ← buildCommand storybook:build && :base && :aria
.github/workflows/pr.yml                ← per-base storybook:build / test steps by name
CONTRIBUTING.md, README.md, skills/shadcn-table/SKILL.md ← radix-first lists, `pnpm storybook` on 6006
.ai/plans/v0.6.x/anindosarker/05-shots/ ← six PNGs
```

### 1.4 Target structure

```
packages/shadcn-table/
├── scripts/registry/editions.mjs       ← EDITIONS ['base','radix','aria']; EDITION_PORTS; resolveEdition falls back to DEFAULT_EDITION
├── scripts/registry/editions.d.mts     ← tuple type base first; EDITION_PORTS type
├── scripts/preview.mjs                 ← ports from EDITION_PORTS, children named storybook:<edition>
├── .storybook/edition-tool.ts          ← one Select; href from EDITION_PORTS in dev, staticEditionRoot otherwise
├── .storybook/themes.ts                ← unchanged logic, new order falls out of EDITIONS
├── vitest.config.ts                    ← testTimeout 90_000
├── package.json                        ← storybook:radix / :base / :aria; storybook:build:radix / :base / :aria; test:radix / :base / :aria
apps/shadcn-table-docs/
├── lib/install.ts                      ← bases = EDITIONS, baseLabels = EDITION_LABELS (re-exports, typed)
├── components/base-selector.tsx        ← BaseSwitch: DropdownMenu select button; BaseTabs unchanged
├── components/theme-demo/variants/terminal.tsx ← DEFAULT_EDITION
├── content/docs/**/*.mdx               ← prose "Base UI, Radix UI or React Aria"
package.json                            ← storybook:radix / :base / :aria, storybook:all, storybook:build (all three); format glob with mjs
turbo.json                              ← storybook:radix / :base / :aria, storybook:build:radix / :base / :aria
vercel.json                             ← buildCommand storybook:build:base && :radix && :aria
.github/workflows/pr.yml                ← storybook:build:${{ matrix.base }}, test:${{ matrix.base }}
CONTRIBUTING.md, README.md, SKILL.md    ← Base UI first, `pnpm storybook:base` on 6007 as the first example
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `## Unreleased`: `### Changed` lines for the order, the two dropdowns, the script names (`storybook`, `storybook:build`, `test` renamed, maintainers only); `### Fixed` none
- `registry.json` (committed catalog): item order follows the new `EDITIONS`, Base UI items first. Hosted `/r/<edition>/` output unchanged (one directory per edition, order inside a directory is by item)
- `docs/code-of-conduct/coding-standards.md` Editions bullets: the script names, the `ST_BASE` rule ("every edition script names its edition; `ST_BASE` unset means `DEFAULT_EDITION`")
- `.ai/plans/v0.6.x/anindosarker/05-shots/`: deleted

#### 1.6.2 `editions.mjs`

The single source of order, labels, ports and resolution.

- Exports `EDITIONS`, `REFERENCE_EDITION` (`radix`, unchanged), `DEFAULT_EDITION` (`base`, unchanged), `EDITION_LABELS`, `EDITION_PORTS`, `editionItemName`, `resolveEdition`
- `resolveEdition(value)` returns the edition `value` names, `DEFAULT_EDITION` otherwise
- Does NOT fall back to `REFERENCE_EDITION`

**Interfaces:**

```typescript
export const EDITIONS: readonly ['base', 'radix', 'aria'];
export const EDITION_PORTS: Readonly<Record<Edition, number>>; // base 6007, radix 6006, aria 6008
export function resolveEdition(value: unknown): Edition; // DEFAULT_EDITION when unset or unknown
```

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `EDITIONS` | refactor | order only |
| `EDITION_PORTS` | new | read by package.json comments, `preview.mjs`, `edition-tool.ts`, `check-storybook.mjs` dev mode if any |
| `resolveEdition` | refactor | falls back to `DEFAULT_EDITION`, not `REFERENCE_EDITION`; header comment rewritten |
| `editionItemName`, `REFERENCE_EDITION`, `DEFAULT_EDITION`, `EDITION_LABELS` | keep | |

**Stays unchanged:** `lib.mjs`, `build.mjs`, `hosted.mjs`, `check-bases.mjs`, `examples.mjs` (they iterate `EDITIONS`; only the resulting order moves).

#### 1.6.3 Scripts and config

Every edition script names its edition.

- `packages/shadcn-table/package.json`: `storybook:radix` (`ST_BASE=radix storybook dev -p 6006`), `storybook:base` (6007), `storybook:aria` (6008); `storybook:build:radix` (`-o storybook-static/radix`), `:base`, `:aria`; `test:radix`, `test:base`, `test:aria`; `tsc` keeps `tsc:radix` as its target (type-check target, not an edition the reader sees) or goes if nothing calls it
- Root `package.json`: `storybook:radix`, `storybook:base`, `storybook:aria` through turbo; `storybook:all` regex `^storybook:(base|radix|aria)$`; `storybook:build` runs the three builds Base UI first; `format` glob `**/*.{js,mjs,ts,tsx,md}`
- `turbo.json`: tasks `storybook:radix`, `storybook:base`, `storybook:aria` (persistent, no cache), `storybook:build:radix`, `:base`, `:aria` (outputs `storybook-static/<edition>/**`)
- `vercel.json` `services.storybook.buildCommand`: `pnpm storybook:build:base && pnpm storybook:build:radix && pnpm storybook:build:aria`
- `.github/workflows/pr.yml`: one step `pnpm --filter shadcn-table storybook:build:${{ matrix.base }}` and one `pnpm --filter shadcn-table test:${{ matrix.base }}` replace the three `if: matrix.base ==` steps each; matrix order `[base, radix, aria]`
- `.github/workflows/install.yml`: the `'radix'` fallback becomes an explicit scenario value or an error, whichever the file's structure allows without a default
- `preview.mjs`: children `storybook:<edition>` for every edition on `EDITION_PORTS[edition]`; colours keyed by edition
- `vite.config.ts`, `.storybook/main.ts`: `resolveEdition(process.env.ST_BASE)` unchanged call, now Base UI when unset; comments rewritten
- `vitest.config.ts`: `testTimeout: 90_000`, comment names the 48 s run
- Does NOT change `tsc:radix`, `tsc:baseui`, `tsc:aria` names (tsconfig targets)

**Stays unchanged:** `check-storybook.mjs`, `smoke.mjs` logic (order of their loops follows `EDITIONS`).

#### 1.6.4 Storybook edition tool

One native `Select` in the toolbar.

- Renders `Select` from `storybook/internal/components` with `ariaLabel: 'Edition'`, `options` from `EDITIONS` (`{ value: edition, title: EDITION_LABELS[edition] }`), `defaultOptions: ST_BASE`, `size: 'small'`
- `onSelect(edition)`: if `edition !== ST_BASE`, `window.top.location.assign(editionHref(edition, path))`
- `editionHref` in dev: `${protocol}//${hostname}:${EDITION_PORTS[target]}/?path=${path}`; static: `${staticEditionRoot(target)}?path=${path}` (unchanged)
- Does NOT render per-edition buttons, a bottom bar, or `IconButton`
- `check-storybook.mjs`: the toolbar check finds one `[aria-label="Edition"]` button whose text is the current label, instead of three `data-edition-*` buttons; its open-menu check lists the three labels in `EDITIONS` order

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `EditionTool` | refactor | `Select`, one element |
| `editionHref` | refactor | `EDITION_PORTS` instead of index arithmetic |
| addon registration | keep | `types.TOOL`, title `Edition` |

**Stays unchanged:** `themes.ts` exports, `preview.tsx` banner (order follows `EDITIONS`), `manager.ts`.

#### 1.6.5 Docs edition selector

`BaseSwitch` becomes a select button with a menu.

- Trigger: `Button` (`@/components/ui-radix/button`, `variant: 'outline'`, `size: 'sm'`, `h-8 rounded-md border bg-fd-secondary` like the `Copy prompt` group in `example-playground.tsx`), content `{baseLabels[base]}` plus `ChevronDownIcon`, `aria-label="Edition"`, `aria-haspopup="menu"`
- Menu: `DropdownMenuContent align="end" className="docs-menu w-40"` with `DropdownMenuRadioGroup value={base}` and one `DropdownMenuRadioItem` per `bases` entry, same pattern and the same `trackBaseSwitched({ surface: 'header' })` call as the agent bar's "Choose base"
- State: `useBaseTabs('header')` or the hook behind it, unchanged storage (`BASE_GROUP_ID`, session then local), unchanged server snapshot (`defaultBase`)
- Does NOT change `BaseTabs` (content pages keep fumadocs tabs; their trigger order follows `bases`)
- `lib/install.ts`: `bases` is `EDITIONS` and `baseLabels` is `EDITION_LABELS`, both imported from `editions.mjs`; `Base` type from `editions.d.mts`
- `theme-demo/variants/terminal.tsx`: `initCommand(DEFAULT_EDITION, 'npm')`, `libraryAddCommand(DEFAULT_EDITION, 'npm')`
- Page checks (`scripts/page-checks/a.mjs`, `_helpers.mjs`): the header check opens the menu and reads the three items in order; hardcoded `['radix','base','aria']` replaced by `EDITIONS`

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `BaseSwitch` | refactor | dropdown |
| `bases`, `baseLabels` | refactor | derived from `editions.mjs` |
| `BaseTabs`, `useBaseTabs`, storage | keep | |

**Stays unchanged:** `base-tabs.mjs` (`TAB_VALUES` from `EDITIONS`), `storybook-link.tsx`, `install-command.tsx` (tab order follows `bases`), `example-snippet.tsx`.

#### 1.6.6 Prose and maintainer docs

- `content/docs/getting-started/{install,introduction,agents}.mdx`, `guides/localization.mdx`: lists read Base UI, Radix UI, React Aria; path lists `base`, `radix`, `aria`
- `README.md`: "Quick start" block is Base UI; the fold holds Radix UI, React Aria, namespace and GitHub forms, Base UI first in the GitHub list
- `skills/shadcn-table/SKILL.md`: edition list, `--base` list, per-edition commands, GitHub fallback, Base UI first; the smoke's SKILL.md check uses `includes`, no change there
- `CONTRIBUTING.md`: port table Base UI first, `pnpm storybook:base` as the first dev example, every `pnpm storybook` becomes `pnpm storybook:<edition>`, the `ST_BASE` row says unset means `registry/base`
- `packages/shadcn-table/registry/README.md`, `apps/shadcn-table-docs/README.md`, `docs/code-of-conduct/coding-standards.md`, `.github/pull_request_template.md`: order and script names
- `editions.mjs` header comment and `main.ts`, `manager.ts`, `vite.config.ts`, `base-selector.tsx`, `site-nav.tsx` comments: no "radix first", "the default edition when unset" in place of "the reference when unset"

### 1.7 Dependencies and env

- No new packages. `Select` ships in `storybook` 10.6.2 (`storybook/internal/components`)
- `ST_BASE`: read by every Storybook, Vite and Vitest run; values `base`, `radix`, `aria`; unset or unknown means `DEFAULT_EDITION`

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: editions and scripts

- 1.6.2, 1.6.3; `pnpm registry:build` (catalog reorders, hosted output `git status --short apps/shadcn-table-docs/public/r` empty); `pnpm --filter shadcn-table exec vitest run` with `ST_BASE` unset runs the Base UI tree; the three `storybook:build:<edition>` scripts green

#### 2.1.2 Phase 2: Storybook tool

- 1.6.4; local three-folder build served, `check-storybook.mjs` green; `storybook:base` on 6007 and `storybook:radix` on 6006 running at once, the Select in one opens the same story in the other; one screenshot per theme in the tracker, deleted after review

#### 2.1.3 Phase 3: docs

- 1.6.5, 1.6.6; docs `types:check`, `lint`, `build` green; `check-pages.mjs` green for all three editions; a fresh browser context opens `/docs/getting-started/install` with the header button reading `Base UI`, the menu listing Base UI, Radix UI, React Aria

#### 2.1.4 Final phase: cleanup and gates

- 1.6.1; delete `05-shots/`; `pnpm format` (now covers `.mjs`, three files reformat); 2.2; CI-only PR into `claude/review`, label `release:patch`

### 2.2 Gates

- `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:bases`, `registry:build` green; hosted output unchanged
- `test:base`, `test:radix`, `test:aria` green locally (90 s timeout in place)
- `check-storybook.mjs` green against the local three-folder build; docs `build` and `check-pages.mjs` green for all three editions
- `grep -rn "'radix', 'base', 'aria'\|radix, base, aria\|Radix UI, Base UI" --include=*.md --include=*.mdx --include=*.ts --include=*.tsx --include=*.mjs --include=*.json --include=*.yml . | grep -v node_modules` returns only `.ai/plans/` history and `CHANGELOG.md`
- `pr.yml` green; after release, `smoke.mjs` green
