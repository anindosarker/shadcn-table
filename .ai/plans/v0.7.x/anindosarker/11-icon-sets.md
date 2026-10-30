# 11: icon editions

## 1. Architecture

### 1.1 Overview

Every registry item ships Lucide: `icons.ts` imports 33 Lucide icons, three more files import `lucide-react` directly, and `lucide-react` is a dependency of every main item, so a project created with Tabler, Phosphor, Hugeicons or Remix gets a second icon set (F33). Decision D30: one icon map per library with the same 34 keys, a `shadcn-table-core` item without icons, and one edition item per library that supplies `icons.ts` and its package. The CLI resolves core first and dedupes files by target, so a consumer ends with one `icons.ts` and only their icon package. Verified on shadcn 4.23.0 (D30). Branch `v0.7/icon-sets` from `claude/review` after 01 merges, worktree `shadcn-react-table.worktrees/icon-sets`, parallel to the 02 chain and part 06; one PR into `claude/review` for CI, merged by merge commit once green; push right after each commit.

### 1.2 Goals

- Five icon maps per base export the same 34 keys; a script proves the key sets equal (D30)
- `grep -rn "lucide-react" registry/<base>/components/ui/shadcn-table` matches `icons.ts` only, in every base (F33)
- `ST_Icons` is typed with `ST_IconProps`, no `any` (D10) (D30)
- Per base the registry has `shadcn-table-core`, `shadcn-table` (Lucide) and four editions; locale and example items depend on core; `shadcn-table` keeps its name and hosted path
- `shadcn add` of an edition into a scratch project installs core files plus one `icons.ts` and only that icon package; `--overwrite` of another edition replaces `icons.ts` without a prompt (D30)
- Docs app copies and the next-app install use editions; all gates green per base

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── icons.ts                          ← 33 Lucide imports, ST_Default_Icons (34 keys), ST_Icons = Record<..., any>
├── ST_Checkbox.tsx                   ← import from 'lucide-react' (2); components/inputs/ after part 01
├── types.ts                          ← LucideProps (39)
└── components/toolbar/ST_TablePagination.tsx ← LucideIcon (3)
packages/shadcn-table/scripts/registry/
├── lib.mjs                           ← buildBaseItems: one main item plus locale items; mainItemAddress; aliasItems; baseItems
├── build.mjs                         ← registry.json from every base's items plus aliases
├── examples.mjs                      ← example items, registryDependencies from imports
└── hosted.mjs                        ← public/r/<base>/ with HOSTED_NAME `shadcn-table`, locale items re-pointed at the hosted main item
packages/shadcn-table/registry.json   ← 156 items: 4 main (shadcn-table-base, -radix, -aria, shadcn-table alias), locale items, examples
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── icons.ts                          ← Lucide map, dev default, ships in the `shadcn-table` edition only
├── icons/
│   ├── tabler.ts                     ← same 34 keys from @tabler/icons-react
│   ├── phosphor.ts                   ← @phosphor-icons/react
│   ├── hugeicons.tsx                 ← @hugeicons/react + @hugeicons/core-free-icons, one wrapper per icon
│   └── remixicon.ts                  ← @remixicon/react
├── types.ts                          ← ST_IconProps, ST_Icons typed; no lucide import
├── components/inputs/ST_Checkbox.tsx ← icon from '../../icons'
└── components/toolbar/ST_TablePagination.tsx ← icon type from '../../types'
packages/shadcn-table/scripts/
├── registry/lib.mjs                  ← buildBaseItems emits core, editions, locales on core
├── registry/hosted.mjs               ← hosted names shadcn-table-core, shadcn-table, shadcn-table-<library>
├── registry/examples.mjs             ← library dependency points at core
└── check-icons.mjs                   ← new gate: equal key sets across the five maps per base
apps/shadcn-table-docs/scripts/install.mjs ← installs `shadcn-table` (Lucide edition) per base
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `registry.json` per base (committed names keep the `-<base>` suffix as today, hosted names drop it):
  - `shadcn-table-<base>-core`: every library file except `icons.ts`; `dependencies` without `lucide-react`; `registryDependencies` the shadcn parts
  - `shadcn-table-<base>`: file `icons.ts`; `dependencies` `lucide-react`; `registryDependencies` core. Same name and hosted path `/r/<base>/shadcn-table.json` as today
  - `shadcn-table-<base>-tabler`, `-phosphor`, `-hugeicons`, `-remixicon`: file `icons/<library>.ts` (or `.tsx`) with `target` `@ui/shadcn-table/icons.ts`; `dependencies` the icon package (`@tabler/icons-react`, `@phosphor-icons/react`, `@hugeicons/react` plus `@hugeicons/core-free-icons`, `@remixicon/react`), pinned like the other dependencies; `registryDependencies` core
  - locale items `shadcn-table-<base>-locale-<code>` and the example items: `registryDependencies` name core instead of the main item (F26)
  - aliases of the default base for the new items, as `aliasItems` does today
