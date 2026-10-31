# 11: icon editions

## 1. Architecture

### 1.1 Overview

Every registry item ships Lucide: `icons.ts` imports 33 Lucide icons, three more files import `lucide-react` directly (`ST_Checkbox.tsx:2,22` imports `MinusIcon` for the indeterminate dash), and `lucide-react` is a dependency of every main item, so a project created with Tabler, Phosphor, Hugeicons or Remix gets a second icon set (F33). Decision D30: one icon map per library with the same 35 keys (the 34 of today plus `IndeterminateIcon`), a `shadcn-table-core` item without icons, and one edition item per library that supplies `icons.ts` and its package. The CLI resolves core first and dedupes files by target, so a consumer ends with one `icons.ts` and only their icon package. Verified on shadcn 4.23.0 (D30). Workstream S3 (index, Run plan) (D34): branch `v0.7/icon-sets`, worktree `shadcn-react-table.worktrees/icon-sets`, from `claude/review` after the foundation merges, parallel to S1; the icon devDependencies, the icon types in `types.ts`, `check-icons.mjs`, the `pr.yml` and `install.yml` edits and the `smoke.mjs` item list are already in from the foundation.

### 1.2 Goals

- Five icon maps per base export the same 35 keys; a script proves the key sets equal (D30)
- `grep -rn "lucide-react" registry/<base>/components/ui/shadcn-table` matches `icons.ts` only, in every base (F33)
- `ST_Icons` is typed with `ST_IconProps`, no `any`, in the library and in the docs `font-awesome-icons` example (D10) (D30)
- Per base the registry has `shadcn-table-core`, `shadcn-table` (Lucide) and four editions; locale and example items depend on core; `shadcn-table` keeps its name and hosted path
- `shadcn add` of an edition into a scratch project installs core files plus one `icons.ts` and only that icon package; `--overwrite` of another edition replaces `icons.ts` without a prompt (D30)
- Docs app copies and the next-app install use editions; all gates green per base
- Acceptance: `pnpm check:icons` exits 0; `grep -rn "lucide-react" packages/shadcn-table/registry/*/components/ui/shadcn-table` lists the three `icons.ts` only; the six `shadcn add` dry-runs against `registry:dev` on 5310 exit 0; the Tabler-then-Lucide `--overwrite` smoke leaves one `icons.ts` importing `lucide-react` and no `@tabler/icons-react` in the scratch `package.json` (P6)

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── icons.ts                          ← 33 Lucide imports, ST_Default_Icons (34 keys), ST_Icons = Record<..., any> (74)
├── components/inputs/ST_Checkbox.tsx ← MinusIcon from 'lucide-react' (2, 22)
├── types.ts                          ← LucideProps (39), ST_CircularProgressProps = LucideProps (136)
└── components/toolbar/ST_TablePagination.tsx ← LucideIcon (3)
apps/shadcn-table-docs/examples/<base>/font-awesome-icons/TS.tsx ← ST_Icons import (7), (props: any) (37)
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
├── icons.ts                          ← Lucide map, 35 keys, dev default, ships in the `shadcn-table` edition only
├── icons/
│   ├── tabler.ts                     ← same 35 keys from @tabler/icons-react
│   ├── phosphor.ts                   ← @phosphor-icons/react
│   ├── hugeicons.ts                  ← @hugeicons/react + @hugeicons/core-free-icons, one createElement wrapper per icon (D30)
│   └── remixicon.ts                  ← @remixicon/react
├── types.ts                          ← ST_IconProps, ST_IconKey, ST_Icons; no lucide import (foundation type surface)
├── components/inputs/ST_Checkbox.tsx ← icons.IndeterminateIcon through the table icons, no direct import
└── components/toolbar/ST_TablePagination.tsx ← icon type from '../../types'
packages/shadcn-table/scripts/
├── registry/lib.mjs                  ← buildBaseItems emits core, editions, locales on core; coreItemAddress; baseItems returns core, main, editions, locales
├── registry/hosted.mjs               ← hosted names shadcn-table-core, shadcn-table, shadcn-table-<library>
├── registry/examples.mjs             ← every example item gains a dependency on core
└── check-icons.mjs                   ← foundation: regex gate, equal key sets across the five maps per base
packages/shadcn-table/registry.json    ← regenerated output (registry:build)
apps/shadcn-table-docs/scripts/install.mjs ← merges core, the Lucide edition and the locales per base
apps/shadcn-table-docs/registry.json   ← regenerated output (registry:build)
apps/shadcn-table-docs/components/ui-<base>/ ← regenerated output (lib:install)
apps/shadcn-table-docs/examples/<base>/font-awesome-icons/TS.tsx ← ST_Icons typed, no `any`
.github/workflows/pr.yml, install.yml  ← foundation: dry-run and install resolve through `registry:dev`, not the GitHub default branch
scripts/release/smoke.mjs              ← foundation: expectedItems with core and the four editions
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `registry.json` per base (committed names keep the `-<base>` suffix as today, hosted names drop it):
  - `shadcn-table-<base>-core`: every library file except `icons.ts`; `dependencies` without `lucide-react`; `registryDependencies` the shadcn parts
  - `shadcn-table-<base>`: file `icons.ts`; `dependencies` `lucide-react`; `registryDependencies` core. Same name and hosted path `/r/<base>/shadcn-table.json` as today
  - `shadcn-table-<base>-tabler`, `-phosphor`, `-hugeicons`, `-remixicon`: file `icons/<library>.ts` with `target` `@ui/shadcn-table/icons.ts`; `dependencies` the icon package (`@tabler/icons-react`, `@phosphor-icons/react`, `@hugeicons/react` plus `@hugeicons/core-free-icons`, `@remixicon/react`), pinned like the other dependencies; `registryDependencies` core
  - locale items `shadcn-table-<base>-locale-<code>` and the example items: `registryDependencies` name core instead of the main item (F26)
  - Address form of core in committed items: `coreItemAddress(base)` follows `mainItemAddress` (`lib.mjs:45-48`): `anindosarker/shadcn-table/shadcn-table-<base>-core` in the committed catalog, `http://localhost:5310/r/shadcn-table-<base>-core.json` (or `REGISTRY_BASE_URL`) under `--dev`. The GitHub form resolves from the default branch, where core exists only once 0.7.0 is on `master`, so every CI resolution of an edition, locale or example runs against `registry:dev` (1.6.5); the GitHub form is for consumers after the release, as the locale items already work today
  - aliases of the default base for the new items, as `aliasItems` does today
