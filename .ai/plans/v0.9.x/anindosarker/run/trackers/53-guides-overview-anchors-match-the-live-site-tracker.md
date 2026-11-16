# 53: Guides overview anchors match the live site, tracker

Status: done
Branch `v0.9/guides-overview-anchors`, worktree 09
Checks:
- Check: typecheck, `pnpm test typecheck --base radix` at 3b42b236: pass
- Check: lint, `pnpm test lint` at 3b42b236: pass (0 errors, 9 warnings, none in the owned files)
- Check: docs-e2e base, `pnpm test docs-e2e --base base` at 3b42b236: pass (4 sections, 110 pages, production build)
- Check: validate-repo, `pnpm test validate-repo` at 3b42b236: pass (40 unit tests)
- Check: group ids, `next start` of that production build, `/docs/guides` h3 ids against https://www.shadcn-table.com/docs/guides at 3b42b236: pass, identical in order (below)
- Check: usage.mdx anchors, `/docs/getting-started/usage` links `/docs/guides#fundamentals` and `/docs/guides#customization-guides`, both ids present at 3b42b236: pass

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
