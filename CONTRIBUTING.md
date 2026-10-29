# Contributing

This repo holds shadcn-table, a React data table on TanStack Table v9 that ships as a shadcn registry: the source is copied into the user's app by the shadcn CLI, there is no npm package, and the Base UI, Radix UI and React Aria bases are supported, one copy of the table per shadcn base. The library source lives once per base, as three complete trees under `packages/shadcn-table/registry/`: `base`, `radix` and `aria`, each with its shadcn parts and every library file. The base list is `BASES` in `packages/shadcn-table/scripts/registry/bases.mjs`, Base UI first, the one source of the order readers see; every script and config that handles more than one base reads it. A change goes through four pieces:

1. **Library:** `packages/shadcn-table`, the three trees and the shared Storybook stories.
2. **Tests:** Vitest runs every story in headless Chromium, once per base.
3. **Docs:** `apps/shadcn-table-docs`, which holds an installed copy of the library.
4. **Registry:** what users install, one item per base built from that base's tree.

```text
packages/shadcn-table/registry/base | registry/radix | registry/aria
  ▼ stories + vitest (every base)   (prove the change)
  ▼ registry:build                  (what users install)
  ▼ lib:install <base>              (docs app copies, one per base)
apps/shadcn-table-docs              (docs, examples, page gate)
```

The goal of this guide: make a change, prove it, open a PR; step 7 says how a merged PR gets released. Vercel and table internals are out of scope here.

## Three Trees

`registry/<base>/components/ui/shadcn-table/` is the library, once per base. Each tree builds on its own shadcn parts (Base UI in `@base-ui/react`, Radix UI in `radix-ui`, React Aria in `react-aria-components`); `@/` is a plain alias to the tree, so no adapter layer, no codemod, nothing generated. Radix is the reference: `pnpm check:bases` (the CI job `bases`) compares every other base against it, each with its own list of library files that differ on purpose, `scripts/registry/base-diff.json` and `scripts/registry/aria-diff.json`. Every other library file must be byte-identical in all three trees, and the guard fails otherwise. The rule for a library change:

- **Edit the radix tree and copy the file to the others** when every base takes the change (the guard reports a missed twin), or
- **edit the base's own copy and add the path to its `<base>-diff.json`** in the same commit when only that base differs, and say so in the PR.

`packages/shadcn-table/registry/README.md` has what lives where, how to add a part and the gates.

## Folder Layout

```text
packages/shadcn-table/
  registry/radix/
    components.json                 # style radix-nova
    components/ui/                  # shadcn/ui parts the library uses (Radix UI)
    components/ui/shadcn-table/     # the library, Radix UI copy; locales under locales/
    registry.ts                     # item definition: shadcn-table + locale items
  registry/base/
    components.json                 # style base-nova
    components/ui/                  # shadcn/ui parts the library uses (Base UI)
    components/ui/shadcn-table/     # the library, Base UI copy (23 files differ)
    registry.ts                     # item definition: shadcn-table-base + locale items
  registry/aria/
    components.json                 # style aria-nova
    components/ui/                  # shadcn/ui parts the library uses (React Aria)
    components/ui/shadcn-table/     # the library, React Aria copy (37 files differ)
    registry.ts                     # item definition: shadcn-table-aria + locale items
  registry/README.md                # what lives where, how to change a file, how to add a part
  stories/                          # Storybook stories, also the test suite, run once per base
  scripts/registry/bases.mjs        # the base list (BASES), radix the reference
  scripts/registry/lib.mjs          # item helpers: tree files + forked parts + css
  scripts/registry/build.mjs        # collects every registry.ts into registry.json
  scripts/registry/examples.mjs     # example items per base -> apps/shadcn-table-docs/registry.json
  scripts/registry/hosted.mjs       # hosted copies per base -> apps/shadcn-table-docs/public/r/<base>/ (gitignored)
  scripts/registry/add-part.mjs     # pnpm add-part <base> <part>: fetch a shadcn part into registry/<base>/components/ui/
  scripts/registry/check-bases.mjs  # pnpm check:bases: the n-tree guard, each base against radix, library and examples
  scripts/registry/base-diff.json   # library files allowed to differ between radix and base
  scripts/registry/aria-diff.json   # library files allowed to differ between radix and aria
  scripts/registry/examples-base-diff.json  # example files allowed to differ between examples/radix and examples/base
  scripts/registry/examples-aria-diff.json  # example files allowed to differ between examples/radix and examples/aria
  registry.json                     # generated, committed, GitHub addresses
apps/shadcn-table-docs/
  components/ui-radix/              # installed Radix UI copy of the library and its parts (never edit)
  components/ui-base/               # installed Base UI copy, same shape (never edit)
  components/ui-aria/               # installed React Aria copy, same shape (never edit)
  examples/radix/<slug>/            # one folder per docs example and base, imports @/components/ui/ like a user's project
  examples/base/<slug>/ aria/<slug>/  # the same examples written for Base UI and React Aria (pnpm check:bases guards the drift)
  examples/map.tsx                  # generated: one component per example (scripts/example-map.mjs)
  examples/.radix/ .base/ .aria/    # generated per-base copies of the examples, imports rewritten (gitignored)
  scripts/install.mjs               # pnpm lib:install <base>: reinstalls one copy from the built registry
  content/docs/                     # MDX pages
  registry.json                     # generated example items, committed
  scripts/check-pages.mjs           # page gate against a running dev server
  app/SKILL.md, app/llms.txt        # routes that serve the agent files
registry.json                       # root item, points at the package registry
skills/                             # the skill file source
vercel.json                         # docs + Storybook deployment
.github/workflows/pr.yml            # the jobs listed in step 6, on every pull request
.github/workflows/release.yml       # version PR and release on every push to master (step 7)
.github/pull_request_template.md    # changes, checklist, release impact
scripts/release/                    # next-version, version-pr, notes, smoke, comment
```

