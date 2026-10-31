# 07: comments and dead code

## 1. Architecture

### 1.1 Overview

Shipped library comments narrate MUI, MRT and TanStack v9 history, restate the next line and repeat one rationale across up to twelve files (F14) (F15) (F18) (F16). Decision D18: a comment is JSDoc on exported API or one sentence naming a non-obvious invariant or quirk. Decision D20: `getCommonToolbarStyles` goes (F19) and the anchor scaffolding copied into five menus becomes one hook holding the one copy of the menu rationale (F20). Runs in workstream S1 (index, Run plan) (D34): the foundation writes `hooks/useST_MenuAnchor.ts` to D26's interface with this spec's JSDoc, deletes `getCommonToolbarStyles` and adds the coding-standards and PR template lines; set C wires the five menus to the hook (1.6.2); every set applies the comment rows of 1.6.4 to its own files together with 02, 04, 05 and 06; the long gates run once at workstream end.

### 1.2 Goals

- `grep -rniE 'MUI|MRT|material-react-table|@mui|upstream|edition|forkedUi'` over the three library trees, `icons.ts` and `icons/` excluded (S3 owns them; their comments say "icon set"), returns nothing
- Every F14, F15, F16, F18 site below is deleted, cut to one sentence or moved, in all three bases
- The menu rationale exists once, in `hooks/useST_MenuAnchor.ts`; no menu holds `anchorRef`, a `getBoundingClientRect` style object or an inline close handler
- `getCommonToolbarStyles` exists nowhere in the repo outside `.ai/` and generated output
- No exported API loses its JSDoc; no behavior change; all gates green per base
- Acceptance: `grep -rniE 'MUI|MRT|material-react-table|@mui|upstream|edition|forkedUi|getCommonToolbarStyles' --exclude=icons.ts --exclude-dir=icons packages/shadcn-table/registry/*/components/ui/shadcn-table` prints nothing and `tsc:radix`, `tsc:baseui`, `tsc:aria` exit 0 (P6)

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── components/menus/ST_{Cell,Column,Row}ActionMenu.tsx, ST_FilterOptionMenu.tsx, ST_ShowHideColumnsMenu.tsx
│                                   ← each: anchorRef, rect, invisible span, close handler, focus return, 3 comments
├── shared/utils/style.utils.ts     ← getCommonToolbarStyles at :182 (radix :161), unused
└── (comment sites listed in 1.6.4)
```

### 1.4 Target structure

```
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/
├── hooks/useST_MenuAnchor.ts       ← foundation, D26 interface, byte-identical in all three bases, not in the barrel
├── components/menus/*.tsx          ← call the hook (set C); keep only their own placement and items
└── shared/utils/style.utils.ts     ← getCommonToolbarStyles gone (foundation)
docs/code-of-conduct/coding-standards.md ← comment rule under "## Code" (foundation)
.github/pull_request_template.md    ← checklist line (foundation)
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `## Unreleased`, `### Changed`: "Library comments state contracts only: porting history, restated code and repeated rationale are gone, and the five menus share one anchor hook."
- `### Changed`: "`getCommonToolbarStyles` is gone from `shared/utils/style.utils.ts`; nothing in the library used it." Changed, not Removed: it is not exported from `index.ts`, so it is not public surface per the API reference Versioning section.
- `registry.json` catalogs and hosted output regenerated (`registry:build`); docs app copies re-installed with `lib:install <base>` for each base.
- `base-diff.json`, `aria-diff.json`: unchanged (the hook is identical in all trees).

#### 1.6.2 useST_MenuAnchor

One hook for the anchor scaffolding of the five menus (D20). The foundation writes it to D26's interface (index, Run plan; the interface is in spec 10 1.6.5: `openerProps`, `spanProps`, `rect`, `onOpenChange`, `focusAnchor` reading the anchor through a ref at close, re-measure while open); this spec wires the menus to the foundation hook and owns the JSDoc below, the one copy of the three menu notes. No anchor state design lives here.

- Does NOT render the trigger: each base composes it differently (Base UI `render` with `nativeButton={false}`, Radix `asChild`, React Aria `Pressable`)
- Does NOT own `open`: `ST_CellActionMenu` opens on `!!cell`, the others on `!!anchorEl`

**JSDoc (written on the hook in the foundation):**

```typescript
/**
 * Menus open from an invisible span placed over the anchor, not from a button.
 * The menu restores focus after the anchor is cleared, so the last anchor is
 * kept in a ref and focused instead of the invisible trigger.
 */
