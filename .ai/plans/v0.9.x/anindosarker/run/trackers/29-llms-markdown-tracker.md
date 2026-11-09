# 29: Markdown delivery and llms.txt shape, tracker

Status: running
Branch `v0.9/llms-markdown`, worktree 05 (`/Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/05`)
Checks:
- Unit check `toPlainMarkdown`: `node --experimental-strip-types <scratchpad>/check.ts` on a copy of `lib/llms.ts` with its three imports stubbed; fixture (frontmatter, single and multi-line import, `<ExampleSnippet />`, `<Callout>`, nested `<Cards>`/`<Card>`, `{/* */}`, fence holding `import` and `<Fake />`): fence intact, rest gone, Callout and Card prose kept at task 1 commit: pass
- `pnpm --filter shadcn-table-docs types:check` at task 1 commit: pass

- Task 1 `lib/llms.ts`: done
