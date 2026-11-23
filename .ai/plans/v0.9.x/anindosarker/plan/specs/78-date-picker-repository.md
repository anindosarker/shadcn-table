# 78: Date picker repository
- Epic: E25

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The date picker the owner approved lives in the test application and nowhere a user can install it from (Q149). It becomes its own small library in its own repository, `anindosarker/shadcn-date-picker` (D162, D163): this spec sets the repository up with thin tooling, puts the approved Base UI code in as an exact copy, makes it installable with the shadcn CLI by GitHub address, and gives it Storybook stories with tests that the Radix and React Aria versions of spec 79 are measured against. Two milestones, because the second only adds stories, tests and the site on top of what the first merged. The one right-to-left look the owner asked for (D167) rides in the second, where the stories exist.

This spec builds in a second repository. The plan folder, this spec and the trackers stay in the table repository; nothing else in the table repository changes.

### 1.2 Goals

- `registry/base/components/date-picker/` in the new repository is the approved code, byte for byte: `diff -r` against `test-projects/next-app/components/date-picker/` at commit `53f4b4f` prints nothing (D162, report 2.1).
- A user installs it with `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-base` (D162, D163); the 22 files land in the user's `components/date-picker/` and the shadcn parts it needs come from the user's own style.
- The repository holds the shadcn parts of the three styles and one `tsconfig` per base from the start, so the Radix and React Aria milestones of spec 79 add only their own picker folder and item definition.
- Thin tooling only (D162): a small registry build, types, lint, Storybook stories with tests. No installation test suite, no perf checks, no visual capture suite, no release tooling.
- Every case of the behaviour contract (`reference/q88-date-filter-demo/date-picker-9-cases.md`) is covered by a play or named in the tracker with the reason it is not.
- The site builds from the repository: one static Storybook per base that has a picker, a small landing page, `version.txt` (D162, D163).
- Right-to-left is looked at once on the Base UI picker; no test, story or CI job is added for it (D167).
- Acceptance: programmatic. The `diff -r` above prints nothing; `pnpm lint`, `pnpm typecheck`, `pnpm registry:check` and `pnpm test` exit 0 in the new repository; in a fresh Base UI app the `shadcn add` of the item at the pushed commit puts 22 files into `components/date-picker/` that `diff -r` shows equal to the approved folder, and `tsc --noEmit` and `next build` pass there; `pnpm storybook:build` exits 0 and writes `storybook-static/index.html`, `storybook-static/base/index.html` and `storybook-static/version.txt`.

### 1.3 Current structure

```
https://github.com/anindosarker/shadcn-date-picker        ← public, empty (no commit, no branch); created 2026-11-24
Vercel project shadcn-date-picker (team anindo-sarkers-projects)  ← connected to the repository, default settings, domain date-picker.shadcn-table.com assigned; the DNS record is with the owner (reference/q149-calendar-library/setup-steps.md)
/Users/anindosarker/Work/Personal/React-table/test-projects/next-app/components/date-picker/   ← the approved code, 22 files, 3102 lines, version 9.3.6, commit 53f4b4f (HEAD of the folder: 9cadf36, no later change); read-only (P6)
├── date-picker.tsx, types.ts
├── modes/        day-picker, day-range-picker, period-picker, period-range-picker, time-range-picker
├── components/   day-calendar, period-views, picker-box, picker-field, picker-popup, picker-presets, picker-trigger, time-columns, time-field, view-nav
└── utils/        labels, range, time, values, views
  imports from outside the folder: react, lucide-react, react-day-picker, date-fns, cn (the npm package `cn` 0.5.0, not `@/lib/utils`), @base-ui/react/popover (types.ts:2, a type only);
  @/components/ui/{badge,button,button-group,calendar,dialog,field,input-group,native-select,popover}; @/hooks/use-mobile
  imports inside the folder: relative only (./ and ../)
test-projects/next-app/.prettierrc, components.json (style base-nova), app/globals.css   ← the formatting and the theme the code was approved with
test-projects/next-app/package.json   ← react 19.3.1, react-day-picker ^10.0.2, date-fns ^4.4.0, @base-ui/react ^1.9.0, lucide-react ^1.64.0, cn ^0.5.0, tailwindcss ^4, tw-animate-css ^1.4.0
ui.shadcn.com/r/styles/{base-nova,radix-nova,aria-nova}/<part>.json   ← each of the nine parts and the hook use-mobile exists in the three styles (read 2026-11-24)
shadcn-react-table/packages/shadcn-table/registry/, tools/registry/, vite.config.ts, .storybook/, vitest.config.ts   ← the pattern: one tree per base, `@/` aliased to one tree by an env var, item definition per tree, Storybook tests in Vitest browser mode
shadcn-react-table/registry.json   ← the root catalog form the CLI reads for a GitHub address: "include" of the per-tree registry.json files
```

