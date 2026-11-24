# 85: Date picker docs site
- Epic: E27

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`https://date-picker.shadcn-table.com/` is the library's Storybook behind a plain landing page (spec 78, 1.6.6). The owner looked at it: "the docs app looks bad, make it like table". D178 gives the library a small docs app that reuses the shell of the table's docs site and keeps the content thin (D162): a home page, an install page, one page per picker type with a live demo and its code, a ranges page and a props page. The Storybook stays, at `/storybook/`.

The table's shell is about 4,600 lines in `shadcn-react-table/apps/shadcn-table-docs` and is tied to things the picker site does not have (the theme customizer, the agent bar, story pages, generated prop tables, PostHog). So the work is two milestones: a written plan that maps every shell file to taken as is, taken trimmed or not taken, read by a reviewer with no history; then the build from that plan. This spec never gates the tag `v0.1.1` of spec 84 or the table release of spec 83.

### 1.2 Goals

- The site root is a docs app with the table site's header, fonts, colours, section tabs, sidebar, code panels and install command block (D178).
- Pages, and no more: `/` (home), `/docs/install`, `/docs/date`, `/docs/date-time`, `/docs/time`, `/docs/week`, `/docs/month`, `/docs/year`, `/docs/ranges`, `/docs/props`; `/docs` goes to `/docs/install` (D178).
- Each type page and the ranges page shows a live picker and the code of exactly that demo; the header's base switcher (Base UI, Radix UI, React Aria) changes which version runs, as on the table site (D178, D162).
- The Storybook of each base is at `/storybook/<base>/`, its list at `/storybook/`; the old addresses `/base/`, `/radix/` and `/aria/` lead there (D178).
- `/version.txt` still prints the library version; the header shows it after the name with the link to the GitHub releases, as the table's header does (v0.9.x D147).
- The picker in every demo is the repository's own code on the stock parts, so a demo shows what a user gets, the Base UI arrow-key behaviour included (D179).
- Acceptance: the table site as it is live, for the shell: `https://www.shadcn-table.com/` (header and home), `https://www.shadcn-table.com/docs/getting-started/install` (install block, sidebar, tabs) and `https://www.shadcn-table.com/docs/examples/basic` (preview and code panel), each captured at 1440 and 390 wide in light and dark and set beside the matching page of the new site; the tracker names every difference and why (a control the picker site does not have, or content). For the pickers: the Storybook of the tag at `/storybook/<base>/`. Programmatic: the checks of 1.6.6 pass on the production build.

### 1.3 Current structure

```
shadcn-date-picker/ (main)
├── package.json            ← one package; scripts lint, typecheck, registry:build, registry:check, test, storybook, storybook:build
├── tools/site-build.mjs    ← storybook build per ready base into storybook-static/<base>, a static index.html, version.txt
├── vercel.json             ← framework null, buildCommand pnpm storybook:build, outputDirectory storybook-static
├── registry/{base,radix,aria}/components/{date-picker,ui}/**, hooks/**, index.css   ← the three trees the Storybook renders (DP_BASE alias)
├── stories/**, .storybook/**                                                        ← seven story files, Introduction.mdx
└── .github/workflows/ci.yml ← install, lint, typecheck, registry:check, test on a push to main
no docs app, no workspace file

shadcn-react-table/apps/shadcn-table-docs/ (read-only here)   ← the shell: Next.js 16.3.8, fumadocs 16.17.5 (Base UI flavour), Tailwind 4
├── app/layout.tsx, app/(home)/**, app/docs/**, app/global.css (1,070 lines), app/not-found.tsx, app/version.txt/route.ts
├── components/site-nav.tsx, logo.tsx, section-tabs.tsx, sidebar-*.tsx, docs-breadcrumb.tsx, docs-tree-layout.tsx, table-of-contents-list.tsx,
│   search-dialog.tsx, theme-controls.tsx, base-selector.tsx, code-explorer.tsx, example-playground.tsx, example-variant.tsx, mdx.tsx, mdx/install-command.tsx
├── lib/layout.shared.tsx, source.ts, fonts.ts, install.ts, example-variants.mjs, example-source.ts, build-styles.mjs, shared.ts
└── vercel.json at the repository root ← services docs and storybook, the storybook service reached by host name
```

