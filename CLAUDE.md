# CLAUDE.md
This project is a table library built with tanstack table and shadcn/ui. 

## Rules
- No resource limits — use **agent teams** (not subagents) for parallel work. Use TeamCreate, shared task lists, and teammate spawning.
- Do not commit code to git
- **After writing code**: `pnpm prettier --write <files>` (or repo-wide `pnpm format`), then `pnpm tsc -p apps/test-shadcn/tsconfig.app.json --noEmit` must be clean (ignore only the preexisting TS5101 baseUrl deprecation). Lint: `pnpm --filter test-shadcn exec eslint <path relative to apps/test-shadcn> --max-warnings=0` (eslint lives in the app package, not the workspace root).

## SRT ← MRT porting (active work)
- Workflows: `.ai/plans/workflows/` (create → review → test per component, plus note-taking guideline).
- Single tracker + conventions: `.ai/plans/matching/srt-review-notes.md` (read "General notes" before any component work).
- Per-component plans: `.ai/plans/components/<Component>.plan.md`.
- Shared dev server: http://localhost:5273 — NEVER `pkill vite`, never start a server on the default port.
