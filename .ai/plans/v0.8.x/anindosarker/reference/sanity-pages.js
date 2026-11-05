export const meta = {
  name: 'v0-8-sanity-pages',
  description: 'v0.8.x: page checks and docs build on the merged claude/review head, three bases, report only',
  phases: [{ title: 'Sanity' }],
}
// args: { wt, sha }
const PLANS = '.ai/plans/v0.8.x/anindosarker'
const a = args
const SCHEMA = { type: 'object', properties: {
  pass: { type: 'boolean' }, head: { type: 'string' },
  results: { type: 'array', items: { type: 'object', properties: { check: { type: 'string' }, pass: { type: 'boolean' }, output: { type: 'string' } }, required: ['check', 'pass', 'output'] } },
  failures: { type: 'array', items: { type: 'string' } }, terminalErrors: { type: 'array', items: { type: 'string' } }, notes: { type: 'array', items: { type: 'string' } },
}, required: ['pass', 'head', 'results', 'failures', 'terminalErrors', 'notes'] }
phase('Sanity')
const r = await agent(`You are the sanity checker for the merged v0.8 branch. Read ${PLANS}/process.md first (P4, P5: ports, serial gates, the shared registry on 5310, never touch 5273, 5320, 5330, 6006 to 6008). Work ONLY in the worktree ${a.wt} (branch v0.8/sanity at ${a.sha} = origin/claude/review). Do not edit tracked files, do not commit, do not push; nothing of yours leaves the worktree.
Steps, one after another: \`pnpm install --frozen-lockfile\` only if node_modules is missing; \`pnpm --filter shadcn-table-docs examples:variants\`; \`pnpm --filter shadcn-table-docs types:check\`; \`pnpm --filter shadcn-table-docs lint\` (errors only count); \`pnpm --filter shadcn-table-docs build\` (then \`git -C ${a.wt} status --short\`: list any tracked file the build changed, that is a finding, then \`git checkout -- .\` to restore); start the docs dev server on a port between 5340 and 5360 (\`PORT=<port> pnpm --filter shadcn-table-docs dev\`, log to a file in your scratch), run \`node scripts/check-pages.mjs --base radix --url http://localhost:<port>\` from apps/shadcn-table-docs for every cluster, then base, then aria, one after another; after each base, grep the dev server log for lines containing "Error", "error", "doesn't exist", "not found in module", "Unhandled", "Warning: " and keep the distinct ones (terminal errors). Stop the server when done. Also open every route of lib/routes.ts (docs, api, examples, guides) once with a headless fetch and record any status other than 200.
Return pass (every check green and no terminal error), head, results (one per check: name, pass, output excerpt), failures (check names with the failing assertion text), terminalErrors (distinct lines with the page that triggered them when known), notes. Your final text is a return value for a script.`, { label: 'sanity:pages', phase: 'Sanity', schema: SCHEMA, model: 'opus' })
return r
