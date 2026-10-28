# v0.5.x, React Aria edition: decisions

Rulings taken 2026-10-28 in chat after the 0.4.x review. The 0.4.x rulings
([../../v0.4.x/anindosarker/decisions.md](../../v0.4.x/anindosarker/decisions.md) and
[decisions-review.md](../../v0.4.x/anindosarker/decisions-review.md)) stay in force; nothing
here re-decides them. Plan index: [v0.5.x-plan.md](v0.5.x-plan.md).

## Third edition

1. shadcn-table ships a React Aria edition next to Radix UI and Base UI, built on shadcn's
   own `aria` component set (ui.shadcn.com/docs/components/aria/*, installed with the same
   `shadcn add <part>` under an aria style). Same library, same public API, the 26 parts
   from shadcn's aria set.
   - Owner, 2026-10-28: "Absolutely not [a 0.5 without it]. shadcn has react aria."
   - Ships as `0.5.0`, released unattended like `0.4.0` (release flow in
     `../../v0.3.x/anindosarker/decisions.md` "Release"; branches `claude/review` to `dev`
     to `master` by pull request).

2. Edition key `aria`, mirroring `base` everywhere: `registry/aria/` (own
   `components.json` with shadcn's aria style, own parts under `components/ui/`, own
   `index.css`, `registry.ts`, `lib/`), `ST_BASE=aria`, registry items `shadcn-table-aria`
   and `shadcn-table-aria-locale-<code>` (whatever the base items are named, with `aria`
   in place of `base`), hosted copies under `/r/aria/`, the `next.config.mjs` rewrite
   `/r/:style(aria-.*)/:name.json`, docs app `components/ui-aria`, example variants
   `examples/.aria`, `pnpm --filter shadcn-table-docs lib:install aria`, Storybook on
   `6008` and the third `pnpm preview` child.

3. Two-tree guard becomes an n-tree guard: `check-bases.mjs` compares every edition against
   radix; `base-diff.json` keeps the Base UI list, `aria-diff.json` holds the React Aria
   list. A shared file is byte-identical in all three trees; the diff lists are the only
   allowed differences.

4. The React Aria diff set is discovered, not assumed: phase 00 of part 01 installs the
   aria parts into `registry/aria`, copies the radix library over, and lists every file
   `tsc` rejects or whose Radix part has a different React Aria shape (`DropdownMenuTrigger`
   wrapping the menu, `TooltipTrigger` wrapping the tooltip, `DialogTrigger` plus `Modal`,
   `onPress` events, `isSelected` on checkboxes, render props). That list seeds
   `aria-diff.json`; the tracker records it before any port.

5. Markup, class names and the `data-slot` contract stay those of the radix tree wherever
   React Aria allows it, so the stories and page checks run unchanged with `ST_BASE=aria`.
   A story that cannot pass on aria is a halt item, as in part 02 of 0.4.x.

6. The docs app's edition switch (`components/base-selector.tsx`, tab group `base`) becomes
   three-way with the label "React Aria"; the install page, `SKILL.md` and the registry
   README list the three editions; `check-pages` runs per edition where it already runs
   per base.

## Release flow

7. Releases follow the TanStack shape without external apps (ruled 2026-10-28 after the
   0.5.0 release cost six workflow runs): `pr.yml` on `pull_request` runs every check;
   `release.yml` on `push` to `master` either opens or rewrites the version PR
   (`chore: version <v>` from `release/next`, when `## Unreleased` has lines) or, when the
   version PR was merged, tags, waits for production, smokes, installs, creates the GitHub
   release and comments "Released in v<v>" on the PRs it shipped.
   - Level per PR by label (`release:patch`, `release:minor`, `release:major`,
     `release:skip`), the changelog headings as the default (`Breaking`, `Added`, `Changed`
     minor while 0.x; `Fixed`, `Docs` patch); the version is computed, never typed; the
     version PR can be edited before merging as the last override.
   - Owner decides when to release by merging the version PR; several merges accumulate in it.
   - Work branches and `claude/review` go to `master` by PR; `dev` retired;
     `scripts/release.mjs` retired. Supersedes the v0.3.x "Release" ruling and the
     2026-10-28 `claude/review` to `dev` to `master` flow.
