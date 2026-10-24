# 04: R4, release 0.2.0 (superseded by v0.4.0 part 01, `../../v0.4.0/anindosarker/01-release-automation.md`)

Part of `v0.2-base-ui-plan.md`. Lead runs it after R3 is merged and CI on `claude/review` is
green.

1. Version `0.2.0` in `packages/shadcn-table/package.json` and
   `apps/shadcn-table-docs/package.json`. Commit `chore: version 0.2.0`.
2. PR `claude/review` into `master`, title `v0.2.0: Base UI edition`, body: two trees, item
   names, hosted registry URLs, selector, no change for Radix installs. Merge with a merge
   commit when CI is green.
3. Vercel deploys `master`: verify `https://www.shadcn-table.com/r/radix/shadcn-table.json`
   and `/r/base/shadcn-table.json` return 200 with the right `dependencies`,
   `https://storybook.shadcn-table.com/` and `/base/` load, the docs selector switches an
   example, `/SKILL.md` carries the base rule.
4. Real installs from the public site: `shadcn add https://www.shadcn-table.com/r/<base>/shadcn-table.json`
   in a fresh app per base, tsc and build green; namespace form once.
5. Tag `v0.2.0` on the merge commit, push the tag. Release notes:

   ```markdown
   Base UI edition. Two editions of the table, one per shadcn base, same API.

   ## Install
   Radix:   pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/radix/shadcn-table.json
   Base UI: pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/base/shadcn-table.json
   Namespace: shadcn registry add @st=https://www.shadcn-table.com/r/{style}/{name}.json, then shadcn add @st/shadcn-table
   GitHub addresses still work: anindosarker/shadcn-table/shadcn-table and .../shadcn-table-base.

   ## Changed
   - Docs: base selector; examples render on the selected base; Storybook for both bases.
   - Locale items per base; example items work on both.
   - Radix installs: no API change.

   ## Known
   - Base UI tooltips have no skip-delay grouping.
   - React Aria not supported.
   ```

   Publish with `gh release create v0.2.0 --title "v0.2.0" --latest --notes-file <file>`.
6. Tick the checklist in `v0.2-base-ui-plan.md` "State" section; update memory notes.
