# 89: Date picker repository layout
- Epic: E30

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`anindosarker/shadcn-date-picker` was created by spec 78 as "one private package at the repository root; no workspace, no turbo" (spec 78 line 103); spec 85 then added the docs app as the folder `docs/`, the one workspace package. The owner: "Why is it not a monorepo with properly handled folders like apps and packages?" D185 gives the repository the layout of `shadcn-react-table`: the library under `packages/`, the docs app under `apps/`, `tools/` at the root, turbo for the tasks, `registry.json` at the root.

This spec moves files and updates the paths that read them. No file of the picker, of the stories or of the docs pages changes its content. No tag, no version change.

Paths without a prefix are in the date picker repository (clone `shadcn-date-picker/` beside the table repository), as they are on `main` after spec 86 has merged. `table:` paths are in `shadcn-react-table` at `v0.9.8` (`a594a8a4`), read-only here.

### 1.2 Goals

- The library lives in `packages/shadcn-date-picker`: the three registry trees, the stock style sheet, the stories, the Storybook config, the Vite and Vitest config, the tsconfig files, its lint config and its own `package.json` with the version (D185).
- The docs app lives in `apps/shadcn-date-picker-docs`, package name `shadcn-date-picker-docs`, as the table's is `apps/shadcn-table-docs` (D185).
- The repository root holds the workspace only: `package.json` (private, scripts that call turbo or a filter), `pnpm-workspace.yaml` with `apps/*` and `packages/*`, `turbo.json`, `pnpm-lock.yaml`, `registry.json`, `vercel.json`, `tools/`, `.github/`, `README.md`, `LICENSE`, the prettier files (D185).
- `registry.json` stays at the root and lists the three per-base files at their new place, so `anindosarker/shadcn-date-picker/date-picker-<base>#<ref>` keeps resolving; an install from the moved branch writes the same files as an install from `main` (D185).
- The approved picker code and every other moved file are byte for byte what they were: a move, not an edit (D185).
- The site keeps its addresses: the docs at `/`, the Storybooks under `/storybook/<base>/`, `version.txt`; CI runs the same checks as today (D185).
- The tags `v0.1.0` and `v0.1.1` are untouched; the table's `DATE_PICKER_TAG` stays `v0.1.1` (D185).
- Acceptance: programmatic, against `origin/main` at the commit the branch starts from (the previous state). `git diff -M100% --diff-filter=R --stat` covers every moved file with no content change; the per-base `registry.json` and `generated/` folders are equal to that commit's; a fresh app's install from the branch equals its install from that commit; the local production build serves the same addresses; then the live reads of 1.6.6.

### 1.3 Current structure

```
shadcn-date-picker/ (main, after spec 86)
├── package.json              ← the library and the workspace root in one: version 0.1.1, every dependency, scripts lint, typecheck, registry:build, registry:check, test, storybook, storybook:build; pnpm.overrides (vite)
├── pnpm-workspace.yaml       ← packages: docs
├── registry.json             ← include: registry/{base,radix,aria}/registry.json
├── registry/{base,radix,aria}/ ← trees: components, hooks, generated, registry.ts, registry.json, components.json, index.css
├── registry/styles/style-nova.css, registry/README.md
├── stories/, .storybook/     ← .storybook/main.ts:2 imports ../tools/bases.mjs
├── vite.config.ts:5, vitest.config.ts:7 ← import ./tools/bases.mjs; alias @ = ROOT/registry/<base>
├── tsconfig.json, tsconfig.{baseui,radix,aria,stories}.json ← paths ./registry/<base>/*
├── eslint.config.mjs, .prettierrc, .prettierignore, .gitignore
├── tools/bases.mjs           ← ROOT = the repository; readyBases reads ROOT/registry/<base>
├── tools/registry-build.mjs  ← :19 ROOT/registry/styles, :72 ROOT/registry/<base>
├── tools/site-build.mjs      ← storybook build with cwd ROOT, output ROOT/storybook-static, version from ROOT/package.json
├── vercel.json               ← services docs (root docs) and storybook (root ., pnpm storybook:build, storybook-static)
├── .github/workflows/ci.yml  ← root scripts, then pnpm --filter docs lint, types:check, build
└── docs/                     ← the Next.js app, package name docs
    ├── lib/registry-trees.mjs:15,19,59 ← ../../tools/bases.mjs; REPO = one level up; REPO/registry/<base>
    ├── lib/install.ts:5, lib/layout.shared.tsx:4 ← ../../package.json (the version)
    └── app/version.txt/route.ts:1 ← ../../../package.json
```