export const useST_MenuAnchor: (options: ST_MenuAnchorOptions) => ST_MenuAnchor;
```

**Operations (per menu, all bases):**

| Operation | Status | Notes |
| --- | --- | --- |
| `useST_MenuAnchor({ anchorEl, setAnchorEl })` call | new | top of the component, before any early return (`ST_RowActionMenu` returns early) |
| `anchorRef`, `rect`, inline `style` object | refactor | from the hook (`rect`, `spanProps`) |
| inline `onOpenChange` closure | refactor | hook's `onOpenChange` |
| base `finalFocus`, radix `onCloseAutoFocus` body | refactor | `focusAnchor()`; base still returns `false`, radix still `preventDefault()`; spec 10 changes the base return per D26 |
| one play test per menu family (column, row, cell, filter option, show-hide) in `stories/fixed-bugs/MenuFocusReturn.stories.tsx` | new | open the menu, press Escape, expect focus on the opener; set C writes it, `test:<base>` carries it |
| "Base UI reads the popup's finalFocus", "anchors its menus to an invisible span", "returning false keeps Base UI off" | refactor | deleted, stated in the hook JSDoc |
| placement props (`align`, `alignOffset`, `side`, `sideOffset`, aria `placement`) | keep | menu-specific, read `rect` |
| `ST_CellActionMenu` `editingCell` focus condition, right-button `onMouseUpCapture` | keep | comment cut to one sentence (1.6.4) |
| `ST_CellActionMenu` `anchorEl` | keep | the action cell element, read at the component top, not inside the `Subscribe` render prop |

**Stays unchanged:** menu items, `handlePinColumn` in both files (D20), `ST_ActionMenuItem`, `ST_ShowHideColumnsMenuItems`, `useST_ComposedRef`, `index.ts`.

#### 1.6.3 Dead export

| Operation | Status | Notes |
| --- | --- | --- |
| `getCommonToolbarStyles` (`style.utils.ts:182`, radix `:161`, aria `:182`) | refactor | deleted with its export in the foundation; no importer in tree, stories or docs |

**Stays unchanged:** the 39 file-local exported types and the three unreferenced barrel types (F19) (D20), public type surface, `getCommonPinnedCellStyles`.

#### 1.6.4 Comment edits

Lines as of `e14088c9` in the base tree; specs 01 to 06 shift them, so each site is found by its text. Radix and aria repeat every row unless noted. Verified by reading at `e14088c9`: style.utils:12-21, ST_LinearProgressBar:27-30, utils:41,46,66, stConfigFeature:48-50, ST_FilterRangeSlider:78, stTableHook:22-38, pagination.utils:54-70, ST_SelectCheckbox:23-26, virtualization.utils:3-7, ST_EditRowModal:94, ST_CopyButton:32, ST_Table:42, ST_Checkbox:14, the radix-named lines.

| Category | Sites | Status | Action |
| --- | --- | --- | --- |
| F14 MUI/MRT provenance | `utils.ts:41` (debounce from @mui), `:46` (10 frames at 60 Hz), `:66` (createFilterOptions from @mui) | refactor | delete |
| F14 MUI narration | `style.utils.ts:12-21` (aria 12-18, radix own wording) | keep | left to spec 10 (D25 rewrites the keyframes and their comment in S2); set A does not touch these lines |
| F14 MUI narration | `toolbar/ST_LinearProgressBar.tsx:27-30` | refactor | cut to one sentence: hoisted so the rule exists before the class is set |
| F14 MRT in JSDoc | `inputs/ST_Checkbox.tsx:14` (path after spec 01) | refactor | cut "MRT's indeterminate look"; JSDoc keeps the dash contract |
| F14 base names | `features/stConfigFeature.ts:48-50` | refactor | cut to one sentence without base names: merged declarations must match across trees |
| F14 v9 narration | `hooks/stTableHook.tsx:33`, `hooks/useST_TableInstance.ts:114`, `hooks/useST_TableOptions.ts:196`, `shared/utils/column.utils.ts:174` | refactor | drop "v9", keep the behavior in present tense |
| F14 radix cross-base | radix `inputs/ST_FilterCheckbox.tsx:19` | refactor | cut to its own base: "Radix marks the mixed state with data-state." |
| F15 stale API in JSDoc | `types.ts:371` (radix :371, aria :387) "`table.store.state` or the atoms" | refactor | "the atoms"; the 05 2.2 `table.store` grep must be empty (D13) |
| F14 radix quirks | radix `ST_Checkbox:17`, `ST_Tooltip:28`, `ST_SelectCheckbox:111`, `ST_EditCellTextField:210`, `ST_FilterTextField:517,540`, `ST_CellActionMenu:129`, `stTableHook:75` | keep | keep: each states a quirk of the tree's own spec library; multi-line ones cut to one sentence |
| F15 inline labels | `shared/utils/pagination.utils.ts:54,56,59,65,67,70` | refactor | delete |
| F15 restatements | `modals/ST_EditRowModal.tsx:94`, `buttons/ST_EditActionButtons.tsx:55`, `hooks/useST_Effects.ts:153`, `shared/utils/cell.utils.ts:165,179` | refactor | delete |
| F15 "part props tree-neutral" x12 | ST_TableBodyRowGrabHandle:23, ST_CopyButton:32, ST_ExpandAllButton:42, ST_ExpandButton:47, ST_TableHeadCellColumnActionsButton:37, ST_TableHeadCellGrabHandle:32, ST_FilterCheckbox:50, ST_FilterRangeSlider:45, ST_SelectCheckbox:59, ST_EditRowModal:45, ST_TablePagination:74, ST_ToolbarAlertBanner:57 | refactor | delete (D18); `ST_NeutralPartPropTypes` JSDoc in `types.ts` states it |
| F15 "so they are hook subscriptions" x12 | ST_ToolbarDropZone:35, ST_TableBodyCell:70, ST_TableBody:56, ST_TableHeadCellFilterLabel:55, ST_Table:42, ST_ShowHideColumnsMenu:52, ST_FilterTextField:93, ST_FilterRangeSlider:54, ST_GlobalFilterTextField:48, useST_RowVirtualizer:34, useST_ColumnVirtualizer:31, useST_Rows:17 | refactor | delete (D18) |
| F15 user-ref x6 | ST_TableHead:50, ST_TableFooter:46, ST_TableContainer:61, ST_TableLayout:50, ST_TopToolbar:53, ST_BottomToolbar:57 | refactor | gone with spec 02; delete any copy left |
| F15 menu notes 5x3 | ST_CellActionMenu:46,115,151, ST_ColumnActionMenu:155,170,188, ST_FilterOptionMenu:235,251,271, ST_RowActionMenu:49,86,105, ST_ShowHideColumnsMenu:105,121,139 | refactor | delete; the `useST_MenuAnchor` JSDoc holds them (set C) |
| F15 "Created outside the subscription" x5 | ST_TableBodyCell:157, ST_TableLayout:72, ST_TableContainer:127, ST_TopToolbar:79, ST_BottomToolbar:81 | refactor | cut to one sentence each: the invariant is local to that subscription |
| F15 "keyframes read" x3 | ST_TableDetailPanel:146, ST_TableHeadCellFilterContainer:48, ST_GlobalFilterTextField:103 | keep | left to spec 10 (D25 replaces the animation path and deletes these comments in S2) |
| F15 "The live store" x3 | pagination.utils:157, row.utils:30, style.utils:99 | refactor | delete (spec 05 rewrote these reads; delete any copy left) |
| F15 "`items` gives the trigger the option label" x3 | ST_EditCellTextField:168, ST_FilterTextField:517, ST_TablePagination:194 (base tree) | refactor | cut to one sentence |
| F18 browser quirk | `menus/ST_CellActionMenu.tsx:137-145` | refactor | cut to one sentence: Chrome on macOS opens the context menu on mousedown, so the right-button release is swallowed |
| F18 repo tooling | `inputs/ST_SelectCheckbox.tsx:23-26` | refactor | delete (Vite and Storybook mean nothing in a user's app) |
| F18 MRT JSDoc | `shared/utils/virtualization.utils.ts:3-7` | refactor | cut to one sentence: keeps the dragged row or column rendered so its dragend fires |
| F18 type erasure | `features/stCellActionsFeature.ts:16-21`, `features/stEditingFeature.ts:19-24`, `hooks/useST_TableInstance.ts:204-209`, `types.ts:119-125` | refactor | cut to one sentence each (the hook site: whatever spec 03 left) |
| F18 mechanism | `features/stFilterModesFeature.ts:84-89`, `table/ST_TableContainer.tsx:89-93`, `hooks/stTableHook.tsx:22-28,32-38`, `head/ST_TableHeadCellFilterLabel.tsx:164-166` | refactor | cut to one sentence each |
| F16 stale note | `inputs/ST_FilterRangeSlider.tsx:78` | refactor | delete the comment; the guards stay (D18 covers the comment only) |

#### 1.6.5 Standards and review checklist

Both lines are written in the foundation (index, Run plan).

- `docs/code-of-conduct/coding-standards.md`, `## Code`, after "- Docs never restate what the code says; they are updated in the same commit as the code.":

  > - A comment in library source is JSDoc on exported API or one sentence naming a non-obvious invariant or a quirk of the browser or of the tree's own spec library. No porting history (MUI, MRT, another base, a TanStack version) and nothing that restates the next line. A rationale shared by several files is written once, where the pattern lives.