### 1.4 Target structure

```
/Users/anindosarker/Work/Personal/React-table/shadcn-date-picker/      ← the clone, default branch main; excluded in the workspace's .git/info/exclude
/Users/anindosarker/Work/Personal/React-table/shadcn-date-picker.worktrees/<milestone slug>/   ← one worktree per milestone, removed after its merge; excluded the same way

shadcn-date-picker/
├── package.json                 ← one private package "shadcn-date-picker", version 0.1.0, license MIT, packageManager and node as the table repository pins them; scripts of 1.6.2
├── pnpm-lock.yaml
├── LICENSE                      ← MIT, the table repository's text and holder
├── README.md                    ← what it is, the install command of each base that has a picker, one usage example
├── .gitignore, .prettierrc, eslint.config.mjs
├── tsconfig.json, tsconfig.baseui.json, tsconfig.radix.json, tsconfig.aria.json, tsconfig.stories.json
├── registry.json                ← root catalog: "include" of registry/base/registry.json, registry/radix/registry.json, registry/aria/registry.json
├── registry/
│   ├── README.md                ← one tree per base, the exact-copy rule, how to build and check
│   ├── base/
│   │   ├── components.json      ← style base-nova, the aliases of test-projects/next-app/components.json
│   │   ├── components/date-picker/**   ← the 22 approved files, exact copy
│   │   ├── components/ui/*.tsx  ← badge, button, button-group, calendar, dialog, field, input-group, native-select, popover and what those parts import, as the shadcn CLI writes them for the style
│   │   ├── hooks/use-mobile.ts
│   │   ├── index.css            ← Tailwind 4 and the shadcn theme of the style, as app/globals.css of the test application
│   │   ├── registry.ts          ← the item definition date-picker-base
│   │   └── registry.json        ← generated from registry.ts
│   ├── radix/                   ← the same without components/date-picker and with an empty item list (style radix-nova)
│   └── aria/                    ← the same (style aria-nova)
├── tools/
│   ├── bases.mjs                ← BASES (base, radix, aria), DEFAULT_BASE (base), readyBases(): the bases whose tree holds components/date-picker/date-picker.tsx
│   ├── registry-build.mjs       ← registry.ts to registry.json per base; --check fails on a stale file or an item file that does not exist
│   └── site-build.mjs           ← the Storybook build of every ready base, the landing page and version.txt (milestone 2)
├── vite.config.ts, vitest.config.ts          ← `@/` aliased to registry/<DP_BASE>; Storybook tests in Vitest browser mode (milestone 2)
├── .storybook/main.ts, preview.tsx, vitest.setup.ts   ← (milestone 2)
├── stories/*.stories.tsx, stories/Introduction.mdx    ← (milestone 2)
├── vercel.json                  ← milestone 1: Git deployments off; milestone 2: the static site build
└── .github/workflows/ci.yml     ← (milestone 2)
```

### 1.5 Flow

