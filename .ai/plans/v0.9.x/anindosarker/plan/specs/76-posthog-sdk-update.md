# 76: PostHog SDK update
- Epic: E23

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

PostHog's SDK Health page marks the docs site's analytics SDK as outdated (Q147): the docs app pins `posthog-js` at `1.438.13`, the latest is `1.453.2`. Events still arrive. The owner asked for the update, a recheck that the setup is done properly, and a deploy without the long checks (D159). Two milestones in one spec, because the second only moves what the first merged: the first reads the release notes, rechecks the setup against PostHog's current guides, bumps the package and proves the build carries the new version; the second ships it by one PR from `dev` into `master` with `release:skip` and `ci:skip` (D153), as spec 75 shipped, and reads the live site. No version bump, no tag: the sites stay 0.9.7.

### 1.2 Goals

- `posthog-js` in `apps/shadcn-table-docs` is the latest `1.x` (`1.453.2` on 2026-11-23); `apps/shadcn-table-docs/package.json` and `pnpm-lock.yaml` are the only code files that change (D159).
- The release notes between `1.438.13` and the new version are read, and every entry that touches something the docs app uses is named in the tracker with what it means here, or the tracker says none does (D159).
- The setup is rechecked point by point against PostHog's current Next.js install guide and its Next.js reverse proxy guide; each point is recorded as matches or differs, with the reason for a difference that is deliberate (D159, D67, D62, D53).
- The `Analytics` section of `CONTRIBUTING.md` says where the init really happens (ride-along, 1.6.2).
- The update is live: the docs site sends its events with the new SDK version, no version bump, no tag, both sites still answer `0.9.7` (D159, D153).
- `claude/review` and `dev` end at `master` (P4).
- Acceptance: the previous release (0.9.7, live before the change) for everything a visitor and the PostHog project see: the same seven event names of `lib/analytics.ts`, page views on route changes, the same init options. Programmatic: the built docs app holds the text `1.453.2` (the new version) and no `1.438.13` in `.next/static`; `gh pr view <N> --json state --jq .state` prints `MERGED`; `git ls-remote --tags origin 'v0.9.8'` prints nothing; `curl -fsS https://www.shadcn-table.com/version.txt` prints `0.9.7`; the live reads of 1.6.3 pass.

### 1.3 Current structure

```
apps/shadcn-table-docs/package.json:53          ← "posthog-js": "^1.438.13"
pnpm-lock.yaml                                  ← posthog-js@1.438.13, @posthog/core@1.59.1, @posthog/types@1.416.0, @posthog/browser-common@0.9.5
apps/shadcn-table-docs/components/posthog-provider.tsx  ← mounts in app/layout.tsx:81, calls schedule() and register() of lib/posthog-client.ts
apps/shadcn-table-docs/lib/posthog-client.ts    ← dynamic import('posthog-js') on first idle moment or interaction; posthog.init(KEY, initOptions); queue for capture/register
apps/shadcn-table-docs/lib/posthog-options.ts   ← initOptions: api_host '/ingest', ui_host 'https://us.posthog.com', capture_pageview 'history_change', capture_pageleave true, person_profiles 'identified_only', autocapture false
apps/shadcn-table-docs/lib/analytics.ts         ← the seven custom events, through capture()
apps/shadcn-table-docs/next.config.mjs:65-76,96-107  ← rewrites /ingest/static/* and /ingest/*; skipTrailingSlashRedirect; the slash redirect that spares /ingest (D53)
CONTRIBUTING.md:321-331                         ← Analytics section; item 1 still says the provider initialises posthog-js in a useEffect with the options
CHANGELOG.md                                    ← ## Unreleased, ### Docs: #### Spec 70, #### Spec 74
origin/master, origin/dev (84d1e91f)            ← 0.9.7 plus the phone toolbar; live
origin/claude/review                            ← master plus plan commits only
```

### 1.4 Target structure

```
apps/shadcn-table-docs/package.json             ← "posthog-js": "^<new version>"
pnpm-lock.yaml                                  ← posthog-js@<new version> and the @posthog/* packages it brings; no other package moves
CONTRIBUTING.md                                 ← Analytics item 1 names lib/posthog-client.ts and lib/posthog-options.ts
CHANGELOG.md                                    ← + #### Spec 76 under ## Unreleased, ### Docs
origin/master                                   ← + the merge of the shipping PR; package version stays 0.9.7
origin/dev, origin/claude/review                ← at master
```

### 1.5 Flow

