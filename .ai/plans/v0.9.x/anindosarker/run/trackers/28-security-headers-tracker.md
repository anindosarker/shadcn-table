# 28: Security response headers, tracker

Status: merged (34c04ba6afd79a65bc2eb98c936baaba57bfc252)
Branch `v0.9/security-headers`, worktree 04 (`/Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/04`)
Checks:
- Check: docs lint, `pnpm --filter shadcn-table-docs lint` at Task 1 commit: pass (0 errors, 9 existing warnings)
- Check: production build, `NEXT_PUBLIC_SITE_URL=http://localhost:5347 pnpm --filter shadcn-table-docs build` at 9ab4b69f: pass
- Check: Acceptance 1.2 curls on `next start -p 5347` at 9ab4b69f: pass (counts 4/4/4/4, CSP 0, registry 200, ingest 400); server stopped
- Check: `pnpm format` at 47b8be18: pass (no changes)
- Check: `pnpm test typecheck --base base` at 47b8be18: pass
- Check: `pnpm test lint` at 47b8be18: pass (0 errors, 9 existing warnings)
- Check: `pnpm test validate-repo` at 47b8be18: pass
- Check: `pnpm test docs-e2e --base base` at 47b8be18: pass (107 pages, examples 939 passed, 0 failed)
- Check: verifier at 66dc4069: every 2.2 line and the 1.2 Acceptance recorded green; `git diff --name-only 47b8be18..HEAD` and `9ab4b69f..HEAD` touch only `.ai/` and `CHANGELOG.md`, so none rerun. Review: none (2.2).

- Task 1 headers(): done (9ab4b69f)
- Task 2 Acceptance proof: done (477edfad)
- Task 3 Cleanup and changelog: done (47b8be18)

Notes:
- Header count (`curl -sI localhost:5347<path> | grep -iE '^(x-content-type-options|referrer-policy|x-frame-options|permissions-policy):' | wc -l`): `/` 4, `/docs/getting-started/introduction` 4, `/sitemap.xml` 4, `/r/base/registry.json` 4. `/:path*` covers `/`; no second rule.
- `curl -sI localhost:5347/ | grep -ic '^content-security-policy'`: 0.
- `/r/base/registry.json` status: 200.
- `POST /ingest/e/` (`text/plain`, body `{}`): 400 from PostHog (envoy, upstream rejects the empty event): proxy works.
- Under `next start` the `/ingest/*` responses (external rewrite, proxied) carry the upstream headers only, not the four from `headers()`: Next's local proxy does not add them. 1.2's Acceptance checks only the ingest status; whether Vercel's edge adds them to `/ingest/*` shows only on a deployed site (`curl -sI https://www.shadcn-table.com/ingest/static/array.js` after the 0.9.x release).
