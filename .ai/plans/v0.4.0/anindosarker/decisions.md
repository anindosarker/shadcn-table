# Review feedback on `claude/review` (v0.3.0): decisions

## Docs app

1. Folder goes back to `apps/shadcn-table-docs`.
   - Package name `shadcn-table-docs` stays.
   - Why: the structure-cleanup rename to `apps/docs` was not asked for.
2. UI folders are named per base: `components/ui-radix` and `components/ui-base`.
   - `components.json` `ui` alias points at `@/components/ui-radix`; docs chrome imports
     `@/components/ui-radix/...` directly.
   - Example source under `examples/<slug>/` keeps `@/components/ui/...` imports and is what
     the code view shows, because that is the path a user has after `shadcn add`. Each base
     renders a generated variant (`examples/.radix/`, `examples/.base/`), gitignored because
     `lib/example-variants.mjs` regenerates them on `predev` and `build`.
   - One installer, `scripts/install.mjs <base>`, replaces `lib:install` and
     `install-base.mjs`.
   - Why: one folder per base should say which base; today's Base UI code view shows
     `ui-base` imports, which is wrong for users.

## Package `packages/shadcn-table`

1. One complete library per base, shadcn's model: `registry/radix` and `registry/base`, each
   self-contained. `shared/` and the override resolution go away.
   - Changes to common files are made in both trees by hand. No sync script.
   - A CI guard only (`scripts/registry/check-bases.mjs`): every file outside a committed
     list of differing files must be byte-identical in both trees, every listed file must
     exist in both. No copying, nothing to run locally.
   - Why: with overrides every edit needs knowing which files have a base twin, and the
     editor could not resolve shared files (the TS server assigns a file to a referenced
     project only when it is a root file of that project). A sync script would become its
     own maintenance; the guard is the only way drift is found by CI instead of by a user.
2. Folders follow the shadcn repo.
   - `registry/` is the source of truth: `registry/radix`, `registry/base`,
     `registry/README.md`.
   - `scripts/registry/` holds the registry scripts (`build.mjs`, `hosted.mjs`,
     `examples.mjs`, `add-part.mjs`, `lib.mjs`, `lib.d.mts`, `check-bases.mjs`); `scripts/`
     the rest (`check-storybook.mjs`).
   - `registry.json` stays at the package root: the CLI resolves `files[].path` relative to
     it, so the install addresses stay as they are (the paths inside the catalog follow the
     tree move).
3. Stories and tests stay one set; `@/` is a plain alias to `registry/<ST_BASE>`.

## Target tree

```
shadcn-react-table/
  registry.json                         include file for the GitHub install address
  apps/shadcn-table-docs/
    components.json                     ui alias → @/components/ui-radix
    components/
      ui-radix/                         installed Radix UI library + parts (committed)
      ui-base/                          installed Base UI library + parts (committed)
      ...                               docs chrome, imports @/components/ui-radix/...
    examples/
      <slug>/                           source: @/components/ui/... imports, shown in code view
      .radix/<slug>/                    generated variant (gitignored)
      .base/<slug>/                     generated variant (gitignored)
    scripts/
      install.mjs                       pnpm lib:install <base>
      page-checks/
    lib/  content/  app/  registry.json (example items)
  packages/shadcn-table/
    registry.json                       library items, stays at package root
    registry/
      radix/                            complete Radix UI library
        components/ui/<parts>.tsx
        components/ui/shadcn-table/**
        lib/utils.ts  index.css  components.json  registry.ts
      base/                             complete Base UI library, same shape
      README.md
    scripts/
      registry/                         build.mjs hosted.mjs examples.mjs add-part.mjs lib.mjs lib.d.mts check-bases.mjs
      check-storybook.mjs
    stories/  .storybook/               one set, @/ → registry/<ST_BASE>
    vite.config.ts  vitest.config.ts  eslint.config.js
    tsconfig.json  tsconfig.radix.json  tsconfig.baseui.json  tsconfig.stories.json
    public/r/                           built registry output
```

## TanStack Table v9 architecture

