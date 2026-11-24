# 84: Date picker v0.1.1
- Epic: E27

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The date picker library `anindosarker/shadcn-date-picker` is at tag `v0.1.0`. Three things found after that tag are decided: the developer warning for a wrong `min`, `max` or `step` goes, with the Node-only read that breaks the type check of every Vite app that installs the picker (D176); the previous and next arrows of the month and year grids flip on right-to-left pages (D177); the README says in a few lines that shadcn's stock Base UI calendar part does not move keyboard focus on arrow keys (D179). This spec makes those three changes on the three bases and tags `v0.1.1`.

The table release 0.9.8 (spec 83, held) waits on this tag: spec 82 does not merge on `v0.1.0`. So this spec is one milestone, no review round, and it is not held up by the docs site of spec 85.

D176 and D177 are the first owner-allowed changes to the approved code (report 2.1). From this tag the Base UI source differs from `test-projects/next-app/components/date-picker/` by exactly these two changes, and the proof says so.

### 1.2 Goals

- A `min` or `max` that is not a value of the picker's type and a `step` that is not a whole number above zero are dropped silently; nothing is printed, on the three bases (D176).
- No file of the picker reads `process`; a stock Vite app that installs the picker type-checks without Node types (D176).
- The previous and next chevrons of the month and year grid header carry `rtl:rotate-180`, as the day calendar's caption arrows do, on the three bases (D177).
- The README has a short note under Base UI: the symptom, the link to shadcn-ui/ui issue 9401, and the one line a user can add (D179). The calendar part in the three trees stays the stock one; no calendar file of ours is shipped (D179).
- The annotated tag `v0.1.1` sits on the head of `main`, a GitHub release carries the three install commands, and the lead and the runner of E26 get the three addresses at `#v0.1.1`.
- Acceptance: the previous tag `v0.1.0` for everything this spec does not name: every play of `stories/**` passes on the three bases with one play changed (1.6.1). Programmatic: `diff -r` between the approved folder and `registry/base/components/date-picker` lists exactly `utils/values.ts` and `components/period-views.tsx`, with the hunks of 1.6.1 and 1.6.2 and nothing else; `grep -rn 'process\.' registry/*/components/date-picker registry/*/generated` prints nothing; the Vite proof of 1.6.5 exits 0; `git ls-remote --tags https://github.com/anindosarker/shadcn-date-picker v0.1.1` prints one line.

### 1.3 Current structure

```
shadcn-date-picker/ (main c42b8bb, tag v0.1.0)
├── registry/{base,radix,aria}/components/date-picker/
│   ├── utils/values.ts                  ← :14 type IgnoredProp; :97-104 ignored() with process.env.NODE_ENV at :98 and the message at :100;
│   │                                      callers checkedLimits :111 and checkedStep :119-123. The file is identical on the three bases
│   └── components/period-views.tsx      ← GridHeader :228, <ChevronLeftIcon /> :234 and <ChevronRightIcon /> :238 with no class;
│                                          identical on base and radix, the aria file differs elsewhere and has the same GridHeader
├── registry/{base,radix,aria}/generated/components/date-picker/**   ← written by tools/registry-build.mjs from the source (D173), never by hand
├── registry/base/components/date-picker/components/day-calendar.tsx ← :139, :151 the caption chevrons, already rtl:rotate-180
├── stories/Options.stories.tsx          ← :914-920 the step "G3, G4 a limit or step off the format is ignored, with an error" expects two console.error calls
├── stories/Introduction.mdx             ← :16, :22, :28 install commands at #v0.1.0; :73 "ignored, with a console error outside production"
├── README.md                            ← :10, :16, :22 install commands at #v0.1.0; "Differences between the bases" :69 has Radix UI and React Aria, no Base UI part
└── package.json                         ← version 0.1.0 (version.txt of the site reads it)
```

### 1.4 Target structure

```
registry/{base,radix,aria}/components/date-picker/utils/values.ts            ← no IgnoredProp, no ignored(), no process read; the two callers yield undefined for a bad value
registry/{base,radix,aria}/components/date-picker/components/period-views.tsx ← both GridHeader chevrons with className="rtl:rotate-180"
registry/{base,radix,aria}/generated/**  ← rebuilt by pnpm registry:build
stories/Options.stories.tsx              ← the G3, G4 step expects no console.error and the same ignored limit and step
stories/Introduction.mdx, README.md      ← #v0.1.1; the props row and the Base UI note
package.json                             ← version 0.1.1
tag v0.1.1 (annotated) on origin/main, GitHub release v0.1.1
```

### 1.5 Flow

```
main ──> branch date-picker-v0-1-1 ── play red first ──> the two source changes on three bases ──> registry:build ──> README, Introduction, version
     ──> checks green ──> merge into main ──> CI green ──> tag v0.1.1, release ──> install proofs (Next.js per base, one Vite app) ──> live reads ──> addresses to the lead
```

### 1.6 Components

#### 1.6.1 The warning goes (D176)

