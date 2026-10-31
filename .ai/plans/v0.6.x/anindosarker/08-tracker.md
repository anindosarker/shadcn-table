# 08: versioning page, tracker

Status: done (c320cec2)
Branch `v0.6/versioning-page`, worktree 07
Gates:
- `pnpm types:check` (apps/shadcn-table-docs) on the commit tree, parent 61e37a34: green
- `pnpm lint` (apps/shadcn-table-docs) on the commit tree, parent 61e37a34: green
- `pnpm build` (apps/shadcn-table-docs) on the commit tree, parent 61e37a34: green
- `check-pages.mjs a --url http://localhost:5345 /docs/api` (next start) on the commit tree, parent 61e37a34: green
- `grep -c '## Versioning' apps/shadcn-table-docs/content/docs/api/index.mdx` prints 1 on the commit tree, parent 61e37a34: green

- Phase 01 page and README: done (`docs(api): versioning section`, parent 61e37a34)
