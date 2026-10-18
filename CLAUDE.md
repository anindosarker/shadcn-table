# CLAUDE.md

This project is a table library built with tanstack table and shadcn/ui.

## Rules

- You can commit and push to git. No attribution.
- **After writing code**: `pnpm prettier --write <files>` (or repo-wide `pnpm format`), then `pnpm tsc -p packages/shadcn-react-table/tsconfig.app.json --noEmit` must be clean (ignore only the preexisting TS5101 baseUrl deprecation). Lint: `pnpm --filter shadcn-react-table exec eslint <path relative to packages/shadcn-react-table> --max-warnings=0` (eslint lives in the app package, not the workspace root).
