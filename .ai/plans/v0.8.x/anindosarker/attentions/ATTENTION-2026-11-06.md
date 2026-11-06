# ATTENTION 2026-11-06, epic 07.1 release automation

## A22 The bump job's push token: a fine-grained PAT, not a GitHub App

- D83 says "a GitHub App token". An App needs two secrets (app id, private key) and `actions/create-github-app-token` per run; a fine-grained PAT is one secret. The epic reads one secret `RELEASE_BOT_TOKEN` (contents: write on this repository). The owner creates it before the release PR: GitHub Settings, Developer settings, Fine-grained tokens, repository `anindosarker/shadcn-table`, permission Contents read and write, then `gh secret set RELEASE_BOT_TOKEN`. Without it the `version bump` job fails with a clear message and the release PR cannot merge.
- Options: PAT as the epic has it (recommended); or a GitHub App, two secrets, the job rewritten.

## A23 The owner's approval versus auto-merge

- Closed by D88: auto-merge is enabled by the owner or the agent as the plan says.

- Ruleset 25521193 requires 0 approving reviews, and the owner cannot approve a PR from the same account. With auto-merge enabled at PR creation, GitHub merges the moment the checks are green, before the owner looks (D83 says "the owner approves the PR with the bump in it; auto-merge merges on green").
- Default taken for 0.8.1: the release PR is opened with its label and without auto-merge; the owner reads the sticky state and enables auto-merge (or merges) when satisfied; that click is the approval. The settings of 1.6.8 (allow_auto_merge on, required checks) still land so the merge button is gated on green.
- Options: as taken (recommended); or auto-merge at creation, no owner step.
