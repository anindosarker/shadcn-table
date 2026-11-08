# 18: PR Summary comment is a grouped table

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`tools/release/pr-summary.mjs` writes the one sticky comment of a pull request (v0.8.x D87, marker `<!-- shadcn-table:pr-summary -->`) as a flat list: a version line, a counts line, one bullet per job in D86 order with `FAIL` inline, a bare `[Run](url)`. D37 replaces the body with the layout of `reference/pr-summary-draft.md`: a title, a label | run | status line, one grouped table, a collapsed failures block, a changelog section with the entry titles, a footer. The data stays the nineteen records and the checkout's `CHANGELOG.md`; the transport (artifacts today, job outputs in spec 19) is untouched here.

One deviation from the draft, forced by the job order: `pr-summary` runs before `prepare-release` (`pr.yml:168` needs it), so the comment cannot know that job's outcome; the draft's `Prepare Release` row is left out. The validate-pr row already says `already bumped` when it is.

### 1.2 Goals

- The comment body, after the marker, in order (D37):
  1. `## <PR title>` (`pull_request.title` from the event payload; `## PR checks` on a dispatch).
  2. `` `<label>` | [run <run id>](<run url>) | <status> ``: the label from the validate-pr record's `details.label`, or `no release label` without one; status `✅ all green` when every expected record passes, `❌ <n> jobs failed` when any failed, else `⚪ <n> skipped` when records are missing.
  3. One table `| Job | Result |`, jobs in `JOBS` order: Typecheck, Storybook Tests, Docs E2E Tests and Installation E2E as a bold group row (`| **Typecheck** | |`) followed by one row per leg (`| &nbsp;&nbsp;base | ✅ tsc clean |`); Lint, Validate Repo and Validate PR as one bold row each. A passing cell is `✅ <summary>`; a failing cell is `❌ <summary before its first ": ">` (`4 sections, 107 pages, 3 failed`); a missing record is `⚪ skipped`.
  4. `<details><summary>❌ <n> failures</summary>` with one line per error of every failed record, `- **<job label>** <error>`, where `<job label>` is `Docs E2E Tests (base)`; a failed record without `errors` contributes its summary; the block is omitted when nothing failed.
  5. `#### Changelog`, then `` Under `## Unreleased`: Added 6 · Changed 2 · Fixed 9 `` (the `###` headings of that section with their `####` counts, in file order), then one bullet per heading `- **Added** · <title> · <title>` listing the `####` titles as written. When `## Unreleased` has no `####` line the line reads `` Under `## Unreleased`: nothing yet `` and no bullets follow; when the section is absent (the bumped head) the top `## <version> - <date>` section is read instead and the line names it.
  6. `<sub>Updated on every run of this pull request.</sub>`.
- The label-event path keeps its contract: on `labeled`/`unlabeled` only Validate PR ran, so the previous comment's table rows for the other jobs and its failures block are kept and only the title line, the status line, the Validate PR row and the changelog section are rebuilt.
- Acceptance: programmatic. `node --test tools/release/pr-summary.test.mjs` green with the tests of 1.6.3; `pnpm test validate-repo` green (it runs `tools/**/*.test.mjs`); under `act pull_request -W .github/workflows/pr.yml -j pr-summary` with the test records staged in `test/.out/` the printed body matches the layout (the job prints the body, `pr-summary.mjs:227`); the next PR comment on GitHub renders the table (eyes on the PR page, screenshot in the tracker).

### 1.3 Current structure

```
tools/release/
├── pr-summary.mjs:1-24      ← header comment: the flat layout
├── pr-summary.mjs:46-71     ← JOBS, the nineteen jobs in D86 order (job label, test, base | scenario)
├── pr-summary.mjs:73-85     ← findRecord, jobLine (`- <job>: FAIL <summary>` or `no record (skipped or cancelled)`)
├── pr-summary.mjs:87-104    ← versionLine (Ships as ...), changelogLine (counts from the validate-pr record)
├── pr-summary.mjs:111-134   ← buildComment(records, { runUrl, previous, labelEvent }): marker, version, counts, jobs, [Run]
├── pr-summary.mjs:136-188   ← request, findComment, upsertComment (unchanged)
├── pr-summary.mjs:190-204   ← readRecords(dir)
├── pr-summary.mjs:206-230   ← main: event payload, pr number, label event, runUrl, records, step summary, upsert
└── pr-summary.test.mjs      ← record() helper, full set, buildComment assertions on the flat lines
test/validate-pr/test.mjs:45-90 ← record details: changelog counts, label, reason, version, note
CHANGELOG.md                 ← `## Unreleased` or `## <version> - <date>`, `### Added|Changed|Fixed|...`, `#### <title>` blocks
.github/workflows/pr.yml:137-157 ← the pr-summary job: checkout, setup-node, download-artifact, `node tools/release/pr-summary.mjs`
```

### 1.4 Target structure

```
tools/release/
├── pr-summary.mjs        ← JOBS unchanged; new: groupRows(), statusLine(), failuresBlock(), changelogSection(text); buildComment(records, { title, runUrl, runId, changelog, previous, labelEvent })
└── pr-summary.test.mjs   ← the tests of 1.6.3
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 18 PR Summary: grouped table, failures, changelog` under `## Unreleased`, `### Changed` (D37).
- The comment body is data for the PR page only; `GITHUB_STEP_SUMMARY` gets the same body (unchanged behaviour, `:226`).