## Prerequisites

Node 22, pnpm 10.13.1 (pinned by `packageManager`, Corepack picks it up), and Chromium for Playwright (step 1 installs it).

| Port | Server                                                             |
| ---- | ------------------------------------------------------------------ |
| 5320 | docs app (`pnpm --filter shadcn-table-docs dev`)                   |
| 6007 | Storybook, Base UI (`pnpm storybook:base`)                 |
| 6006 | Storybook, Radix UI (`pnpm storybook:radix`)               |
| 6008 | Storybook, React Aria (`pnpm storybook:aria`)              |
| 5310 | dev registry (`pnpm registry:dev`)                                 |

Optional environment variables:

| Variable               | Effect                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `PORT`                 | docs dev server port; any value other than 5320 also switches the build dir to `.next-<PORT>` |
| `NEXT_DIST_DIR`        | docs build dir, so two `next dev` or `next build` runs do not share `.next`               |
| `NEXT_PUBLIC_SITE_URL` | absolute site URL in deployments (install snippets, agent prompt); the dev port otherwise |
| `REGISTRY_BASE_URL`    | base URL written into the dev registry instead of `http://localhost:5310/r`              |
| `ST_BASE`              | `base`, `radix` or `aria` aliases `@/` to `registry/<base>` in Vitest and Storybook (every `:base`, `:radix` and `:aria` script sets it); unset or unknown means `registry/base` (`DEFAULT_BASE`) |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key for the docs app; unset means analytics load nothing (see Analytics)   |

## 1. Set Up

Chromium is needed once: the tests and the page gate run in it.

```bash
git clone https://github.com/anindosarker/shadcn-table.git
cd shadcn-table
pnpm install
pnpm --filter shadcn-table exec playwright install chromium
```

## 2. Change the Library