```
empty repository ── initial commit on main ──> milestone branch ── scaffold, parts of three styles, exact copy, registry ──> lint, types, registry check, install proof at the pushed commit ──> merge into main
main ──> milestone branch ── Storybook, stories with plays, site build, CI ──> tests, site build, the right-to-left look ──> merge into main ──> Vercel builds the site
```

### 1.6 Components

#### 1.6.1 Repository, clone and branches (D162, D163)

- The clone is `/Users/anindosarker/Work/Personal/React-table/shadcn-date-picker`, a sibling of `shadcn-react-table` in the workspace folder. The workspace repository must not see it: `shadcn-date-picker/` and `shadcn-date-picker.worktrees/` are added to `/Users/anindosarker/Work/Personal/React-table/.git/info/exclude`, where `shadcn-ui/` already is.
- The repository is empty, so the first milestone starts with one commit on `main` (`LICENSE` and a one-line `README.md`), pushed; `main` is then the default branch and Vercel's production branch.
- Every milestone of specs 78 to 80 works on its own branch, named after its tracker slug without the spec number (`date-picker-repository`, `date-picker-stories-and-tests`), created from `origin/main` in its own worktree under `shadcn-date-picker.worktrees/`, with one `pnpm install` there. The runner merges it into `main` with a merge commit `merge: <milestone> (<spec>)`, pushes, deletes the branch local and remote and removes the worktree. No PR, no staging branch, no `dev`, no `claude/review` in this repository. Never force-push; push right after every commit (P8).
- The clone itself stays on `main` and is used for fetches and merges only, never for an install or a build.
- Tracker and plan file edits are commits in the table repository on `claude/review`, by path, in the root checkout, after `git pull --rebase --autostash`, pushed at once; the pool worktrees 01 to 09 of the table repository are not used by this spec.
- Of `process.md`, these bind here: P5 (check the machine load before a long check, tests never in parallel), P6 (ports 5340 to 5360 for agents, the owner's servers and `test-projects/next-app` untouched and read-only), P8, P10 (a visual aid goes to `reference/`). P1 to P4, P7 and P9 describe the table repository and do not apply.
- Does NOT change a GitHub setting of the repository or a setting of the Vercel project; does NOT add a branch ruleset.

#### 1.6.2 Scaffold and scripts

One private package at the repository root; no workspace, no turbo. Dependency versions are the ones `packages/shadcn-table/package.json` and `test-projects/next-app/package.json` pin on the day, the test application's where both name a package the picker imports.

| Script | Does | Status |
| ------ | ---- | ------ |
| `pnpm lint` | `eslint .` and `prettier --check .` | new |
| `pnpm typecheck` | `tsc --noEmit` on `tsconfig.<base>.json` of every base, one after the other; a tree without a picker still checks its parts | new |
| `pnpm registry:build` | `tools/registry-build.mjs`: writes `registry/<base>/registry.json` from `registry.ts` | new |
| `pnpm registry:check` | the same with `--check`: no file written, exit 1 on a stale `registry.json` or a missing item file | new |
| `pnpm test` | the Storybook tests of every ready base, one base after the other (`DP_BASE=<base> vitest run`); `pnpm test --base <base>` for one | new, milestone 2 |
| `pnpm storybook` | `DP_BASE=<base, default base> storybook dev` on a port the caller passes | new, milestone 2 |
| `pnpm storybook:build` | `tools/site-build.mjs` | new, milestone 2 |

- `.prettierrc` is the test application's (`semi: false`, double quotes, `prettier-plugin-tailwindcss`, `tailwindFunctions: ["cn", "cva"]`), with `tailwindStylesheet` pointing at `registry/base/index.css`, so the approved files pass `prettier --check` unchanged.
- `eslint.config.mjs`: flat config, `typescript-eslint` and `eslint-plugin-react-hooks`, nothing framework specific. A rule that the approved code fails is switched off in the config with a one-line reason; the code is not changed for it (report 2.1).
- `tsconfig.<base>.json` maps `@/*` to `registry/<base>/*` and includes that tree; `tsconfig.json` references them.
- The parts of each style are added with the shadcn CLI against `registry/<base>/components.json`, as the table repository's trees were, and committed as the CLI writes them (stock shadcn, no edit). `radix-ui` and `react-aria-components` arrive with them; this milestone owns `package.json` and `pnpm-lock.yaml` for the epic, and the Storybook, Vitest and Playwright packages of milestone 2 are installed here too, so no later milestone runs `pnpm add`.
- `vercel.json` in this milestone is `{ "git": { "deploymentEnabled": false } }`, so a push before the site exists starts no deployment.
- Does NOT add turbo, changesets, a release script, husky or a commit hook; does NOT add a docs application (the site is the Storybook build, 1.6.6: one tool for demo, docs and tests is the thin choice of D162).

#### 1.6.3 The Base UI picker: exact copy (D162, report 2.1 and 3)

- `cp -R` of `test-projects/next-app/components/date-picker/` at commit `53f4b4f` into `registry/base/components/date-picker/`. No line, comment, file name or folder name changes; no file is added, removed or moved. The tree keeps the test application's layout (`components/date-picker` beside `components/ui`, `hooks/use-mobile.ts`), so not even an import path changes.
- Proof, in the tracker: `git -C test-projects/next-app diff --quiet 53f4b4f -- components/date-picker` exits 0 (the folder is at the approved commit), then `diff -r <approved folder> registry/base/components/date-picker` prints nothing and `find registry/base/components/date-picker -type f | wc -l` prints `22`.
- The owner's picker rules of report section 3 are properties of this code and stay as they are: browser inputs, no error message and no `aria-invalid` of its own, the passed-through input attributes, native `select` for month and year, three JSDoc comments only.
- Something that does not compile, lint or install as copied is not edited: the milestone stops that task with the file and line under `## Attention` (a queue card for the owner, report 2.1).
- Does NOT reformat, rename, re-export or "fix" anything in the folder; does NOT add an `index.ts`.

#### 1.6.4 Registry (D162, D163)

- `registry/<base>/registry.ts` defines the items of one tree; `tools/registry-build.mjs` turns it into `registry/<base>/registry.json` (generated, committed, never hand-edited). The root `registry.json` only includes the three files, in the form of the table repository's root catalog.
- Item `date-picker-base`: title `Date Picker (Base UI)`, every file under `registry/base/components/date-picker/` as an item file (the list is read from the folder, never typed), installed to the user's `components/date-picker/` with the same relative paths.
- `registryDependencies`: the nine shadcn parts and `use-mobile`, as bare names, so the user's CLI installs the parts of the user's own style; the list is derived from the `@/components/ui/<part>` and `@/hooks/<hook>` imports of the item files, as `tools/registry/lib.mjs` of the table repository derives it.
- `dependencies`: `react-day-picker`, `date-fns`, `lucide-react`, `cn`, `@base-ui/react`, derived from the package imports of the item files.
- `registry/radix/registry.ts` and `registry/aria/registry.ts` exist with an empty item list; spec 79 fills them. The item names are fixed now: `date-picker-radix`, `date-picker-aria` (D163).
- Install proof, once, in the agent's scratch folder (never in `test-projects/`): a fresh Next.js app set up with the shadcn CLI on the style `base-nova`; `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-base#<sha of the pushed milestone branch>`; then the Acceptance lines of 1.2 for that app, with one page that renders `<DatePicker type="date" />` and `<DatePicker type="date" range />`. The scratch app is deleted after the tracker has the lines. This is one proof, not a test suite (D162).
- Does NOT publish to npm; does NOT ask for an entry in shadcn's registry directory (D162: optional and later); does NOT host item JSON on the site.

#### 1.6.5 Stories and tests (D162)

- `vite.config.ts` aliases `@/` to `registry/<DP_BASE>` (`DP_BASE` unset means `base`), read from `tools/bases.mjs`; Storybook and Vitest use it. Stories import only `@/components/date-picker/date-picker` and `@/components/ui/*`, so one set of stories runs on every base.
- Stories, one file per value type, each with a single and a range story: `Date`, `DateTime`, `Time`, `Week`, `Month`, `Year` (the twelve rows), and one file `Options` for what every picker shares: `disabled`, `required`, `min` and `max`, `step`, `labels`, `presets`, the attributes passed to the browser input, and the phone layout (the popup as a dialog under the `use-mobile` breakpoint).
- Each story is controlled and shows its value and its `onChange` calls as text under the picker, so a play reads them.
- Plays cover the behaviour contract, `reference/q88-date-filter-demo/date-picker-9-cases.md` (case ids G, B, D, DT, C, T, R, P, PR, U). The tracker holds one line per case id: the story and play that covers it, or `not covered: <reason>` (a case only a real Safari or Firefox shows, for example). A play asserts what a user sees and what `onChange` got, never a class name or a Base UI attribute, so it can pass unchanged on Radix and React Aria.
- A case whose play fails on the exact copy is not a reason to change the copy: the play is checked against the cases file first; a real difference between the code and the cases file goes under `## Attention`.
- Tests run in Vitest browser mode on Chromium, headless, as `packages/shadcn-table` runs its Storybook tests.
- Does NOT add visual capture tests, perf profiling, an accessibility audit suite, a Firefox or WebKit run, or a story source plugin; does NOT copy the table's Storybook theme, base switch or version tools.

#### 1.6.6 Site and CI (D162, D163)

- `tools/site-build.mjs`: for every ready base, `DP_BASE=<base> storybook build -o storybook-static/<base>`; then `storybook-static/index.html`, a plain static landing page (the name, one paragraph, the install command and a link to the Storybook of each ready base, a link to the GitHub repository); then `storybook-static/version.txt` with the `package.json` version.
- `stories/Introduction.mdx` is the docs page of each Storybook: what the picker is, install, one usage example per type, the props (from the types and the JSDoc of `DatePicker`).
- `vercel.json` becomes the static site: `installCommand` `pnpm install --frozen-lockfile`, `buildCommand` `pnpm storybook:build`, `outputDirectory` `storybook-static`, no framework; the `git.deploymentEnabled` line of milestone 1 is removed.
- `.github/workflows/ci.yml`, one job on a push to `main` and on a pull request: install, `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, the Chromium of Playwright, `pnpm test`. No matrix, no cache tuning, no required check. It is run once under `act` before it is pushed (`act push -W .github/workflows/ci.yml`), the result in the tracker.
- Does NOT add a custom Storybook theme or toolbar tool, analytics, a sitemap or a second deploy target.

#### 1.6.7 The right-to-left look (D167)

- Once, by hand, on the Base UI picker in a Storybook of the milestone branch: each of the twelve stories with `dir="rtl"` set on the document of the preview, at 1280 and 390 wide, the popup opened, one screenshot each.
- Clean: one line in the tracker. Broken (overlap, a clipped part, a wrong side, a control that cannot be reached): one queue card per finding (`queue/item.py`), its screenshot saved under `reference/q149-calendar-library/rtl/` in the table repository and committed (P10). The code is not changed for it here.
- Does NOT add a story, a play, a toolbar direction switch or a CI step for right-to-left; does NOT test Safari, an iPhone (the owner's own tests) or a five-digit year.

**Stays unchanged:** `test-projects/next-app/**` (read-only), every file of the table repository outside `.ai/plans/v0.9.x/`, the GitHub and Vercel settings of both projects, `shadcn-react-table/registry.json` and `tools/registry/**` (the table's dependency on the picker is D164, a later epic).

### 1.7 Dependencies and env

- New repository packages, all installed by milestone 1: `react`, `react-dom`, `react-day-picker`, `date-fns`, `lucide-react`, `cn`, `@base-ui/react`, `radix-ui`, `react-aria-components`, `class-variance-authority` and `tw-animate-css` as the parts need them, `tailwindcss` 4, `typescript`, `eslint`, `typescript-eslint`, `eslint-plugin-react-hooks`, `prettier`, `prettier-plugin-tailwindcss`, `shadcn` (the schema for `registry.ts`), `vite`, `storybook`, `@storybook/react-vite`, `@storybook/addon-docs`, `@storybook/addon-vitest`, `vitest`, `@vitest/browser-playwright`, `playwright`.
- `DP_BASE`: `base` (default), `radix` or `aria`; selects the tree `@/` points at.
- `gh` and `git` authenticated as the owner (the runner's login); network access to `github.com`, `ui.shadcn.com` and the npm registry; Docker for the one `act` run.
- No secret, token or environment variable on GitHub or Vercel.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date picker repository

- Files owned: `shadcn-date-picker/package.json`, `shadcn-date-picker/pnpm-lock.yaml`, `shadcn-date-picker/LICENSE`, `shadcn-date-picker/README.md`, `shadcn-date-picker/.gitignore`, `shadcn-date-picker/.prettierrc`, `shadcn-date-picker/eslint.config.mjs`, `shadcn-date-picker/tsconfig.json`, `shadcn-date-picker/tsconfig.baseui.json`, `shadcn-date-picker/tsconfig.radix.json`, `shadcn-date-picker/tsconfig.aria.json`, `shadcn-date-picker/tsconfig.stories.json`, `shadcn-date-picker/registry.json`, `shadcn-date-picker/registry/README.md`, `shadcn-date-picker/registry/base/**`, `shadcn-date-picker/registry/radix/**`, `shadcn-date-picker/registry/aria/**`, `shadcn-date-picker/tools/bases.mjs`, `shadcn-date-picker/tools/registry-build.mjs`, `shadcn-date-picker/vercel.json`
- Depends on: none
- Review: none
- Local CI: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, in the milestone's worktree of the new repository, one at a time (P5)
- Task 1: The clone, the two exclude lines, the initial commit on `main`, the milestone branch and worktree (1.6.1). Checks: `git -C /Users/anindosarker/Work/Personal/React-table status --short | grep -c shadcn-date-picker` prints `0`; `gh repo view anindosarker/shadcn-date-picker --json defaultBranchRef --jq .defaultBranchRef.name` prints `main`; `git -C <clone> log --oneline origin/main | wc -l` prints `1`
- Task 2: The scaffold: package, configs, the three trees with their `components.json`, parts, hook and `index.css`, `tools/bases.mjs`, `vercel.json` with deployments off (1.6.2). Checks: `ls registry/<base>/components/ui` lists the nine parts for `base`, `radix` and `aria`; `git diff --stat` after a second run of the same shadcn `add` on one base prints nothing (the parts are as the CLI writes them); `pnpm typecheck` exits 0; `pnpm lint` exits 0
- Task 3: The exact copy (1.6.3). Checks: `git -C /Users/anindosarker/Work/Personal/React-table/test-projects/next-app diff --quiet 53f4b4f -- components/date-picker` exits 0; `diff -r /Users/anindosarker/Work/Personal/React-table/test-projects/next-app/components/date-picker registry/base/components/date-picker` prints nothing; `find registry/base/components/date-picker -type f | wc -l` prints `22`; `pnpm typecheck` and `pnpm lint` exit 0 with the folder unchanged; `git -C /Users/anindosarker/Work/Personal/React-table/test-projects/next-app status --short` prints what it printed before the task
- Task 4: The registry: `registry.ts` of the three trees, `tools/registry-build.mjs`, the generated files, the root catalog (1.6.4). Checks: `pnpm registry:check` exits 0; `node -e` on `registry/base/registry.json` prints one item `date-picker-base` with 22 files, the ten registry dependencies and the five dependencies of 1.6.4; `registry/radix/registry.json` and `registry/aria/registry.json` hold no item; a deleted item file makes `pnpm registry:check` exit 1 (tried once, restored)
- Task 5: The install proof at the pushed commit and the README (1.6.4). Checks: in the scratch app, `find components/date-picker -type f | wc -l` prints `22`; `diff -r components/date-picker <approved folder>` prints nothing; `pnpm exec tsc --noEmit` and `pnpm exec next build` exit 0; each line with the sha in the tracker; the scratch app deleted; `grep -c 'anindosarker/shadcn-date-picker/date-picker-base' README.md` prints `1` or more

### Milestone: Date picker stories and tests

- Files owned: `shadcn-date-picker/vite.config.ts`, `shadcn-date-picker/vitest.config.ts`, `shadcn-date-picker/.storybook/**`, `shadcn-date-picker/stories/**`, `shadcn-date-picker/tools/site-build.mjs`, `shadcn-date-picker/vercel.json`, `shadcn-date-picker/.github/workflows/ci.yml`, `.ai/plans/v0.9.x/anindosarker/reference/q149-calendar-library/rtl/**`
- Depends on: Date picker repository
- Review: none
- Local CI: `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, `pnpm test`, `pnpm storybook:build`, in the milestone's worktree of the new repository, one at a time (P5)
- Task 1: Vite, Vitest and Storybook on the `DP_BASE` alias, the seven story files with controlled stories (1.6.5). Checks: `pnpm typecheck` exits 0 with `tsconfig.stories.json`; `DP_BASE=base pnpm storybook:build` writes `storybook-static/base/index.html`; `git diff --stat origin/main -- registry package.json pnpm-lock.yaml` prints nothing
- Task 2: The plays and the case table (1.6.5). Checks: `pnpm test --base base` exits 0, every play passed; the tracker holds one line per case id of `date-picker-9-cases.md`, covered or `not covered: <reason>`; `grep -rn -E 'data-(open|popup|starting|ending|side)|base-ui' stories` prints nothing; `diff -r <approved folder> registry/base/components/date-picker` still prints nothing
- Task 3: The site build, `Introduction.mdx`, `vercel.json` and the CI workflow (1.6.6). Checks: `pnpm storybook:build` exits 0 and writes `storybook-static/index.html`, `storybook-static/base/index.html` and `storybook-static/version.txt` (`0.1.0`); `storybook-static/radix` and `storybook-static/aria` do not exist; the landing page links to `./base/` only; `act push -W .github/workflows/ci.yml` ends green, the line in the tracker with what `act` could not reproduce; `grep -c deploymentEnabled vercel.json` prints `0`
- Task 4: The right-to-left look (1.6.7, D167). Checks: one tracker line per story and width (24 lines) with `clean` or the card id; a screenshot committed under `reference/q149-calendar-library/rtl/` for every card and for no clean line; `git diff --stat origin/main -- stories .storybook .github` shows no file that names `rtl`; the Storybook server stopped

### 2.2 Checks

- Date picker repository: the `diff -r` of the exact copy printing nothing, 22 files, lint, types and the registry check green, the install proof lines at the pushed sha
- Date picker stories and tests: every play green on Base UI, the case table complete, the site build with its three files, the `act` run of the workflow, the 24 right-to-left lines
- Review: none (the first milestone copies approved code and adds tooling; the second adds stories and tests; no library code is written in this spec)
- The approved folder in `test-projects/next-app` is never written to; the owner's checkouts and servers are never touched (P6)
- After the merge of the second milestone the runner reads the deployment state of the merge commit (`gh api repos/anindosarker/shadcn-date-picker/commits/<sha>/status`) and records it in the tracker; a failed Vercel build is a fix milestone of this spec (`plan/new_fix.py`)