#### 1.6.2 `pr-summary.mjs`

Status `refactor`. `JOBS`, `findRecord`, the API functions and `readRecords` stay; `jobLine`, `versionLine`, `changelogLine` are replaced.

- `buildComment(records, { title, runUrl, runId, changelog, previous, labelEvent })` returns the marker plus the six parts of 1.2. `changelog` is the text of `CHANGELOG.md` read in `main()` from the checkout (`ROOT/CHANGELOG.md`; missing file: the section says `Changelog: not found`).
- Table rows are built from `JOBS` grouped by `test`: a group when more than one job shares the test (`typecheck`, `storybook-tests`, `docs-e2e`, `installation-e2e`), else one bold row. The label-event merge matches rows by their first cell text (`**Validate PR**`, `&nbsp;&nbsp;base` under its group), replacing the Validate PR row only; the failures block is carried over verbatim; everything else is rebuilt.
- The status line counts over `JOBS`: failed = records with `status !== 'pass'`; skipped = jobs without a record; green when neither.
- `main()` adds `title` (`event.pull_request?.title ?? 'PR checks'`), `runId` (`GITHUB_RUN_ID`), `changelog`. Nothing else in `main()` changes.
- Does NOT change the marker, the upsert, the exit code contract (0 whatever the jobs did), or the step-summary write.

**Interfaces:**

```javascript
export const buildComment = (records, { title, runUrl, runId, changelog, previous, labelEvent }) => string;
export const changelogSection = (text) => string; // '#### Changelog\n...' from CHANGELOG.md text
```

#### 1.6.3 Tests

`pr-summary.test.mjs`, status `refactor`, `node --test`:

- full green set: the body starts with the marker, then `## release: 0.9.0`, the status line `✅ all green`, the table has the four group rows and nineteen result rows in `JOBS` order, no `<details>`, the changelog section lists the headings of a fixture `CHANGELOG.md` text.
- two failures: status `❌ 2 jobs failed`, the two cells start with `❌` and stop before the first `: `, the `<details>` block lists each error line with its job label.
- missing records: `⚪ skipped` cells and `⚪ <n> skipped` status.
- label event: a previous body built from the full set, then `buildComment([relabelled validate-pr], { labelEvent: true, previous })` keeps the other rows and the failures block, rebuilds the Validate PR row, the status line and the changelog section.
- changelog: `## Unreleased` with `### Added` (2 titles) and `### Fixed` (1) renders `Added 2 · Fixed 1` and the two bullets; an `## Unreleased` with no `####` renders `nothing yet`; a text without `## Unreleased` reads the first `## <version>` section.
- The tests run on the shipped code first and fail there (the flat body), the red recorded in the tracker (P11).

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: PR summary layout

- Files owned: `tools/release/pr-summary.mjs`, `tools/release/pr-summary.test.mjs`
- Depends on: none
- Review: none
- Local CI: `node --test tools/release/pr-summary.test.mjs`, `pnpm test validate-repo`, `pnpm test lint`
- Task 1: Reproduce: write the tests of 1.6.3, run `node --test tools/release/pr-summary.test.mjs` on the shipped code, record the red in the tracker (P11). Checks: the new tests fail
- Task 2: `buildComment` and its helpers, `main()` (1.6.2). Checks: `node --test tools/release/pr-summary.test.mjs` green
- Task 3: act: stage the records of a recent run (the `test-out-*` artifacts of run 42501252444 via `gh run download 42501252444 -p 'test-out-*' -D test/.out/` flattened) and run `act pull_request -W .github/workflows/pr.yml -j pr-summary -e <event.json with pull_request.title>`; paste the printed body into the tracker Notes. Checks: the body has `## `, the `|` status line, four group rows, the `<details>` block (that run had failures), `#### Changelog`
- Task 4: Cleanup: the header comment of `pr-summary.mjs` describes the new layout, the changelog block, `pnpm format`. Checks: 2.2

### 2.2 Checks

- `node --test tools/release/pr-summary.test.mjs` green
- `pnpm test validate-repo` and `pnpm test lint` green
- `act pull_request -W .github/workflows/pr.yml -j pr-summary` prints the grouped body (tracker Notes)
- The next PR comment on GitHub shows the layout (screenshot path in the tracker)