### 1.4 Target structure

```
shadcn-date-picker/
├── pnpm-workspace.yaml          ← new: the root package and docs
├── docs/                        ← new: the docs app
│   ├── app/                     ← layout, home, docs/[[...slug]], global.css, not-found, version.txt
│   ├── components/, lib/        ← the shell files the plan marks taken, each under the table's file name
│   ├── content/docs/*.mdx       ← install, date, date-time, time, week, month, year, ranges, props
│   └── demos/*.tsx              ← one hand-written demo per page, importing @/components/date-picker/date-picker
├── tools/site-build.mjs         ← the landing page is the Storybook list; links and paths fit /storybook/
├── vercel.json                  ← the docs app at the root, the Storybook under /storybook/, the three old addresses redirected
├── .github/workflows/ci.yml     ← plus the docs app's lint, type check and build
└── README.md                    ← "Demo and docs": the site and the Storybook address

shadcn-react-table/.ai/plans/v0.9.x/anindosarker/reference/q149-calendar-library/
├── design-docs-site.md          ← the plan of 1.6.1
└── docs-site/                   ← the captures of 1.6.6
```

### 1.5 Flow

```
plan: read the table shell and the picker repository ──> file map, routes, demo mechanism, Vercel routing proven on a preview ──> fable review
build: branch date-picker-docs-site-build ──> workspace and shell ──> pages and demos ──> Storybook under /storybook/ ──> local production build read at two widths
     ──> merge into main ──> Vercel production ──> live reads ──> README line
```

### 1.6 Components

#### 1.6.1 The plan (D178)

One file, `reference/q149-calendar-library/design-docs-site.md`, written by reading the sources, never from memory. Sections, in this order:

1. Shell inventory: one row per file of `apps/shadcn-table-docs/{app,components,lib}` outside `components/ui*`, `components/prop-tables`, `components/dev-home/v*`, `content`, `examples`, `example-groups` and `public`: `taken as is`, `taken trimmed` (with what leaves and why) or `not taken`. The rule: a file is taken when the header, the fonts, the colours, the section layout, the code panel or the install block need it (D178); it is not taken when it serves a table-only feature.
2. Not taken, fixed by this spec: the theme customizer and the style switcher, the icon library and locale selectors, the agent bar and Copy prompt, Copy page, PostHog and every analytics call, the Discord link, the `llms` routes, Open Graph image routes, JSON-LD, the sitemap and robots routes, story pages and the story map, the generated prop tables, the example playground's Storybook and fullscreen controls. Each row of the inventory that these make empty is named.
3. Dependencies of the docs app: each package with the version the table's docs app has on the day, and the packages the taken files no longer need.
4. Styles: which parts of `app/global.css`, the font setup and the style CSS the shell needs, and which CSS entry the picker needs so the `cn-*` style hook classes of the three trees resolve as they do in the Storybook (`registry/<base>/index.css`, `registry/styles`).
5. Demos and the base switcher: how a demo written once against `@/components/date-picker/date-picker` runs on the base the header selects. The table's way is one generated variant per base with the import pointed at that base's tree (`lib/example-variants.mjs`, `components/example-variant.tsx`, `components/base-selector.tsx`); the plan says which of those files carry over trimmed and which tree each base's variant points at (`registry/<base>/components/**` and `hooks/**`). The code view shows the hand-written file.
6. Routes and content: the ten pages, their titles, the sidebar order, the three section tabs at most, and for each type page the demo's props. Text comes from `stories/Introduction.mdx`, the README and the JSDoc of `DatePicker`; nothing is promised that the code does not do.
7. Storybook under `/storybook/` and Vercel: the `vercel.json` that serves the docs app at the root and the static Storybook output under `/storybook/`, with the redirects of the three old addresses, proven before the plan is closed by one preview deployment of a throwaway branch of the date picker repository that holds only that `vercel.json`, a one-page app and a one-file static folder; the branch and its preview are deleted after, the proof lines stay in the plan. What `tools/site-build.mjs` must change so every link and asset path works under the prefix.
8. Checks the build milestone runs, as 1.6.6, with the page list filled in.

