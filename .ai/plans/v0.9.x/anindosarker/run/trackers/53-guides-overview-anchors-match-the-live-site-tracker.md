# 53: Guides overview anchors match the live site, tracker

Status: merged (f36ff8ec)
Branch `v0.9/guides-overview-anchors`, worktree 09
Checks:
- Check: typecheck, `pnpm test typecheck --base radix` at 3b42b236: pass
- Check: lint, `pnpm test lint` at 3b42b236: pass (0 errors, 9 warnings, none in the owned files)
- Check: docs-e2e base, `pnpm test docs-e2e --base base` at 3b42b236: pass (4 sections, 110 pages, production build)
- Check: validate-repo, `pnpm test validate-repo` at 3b42b236: pass (40 unit tests)
- Check: group ids, `next start` of that production build, `/docs/guides` h3 ids against https://www.shadcn-table.com/docs/guides at 3b42b236: pass, identical in order (below)
- Check: usage.mdx anchors, `/docs/getting-started/usage` links `/docs/guides#fundamentals` and `/docs/guides#customization-guides`, both ids present at 3b42b236: pass
- Check (verifier): recorded checks valid for HEAD, all at 3b42b236 = HEAD of v0.9/guides-overview-anchors: pass, nothing rerun
- Check (verifier): live https://www.shadcn-table.com/docs/guides h3 ids (curl) equal the recorded list and the ids groupId yields from content/docs/guides/meta.json at HEAD, same 10 in the same order: pass
- Check (verifier): usage.mdx:184 links #fundamentals and #customization-guides, both in that id list: pass
- Check (verifier): `pnpm test docs-e2e --base radix|aria` (2.2): started at 3b42b236, not finished before the verifier had to return; the milestone's own Checks line names `--base base` only, which is green

Group ids, branch (production build) | live:
- `fundamentals` | `fundamentals`
- `customization-guides` | `customization-guides`
- `size---width-guides` | `size---width-guides`
- `big-data-guides` | `big-data-guides`
- `data-mutation-guides` | `data-mutation-guides`
- `filtering---hiding-guides` | `filtering---hiding-guides`
- `grouping---expanding-guides` | `grouping---expanding-guides`
- `sticky-pinning---freezing-guides` | `sticky-pinning---freezing-guides`
- `sort---order---dnd-guides` | `sort---order---dnd-guides`
- `action-button---menu-guides` | `action-button---menu-guides`

- Task 1 Guides overview anchors match the live site: done (3b42b236)

## Attention
- Verifier: docs-e2e radix and aria from spec 2.2 not recorded for this milestone (its Checks line names base only; the change is base-independent markup ids). Lead: rerun them on v0.9/docs-layout if the epic gate needs them.
