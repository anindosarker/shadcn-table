# 81: Date picker in the table's build
- Epic: E26

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The table's date filters will render `DatePicker` from `anindosarker/shadcn-date-picker` (D164). Before a library file can import it, the table repository needs four things it does not have: the picker's files and the parts they need in each of the three trees, the npm packages those files import, a registry build that turns the import into a dependency on the picker item at one pinned tag, and a docs install that gives each base its own copy. This spec adds those four and changes no library file, so no user sees a difference yet. Spec 82 writes the import.

### 1.2 Goals

- Each tree `packages/shadcn-table/registry/<base>/` holds the date picker of its base exactly as the shadcn CLI installs `anindosarker/shadcn-date-picker/date-picker-<base>` at the pinned tag, under `components/date-picker/`, with the hook and the parts it imports; the files are written by a tool and never edited by hand (D164).
- The tag lives in one place: the constant `DATE_PICKER_TAG` (`v0.1.0`) in `tools/registry/lib.mjs`. The tool, the registry build and the check read it; a later picker tag is a one-line change plus a rerun (epic E26 Notes).
- A library file that imports `@/components/date-picker/...` gives its base's core item the registry dependency `anindosarker/shadcn-date-picker/date-picker-<base>#<tag>`, in the plain build and under `--dev`; the picker's files are in no table item (D164).
- `pnpm lib:install <base>` in the docs app writes that base's picker below `components/ui-<base>/`, with imports that resolve to that base's parts, so the three bases do not share one copy.
- A check fails when a tree's picker differs from what the tool writes for the pinned tag.
- No file under `registry/<base>/components/ui/shadcn-table/` changes; the table's items in `registry.json` are the same as before this spec.
- Acceptance: programmatic. The checks of 1.6.5 pass on the three bases; `git diff --stat origin/claude/review -- 'packages/shadcn-table/registry/*/components/ui/shadcn-table'` prints nothing; `git diff origin/claude/review -- packages/shadcn-table/registry.json registry.json` prints nothing after `pnpm -w registry:build`.

### 1.3 Current structure

```
packages/shadcn-table/registry/<base>/components.json        ← style <base>-nova, aliases components @/components, ui @/components/ui, hooks @/hooks, utils @/lib/utils
packages/shadcn-table/registry/<base>/components/ui/*.tsx    ← 28 parts written by tools/registry/add-part.mjs; no calendar.tsx, no button-group.tsx
packages/shadcn-table/registry/<base>/components/ui/shadcn-table/  ← the library
packages/shadcn-table/registry/<base>/                       ← no components/date-picker/, no hooks/
packages/shadcn-table/package.json                           ← no react-day-picker, no date-fns
packages/shadcn-table/eslint.config.js:20                    ← globalIgnores: the parts 'registry/*/components/ui/*.tsx'
packages/shadcn-table/tsconfig.{baseui,radix,aria}.json      ← paths @/* to ./registry/<base>/*, include registry/<base>
tools/registry/lib.mjs:104-116                               ← uiImports: every `@/components/ui/<x>` import becomes the bare registry dependency <x>; nothing reads `@/components/date-picker`
tools/registry/lib.mjs:52-59                                 ← coreItemAddress, itemAddress: GitHub item address, or the local server URL under --dev
tools/registry/lib.mjs:319-333                               ← baseItems: the table's items of a base, files under registry/<base>/
tools/registry/add-part.mjs                                  ← one CLI run per part in a scratch project, files copied into the tree, formatted
tools/registry/hosted.mjs:20-21                              ← rewrites only the core dependency to the hosted URL
apps/shadcn-table-docs/lib/install.mjs:100-130               ← lib:install: the CLI adds the merged table item with the ui alias @/components/ui-<base>; then rewrites imports of the library copy
apps/shadcn-table-docs/components/ui-<base>/                 ← generated (P9): the parts and shadcn-table/
apps/shadcn-table-docs/tsconfig.ui-<base>.json               ← include components/ui-<base>/**
test/validate-repo/                                          ← registry-valid.mjs and the other repo checks
```

The picker item at `v0.1.0` (`shadcn-date-picker/registry/<base>/registry.json`): one item `date-picker-<base>`, type `registry:component`, 22 files with targets `@components/date-picker/...`, npm dependencies `date-fns`, `lucide-react`, `react-day-picker` and the base's primitives package, registry dependencies `badge`, `button`, `button-group`, `calendar`, `dialog`, `field`, `input-group`, `native-select`, `popover`, `use-mobile`. Its README lists the differences per base, by its decisions D171, D173 and D174.

### 1.4 Target structure