- Hosted output `apps/shadcn-table-docs/public/r/<base>/`: `shadcn-table-core.json`, `shadcn-table.json`, `shadcn-table-<library>.json`, locales and examples re-pointed at `<HOSTED_URL>/<base>/shadcn-table-core.json`
- `CHANGELOG.md` `## Unreleased` `### Added`: "Icon editions: `shadcn-table-tabler`, `shadcn-table-phosphor`, `shadcn-table-hugeicons` and `shadcn-table-remixicon` install the table with that icon library instead of Lucide; `shadcn-table` stays the Lucide edition. Switch later with the edition item and `--overwrite`."
- `### Changed`: "`ST_Icons` values are typed `ComponentType<ST_IconProps>`; the table's own files import icons through `icons.ts` only."
- `base-diff.json`, `aria-diff.json`: the five maps are byte-identical across bases and need no entry

#### 1.6.2 Icon maps

- `icons.ts` keeps the Lucide map; its `ST_Icons` type moves to `types.ts`
- `icons/tabler.ts`, `icons/phosphor.ts`, `icons/remixicon.ts`: imports renamed to the Lucide-side names where needed, same `ST_Default_Icons` object with the same 34 keys, `satisfies ST_Icons`
- `icons/hugeicons.tsx`: icons are data, so each entry is `icon(ArrowDown01Icon)` where `icon` returns a component rendering `<HugeiconsIcon icon={data} {...props} />`
- Substitutes, picked once per map and named in a comment on the entry: density rows (`Rows2`, `Rows3`, `Rows4`) in Phosphor and Remix, `SearchX` in Phosphor and Remix, `ChevronFirst` and `ChevronLast` in Hugeicons and Remix; Tabler has a direct icon for all 34 (D30)
- Does NOT change the key names, `useST_TableOptions.ts` merge `{ ...ST_Default_Icons, ...icons }`, or the `icons` table option

**Interfaces:**

```typescript
// types.ts
export type ST_IconProps = ComponentPropsWithoutRef<'svg'> & { size?: number | string };
export type ST_IconKey =
  | 'ArrowDownwardIcon' | 'ArrowRightIcon' | 'CancelIcon' | 'ChevronLeftIcon' | 'ChevronRightIcon'
  | 'ClearAllIcon' | 'CloseIcon' | 'ContentCopy' | 'DensityLargeIcon' | 'DensityMediumIcon'
  | 'DensitySmallIcon' | 'DragHandleIcon' | 'DynamicFeedIcon' | 'EditIcon' | 'ExpandMoreIcon'
  | 'FilterAltIcon' | 'FilterListIcon' | 'FilterListOffIcon' | 'FirstPageIcon' | 'FullscreenExitIcon'
  | 'FullscreenIcon' | 'KeyboardDoubleArrowDownIcon' | 'LastPageIcon' | 'MoreHorizIcon' | 'MoreVertIcon'
  | 'PushPinIcon' | 'RestartAltIcon' | 'SaveIcon' | 'SearchIcon' | 'SearchOffIcon' | 'SortIcon'
  | 'SyncAltIcon' | 'ViewColumnIcon' | 'VisibilityOffIcon';
export type ST_Icons = Record<ST_IconKey, ComponentType<ST_IconProps>>;

// icons.ts and every icons/<library>.ts(x)
export const ST_Default_Icons: ST_Icons;
```

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `icons.ts` | refactor | type import from `types.ts`, `satisfies ST_Icons` |
| `icons/tabler.ts`, `icons/phosphor.ts`, `icons/hugeicons.tsx`, `icons/remixicon.ts` | new | byte-identical across bases |
| `types.ts` `ST_IconProps`, `ST_IconKey`, `ST_Icons` | new | replaces `LucideProps` (39) and the `any` record (D10) |
| `ST_Checkbox.tsx:2`, `ST_TablePagination.tsx:3` | refactor | import through `icons.ts` and `types.ts` |

**Stays unchanged:** every call site of `icons.<Key>`, the `icons` option, `index.ts` exports.

#### 1.6.3 Registry build

