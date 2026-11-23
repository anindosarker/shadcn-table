# 79: Date picker Radix and React Aria versions
- Epic: E25

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The table ships on three bases, so the date picker library does too (D162): besides the approved Base UI version of spec 78 it gets a Radix version and a React Aria version, new work with the same files and names, the same look and the same behaviour. The Base UI code was reached in many reviewed rounds with the owner; the two new versions must not re-open any of it. So the work starts with a written design plan for both bases, reviewed before any code, and each version is then built against that plan and measured against the Base UI version with the stories of spec 78. Three milestones in one spec: the plan reads the 22 files once for both bases, and the two versions are the same job on two trees, side by side.

This spec builds in the repository `anindosarker/shadcn-date-picker`; the design plan and the trackers are files of the table repository.

### 1.2 Goals

- A design plan, `reference/q149-calendar-library/design-radix-aria.md`, says for each of the 22 files and each of the two bases whether the file is byte-identical to the Base UI file or differs, and for each difference names the Base UI API used and its replacement, with the line of the part or library source that proves it (D162, epic note).
- `registry/radix/components/date-picker/` and `registry/aria/components/date-picker/` hold the same 22 file names in the same folders as the Base UI tree (D162, report 2.2 and 5).
- Every play of spec 78 passes unchanged on Radix and on React Aria: the Base UI version is the reference for the tests (D162, report 5).
- The same look: on the twelve type stories, closed and open, at 1280 and 390 wide, the picker's parts sit at the same positions with the same sizes, colours and fonts as on Base UI, or the difference is one the stock shadcn part of that style brings and is named.
- The owner's picker rules of report section 3 hold in both versions.
- Each version installs by GitHub address: `anindosarker/shadcn-date-picker/date-picker-radix`, `anindosarker/shadcn-date-picker/date-picker-aria` (D163).
- Acceptance: the Base UI version of spec 78 as the reference, in the same repository. Programmatic: `pnpm test --base radix` and `pnpm test --base aria` exit 0 with `git diff --stat origin/main -- stories .storybook` printing nothing; `diff -rq registry/base/components/date-picker registry/<base>/components/date-picker` lists exactly the files the plan marks as differing; the part geometry comparison of 1.6.4 has no unnamed difference; the install proof of 1.6.5 passes for each base.

### 1.3 Current structure

```
shadcn-date-picker/ (after spec 78)
├── registry/base/components/date-picker/**     ← the approved code, 22 files, exact copy; the reference
├── registry/radix/, registry/aria/             ← components.json (radix-nova, aria-nova), the nine parts and use-mobile of the style, index.css, registry.ts with no item
├── stories/**, .storybook/**                   ← one set of stories and plays, run per base through DP_BASE
└── tools/bases.mjs                             ← readyBases(): a base is ready when its tree holds components/date-picker/date-picker.tsx

Base UI only sites in the approved code, found by a first grep (the plan finds the rest):
  registry/base/components/date-picker/types.ts:2,154                 ← type PopoverPrimitive from "@base-ui/react/popover", PopupActions = PopoverPrimitive.Root.Actions
  registry/base/components/date-picker/components/picker-popup.tsx:66,97,119,130   ← render= on DialogTrigger, DialogClose, PopoverTrigger and one more element
  the nine parts differ per style in props and state attributes (popover, dialog, button, button-group, input-group, native-select, field, badge, calendar)

Read on 2026-11-24 from ui.shadcn.com/r/styles/<style>/calendar.json:
  base-nova, radix-nova: calendar depends on react-day-picker and date-fns
  aria-nova: calendar has neither dependency; it is not a react-day-picker calendar
  the approved code imports react-day-picker in six places and `@/components/ui/calendar` in components/day-calendar.tsx

Per base, the same parts in the table repository, already adapted once: shadcn-react-table/packages/shadcn-table/registry/{base,radix,aria}/components/ui/{popover,dialog,button,badge,field,input-group,native-select}.tsx
History and reasons of the approved code: reference/q88-date-filter-demo/review-notes.md, date-picker-9-design-notes.md, date-picker-9-cases.md
```

### 1.4 Target structure

```
shadcn-react-table/.ai/plans/v0.9.x/anindosarker/reference/q149-calendar-library/
└── design-radix-aria.md                        ← the reviewed design plan (milestone 1)

shadcn-date-picker/registry/
├── radix/
│   ├── components/date-picker/**               ← 22 files, the names and folders of the Base UI tree
│   ├── registry.ts                             ← item date-picker-radix
│   └── registry.json                           ← generated
└── aria/
    ├── components/date-picker/**               ← 22 files, the same
    ├── registry.ts                             ← item date-picker-aria
    └── registry.json                           ← generated
```

