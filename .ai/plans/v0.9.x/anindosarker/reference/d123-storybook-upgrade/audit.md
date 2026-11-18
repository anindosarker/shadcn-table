# D123 Storybook upgrade: audit

Target: `storybook` 10.6.7 (`npm view storybook version` on 2026-11-18; dist-tag `latest` 10.6.7, `next` 11.0.0-beta.3, not a target). Installed before: 10.6.2.

Sources: the Storybook `CHANGELOG.md` sections 10.6.3 to 10.6.7 and `MIGRATION.md` (main branch, read 2026-11-18). The changelog lists for 10.6.3: Addon Vitest supports Vitest 5 (#36671), Next.js app-router mock fixes (#36588, #36732), `ArgsStore#get` return type (#36583); 10.6.4: TypeScript loader hook skipped under Jest (#36790); 10.6.5: dunderscore folders excluded from production compilation (#36740); 10.6.6: StackBlitz embed of the dev server (#37176), telemetry for VRT packages (#37124); 10.6.7: prerelease community frameworks in init (#37203), MCP composition schema of a hosted Storybook (#37290). `MIGRATION.md` has no section after "From version 10.5.x to 10.6.0": nothing to migrate between 10.6.2 and 10.6.7, and no automigration exists for these versions.

## Packages

| Package | Before | Target | Source | Change needed |
|---|---|---|---|---|
| `storybook` | ^10.6.2 (10.6.2) | ^10.6.7 | CHANGELOG 10.6.3 to 10.6.7 | yes: the version only |
| `@storybook/react-vite` | ^10.6.2 | ^10.6.7 | CHANGELOG 10.6.3 to 10.6.7; still `@joshwooding/vite-plugin-react-docgen-typescript` ^0.7.0 (issue 37409) | yes: the version only |
| `@storybook/addon-a11y` | ^10.6.2 | ^10.6.7 | CHANGELOG, no entry for the addon | yes: the version only |
| `@storybook/addon-docs` | ^10.6.2 | ^10.6.7 | CHANGELOG, no entry for the addon | yes: the version only |
| `@storybook/addon-links` | ^10.6.2 | ^10.6.7 | CHANGELOG, no entry for the addon | yes: the version only |
| `@storybook/addon-mcp` | ^10.6.2 | ^10.6.7 | CHANGELOG 10.6.7 #37290; `npm view @storybook/addon-mcp@10.6.7 peerDependencies`: `storybook ^10.6.7`, `@storybook/addon-vitest ^10.6.7` | yes: the version only; its peer range is why addon-vitest must move with it |
| `@storybook/addon-vitest` | 10.6.2 (exact) | 10.6.7 (exact, stays pinned, 1.6.4) | CHANGELOG 10.6.3 #36671 (Vitest 5 support; we stay on vitest 4.1.12) | yes: the version only |
| `@storybook/icons` | ^2.2.0 | 2.2.0 is the latest; not on the Storybook version line | `npm view @storybook/icons version` | no |
| `storybook-dark-mode` | ^5.0.0 | 5.0.0 is the latest | `npm view storybook-dark-mode peerDependencies`: `storybook ^10.0.0`, accepts 10.6.7 | no |
| `@storybook/react` (docs app, `v0.9/docs-layout` only, exact pin) | 10.6.2 | 10.6.7 exact | CHANGELOG, no entry touching `composeStories` | yes: in the "Docs branch catch-up" milestone, not here |
| `storybook` (docs app, `v0.9/docs-layout` only, exact pin) | 10.6.2 | 10.6.7 exact | CHANGELOG, no entry touching `storybook/internal/csf-tools` | yes: in the "Docs branch catch-up" milestone, not here |

Every installed `@storybook/*` package has a 10.6.7 release; `@storybook/icons` has its own version line (latest 2.2.0).

## Config files and setup

| Item | What the target says | Change needed |
|---|---|---|
| `.storybook/main.ts` (stories globs, addons by `getAbsolutePath`, `managerHead`/`previewHead`, `viteFinal` cache dir per base, `features.componentsManifest`, `react-docgen-typescript`) | No changelog entry or MIGRATION.md section after 10.6.0 touches these options; #36740 only excludes `__`-prefixed folders from production compilation, we have none under `stories/` or `.storybook/` | no |
| `.storybook/manager.ts` (`addons.setConfig`, theme, `selectedPanel`) | No entry for `storybook/manager-api` | no |
| `.storybook/preview.tsx` (decorators, `DARK_MODE_EVENT_NAME`, `storybook/preview-api`) | No entry for preview annotations; #36583 types `ArgsStore#get`, which we do not call | no |
| `.storybook/themes.ts` (`storybook/theming`) | No entry for theming | no |
| `.storybook/base-tool.ts` (`storybook/internal/components` Select, `types.TOOL`) | No entry for the internal components or the toolbar API | no |
| `.storybook/vitest.setup.ts` (`setProjectAnnotations`, a11y annotations, vitest browser commands) | #36671 adds Vitest 5 support and keeps Vitest 4; no setup change listed | no |
| `.storybook/preview.css` | Not Storybook API | no |
| `vitest.config.ts` browser project (`storybookTest` plugin, playwright provider, per-base cache dir) | #36671 only; plugin options unchanged | no |
| Three-base scripts (`storybook:<base>` with `ST_BASE` and ports 6007/6006/6008, `storybook:build:<base>` with `-o storybook-static/<base>`) | No CLI flag change listed for `dev` or `build` | no |
| `storybook/test` imports in the stories (81 story files) | No entry for `storybook/test` | no |
| `@storybook/addon-mcp` with `features.componentsManifest` | 10.6.7 #37290 changes the composition schema a hosted Storybook publishes; no config change | no |
| Docs app `composeStories` (`components/story-variant.tsx`) and `loadCsf` from `storybook/internal/csf-tools` (`lib/story-pages.mjs`), `storybook/test` aliased to `lib/storybook-test-stub.ts` (`next.config.mjs`), all on `v0.9/docs-layout` | No entry for portable stories or csf-tools | no (the pins move in the catch-up) |
| Deployed builds: `vercel.json` service `storybook` (root `packages/shadcn-table`, framework `storybook`, `buildCommand` `pnpm storybook:build`, `outputDirectory` `storybook-static`), the `storybook:build` script with its three outputs and `version.txt`, turbo outputs `storybook-static/<base>/**`, the release poll of `/version.txt` | No build output layout change listed | no |

## Known issues

| Issue | Does 10.6.7 fix it | What we do | Change needed |
|---|---|---|---|
| `glob` advisory GHSA-3g3m-2fjr-6pw4 (medium: AbortSignal cancellation bypass, `glob` >=9.0.0 <=14.0.1, fixed 14.0.2), Storybook issue 37409 (open): `@storybook/react-vite` 10.6.7 still depends on `@joshwooding/vite-plugin-react-docgen-typescript` ^0.7.0, which pulls `glob` 13.0.6; the plugin's 0.9.1 uses `tinyglobby` instead | no | Before: `pnpm why glob` shows `@storybook/react-vite 10.6.2 > @joshwooding/vite-plugin-react-docgen-typescript 0.7.0 > glob 13.0.6`. After: see "glob after the upgrade" below. No override: the overrides live in the root `package.json`, which this milestone does not own, the path is a dev-only build tool that ships in no registry item or npm package, and forcing a plugin minor outside its declared range on Storybook's docgen is the kind of workaround the upstream fix replaces; tracked under Attention | no |
| `storybook-dark-mode` 5.0.0 peer range | yes, already: peer `storybook ^10.0.0` accepts 10.6.7 | One Storybook version installed after the upgrade (`pnpm ls storybook -r`), the toggle checked in the shell captures before and after | no |

## glob after the upgrade

`pnpm why glob -r` at `3f35b7a4` (after the install):

```
shadcn-table@0.9.4 packages/shadcn-table (PRIVATE)
devDependencies:
@storybook/react-vite 10.6.7
└─┬ @joshwooding/vite-plugin-react-docgen-typescript 0.7.0
  └── glob 13.0.6
```

Unchanged by the upgrade, as issue 37409 says: `glob` 13.0.6 stays, only through Storybook's docgen plugin, in the package's dev dependencies. No override (see Known issues).
