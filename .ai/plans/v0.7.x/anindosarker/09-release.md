# 09: release

## 1. Architecture

### 1.1 Overview

Parts 01 to 08 prove the library with lint, types and Storybook; none of them runs the installed files in a Next 16 consumer. This part installs the table from the local registry into a Next 16 app per base, builds it and opens it with zero console warnings, then ships 0.7.0. The gate proves the menu anchors in state and `useEffectEvent` at runtime (D5), the canonical classes on the consumer's Tailwind (D16), the consumer lint (D17), the icon editions as installed by the CLI (D30) and the logical direction classes on an RTL page (D31). Runs after 07, 08, 10 and 11 merged; works on `claude/review`, `dev` and `master`, no part branch or worktree.

### 1.2 Goals

- Per base, an installed basic table page passes `next build` and opens with zero browser console warnings and errors (D5) (D16)
- `npx eslint components/ui/shadcn-table` zero problems in next-app, base only (D17); `gate-radix` and `gate-aria` skip the eslint step and run every other check of 1.6.2
- In every app, every menu opens and closes on the gate page; focus returns to the element it opened from, and the opener reads `aria-expanded` (D5) (D26)
- Per base, the installed edition matches: next-app (Lucide) has `icons.ts` importing `lucide-react`; `gate-radix` (Tabler) has `icons.ts` importing `@tabler/icons-react` and no `lucide-react` in `package.json`; `gate-aria` (Phosphor) the same with `@phosphor-icons/react` (D30)
- An RTL gate page (`dir="rtl"`, `columnResizeDirection: 'rtl'`) shows the resize handle on the start edge and a pinned column stuck to the correct side, per base (D31)
- 0.7.0 released: version PR `chore: version 0.7.0` merged, `release.yml` green, `node scripts/release/smoke.mjs` green

### 1.3 Current structure

```
../test-projects/next-app/            ← sibling of the repo checkout, own git repo, owner work in progress
├── components.json                   ← style base-nova, one style per app
├── app/page.tsx                      ← owner's example page, uncommitted edits
└── components/ui/shadcn-table/       ← installed base library
CHANGELOG.md                          ← `## Unreleased` from parts 01 to 08
.github/workflows/release.yml         ← decide, version PR, tag, wait for production, smoke, install, gh release
```

### 1.4 Target structure

```
../test-projects/next-app/
├── app/release-gate/page.tsx         ← new, the basic table, base, Lucide edition
└── app/release-gate/rtl/page.tsx     ← new, the same table under dir="rtl" with columnResizeDirection 'rtl' and a pinned column
<scratchpad>/gate-radix/, gate-aria/  ← throwaway Next apps, Tabler and Phosphor editions, outside every repo, deleted after the gate
master                                ← tag v0.7.0, CHANGELOG `## 0.7.0 - <date>`
```

### 1.5 Flow

```mermaid
sequenceDiagram
  participant R as claude/review
  participant D as dev
  participant M as master
  participant W as release.yml
  R->>D: fast-forward
  D->>M: PR, release:minor, merge when green
  M->>W: push: decide = version
  W->>M: version PR chore: version 0.7.0 from release/next
  M->>W: version PR merged: decide = release
  W->>W: tag v0.7.0, wait for production, smoke.mjs, install matrix, gh release, PR comments
```

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md`: the version PR renames `## Unreleased` to `## 0.7.0 - <date>`; nothing edited by hand
- `packages/shadcn-table/package.json` `version` `0.7.0`, through the version PR
- next-app: `app/release-gate/page.tsx` and `app/release-gate/rtl/page.tsx` new, `components/ui/shadcn-table` re-installed from the Lucide edition; `app/page.tsx`, `app/header-demo` and the owner's untracked files untouched; nothing committed there

#### 1.6.2 Runtime gate

One `components.json` holds one style, so one Next app cannot render all three bases. next-app (base-nova) covers `base`; radix and aria each get a throwaway Next app made the way `.github/workflows/install.yml` makes its Next scenario.