Edit `packages/shadcn-table/registry/radix/components/ui/shadcn-table` and copy the file to its twins under `registry/base/` and `registry/aria/` (or one base's copy plus its `scripts/registry/<base>-diff.json` for a base-only change), then add or update a story under `stories/`: the stories are the test suite, so a change without a story is untested. The Base UI loop:

```bash
pnpm storybook:base                     # http://localhost:6007
pnpm test:base                          # every story, headless Chromium
pnpm --filter shadcn-table tsc:baseui
pnpm --filter shadcn-table lint
pnpm check:bases
```

The Radix UI loop, the same stories against `registry/radix`:

```bash
pnpm storybook:radix                    # http://localhost:6006
pnpm test:radix
pnpm --filter shadcn-table tsc:radix
```

The React Aria loop, the same stories against `registry/aria`:

```bash
pnpm storybook:aria                     # http://localhost:6008
pnpm test:aria
pnpm --filter shadcn-table tsc:aria
```

- **Stories are tests.** `pnpm test:<base>` renders each story and fails on a thrown error or a failed `play` function. A behavior change needs a story that exercises it, and the story must pass on every base: the stories are shared, one set for all three bases, with no per-base story files.
- **shadcn/ui parts.** `registry/<base>/components/ui/*.tsx` are plain shadcn components, never edited by hand, since users get their own copies. Add or refresh one with `pnpm add-part`, which fetches it in the base's style (`registry/<base>/components.json`) and prints the dependencies to add:

  ```bash
  pnpm add-part base tooltip               # or: pnpm add-part radix tooltip, pnpm add-part aria tooltip
  pnpm add-part base --all                 # re-adds every part the base has, forks skipped
  ```

  After `pnpm add-part <base> --all`, `git status --short` must print nothing.

- **Props differ per base.** Menu, select, tooltip, checkbox, slider and popover take different props on Base UI (`render` instead of `asChild`, `closeOnClick`, `alignItemWithTrigger`, the `indeterminate` prop, `onValueCommitted`, ...). React Aria parts differ again (`isDisabled`, `isSelected`, `onPress`, `DialogTrigger` plus `Modal`, the trigger wrapping the menu or tooltip). The files in `base-diff.json` and `aria-diff.json` are plain code against those parts; do not port a Radix prop over and expect it to type-check.

## 3. Sync the Docs App

The docs app renders the installed copies in `components/ui-radix`, `components/ui-base` and `components/ui-aria`, not the package source, so a library change is invisible there until you reinstall them. Each copy comes from that base's built item; the installer restores `components.json`, `app/global.css`, `package.json` and the lockfile afterwards, so a reinstall of an unchanged library leaves `git status` clean.

```bash
pnpm registry:build
pnpm --filter shadcn-table-docs lib:install radix
pnpm --filter shadcn-table-docs lib:install base
pnpm --filter shadcn-table-docs lib:install aria
pnpm --filter shadcn-table-docs dev                        # http://localhost:5320
pnpm --filter shadcn-table-docs types:check
```

The examples exist once per base, `examples/radix/<slug>/`, `examples/base/<slug>/` and `examples/aria/<slug>/`, hand-written in that base's idiom (Base UI `render` for `asChild`, React Aria `isDisabled`, `onPress`, `onChange`, the `TooltipTrigger` composition). They import `@/components/ui/...`, the path a reader has after `shadcn add`, and the code view shows the selected base's folder as is. A change to an example that is the same on every base is made in every folder by hand; `pnpm check:bases` fails when a file differs from `examples/radix` without being listed in `scripts/registry/examples-<base>-diff.json`, so a base-only difference adds its path to that list in the same commit. The live examples run on generated copies, `examples/.radix/`, `examples/.base/` and `examples/.aria/` (`lib/example-variants.mjs`, written on `predev`, `build` and `pnpm examples:variants`), whose imports point at the installed copies; nothing else is rewritten. `examples/map.tsx` and `example-groups/map.tsx` are generated by `node scripts/example-map.mjs` from the `examples/radix` folders and the groups; run it after adding or removing an example.

Page gate, with the dev server running, from `apps/shadcn-table-docs`:

```bash
node scripts/check-pages.mjs a --url http://localhost:5320          # one cluster
node scripts/check-pages.mjs d --url http://localhost:5320 --base aria   # one cluster with the React Aria base selected
node scripts/check-pages.mjs /docs/guides/sorting --url http://localhost:5320   # one page
node scripts/check-pages.mjs --url http://localhost:5320            # everything
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

Fresh React Aria app, with the React Aria items:

```bash
pnpm dlx shadcn@latest init --template vite --base aria --preset nova --name my-aria-app
cd my-aria-app
pnpm dlx shadcn@latest add http://localhost:5310/r/shadcn-table-aria.json
pnpm dlx shadcn@latest add http://localhost:5310/r/shadcn-table-aria-locale-de.json   # optional
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
- **From a pushed branch.** Example items resolve only through GitHub, and the library items can too: `pnpm dlx shadcn@latest add anindosarker/shadcn-table/shadcn-table-radix#<branch>` (or `shadcn-table-base#<branch>`, `shadcn-table-aria#<branch>`), then `anindosarker/shadcn-table/example-basic-radix#<branch> --overwrite` (`example-basic-base#<branch>`, `example-basic-aria#<branch>` on the other bases). Set `GH_TOKEN` to avoid the API rate limit. Locale items depend on the unpinned library address, which the CLI resolves on the default branch, so from a branch install them through `registry:dev` (that is what the CI `install` job does).
- **Rerun after changes.** `registry:dev` rebuilds `.dev/`; `add` again with `--overwrite` to update the installed files.

## 5. Update the Docs and the Registry

Docs pages live in `content/docs`; every example is a folder under `examples/<base>/` for every base with a `TS.tsx` and, when it has data, a `makeData.ts`.

```bash
pnpm registry:build                     # library items -> packages/shadcn-table/registry.json
pnpm registry:items                     # example items per base -> apps/shadcn-table-docs/registry.json
pnpm registry:hosted                    # hosted copies -> apps/shadcn-table-docs/public/r/{base,radix,aria}/ (docs build runs it)
```

The registry has three library items, one per base, each with its own locale items; each lists every file of its tree:

| Tree             | Item                 | Locales                            | npm dependency   |
| ---------------- | -------------------- | ---------------------------------- | ---------------- |
| `registry/base`  | `shadcn-table-base`  | `shadcn-table-base-locale-<code>`  | `@base-ui/react` |
| `registry/radix` | `shadcn-table-radix` | `shadcn-table-radix-locale-<code>` | `radix-ui`       |
| `registry/aria`  | `shadcn-table-aria`  | `shadcn-table-aria-locale-<code>`  | `react-aria-components` |

Each lists 23 shadcn parts as bare `registryDependencies`, so the user's CLI installs its own base's parts (the React Aria item ships its own `label` and lists `checkbox` instead). Users install from the hosted registry on the docs site, one path per base with the same item names on all three: `https://www.shadcn-table.com/r/base/shadcn-table.json`, `https://www.shadcn-table.com/r/radix/shadcn-table.json` and `https://www.shadcn-table.com/r/aria/shadcn-table.json` (locales `/r/<base>/shadcn-table-locale-<code>.json`, examples `/r/<base>/example-<slug>.json`), or through the namespace `@st=https://www.shadcn-table.com/r/{style}/{name}.json`. The GitHub addresses (`anindosarker/shadcn-table/<item>`, the committed per-base names above) stay as the fallback. The committed catalogs also carry the plain names (`shadcn-table`, `shadcn-table-locale-<code>`, `example-<slug>`) as generated aliases of the Base UI items (`DEFAULT_BASE`), because the GitHub shorthand cannot pick a base; `hosted.mjs` skips them.

- **Both `registry.json` files are committed.** `registry:build` and `registry:items` write them with GitHub addresses; never commit one that points at localhost (that is what `registry:dev` and `.dev/` are for). The scripts live in `packages/shadcn-table/scripts/registry/`; the catalogs stay next to the files they list because the CLI resolves `files[].path` relative to the catalog.
- **Example items per base.** `example-<slug>-base`, `example-<slug>-radix` and `example-<slug>-aria` are built from `examples/<base>/<slug>/`; the hosted registry serves each base's items under the plain `example-<slug>` in `/r/<base>/`. They use the public API only and pin no library item; the docs say to install the table first.
- **Page checks.** A new page that renders live examples or prop tables needs an entry in `scripts/page-checks/<cluster>.mjs`.

## 6. Open a PR

`.github/workflows/pr.yml` runs these on every pull request; run them first.

```bash
pnpm --filter shadcn-table tsc:radix
pnpm --filter shadcn-table tsc:baseui
pnpm --filter shadcn-table tsc:aria
pnpm --filter shadcn-table lint
pnpm check:bases
pnpm --filter shadcn-table storybook:build:base    # storybook-static/base
pnpm --filter shadcn-table storybook:build:radix   # storybook-static/radix
pnpm --filter shadcn-table storybook:build:aria    # storybook-static/aria
pnpm test:base
pnpm test:radix
pnpm test:aria
pnpm --filter shadcn-table-docs types:check
pnpm --filter shadcn-table-docs lint
pnpm --filter shadcn-table-docs build
```

It also validates the registry at the pull request's merge SHA, installs the library (`shadcn-table-radix`), a locale and `example-basic-radix` into a fresh Radix Vite app, into one that already has TanStack packages, into a Base UI Vite app with `shadcn-table-base`, into a React Aria Vite app with `shadcn-table-aria`, and into a Next.js app (the `registry` and `install` jobs).

- **Release impact.** Set one `release:` label: `release:patch`, `release:minor`, `release:major`, or `release:skip` for a change that ships nothing. A PR that changes `packages/shadcn-table/registry`, `apps/shadcn-table-docs/components/ui-*` or `skills/` fails the `release impact` job without one. With a level label, add the change's line to `CHANGELOG.md` under `## Unreleased`, below `### Breaking`, `### Removed`, `### Added`, `### Changed`, `### Fixed` or `### Docs`; the job summary shows the version it ships as.
- **Large changes.** Ask on [Discord](https://discord.gg/hsF37t6EKe) first if unsure, then open a GitHub issue, so the direction is agreed before the diff exists.
- **Format.** `pnpm prettier --write <changed files>` for `ts`, `tsx`, `mjs` and `mdx`; `md` and `json` files are prettier-ignored.
- **Commit messages.** `type: short summary` in the imperative (`fix: keep pinned rows visible in grid mode`), one concern per commit.
- **Stage explicit paths.** No `git add -A`: generated files, `.next-*` dirs and `tsconfig.json` noise slip in otherwise.

## 7. Release

Releases come from `master` and need no command; `master` only takes pull requests (work branches, `claude/review`, and `dev` when the owner stages on it).

1. **A merge with changelog lines.** `.github/workflows/release.yml` computes the next version (`scripts/release/next-version.mjs`): the level of the merged PR's `release:` label, else the `## Unreleased` headings (`Breaking`, `Removed`, `Added`, `Changed` minor while the version is 0.x, `Breaking` and `Removed` major from 1.0; `Fixed`, `Docs` patch). `scripts/release/version-pr.mjs` then writes the version into both `package.json` files, renames `## Unreleased` to `## <v> - <date>`, force-pushes one commit `chore: version <v>` to `release/next` and opens the pull request `chore: version <v>` into `master`, or rewrites the open one. Further merges accumulate in that PR; it never lowers the version it already shows.
2. **The owner merges the version PR when it is time to release.** Edit it before merging to override the version. GitHub does not run `pr.yml` on a pull request the workflow opened.
3. **The merge of the version PR** tags `v<v>`, waits for production to serve the version, smokes the site, installs the table per base from the public URL, creates the GitHub release from the `## <v>` section and comments "Released in v<v>" on every PR it shipped (`scripts/release/comment.mjs`). Any failure: no release.
4. **A failed late step.** Run `release.yml` by hand (`workflow_dispatch`) with `version`; `dry_run` (the default) runs the checks only, without it the release and the comments follow. A merge without changelog lines whose version is tagged does nothing.

```bash
node scripts/release/next-version.mjs --level minor   # the version a minor release would ship as
node scripts/release/next-version.mjs                 # from the Unreleased headings; exit 2 means no release
```

## Analytics

The docs app reports to PostHog (US cloud); the library is untouched. How it is wired:

1. `apps/shadcn-table-docs/components/posthog-provider.tsx` initialises `posthog-js` once in a `useEffect`, only when `NEXT_PUBLIC_POSTHOG_KEY` is set, with `api_host: '/ingest'`, page views on history changes, no autocapture and no `identify`; it registers the selected base as a super property, so every report can break down by `base`. Without the key it renders its children and loads nothing.
2. `apps/shadcn-table-docs/app/layout.tsx` mounts it inside fumadocs' `RootProvider`.
3. `apps/shadcn-table-docs/next.config.mjs` rewrites `/ingest/static/*` to `us-assets.i.posthog.com` and `/ingest/*` to `us.i.posthog.com`, with `skipTrailingSlashRedirect` because PostHog paths end with a slash. Events leave from the site's own origin, so ad blockers that drop `posthog.com` requests do not drop them.
4. `apps/shadcn-table-docs/lib/analytics.ts` holds one function per event with typed properties: `base_switched`, `install_command_copied`, `example_code_opened`, `example_file_viewed`, `storybook_opened`, `outbound_clicked`, `search_used`. Components call these functions and never `posthog` directly, so renaming an event is a change to that file alone.
5. The key lives in the Vercel project env (Production and Preview) and in a local `.env.local`; it is never committed.

To run with a key locally, put `NEXT_PUBLIC_POSTHOG_KEY=phc_...` in `apps/shadcn-table-docs/.env.local` (gitignored) and start the dev server or `next build && next start`. The key is public by design: it only lets a browser send events. Without it, the Network tab shows no `/ingest` request and nothing logs. With it, every route change sends a `$pageview` to `/ingest/e/` or `/ingest/batch/`, and each action above sends its event; PostHog's "Activity" page lists them live.

Reading the data in the PostHog UI:

- **Web analytics** (left nav): visitors, page views, top pages, referrers, countries, devices. The daily glance.
- **Product analytics, Trends:** pick an event, for example `install_command_copied`, break down by `base` and `package_manager`. Save it as an insight and pin it to a dashboard named "shadcn-table".
- **Funnels:** `$pageview` filtered to an example page, then `example_code_opened`, then `install_command_copied`; a breakdown by `base` shows which base converts.
- **Paths:** start at `$pageview` on the install page to see where readers go next.
- Three insights to create on day one: page views by base, install copies by base and package manager, the example-to-install funnel.

Session replay, surveys, feature flags and error tracking are not enabled. There is no cookie banner: `person_profiles: 'identified_only'` without `identify` stores an anonymous id only; revisit if an EU audience grows.

## Common Mistakes

- **Editing the docs copy.** `apps/shadcn-table-docs/components/ui-radix`, `components/ui-base` and `components/ui-aria` are overwritten by `lib:install <base>`. Change `packages/shadcn-table/registry/<base>` and sync.
- **Editing one tree only.** The other bases keep the old code; `pnpm check:bases` red is the sign, as is `pnpm test:radix` green and `pnpm test:base` or `pnpm test:aria` red (or the reverse). Make the change in the other trees too, or add the path to that base's `<base>-diff.json` when the difference is meant.
- **Forgetting `lib:install <base>`.** The docs app, the page gate and the examples keep running on the old library on that base.
- **Committing `tsconfig.json` include noise.** Only the two `.next/...` lines belong there.
- **`registry.json` rewritten with localhost.** Use `pnpm registry:dev`, which writes to the gitignored `.dev/`.
- **A port already in use.** Pick another with `PORT=` (docs), `storybook dev -p` (Storybook) or `REGISTRY_BASE_URL` plus your own `serve` (registry).
- **The item and the base do not match.** `shadcn init` defaults to Base UI; that project needs the `/r/base/` path (`shadcn-table-base` on GitHub), a `--base radix` project the `/r/radix/` path (`shadcn-table-radix`), a `--base aria` project (an `aria-*` style) the `/r/aria/` path (`shadcn-table-aria`). The wrong base does not type-check.

## Related

- `.ai/plans/v0.5.x/anindosarker/decisions.md` item 7, the release flow
- `.ai/plans/v0.2-base-ui/anindosarker/v0.2-base-ui-plan.md`, the Base UI copy and why
- `.ai/plans/v0.4.0/anindosarker/decisions.md`, the two-tree layout and why
- `.ai/plans/v0.5.x/anindosarker/decisions.md`, the React Aria copy and the n-tree guard
- `packages/shadcn-table/registry/README.md`, what lives where
- `.github/workflows/pr.yml`, the jobs behind step 6; `.github/workflows/release.yml`, step 7
- `apps/shadcn-table-docs/content/docs/getting-started/install.mdx`, the user-facing install page
- `LICENSE`