```
tools/registry/lib.mjs                                       ← + DATE_PICKER_TAG, + datePickerItemAddress(base); the import scan maps `@/components/date-picker/` to that address for the core item
tools/registry/add-date-picker.mjs                           ← new: writes one base's picker and hook from the pinned tag; `--check` compares without writing
package.json                                                 ← + script "add-date-picker"
packages/shadcn-table/registry/<base>/components/date-picker/**   ← new, 22 files per base, as the CLI installs them
packages/shadcn-table/registry/<base>/hooks/use-mobile.ts    ← new, as the CLI installs it
packages/shadcn-table/registry/<base>/components/ui/calendar.tsx, button-group.tsx   ← new, by add-part.mjs
packages/shadcn-table/package.json, pnpm-lock.yaml           ← + react-day-picker, date-fns at the ranges the picker's package.json has
packages/shadcn-table/eslint.config.js, .prettierignore      ← the picker and hook folders are ignored like the parts
apps/shadcn-table-docs/lib/install.mjs                       ← the picker dependency lands below components/ui-<base>/, imports rewritten per base
apps/shadcn-table-docs/components/ui-<base>/**               ← generated: + calendar.tsx, button-group.tsx; the picker appears once spec 82 imports it
test/validate-repo/lib/date-picker.mjs, test/validate-repo/run.mjs   ← new check: each tree's picker equals the tool's output for the tag
CONTRIBUTING.md                                              ← one short section: where the picker comes from, the tag constant, the two commands
```

**Stays unchanged:** every file under `registry/<base>/components/ui/shadcn-table/`; `packages/shadcn-table/registry.json` and the root `registry.json` (no library file imports the picker yet); the existing 28 parts of each tree; `tools/registry/hosted.mjs` unless 1.6.3 shows the dependency does not pass through it as written; the repository `shadcn-date-picker` (read only).

### 1.5 Flow

```
DATE_PICKER_TAG ──> add-date-picker.mjs <base>
   scratch project (style <base>-nova, the tree's aliases)
   shadcn add anindosarker/shadcn-date-picker/date-picker-<base>#<tag>
   copy components/date-picker/** and hooks/use-mobile.ts ──> registry/<base>/      (parts are not copied: add-part.mjs owns them)

registry build:  library file imports `@/components/date-picker/...`
   ──> core item registryDependencies + "anindosarker/shadcn-date-picker/date-picker-<base>#<tag>"
   ──> user's `shadcn add` of the table installs the picker and its parts

docs:  lib:install <base> ──> CLI resolves the dependency ──> components/ui-<base>/date-picker/** (+ hook), imports to ui-<base>
```

### 1.6 Components

#### 1.6.1 The tool `tools/registry/add-date-picker.mjs` (D164)

- Modelled on `add-part.mjs`: one base per run (`pnpm add-date-picker <base>`), a scratch project with the base's style and the tree's aliases, one CLI run of the item at `DATE_PICKER_TAG`, then a copy of `components/date-picker/**` and `hooks/use-mobile.ts` into the tree. Nothing else the CLI wrote is copied.
- The files are stored as the CLI wrote them: no prettier pass, no import rewrite, so they equal what a user of that style gets. They are excluded from eslint and prettier beside the parts.
- `--check` runs the same steps and exits 1 with the list of differing files when the tree differs; it writes nothing.
- `calendar` and `button-group` are added with `pnpm add-part <base> calendar button-group`, as every part is. The calendar part is the stock one the CLI writes for the style. The arrow-key behaviour of the stock `base-nova` calendar is card Q160 and is not changed here.
- The tool reads the item from GitHub, so it needs the network; a failed fetch exits 1 with the address it tried.

#### 1.6.2 npm packages

- `react-day-picker` and `date-fns` join `packages/shadcn-table/package.json` at the ranges `shadcn-date-picker/package.json` has at the tag, in the bucket where the base primitives packages sit. One `pnpm install`; this milestone owns `package.json` and the lockfile for the epic (P6).
- They are not dependencies of a table item: the picker item carries them.

#### 1.6.3 Registry build (D164)

- `DATE_PICKER_TAG` and `datePickerItemAddress(base)` in `tools/registry/lib.mjs`; the address is `anindosarker/shadcn-date-picker/date-picker-<base>#<tag>` in the plain build and under `--dev` (the dev server serves the table only).
- The scan that builds the core item's `registryDependencies` adds that address when a library file of the base imports from `@/components/date-picker/`. No other alias is mapped.
- The picker folder and the hook are not library files (they are outside `components/ui/shadcn-table`), so no table item lists them. The check of 1.6.5 proves it.
- `hosted.mjs` and `examples.mjs` are read: a dependency that is not the core item must pass through unchanged. If one of them drops or rewrites it, that script is fixed here and joins the owned files in the tracker.
- Proof without a library change: a fixture file that imports the picker is run through the scan in a test of the registry scripts, not committed into a tree.

#### 1.6.4 Docs install