- Registry: root `pnpm registry:dev` on `claude/review` after 07, 08, 10 and 11 merged builds `packages/shadcn-table/.dev` and serves it on port 5310 (`/r/shadcn-table-<base>.json`, `/r/shadcn-table-<base>-<library>.json`); not `preview`, which also starts the three Storybooks and exits when shared servers hold their ports
- Editions (D30): next-app installs `shadcn-table-base` (Lucide), `gate-radix` installs `shadcn-table-radix-tabler`, `gate-aria` installs `shadcn-table-aria-phosphor`; after each install, `icons.ts` imports the expected package and `package.json` lists only that icon package
- Before any `shadcn add --overwrite` into next-app: `git -C ../test-projects/next-app status --short components/ui/shadcn-table` shows only untracked files, else halt with an ATTENTION item
- Page: one basic table, 20 rows, columns `firstName`, `lastName`, `age`, with `enableRowActions`, `enableCellActions`, `enableColumnFilterModes` and `enableRowSelection` on, so the column action, filter option, row action, cell action and show/hide columns menus all render
- Browser, in next-app, `gate-radix` and `gate-aria` alike: agent-browser on `next dev` on the app's own port; each of the five menus opens and closes with Escape, focus lands on the element it opened from and the opener's `aria-expanded` flips (D5) (D26); the search field opens focused and closes without a snap (D25); a column resize and a page change run; console zero warnings and errors
- RTL page: `app/release-gate/rtl/page.tsx` in next-app and the same route in the gate apps render the table inside `<div dir="rtl">` with `columnResizeDirection: 'rtl'`, `enableColumnPinning` and one column pinned to `left`; the check reads the resize handle's bounding box against its header cell (handle at the inline-start edge, the left side on screen) and the pinned cell's computed `inset-inline-start` (D31)
- Does NOT edit `app/page.tsx`, commit in next-app or change library source; a failure goes to `ATTENTION-<date>.md` naming the owning part

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| next-app `app/release-gate/page.tsx` | new | `base`, Lucide edition; left in place for the owner |
| next-app `app/release-gate/rtl/page.tsx` | new | RTL variant (D31); left in place |
| `gate-radix`, `gate-aria` apps | new | Tabler and Phosphor editions (D30); in the scratchpad, deleted in cleanup |

**Usage:**

```sh
# next-app, base
cd ../test-projects/next-app
git status --short components/ui/shadcn-table   # only untracked files, else halt
npx shadcn@latest add http://localhost:5310/r/shadcn-table-base.json --overwrite --yes
grep -l "lucide-react" components/ui/shadcn-table/icons.ts
pnpm build
npx eslint components/ui/shadcn-table   # next-app only
pnpm dev -p <port>

# radix and aria, one throwaway app each, a non-Lucide edition
pnpm dlx shadcn@latest init --template next --base <base> --preset nova --name gate-<base> --yes
cd gate-<base>
npx shadcn@latest add http://localhost:5310/r/shadcn-table-radix-tabler.json --yes      # gate-radix
npx shadcn@latest add http://localhost:5310/r/shadcn-table-aria-phosphor.json --yes     # gate-aria
grep -c "lucide-react" package.json   # 0
```

#### 1.6.3 Release

| Operation | Status | Notes |
| --- | --- | --- |
| `claude/review` into `dev` | keep | fast-forward, push |
| PR `dev` into `master` | keep | label `release:minor`, `pr.yml` green, merged |
| version PR `chore: version 0.7.0` | keep | opened by `release.yml` from `release/next`; merged when green |
| `release.yml` release path | keep | tag `v0.7.0`, wait for production, `node scripts/release/smoke.mjs`, install matrix per base, `gh release create`, PR comments |

**Stays unchanged:** `release.yml`, `install.yml`, `pr.yml`, `scripts/release/*`, rulesets, library source.

### 1.7 Dependencies and env: none new

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: Runtime gate

Lane: agent

- 1.6.2 for `base` in next-app, then `radix` and `aria` in their throwaway apps; the `git status` pre-step before the next-app install; one root `pnpm registry:dev` serve on 5310, the agent's own dev ports, never stopping other servers
- Record per base in `09-tracker.md`: edition installed and its `icons.ts` import, build result, eslint count (next-app only), console count, each menu's focus target and `aria-expanded`, the search field open and close result, the RTL handle edge and pinned offset; the same rows for all three apps
- Halt: any console warning or error, any eslint problem, a menu that does not return focus, an edition whose `icons.ts` or `package.json` names the wrong icon package, an RTL handle on the end edge or a pinned column on the wrong side; each goes to `ATTENTION-<date>.md` with the owning part (10, 11 or 06)
- Gates: per base `next build` green, console zero warnings and errors, the five menu checks and the search field check (D5) (D16) (D25) (D26); next-app `npx eslint components/ui/shadcn-table` zero (D17); edition checks (D30); RTL checks (D31)

#### 2.1.2 Final phase: Release and cleanup

Lane: inline

- Delete the `gate-radix` and `gate-aria` apps; stop the `registry:dev` serve and the dev servers this part started
- 1.6.3 in order; push right after each merge
- Halt: `release.yml` or `smoke.mjs` red
- Gates: 2.2

### 2.2 Gates

- Per base: `next build` green, browser console zero warnings and errors on the gate page and the RTL page; the five menus return focus and flip `aria-expanded`; the search field opens focused and closes without a snap (D5) (D16) (D25) (D26)
- next-app (base): `npx eslint components/ui/shadcn-table` zero problems (D17)
- Per base: the installed edition's `icons.ts` imports the expected package; `gate-radix` and `gate-aria` have no `lucide-react` (D30)
- Per base: RTL page handle at the inline-start edge, pinned cell `inset-inline-start` set (D31)
- `pr.yml` green on the `dev` into `master` PR
- Version PR `chore: version 0.7.0` merged; `release.yml` green on its merge, install matrix included
- `node scripts/release/smoke.mjs` green against www.shadcn-table.com