- In `utils/values.ts` of each base: the type `IgnoredProp` and the function `ignored()` are deleted; `checkedLimits` and `checkedStep` yield `undefined` where they called it. No other line of the file changes; no replacement helper, no comment.
- The play step at `stories/Options.stories.tsx:914` is rewritten first and run red on `origin/main` (P11): its name says the limit and the step are ignored, it expects `console.error` not to have been called with a `DatePicker:` message, and it keeps every expectation after line 920 that shows the bad `min` and `step` have no effect. The red line goes to the tracker.
- `stories/Introduction.mdx:73`: the props row says a limit in another format is ignored, with no mention of an error.
- The case table `reference/q88-date-filter-demo/date-picker-9-cases.md` is a reference file and is not edited; the tracker has one line that cases G3 and G4 no longer print (D176).

#### 1.6.2 The grid arrows (D177)

- In `components/period-views.tsx` of each base, `GridHeader`: `<ChevronLeftIcon className="rtl:rotate-180" />` and `<ChevronRightIcon className="rtl:rotate-180" />`. Nothing else in the file.
- Proof by the look that found it (D167): the Month and the Year story, single and range, at 1280 and 390 wide on a `dir="rtl"` page of the Base UI Storybook, eight captures under `reference/q149-calendar-library/rtl/after/`, each compared with its capture of spec 78 in `reference/q149-calendar-library/rtl/`; one tracker line each. No play and no CI job is added for it (D167).

#### 1.6.3 Generated files, version and texts (D173, D179)

- `pnpm registry:build` rewrites `registry/<base>/generated/**` and the three `registry.json`; `pnpm registry:check` is green. The generated folders are never edited by hand.
- `package.json` version `0.1.1`.
- `README.md` and `stories/Introduction.mdx`: the three install commands at `#v0.1.1`.
- `README.md`, "Differences between the bases": a part "Base UI" before "Radix UI", three lines at most: in the day calendar, arrow keys move the highlight but not keyboard focus, so Enter picks the day that had focus before; this is shadcn's stock `base-nova` calendar part (link `https://github.com/shadcn-ui/ui/issues/9401`); until it is fixed there, add `ref={ref}` to the day `Button` in your `components/ui/calendar.tsx`.
- Does NOT add `ref={ref}` to `registry/base/components/ui/calendar.tsx` or to any generated file; does NOT ship a calendar item; does NOT post on shadcn-ui/ui (D179).

#### 1.6.4 Tag and release (D162)

- As spec 80, 1.6.2, with `v0.1.1`: the six commands green on the head of `origin/main` after the merge, the CI run of that commit green, `git tag -a v0.1.1 -m "v0.1.1"`, pushed, `gh release create v0.1.1` with the install section and three lines: no developer warning and no Node-only read (D176), right-to-left arrows in the month and year grids (D177), the Base UI note (D179).
- `v0.1.0` is never moved or deleted.

#### 1.6.5 Install proofs at the tag (D176, D162)

- Per base, as spec 80, 1.6.3, at `#v0.1.1`: a fresh Next.js app of the style, the README's command, `tsc --noEmit` and `next build` exit 0, one page that renders a date and a date range picker. The installed files are compared with `registry/<base>/generated/components/date-picker` (D173), not with the source.
- The Vite proof, the reason for D176: `shadcn init --template vite --base base --preset nova` in the scratch folder, the Base UI command at `#v0.1.1`, `tsc --noEmit -p tsconfig.app.json` exits 0 with no `@types/node` added (at `#v0.1.0` it exits 2 with `TS2591: Cannot find name 'process'`, card Q166; that line is quoted in the tracker as the before).
- The scratch apps are deleted after the tracker has the lines.

#### 1.6.6 Live reads and the hand-over

- `https://date-picker.shadcn-table.com/version.txt` prints `0.1.1`; on the Base UI Storybook the Month story on a `dir="rtl"` page shows the flipped arrows; the Introduction page shows `#v0.1.1`. One tracker line each, the browser closed after.
- The DONE line of the milestone to the runner names `anindosarker/shadcn-date-picker/date-picker-base#v0.1.1`, `...-radix#v0.1.1` and `...-aria#v0.1.1`. With it the runner does what the Notes of `plan/epics/E26.md` say for E26: `DATE_PICKER_TAG` to `v0.1.1`, the `node` line out of `packages/shadcn-table/tsconfig.radix.json`, spec 82 merged, the hold on spec 83 lifted. Those are steps of E26's milestones, not of this one.

**Stays unchanged:** the 20 other files of the picker on each base; `registry/<base>/components/ui/**` and `hooks/**`; `.storybook/**`, `tools/**`, `vercel.json`, `.github/workflows/ci.yml`; the GitHub and Vercel settings; `test-projects/next-app` (read-only, P6); the table repository outside `.ai/plans/v0.9.x/`.

### 1.7 Dependencies and env

