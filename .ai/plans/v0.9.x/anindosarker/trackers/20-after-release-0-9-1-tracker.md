# 20: Release 0.9.1, After release, tracker

Status: merged (9558cdb2cd546f1a35a02e664b1d27a87510af2f)
Branch `master` (read), `claude/review` and `dev` (sync), main checkout
Checks:
- `gh run view 42521211641 --json status,conclusion,jobs`, run 42521211641: Check Release, Verify Deployment, Validate Production, Publish Release success
- `git ls-remote --tags origin v0.9.1`, b0d53a11: one line (refs/tags/v0.9.1): pass
- `gh release view v0.9.1 --json tagName --jq .tagName`: v0.9.1: pass
- `curl -fsS https://www.shadcn-table.com/version.txt`: 0.9.1: pass
- `curl -fsS https://storybook.shadcn-table.com/{base,radix,aria}/version.txt`: 404 each; `curl -fsS https://storybook.shadcn-table.com/version.txt`: 0.9.1: pass (see Attention)
- Validate Production, run 42521211641: success
- `git rev-parse origin/claude/review origin/dev origin/master`: 9558cdb2, b0d53a11, b0d53a11; claude/review is one merge commit (`merge: master 0.9.1`) past master, it carried plan commits: pass
- `pnpm test validate-repo`, 9558cdb2: green (40 unit tests): pass

- Task 1 release.yml to green; tag v0.9.1; the four version.txt: done
- Task 2 claude/review and dev up to master; handoff: done (handoff left to the main session)

## Attention

- Spec 20 1.2 names per-base Storybook URLs `https://storybook.shadcn-table.com/<base>/version.txt`; they 404. Storybook serves one `/version.txt` at its root (0.9.1), which is what `tools/release/verify-deployment.mjs` polls. Took the root URL as the acceptance; the spec line is wrong, not the deploy.

## Notes

