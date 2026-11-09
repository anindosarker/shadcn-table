# 24: Canonical and slash redirect, tracker

Status: done
Branch `v0.9/canonical-slash-redirect`, worktree `shadcn-react-table.worktrees/03`
Checks:
- `pnpm --filter shadcn-table-docs types:check` at 4476e6e8: pass
- `pnpm --filter shadcn-table-docs lint` at 4476e6e8: pass (0 errors, 9 warnings, none in the owned files)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5343 pnpm --filter shadcn-table-docs build` at 4476e6e8: pass, no `.next/analyze`
- Acceptance curls of 1.2 on `next start -p 5343` at 4476e6e8: pass (Notes)
- `ANALYZE=1 NEXT_PUBLIC_SITE_URL=http://localhost:5343 pnpm --filter shadcn-table-docs build` at 4476e6e8: build pass, no `.next/analyze` (Turbopack, Notes)
- `ANALYZE=1 pnpm exec next build --webpack` (apps/shadcn-table-docs) at 4476e6e8: analyzer writes `.next/analyze/{client,edge,nodejs}.html`, build itself fails on `node:` scheme imports (Notes)
- `pnpm format` at 7afa5cd6: pass, no changes
- `pnpm test typecheck --base base` at c81a0b64: pass
- `pnpm test lint` at c81a0b64: pass (9 warnings)
- `pnpm test validate-repo` at c81a0b64: pass
- `pnpm test docs-e2e --base base` at c81a0b64: fail on P5 flake getting-started `/` "theme: Shift+R returns to the default", rerun pass (107 pages, 939 examples)
- Verifier at 1355d5e5: no rerun; `git diff --name-only 4476e6e8..HEAD` and `c81a0b64..HEAD` touch only `.ai/` and `CHANGELOG.md`, so every 2.2 line and the 1.2 Acceptance curls above stand for HEAD; the 2.2 analyzer line stays not met as written (Notes, Attention)

- Task 1 canonical, redirect, analyzer wrap: done (4476e6e8)
- Task 2 Acceptance proof on port 5343: done (7afa5cd6)
- Task 3 format and changelog: done (c81a0b64)

## Notes

- `/` canonical: `<link rel="canonical" href="http://localhost:5343"/>` (no trailing slash).
- `/docs/getting-started/introduction`: `<link rel="canonical" href="http://localhost:5343/docs/getting-started/introduction"/>`; `/docs/api/table-options`: `href="http://localhost:5343/docs/api/table-options"`.
- `curl -s -o /dev/null -w '%{http_code} %{redirect_url}' localhost:5343/docs/api/table-options/`: `308 http://localhost:5343/docs/api/table-options`; `/docs/`: `308 http://localhost:5343/docs`; slash-less `/docs/api/table-options`: `200`.
- `curl -s -o /dev/null -w '%{http_code}' -X POST localhost:5343/ingest/e/`: `400` (PostHog answer to an empty body through the proxy, not a redirect); `/sitemap.xml` and `/r/base/registry.json`: `200`.
- 2.2 "`ANALYZE=1 ... build` writes `.next/analyze/*.html`" cannot hold: the app builds with Turbopack and `@next/bundle-analyzer` prints "The Next Bundle Analyzer is not compatible with Turbopack builds, no report will be generated." Corrected form: `ANALYZE=1 next build --webpack` writes the three reports; the webpack build itself then fails (`UnhandledSchemeError: Reading from "node:child_process"`), pre-existing and outside this milestone.


## Attention

- Spec 30's measurement cannot use `ANALYZE=1 pnpm --filter shadcn-table-docs build`: `@next/bundle-analyzer` skips Turbopack builds, and `next build --webpack` fails on `node:` imports in this app. The wrap stays as the spec says; spec 30 needs `next experimental-analyze` (Turbopack analyzer) or a webpack fix.
