# 78: Date picker installs through the CLI rewriting, tracker

Status: running
Branch `date-picker-install-rewriting`, worktree /Users/anindosarker/Work/Personal/React-table/shadcn-date-picker.worktrees/date-picker-install-rewriting (from origin/main b28d91a)
Checks:
- Check: `pnpm install --frozen-lockfile` in the worktree at b28d91a: pass
- Check: probe install, `shadcn add ./item.json` (shadcn 4.23.0) of picker-popup.tsx, picker-trigger.tsx, day-range-picker.tsx as `registry:component` into a scratch app with `~/` aliases at b28d91a: imports rewritten to `~/components/ui/*` and `~/hooks/*`; `className="cn-dialog-close"` removed (picker-popup.tsx:101); `cn("cn-button-group-orientation-horizontal", className)` became `cn("", className)` (picker-trigger.tsx:47); `cn-field` removed from `cn-field grid grid-cols-[auto_1fr] items-center gap-y-2` (day-range-picker.tsx:248). Scratch app deleted.
- Check: `git merge origin/main` in the worktree (main still b28d91a): pass (already up to date)
- Check: nova style input `registry/styles/style-nova.css` is the stock file of shadcn-ui/ui at 4233ed1 (`apps/v4/registry/styles/style-nova.css`, last commit touching it), byte-equal to `test-projects/next-app/styles/style-nova.css`: pass (`diff` prints nothing); `shadcn` 4.23.0 does not ship it
- Check: `pnpm lint` at ea68420: pass (exit 0)
- Check: `pnpm typecheck` at ea68420: pass (exit 0)
- Check: `pnpm registry:check` at ea68420: pass (exit 0; date-picker-base 22 files, radix and aria no items)
- Check: `git -C test-projects/next-app diff --quiet 53f4b4f -- components/date-picker` then `diff -r <approved folder> registry/base/components/date-picker` at ea68420: pass (exit 0, prints nothing)
- Check: `diff -r registry/base/components/date-picker registry/base/generated/components/date-picker` at ea68420: pass (3 lines, each a cn-* line):
  - `picker-popup.tsx:101` `className="cn-dialog-close"` became `className="absolute top-2 right-2"`
  - `picker-trigger.tsx:47` `cn("cn-button-group-orientation-horizontal", className)` became `cn("[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!", className)`
  - `day-range-picker.tsx:248` `"cn-field grid grid-cols-[auto_1fr] items-center gap-y-2"` became `"data-[invalid=true]:text-destructive gap-2 grid grid-cols-[auto_1fr] items-center gap-y-2"`
