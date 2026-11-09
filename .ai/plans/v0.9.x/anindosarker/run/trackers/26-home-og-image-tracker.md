# 26: Home page Open Graph image, tracker

Status: done
Branch `v0.9/home-og-image`, worktree `/Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/04`
Checks:
- Check: docs types, `pnpm --filter shadcn-table-docs types:check` at 30c28957: pass
- Check: docs lint, `pnpm --filter shadcn-table-docs lint` at 30c28957: pass (0 errors, 9 existing warnings in examples/)
- Check: docs build, `NEXT_PUBLIC_SITE_URL=http://localhost:5345 pnpm --filter shadcn-table-docs build` at 30c28957: pass (`○ /opengraph-image` static)
- Check: Acceptance 1.2 curls on `next start -p 5345` at 30c28957: pass (Notes)
- Check: format, `pnpm format` at 30c28957 and with the changelog block: pass, no diff
- Check: Local CI, `pnpm test typecheck --base base` at 30c28957 + changelog/tracker: pass (tsc clean)
- Check: Local CI, `pnpm test lint` at 30c28957 + changelog/tracker: pass (9 existing warnings)
- Check: Local CI, `pnpm test validate-repo` at 30c28957 + changelog/tracker: pass (40 unit tests)
- Check: verifier at e6af0f62: every 2.2 line and the 1.2 Acceptance recorded at 30c28957; `git diff --name-only 30c28957..e6af0f62` touches only CHANGELOG.md and this tracker, no rerun needed

- Task 1 Write app/opengraph-image.tsx: done (30c28957)
- Task 2 Acceptance proof: done (30c28957)
- Task 3 Cleanup and changelog: done (this commit)

Notes:
- `<meta property="og:image" content="http://localhost:5345/opengraph-image?504ea41496205cc8"`
- `<meta name="twitter:image" content="http://localhost:5345/opengraph-image?504ea41496205cc8"`
- `curl -s -o og.png -w '%{http_code} %{content_type}' <url>`: `200 image/png`; dimensions `(1200, 630)`
- docs page: `og:image" content="http://localhost:5345/og/docs/getting-started/introduction/image.png"`
- Server on 5345 stopped after the proof.

## Attention