### 1.4 Target structure

```
shadcn-date-picker/
├── package.json              ← name shadcn-date-picker-monorepo, private; scripts over turbo and filters; devDependencies turbo, prettier and its plugin; pnpm.overrides stays here
├── pnpm-workspace.yaml       ← apps/*, packages/*
├── turbo.json                ← new: build, dev, lint, typecheck, test, storybook:build
├── registry.json             ← include: packages/shadcn-date-picker/registry/{base,radix,aria}/registry.json
├── vercel.json               ← docs root apps/shadcn-date-picker-docs; storybook root packages/shadcn-date-picker
├── tools/{bases,registry-build,site-build}.mjs ← same files; they read the package folder
├── .github/workflows/ci.yml, README.md, LICENSE, .prettierrc, .prettierignore, .gitignore, pnpm-lock.yaml
├── packages/shadcn-date-picker/
│   ├── package.json          ← name shadcn-date-picker, version 0.1.1, the library's dependencies and scripts
│   ├── registry/, stories/, .storybook/
│   ├── vite.config.ts, vitest.config.ts, eslint.config.mjs
│   └── tsconfig.json, tsconfig.{baseui,radix,aria,stories}.json
└── apps/shadcn-date-picker-docs/ ← docs/ as it is, name shadcn-date-picker-docs
```

### 1.5 Flow

```
spec 86 merged on main ──> branch date-picker-repository-layout from origin/main ──> git mv, then the path readers ──> one pnpm install
     ──> equality proofs (moves, registry, install) ──> checks ──> local production read ──> merge into main ──> Vercel production ──> live reads
```

### 1.6 Components

#### 1.6.1 The moves (D185)

- Every move is `git mv`, in commits that hold moves only, so `git log --follow` and the rename detection keep each file's history:
  - `registry/`, `stories/`, `.storybook/`, `vite.config.ts`, `vitest.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `tsconfig.baseui.json`, `tsconfig.radix.json`, `tsconfig.aria.json`, `tsconfig.stories.json` to `packages/shadcn-date-picker/`;
  - `docs/` to `apps/shadcn-date-picker-docs/`.
- Stay at the root: `tools/`, `registry.json`, `vercel.json`, `.github/`, `README.md`, `LICENSE`, `.prettierrc`, `.prettierignore`, `.gitignore`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package.json`.
- Inside `packages/shadcn-date-picker` every relative path between the moved files is unchanged (`./registry/<base>/*` in the tsconfig files, `../stories` in `.storybook/main.ts`, `./.storybook/vitest.setup.ts`), so these files need no edit for it.
- No file under `registry/*/components`, `registry/*/hooks`, `registry/*/generated`, `registry/styles`, `stories/`, `apps/shadcn-date-picker-docs/{app,components,content,demos,styles}` is edited, except the three import lines of 1.6.3.

#### 1.6.2 Packages, workspace and turbo (D185)