- Hosted output `apps/shadcn-table-docs/public/r/<base>/`: `shadcn-table-core.json`, `shadcn-table.json`, `shadcn-table-<library>.json`, locales and examples re-pointed at `<HOSTED_URL>/<base>/shadcn-table-core.json`
- `CHANGELOG.md` `## Unreleased` `### Added`: "Icon editions: `shadcn-table-tabler`, `shadcn-table-phosphor`, `shadcn-table-hugeicons` and `shadcn-table-remixicon` install the table with that icon library instead of Lucide; `shadcn-table` stays the Lucide edition. Switch later with the edition item and `--overwrite`."
- `### Changed`: "`ST_Icons` values are typed `ComponentType<ST_IconProps>`; the table's own files import icons through `icons.ts` only; the checkbox's indeterminate dash is the new `IndeterminateIcon` key."
- `base-diff.json`, `aria-diff.json`: the five maps are byte-identical across bases and need no entry

#### 1.6.2 Icon maps

- `icons.ts` keeps the Lucide map and gains the key `IndeterminateIcon` (Lucide `Minus`), which `ST_Checkbox.tsx` reads through the table icons instead of importing `MinusIcon` from `lucide-react` (`ST_Checkbox.tsx:2,22`); its `ST_Icons` type lives in `types.ts` (foundation)
- `icons/tabler.ts`, `icons/phosphor.ts`, `icons/remixicon.ts`: imports renamed to the Lucide-side names where needed, same `ST_Default_Icons` object with the same 35 keys, `satisfies ST_Icons`
- `icons/hugeicons.ts`: icons are data, so each entry is `icon(ArrowDown02Icon)` where `icon = (data: IconSvgElement) => (props: ST_IconProps) => createElement(HugeiconsIcon, { icon: data, ...props })`. No JSX: the file installs at the `icons.ts` target and JSX in a `.ts` file fails the consumer's `tsc` and `next build` (D30)
- Comments in `icons/*.ts` say "icon set", never "edition" (07's grep excludes these files but the word stays out of shipped comments)
- Icon per library, checked against each package's type exports; milestone 1 `tsc:*` with the foundation devDependencies is the proof. Direct matches: Tabler 34 of 34, Hugeicons 32, Phosphor 30, Remix 28; the rest are substitutes, marked `*`, each named in a comment on its entry. The "16 names without equivalent" count in F33 was an estimate; the verified counts stand (F33)

| Lucide | Tabler | Phosphor | Hugeicons | Remix |
| --- | --- | --- | --- | --- |
| `ArrowDown` | `IconArrowDown` | `ArrowDownIcon` | `ArrowDown02Icon` | `RiArrowDownLine` |
| `ArrowDownWideNarrow` | `IconSortDescending` | `SortDescendingIcon` | `SortByDown01Icon` | `RiSortDesc` |
| `ArrowLeftRight` | `IconArrowsLeftRight` | `ArrowsLeftRightIcon` | `ArrowDataTransferHorizontalIcon` | `RiArrowLeftRightLine` |
| `ChevronDown` | `IconChevronDown` | `CaretDownIcon` | `ArrowDown01Icon` | `RiArrowDownSLine` |
| `ChevronFirst` | `IconChevronLeftPipe` | `CaretLineLeftIcon` | `ArrowLeftDoubleIcon` * | `RiSkipLeftLine` * |
| `ChevronLast` | `IconChevronRightPipe` | `CaretLineRightIcon` | `ArrowRightDoubleIcon` * | `RiSkipRightLine` * |
| `ChevronLeft` | `IconChevronLeft` | `CaretLeftIcon` | `ArrowLeft01Icon` | `RiArrowLeftSLine` |
| `ChevronRight` | `IconChevronRight` | `CaretRightIcon` | `ArrowRight01Icon` | `RiArrowRightSLine` |
| `ChevronsDown` | `IconChevronsDown` | `CaretDoubleDownIcon` | `ArrowDownDoubleIcon` | `RiArrowDownDoubleLine` |
| `Columns3` | `IconColumns3` | `ColumnsIcon` | `LayoutThreeColumnIcon` | `RiLayoutColumnLine` |
| `Copy` | `IconCopy` | `CopyIcon` | `Copy01Icon` | `RiFileCopyLine` |
| `Eraser` | `IconEraser` | `EraserIcon` | `EraserIcon` | `RiEraserLine` |
| `EyeOff` | `IconEyeOff` | `EyeSlashIcon` | `ViewOffIcon` | `RiEyeOffLine` |
| `Filter` | `IconFilter` | `FunnelIcon` | `FilterIcon` | `RiFilterLine` |
| `FilterX` | `IconFilterOff` | `FunnelXIcon` | `FilterRemoveIcon` | `RiFilterOffLine` |
| `GripVertical` | `IconGripVertical` | `DotsSixVerticalIcon` | `DragDropVerticalIcon` | `RiDraggable` |
| `Layers` | `IconStack2` | `StackIcon` | `Layers01Icon` | `RiStackLine` |
| `ListFilter` | `IconFilter2` | `FunnelSimpleIcon` | `FilterHorizontalIcon` | `RiFilter2Line` |
| `Maximize` | `IconMaximize` | `ArrowsOutIcon` | `ArrowExpand01Icon` | `RiFullscreenLine` |
| `Minimize` | `IconMinimize` | `ArrowsInIcon` | `ArrowShrink01Icon` | `RiFullscreenExitLine` |
| `Minus` (`IndeterminateIcon`) | `IconMinus` | `MinusIcon` | `MinusSignIcon` | `RiSubtractLine` |
| `MoreHorizontal` | `IconDots` | `DotsThreeIcon` | `MoreHorizontalIcon` | `RiMoreLine` |
| `MoreVertical` | `IconDotsVertical` | `DotsThreeVerticalIcon` | `MoreVerticalIcon` | `RiMore2Line` |
| `Pencil` | `IconPencil` | `PencilSimpleIcon` | `PencilEdit01Icon` | `RiPencilLine` |
| `Pin` | `IconPin` | `PushPinIcon` | `PinIcon` | `RiPushpinLine` |
| `RotateCcw` | `IconRotate` | `ArrowCounterClockwiseIcon` | `RotateLeft01Icon` | `RiRestartLine` |
| `Rows2` | `IconBaselineDensityLarge` | `RowsIcon` * | `Rows2Icon` | `RiLayoutRowLine` * |
| `Rows3` | `IconBaselineDensityMedium` | `ListIcon` * | `Rows3Icon` | `RiMenuLine` * |
| `Rows4` | `IconBaselineDensitySmall` | `ListDashesIcon` * | `Rows4Icon` | `RiMenu2Line` * |
| `Save` | `IconDeviceFloppy` | `FloppyDiskIcon` | `FloppyDiskIcon` | `RiSave3Line` |
| `Search` | `IconSearch` | `MagnifyingGlassIcon` | `Search01Icon` | `RiSearchLine` |
| `SearchX` | `IconSearchOff` | `MagnifyingGlassMinusIcon` * | `SearchRemoveIcon` | `RiSearchLine` * |
| `X` | `IconX` | `XIcon` | `Cancel01Icon` | `RiCloseLine` |
| `XCircle` | `IconCircleX` | `XCircleIcon` | `CancelCircleIcon` | `RiCloseCircleLine` |

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
  | 'FullscreenIcon' | 'IndeterminateIcon' | 'KeyboardDoubleArrowDownIcon' | 'LastPageIcon' | 'MoreHorizIcon' | 'MoreVertIcon'
  | 'PushPinIcon' | 'RestartAltIcon' | 'SaveIcon' | 'SearchIcon' | 'SearchOffIcon' | 'SortIcon'
  | 'SyncAltIcon' | 'ViewColumnIcon' | 'VisibilityOffIcon';
export type ST_Icons = Record<ST_IconKey, ComponentType<ST_IconProps>>;

// icons.ts and every icons/<library>.ts
export const ST_Default_Icons: ST_Icons;
```

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `icons.ts` | refactor | type import from `types.ts`, `satisfies ST_Icons`, `IndeterminateIcon` key; the foundation's reasoned `no-explicit-any` disable at `icons.ts:74` goes with the `any` record |
| `icons/tabler.ts`, `icons/phosphor.ts`, `icons/hugeicons.ts`, `icons/remixicon.ts` | new | byte-identical across bases; `hugeicons.ts` uses `createElement` |
| `types.ts` `ST_IconProps`, `ST_IconKey`, `ST_Icons` | keep | foundation type surface (index, Run plan): replaces `LucideProps` (39) and `ST_CircularProgressProps = LucideProps` (136), the second public use; this spec consumes the types (D10) |
| `ST_Checkbox.tsx:2,22`, `ST_TablePagination.tsx:3` | refactor | `icons.IndeterminateIcon` from the table icons; icon type from `types.ts` (two-line overlap with S1 set C: whichever merges second resolves, code change wins) |
| `examples/<base>/font-awesome-icons/TS.tsx:7,37` | refactor | `ST_Icons` import kept, `(props: any)` becomes `(props: ST_IconProps)`; docs `lint` reports no `any` there |

**Stays unchanged:** every call site of `icons.<Key>`, the `icons` option, `index.ts` exports.

#### 1.6.3 Registry build

- `lib.mjs` `buildBaseItems` returns `[core, lucideEdition, ...editions, ...locales]`: core from every library file except `icons.ts` and `icons/`, the Lucide edition from `icons.ts`, each edition from its `icons/<library>` file with `target` at the `icons.ts` path, locales as today but depending on core
- `mainItemAddress` keeps naming the edition `shadcn-table-<base>`; a new `coreItemAddress(base)` names core in the same two forms (1.6.1); locales and `examples.mjs` use it
- `baseItems(catalog, base)` returns `{ core, main, editions, locales }`: `core` the `-<base>-core` item, `main` the Lucide edition `shadcn-table-<base>` (the name `scripts/install.mjs` and the docs `lib/locales.ts` generator read today), `editions` the four `-<base>-<library>` items, `locales` as today; `hasBaseName` accepts the new suffixes; `aliasItems` strips the base suffix for the new names too
- `hosted.mjs` emits `shadcn-table-core.json`, `shadcn-table.json`, `shadcn-table-<library>.json` per base and re-points locale, edition and example dependencies at the hosted core
- `examples.mjs`: every example item gains `coreItemAddress(base)` in `registryDependencies`. Today the library import is skipped as "covered by the library item" (`examples.mjs:143-146`) and example items carry no library dependency, so this row is new, not a re-point (D30)
- `scripts/check-icons.mjs` (foundation): a regex over `^\s+(\w+):` inside the `ST_Default_Icons` object of each of the five maps per base, no TypeScript import; exits non-zero when any key set differs from `icons.ts`; root and package script `check:icons`; one `pr.yml` `library` job step after `lint` with `if: matrix.base == 'base'` (the maps are byte-identical across bases)
- `scripts/release/smoke.mjs` (foundation): `expectedItems` includes `shadcn-table-core` and the four editions per base, plus a 200 check on `/r/<base>/shadcn-table-core.json`
- Does NOT rename `shadcn-table`, any locale item, any example item or any hosted path

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `buildBaseItems` | refactor | core, editions, locales on core |
| `coreItemAddress` | new | `lib.mjs`, same two forms as `mainItemAddress` |
| `baseItems` return shape, `hasBaseName`, `aliasItems` | refactor | `{ core, main, editions, locales }`, new name shapes |
| `hosted.mjs` | refactor | new hosted names, dependencies at core |
| `examples.mjs` core dependency on every example item | new | `coreItemAddress(base)`; the two address forms of 1.6.1 |
| `scripts/check-icons.mjs`, scripts `check:icons`, `pr.yml` step | keep | foundation gate |
| `scripts/registry/check-bases.mjs` | keep | the maps are identical across bases |

**Stays unchanged:** `bases.mjs`, `add-part.mjs`, `base-diff.json`, `aria-diff.json`, `registry:dev` port and path shape.

#### 1.6.4 Installs in this repo

- `apps/shadcn-table-docs/scripts/install.mjs`: today it reads `baseItems(...).main`, appends the locale items' files and rewrites `@/components/ui/` to `@/components/ui-<base>/` before `shadcn add` (`install.mjs:67-100`). After this spec it merges `core.files`, `main.files` (the Lucide `icons.ts`) and the locale files into one item before the rewrite, so the docs copies hold every file with the `ui-<base>` alias; it never lets the CLI resolve core through a GitHub address. `en.ts` sits in core (spec 08 reads it there)
- next-app and the spec 09 gate apps install an edition from the local registry: `shadcn-table` for base, one non-Lucide edition for radix and aria (spec 09)
- Storybook and the tests run on the source tree, which keeps `icons.ts` on Lucide

#### 1.6.5 CI resolution through `registry:dev`

- `registry:dev` today writes the base items plus aliases only (`build.mjs:32-38`); the example items live in `apps/shadcn-table-docs/registry.json` through `examples.mjs`. The dev build merges the `examples.mjs` output into `.dev/registry.json` and `.dev/r/`, with every example's core dependency in the `--dev` URL form, so `http://localhost:5310/r/example-basic-<base>.json` resolves
- `pr.yml` `registry` job: the five `shadcn add ... --dry-run` lines at 166-171 resolve `anindosarker/shadcn-table/<item>#<sha>`; the CLI then resolves that item's `registryDependencies` (core) from the GitHub default branch, where core does not exist until 0.7.0 is on `master`. The job starts `pnpm --filter shadcn-table registry:dev` and `serve` the way `install.yml:175-186` does, waits for `http://localhost:5310/r/shadcn-table-base-core.json`, and dry-runs `http://localhost:5310/r/shadcn-table-radix.json`, `/r/shadcn-table.json` (alias), `/r/shadcn-table-base-tabler.json` and the three `/r/example-basic-<base>.json` URLs. `registry validate "anindosarker/shadcn-table#<sha>"` stays, it validates the catalog only
- `install.yml`: the "Build and serve the dev registry" step (`install.yml:175-186`) moves before the "Add the library from the source" step (`install.yml:95`) and runs for every scenario, the `nextjs` one included (its `if: matrix.scenario != 'nextjs'` goes). The library step keeps the `source` template for releases (public URLs, whose dependencies hosted.mjs already re-points) and, when `source` names the GitHub form, swaps it for the dev URL `http://localhost:5310/r/$ITEM.json`. The example add at `install.yml:195` changes from `anindosarker/shadcn-table/$EXAMPLE_ITEM#$REF` to `http://localhost:5310/r/$EXAMPLE_ITEM.json`. `pr.yml:178` then passes `http://localhost:5310/r/<item>.json` as `source`
- Workflow-file edits only, written in the foundation (index, Run plan); no ruleset or repository setting changes
- Proof: the dry-run block runs locally against `registry:dev` in milestone 2, and the PR's `registry` and `install` jobs are green in milestone 3

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `build.mjs --dev` example items | new | `examples.mjs` output merged into `.dev/` |
| `pr.yml` `registry` job dry-runs (166-171) | refactor | `registry:dev` URLs after a serve step |
| `pr.yml` `install` `source` (178) | refactor | `registry:dev` URL template |
| `install.yml` dev registry step (175-186) | refactor | before the library add, every scenario |
| `install.yml` library step (95) | refactor | honours a local `source` |
| `install.yml` example add (195) | refactor | dev URL |

### 1.7 Dependencies and env

- `@tabler/icons-react`, `@phosphor-icons/react`, `@hugeicons/react`, `@hugeicons/core-free-icons`, `@remixicon/react`: devDependencies of `packages/shadcn-table` so the maps typecheck; added with the lockfile in the foundation (index, Run plan); this spec never touches `package.json` or the lockfile; listed as `dependencies` of their edition items only
- No env vars

## 2. Instructions for AI

P5 applies: `shadcn-table`, locale and example item names and every hosted path stay; the new names are additions. No part file edit. Workstream S3: one builder (opus) end to end, one fable review on the whole diff, gates once (index, Run plan).

### 2.1 Milestones

#### 2.1.1 Milestone 1: Maps and imports

Lane: agent

- 1.6.2 in every base (maps copied byte-identical), the `ST_Checkbox.tsx` and `ST_TablePagination.tsx` import lines, the `font-awesome-icons` example retype; the devDependencies, the types and `check-icons.mjs` are already in from the foundation
- Gates: `tsc:radix`, `tsc:baseui`, `tsc:aria` (the proof that every icon name in the 1.6.2 table exists), `lint`, `check:icons`, `check:bases`; `grep -rn "lucide-react" registry/*/components/ui/shadcn-table` matches the three `icons.ts` only; `grep -rn "no-explicit-any" registry/*/components/ui/shadcn-table/icons.ts` empty

#### 2.1.2 Milestone 2: Registry build

Lane: agent

- 1.6.3 (`lib.mjs`, `hosted.mjs`, `examples.mjs`), 1.6.4 `install.mjs` merge, the `build.mjs --dev` example merge of 1.6.5; `pnpm registry:build`, `pnpm registry:items`, `pnpm registry:hosted`, `pnpm registry:dev`; the workstream review checks the item set of 1.6.1 (names, files, `target`, dependencies, the two address forms) against `registry.json` and `.dev/registry.json`
- The `pr.yml` dry-run block of 1.6.5 run locally against `serve packages/shadcn-table/.dev -l 5310`: six green dry-runs, recorded in `trackers/11-tracker.md`
- Gates: `check:bases`; registry.json diff shows only additions and the dependency re-point; the six dry-runs green

#### 2.1.3 Milestone 3: Installs, CLI smoke

Lane: agent

- docs `lib:install` for base, radix and aria (the `pr.yml` and `install.yml` edits of 1.6.5 are the foundation's)
- CLI smoke in a scratch Next project under the scratchpad (`pnpm dlx shadcn@latest init --template next --base <base> --preset nova --yes`, as `install.yml:87` does), per base, against the dev server on 5310: `add` the Tabler edition into the empty project (files land once, `icons.ts` is the Tabler map, only `@tabler/icons-react` installed), then `add` the Lucide edition with `--overwrite` (`icons.ts` replaced, no prompt), then `add` a locale item (core not re-installed, no icon package added), then `add` `example-basic` (core resolved from the dev server)
- Record each smoke result in `trackers/11-tracker.md`
- Gates: docs `types:check`, `lint`, `build`; the PR's `registry` and `install` jobs green

#### 2.1.4 Final milestone: Gates once

Lane: agent

- CHANGELOG lines from 1.6.1 in the `### Spec 11` block; `pnpm format`
- Gates: 2.2 once, recorded in `../trackers/11-tracker.md`; merge per the index Workstreams rule

### 2.2 Gates

- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:icons` green
- `pnpm check:bases` green; `pnpm registry:build` and `registry:hosted` produce the item set of 1.6.1 with `shadcn-table` unchanged in name and path
- CLI smoke of 2.1.3 green per base; the six local dry-runs of 2.1.2 green
- `pnpm --filter shadcn-table-docs types:check`, `lint`, `build` green after `lib:install`
- `pr.yml` green, including the foundation's `check:icons` step and the `registry` and `install` jobs resolving core through `registry:dev` (1.6.5)
- `grep -rn "edition" packages/shadcn-table/registry/*/components/ui/shadcn-table/icons.ts packages/shadcn-table/registry/*/components/ui/shadcn-table/icons/` empty (comments say "icon set")
