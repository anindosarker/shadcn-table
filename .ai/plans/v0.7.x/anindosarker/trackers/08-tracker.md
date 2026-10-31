# 08: docs install UI, tracker

Status: running
Branch `v0.7/docs-install`, worktree docs-install, PR #71
S5: branch `v0.7/docs-install-2`, worktree docs-install-2, PR #75
Gates:
- S4:
- `pnpm --filter shadcn-table-docs types:check` and `eslint --max-warnings 0` on the milestone files at 970cf469: green
- `node scripts/example-map.mjs` twice, `git status` clean at 970cf469: green
- `pnpm --filter shadcn-table-docs build` at 8d8ef490: green
- `check-pages.mjs a --base base|radix|aria` (next start, port 5341) at 8d8ef490: green (295 each)
- `pnpm --filter shadcn-table-docs types:check`, `lint` (0 errors, 9 existing example warnings) at 0ed09813: green
- `pnpm --filter shadcn-table-docs build` at 0ed09813: green
- `check-pages.mjs a` and `c`, `--base base|radix|aria` (next start, port 5341) at 0ed09813: green (a 295, c 285 each)
- 2.2 S4 greps (`supportedLocales|shadcn-table-locale-de.json   #`, `@st/|@st\b`) at 0ed09813: empty
- `pnpm check:bases`, `pnpm test:base` at 0ed09813: green
- agent-browser on dev server 5342 at 0ed09813: step 1 (de command, French gives `-locale-fr.json` and `ST_Localization_FR`, npm gives `npx shadcn@latest`), step 2 (es toolbar to React Aria: header React Aria, install tab React Aria with `/r/aria/`, 53 `[data-rac]`), step 3 (basic toolbar to Radix UI: header Radix UI, code view, prompt `/r/radix/example-basic.json`, full screen menu on top): pass; step 4 console: zero on Base UI and Radix UI, React Aria dev warnings (see Attention)
- Review fix: `apps/shadcn-table-docs/tsconfig.json` reverted to c9b32366; `pnpm --filter shadcn-table-docs types:check` at 7421a1e5: green, file unchanged after the run
- S4 verifier (at 92a558a3; reused types:check at 7421a1e5 and test:base, check:bases at 0ed09813 since the diff is `tsconfig.json` back to c9b32366 plus the tracker; rerun the rest because 0ed09813..HEAD touches `tsconfig.json`):
- `pnpm --filter shadcn-table-docs lint` at 92a558a3, verifier: green (0 errors, 9 existing example warnings)
- `pnpm --filter shadcn-table-docs build` at 92a558a3, verifier: green, `git status` clean after
- `check-pages.mjs a` and `c`, `--base base|radix|aria`, six runs concurrent against one `next start` (port 5341, `NEXT_DIST_DIR=.next`) at 92a558a3, verifier: green (a 295, c 285 each)
- 2.2 S4 greps (`supportedLocales|shadcn-table-locale-de.json   #`, `@st/|@st\b`) at 92a558a3, verifier: empty
- Acceptance (1.2) at 92a558a3, verifier: build exit 0, `check-pages.mjs` exit 0 for all three bases, every example page (40 of 41 under `content/docs/examples`, the index lists examples only) renders the header and toolbar Base select; install page has 0 of `shadcn-table-tabler.json`, `@shadcn-table/`, "Created with shadcn create" (S5 scope, 1.6.5 and 1.6.6): S4 part pass, full Acceptance pending S5
- S5:
- `pnpm --filter shadcn-table-docs types:check`, `eslint --max-warnings 0` on the milestone 4 files at 2ec2c084: green
- `pnpm --filter shadcn-table-docs lint` at 2ec2c084: green (0 errors, 9 existing example warnings)
- `pnpm --filter shadcn-table-docs build` at 2ec2c084: green, `git status` clean after
- `pnpm --filter shadcn-table-docs types:check` at 2ec2c084: green
- `check-pages.mjs a` and `b`, `--base base|radix|aria`, six runs concurrent against one `next start` (port 5341, `NEXT_DIST_DIR=.next`) at 2ec2c084: green (a 302, b 268 each)
- Local rewrite check, `curl localhost:5341/r/<base>-nova/shadcn-table.json` diffed with `public/r/<base>/shadcn-table.json`, base, radix, aria at 2ec2c084: identical (also `-sera/shadcn-table-tabler.json` at the pre-commit build)
- 2.2 S5 grep `NamespaceCommand` at 2ec2c084: empty
- `pnpm test:base` at 2ec2c084: green
- agent-browser on `next start` 5341 (pre-commit build, same code, prose differs): install page Icon library to Tabler gives `/r/base/shadcn-table-tabler.json` in both commands (update with `--overwrite`); Short form on shows the `registries` entry and `add @shadcn-table/shadcn-table-tabler`; create section renders; console and page errors zero: pass. Capture `/private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table-shadcn-react-table/e001baee-c356-4fbd-b566-06e1457b6659/scratchpad/s5-install-short.png`
- Acceptance (1.2) at 2ec2c084: build exit 0, `check-pages.mjs` exit 0 for all three bases (a, b; c, d, e untouched since the S4 verifier), install page server HTML holds `shadcn-table-tabler.json`, `@shadcn-table/` and "Created with shadcn create"; example toolbar Base select unchanged since S4: pass for milestone 4, milestone 5 pending
- Review fix (`useIconLibrary` reads the provider only): `pnpm --filter shadcn-table-docs types:check` at 0a54ba13: green
- `pnpm --filter shadcn-table-docs lint` at 0a54ba13: green (0 errors, 9 existing example warnings)
- `pnpm --filter shadcn-table-docs build` at 0a54ba13: green, `git status` clean after
- `check-pages.mjs a` and `b`, `--base base|radix|aria`, six runs concurrent against one `next start` (port 5341, `NEXT_DIST_DIR=.next`) at 0a54ba13: green (a 302, b 268 each)
- S5 verifier (HEAD 38c6b5f7; `0a54ba13..HEAD` touches only the tracker, so types:check, lint, build and `check-pages.mjs a`, `b` at 0a54ba13 are reused, builder; `pnpm test:base` at 2ec2c084 reused, `0a54ba13` is docs-only; the build artifact under `.next` is the builder's 0a54ba13 build, tree clean):
- 2.2 S5 grep `NamespaceCommand` at 38c6b5f7, verifier: empty
- Local rewrite check, `next start` (port 5343, `NEXT_DIST_DIR=.next`), `curl /r/<base>-nova/shadcn-table.json` diffed with `public/r/<base>/shadcn-table.json`, base, radix, aria at 38c6b5f7, verifier: identical
- `check-pages.mjs` all clusters (a to e), `--base base|radix|aria`, three runs concurrent, one `next start` each (ports 5343, 5344, 5345, `NEXT_DIST_DIR=.next`) at 38c6b5f7, verifier: green (1686 passed, 0 failed each)
- agent-browser on `next start` 5345 at 38c6b5f7 (covers the 0a54ba13 review fix in `icon-library-selector.tsx`), verifier: Icon library to Tabler gives `/r/base/shadcn-table-tabler.json` in the add and the `--overwrite` update commands; Short form on shows the `registries` entry with `@shadcn-table` and `add @shadcn-table/shadcn-table-tabler`; "Created with shadcn create" renders; console and page errors zero: pass. Capture `/private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table-shadcn-react-table/e001baee-c356-4fbd-b566-06e1457b6659/scratchpad/v08/install-aria.png`
- Acceptance (1.2) at 38c6b5f7, verifier: build exit 0 (0a54ba13, builder), `check-pages.mjs` exit 0 for all three bases (all clusters, above); install page server HTML holds `shadcn-table-tabler.json` (2), `@shadcn-table/` (2), "Created with shadcn create" (4); all 40 example pages under `content/docs/examples` (index excluded) serve the header and toolbar Base select (2 or more `aria-label="Base"` each): pass. The headless example clause (1.6.7, milestone 5) is not applicable in this run, pending S2

## Attention

- Review nit on `install-command.tsx:187` (the `edition` branch duplicates the fallthrough) declined: spec 08 line 180 has the default `InstallCommand` render `editionAddCommand`, and dropping the branch leaves that exported helper with no caller. Owner: accept, or amend the spec and drop one path.
- Spec 08 Acceptance is only reachable after S5 (install page strings `shadcn-table-tabler.json`, `@shadcn-table/`, "Created with shadcn create" are 1.6.5 and 1.6.6). The S4 verifier records the S4 part green and the full Acceptance as pending S5; PR #71 is marked ready on the S4 gates.
- No harness `Claude-Session:` reminder reached the S4 verifier either; its commit and the PR #71 body keep `https://claude.ai/code/session_015VBrypUJXYCcQD6zrN4yeT`.
- A dev server on a port other than 5320 (here 5342, distDir `.next-5342`) rewrites `apps/shadcn-table-docs/tsconfig.json` (expanded arrays, `.next-<port>` includes); 0ed09813 committed that rewrite, reverted in 7421a1e5. `.prettierignore` lists `*.json`, so `pnpm format` cannot catch it. Owner: pin `typescript.tsconfigPath` in `next.config.mjs` or make a gate diff the file.
- Commits 970cf469, 8d8ef490, 0ed09813 and 37e0cbd4 lack the `Claude-Session:` trailer (pushed, no force-push per P1). No harness reminder reached the fixer subagent, so later commits and the PR #71 body carry `https://claude.ai/code/session_015VBrypUJXYCcQD6zrN4yeT`, the line on c9b32366 and 5c5964f6; replace if the run's session differs.
- PR #71 Release impact CHANGELOG box left unticked (it applies to `release:patch|minor|major` only); the Changes section now states the Spec 08 lines are present under `release:skip`.
- Dev console on React Aria shows `<Focusable> child must have an interactive ARIA role.` and a missing aria-label warning from the rendered library, with the header select alone too (existing, not from S4); prod `check-pages` reports no console errors. Owner: library side (S1 or S2) or accept.
- No harness `Claude-Session:` reminder reached the S5 verifier; its commit has no `Claude-Session:` trailer and the PR #75 body no session line (the S5 builder commits carry none either). Owner: add the run's session line if one applies.
- Milestone 5 pending S2: useST_FullScreenContainer not on claude/review yet. The `### Spec 08` Docs line for S5 omits "the headless example documents the spacer column and the full-screen container hook"; the main session adds that clause with milestone 5.
- S5 page checks for the install page and the Customize Icons guide went into `a.mjs` and `b.mjs`, where those routes already live, not `c.mjs` as 2.1.4 says (c.mjs holds guides from editing onward).
- The `IconLibraryProvider` sits in `app/docs/layout.tsx`, so the pick also carries across client navigation between docs pages (no storage; a reload resets to Lucide). `<InstallCommand overwrite />` in `guides/best-practices.mdx` gets the icon select and Short form too.
- The Short form switch is per command (not shared like the icon pick) and applies to every non-locale `InstallCommand`; `registryAddCommand` (the `shadcn registry add` form) is removed from `lib/install.ts` with `NamespaceCommand`, its last user; `agents.mdx` keeps its static `registry add` block.
- `DocsLocale` gained a fourth field, `example` (the example slug), because the example folders are not `localization-i18n-${code.toLowerCase()}` for `pt-BR`, `sr-Cyrl-RS`, `sr-Latn-RS`; renaming them would rename registry items.
- CHANGELOG Spec 08 has an extra `Docs` line for the `@st` to `@shadcn-table` rename (not a Breaking line: the namespace name is local to a consumer's `components.json`, `@st` keeps working). `packages/shadcn-table/scripts/registry/hosted.mjs:16-17` still names `@st` in a comment (packages/ is out of S4 scope).

- Milestone 01 locale list and selector: done (970cf469)
- Milestone 02 toolbar base select: done (8d8ef490)
- Milestone 03 guide, README, minimums, namespace: done (0ed09813)
- Milestone 04 edition select, Short form, create section, icons guide: done (2ec2c084)
- Milestone 05 headless example: pending S2
- Milestone 06 S5 gates: done for milestone 4 (2ec2c084); verifier gates and Acceptance at 38c6b5f7, headless clause pending S2