- `packages/shadcn-date-picker/package.json`: new, with `name` `shadcn-date-picker`, `private`, `version` `0.1.1`, `license`, `author`, `repository`, `type`, the `dependencies` of today's root file, the `devDependencies` the library's own scripts need (Storybook, Vite, Vitest, Playwright, TypeScript, ESLint and its plugins, Tailwind, `shadcn`, the type packages), and the scripts `lint` (`eslint .`), `typecheck`, `registry:build`, `registry:check`, `test`, `storybook`, `storybook:build`, each as today with the tool path `../../tools/<file>`. The `test` script keeps its per-base loop and reads `../../tools/bases.mjs`.
- Root `package.json`: `name` `shadcn-date-picker-monorepo`, `private`, `license`, `engines`, `packageManager`, `pnpm.overrides` as today (pnpm reads overrides at the workspace root only); `devDependencies` `turbo` at the table's version (`table:package.json`), `prettier` and `prettier-plugin-tailwindcss`; scripts with today's names so CI and habits hold: `lint` (turbo `lint`, then the root `prettier --check` with today's globs under their new paths), `typecheck`, `test`, `registry:build`, `registry:check`, `storybook`, `storybook:build`, `build`, `dev`, each a turbo run or a `pnpm --filter`. No `version` at the root.
- `apps/shadcn-date-picker-docs/package.json`: `name` becomes `shadcn-date-picker-docs`; nothing else.
- `pnpm-workspace.yaml`: `apps/*` and `packages/*`.
- `turbo.json`: the tasks the root scripts call, modelled on `table:turbo.json`: `build` with `outputs` `.next/**`, `dev` uncached and persistent, `lint`, `typecheck`, `test` uncached, `storybook:build` with `outputs` `storybook-static/**`. The docs `build` does not depend on a library build: the docs app copies the trees itself (`lib/registry-trees.mjs`).
- One `pnpm install` rewrites `pnpm-lock.yaml`; resolved versions do not change: `git diff` of the lockfile shows the importer keys and the added `turbo` entries only. A version that moves is pinned back, not accepted.
- `.gitignore` gains `.turbo`. `.prettierignore` and the root lint globs name the new paths (`packages/shadcn-date-picker/registry/*/generated`, `packages/shadcn-date-picker/registry/styles`, `apps/shadcn-date-picker-docs`), same meaning.
- `packages/shadcn-date-picker/eslint.config.mjs` drops the `docs` line of `globalIgnores` (the app is no longer below it); the rest is as moved.

#### 1.6.3 The path readers (D185)

Every place that reads a moved path, found by `git grep` on `main` (the map; the builder repeats the grep on the branch and adds any line spec 86 brought):

| Reader | Reads today | Change |
|---|---|---|
| `tools/bases.mjs:7-10` | `ROOT` = the repository | `ROOT` stays; new export `PACKAGE` = `ROOT/packages/shadcn-date-picker`; `readyBases` reads `PACKAGE/registry/<base>` |
| `tools/registry-build.mjs:19,72` | `ROOT/registry/styles`, `ROOT/registry/<base>` | `PACKAGE` in both; the printed relative paths stay relative to `ROOT` |
| `tools/site-build.mjs` | `cwd: ROOT`, `ROOT/storybook-static`, `ROOT/package.json` | `PACKAGE` in the three: Storybook builds in the package, the output is `packages/shadcn-date-picker/storybook-static`, the version is the package's |
| `packages/shadcn-date-picker/vite.config.ts:5,13` | `./tools/bases.mjs`, `ROOT/registry/<base>` | `../../tools/bases.mjs`, `PACKAGE/registry/<base>` |
| `packages/shadcn-date-picker/vitest.config.ts:7,23` | `./tools/bases.mjs`, `ROOT/.storybook` | `../../tools/bases.mjs`, `PACKAGE/.storybook` |
| `packages/shadcn-date-picker/.storybook/main.ts:2` | `../tools/bases.mjs` | `../../../tools/bases.mjs` |
| `apps/shadcn-date-picker-docs/lib/registry-trees.mjs:15,19,59` | `../../tools/bases.mjs`, `REPO` one level up, `REPO/registry/<base>` | `../../../tools/bases.mjs`; the trees are read from `PACKAGE` of that import; the header comment's paths follow |
| `apps/shadcn-date-picker-docs/lib/install.ts:5`, `lib/layout.shared.tsx:4` | `../../package.json` | `../../../packages/shadcn-date-picker/package.json` |
| `apps/shadcn-date-picker-docs/app/version.txt/route.ts:1` | `../../../package.json` | `../../../../packages/shadcn-date-picker/package.json` (as `table:apps/shadcn-table-docs/app/version.txt/route.ts:1`) |
| `registry.json` | `registry/<base>/registry.json` | `packages/shadcn-date-picker/registry/<base>/registry.json`, three lines |
| `vercel.json` | docs `root` `docs`; storybook `root` `.` | `apps/shadcn-date-picker-docs`; `packages/shadcn-date-picker`. `buildCommand`, `outputDirectory`, `trailingSlash`, redirects and rewrites unchanged (as `table:vercel.json`, whose storybook root is `packages/shadcn-table`) |
| `.github/workflows/ci.yml` | root scripts, `--filter docs` | the same steps in the same order; `--filter shadcn-date-picker-docs` |
| `packages/shadcn-date-picker/registry/README.md` | `tools/bases.mjs`, `registry/...` paths from the repository root | the tool path as `../../tools/bases.mjs` where it names a root file; the `registry/...` lines stay true read from the package folder and say so in one line |
| `README.md` | the install lines; any development line | the install lines do not change; a development line names the new folders |

- The root `registry.json` lists the three per-base files directly, not one package-level file that includes them: the per-base files then stay byte for byte, and a second level of `include` is not something the install address is known to follow.
- `apps/shadcn-date-picker-docs/app/global.css:17` (`@source '../registry'`) reads the app's own git-ignored copy and does not change.
- The docs app's `lib/bases.mjs` check against `tools/bases.mjs` (`registry-trees.mjs:24-30`) stays.
- Few code comments: a comment changes only where it names a moved path.

#### 1.6.4 Equality proofs before the merge (D185)

`<start>` is the `origin/main` commit the branch was created from.

- Moves: `git diff -M100% --name-status <start> HEAD` lists every file of `registry/`, `stories/` and `docs/` as `R100`, except the files 1.6.2 and 1.6.3 name; `git diff -M --stat <start> HEAD -- 'packages/shadcn-date-picker/registry/*/components' 'packages/shadcn-date-picker/registry/*/hooks' 'packages/shadcn-date-picker/registry/*/generated' packages/shadcn-date-picker/stories` shows renames with 0 changed lines.
- Registry: `pnpm registry:check` exits 0; for each base `git diff <start>:registry/<base>/registry.json HEAD:packages/shadcn-date-picker/registry/<base>/registry.json` prints nothing; `pnpm registry:build` leaves `git status --short` empty.
- Install: in two fresh scratch apps under the scratchpad (stock `shadcn init`, as spec 78 Task 5), per base: `shadcn add anindosarker/shadcn-date-picker/date-picker-<base>#<start sha>` in one and `...#date-picker-repository-layout` (the pushed branch) in the other; `diff -r` of the two apps' `components/` and `hooks/` prints nothing; `tsc --noEmit` exits 0 in the second. If the address does not accept a branch name, the pushed branch head's sha is used. A difference stops the milestone: the install address is the public surface.
- The tags: `git ls-remote --tags origin` prints the same lines before and after.

#### 1.6.5 Checks and the local production read (D185)

- From the root: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, `pnpm test` (the three bases, one after the other, P5), `pnpm --filter shadcn-date-picker-docs lint`, `types:check`, `build`: the list of `ci.yml`.
- `pnpm storybook:build` writes `packages/shadcn-date-picker/storybook-static/storybook/{base,radix,aria}/index.html` and `storybook/index.html`.
- The site as Vercel will build it: `vercel build` is tried in the worktree with the project linked read-only (`vercel pull` of the existing project; no setting written); if it runs, its output is the proof that the two services resolve under the new roots. If it cannot run locally, that is one tracker line and the next two reads stand in.
- The docs app's production build served on a port from 5340 to 5360 (P6), stopped after: `/`, `/docs/install`, `/docs/date`, `/docs/props`, a 404 address and `/version.txt` (prints `0.1.1`) answer as on the live site; the theme changer of spec 86 opens; the three Storybooks open from the static folder served the same way.

#### 1.6.6 After the merge: live reads (D185)

- No preview read by the owner and no wait on the branch preview (E27 and E30 Notes). After the merge and the production deploy, on `https://date-picker.shadcn-table.com`: `/`, `/docs/install`, `/docs/date`, `/docs/props` answer 200 with their titles; `/version.txt` prints `0.1.1`; `/storybook/`, `/storybook/base/`, `/storybook/radix/`, `/storybook/aria/` answer 200; `/base/` redirects to `/storybook/base/`; a missing address answers 404 with the site's page.
- The Vercel project keeps its settings. If the deploy fails because a project setting names an old folder (a Root Directory, a build command set in the dashboard), the milestone does not change the setting: it records the failing line in the tracker, files a queue card, and reverts the merge commit on `main` with a new commit so the live site returns; a red in the repository's own files is fixed forward.
- The CI run of the merged commit is `success`.

**Stays unchanged:** the content of every file under `registry/`, `stories/` and the docs app's `app`, `components`, `content`, `demos`, `styles` (but the three import lines of 1.6.3); the item names and the install address; the tags and the version; the site's addresses; the Vercel project's settings and the GitHub repository's settings; the table repository outside `.ai/plans/v0.9.x/`; `DATE_PICKER_TAG`.

### 1.7 Dependencies and env

- New: `turbo` at the root, the table's version. No other new package; one `pnpm install`. The milestone owns every `package.json` and `pnpm-lock.yaml` of the date picker repository.
- Clone, branch, worktree, merge and tracker rules: spec 78, 1.6.1. Branch `date-picker-repository-layout`, created from `origin/main` only after spec 86's merge commit is on it.
- The table's `tools/registry/add-date-picker.mjs` and its registry dependency read the picker by address at `v0.1.1`: nothing in the table follows the picker's folders.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date picker repository layout

- Files owned: `shadcn-date-picker/package.json`, `shadcn-date-picker/pnpm-workspace.yaml`, `shadcn-date-picker/pnpm-lock.yaml`, `shadcn-date-picker/turbo.json`, `shadcn-date-picker/registry.json`, `shadcn-date-picker/vercel.json`, `shadcn-date-picker/.gitignore`, `shadcn-date-picker/.prettierignore`, `shadcn-date-picker/README.md`, `shadcn-date-picker/.github/workflows/ci.yml`, `shadcn-date-picker/tools/**`, `shadcn-date-picker/registry/**`, `shadcn-date-picker/stories/**`, `shadcn-date-picker/.storybook/**`, `shadcn-date-picker/vite.config.ts`, `shadcn-date-picker/vitest.config.ts`, `shadcn-date-picker/eslint.config.mjs`, `shadcn-date-picker/tsconfig.json`, `shadcn-date-picker/tsconfig.baseui.json`, `shadcn-date-picker/tsconfig.radix.json`, `shadcn-date-picker/tsconfig.aria.json`, `shadcn-date-picker/tsconfig.stories.json`, `shadcn-date-picker/docs/**`, `shadcn-date-picker/packages/**`, `shadcn-date-picker/apps/**`
- Depends on: 86
- Review: fable
- Local CI: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, `pnpm test`, `pnpm --filter shadcn-date-picker-docs lint`, `pnpm --filter shadcn-date-picker-docs types:check`, `pnpm --filter shadcn-date-picker-docs build`, in the milestone's worktree of the date picker repository, one at a time (P5)
- Task 1: The map and the moves (1.6.1, 1.6.3). Checks: the branch starts from an `origin/main` that holds spec 86's merge commit, the sha `<start>` in the tracker; the reader grep of 1.6.3 repeated on the branch, each extra line one tracker line or the line `none`; the move commits hold renames only (`git show --stat -M100% <commit>` lists `R100` lines and nothing else); `test ! -e registry && test ! -e stories && test ! -e docs && test ! -e .storybook` exits 0
- Task 2: Packages, workspace, turbo and the path readers (1.6.2, 1.6.3). Checks: `pnpm install --frozen-lockfile` exits 0 after the one install; the lockfile diff holds importer keys and `turbo` only, one tracker line; `pnpm lint`, `pnpm typecheck`, `pnpm registry:check` exit 0; `node -e` prints `0.1.1` from `packages/shadcn-date-picker/package.json` and no `version` from the root file; `grep -c 'packages/shadcn-date-picker/registry/' registry.json` prints `3`
- Task 3: The equality proofs (1.6.4). Checks: the `R100` list and the 0-line rename stat in the tracker; the three per-base `registry.json` diffs print nothing; `pnpm registry:build` leaves `git status --short` empty; the install proof per base, three tracker lines with the two refs and `diff -r` empty, `tsc --noEmit` exit 0; the scratch apps deleted; `git ls-remote --tags origin` equal before and after
- Task 4: The full checks and the local production read (1.6.5). Checks: `pnpm test` green on the three bases; the three docs checks exit 0; the four Storybook `index.html` files exist under `packages/shadcn-date-picker/storybook-static/storybook/`; the `vercel build` line (ran with its result, or why not) in the tracker; one tracker line per local read; the servers stopped (`lsof -nP -iTCP:<port> -sTCP:LISTEN` prints nothing)
- Task 5: After the merge: the live reads (1.6.6). Checks: one tracker line per live read with the address and the status; the CI run of the merged commit is `success`; on a failed deploy the revert commit and the queue card instead, both named in the tracker; the milestone worktree removed and `git -C <clone> status --short` prints nothing

### 2.2 Checks

- Date picker repository layout: every moved file a rename with no content change, the per-base registry files and generated folders equal, a fresh install from the branch equal to one from the start commit on the three bases, the lockfile without a version change, the CI list green from the root, the local production read, the live reads
- Review: one `fable` reviewer on the whole diff with rename detection on: no edit hides in a move; every reader of a moved path is updated (it repeats the grep); the root `registry.json`, `vercel.json` and `ci.yml` say what 1.6.3 says; nothing of the stays-unchanged list is touched. Two rounds at most.