- Check: hand edit of `generated/.../types.ts`, then `pnpm registry:check` at ea68420: pass (exit 1 "out of step with the source"; restored, exit 0)
- Check: source `types.ts` changed without a rebuild, then `pnpm registry:check` at ea68420: pass (exit 1; restored, exit 0)
- Check: extra generated file, and a deleted generated file, then `pnpm registry:check` at ea68420: pass (exit 1 each, "no source file" / "missing" and "item file missing"; restored)
- Check: `pnpm registry:build` twice, then `git status --short` at ea68420: pass (prints nothing)
- Check: radix readiness, temporary copy of the picker into `registry/radix/components/date-picker`, `pnpm registry:build` and `registry:check` at ea68420: pass (date-picker-radix, 22 files, exit 0); copy removed and rebuilt, tree clean
- Check: install proof, fresh Next.js app (`create-next-app --src-dir --import-alias "~/*"`, `shadcn init -b base -p nova`: style base-nova, aliases `~/components`, `~/hooks`), `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-base#ea684201b00f28c1abee64fd07b6fd9a8278ceb2` at ea68420: pass (22 files in `src/components/date-picker`; no `@/` import left, all `~/components/ui/*`, `~/hooks/use-mobile`; the three lines carry the nova classes, no `cn-` left; only import lines differ from the generated folder)
- Check: scratch app `pnpm exec tsc --noEmit` at ea68420: pass (exit 0)
- Check: scratch app `pnpm exec next build` at ea68420: pass (exit 0), page with controlled `<DatePicker type="date" presentation="auto" />` and `<DatePicker type="date" presentation="auto" range />` (`auto` gives the phone dialog at 390)
- Check: rendered comparison, playwright (chromium) at 390x844 and 1280x844, range picker, installed app (next start :5341) against a reference (vite :5342 rendering the SOURCE picker of registry/base with `@/` aliased to it, `<html class="style-nova">`, the approved app's `app/globals.css` and `styles/style-*.css` copied, `--radius: 0.625rem` as in the scratch app since the approved app sets radius at runtime) at ea68420: pass, equal on every value:
  - 390, dialog close button relative to the dialog (390x844): installed top 8 right 8, 28x28, position absolute, top 8px right 8px; reference the same
  - 390, range field (dialog grid): installed column-gap 8px, row-gap 8px, label to box 8px, width 358; reference the same
  - 390 and 1280, trigger button group (one child, dialog-trigger at 390, popover-trigger at 1280): installed radius 10px on all four corners; reference the same
  - 1280: popover (428 wide at x 16, y 100), no dialog close or range field there; installed and reference the same
- Check: scratch servers on 5341 and 5342 stopped, scratch app and reference deleted at ea68420: pass
- Check: `pnpm lint`, `pnpm typecheck`, `pnpm registry:check` at 5cd8646: pass (exit 0 each)
- Check: `grep -c 'anindosarker/shadcn-date-picker/date-picker-base' README.md` at 5cd8646: pass (1, install line kept)

- Task 1 the mechanism: done (tracker only, no repository commit)
- Task 2 the generated install files: done (ea68420)
- Task 3 install proof: done (ea68420, no repository change)
- Task 4 README lines: done (5cd8646)

## The mechanism

Source: shadcn-ui/ui at 055aa6b (packages/shadcn 4.23.0, the version in the worktree's node_modules).

- Install path per file type, `packages/registry/src/updaters/update-files.ts:166-198`: `registry:file` and `registry:item` are written as they are (no transform, no import rewrite). Every other type (`registry:component`, `registry:ui`, `registry:lib`, `registry:hook`, `registry:page`) runs the same chain: `transformImport`, `transformRsc`, `transformCssVars`, `transformTwPrefixes`, `transformIcons`, `transformMenu`, `transformAsChild`, `transformRtl`, `transformFont`, `transformCleanup`. No type is treated differently for imports or `cn-*` classes. `utils/dry-run.ts:191-194` (packages/shadcn) repeats the same split.
- Import aliases: `transformers/transform-import.ts:32-40` rewrites each import specifier to the app's `components.json` aliases. Only for the non-file types above.
- `cn-*` classes at install: `transformers/transform-cleanup.ts:17-29` and `:70-98` strip every `cn-*` token from `className` strings, `cn()` arguments, `cva()` and `mergeProps()` calls (only `cn-font-heading` is kept for `transformFont`). The install resolves only `cn-menu-target`, `cn-menu-translucent` (`transform-menu.ts:13-17`), `cn-rtl-flip` (`transform-rtl.ts:94`) and `cn-font-heading` (`transform-font.ts:18`). `cn-dialog-close`, `cn-field` and `cn-button-group-orientation-horizontal` are stripped, never resolved.
- How shadcn's own parts get their `cn-*` styles: at shadcn's registry build, not at install. `apps/v4/scripts/build-registry.mts:1028` builds a style map per style from `registry/styles/style-<style>.css` with `createStyleMap`, and `:637` runs `transformStyle(source, { styleMap })`, which inlines each class's `@apply` Tailwind classes into the code (`packages/shadcn/src/styles/transform-style-map.ts:73-116`) and removes the marker. Both functions are exported for registry authors from `shadcn/utils` (`packages/shadcn/src/utils/index.ts:7-8`). The CLI then installs per-style JSON whose code has no `cn-dialog-close` left.
- GitHub-addressed items: `packages/registry/src/registry/source.ts:168` reads every item file's content from its `path` in the repository; a `content` field in `registry.json` is not used. So build-time resolved code reaches a user only as committed files at the item's paths.
- Item CSS: an item may carry `css` (`registry/schema.ts:190`), merged into the app's CSS by `updaters/update-css.ts:21`. With a non-file type the classes it would target are stripped first by `transformCleanup`.
- First milestone, as `registry:component` (reproduced, Check above): `cn-dialog-close` removed, so the close X loses `absolute top-2 right-2` (nova) and sits in the flow; `cn-field` removed, so the range rows lose `gap-2` (column gap) and `data-[invalid=true]:text-destructive`; `cn-button-group-orientation-horizontal` became `""`, harmless, as the stock `button-group.tsx:13-14` horizontal variant already carries the same `[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!`. Not the styled result D172 wants (2 of 3 places lose their style).
- The three rules differ per style (approved app `styles/style-*.css`): `cn-dialog-close` is `absolute top-2 right-2` in nova, lyra, mira, `top-4 right-4` in vega, maia, `top-4 right-4 bg-secondary` in luma, rhea, `top-5 right-5 bg-secondary` in sera; `cn-field` `gap-2` or `gap-3`.

## Attention

- No item type gives both: a non-file type rewrites the aliases and strips two styled classes (`update-files.ts:168-198`, `transform-cleanup.ts:17-29`); `registry:file` keeps the classes but no import is rewritten and no rule exists for them in a user's app. The way shadcn styles its own parts is a build-time `transformStyle` per style (`build-registry.mts:637`), and a GitHub registry serves only committed files (`source.ts:168`). Owner choice; options in the builder's return.
- Settled by D173 (Q161, option 1): the registry build runs shadcn's createStyleMap and transformStyle with the nova style into a generated, committed folder per base, items typed registry:component. RESUME from the lead, 2026-11-24.
