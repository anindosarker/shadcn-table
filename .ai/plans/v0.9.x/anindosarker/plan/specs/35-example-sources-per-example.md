# 35: Example sources are read per example

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The docs code view reads an example's source through `readExampleFiles` (`lib/example-source.ts:30-42`): `fs.readFile(path.join(dir, rel))` where `dir` is `examples/<base>/<name>` built at run time. Turbopack cannot narrow that path, so it traces the whole `examples/` tree, the hand-written `examples/<base>/` folders and the generated `examples/.<base>/` copies (about 1321 files, reported as 10568 pattern matches), into the server bundle of every docs page; the build prints "The file pattern ... matches 10568 files" and builds and type checks are slow (Q35). A one-file fix with a literal path per base made it worse (4 warnings, 13384 matches) and was reverted. D69: the generator that already walks every example before each build and dev start (`lib/example-variants.mjs`) also writes the code-view sources, and `example-source.ts` loads them from a fixed path per base. What the docs show does not change.

### 1.2 Goals

- `pnpm --filter shadcn-table-docs build` prints no "file pattern" warning for `lib/example-source.ts` (D69).
- No server code reads an example file through a path built from a run-time directory (D69).
- Every example page shows the same files, in the same order, with the same text as today, for each base (D69).
- Build and `types:check` wall time do not rise; both are recorded before and after (D69).
- Acceptance: programmatic. `NEXT_PUBLIC_SITE_URL=http://localhost:<port> pnpm --filter shadcn-table-docs build 2>&1 | grep -c "matches .* files"` prints 0. Before the change, a script saves `readExampleFiles(name, base)` for every example and base to a JSON snapshot (the builder writes the script in the scratchpad and runs it with the app's module resolution, for example through a temporary route or `tsx`); after the change the same script's output is byte-identical (`cmp` exits 0; both paths in the tracker). `time pnpm --filter shadcn-table-docs types:check` and the build's wall time are in the tracker before and after. `pnpm test docs-e2e --base base` green (its examples section opens the code view of every example).

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── lib/example-source.ts:20-21            ← exampleDir(name, base) = path.join(process.cwd(), 'examples', base, name)
├── lib/example-source.ts:30-42            ← readExampleFiles: listExampleFiles(dir), then fs.readFile(path.join(dir, rel)) per file, 'use client' stripped
├── lib/example-files.mjs                  ← listExampleFiles(dir): tree order, TS.tsx first (shared with tools/registry/examples.mjs)
├── lib/example-variants.mjs               ← runs before build, predev and types:check; walks examples/<base>/<slug>/, writes examples/.<base>/<slug>/* with rewritten imports; removes stale variant folders
├── lib/example-variant-dir.mjs            ← VARIANT_DIRS: base → '.base' | '.radix' | '.aria'
├── components/mdx/example-snippet.tsx:36  ← readExampleFiles(name, base)
├── lib/example-prompt.ts:195              ← readExampleFiles(name, base)
├── .gitignore:39-41                       ← /examples/.radix/, /examples/.base/, /examples/.aria/
├── eslint.config.mjs:21-23                ← ignores examples/.<base>/**
└── tsconfig.json:30-35                    ← includes examples/.<base>/**/*.ts(x); excludes examples/<base>
```

`exampleDir` has no caller outside `lib/example-source.ts`.

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── lib/example-variants.mjs               ← also writes examples/.<base>/sources.json: { [slug]: ExampleFile[] } (path, source with the directive stripped), same order as listExampleFiles
├── lib/example-source.ts                  ← readExampleFiles(name, base) returns the slug's entry from that base's sources.json, loaded from a fixed path per base; no fs.readFile on a computed directory; exampleDir removed
└── examples/.<base>/sources.json          ← generated, git-ignored and lint-ignored by the existing examples/.<base>/ rules
CHANGELOG.md (P9)                          ← #### Spec 35 under ## Unreleased, ### Changed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `examples/.<base>/sources.json` (generated, never committed): one file per base, keyed by example slug; each value is the `ExampleFile[]` the code view shows. Written inside the variant folders that `.gitignore` and `eslint.config.mjs` already cover, so no ignore or config file changes.
- `CHANGELOG.md` (P9): `#### Spec 35 Example sources are read per example` under `## Unreleased`, `### Changed`: docs builds no longer trace the whole examples tree (D69).

#### 1.6.2 Generator (D69)

`lib/example-variants.mjs`, status `refactor`.

- While it walks `examples/<base>/<slug>/` it collects each file's text (the hand-written source, before the import rewrite, with the leading `'use client'` directive stripped by the rule of `lib/example-source.ts:15-17`) and writes `examples/<variant dir>/sources.json` once per base, keys in slug order, files in `listExampleFiles` order, `JSON.stringify` with a trailing newline.
- Its stale-folder cleanup keeps `sources.json`.
- The directive-stripping rule lives in one place: moved to `lib/example-files.mjs` (plain ESM, imported by both the generator and `example-source.ts`), not copied.
- Does NOT change the variant files it writes today, their formatting, or when it runs (`build`, `predev`, `types:check`, `examples:variants`).

#### 1.6.3 Reader (D69)

`lib/example-source.ts`, status `refactor`.

- `readExampleFiles(name, base)` keeps its signature and return type. It loads the base's `sources.json` through a path Turbopack can resolve at build time, one fixed path per base (three `import('../examples/.base/sources.json')`-style loaders in a map keyed by base, or three `fs.readFile` calls on fully literal paths; the builder keeps the form with no "file pattern" warning and the lower `types:check` time, and records both measurements), and returns the entry for `name`; an unknown name throws the same kind of error a missing folder throws today.
- `exampleDir` and the `node:fs` walk go.
- Does NOT change `ExampleFile`, `components/mdx/example-snippet.tsx` or `lib/example-prompt.ts`.

**Stays unchanged:** `tools/registry/examples.mjs` (it reads the example folders itself), `components/example-variant.tsx`, `tsconfig*.json`, `eslint.config.mjs`, `.gitignore`, `package.json`.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Example sources per example

- Files owned: `apps/shadcn-table-docs/lib/example-source.ts`, `apps/shadcn-table-docs/lib/example-variants.mjs`, `apps/shadcn-table-docs/lib/example-files.mjs`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: Before numbers and the snapshot (1.2): the warning count, build and `types:check` wall time, the `readExampleFiles` snapshot for every example and base. Checks: the three numbers and the snapshot path are in the tracker
- Task 2: Generator and reader (1.6.2, 1.6.3). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`; `node apps/shadcn-table-docs/lib/example-variants.mjs && ls apps/shadcn-table-docs/examples/.base/sources.json apps/shadcn-table-docs/examples/.radix/sources.json apps/shadcn-table-docs/examples/.aria/sources.json`; `git status --short apps/shadcn-table-docs/examples` prints nothing
- Task 3: Prove the Acceptance of 1.2: the warning count 0, the snapshot `cmp`, the after timings; `pnpm test validate-repo` still green (the registry items generator reads the same folders). Checks: the lines of 1.2
- Task 4: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green
- The warning count, the snapshot comparison and the timings of 1.2
- Review: none (build mechanics, output proven identical by the snapshot; P7 untouched)
