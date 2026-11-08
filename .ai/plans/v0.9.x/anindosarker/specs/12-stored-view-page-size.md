# 12: Stored view persists rows per page

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`persistViewSettings` stores column order, pinning, visibility, density and the view settings, not the page size, so a visitor's rows-per-page choice resets on reload while the rest of the view survives. D25 adds `pageSize` to the stored view: saved on every page size change, restored at mount over `initialState.pagination.pageSize`; page index is not stored. Additive: old stored views stay valid.

### 1.2 Goals

- A table with `persistViewSettings` restores the rows-per-page choice on remount, on the three bases (D25).
- Page index is never stored; a stored view without `pageSize` keeps the initial page size (D25).
- The guide, the API entry and the changelog name the new field (P7).
- Acceptance: programmatic. The `Persistence` play of 1.6.4 green on the three bases (`pnpm test storybook-tests --base <base>`, story file `ViewSettings`), red on the shipped code first; `pnpm test typecheck --base radix|base|aria`, `pnpm test lint`, `pnpm test validate-repo` green; `pnpm test docs-e2e --base base /docs/guides/view-settings` green.

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/   (base, radix, aria byte-identical for these two files)
├── shared/utils/viewSettingsStorage.utils.ts:7-16   ← ST_StoredView: columnOrder, columnPinning, columnVisibility, density, viewSettings
├── shared/utils/viewSettingsStorage.utils.ts:99,113 ← writeStoredView, readStoredView
├── hooks/useST_ViewPersistence.ts:67-71             ← readView: the five fields
├── hooks/useST_ViewPersistence.ts:77-83             ← readDefaultView from initialState
├── hooks/useST_ViewPersistence.ts:98-117            ← applyView: viewSettings, density, visibility, order, pinning
├── hooks/useST_ViewPersistence.ts:120-135           ← reset view (density at :128)
├── hooks/useST_ViewPersistence.ts:170-176           ← useLayoutEffect: readKnownView, applyView at mount
├── hooks/useST_ViewPersistence.ts:182-196           ← save(): writeStoredView or removeStoredView; five atom subscriptions
└── components/table/ST_ViewPendingScript.tsx:22     ← pre-paint script, getViewSettingsKey (unchanged)
apps/shadcn-table-docs/
├── lib/prop-tables/tableOptions.ts:1850-1858        ← persistViewSettings entry, field list at :1853
├── content/docs/guides/view-settings.mdx:52-59      ← stored list; :59 "What is not stored: ... the page and column sizes"
└── content/docs/guides/state-management.mdx:159     ← stored fields
packages/shadcn-table/stories/features/ViewSettings.stories.tsx:227-269 ← Persistence story, play at :233
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── shared/utils/viewSettingsStorage.utils.ts ← ST_StoredView.pageSize?: number
└── hooks/useST_ViewPersistence.ts            ← readView, readDefaultView, applyView, reset, save and the subscriptions carry pageSize
apps/shadcn-table-docs/
├── lib/prop-tables/tableOptions.ts           ← entry lists rows per page
├── content/docs/guides/view-settings.mdx     ← stored list gains rows per page; :59 drops "page size", keeps column sizes
└── content/docs/guides/state-management.mdx  ← stored fields
packages/shadcn-table/stories/features/ViewSettings.stories.tsx ← Persistence play covers page size
generated (P9): apps/shadcn-table-docs/components/ui-<base>/shadcn-table/**, public/r/**
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 12 Stored view persists rows per page` under `## Unreleased` (D25).
- Generated copies: `pnpm registry:build`, `pnpm registry:hosted`, then `pnpm --filter shadcn-table-docs lib:install <base>` for base, radix and aria; `pnpm test validate-repo` green afterwards (P9: generated, not owned).

#### 1.6.2 Stored view

`shared/utils/viewSettingsStorage.utils.ts`, status `refactor`, three bases identical.

**Interfaces:**

```typescript
export interface ST_StoredView {
  readonly columnOrder?: readonly string[];
  readonly columnPinning?: { end?: readonly string[]; start?: readonly string[] };
  readonly columnVisibility?: Readonly<Record<string, boolean>>;
  readonly density?: ST_DensityState;
  readonly pageSize?: number;
  readonly viewSettings?: Partial<ST_ViewSettingsState>;
}
```

- `readStoredView` accepts an entry without `pageSize`; a non-positive or non-integer `pageSize` is dropped as if absent.

#### 1.6.3 Persistence hook

`hooks/useST_ViewPersistence.ts`, status `refactor`, three bases identical.

- `readView` (`:67-71`) and `readDefaultView` (`:77-83`) add `pageSize` from `table.getState().pagination.pageSize` and `initialState.pagination.pageSize`.
- `applyView` (`:98-117`) calls `table.setPageSize(view.pageSize)` when the stored view has one; page index is untouched.
- The reset path (`:120-135`) returns the page size to the default view's value.
- `save()` (`:182-189`) includes `pageSize`; the subscriptions (`:190-196`) add the pagination atom, and `save` is skipped when only `pageIndex` changed (compare the previous page size).
- Does NOT store `pageIndex`, sorting, filters or the global filter; does NOT touch `ST_ViewPendingScript.tsx`.

**Stays unchanged:** `getViewSettingsKey`, the key format, `useST_Effects.ts:40`.

#### 1.6.4 Story and docs

- `stories/features/ViewSettings.stories.tsx`, `Persistence` (`:227`), status `refactor`: the play also picks another rows-per-page value, remounts the story (the existing remount step), and asserts the value held. It runs on the shipped code first and must fail there, the red line in the tracker (P11).
- `lib/prop-tables/tableOptions.ts:1853`, status `refactor`: "view settings, the pins, column visibility, order, pinning and rows per page".
- `content/docs/guides/view-settings.mdx:52-59`, status `refactor`: the stored list gains "rows per page"; the not-stored line keeps the page index and column sizes. `state-management.mdx:159` matches. `examples/persistent-view.mdx` is spec 11's file and names the option without a field list.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Stored view page size

- Files owned: `packages/shadcn-table/registry/radix/components/ui/shadcn-table/shared/utils/viewSettingsStorage.utils.ts`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/shared/utils/viewSettingsStorage.utils.ts`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/shared/utils/viewSettingsStorage.utils.ts`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts`, `packages/shadcn-table/stories/features/ViewSettings.stories.tsx`, `apps/shadcn-table-docs/lib/prop-tables/tableOptions.ts`, `apps/shadcn-table-docs/content/docs/guides/view-settings.mdx`, `apps/shadcn-table-docs/content/docs/guides/state-management.mdx`
- Depends on: none
- Review: fable
- Local CI: `pnpm test typecheck --base radix`, `pnpm test typecheck --base base`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base <base>` for base, radix and aria one after another (P5), `pnpm test docs-e2e --base base /docs/guides/view-settings`
- Task 1: Reproduce: extend the `Persistence` play (1.6.4), run it on the shipped code on base, record the red line in the tracker (P11). Checks: the play fails
- Task 2: Stored view and hook, radix first, then copy to base and aria (1.6.2, 1.6.3). Checks: `pnpm test typecheck --base radix|base|aria`; the `Persistence` play green on the three bases
- Task 3: Docs and API entry (1.6.4), the generated copies (1.6.1). Checks: `pnpm test validate-repo`; `pnpm test docs-e2e --base base /docs/guides/view-settings`
- Task 4: Cleanup: `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base radix|base|aria` and `pnpm test lint` green
- `pnpm test storybook-tests --base base|radix|aria` green (`ViewSettings` plays included)
- `pnpm test validate-repo` green: registry, copies and `public/r` in step
- `pnpm test docs-e2e --base base /docs/guides/view-settings` green
- Review: fable (public option, shared storage format, three bases)
