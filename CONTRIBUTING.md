# Contributing

This repo holds shadcn-table, a React data table on TanStack Table v8 that ships as a shadcn registry: the source is copied into the user's app by the shadcn CLI, there is no npm package, and the Radix and Base UI bases are supported through one edition each, two complete source trees under `packages/shadcn-table/bases/`. A change goes through four pieces:

1. **Library:** `packages/shadcn-table`, the two source trees and the shared Storybook stories.
2. **Tests:** Vitest runs every story in headless Chromium, once per tree.
3. **Docs:** `apps/shadcn-table-docs`, which holds an installed copy of the library.
4. **Registry:** what users install, built from both trees.

```text
packages/shadcn-table/bases/radix   packages/shadcn-table/bases/base
  ▼ stories + vitest (both trees)   (prove the change)
  ▼ registry:build                  (what users install)
  ▼ lib:install                     (docs app copy, Radix tree)
apps/shadcn-table-docs              (docs, examples, page gate)
```

The goal of this guide: make a change, prove it, open a PR. Release steps live in `.ai/plans/release-v0.1/anindosarker/release-v0.1-plan.md`; Vercel and table internals are out of scope here.

## Two Trees, One Change

`bases/radix` and `bases/base` are hand-written copies of the same library, each against its own shadcn parts (Radix in `radix-ui`, Base UI in `@base-ui/react`). No shared source, no adapter layer, no codemod. The rule for a library change:

- **One PR touches both trees**, the same change in `bases/radix/components/ui/shadcn-table` and `bases/base/components/ui/shadcn-table`, or
- **the PR says why one tree is untouched** (a base-specific bug, a part that only exists on one base).

`pnpm diff-bases` lists the files that differ between the trees beyond the allowlist of known base-specific files; CI runs it as a non-blocking report. A new entry in that list belongs to one of the two cases above.

## Folder Layout

```text
packages/shadcn-table/
  bases/radix/
    components.json                 # style radix-nova
    components/ui/shadcn-table/     # the library, Radix edition; locales under locales/
    components/ui/                  # shadcn/ui parts the library uses (Radix)
    registry.ts                     # item definition: shadcn-table + locale items
  bases/base/
    components.json                 # style base-nova
    components/ui/shadcn-table/     # the library, Base UI edition; locales under locales/
    components/ui/                  # shadcn/ui parts the library uses (Base UI)
    registry.ts                     # item definition: shadcn-table-base + locale items
  stories/                          # Storybook stories, also the test suite, run once per tree
  scripts/build-registry.mjs        # collects both registry.ts files into registry.json
  scripts/diff-bases.mjs            # files that differ between the trees beyond the allowlist
  registry.json                     # generated, committed, GitHub addresses
apps/shadcn-table-docs/
  components/ui/shadcn-table/       # installed copy of the library (never edit)
  examples/                         # one folder per docs example
  content/docs/                     # MDX pages
  registry.json                     # generated example items, committed
  scripts/check-pages.mjs           # page gate against a running dev server
  app/SKILL.md, app/llms.txt        # routes that serve the agent files
registry.json                       # root item, points at the package registry
skills/                             # the skill file source
vercel.json                         # docs + Storybook deployment
.github/workflows/ci.yml            # the jobs listed in step 6
```

## Prerequisites

Node 22, pnpm 10.13.1 (pinned by `packageManager`, Corepack picks it up), and Chromium for Playwright (step 1 installs it).

| Port | Server                                                             |
| ---- | ------------------------------------------------------------------ |
| 5320 | docs app (`pnpm --filter shadcn-table-docs dev`)                   |
| 6006 | Storybook, Radix tree (`pnpm storybook`)                           |
| 6007 | Storybook, Base UI tree (`pnpm --filter shadcn-table storybook:base`) |
| 5310 | dev registry (`pnpm registry:dev`)                                 |

Optional environment variables:

| Variable               | Effect                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `PORT`                 | docs dev server port; any value other than 5320 also switches the build dir to `.next-<PORT>` |
| `NEXT_DIST_DIR`        | docs build dir, so two `next dev` or `next build` runs do not share `.next`               |
| `NEXT_PUBLIC_SITE_URL` | absolute site URL in deployments (install snippets, agent prompt); the dev port otherwise |
| `REGISTRY_BASE_URL`    | base URL written into the dev registry instead of `http://localhost:5310/r`              |
| `ST_BASE`              | `base` points Vitest, Storybook and `tsc` at `bases/base` (the `:base` scripts set it); unset means `bases/radix` |

## 1. Set Up

Chromium is needed once: the tests and the page gate run in it.

```bash
git clone https://github.com/anindosarker/shadcn-table.git
cd shadcn-table
pnpm install
pnpm --filter shadcn-table exec playwright install chromium
```

## 2. Change the Library

Edit `packages/shadcn-table/bases/radix` and `packages/shadcn-table/bases/base`, then add or update a story under `stories/`: the stories are the test suite, so a change without a story is untested. The Radix loop:

