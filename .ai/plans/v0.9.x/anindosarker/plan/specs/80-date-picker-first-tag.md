# 80: Date picker first tag
- Epic: E25

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

After specs 78 and 79 the repository `anindosarker/shadcn-date-picker` holds the picker on three bases, but nothing a user or the table can pin. The table will depend on the picker per base at a tag (D162), and the library's site belongs on `date-picker.shadcn-table.com` (D163). This spec closes the library's first version: a README that says how to install and use it, the tag `v0.1.0` on `main`, one install proof per base at that tag, and a read of the live site. One milestone; it changes one file and otherwise only proves and tags.

`v0.1.0` is the library's own first version. The `9.3.6` of the report is the count of the demo rounds in the test application and stays in the README as the origin of the code, not as the library's version.

### 1.2 Goals

- `README.md` of the new repository says what the picker is, how to install it on each base by GitHub address at the tag, how to use it, and where the demo and docs are (D162, D163).
- The annotated tag `v0.1.0` sits on the head of `main` and is pushed; a GitHub release of that tag carries the three install commands (D162).
- Each of `date-picker-base`, `date-picker-radix` and `date-picker-aria` installs at `#v0.1.0` into a fresh app of its style, type-checks and builds (D162, D163).
- The site is live: the landing page lists the three bases, each base's Storybook opens a picker, `version.txt` answers `0.1.0` (D162, D163).
- The lead gets the three addresses the table will depend on, for decision D164 in a later epic.
- Acceptance: programmatic. `git ls-remote --tags https://github.com/anindosarker/shadcn-date-picker v0.1.0` prints one line; `gh release view v0.1.0 -R anindosarker/shadcn-date-picker --json tagName --jq .tagName` prints `v0.1.0`; the three install proofs of 1.6.3 pass; the live reads of 1.6.4 pass on `https://date-picker.shadcn-table.com/`, or on the Vercel production address of the project while the owner's DNS record is not in place.

### 1.3 Current structure

```
shadcn-date-picker/ (main, after specs 78 and 79)
├── package.json                         ← version 0.1.0
├── README.md                            ← the short text of spec 78: the Base UI install command at no tag
├── registry.json, registry/{base,radix,aria}/registry.json   ← the items date-picker-base, date-picker-radix, date-picker-aria, 22 files each
├── stories/**, tools/site-build.mjs, vercel.json             ← the site: storybook-static/{index.html, version.txt, base/, radix/, aria/}
└── .github/workflows/ci.yml             ← lint, types, registry check, tests on a push to main
no tag, no GitHub release
Vercel project shadcn-date-picker        ← builds main; domain date-picker.shadcn-table.com assigned; the CNAME record is the owner's step (reference/q149-calendar-library/setup-steps.md)
```

### 1.4 Target structure

```
shadcn-date-picker/README.md             ← the full text of 1.6.1
tag v0.1.0 (annotated) on origin/main    ← and the GitHub release v0.1.0
no other file changes
```

### 1.5 Flow

```
main ──> milestone branch ── README ──> full local checks on the merged tree ──> merge into main ──> CI green on main
main head ── tag v0.1.0, push, GitHub release ──> three install proofs at #v0.1.0 ──> live reads ──> the three addresses to the lead
```

### 1.6 Components

#### 1.6.1 README (D162, D163)

Sections, in this order, plain text and code blocks, no badges:

- One paragraph: a date picker for shadcn/ui, one component `DatePicker` with `type` (`date`, `datetime`, `time`, `week`, `month`, `year`) and `range`, on Base UI, Radix UI and React Aria; it uses the browser's own inputs.
- Install, one command per base: `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-<base>#v0.1.0`, and one line that the CLI adds the shadcn parts of the user's own style.
- Usage: the two examples of the `DatePicker` JSDoc, and the import path `@/components/date-picker/date-picker`.
- Demo and docs: `https://date-picker.shadcn-table.com/`.
- What it does not do, from report section 3: no error message of its own, no replacement for a control a browser lacks.
- Origin: the code is the owner-approved picker of the shadcn-table project (demo version 9.3.6); the three bases have the same files.
- License: MIT.

- Does NOT promise a feature, a roadmap or an npm package; does NOT mention the table's coming dependency on it.

#### 1.6.2 Tag and release (D162)