- `lib.mjs` `buildBaseItems` returns `[core, lucideEdition, ...editions, ...locales]`: core from every library file except `icons.ts` and `icons/`, the Lucide edition from `icons.ts`, each edition from its `icons/<library>` file with `target` at the `icons.ts` path, locales as today but depending on core
- `mainItemAddress` keeps naming the edition `shadcn-table-<base>`; a new `coreItemAddress` names core; locales and `examples.mjs` use it
- `baseItems` recognizes core and editions as items of a base (name suffix `-<base>-core`, `-<base>-<library>`) so `hosted.mjs` and the docs `lib/locales.ts` generator (part 08) keep working; `aliasItems` strips the base suffix for the new names too
- `hosted.mjs` emits `shadcn-table-core.json`, `shadcn-table.json`, `shadcn-table-<library>.json` per base and re-points locale and example dependencies at the hosted core
- `scripts/check-icons.mjs`: reads the five maps per base through a TypeScript import or a regex over the export, exits non-zero when any key set differs; root and package script `check:icons`; `pr.yml` `library` job step after `lint`
- Does NOT rename `shadcn-table`, any locale item, any example item or any hosted path

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `buildBaseItems` | refactor | core, editions, locales on core |
| `coreItemAddress` | new | `lib.mjs` |
| `baseItems`, `aliasItems` | refactor | new name shapes |
| `hosted.mjs` | refactor | new hosted names, dependencies at core |
| `examples.mjs` library dependency | refactor | core |
| `scripts/check-icons.mjs`, scripts `check:icons`, `pr.yml` step | new | gate |
| `scripts/registry/check-bases.mjs` | keep | the maps are identical across bases |

**Stays unchanged:** `bases.mjs`, `add-part.mjs`, `base-diff.json`, `aria-diff.json`, `registry:dev` port and path shape.

#### 1.6.4 Installs in this repo

- `apps/shadcn-table-docs/scripts/install.mjs` installs `shadcn-table` (the Lucide edition) per base, which resolves core; no other change
- next-app and the part 09 gate apps install an edition from the local registry: `shadcn-table` for base, one non-Lucide edition for radix and aria (part 09)
- Storybook and the tests run on the source tree, which keeps `icons.ts` on Lucide

### 1.7 Dependencies and env

- `@tabler/icons-react`, `@phosphor-icons/react`, `@hugeicons/react`, `@hugeicons/core-free-icons`, `@remixicon/react`: devDependencies of `packages/shadcn-table` so the maps typecheck and `check-icons.mjs` runs; listed as `dependencies` of their edition items only
- No env vars

## 2. Instructions for AI

Halt rules of the index apply: `shadcn-table`, locale and example item names and every hosted path stay; the new names are additions. No part file edit.

### 2.1 Phases

#### 2.1.1 Phase 1: Types and maps

Lane: agent

- 1.7 devDependencies; 1.6.2 in every base (maps copied byte-identical); `check-icons.mjs` and its scripts
- Gates: `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:icons`, `check:bases`; `grep -rn "lucide-react" registry/*/components/ui/shadcn-table` matches the three `icons.ts` only

#### 2.1.2 Phase 2: Registry items

Lane: agent

- 1.6.3; `pnpm registry:build`, `pnpm registry:items`, `pnpm registry:hosted`; 1.6.4 docs `lib:install` per base
- CLI smoke in a scratch Next or Vite project under the scratchpad, per base, against `pnpm registry:dev` on 5310: `add` the Tabler edition into an empty project (files land once, `icons.ts` is the Tabler map, only `@tabler/icons-react` installed), then `add` the Lucide edition with `--overwrite` (`icons.ts` replaced, no prompt), then `add` a locale item (core not re-installed, no icon package added)
- Record each smoke result in `11-tracker.md`
- Gates: `check:bases`, docs `types:check`, `lint`, `build`; registry.json diff shows only additions and the dependency re-point

#### 2.1.3 Final phase: Cleanup

Lane: agent

- CHANGELOG lines from 1.6.1; `pr.yml` step; `pnpm format`
- PR into `claude/review` with `release:minor`, merge commit when green

### 2.2 Gates

- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:icons` green
- `pnpm check:bases` green; `pnpm registry:build` and `registry:hosted` produce the item set of 1.6.1 with `shadcn-table` unchanged in name and path
- CLI smoke of 2.1.2 green per base
- `pnpm --filter shadcn-table-docs types:check`, `lint`, `build` green after `lib:install`
- `pr.yml` green, including the `check:icons` step
