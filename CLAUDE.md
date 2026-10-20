# CLAUDE.md

This project is a table library built with tanstack table and shadcn/ui.

## Rules

- You can commit and push to git. No attribution.
- **After writing code**: `pnpm prettier --write <files>` (or repo-wide `pnpm format`), then `pnpm --filter shadcn-table tsc:radix` must be clean (ignore only the preexisting TS5101 baseUrl deprecation). Lint: `pnpm --filter shadcn-table exec eslint <path relative to packages/shadcn-table> --max-warnings=0` (eslint lives in the app package, not the workspace root).

## Plans

- Plans live in `.ai/plans/<feature>/<git_username>/<feature>-plan.md`, where `<git_username>` is the GitHub login (`anindosarker`), e.g. `.ai/plans/v0.2-base-ui/anindosarker/v0.2-base-ui-plan.md`. Discuss scope before writing.
