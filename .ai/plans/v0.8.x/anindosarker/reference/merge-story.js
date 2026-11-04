export const meta = {
  name: 'v0-8-merge-story',
  description: 'v0.8.x: merge one verified story branch into claude/review with a merge commit, regenerate the docs library copies, fast-forward dev',
  phases: [{ title: 'Merge' }],
}
// args: { id, branch, head, pr, tracker, subject, regen, docsRegistry }
const ROOT = '/Users/anindosarker/Work/Personal/React-table/shadcn-react-table'
const PLANS = '.ai/plans/v0.8.x/anindosarker'
const PROCESS_FILE = `${PLANS}/process.md`
const INTEGRATION = 'claude/review'
const MIRROR = 'dev'
const a = args
const MERGE_SCHEMA = { type: 'object', properties: { mergeSha: { type: 'string' }, regenSha: { type: 'string' }, notes: { type: 'array', items: { type: 'string' } }, attention: { type: 'array', items: { type: 'string' } } }, required: ['mergeSha', 'regenSha', 'notes', 'attention'] }
const ROOT_RULES = `
Rules that bind you: read ${PROCESS_FILE} first (the project facts: branches, merge, gates, agent sandbox) and follow every line. In addition:
- Work in the main checkout ${ROOT}. Run \`git -C ${ROOT} status\` first; leave unrelated changes as they are. Commit plan files only with named paths (\`git commit -- <paths>\`), never \`git add -A\` or \`git commit -a\`.
- Decisions: ${PLANS}/decisions.md (never re-decide).
- Questions are not possible. Record a judgment call the owner may want to revert as one line in attention. Never stop the run.
- Your final text is a return value for a script, not a message to a human.`
phase('Merge')
const m = await agent(`You are the merger for story ${a.id}. Verify is green on ${a.branch} (head ${a.head}, PR ${a.pr}).
${ROOT_RULES}
Steps, from ${ROOT}:
1. \`git fetch origin\`; check out ${INTEGRATION} and fast-forward it to origin/${INTEGRATION}.
2. \`git merge --no-ff origin/${a.branch}\` with the subject \`${a.subject}\`. A conflict in CHANGELOG.md: keep both blocks under one \`### Fixed\` heading. A conflict in a generated file (registry.json, apps/shadcn-table-docs/components/ui-<base>/, examples/map.tsx): take either side, it is regenerated in step 4. A conflict in packages/shadcn-table/stories/features/ViewSettings.stories.tsx: keep both sides' changes (the 'Row numbers' lookups and any new play). Any other conflict: abort the merge, return mergeSha "" and the conflicting files in attention.
3. Push ${INTEGRATION}.
4. ${a.regen ? `Regenerate the docs library copies (P9): \`pnpm -w registry:build\`, then \`pnpm --filter shadcn-table-docs lib:install radix\`, then \`base\`, then \`aria\`, one after another, never in parallel. If \`git status\` shows changes under apps/shadcn-table-docs/components/ui-<base>/ or registry files, commit them with named paths ("chore(docs): reinstall library copies after ${a.id}") and push; return that sha as regenSha, else "".` : 'No regeneration for this story; regenSha "".'}
${a.docsRegistry ? `4b. Regenerate the docs registry: \`pnpm --filter shadcn-table-docs registry:items\` (and \`registry:hosted\` if the script exists); if \`git status\` shows apps/shadcn-table-docs/registry.json or hosted registry files changed, commit them with named paths ("chore(docs): regenerate registry items after ${a.id}") and push; include that sha in notes.` : ''}
5. Set the "Status:" line of ${PLANS}/${a.tracker} to \`merged (<merge sha>)\`, commit that path only ("docs(plan): ${a.id} merged"), push.
6. Fast-forward ${MIRROR}: \`git push origin ${INTEGRATION}:${MIRROR}\` (fast-forward only; if it is refused, say so in notes and do not force).
Return mergeSha, regenSha, notes, attention.`, { label: `merge:${a.id}`, phase: 'Merge', schema: MERGE_SCHEMA, model: 'opus' })
return m
