# 02: parts untouched

## 1. Architecture

### 1.1 Overview

`registry/aria/components/ui/label.tsx` differs from what `add-part.mjs` writes: its unused
`import * as React` was removed to satisfy `noUnusedLocals` in `tsconfig.radix.json`, which
every edition's tsconfig extends. Decision 2 in [decisions.md](decisions.md): parts are never
edited, a check that fails on a part is fixed in the check. TypeScript cannot exempt a path
from `noUnusedLocals`, ESLint can, so the unused checks move there.

### 1.2 Goals

- `pnpm add-part aria label` leaves no diff after this part
- `tsc:radix`, `tsc:baseui`, `tsc:aria` green without `noUnusedLocals` or `noUnusedParameters`
- `pnpm --filter shadcn-table lint` reports an unused local or parameter in the library with
  the same tolerance tsc had (`_` prefix ignored), and nothing in a part

### 1.3 Current structure

```
packages/shadcn-table/
├── tsconfig.radix.json        noUnusedLocals, noUnusedParameters; base and aria extend it
├── eslint.config.js           recommended rules on **/*.{ts,tsx}; folded core: no-unused-vars off
└── registry/aria/components/ui/label.tsx   edited part (commit 9c7d8276)
```

### 1.4 Target structure

```
packages/shadcn-table/
├── tsconfig.radix.json        no unused flags
├── eslint.config.js           parts ignored; no-unused-vars with _ patterns; folded core args none
└── registry/aria/components/ui/label.tsx   as add-part.mjs writes it
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `## Unreleased` `### Fixed`: the aria `label` part is shipped as shadcn
  ships it; unused code is linted, not type-checked
- `docs/code-of-conduct/coding-standards.md` Editions: one bullet, parts are never edited, a
  check that fails on a part is fixed in the check; Gates block unchanged

#### 1.6.2 `tsconfig.radix.json`

- Drops `noUnusedLocals` and `noUnusedParameters`
- Does NOT change `strict`, `include`, `exclude`, paths; `tsconfig.baseui.json` and
  `tsconfig.aria.json` untouched

#### 1.6.3 `eslint.config.js`

- `globalIgnores` gains `registry/*/components/ui/*.tsx` (parts; the library lives under
  `components/ui/shadcn-table/`)
- Library block (`**/*.{ts,tsx}`): `@typescript-eslint/no-unused-vars` set to `error` with
  `argsIgnorePattern`, `varsIgnorePattern`, `caughtErrorsIgnorePattern` all `^_`, so what tsc
  tolerated stays tolerated
- Folded core block: `@typescript-eslint/no-unused-vars` becomes `['error', { args: 'none', varsIgnorePattern: '^_' }]`
  instead of `off`; the other MRT relaxations stay
- Does NOT add new plugins

**Stays unchanged:** `scripts/registry/add-part.mjs`, `check-bases.mjs`, `aria-diff.json`
(the part is already listed there, since aria ships its own `label`).

#### 1.6.4 `label.tsx`

- Restored with `pnpm add-part aria label`; nothing else in the output is kept (dependent parts
  the script prints are already present)

### 1.7 Dependencies and env: none

## 2. Instructions for AI

Tracker `02-tracker.md`. Branch `v0.6/parts-untouched` from `claude/review`, worktree `08`.
One coder, one reviewer, one verifier. Halt on: a part that still fails after the config
change (that is a second config problem, not a part edit), any other part showing a diff.

### 2.1 Phases

#### 2.1.1 Phase 01: config and part

- 1.6.2, 1.6.3, 1.6.4 in one commit each
- If lint then reports an unused local or parameter in the library that tsc let through, fix
  it in the library file, every tree, in the same change

#### 2.1.2 Final phase: docs and gates

- 1.6.1; 2.2; CI-only PR into `claude/review`

### 2.2 Gates

- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`: green
- `pnpm --filter shadcn-table lint`: green; a scratch unused import in a library file turns it
  red, the same import in a part does not
- `pnpm add-part aria label && git status --short`: nothing
- `pnpm check:bases`: green
- `pr.yml` green on the CI-only PR
