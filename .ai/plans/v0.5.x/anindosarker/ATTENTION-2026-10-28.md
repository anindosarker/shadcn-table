# Attention, 2026-10-28

Judgment calls taken during the unattended v0.5.x run that the owner may want to revert. Details in `01-tracker.md`.

- `registry/aria/components/ui/label.tsx`: the shadcn aria part was edited for `tsc:aria` (unused `import * as React` dropped, TS6133). It is the only edit to a shadcn part in the aria edition; relaxing `noUnusedLocals` for parts in `tsconfig.aria.json` instead would keep the part as shipped.