- `.github/pull_request_template.md`, `## Checklist`, after "A library change is made in every tree ...":

  > - [ ] Every comment I added or changed in library source is a contract: JSDoc on exported API or one sentence on an invariant or quirk, no history, no restatement.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

Runs in workstream S1 (index, Run plan); the hook, the dead-export deletion and the standards lines are already on `claude/review` from the foundation.

### 2.1 Milestones

#### 2.1.1 Milestone 1: wire the menus to the foundation hook (set C)

Lane: agent

- Set C: 1.6.2 operations in the five menus per base; delete the 15 menu notes (D20) (F20) (F15); the `MenuFocusReturn` play tests
- Reviewer (workstream review) bounces until: focus returns to the last anchor, open state unchanged, every menu renders and closes in the stories; no `anchorRef` left
- Gates per set: `eslint --max-warnings 0 <own files>`, `prettier --check <own files>`; `grep -rn "anchorRef\|getCommonToolbarStyles" packages/shadcn-table/registry` empty

#### 2.1.2 Milestone 2: comment sweep per file set

Lane: agent

- Per set A to D (index, Run plan): every `refactor` row of 1.6.4 whose files the set owns, except the menu rows (set C, milestone 1); radix first, byte-identical files copied to base and aria, diff-listed files edited per base (D18) (F14) (F15) (F16) (F18); the `keep` rows marked "left to spec 10" stay untouched
- Reviewer (workstream review) bounces any hunk failing: no history, no restatement, every kept comment is a contract the reader needs, no JSDoc on exported API lost, no code change in a comment-only hunk
- Gates per set: `eslint --max-warnings 0 <own files>`, `prettier --check <own files>`