- A fact the read finds that makes a goal of 1.2 unreachable is a queue card with the facts (`queue/item.py`), never a pick in the plan; the plan marks the part as waiting on the card.
- The plan holds decisions and interfaces, not code bodies (planning rule 9). No em dashes. It is a file under `reference/`: written once, not reformatted.
- Review: one `fable` reviewer with no history of either site reads the plan against the two source trees: every `taken as is` file imports nothing that is `not taken`; every `not taken` file is unused by a taken one; the dependency list covers the taken files; the Vercel proof lines say what the plan says. Two rounds at most.
- Does NOT write a file of the date picker repository on `main`; does NOT change a file of the table repository outside `reference/q149-calendar-library/` and the tracker.

#### 1.6.2 Workspace and shell (D178)

- `pnpm-workspace.yaml` names the root package and `docs`; one lockfile. The root scripts keep their names and results; `docs` has `dev`, `build`, `start`, `lint` and `types:check`.
- The shell files come over as the plan's inventory says, under the table's file names and folder names, so a later change on the table side can be carried over by a diff. A trimmed file loses only what the plan lists.
- The header: the `//` mark and the name `shadcn-date-picker`, the version label with its link to the GitHub releases (read from the root `package.json`), search, the GitHub icon, the base switcher, the light and dark toggle.
- No file is a hand-rewritten look-alike of a table file: it is the table's file, as is or trimmed.
- Few code comments: only a why the code cannot say, one line.

#### 1.6.3 Pages and demos (D178, D162, D179)

- Home: the name, one paragraph, the install command block, one live date picker and one live date range picker, links to the install page and to the Storybook. In the table home's header and tokens; none of the table home's tiles or theme demo.
- `/docs/install`: the install block per base at the newest tag, the import path, the parts the CLI adds, the "Differences between the bases" list of the README, the Base UI note included (D179).
- One page per type and the ranges page: one paragraph, the live demo, its code, and the props that matter for that type.
- `/docs/props`: one table from the types and the JSDoc of `DatePicker`, written in MDX.
- A demo is one file in `docs/demos/`, controlled, with the value printed under the picker as the stories print it. It imports the picker by the path a user has after the install.
- Does NOT add a demo for a prop combination the stories do not have; does NOT add `ref={ref}` to a calendar part (D179); does NOT change a file under `registry/`.

#### 1.6.4 Storybook under /storybook/ (D178)

- `tools/site-build.mjs` writes what the plan's section 7 says: the per-base Storybooks, and the list page that was the site root, now the page of `/storybook/`, in the plain form it has.
- `vercel.json` as the plan proved it. `/base/`, `/radix/` and `/aria/` (and any path under them) redirect to the same path under `/storybook/`, not permanent.
- `stories/Introduction.mdx` and the Storybook's own look do not change.

#### 1.6.5 CI and README (D178)

- `.github/workflows/ci.yml`: after the existing steps, the docs app's `lint`, `types:check` and `build`. Run once under `act` before it is pushed (`act push -W .github/workflows/ci.yml`), the result in the tracker; where `act` cannot run the job on this machine, in a Linux container, and the tracker says so.
- `README.md`, "Demo and docs": the site address and one line with the Storybook address.
- Does NOT add analytics, a required check, a branch ruleset or a second Vercel project; does NOT change a GitHub or Vercel setting by hand: the routing lives in `vercel.json`.

