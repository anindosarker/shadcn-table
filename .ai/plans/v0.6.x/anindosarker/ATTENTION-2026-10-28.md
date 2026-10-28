# Attention, 2026-10-28

Judgment calls taken during the unattended v0.6.x run that the owner may want to revert.

- Part 02, commit `6c8550e5` on `v0.6/parts-untouched`: with `label.tsx` restored as shipped, the aria item no longer forks `label` (`forkedUi: []`) and lists it as a `registryDependency` like every other part. The fork existed because shadcn's `aria-nova` `label` carries an unused `import * as React`, and a fresh `shadcn init --template vite --base aria` app type-checks with `noUnusedLocals` (Vite's template), so TS6133 surfaces in the user's own project and in the CI `install (aria app)` scenario. That is shadcn's part failing shadcn's own template; shipping a corrected copy was the only way around it. Decision 2 (parts never edited) applies; if the install scenario goes red the run reports it rather than re-forking the part. Options for the owner: accept, report upstream after all, or re-allow the fork for this one part.
