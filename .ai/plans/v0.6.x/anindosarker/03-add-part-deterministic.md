# 03: add-part deterministic

## 1. Architecture

### 1.1 Overview

`pnpm add-part <edition> <part>` is the only way a shadcn part enters `registry/<edition>/components/ui/`, and decision 2's gate is "a re-run leaves no diff". Today the CLI output depends on invocation order: a 2026-10-28 probe rewrote 10 radix, 9 base and 7 aria parts nobody had edited (`02-tracker.md`, "Part drift"). Decision 5: fix the two mechanisms in our script, then re-add every part once.

### 1.2 Goals

- `pnpm add-part <edition> <part>` run twice in a row, in any argument order, writes the same bytes
- After one re-add of every part in every edition, a re-run of the full sweep leaves `git status --short` empty
- No part is hand-edited; the committed copies are the script's output

### 1.3 Current structure

```
packages/shadcn-table/scripts/registry/
├── add-part.mjs            ← fetches the item, runs `shadcn add` into a scratch project, copies the files, rewrites the `cn` import, prettier
└── editions.mjs            ← EDITIONS
```

### 1.4 Target structure

```
packages/shadcn-table/scripts/registry/
├── add-part.mjs            ← same, plus: scratch stylesheet declares --font-heading; the directive is set per file from the item JSON; `--all` sweeps every committed part of an edition
└── editions.mjs            ← unchanged
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `registry/{radix,base,aria}/components/ui/*.tsx`: every part re-added once by the fixed script, one commit per edition. Expected diffs are the ones the probe listed (the directive restored where a run had stripped it, `font-heading` kept on `DialogTitle`); any other diff is a halt.
- `registry/{radix,base}/components/ui/checkbox.tsx` are NOT re-added here; part 04 restores them when the fork goes.
- `CHANGELOG.md` `## Unreleased`, `### Fixed`: one line, shadcn parts re-added by a deterministic `add-part`.
- `docs/code-of-conduct/coding-standards.md` Editions bullet: `add-part --all` as the sweep gate.

#### 1.6.2 `add-part.mjs`

- Scratch `index.css` declares `@theme inline { --font-heading: var(--font-sans); }` (the value is irrelevant to the output; the CLI only checks that the token exists), so `font-heading` survives the class transform as it does in a real project.
- `'use client'`: after the CLI runs, for each copied file the script reads the upstream item JSON content; if the upstream file starts with the directive, the written file starts with it (single quotes, prettier's style); if not, it does not. The CLI's `transform-rsc` output is no longer trusted (`@shadcn/registry` 0.2.0 tests the directive with a `/g` regex and `lastIndex` leaks across files). Every edition sets `rsc: false` in its `components.json`; the directive is kept because the upstream parts carry it and Next users of the installed item need it, the same as `shadcn add` in their own project.
- `--all`: with no part names, re-adds every `*.tsx` under the edition's `components/ui/` except the files of the library tree (`shadcn-table/`) and the parts listed in that edition's `forkedUi` (until part 04 removes the field, then no exception). One CLI invocation per part so the order dependency cannot return through a multi-part call.
- Does NOT edit any part by hand, does NOT change `components.json`, does NOT add a check-side normaliser.

**Operations:**

| Operation | Status | Notes |
| --------- | ------ | ----- |
| `makeScratch()` | refactor | stylesheet declares `--font-heading` |
| directive pass | new | per file, from the item JSON |
| `--all` | new | one invocation per committed part |

**Stays unchanged:** the `cn` import rewrite, the prettier pass, the printed dependency list, `lib.mjs`.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: script

- 1.6.2; probe: `pnpm add-part aria separator textarea` then `pnpm add-part aria textarea separator` write the same bytes; `pnpm add-part radix dialog` keeps `font-heading`

#### 2.1.2 Phase 2: sweep

- `pnpm add-part <edition> --all` for radix, base, aria; compare the diff with the probe's lists in `02-tracker.md`; any file outside those lists is a halt (write it to the tracker, stop)
- One commit per edition: `chore(registry): re-add <edition> parts with the deterministic add-part`

#### 2.1.3 Final phase: docs and gates

- 1.6.1; 2.2; CI-only PR into `claude/review`

### 2.2 Gates

- `pnpm add-part <edition> --all && git status --short` prints nothing, all three editions
- `tsc:radix`, `tsc:baseui`, `tsc:aria` 0 errors; `lint` clean; `check:bases` green; `registry:build` green; `storybook:build` per edition green
- `pr.yml` green on the PR