#### 1.6.6 Checks on the production build and live (D178)

- Local: `pnpm --filter docs build`, then `next start` on a port from 5340 to 5360 (P6), stopped after. In a browser at 1440 and 390 wide, light and dark: each of the ten pages answers 200 with the header, the tabs and the sidebar; the home and every type page shows its picker, the popup or dialog opens on a click, a value can be picked and the printed value changes; the base switcher set to each of the three bases still gives a working picker on `/docs/date` and `/docs/ranges`; the code view shows the demo file's text; no error in the console; nothing runs past the right edge at 390. One tracker line per page and width.
- The captures of 1.2 Acceptance: the three table pages and the matching new pages, at both widths and both themes, under `reference/q149-calendar-library/docs-site/`, with the differences listed in the tracker.
- After the merge, on `https://date-picker.shadcn-table.com/`: `/` and the nine docs pages answer 200; `/version.txt` prints the `package.json` version; `/storybook/` lists three bases and `/storybook/<base>/` opens the Date story for each; `/base/` ends at `/storybook/base/`; one picker opened and a day picked on `/docs/date`. One tracker line per read, the browser closed after.

**Stays unchanged:** `registry/**`, `stories/**`, `.storybook/**`, `tools/registry-build.mjs`, `tools/bases.mjs`, the tags `v0.1.0` and `v0.1.1`; the table repository outside `.ai/plans/v0.9.x/`; `test-projects/next-app` (P6); the DNS record and the Vercel project's settings.

### 1.7 Dependencies and env