1. Rewrite the library internals to MRT's v9 architecture, mirroring its port file by file.
   - Reference: `TanStack/table` `main`, `examples/react/material-react-table/src/material-react-table/`,
     sparse clone at `React-table/tanstack-table` (`git pull` to update). The
     `React-table/material-react-table` clone is the v8 library and has no v9 code.
   - Shape: library state and APIs become v9 custom features (`features/`), one
     `createTableHook` (`hooks/stTableHook.ts`) bundling them, `useST_TableInstance` wraps
     `useAppTable`, components read state through feature APIs instead of `table.state`.
   - Public API (`useShadcnTable`, `ShadcnTable`, `ST_TableOptions`) stays; the table hook and
     column helper stay internal, as in MRT.
   - Why: MRT moves into the TanStack repo as copy-paste source on this architecture; staying
     its shadcn mirror keeps the port comparable and is the v9-native shape for a reusable
     table package.
   - Ships as `0.4.0`.
   - Plan: `.ai/plans/v9-architecture/anindosarker/v9-architecture-plan.md`.

## Docs site

1. Code view highlights on the client, on demand.
   - `components/mdx/example-snippet.tsx` ships raw source strings only; the explorer
     highlights the active file when opened with fumadocs `DynamicCodeBlock`.
   - Why: build-time shiki trees for every file of every example in both bases made docs
     pages 1 to 5 MB each and filled the Hobby 10 GB deployment storage. Retention was cut by
     the other session (handoff `wt1/.ai/handoffs/handoff-2026-10-20-2310.md`); page weight
     is the remaining cause.
2. PostHog analytics in the docs app.
   - `posthog-js`, US cloud, provider in `app/layout.tsx`, ingest reverse-proxied through
     `next.config.mjs` rewrites, key in `NEXT_PUBLIC_POSTHOG_KEY` (Vercel env and local
     `.env.local`, never committed).
   - Events: auto page views; `base_switched`, `install_command_copied`,
     `example_code_opened`, `example_file_viewed`, `search_used`, `storybook_opened`,
     `outbound_clicked` (GitHub, Discord).
   - Deliver with usage instructions: how to read page views, funnels per base, and the
     install-copy conversion in the PostHog UI.

## Release

1. Releases are automated from a merged pull request (decided 2026-10-22; `master` only
   takes pull requests, so the script cannot push to it).
   - `pnpm release <version>` sets both `package.json` versions, closes the `Unreleased`
     changelog section, commits `chore: version <v>` on `release/<v>`, pushes the branch
     and opens the pull request into `master`.
   - `.github/workflows/release.yml` on every push to `master` (and on `v*` tags pushed
     by hand): skip when `v<v>` is already tagged, else tag `v<v>`, wait for production
     to serve the version, smoke the registry URLs, Storybook, `/SKILL.md` and the page
     checks against production, real install per base from the public URL, then
     `gh release create` with notes from the `## <v>` section of `CHANGELOG.md`. Any
     failure: no release.
   - `CHANGELOG.md` at the repo root is written during the work, not at release time.
   - v0.3.0 was the last manual release (tag on `e7ebbde`, released 2026-10-20).
   - `release.yml` also runs on `workflow_dispatch` with a `dry_run` input that skips
     `gh release create`; that run at the first milestone proves the workflow. No
     intermediate tags; the only tag of this cycle is `v0.4.0`.
   - Why: the manual v0.3.0 pass proved production, not the workflow; a dry run proves the
     workflow without a version bump.
   - For this cycle this item is superseded by item 2 on intermediate releases.
2. Intermediate releases are allowed in this cycle.
   - v0.3.1 releases parts 01 to 05 and 08 at the first milestone.
   - v0.3.2 releases the home page crash fix (part 07) when it lands.
   - v0.4.0 stays the tag for the v9 architecture (part 06).
   - Why: the crash fix and the docs changes are user-facing and part 06 is weeks away; the
     owner decided this on 2026-10-21.

## Sequence

1. Docs folder rename, package layout split, CI guard, docs UI folders (mechanical, small).
2. v9 architecture rewrite on the two-tree layout.
   - Why this order: the split is days, the rewrite is weeks; the rewrite then lands once on
     the final paths, and the editor resolves every file while the owner reviews it.