```
release notes + setup recheck ──> bump (package.json, lockfile) ──> types, lint, validate-repo, docs build ──> version text in .next/static ──> merge into claude/review
claude/review ── fast-forward ──> dev ── gh pr create (release:skip, ci:skip) ──> first run ── CLEAN ── auto-merge ──> master ── Vercel build ──> live reads
```

### 1.6 Components

#### 1.6.1 Release notes and setup recheck (D159)

- Release notes: the `posthog-js` entries after `1.438.13` up to the new version, from the package's own changelog (`gh api repos/PostHog/posthog-js/releases --paginate`, or `CHANGELOG.md` of the package in that repository). The tracker lists every entry that touches what the docs app uses: `init`, the default export and `__loaded` (`lib/posthog-client.ts:30-34`), `capture`, `register`, the six options of `lib/posthog-options.ts`, the `PostHogConfig` and `PostHog` types, page view and page leave capture, session recording (D67), the request paths under `/ingest` (`e/`, `batch/`, `flags/`, `s/`, `static/`). Each listed entry gets one line: what changed and what it means for the docs site. No such entry: the tracker says so in one line.
- Setup recheck, one tracker line per point, `matches` or `differs: <what>, <reason>`, against `https://posthog.com/docs/libraries/next-js` and `https://posthog.com/docs/advanced/proxy/nextjs` as they read on the day:
  - where and when `posthog.init` runs (the guide's place against the docs app's lazy load after hydration, which is deliberate: D62, Q30);
  - the key and host: `NEXT_PUBLIC_POSTHOG_KEY`, `api_host: '/ingest'`, `ui_host: 'https://us.posthog.com'`;
  - the rewrites: `/ingest/static/:path*` to `us-assets.i.posthog.com/static/:path*`, `/ingest/:path*` to `us.i.posthog.com/:path*`, and any further rewrite the guide names today;
  - `skipTrailingSlashRedirect: true` and the slash redirect that spares `/ingest` (D53);
  - page views: `capture_pageview: 'history_change'`, `capture_pageleave: true`;
  - `person_profiles: 'identified_only'`, `autocapture: false`, no `identify` call;
  - session replay following the project setting (D67);
  - any option the guide now sets that the docs app does not (a `defaults` date, for example): named, not added.
- A difference that would change what the site sends or what the PostHog project shows is a queue card (`queue/item.py`), not an edit: D159 allows a code change only where the release notes or the recheck require one for the site to keep working as on 0.9.7, and the tracker then names the file and the reason.
- Does NOT change `lib/posthog-options.ts`, `lib/posthog-client.ts`, `components/posthog-provider.tsx`, `lib/analytics.ts` or `next.config.mjs` unless the line above applies; does NOT add an option because a guide shows it.

#### 1.6.2 The bump (D159, P6, P9)

