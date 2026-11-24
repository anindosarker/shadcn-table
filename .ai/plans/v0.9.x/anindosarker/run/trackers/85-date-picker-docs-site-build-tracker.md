# 85: Date picker docs site build, tracker

Status: running
Branch `date-picker-docs-site`, worktree shadcn-date-picker.worktrees/date-picker-docs-site (from origin/main 2cf6e6f)
Checks:
- Check: frozen install, `pnpm install --frozen-lockfile` after the one `pnpm install` that wrote the lockfile, at be986a7: pass (exit 0)
- Check: root lint, `pnpm lint` (eslint and prettier --check) with docs/ in place, at be986a7: pass (exit 0)
- Check: root typecheck, `pnpm typecheck` at be986a7: pass (exit 0)
- Check: registry, `pnpm registry:check` at be986a7: pass (exit 0, three registry.json up to date, 22 files each)
- Check: tests, `pnpm test` at be986a7: pass (exit 0, 7 files and 39 tests on each of base, radix, aria)
- Check: docs types, `pnpm --filter docs types:check` at be986a7: pass (exit 0; registry/base 36, radix 36, aria 37 files; 0 demos)
- Check: docs lint, `pnpm --filter docs lint` at be986a7: pass (exit 0, 0 errors, 1 warning: `@next/next/no-css-tags` on the static `<link>` of style-nova.css in app/layout.tsx, plan 4.3)
- Check: taken as is, `diff` of each file against `apps/shadcn-table-docs` at 38e51f9, at be986a7: pass, 43 of 43 empty (25 rows of plan 1.1; from 1.2 the ten ui-radix parts, styles/style-nova.css, v12.css, v4.css, v5.css, v7.css, v4/font.ts, v2/github-icon.tsx, postcss.config.mjs)
- Check: taken trimmed, `diff` against the table file at 38e51f9, at be986a7: 36 files (29 rows of 1.1, seven of 1.2), deleted and added lines: app/(home)/page.tsx -4 +0; app/docs/[[...slug]]/page.tsx -31 +1; app/docs/layout.tsx -8 +4; app/global.css -139 +5; app/layout.tsx -24 +8; app/version.txt/route.ts -3 +1; components/base-selector.tsx -37 +6; components/code-explorer.tsx -8 +2; components/dev-home/shared/install-command.tsx -13 +1; components/example-playground.tsx -373 +11; components/example-skeleton.tsx -19 +0; components/example-variant.tsx -3 +3; components/logo.tsx -3 +3; components/mdx.tsx -46 +3; components/mdx/example-snippet.tsx -26 +17; components/mdx/install-command.tsx -166 +4; components/mdx/storybook-link.tsx -27 +6; components/not-found-page.tsx -3 +1; components/section-tabs.tsx -6 +8; components/site-nav.tsx -20 +3; components/theme-controls.tsx -11 +0; lib/base-tabs.mjs -3 +3; lib/example-source.ts -35 +13; lib/example-variant-dir.mjs -2 +2; lib/example-variants.mjs -72 +60; lib/install.ts -116 +9; lib/layout.shared.tsx -18 +16; lib/shared.ts -42 +8; lib/source.ts -61 +4; components/dev-home/v12/home-page.tsx -131 +22; components/dev-home/v12/nav.tsx -28 +9; components/dev-home/v4/nav.tsx -8 +1; next.config.mjs -130 +3; tsconfig.json -19 +6; eslint.config.mjs -22 +3; .gitignore -29 +7. Added lines are the listed replacements and import paths, plus: the lines that close a removed wrapper (app/layout.tsx TooltipProvider, app/docs/layout.tsx DocsLayout), comments whose old text named a removed part (global.css @source note, storybook-link, example-variants header, example-source, example-snippet, install-command, base-selector, shared.ts, next.config.mjs headers note, v12/nav), and the replacement bodies the plan names (5.2, 5.4, 6.2, 6.4)
- Check: unchanged trees, `git diff --stat origin/main -- registry stories .storybook tools/bases.mjs tools/registry-build.mjs` at be986a7: pass (prints nothing)
- Check: removed features, `grep -rniE 'posthog|discord|agent-bar|json-ld' docs --include='*.ts' --include='*.tsx'` (node_modules, .next, registry copies, .source excluded) at be986a7: pass (prints nothing)
- Check: base lists, `node lib/registry-trees.mjs` with a copy of lib/bases.mjs lacking aria, at be986a7: pass (exit 1, both lists in the message; file restored)
- Check: import side effects, `node -e "import('./lib/example-variants.mjs')"` in docs/, at be986a7: pass (no file written)
- Check: theme.css, the jiti command of plan 4.3 in apps/shadcn-table-docs at 38e51f9: 68 lines, 2,610 bytes, starts `:root[data-design-system] {`; committed as docs/app/theme.css
- Check: pages, `ls docs/content/docs/*.mdx | wc -l` at 0a3b01e: pass (prints 9; plus content/docs/meta.json, the flat list of plan 6.1)
- Check: demo imports, `grep` of each of the seven docs/demos/*.tsx at 0a3b01e: pass (each imports `@/components/date-picker/date-picker` once; none names `registry`)
- Check: ref, `grep -rn 'ref={ref}' docs/` (node_modules, .next excluded) at 0a3b01e: pass (tracked files: only content/docs/install.mdx:53, the Base UI note; two more hits in the git-ignored copies docs/registry/radix/components/ui/calendar.tsx and docs/registry/aria/components/date-picker/components/day-calendar.tsx, byte copies of the same files under picker registry/, not added by the docs)
- Check: docs types, `pnpm --filter docs types:check` at 0a3b01e: pass (exit 0; 7 demos per base)
- Check: docs lint, `pnpm --filter docs lint` at 0a3b01e: pass (exit 0, 0 errors, the same 1 warning of plan 4.3)
- Check: docs build, `pnpm --filter docs build` at 0a3b01e: pass (exit 0; 16 static pages, /docs/[[...slug]] with 9 paths; built HTML of /docs/date and /docs/ranges carries the code view text with `@/components/date-picker/date-picker`, no `registry/base`)

- Task 1 workspace and shell: done (be986a7)
- Task 2 pages and demos: done (0a3b01e)
- Task 3 Storybook under /storybook/, vercel.json, CI, README: planned
- Task 4 local production build read and captures: planned
- Task 5 live reads after the merge: planned

## Notes

- Plan lines added in build task 1 (commits "docs(plan): design plan docs site, build"): tsconfig include `registry` in place of `registry/**` (tsc TS5010); `main` of lib/example-variants.mjs creates `demos/` when missing (no demo exists before task 2); `lib/bases.d.mts` in the docs eslint ignores (eslint-config-next parses `.mts` as JavaScript).
- Dependency exception of plan section 3 kept: `react`, `react-dom`, `lucide-react`, `cn` take the date picker root's ranges.
- Lockfile: the root importer's direct versions are unchanged; the peer suffixes of rolldown-vite and its dependents moved to `@emnapi/*@1.11.0` and gained `yaml@2.9.1`, shared with the docs app's packages.
- Plan line added in build task 2: `demos/*.tsx` in the tsconfig exclude (the hand-written demos import `@/components/date-picker/`, TS2307; their variants are checked), as the table excludes `examples/<base>`.

## Attention