```bash
pnpm storybook                          # http://localhost:6006
pnpm test                               # every story, headless Chromium
pnpm --filter shadcn-table tsc
pnpm --filter shadcn-table lint
```

The Base UI loop, the same stories against `bases/base`:

```bash
pnpm --filter shadcn-table storybook:base    # http://localhost:6007
pnpm test:base
pnpm --filter shadcn-table tsc:base
pnpm diff-bases                              # files that differ beyond the allowlist
```

- **Stories are tests.** `pnpm test` renders each story and fails on a thrown error or a failed `play` function. A behavior change needs a story that exercises it, and the story must pass on both trees. A behavior that differs on purpose gets a `<name>.radix.stories.tsx` or `<name>.base.stories.tsx`, included only on that tree.
- **shadcn/ui parts.** `bases/<base>/components/ui/*.tsx` are plain shadcn components; change them only when the table needs it, since users get their own copies. Add or refresh one from the tree's own directory, where the per-base `components.json` picks the style:

  ```bash
  cd packages/shadcn-table/bases/base      # or bases/radix
  pnpm dlx shadcn@latest add tooltip --overwrite
  ```

- **Props differ per base.** Menu, select, tooltip, checkbox, slider and popover take different props on Base UI (`render` instead of `asChild`, `closeOnClick`, `alignItemWithTrigger`, the `indeterminate` prop, `onValueCommitted`, ...). The Base UI tree is plain code against those parts; do not port a Radix prop over and expect it to type-check.

## 3. Sync the Docs App

The docs app renders the installed copy in `components/ui/shadcn-table`, not the package source, so a library change is invisible there until you reinstall it. The docs run the Radix edition.

```bash
pnpm registry:build
pnpm --filter shadcn-table-docs lib:install
git checkout -- apps/shadcn-table-docs/app/global.css      # lib:install rewrites it
pnpm --filter shadcn-table-docs dev                        # http://localhost:5320
pnpm --filter shadcn-table-docs types:check
```

Page gate, with the dev server running, from `apps/shadcn-table-docs`:

```bash
node scripts/check-pages.mjs a --base http://localhost:5320          # one cluster
node scripts/check-pages.mjs /docs/guides/sorting --base http://localhost:5320   # one page
node scripts/check-pages.mjs --base http://localhost:5320            # everything
```

- **Clusters.** `a` is getting-started and the API pages, `b` and `c` the guides, `d` and `e` the examples; `e` also covers the home page. The gate loads each page at desktop and mobile widths and fails on any console error, in particular hydration mismatches.
- **`tsconfig.json` include noise.** Next.js appends `<distDir>/types/**/*.ts` lines to `apps/shadcn-table-docs/tsconfig.json` on every `dev` and `build`. Keep only the default `.next/...` pair; do not commit the others.
- **Second server.** `PORT=5331 pnpm --filter shadcn-table-docs dev` runs a second docs server next to the default one, with its own build dir.

## 4. Prove the Install

The registry is the product, so a library change is only done once the CLI installs it into an app that type-checks and builds, on each base you changed.

```bash
pnpm registry:dev                       # builds .dev/ and serves it on http://localhost:5310
```

Fresh Radix app, anywhere outside the repo:

```bash
pnpm dlx shadcn@latest init --template vite --base radix --preset nova --name my-app
cd my-app
pnpm dlx shadcn@latest add http://localhost:5310/r/shadcn-table.json
pnpm dlx shadcn@latest add http://localhost:5310/r/shadcn-table-locale-de.json   # optional, one per locale
```

Fresh Base UI app, with the Base UI items:

```bash
pnpm dlx shadcn@latest init --template vite --base base --preset nova --name my-base-app
cd my-base-app
pnpm dlx shadcn@latest add http://localhost:5310/r/shadcn-table-base.json
pnpm dlx shadcn@latest add http://localhost:5310/r/shadcn-table-base-locale-de.json   # optional
```

Mount it in `src/App.tsx`:

```tsx
import { ShadcnTable } from '@/components/ui/shadcn-table';

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
];
const data = [
  { name: 'Ada', age: 36 },
  { name: 'Linus', age: 54 },
];

export default function App() {
  return <ShadcnTable columns={columns} data={data} />;
}
```

```bash
pnpm exec tsc --noEmit -p tsconfig.app.json
pnpm exec vite build
```

- **Existing app.** Repeat in an app that already has `@tanstack/react-table` installed (`pnpm add @tanstack/react-table@8.20.5 @tanstack/react-query` first). The CLI merges the dependency; `package.json` must end with one `@tanstack/react-table` entry.
- **From a pushed branch.** Example items resolve only through GitHub, and the library items can too: `pnpm dlx shadcn@latest add anindosarker/shadcn-table/shadcn-table#<branch>` (or `shadcn-table-base#<branch>`), then `anindosarker/shadcn-table/example-basic#<branch> --overwrite`. Set `GH_TOKEN` to avoid the API rate limit. Locale items depend on the unpinned library address, which the CLI resolves on the default branch, so from a branch install them through `registry:dev` (that is what the CI `install` job does).
- **Rerun after changes.** `registry:dev` rebuilds `.dev/`; `add` again with `--overwrite` to update the installed files.