- In the milestone's pool worktree: `pnpm --filter shadcn-table-docs add posthog-js@latest`, after `npm view posthog-js version` printed a `1.` version; a `2.` or higher stops the milestone with a queue card (D159 says the latest 1.x). `package.json` then reads `"posthog-js": "^<new version>"`. This milestone owns `apps/shadcn-table-docs/package.json` and `pnpm-lock.yaml` for the epic (P6).
- The lockfile diff holds `posthog-js` and the `@posthog/*` packages it depends on, and nothing else: `git diff origin/claude/review -- pnpm-lock.yaml | grep -E '^[+-] ' | grep -v -i posthog` lists only lines that belong to those package blocks (their integrity, dependency and peer lines); any other package that moved is put back to its version on `origin/claude/review`, or named in the tracker with why it had to move.
- Ride-along, `CONTRIBUTING.md`, Analytics item 1: the sentence says today that `components/posthog-provider.tsx` initialises `posthog-js` once in a `useEffect` with the options. It becomes: the provider schedules the load on mount and registers the selected base; `lib/posthog-client.ts` imports `posthog-js` on the first idle moment or interaction, only when `NEXT_PUBLIC_POSTHOG_KEY` is set, and initialises it with the options of `lib/posthog-options.ts` (`api_host: '/ingest'`, page views on history changes, no autocapture, no `identify`). The rest of the section stays.
- `CHANGELOG.md` (P9): `#### Spec 76` under `## Unreleased`, `### Docs`: one line, the docs site's analytics SDK `posthog-js` goes from 1.438.13 to the new version.
- Proof without sending an event: `pnpm --filter shadcn-table-docs build` in the worktree, then `grep -rl '<new version>' apps/shadcn-table-docs/.next/static | head -1` prints a file and `grep -rl '1\.438\.13' apps/shadcn-table-docs/.next/static | head -1` prints nothing (posthog-js carries its version as text). The built app is not started with the key and no request is sent to PostHog from this machine.
- Does NOT run the Storybook tests, the docs E2E suite or the installation E2E (the owner's word, D159: nothing but the SDK changes); does NOT touch `packages/shadcn-table/**`, the root `package.json` or any other dependency.

#### 1.6.3 Shipping (D159, D153, D154, D155, P1, P4)

- Precondition: `claude/review` contains `origin/master`; the tracker `76-posthog-sdk-update` says `Status: done`; `git log --oneline origin/master..origin/claude/review -- . ':!.ai'` lists only the commits and the merge of this spec's first milestone; `origin/v0.9/filter-input-fixes` and `origin/v0.9/click-to-copy-tooltip-refocus` are not ancestors of `claude/review`; no PR is open (`gh pr list --state open`).
- The fast-forward of `dev` to the head of `claude/review`, pushed (a plain push of that head to `refs/heads/dev`), never in the root checkout (P2). One push: the PR is created only after it.
- `gh pr create --base master --head dev --title "chore(docs): posthog-js <new version>" --label release:skip --label ci:skip --body-file <body>`, the body per `.github/pull_request_template.md`: the SDK update, the result line of the release notes read and of the setup recheck, and one line that the test jobs are skipped by the owner's word (D159, D153).
- The first run: Head prints `skip=true (label ci:skip)`, the 16 matrix legs succeed with no step run, Validate PR says `No release (release:skip)`. After it ends, `gh pr view <N> --json mergeStateStatus --jq .mergeStateStatus` prints `CLEAN` with one push and no rerun (D155, proven on PR 146); then `gh pr merge <N> --auto --merge`. Not `CLEAN`: the per-context table of spec 72, 1.6.2 for the head, the cause in the tracker, a fix milestone of this spec (`plan/new_fix.py`), reproduced under `act` where `act` can show it (P3); no rerun, no empty commit, no merge past the checks.
- `release.yml` on the `master` push: Check Release says `none`; the warning that `## Unreleased` holds blocks is expected.
- Vercel builds `master`. The live reads, in a browser against `https://www.shadcn-table.com/`, each as one line in the tracker with what was read and pass or fail, the browser closed after:
  - after the first interaction on `/`, a request under `/ingest/` (`e/`, `batch/` or `flags/`) answers 200;
  - the SDK version of that request is the new version: read from the request's `ver` query parameter, else from `$lib_version` in the decoded request body, else from the text of the loaded posthog chunk; the tracker says which source was read;
  - a client route change (the header link to an example) sends a `$pageview`, seen as a further 200 under `/ingest/`;
  - one custom event of `lib/analytics.ts` (the base switcher, `base_switched`) sends a further 200 under `/ingest/`;
  - the static assets posthog-js loads after init answer 200 under `/ingest/static/`; a 404 there is a fail (the rewrite, 1.6.1);
  - no error naming posthog in the console.
- A session recording request (`/ingest/s/`) within one minute of the interaction is recorded as seen or not seen; not seen is not a fail (it follows the PostHog project setting and its sampling, D67) and goes into the DONE line.
- Then `claude/review` and `dev` up to `master` (P4): `git merge --ff-only origin/master` when nothing sits past `master`, else `git merge origin/master -m "merge: master 0.9.7"`; push both.
- The DONE line to the lead names the new version read live and from which source, the recheck result (every point matches, or the points that differ), and that PostHog's SDK Health page is the owner's to read: the run has no PostHog login.
- Does NOT bump a version, tag, or create a GitHub release; does NOT move a `CHANGELOG.md` block; does NOT change a workflow file, the ruleset or the `release` environment (P7); does NOT change a PostHog project setting or snooze the warning; does NOT merge `v0.9/filter-input-fixes` or `v0.9/click-to-copy-tooltip-refocus`; does NOT move the owner's worktrees `wt1` and `wt2`; does NOT deploy with the Vercel CLI.

**Stays unchanged:** `apps/shadcn-table-docs/lib/posthog-options.ts`, `lib/posthog-client.ts`, `components/posthog-provider.tsx`, `lib/analytics.ts`, `next.config.mjs` (unless 1.6.1 requires a change), `packages/shadcn-table/**`, `packages/shadcn-table/package.json` (version 0.9.7), every other dependency.

### 1.7 Dependencies and env

- `posthog-js` latest `1.x`, added by the first milestone with one `pnpm --filter shadcn-table-docs add` (P6); no new package.
- `gh` authenticated as the owner (the runner's login); a browser for the live reads; network access to `posthog.com` and `github.com` for the guides and the release notes.
- `NEXT_PUBLIC_POSTHOG_KEY` is not needed locally: the local proof reads the build output, the live site has the key in its Vercel env.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: PostHog SDK update

- Files owned: `apps/shadcn-table-docs/package.json`, `pnpm-lock.yaml`, `CONTRIBUTING.md`, `CHANGELOG.md`
- Depends on: none
- Review: none
- Local CI: `pnpm install --frozen-lockfile`, `pnpm --filter shadcn-table-docs types:check`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm --filter shadcn-table-docs build`, one at a time (P5)
- Task 1: The release notes read and the setup recheck (1.6.1). Checks: the tracker holds the range read (`1.438.13` to the new version) with one line per entry that touches the docs app, or the line that none does; one `matches` or `differs` line for each of the eight recheck points; `git diff --stat origin/claude/review -- apps/shadcn-table-docs/lib apps/shadcn-table-docs/components apps/shadcn-table-docs/next.config.mjs` prints nothing, or the tracker names the file and the reason
- Task 2: The bump, the `CONTRIBUTING.md` sentence and the changelog block (1.6.2). Checks: `npm view posthog-js version` printed a `1.` version, in the tracker; `grep -c '"posthog-js": "\^1\.438\.13"' apps/shadcn-table-docs/package.json` prints `0`; `pnpm install --frozen-lockfile` exits 0; `pnpm why posthog-js --filter shadcn-table-docs` names one version, the new one; the lockfile diff holds only `posthog-js` and `@posthog/*` blocks; `grep -c 'lib/posthog-client.ts' CONTRIBUTING.md` prints `1` or more; `grep -c '^#### Spec 76' CHANGELOG.md` prints `1`; `pnpm --filter shadcn-table-docs types:check`, `pnpm test lint` and `pnpm test validate-repo` green
- Task 3: The docs build and the version text (1.6.2). Checks: `pnpm --filter shadcn-table-docs build` exits 0; `grep -rl '<new version>' apps/shadcn-table-docs/.next/static | head -1` prints a file; `grep -rl '1\.438\.13' apps/shadcn-table-docs/.next/static | head -1` prints nothing; no dev or start server left running, the worktree clean after the commit

### Milestone: Ship the PostHog SDK update

- Files owned: none
- Depends on: PostHog SDK update
- Review: none
- Local CI: none (the PR's run is the proof; a red is reproduced under `act`, P3)
- Task 1: The precondition and the fast-forward of `dev` (1.6.3). Checks: `git merge-base --is-ancestor origin/master origin/claude/review` exits 0; the tracker `76-posthog-sdk-update` says `Status: done`; `git merge-base --is-ancestor origin/v0.9/filter-input-fixes origin/claude/review` exits 1; `gh pr list --state open --json number --jq length` prints `0`; `git rev-parse origin/dev` equals the head of `claude/review`
- Task 2: The PR with both labels, its first run, the `CLEAN` read, auto-merge and the merge (1.6.3). Checks: `gh pr view <N> --json labels --jq '[.labels[].name] | sort'` prints `["ci:skip","release:skip"]`; the Head log holds `skip=true`; `gh pr view <N> --json mergeStateStatus --jq .mergeStateStatus` prints `CLEAN` after the first run, with one push and no rerun; `gh run view <id> --json jobs --jq '[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length'` prints `0`; `gh pr view <N> --json state --jq .state` prints `MERGED`
- Task 3: After the merge (1.6.3): `release.yml` says `none`, the live reads, the branches up to `master`. Checks: `git ls-remote --tags origin v0.9.8` prints nothing; `curl -fsS https://www.shadcn-table.com/version.txt` and `curl -fsS https://storybook.shadcn-table.com/version.txt` print `0.9.7`; one line per live read in the tracker with the text read and pass or fail, the version line with its source, the recording line as seen or not seen, the browser closed; `git rev-parse origin/claude/review origin/dev origin/master` prints one sha three times

### 2.2 Checks

- PostHog SDK update: the release notes and recheck lines in the tracker, the lockfile diff limited to the PostHog packages, types, lint, validate-repo and the docs build green, the new version text in `.next/static`
- Ship the PostHog SDK update: the PR run with no test step, the first-run `CLEAN` read, the merge, no tag, the live reads with the new version
- Review: none (one dependency version in the docs app, one doc sentence; no library file, no public API, no shared state)
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used for a checkout, an install or a build (P2)
