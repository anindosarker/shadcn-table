# 05: docs app layout, tracker

Decisions and deviations only. Branch `v0.4/05`, commits `a51afae`, `dab8585`, `fef22f7`, merge `14e12b6` of `claude/review` at `1e374f5`. Reviewer verdict pass with two minor findings, gate agent green with the Vercel items deferred or owner.

## Decisions

- Phases 2 and 3 share one commit, `dab8585`. After the `git mv` of `components/ui` the Radix live examples and the old loader do not resolve until the `.radix` variants exist, so phase 2 cannot be green on its own; the first green point is the end of phase 3.
- `components/ui-radix` and `components/ui-base` are in `.prettierignore` (1.6.3 "entries follow"). `pnpm format` would otherwise reformat CLI-written files and break the "reinstall leaves no diff" gate. The previous `components/ui` copy had been prettier-formatted, which is why `table.tsx` differs in quote style after the reinstall.
- `app/global.css` changes are comment updates that describe the new installer, which drops the item css and restores `global.css`; they are not `lib:install` side effects.
- Code fences and strings that show `@/components/ui/shadcn-table` to readers stay: content MDX (`install.mdx`, `usage.mdx`, `st-hooks.mdx`, `st-components.mdx`, the guides) and `dev-home/v12/code-strip.tsx` show the path a user has after install and are not imports.
- The user-facing install page (`content/docs/getting-started/install.mdx`, named in 1.6.9) is unchanged: it never mentions `lib:install` or the docs folders. The 1.6.9 text went into `CONTRIBUTING.md` and `apps/shadcn-table-docs/README.md`.
- `lib/example-variant-dir.mjs` exports `VARIANT_DIRS = { radix: '.radix', base: '.base' }` in place of `BASE_VARIANT_DIR`; `lib/example-variants.mjs` writes both variants, `.radix` rewriting imports only and `.base` also applying the existing `asChild` to `render` transform.
- `scripts/install.mjs <base>` writes a temporary `components.json` (`radix-nova` or `base-nova`, ui alias `@/components/ui-<base>`), merges the built item with its locale items from `packages/shadcn-table/public/r`, drops the item css, renames `st-collapsible-*` to `st-base-collapsible-*` on base, runs `shadcn add`, then restores `components.json`, `app/global.css`, `package.json` and `pnpm-lock.yaml`.
- The merge of `claude/review` kept part 02's client-highlight `example-snippet.tsx` with one `readExampleFiles(name)` set shared by both bases.

## Deviations

- Phase 1 was committed by an earlier interrupted run (`a51afae`); the final run verified the in-progress phase 2 and 3 state against 1.6.3 to 1.6.9 (reinstall from a fresh registry build changed nothing, same tree id) and kept it instead of redoing it.
- Gates "CI docs and install jobs green" and "Vercel preview from the branch" cannot run from the branch: CI runs on the pull request the lead opens; branch previews are switched off on purpose (Hobby plan storage), `vercel.json` `services.docs.root` is already `apps/shadcn-table-docs`. "Vercel project root checked after the first preview deploy" is an owner item after the first production deploy from the new root.
- `check-pages.mjs a` failed once on `/docs/api/row-instance-apis` with a 404 console error that a direct Playwright load did not reproduce; the rerun passed (269 passed, 0 failed). Same transient as parts 02 and 03 saw.
- Reviewer minor findings, left open: the comment in `lib/example-variant-dir.mjs` names the wrong importer; and the merge note above is recorded here instead of in code.

## Gate numbers

- `check-pages.mjs a`: 269 passed, 0 failed. `check-pages.mjs e`: 592 passed, 0 failed.
- `pnpm registry:build`, `lib:install radix`, `lib:install base` on head: `git status --short` empty.
- Playwright base switch on `/docs/examples/basic`: live table re-renders with Base UI markup, code view keeps `@/components/ui/` imports, install command moves from `/r/radix/example-basic.json` to `/r/base/example-basic.json`, zero page errors.
- Library gates on the merged result: `test` and `test:base` 400 of 400, `check:bases` 129 files, 23 allowed to differ.
