export const meta = {
  name: 'v0-8-fix-pins',
  description: 'v0.8.x fix story (F36): pinned view items render beside the view settings button in any toolbar; build, verify',
  phases: [{ title: 'Fix build' }, { title: 'Fix verify' }],
}
// args: { baseSha, wt, branch }
const PLANS = '.ai/plans/v0.8.x/anindosarker'
const PROCESS_FILE = `${PLANS}/process.md`
const INTEGRATION = 'claude/review'
const TRACKER = `${PLANS}/trackers/fix-pins-tracker.md`
const a = args
const BUILD_SCHEMA = { type: 'object', properties: {
  blocked: { type: 'boolean' }, blockedReason: { type: 'string' }, head: { type: 'string' }, prUrl: { type: 'string' },
  commits: { type: 'array', items: { type: 'object', properties: { sha: { type: 'string' }, subject: { type: 'string' } }, required: ['sha', 'subject'] } },
  notes: { type: 'array', items: { type: 'string' } }, attention: { type: 'array', items: { type: 'string' } },
}, required: ['blocked', 'head', 'commits', 'notes', 'attention'] }
const VERIFY_SCHEMA = { type: 'object', properties: {
  allPass: { type: 'boolean' }, head: { type: 'string' }, prUrl: { type: 'string' },
  gates: { type: 'array', items: { type: 'object', properties: { gate: { type: 'string' }, pass: { type: 'boolean' }, output: { type: 'string' } }, required: ['gate', 'pass', 'output'] } },
  failures: { type: 'array', items: { type: 'string' } }, notes: { type: 'array', items: { type: 'string' } }, attention: { type: 'array', items: { type: 'string' } },
}, required: ['allPass', 'head', 'gates', 'failures', 'notes', 'attention'] }
const RULES = `
Rules that bind you: read ${PROCESS_FILE} first (the project facts: branches, merge, gates, agent sandbox) and follow every line. In addition:
- Work ONLY in the git worktree ${a.wt} on branch ${a.branch} (checked out, clean, dependencies installed, at ${a.baseSha} = origin/${INTEGRATION}).
- Decisions: ${PLANS}/decisions.md (never re-decide). Finding: ${PLANS}/findings.md F36 (the cause and the fix) and decisions D8, D11, D25.
- Questions are not possible. Pick the sensible default; record a judgment call the owner may want to revert as one bullet under "## Attention" in ${TRACKER}. Never stop the run. If the fix cannot be finished, commit what is coherent, write why under "## Attention" in the tracker, return blocked=true with blockedReason.
- Library bases: packages/shadcn-table/registry/{radix,base,aria}/components/ui/shadcn-table/ (radix first, then base and aria; keep the three identical unless packages/shadcn-table/scripts/registry/{base,aria}-diff.json lists the file). Your files: components/toolbar/ST_ViewSettingsButton.tsx, components/toolbar/ST_ViewSettingsItems.tsx, components/toolbar/ST_ToolbarInternalButtons.tsx in the three bases, one NEW story file packages/shadcn-table/stories/fixed-bugs/PinnedItemsCustomToolbar.stories.tsx (every column with a lucide \`*Icon\` as \`icon\`, D49), ${TRACKER}, CHANGELOG.md (one line under "### Fixed", a "#### Fix F36" block). No other file: other fix stories run at the same time on worktrees 01 and 02 (docs app files are theirs).
- The machine is loaded (P4): per-base gates one base after another; ports 5340 to 5360 for anything you start, stop it after; the dev registry on 5310 is shared, never kill it; never touch 5273, 5320, 5330, 6006 to 6008.
- Your final text is a return value for a script, not a message to a human.`
phase('Fix build')
const b = await agent(`You are the coder for the fix story "Pinned view items in custom toolbars (F36)" on worktree ${a.wt}.
${RULES}
Change: today ST_ToolbarInternalButtons renders ST_ViewSettingsItems (the pinned icon buttons, D11) and ST_ViewSettingsButton in the D8 order; a custom renderTopToolbar or renderToolbarInternalActions that renders only <ST_ViewSettingsButton table={table} /> (the docs advanced example) gets no pinned items, so the pin toggles in the panel show nothing. Fix: ST_ViewSettingsButton renders <ST_ViewSettingsItems table={table} /> before its button whenever it is not rendered by the stock group; the stock group tells it through a React context flag it provides (for example an ST_InternalButtonsContext with { insideInternalButtons: true }) so the D8 order inside the stock toolbar is unchanged and nothing renders twice. Keep the public props of both components; export nothing new unless the context must cross files (then an internal module, not index.ts). Same in the three bases (the files are identical across bases unless the diff lists say otherwise; check packages/shadcn-table/scripts/registry/{base,aria}-diff.json).
Reproduce first: a play in stories/fixed-bugs/PinnedItemsCustomToolbar.stories.tsx: renderTopToolbar returns a div with the search field and <ST_ViewSettingsButton table={table} />; open the panel, pin Density; assert the Density stepper button (aria-label localization.toggleDensity) is in the toolbar beside the settings button; a second play on the stock toolbar asserts the pinned buttons render once and in the D8 order (before full screen and the settings button). Run on the shipped code in base, note the failure in the tracker, then fix; run both plays in the three bases, plus stories/features/ViewSettings.stories.tsx and Toolbar.stories.tsx.
Tracker ${TRACKER}: create from ~/.claude/skills/expedition/templates/tracker.md, first line "# Pinned view items in custom toolbars (F36), tracker", Status running, Branch line (worktree 03, PR once opened), one Gates bullet per gate (command, commit, result), one Milestone line.
Gates: pnpm tsc:radix, tsc:baseui, tsc:aria; pnpm lint; pnpm check:bases; pnpm check:tailwind; the three story files through the Storybook test runner per base one after another (see packages/shadcn-table/package.json test:<base>; pass the files as filters); then test:base in full once. Record each.
Commits: Conventional Commits, one concern each, pnpm format first, push after each. At the first push open the draft PR from ${a.branch} into ${INTEGRATION}: title "v0.8 fix: pinned view items render beside the settings button (F36)", label release:minor, body per .github/pull_request_template.md. Do not merge.
Return blocked, blockedReason, head (short sha after the last push), prUrl, commits, notes, attention.`, { label: 'build:fix-pins', phase: 'Fix build', schema: BUILD_SCHEMA, model: 'opus' })
if (!b || b.blocked) return { status: 'blocked', build: b, attention: b?.attention || ['build returned no result'] }
phase('Fix verify')
const v = await agent(`You are the verifier for the fix story "Pinned view items in custom toolbars (F36)" on worktree ${a.wt}, branch ${a.branch}, head ${b.head}, PR ${b.prUrl || 'open from the branch'}.
${RULES}
Read the Gates section of ${TRACKER}. Do NOT rerun a gate recorded there at a commit whose \`git diff --name-only <commit>..HEAD\` touches only plan files and the changelog. Run what is missing from a clean tree, one base after another: tsc per base, lint, check:bases, check:tailwind, test:radix and test:aria in full (test:base if not recorded), storybook:build:aria. Record each gate in the tracker (command, commit, result, "verifier"), set Status to verified, commit the tracker ("docs(plan): fix-pins gates"), push. Mark the PR ready with the gate checklist. Do not merge.
Return allPass, head, prUrl, gates, failures, notes, attention.`, { label: 'verify:fix-pins', phase: 'Fix verify', schema: VERIFY_SCHEMA, model: 'opus' })
return { status: v?.allPass ? 'done' : 'failed', build: b, verify: v, attention: [...(b.attention || []), ...(v?.attention || [])] }