### 1.5 Flow

```
approved Base UI code + parts of the three styles ──> design plan ── review (fable, no history) ──> plan merged
plan + stories of spec 78 ──> Radix version ──> plays, geometry, install proof ──> merge into main
                          └─> React Aria version ──> the same ──> merge into main        (side by side, each in its own tree)
```

### 1.6 Components

#### 1.6.1 The design plan (D162, epic note)

One file, `reference/q149-calendar-library/design-radix-aria.md`, written by reading sources, never from memory: the 22 approved files in full, the nine parts and the hook of each style as they sit in `shadcn-date-picker/registry/<base>/` (before spec 78's first milestone has merged: the same files from `ui.shadcn.com/r/styles/<style>/<part>.json`), the Base UI, Radix and React Aria documentation of every primitive the picker touches, and the review notes for why a line is as it is.

Sections, in this order:

1. Inventory: one table row per file, with a column for Radix and one for React Aria: `identical` or `differs`. A file is `identical` only when it imports nothing whose API differs on that base.
2. Parts: for each of the nine parts and `use-mobile`, the props, slots and state attributes the picker uses, and what the same part offers in `radix-nova` and `aria-nova`, with file and line.
3. Per differing file and base: each Base UI API used (the `render` prop, `Popover.Root` actions, positioner props, focus props, state attributes in class names, and whatever else the read finds), its replacement on that base, and the source line that shows the replacement does the same thing.
4. The day calendar on React Aria: the facts of 1.3, then the one way that keeps report section 3 and the same look and behaviour, with its proof. Only if no way keeps both: the options, as a queue card (see below), never a pick in the plan.
5. Behaviour at risk: focus return after close, closing from inside the popup, the phone dialog, portals and scroll lock, keyboard order, disabled and required pass-through, each with the case ids of `date-picker-9-cases.md` and the story that shows it.
6. What is not in the versions: no new prop, state, helper, effect or workaround that the Base UI code does not have. For each place where a base seems to need one, the plan names the platform or library feature that does the job instead; where none exists, that is a queue card.

- A point where the same look and behaviour cannot be kept on a base, or where a rule of report section 3 would bend, is a queue card for the owner (`queue/item.py`) with the facts; the plan marks the file as waiting on that card and the version milestone builds everything else.
- The plan holds decisions and interfaces, not code bodies (planning rule 9). No em dashes. It is a file under `reference/`: written once, not reformatted.
- Review: one `fable` reviewer with no history of the picker reads the plan against the 22 files and the part sources, and checks every `identical` claim (the file imports nothing base specific) and every replacement claim (the cited line says what the plan says). Two rounds at most.
- Does NOT write or change any file of the new repository; does NOT change the Base UI code or propose a change to it.

#### 1.6.2 The two versions (D162, report 2.2, 3 and 5)

Each version is built by one `fable` builder (epic note: a library-bound new component), from the plan, in its own tree.

- Files the plan marks `identical`: copied from `registry/base/components/date-picker/` byte for byte.
- Files the plan marks `differs`: the Base UI file with exactly the replacements the plan names for that base, nothing else. Formatting, names, order, the three JSDoc comments and the absence of other comments stay as in the Base UI file.
- A step the plan did not foresee (a compile error, a failing play) goes back to the plan first: the plan gets the missing line (a commit in the table repository), then the code follows. The version never carries a change the plan does not name.
- After each task a reader with no history reads that task's diff against the plan's section for it and reports a deviation or none; the line goes into the tracker before the next task starts.
- `registry/<base>/registry.ts` gets the item `date-picker-<base>` with the title `Date Picker (Radix UI)` or `Date Picker (React Aria)`, built as the Base UI item is (spec 78, 1.6.4); `pnpm registry:build` writes `registry.json`. The dependencies are derived from the imports: `radix-ui` or `react-aria-components` in place of `@base-ui/react`.
- The parts under `registry/<base>/components/ui/` stay as the shadcn CLI wrote them. A part the plan needs that spec 78 did not install, or a new npm package, is a fix milestone of spec 78 (`plan/new_fix.py`), which owns `package.json`, the lockfile and the part folders; it is not added here.
- Does NOT edit `registry/base/**`, `stories/**`, `.storybook/**`, `tools/**`, `package.json`, the lockfile, `vercel.json` or the workflow; does NOT restyle a stock part to make it look like the Base UI one.

#### 1.6.3 Tests against the reference (D162, report 5)

- `pnpm test --base <base>` runs the plays of spec 78 on the new tree. Every play passes with the stories unchanged.
- A play that fails because it reads something only Base UI renders (found despite spec 78's rule) is a fix milestone of spec 78 on the stories (`plan/new_fix.py`), not an edit here and not a change to the version to satisfy the play.
- A play that fails because the base behaves differently for a user is a defect of the version: fixed through the plan (1.6.2), or, when the stock primitive cannot do it, a queue card with the case id.

#### 1.6.4 The same look

- For each of the twelve type stories, closed and open, at 1280 and 390 wide, in the Storybook of the milestone branch (`DP_BASE=<base>` on an agent port, P6) beside the Base UI Storybook: the bounding box of each part of the picker (the box or trigger, each button and icon in it, the popup, the calendar or grid, each cell row, the navigation, the presets, the time columns, the footer) and its computed colour, background, border, radius, font size and weight.
- Equal means the same box within 1 px and the same computed values. Each difference is fixed through the plan, or named in the tracker with the stock part that brings it; a named difference a user would notice is also a queue card with two screenshots under `reference/q149-calendar-library/look/` (P10).
- The comparison is one script run in the agent's scratch folder; it is not added to the repository (D162: no visual capture suite).

#### 1.6.5 Install proof (D162, D163)

As spec 78, 1.6.4, once per base in the agent's scratch folder: a fresh Next.js app on the style `radix-nova` or `aria-nova`, `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-<base>#<sha of the pushed milestone branch>`, 22 files in `components/date-picker/` equal to the tree by `diff -r`, `tsc --noEmit` and `next build` green with one page that renders a date and a date range picker. The scratch app is deleted after the tracker has the lines.

**Stays unchanged:** `shadcn-date-picker/registry/base/**` (the approved code and its parts), `stories/**`, `.storybook/**`, `tools/**`, `package.json`, `pnpm-lock.yaml`, `vercel.json`, `.github/workflows/ci.yml`; `test-projects/next-app/**`; every file of the table repository outside `.ai/plans/v0.9.x/`.

### 1.7 Dependencies and env

- No new package: `radix-ui` and `react-aria-components` are installed by spec 78.
- `DP_BASE=radix` or `DP_BASE=aria` for the type check, the tests and the Storybook of a version; `tools/bases.mjs` picks the tree up as ready once its `date-picker.tsx` exists, so `pnpm test`, `pnpm typecheck` and `pnpm storybook:build` include it without a script change.
- Branches, worktrees, merges, tracker commits and the process rules that bind: spec 78, 1.6.1. The design plan milestone has no branch in the new repository; its file is committed in the table repository on `claude/review`, by path.
- Network access to `ui.shadcn.com`, `base-ui.com`, `radix-ui.com` and `react-spectrum.adobe.com` for the sources the plan cites.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date picker Radix and React Aria design plan

- Files owned: `.ai/plans/v0.9.x/anindosarker/reference/q149-calendar-library/design-radix-aria.md`
- Depends on: none
- Review: fable
- Local CI: none (a document; its checks are the task checks and the review)
- Task 1: The read and the inventory, the parts table, the per-file replacements for both bases, the behaviour at risk and the not-in-the-versions list (1.6.1, sections 1 to 3, 5 and 6). Checks: the inventory has 22 rows and both base columns filled; the `identical` and `differs` cells of the inventory add up to 44; every `differs` cell has a section with at least one cited source line per replacement; the file holds no em dash (`grep -c $'\u2014' design-radix-aria.md` prints `0`); no code body longer than a signature in the file
- Task 2: The day calendar on React Aria (1.6.1, section 4). Checks: the section cites the `aria-nova` calendar part's source and its dependencies as read on the day; it names one way with its proof, or the tracker holds the id of the queue card that carries the options
- Task 3: Self-check of every `identical` claim. Checks: for each file marked `identical` on a base, `grep -n -E "@base-ui|render=|@/components/ui/" <file>` is listed in the tracker with one line per hit saying why the hit is the same on that base (the part's props used there exist with the same names in that style, with file and line)

### Milestone: Date picker Radix version

- Files owned: `shadcn-date-picker/registry/radix/components/date-picker/**`, `shadcn-date-picker/registry/radix/registry.ts`, `shadcn-date-picker/registry/radix/registry.json`
- Depends on: Date picker Radix and React Aria design plan, Date picker stories and tests
- Review: fable
- Local CI: `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, `pnpm test --base radix`, `pnpm test --base base`, in the milestone's worktree of the new repository, one at a time (P5)
- Task 1: The files the plan marks identical, copied from the Base UI tree (1.6.2). Checks: for each such file `cmp registry/base/components/date-picker/<file> registry/radix/components/date-picker/<file>` exits 0; the reader's line in the tracker
- Task 2: The files the plan marks as differing, with the plan's replacements only (1.6.2). Checks: `find registry/radix/components/date-picker -type f | wc -l` prints `22`; `diff -rq registry/base/components/date-picker registry/radix/components/date-picker` lists exactly the plan's differing files for Radix; `grep -rn '@base-ui' registry/radix/components/date-picker` prints nothing; `pnpm typecheck` and `pnpm lint` exit 0; `grep -rc '/\*\*' registry/radix/components/date-picker | awk -F: '{s+=$2} END {print s}'` prints `3`; the reader's line in the tracker
- Task 3: The item definition and the plays on Radix (1.6.2, 1.6.3). Checks: `pnpm registry:check` exits 0 and `registry/radix/registry.json` holds one item `date-picker-radix` with 22 files; `pnpm test --base radix` exits 0, every play passed; `git diff --stat origin/main -- stories .storybook tools package.json pnpm-lock.yaml registry/base registry/radix/components/ui` prints nothing; `pnpm test --base base` still exits 0
- Task 4: The same look (1.6.4). Checks: one tracker line per story, state and width (48 lines): `equal`, or the named difference with the stock part that brings it and the card id when a user would notice; the two Storybook servers stopped; the comparison script not in the repository
- Task 5: The install proof at the pushed commit (1.6.5). Checks: in the scratch app on `radix-nova`, `find components/date-picker -type f | wc -l` prints `22`; `diff -r components/date-picker <clone>/registry/radix/components/date-picker` prints nothing; `pnpm exec tsc --noEmit` and `pnpm exec next build` exit 0; the lines with the sha in the tracker; the scratch app deleted

### Milestone: Date picker React Aria version

- Files owned: `shadcn-date-picker/registry/aria/components/date-picker/**`, `shadcn-date-picker/registry/aria/registry.ts`, `shadcn-date-picker/registry/aria/registry.json`
- Depends on: Date picker Radix and React Aria design plan, Date picker stories and tests
- Review: fable
- Local CI: `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, `pnpm test --base aria`, `pnpm test --base base`, in the milestone's worktree of the new repository, one at a time (P5)
- Task 1: The files the plan marks identical, copied from the Base UI tree (1.6.2). Checks: for each such file `cmp registry/base/components/date-picker/<file> registry/aria/components/date-picker/<file>` exits 0; the reader's line in the tracker
- Task 2: The files the plan marks as differing, with the plan's replacements only, the day calendar as the plan's section 4 says (1.6.2). Checks: `find registry/aria/components/date-picker -type f | wc -l` prints `22`; `diff -rq registry/base/components/date-picker registry/aria/components/date-picker` lists exactly the plan's differing files for React Aria; `grep -rn '@base-ui' registry/aria/components/date-picker` prints nothing; `pnpm typecheck` and `pnpm lint` exit 0; `grep -rc '/\*\*' registry/aria/components/date-picker | awk -F: '{s+=$2} END {print s}'` prints `3`; the reader's line in the tracker
- Task 3: The item definition and the plays on React Aria (1.6.2, 1.6.3). Checks: `pnpm registry:check` exits 0 and `registry/aria/registry.json` holds one item `date-picker-aria` with 22 files; `pnpm test --base aria` exits 0, every play passed; `git diff --stat origin/main -- stories .storybook tools package.json pnpm-lock.yaml registry/base registry/aria/components/ui` prints nothing; `pnpm test --base base` still exits 0
- Task 4: The same look (1.6.4). Checks: one tracker line per story, state and width (48 lines): `equal`, or the named difference with the stock part that brings it and the card id when a user would notice; the two Storybook servers stopped; the comparison script not in the repository
- Task 5: The install proof at the pushed commit (1.6.5). Checks: in the scratch app on `aria-nova`, `find components/date-picker -type f | wc -l` prints `22`; `diff -r components/date-picker <clone>/registry/aria/components/date-picker` prints nothing; `pnpm exec tsc --noEmit` and `pnpm exec next build` exit 0; the lines with the sha in the tracker; the scratch app deleted

### 2.2 Checks

- Design plan: 44 inventory cells, a cited source line for every replacement, the self-check of every `identical` claim, the review by a reader with no history
- Each version: 22 files, the `diff -rq` list equal to the plan's, no `@base-ui` import, three JSDoc comments, every play of spec 78 green with the stories untouched, the 48 look lines, the install proof
- Review: `fable` on each of the three milestones (the plan is the design of two library components; each version is new library code with a public surface that must equal the Base UI one)
- Both versions merge into `main` of the new repository; the second to merge takes `main` into its branch first and runs its Local CI again on the merged tree (the two share no file)
- The approved folder in `test-projects/next-app` and `registry/base/components/date-picker` are never written to