- New packages in `docs/package.json` only, at the versions the table's docs app has on the day (the plan's section 3): Next.js, React, fumadocs core, mdx and ui (Base UI flavour), Tailwind 4 and its PostCSS plugin, next-themes, the icon and font packages the taken files import. The build milestone owns `package.json`, `pnpm-workspace.yaml` and `pnpm-lock.yaml` of the date picker repository.
- `gh`, `git` and the Vercel CLI authenticated as the owner (the runner's login); the Vercel project `shadcn-date-picker`, production branch `main`, builds a preview for every pushed branch.
- Clone, branch, worktree, merge and tracker rules, and the process rules that bind: spec 78, 1.6.1. Branches: `date-picker-docs-site-build`; the throwaway branch of the plan's Vercel proof is `date-picker-docs-vercel-proof`.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date picker docs site

- Files owned: `.ai/plans/v0.9.x/anindosarker/reference/q149-calendar-library/design-docs-site.md`
- Depends on: none
- Review: fable
- Local CI: none (a document; its checks are the task checks and the review)
- Task 1: The read, the shell inventory, the not-taken list, the dependencies and the styles (1.6.1, sections 1 to 4). Checks: `git -C shadcn-react-table ls-files apps/shadcn-table-docs/app apps/shadcn-table-docs/components apps/shadcn-table-docs/lib` minus the folders 1.6.1 excludes equals the inventory's rows, the two counts in the tracker; every row has one of the three marks; for each `taken as is` file, `grep -n "from '@/"` lists only taken files, the reader's line in the tracker
- Task 2: Demos and the base switcher, routes and content (1.6.1, sections 5 and 6). Checks: the plan names the files that carry the base switch and the tree each base points at; ten page rows with title, sidebar place and source of the text; each demo row names the story it follows
- Task 3: The Vercel routing proof and the Storybook prefix (1.6.1, section 7), then the checks list (section 8). Checks: on the preview address of `date-picker-docs-vercel-proof`: `/` answers the one-page app, `/storybook/` answers the static file, `/base/x` ends at `/storybook/base/x`, the three `curl -sI` lines in the plan; `git ls-remote --heads https://github.com/anindosarker/shadcn-date-picker date-picker-docs-vercel-proof` prints nothing after; `git -C <clone> status --short` prints nothing

### Milestone: Date picker docs site build

- Files owned: `shadcn-date-picker/docs/**`, `shadcn-date-picker/pnpm-workspace.yaml`, `shadcn-date-picker/package.json`, `shadcn-date-picker/pnpm-lock.yaml`, `shadcn-date-picker/vercel.json`, `shadcn-date-picker/tools/site-build.mjs`, `shadcn-date-picker/.github/workflows/ci.yml`, `shadcn-date-picker/eslint.config.mjs`, `shadcn-date-picker/.prettierignore`, `shadcn-date-picker/.gitignore`, `shadcn-date-picker/README.md`
- Depends on: Date picker docs site, Date picker v0.1.1
- Review: fable
- Local CI: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, `pnpm test`, `pnpm --filter docs lint`, `pnpm --filter docs types:check`, `pnpm --filter docs build`, `pnpm storybook:build`, in the milestone's worktree of the date picker repository, one at a time (P5)
- Task 1: The workspace and the shell (1.6.2). Checks: `pnpm install --frozen-lockfile` exits 0 after the one install that wrote the lockfile; the root's `pnpm lint`, `pnpm typecheck`, `pnpm registry:check` and `pnpm test` exit 0 as before; for each `taken as is` row, `diff` of the file against the table's prints nothing, and for each `taken trimmed` row the diff shows deletions and the import paths only, the list in the tracker; `pnpm --filter docs types:check` and `pnpm --filter docs lint` exit 0; `git diff --stat origin/main -- registry stories .storybook` prints nothing
- Task 2: The ten pages and the demos (1.6.3). Checks: `ls docs/content/docs/*.mdx | wc -l` prints `9`; each demo file imports `@/components/date-picker/date-picker` and nothing from `registry/`; `grep -rn 'ref={ref}' docs/` prints nothing outside the install page's Base UI note; `pnpm --filter docs build` exits 0
- Task 3: The Storybook under `/storybook/`, `vercel.json`, CI and the README line (1.6.4, 1.6.5). Checks: `pnpm storybook:build` exits 0 and the output holds the three Storybooks and the list page as the plan's section 7 says; the `act` or container run of `ci.yml` green, the line in the tracker; `grep -c 'storybook' README.md` prints `1` or more; the preview deployment of the branch answers `/`, `/docs/date`, `/storybook/base/` and `/version.txt`, the four `curl -sI` lines in the tracker
- Task 4: The local production build read and the captures (1.6.6). Checks: 20 tracker lines (ten pages, two widths) with pass or the fault; three base lines for `/docs/date` and three for `/docs/ranges`; the captures committed under `reference/q149-calendar-library/docs-site/` and the difference list in the tracker; the server stopped (`lsof -nP -iTCP:<port> -sTCP:LISTEN` prints nothing)
- Task 5: After the merge: the live reads (1.6.6). Checks: one tracker line per read of 1.6.6 with the address; the CI run of the merged commit is `success`; the milestone worktree removed and `git -C <clone> status --short` prints nothing; the DONE line names the site address and the Storybook address

### 2.2 Checks

- Date picker docs site: the inventory equals the shell's file list, every taken file's imports resolve inside the taken set, the Vercel routing proven on a preview, the review
- Date picker docs site build: the root checks as before, taken files equal the table's or differ by deletions only, ten pages and their demos, the three bases on the switcher, the Storybook under `/storybook/` with the old addresses redirected, the production build read at two widths and two themes, the captures beside the table site, the live reads
- Review: `fable` on the plan (it decides what a public site is built from) and on the whole diff of the build (a new public site, Vercel routing, a workspace change of the repository)
- The build milestone takes `main` into its branch after spec 84 has merged and runs its Local CI on the merged tree; the two share `package.json` and `README.md` (spec 84 first: the version and the Base UI note; this spec adds the workspace and one line)