## 5. Update the Docs and the Registry

Docs pages live in `content/docs`; every example is a folder under `examples/` with a `TS.tsx` and, when it has data, a `makeData.ts`.

```bash
pnpm registry:build                     # library items -> packages/shadcn-table/registry.json
pnpm registry:items                     # example items -> apps/shadcn-table-docs/registry.json
```

The registry has two library items, one per tree, each with its own locale items:

| Tree          | Item                | Locales                           | npm dependency   |
| ------------- | ------------------- | --------------------------------- | ---------------- |
| `bases/radix` | `shadcn-table`      | `shadcn-table-locale-<code>`      | `radix-ui`       |
| `bases/base`  | `shadcn-table-base` | `shadcn-table-base-locale-<code>` | `@base-ui/react` |

Both list the same 23 shadcn parts as bare `registryDependencies`, so the user's CLI installs its own base's parts. Users install from the hosted registry on the docs site, one path per base with the same item names on both: `https://www.shadcn-table.com/r/radix/shadcn-table.json` and `https://www.shadcn-table.com/r/base/shadcn-table.json` (locales `/r/<base>/shadcn-table-locale-<code>.json`, examples `/r/<base>/example-<slug>.json`), or through the namespace `@st=https://www.shadcn-table.com/r/{style}/{name}.json`. The GitHub addresses (`anindosarker/shadcn-table/<item>`) stay as the fallback.

- **Both `registry.json` files are committed.** `registry:build` and `registry:items` write them with GitHub addresses; never commit one that points at localhost (that is what `registry:dev` and `.dev/` are for).
- **Example items are base-neutral.** They use the public API only and pin no library item, so one example item serves both bases; the docs say to install the table first. Examples pin shadcn parts to the branch in `lib/shared.ts` (`gitConfig.branch`).
- **Page checks.** A new page that renders live examples or prop tables needs an entry in `scripts/page-checks/<cluster>.mjs`.

## 6. Open a PR

CI runs these, in this order; run them first.

```bash
pnpm --filter shadcn-table tsc
pnpm --filter shadcn-table tsc:base
pnpm --filter shadcn-table lint
pnpm --filter shadcn-table storybook:build
pnpm --filter shadcn-table storybook:build:base
pnpm test
pnpm test:base
pnpm --filter shadcn-table-docs types:check
pnpm --filter shadcn-table-docs lint
pnpm --filter shadcn-table-docs build
```

On a push, CI also validates the registry at the pushed SHA, installs the library, a locale and `example-basic` into a fresh Radix Vite app, into one that already has TanStack packages, into a Base UI Vite app with `shadcn-table-base`, and into a Next.js app (the `registry` and `install` jobs), and reports `diff-bases` in the job summary.

- **Large changes.** Ask on [Discord](https://discord.gg/hsF37t6EKe) first if unsure, then open a GitHub issue, so the direction is agreed before the diff exists.
- **Format.** `pnpm prettier --write <changed files>` for `ts`, `tsx`, `mjs` and `mdx`; `md` and `json` files are prettier-ignored.
- **Commit messages.** `type: short summary` in the imperative (`fix: keep pinned rows visible in grid mode`), one concern per commit.
- **Stage explicit paths.** No `git add -A`: generated files, `.next-*` dirs and `tsconfig.json` noise slip in otherwise.

## Common Mistakes

- **Editing the docs copy.** `apps/shadcn-table-docs/components/ui/shadcn-table` is overwritten by `lib:install`. Change `packages/shadcn-table/bases/radix` (and `bases/base`) and sync.
- **Changing one tree.** `pnpm test` green and `pnpm test:base` red (or the reverse) means the trees drifted; `pnpm diff-bases` shows where. Either port the change or say in the PR why the other tree stays.
- **Forgetting `lib:install`.** The docs app, the page gate and the examples keep running on the old library.
- **Committing `tsconfig.json` include noise.** Only the two `.next/...` lines belong there.
- **`registry.json` rewritten with localhost.** Use `pnpm registry:dev`, which writes to the gitignored `.dev/`.
- **A port already in use.** Pick another with `PORT=` (docs), `storybook dev -p` (Storybook) or `REGISTRY_BASE_URL` plus your own `serve` (registry).
- **The item and the base do not match.** `shadcn init` defaults to Base UI; that project needs the `/r/base/` path (`shadcn-table-base` on GitHub), a `--base radix` project the `/r/radix/` path (`shadcn-table`). The wrong edition does not type-check. React Aria is not supported.

## Related

- `.ai/plans/release-v0.1/anindosarker/release-v0.1-plan.md`, the release checklist
- `.ai/plans/v0.2-base-ui/anindosarker/v0.2-base-ui-plan.md`, the two-tree layout and why
- `.github/workflows/ci.yml`, the jobs behind step 6
- `apps/shadcn-table-docs/content/docs/getting-started/install.mdx`, the user-facing install page
- `LICENSE`
