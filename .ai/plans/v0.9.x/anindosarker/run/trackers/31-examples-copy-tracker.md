# 31: Examples copy, tracker

Status: done, ready to merge
Branch `v0.9/examples-copy`, worktree `/Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/03`

Checks:

- `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/examples` at 2745db71: pass (43 pages, 0 on every rule)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5352 pnpm --filter shadcn-table-docs build` at 2745db71: pass
- `pnpm format` at 2745db71: pass (no change)
- `pnpm test typecheck --base base` at b7e82b57: pass (tsc clean)
- `pnpm test lint` at b7e82b57: pass (exit 0; 9 warnings, the same as on `claude/review`)
- `pnpm test validate-repo` at b7e82b57: pass
- `pnpm test docs-e2e --base base` at b7e82b57: pass (107 pages; getting-started 205, api 109, guides 692, examples 939 passed, 0 failed)

Review fixes (5cbc6d4b, 21d1f674, 5b7e2553, 40166937, 6bddaf09), checks rerun at 6bddaf09:

- `node tools/docs/check-frontmatter.mjs apps/shadcn-table-docs/content/docs/examples`: pass (43 pages, 0 on every rule; 21d1f674 alone had filter-variants at 159, fixed in 40166937)
- `npx prettier --check apps/shadcn-table-docs/content/docs/examples/*.mdx`: pass
- `NEXT_PUBLIC_SITE_URL=http://localhost:5352 pnpm --filter shadcn-table-docs build`: pass (registry.json reorder restored)
- `pnpm test docs-e2e --base base`: first run 1 failed (getting-started `/` "perf: light/dark toggle" 345 ms, P5 known flake), rerun pass (205, 109, 692, 939 passed, 0 failed)
- `pnpm format`: pass (no change); `pnpm test validate-repo`: pass

- Task 1 Rewrite the 43 example pages: done (2745db71)
- Task 2 Cleanup, format, changelog: done (b7e82b57)

## Notes

- Option names and claims in the intros were checked against `apps/shadcn-table-docs/examples/base/<example>/TS.tsx` and the registry types (for example `persistViewSettings` stores order, pinning, visibility, density, view settings and page size, not column sizes).
- `node tools/docs/check-frontmatter.mjs` on all of `content/docs` still shows one duplicate (`guides/row-pinning.mdx` = `guides/row-selection.mdx`) and guide/API pages under 150 words: the Guides and API copy milestone's folders, not this one.
- The production build regenerates `apps/shadcn-table-docs/registry.json` (126 lines reordered); restored with `git checkout`, not committed (P9 generated file).
- No curl or Lighthouse Acceptance line belongs to this milestone (the 308, byline, sitemap and topics lines are the frame milestone's, proven there).

## Attention
