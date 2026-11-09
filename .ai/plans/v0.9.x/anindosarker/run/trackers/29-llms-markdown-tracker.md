# 29: Markdown delivery and llms.txt shape, tracker

Status: done
Branch `v0.9/llms-markdown`, worktree 05 (`/Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/05`)
Checks:
- Unit check `toPlainMarkdown`: `node --experimental-strip-types <scratchpad>/check.ts` on a copy of `lib/llms.ts` with its three imports stubbed; fixture (frontmatter, single and multi-line import, `<ExampleSnippet />`, `<Callout>`, nested `<Cards>`/`<Card>`, `{/* */}`, fence holding `import` and `<Fake />`): fence intact, rest gone, Callout and Card prose kept, at c5cb3050: pass
- `pnpm --filter shadcn-table-docs types:check` at c5cb3050: pass
- `pnpm --filter shadcn-table-docs types:check` at 38afefa3: pass
- `pnpm --filter shadcn-table-docs lint` at 38afefa3: pass (0 errors, 9 existing warnings)
- `NEXT_PUBLIC_SITE_URL=http://localhost:5348 pnpm --filter shadcn-table-docs build` then `next start -p 5348`, the 1.2 lines at 38afefa3: pass (counts in Notes); server stopped
- `pnpm test typecheck --base base` at 38afefa3 plus changelog: pass
- `pnpm test lint` at 38afefa3 plus changelog: pass (0 errors, 9 warnings)
- `pnpm test validate-repo` at 38afefa3 plus changelog: pass
- `pnpm test docs-e2e --base base` at 38afefa3 plus changelog: pass (getting-started 205, api 109, guides 692, examples 939, 0 failed)

- Task 1 `lib/llms.ts`: done (c5cb3050)
- Task 2 routes: done (38afefa3)
- Task 3 Acceptance proof on port 5348: done (38afefa3)
- Task 4 format and changelog: done (see branch head)

## Notes

- Acceptance on port 5348: `curl -sI -H 'Accept: text/markdown' localhost:5348/docs/getting-started/introduction | grep -i '^vary:' | grep -ci accept` printed `1` (headers: `vary: Accept`, then Next's `vary: rsc, ...`; `content-type: text/markdown; charset=utf-8`).
- `curl -s localhost:5348/llms.txt | sed -n '1p;3p'` printed `# shadcn-table` and `> A production-ready table library built with TanStack Table and shadcn/ui. ...`; `/llms.txt` is `text/plain; charset=utf-8`; sections `## Getting Started`, `## API Reference`, `## Quick Examples`, `## Guides` (the API folder's meta title is "API Reference", not "API" as 1.2 lists).
- `curl -s localhost:5348/llms.txt | grep -c '^- \[.*\](http://localhost:5348/docs/'` printed `103` (spec 31 not merged).
- `curl -s localhost:5348/llms-full.txt | grep -c '^# '` printed `103`.
- Spec 1.2 grep cannot hold: `curl -s localhost:5348/llms-full.txt | grep -cE '^(import |<[A-Z])'` printed `54`; 53 are lines inside fenced code blocks (code examples, kept by 1.6.2 "fences never touched") and 1 is a prose line of the install page's Callout body that wraps onto "import line, or set ...". Corrected check, outside fences and matching an import statement: `curl -s localhost:5348/llms-full.txt | awk '/^ *(```|~~~)/{f=!f;next} !f' | grep -cE "^(import .* from |import ['\"]|<[A-Z])"` printed `0`; the same check on each of the 103 `/llms.mdx/docs/<slugs>/content.md` printed `0` for all.
- No `---` line in `/llms-full.txt` (`grep -c '^---$'` printed `0`).
- docs-e2e has no Copy page assertion (no test greps `Copy page` or `llms.mdx`); the button uses `/llms.mdx/docs/.../content.md`, proven by the per-page curl check above.

## Attention

- The `llms.txt` summary is the home page description copied as a constant into `lib/llms.ts` (`app/(home)/page.tsx` and `app/layout.tsx` are outside this milestone's files); a later change to the home description must update it too, or a shared `siteDescription` in `lib/shared.ts` replaces all three.
