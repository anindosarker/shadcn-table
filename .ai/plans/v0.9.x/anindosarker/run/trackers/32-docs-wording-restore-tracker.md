# 32: Docs wording restored, byline and dates removed, tracker

Status: merged (12fd7d78)
Branch `v0.9/docs-wording-restore`, worktree 03
Checks:
- Check: content diff, `git diff --stat 33f62f5e~1 -- content/docs/{examples,guides,api}` at f7e3dff6: pass (8 files changed, 59 insertions(+), 6 deletions(-); 65 changed lines: 52 added `guides/tanstack-table-with-shadcn-ui.mdx`, 1 `guides/meta.json` entry after "accessibility", 6 typo lines replaced)
- Check: comparison links, `grep -rn "getting-started/comparison" apps/shadcn-table-docs` (mdx, json, ts, tsx) at 1853327f: pass (no output)
- Check: byline grep, `grep -rn "DocsByline\|docs-byline\|siteAuthor\|^date:" app components lib content` at f7e3dff6: pass (no output)
- Check: docs types, `pnpm --filter shadcn-table-docs types:check` at 005b49f3: pass
- Check: docs lint, `pnpm --filter shadcn-table-docs lint` at 005b49f3: pass (0 errors, 9 warnings)
- Check: registry, `pnpm -w registry:items && git diff --exit-code apps/shadcn-table-docs/registry.json` at 005b49f3: pass
- Check: routes on `next start -p 5340` after `pnpm --filter shadcn-table-docs build` at f7e3dff6: pass (`/docs/getting-started/comparison` 404, `/docs/guides/tanstack-table-with-shadcn-ui` 200, `/docs/guides/sorting` 'Updated 20' count 0, `/sitemap.xml` `<loc>` count 105); server stopped
- Check: typecheck, `pnpm test typecheck --base base` at f7e3dff6: pass
- Check: lint, `pnpm test lint` at f7e3dff6: pass
- Check: validate-repo, `pnpm test validate-repo` at f7e3dff6: pass
- Check: docs-e2e, `pnpm test docs-e2e --base base --url http://localhost:5340` (same build) at f7e3dff6: pass (getting-started 205, api 109, guides 692, examples 939; 0 failed)
- Check (verifier): Local CI and 2.2 lines above still valid (f7e3dff6..66f68c42 and 005b49f3..66f68c42 touch only .ai/ and CHANGELOG.md); not rerun
- Check (verifier): comparison links, `grep -rn "getting-started/comparison" apps/shadcn-table-docs` (mdx, json, ts, tsx) at 66f68c42: pass (no output)
- Check (verifier): Acceptance 1.2 rerun at 66f68c42: pass. Diff `--stat` 8 files changed, 59 insertions(+), 6 deletions(-) (tanstack guide, meta.json entry, six typo lines); byline grep no output; `pnpm -w registry:items && git diff --exit-code apps/shadcn-table-docs/registry.json` exit 0; `pnpm test validate-repo` pass; `pnpm --filter shadcn-table-docs build` then `next start -p 5340`: comparison 404, tanstack guide 200, sorting 'Updated 20' 0, sitemap `<loc>` 105; `pnpm test docs-e2e --base base --url http://localhost:5340` pass (4 sections, 107 pages, 1945 checks); server stopped

- Task 1 Content restore, guide order, comparison page removal: done (1853327f)
- Task 2 Byline, date field and script removal, registry: done (005b49f3)
- Task 3 Acceptance on a production build: done (f7e3dff6)
- Task 4 Cleanup, format, changelog: done (f7e3dff6)

## Attention

- `zod` in `apps/shadcn-table-docs/package.json` (added by spec 24) has no importer left in the docs app after the `date` schema field went; the dependency is not removed here because `package.json` is outside this milestone's files.
