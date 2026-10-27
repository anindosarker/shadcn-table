# 02: docs weight, tracker

Decisions and deviations only. Branch `v0.4/02`, commit `619faab`. Reviewer verdict pass with one minor finding, gate agent green with the two size thresholds recorded as owner items.

## Decisions

- `codeblock.className` is `rounded-none border-0` without the former `my-0`: `DynamicCodeBlock`'s `DefaultPre` already applies `my-0`, so the rendered classes are unchanged.
- The Suspense fallback is `DynamicCodeBlock`'s built-in placeholder (default `wrapInSuspense`), a `pre` and `code` of the raw source in the same chrome; no custom fallback.
- No `key` on `DynamicCodeBlock`: `useShikiDynamic` keeps the previous highlighted node for the milliseconds the next file takes once the grammar is loaded, the existing page check waits cover that, and a key would flash the placeholder on every file click.
- The code-element wait went into `baseSwitch`'s `source()` only, because 1.6.3 names the assertion on the Base UI variant's imports; `codeToggle` already waits for `pre`.
- No `CHANGELOG.md` entry on this branch: part 01 seeds the file. The lead adds the line for `619faab` when 01 is merged.
- `next start` was run as `NEXT_DIST_DIR=.next next start -p <port>`, because `next.config.mjs` maps any port other than 5320 to `.next-<port>`.

## Deviations

- Size thresholds not met. Measured after the build: `.next/server/app/docs` 56 MB (threshold 15 MB, was 131 MB); `guides/editing.html` 720546 bytes plus `editing.rsc` 328872 bytes, 1.05 MB together (threshold 400 KB, was 4.7 MB). The remaining weight of `editing.rsc` (329 KB) is raw sources 132 KB (the Base UI variant repeats every file without a `ui` import), a 2881-byte icon SVG repeated 12 times by the MDX code blocks (35 KB), agent prompts 12 KB and 151 KB of prop tables and route tree; `editing.html` is 362 KB of inline RSC plus 358 KB of rendered markup, and Next stores each page payload three times. 1.6 as written cannot reach the 1.2 numbers. Owner decision pending: accept the measured numbers, or scope a follow-up (send files without a `ui` import once instead of per base, drop the per-block icon, trim the prop-table payload). The commit is merged because both outcomes keep it.
- The final phase produced no commit: the import removals had to land with phase 1, since that refactor is what made them dead and a commit with dead imports fails lint. `ReactNode` stays in `code-explorer.tsx` because `renderNodes` returns it.
- `pnpm format` reformats 58 committed installed copies under `apps/docs/components/ui/**`, `components/ui-base/**` and `lib/utils.ts` that are outside this part. Those changes were reverted before staging. The repo should either ignore those paths or format them in their own commit.
- `check-pages.mjs a` failed once on `/docs/api/row-instance-apis` ("Failed to load resource: 404") while vitest ran concurrently; it did not reproduce on reruns of the route or of the full cluster (269 passed, 0 failed).
- The Playwright gate script lives in the session scratchpad, not in the repo; the part file does not ask for a committed script.
- Reviewer minor finding, left open: after a base switch the explorer is not remounted, so `source()` relies on the fixed 200 ms wait; keying the explorer by base or polling for a marker would be stricter. No gate is red.

## Gate numbers

- `check-pages.mjs a`: 269 passed, 0 failed. `check-pages.mjs e`: 592 passed, 0 failed.
- Playwright explorer gate on `/docs/guides/editing`, both bases: 22 passed, 0 failed; 280 highlighted token spans per base; copy writes the raw source byte-equal (2027 bytes).