- `apps/shadcn-table-docs/lib/install.mjs` sets the aliases for the CLI run so that the picker's files land in `components/ui-<base>/date-picker/` and the hook below `components/ui-<base>/`, and rewrites `@/components/date-picker/`, `@/components/ui/` and `@/hooks/` in the picker's files and in the library copy to that base's paths, with the same mechanism it uses for the library copy today.
- The removal step of the script (`install.mjs:202`) also clears the picker folder, so a rerun leaves no stale file.
- Until spec 82 imports the picker, `lib:install` adds only `calendar.tsx` and `button-group.tsx` when a part needs them, or nothing. The picker path is proven with the dev registry and a scratch branch state: the fixture import of 1.6.3 placed in one library file of the base tree, `lib:install base`, the picker present and type-checked, then the state discarded. The tracker records the commands and the result; nothing of it is committed.

#### 1.6.5 Checks

- `test/validate-repo/lib/date-picker.mjs`: for each base runs `add-date-picker <base> --check`. It is skipped with a printed line, not failed, when GitHub cannot be reached locally; in CI it runs.
- `pnpm test typecheck --base <base>` covers the picker files through the tree's tsconfig.
- The registry scripts test of 1.6.3.

### 1.7 Dependencies and env

- Network access to `github.com` for the tool and its check.
- `react-day-picker`, `date-fns`: new in `packages/shadcn-table`.
- The clone `~/Work/Personal/React-table/shadcn-date-picker` is a reference to read, never a source the tool copies from.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date picker item in the table trees

- Files owned: `tools/registry/lib.mjs`, `tools/registry/add-date-picker.mjs`, `package.json`, `packages/shadcn-table/package.json`, `pnpm-lock.yaml`, `packages/shadcn-table/eslint.config.js`, `.prettierignore`, `packages/shadcn-table/registry/base/components/date-picker/**`, `packages/shadcn-table/registry/radix/components/date-picker/**`, `packages/shadcn-table/registry/aria/components/date-picker/**`, `packages/shadcn-table/registry/base/hooks/use-mobile.ts`, `packages/shadcn-table/registry/radix/hooks/use-mobile.ts`, `packages/shadcn-table/registry/aria/hooks/use-mobile.ts`, `packages/shadcn-table/registry/base/components/ui/calendar.tsx`, `packages/shadcn-table/registry/base/components/ui/button-group.tsx`, `packages/shadcn-table/registry/radix/components/ui/calendar.tsx`, `packages/shadcn-table/registry/radix/components/ui/button-group.tsx`, `packages/shadcn-table/registry/aria/components/ui/calendar.tsx`, `packages/shadcn-table/registry/aria/components/ui/button-group.tsx`, `apps/shadcn-table-docs/lib/install.mjs`, `test/validate-repo/lib/date-picker.mjs`, `test/validate-repo/run.mjs`, `CONTRIBUTING.md`
- Depends on: none
- Review: fable
- Local CI: `pnpm test typecheck`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test installation-e2e`, one at a time (P5)
- Task 1: The site map. Every place that reads imports, aliases or dependencies for an item, a tree or the docs copy (`tools/registry/*.mjs`, `apps/shadcn-table-docs/lib/install.mjs`, `test/validate-repo/lib/*.mjs`, `test/installation-e2e/`) is listed in the tracker with file:line and `changes` or `passes through`. Checks: the table is in the tracker; each `passes through` line names the line that shows it
- Task 2: The packages, the two parts and the tool; the three trees filled (1.6.1, 1.6.2). Checks: `pnpm add-date-picker <base> --check` exits 0 on the three bases; `find packages/shadcn-table/registry/<base>/components/date-picker -type f | wc -l` prints `22` per base; `pnpm test typecheck --base base`, `--base radix`, `--base aria` green; `pnpm test lint` green; `git diff --stat origin/claude/review -- 'packages/shadcn-table/registry/*/components/ui/shadcn-table'` prints nothing
- Task 3: The registry build mapping and its test (1.6.3). Checks: the registry scripts test passes with the fixture giving `anindosarker/shadcn-date-picker/date-picker-<base>#v0.1.0` on the three bases, plain and `--dev`; `pnpm -w registry:build` then `git diff --stat -- packages/shadcn-table/registry.json registry.json` prints nothing; `grep -c "v0.1.0" tools/registry/*.mjs` counts one line, the constant
- Task 4: The docs install and its scratch proof (1.6.4). Checks: the tracker holds the commands and, for base, radix and aria, the line that `components/ui-<base>/date-picker/date-picker.tsx` existed and `pnpm --filter shadcn-table-docs types:check` passed with the fixture import; after the discard `git status --short` is empty; a plain `pnpm lib:install <base>` on the milestone head leaves no picker folder and a clean type check
- Task 5: The repo check and the `CONTRIBUTING.md` section (1.6.5). Checks: `pnpm test validate-repo` green; with one byte changed in a picker file of one tree it fails naming that file, the line in the tracker, the byte restored; `pnpm test installation-e2e` green (`--no-diff` locally, P5)

### 2.2 Checks

- Local CI as in the milestone block; nothing of the release suite beyond it.
- Review: `fable` on the whole diff (the registry build decides what every user installs; the docs install and the trees are shared by spec 82).
