# 02: docs weight

## 1. Architecture

### 1.1 Overview

`components/mdx/example-snippet.tsx` highlights every file of every example for both bases at
build time and passes the React trees to the client as props, so docs pages weigh 1 to 5 MB
each and fill Vercel's deployment storage. Decision: [decisions-archive.md](decisions-archive.md) "Docs
site" 1, highlight on the client, on demand.

### 1.2 Goals

- `guides/editing` HTML plus RSC under 400 KB; `server/app/docs` under 15 MB after
  `next build` (today 4.7 MB and 131 MB)
- Code view unchanged for the reader: file tree, active file, copy button, max height, both
  bases, live example untouched
- Page checks pass, including the one that reads code view text

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── components/
│   ├── code-explorer.tsx            ← client; renders `active.node` (prebuilt tree)
│   ├── example-playground.tsx       ← client; picks `variants[base].files`
│   └── mdx/example-snippet.tsx      ← server; shiki per file per base, wraps in CodeBlock
└── scripts/page-checks/_helpers.mjs ← reads code view text synchronously
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── components/
│   ├── code-explorer.tsx            ← renders DynamicCodeBlock for the active file
│   ├── example-playground.tsx       ← unchanged apart from the ExplorerFile type
│   └── mdx/example-snippet.tsx      ← passes { path, source, lang } only
└── scripts/page-checks/_helpers.mjs ← waits for the highlighted block before reading
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 CodeExplorer

Client component. Highlights the active file in the browser when the reader opens it, with
the same component `components/mdx/install-command.tsx` already uses.

- Renders `DynamicCodeBlock` from `fumadocs-ui/components/dynamic-codeblock` with the active
  file's `source` and `lang`; shiki grammars load lazily; Suspense fallback is a plain
  `<pre>` of the raw source so text is readable before highlighting lands
- Does NOT receive highlighted nodes from the server

**Operations:**

| Operation          | Status   | Notes                                                                            |
| ------------------ | -------- | -------------------------------------------------------------------------------- |
| `ExplorerFile`     | refactor | `node: ReactNode` removed; `lang: string` added                                  |
| active file pane   | refactor | `<DynamicCodeBlock lang code codeblock={{ allowCopy: false, className, viewportProps }} />` |
| file tree, copy    | keep     |                                                                                  |

**Interfaces:**

```typescript
export interface ExplorerFile {
  path: string;   // relative to the example folder
  source: string; // raw, for the copy button and the highlighter
  lang: string;   // shiki language from the extension: tsx, ts, css, json, text
}
```

**Stays unchanged:** `buildTree`, dropdown and tree markup, `activePath` state, copy button.

#### 1.6.2 ExampleSnippet

Server component. Reads the example's files per base and hands strings to the playground.

- Maps each file to `{ path, source, lang }` using the existing `LANGS` table
- Keeps install command, agent prompt, GitHub URL and `ExampleVariant`
- Does NOT import `fumadocs-core/highlight`, `CodeBlock` or `Pre`

**Operations:**

| Operation      | Status   | Notes                                   |
| -------------- | -------- | --------------------------------------- |
| `variantFor()` | refactor | no `render`, no highlight cache         |
| `LANGS`        | keep     |                                         |

**Stays unchanged:** `ExamplePlayground` props other than `files`, `ExampleVariant`.

#### 1.6.3 Page checks

`scripts/page-checks/_helpers.mjs` reads the code view's text to assert the Base UI
variant's imports.

- Waits for a `code` element inside the explorer before reading
- Does NOT change the assertion (that changes in [05](05-docs-app-layout.md))

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: Explorer and snippet

- `ExplorerFile` per 1.6.1; render `DynamicCodeBlock` for the active file
- `example-snippet.tsx` per 1.6.2
- `_helpers.mjs` wait per 1.6.3

#### 2.1.2 Final phase: Cleanup

- Remove the `highlight`, `CodeBlock`, `Pre` and `ReactNode` imports from
  `example-snippet.tsx`; remove `ReactNode` from `code-explorer.tsx` if unused
- `pnpm format`; docs `types:check`, `lint`, `build`

### 2.2 Gates

- Docs `build`; `du -sh .next/server/app/docs` under 15 MB and `guides/editing.html` plus
  `.rsc` under 400 KB, numbers recorded in the tracker
- `check-pages.mjs a` and `e` against `next start` on an allowed port
- Playwright: one guide, Code mode, click a non-entry file, highlighted tokens appear, copy
  button copies the raw source; on both bases