#### 2.1.3 Final milestone: Gates once

Lane: inline

- 1.6.1 CHANGELOG lines in the `### Spec 07` block; `registry:build`, `lib:install base`, `lib:install radix`, `lib:install aria` at workstream end
- Gates: all of 2.2; `Gates: see 02-tracker.md` in `../trackers/07-tracker.md`

### 2.2 Gates

- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`: zero problems
- `pnpm --filter shadcn-table test:base`, `test:radix`, `test:aria`: green, the `MenuFocusReturn` play tests included
- `pnpm check:bases`: green, diff lists unchanged
- `grep -rniE 'MUI|MRT|material-react-table|@mui|upstream|edition|forkedUi' --exclude=icons.ts --exclude-dir=icons packages/shadcn-table/registry/{base,radix,aria}/components/ui/shadcn-table`: empty (the registry README's shadcn "upstream" lines and the three `registry.ts` "ported from material-react-table" credits sit outside and stay; `icons.ts` and `icons/` belong to S3)
- `grep -rnE 'tree-neutral \(ST_NeutralPartPropTypes\)|so they are hook subscriptions|The live store|getCommonToolbarStyles' packages/shadcn-table/registry apps/shadcn-table-docs/components`: empty
- Docs `types:check`, `lint`, `build` green after the re-install; `pr.yml` green