- No new package.
- `gh` and `git` authenticated as the owner (the runner's login); a browser for the captures and the live reads; network access to `github.com`, the npm registry and the site.
- Clone, branch, worktree, merge and tracker rules, and the process rules that bind: spec 78, 1.6.1. The branch is `date-picker-v0-1-1`.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date picker v0.1.1

- Files owned: `shadcn-date-picker/registry/base/components/date-picker/utils/values.ts`, `shadcn-date-picker/registry/radix/components/date-picker/utils/values.ts`, `shadcn-date-picker/registry/aria/components/date-picker/utils/values.ts`, `shadcn-date-picker/registry/base/components/date-picker/components/period-views.tsx`, `shadcn-date-picker/registry/radix/components/date-picker/components/period-views.tsx`, `shadcn-date-picker/registry/aria/components/date-picker/components/period-views.tsx`, `shadcn-date-picker/registry/base/generated/**`, `shadcn-date-picker/registry/radix/generated/**`, `shadcn-date-picker/registry/aria/generated/**`, `shadcn-date-picker/registry/base/registry.json`, `shadcn-date-picker/registry/radix/registry.json`, `shadcn-date-picker/registry/aria/registry.json`, `shadcn-date-picker/registry.json`, `shadcn-date-picker/stories/Options.stories.tsx`, `shadcn-date-picker/stories/Introduction.mdx`, `shadcn-date-picker/README.md`, `shadcn-date-picker/package.json`
- Depends on: none
- Review: none
- Local CI: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm registry:check`, `pnpm test`, `pnpm storybook:build`, in the milestone's worktree of the date picker repository, one at a time (P5)
- Task 1: The play step of 1.6.1, run red on `origin/main`; then the warning removal on the three bases and the props row (1.6.1). Checks: the red line of `DP_BASE=base pnpm exec vitest run stories/Options.stories.tsx` in the tracker; `grep -rn -E 'process\.|IgnoredProp|ignored\(' registry/*/components/date-picker` prints nothing; `cmp` of `utils/values.ts` between base and radix and between base and aria exits 0; `git diff origin/main --stat -- 'registry/*/components/date-picker/utils/values.ts'` shows three files with deletions only apart from the two changed caller lines; `pnpm test` exits 0 on the three bases
- Task 2: The grid arrows on the three bases and the eight right-to-left captures (1.6.2). Checks: `grep -c 'rtl:rotate-180' registry/<base>/components/date-picker/components/period-views.tsx` prints `2` for each base; `git diff origin/main -- 'registry/*/components/date-picker/components/period-views.tsx'` shows two changed lines per file; eight captures committed under `reference/q149-calendar-library/rtl/after/` and eight tracker lines, each `arrows flipped` or the difference; the Storybook server stopped
- Task 3: The generated files, the version, the README and the Introduction (1.6.3). Checks: `pnpm registry:check` exits 0; `grep -rn 'process\.' registry/*/generated` prints nothing; `grep -c -E 'date-picker-(base|radix|aria)#v0.1.1' README.md` prints `3` and the same on `stories/Introduction.mdx`; `grep -c 'v0.1.0' README.md stories/Introduction.mdx` prints `0` for both; `grep -c 'issues/9401' README.md` prints `1`; `grep -c 'ref={ref}' registry/base/components/ui/calendar.tsx` prints `0`; `diff -r /Users/anindosarker/Work/Personal/React-table/test-projects/next-app/components/date-picker registry/base/components/date-picker` lists `utils/values.ts` and `components/period-views.tsx` only, the output in the tracker; `pnpm lint` and `pnpm typecheck` exit 0
- Task 4: After the merge: the six commands on the head of `main`, the CI run, the tag and the release (1.6.4). Checks: the six commands exit 0, each line with the sha in the tracker; the CI run of that sha is `success`; `git ls-remote --tags https://github.com/anindosarker/shadcn-date-picker v0.1.1` prints one line whose commit is that sha; `git ls-remote --tags https://github.com/anindosarker/shadcn-date-picker v0.1.0` still prints `908300d`'s tag; `gh release view v0.1.1 -R anindosarker/shadcn-date-picker --json tagName --jq .tagName` prints `v0.1.1`
- Task 5: The install proofs at the tag, the live reads and the hand-over (1.6.5, 1.6.6). Checks: per base the four lines of spec 80, 1.6.3 against the generated folder; the Vite line `tsc --noEmit -p tsconfig.app.json` exit 0 with `grep -c '@types/node' package.json` printing `0`, and the quoted before line of Q166; three live read lines; the scratch apps deleted; the DONE line names the three addresses at `#v0.1.1`; the milestone worktree removed and `git -C <clone> status --short` prints nothing

### 2.2 Checks

- Date picker v0.1.1: the play red first then green, the two source changes proven by `diff -r` against the approved folder, the generated files in step, the six commands and the CI run green on the tagged commit, the tag and the release, three Next.js install proofs and the Vite type check, the live reads
- Review: none (two owner-allowed changes of a few lines each, a README note and a tag; the `diff -r` proof bounds the change)
- The tag is created only after the merge and only on a commit whose local checks and CI run are green; `v0.1.0` is never moved
