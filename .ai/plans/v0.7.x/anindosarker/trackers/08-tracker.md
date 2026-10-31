# 08: docs install UI, tracker

Status: running
Branch `v0.7/docs-install`, worktree docs-install, PR #71
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

## Attention

- Dev console on React Aria shows `<Focusable> child must have an interactive ARIA role.` and a missing aria-label warning from the rendered library, with the header select alone too (existing, not from S4); prod `check-pages` reports no console errors. Owner: library side (S1 or S2) or accept.
- `DocsLocale` gained a fourth field, `example` (the example slug), because the example folders are not `localization-i18n-${code.toLowerCase()}` for `pt-BR`, `sr-Cyrl-RS`, `sr-Latn-RS`; renaming them would rename registry items.
- CHANGELOG Spec 08 has an extra `Docs` line for the `@st` to `@shadcn-table` rename (not a Breaking line: the namespace name is local to a consumer's `components.json`, `@st` keeps working). `packages/shadcn-table/scripts/registry/hosted.mjs:16-17` still names `@st` in a comment (packages/ is out of S4 scope).

- Milestone 01 locale list and selector: done (970cf469)
- Milestone 02 toolbar base select: done (8d8ef490)
- Milestone 03 guide, README, minimums, namespace: done (0ed09813)