- Before the tag, on the head of `origin/main` in the milestone's worktree after the merge: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, `pnpm test` (three bases, one after the other), `pnpm storybook:build`; the CI run of that commit on GitHub is green (`gh run list -R anindosarker/shadcn-date-picker --branch main --limit 1 --json conclusion`).
- `git tag -a v0.1.0 -m "v0.1.0" <head of origin/main>`, pushed. Then `gh release create v0.1.0 -R anindosarker/shadcn-date-picker --title v0.1.0 --notes-file <file>`, the notes being the README's install section and one line per base.
- A tag is never moved. Something found after the tag is a fix milestone of this spec (`plan/new_fix.py`) and a tag `v0.1.1`; the DONE line then names the newest tag.
- Does NOT publish to npm, does NOT open a pull request to shadcn's registry directory (D162: optional and later), does NOT add release tooling to the repository.

#### 1.6.3 Install proofs at the tag (D162, D163)

Once per base, in the agent's scratch folder, one app after the other: a fresh Next.js app on the style `base-nova`, `radix-nova` or `aria-nova`; the README's command for that base; then `find components/date-picker -type f | wc -l` prints `22`, `diff -r components/date-picker <clone>/registry/<base>/components/date-picker` prints nothing, `pnpm exec tsc --noEmit` and `pnpm exec next build` exit 0 with one page that renders a date and a date range picker. The apps are deleted after the tracker has the lines.

#### 1.6.4 Live reads (D162, D163)

In a browser, each as one tracker line with what was read and pass or fail, the browser closed after:

- the landing page answers 200 and links to `./base/`, `./radix/` and `./aria/`;
- `version.txt` prints `0.1.0`;
- on each base's Storybook, the Date story renders, its popup opens on a click, a day can be picked and the value text under the picker changes; no error in the console;
- the Introduction page of one base shows the install command with `#v0.1.0`.

The address: `https://date-picker.shadcn-table.com/` when `dig +short date-picker.shadcn-table.com` prints an address; otherwise the production address of the Vercel project (`gh api repos/anindosarker/shadcn-date-picker/deployments --jq '.[0]'` and its status give it), and the DONE line says the DNS record is still with the owner. That case is a pass, not a block.

**Stays unchanged:** every file of the new repository except `README.md`; the GitHub and Vercel settings; the table repository outside `.ai/plans/v0.9.x/`; `shadcn-react-table/registry.json` and `tools/registry/**` (the table's dependency lines are D164).

### 1.7 Dependencies and env

- No new package.
- `gh` and `git` authenticated as the owner (the runner's login); a browser for the live reads; network access to `github.com`, the npm registry and the site.
- Branches, worktrees, merges, tracker commits and the process rules that bind: spec 78, 1.6.1.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date picker first tag

- Files owned: `shadcn-date-picker/README.md`
- Depends on: Date picker Radix version, Date picker React Aria version
- Review: none
- Local CI: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, `pnpm test`, `pnpm storybook:build`, in the milestone's worktree of the new repository, one at a time (P5)
- Task 1: The README (1.6.1). Checks: `grep -c '#v0.1.0' README.md` prints `3` or more; `grep -c -E 'date-picker-(base|radix|aria)#v0.1.0' README.md` prints `3`; `pnpm lint` exits 0; `tools/bases.mjs` reports three ready bases (`node -e` on `readyBases()` prints `base,radix,aria`)
- Task 2: After the merge: the full checks on the head of `main`, the CI run, the tag and the release (1.6.2). Checks: the six commands exit 0, each line with the sha in the tracker; `storybook-static/base/index.html`, `storybook-static/radix/index.html` and `storybook-static/aria/index.html` exist; the CI run of that sha is `success`; `git ls-remote --tags https://github.com/anindosarker/shadcn-date-picker v0.1.0` prints one line whose commit is that sha (`git rev-parse v0.1.0^{commit}`); `gh release view v0.1.0 -R anindosarker/shadcn-date-picker --json tagName --jq .tagName` prints `v0.1.0`
- Task 3: The three install proofs at the tag (1.6.3). Checks: per base, the four lines of 1.6.3 in the tracker; the scratch apps deleted
- Task 4: The live reads and the hand-over (1.6.4). Checks: one tracker line per read (the landing page, `version.txt`, three Storybooks, the Introduction page) with the address used; the DONE line names `anindosarker/shadcn-date-picker/date-picker-base#v0.1.0`, `...-radix#v0.1.0`, `...-aria#v0.1.0`, the site address read, and whether the DNS record is in place; every milestone worktree under `shadcn-date-picker.worktrees/` removed (`git -C <clone> worktree list | wc -l` prints `1`); `git -C <clone> status --short` prints nothing

### 2.2 Checks

- Date picker first tag: the README lines, the six commands green on the tagged commit, the CI run, the tag and the release, three install proofs, the live reads
- Review: none (one README, a tag and proofs; no library code)
- The tag is created only after the merge of this milestone and only on a commit whose local checks and CI run are green
