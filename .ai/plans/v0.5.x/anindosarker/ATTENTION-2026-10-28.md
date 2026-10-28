# Attention, 2026-10-28

Judgment calls taken during the unattended v0.5.x run that the owner may want to revert. Details in `01-tracker.md`.

- `registry/aria/components/ui/label.tsx`: the shadcn aria part was edited for `tsc:aria` (unused `import * as React` dropped, TS6133). It is the only edit to a shadcn part in the aria edition; relaxing `noUnusedLocals` for parts in `tsconfig.aria.json` instead would keep the part as shipped.
- The example registry items (`example-<slug>`) ship the Radix-shaped sources for every edition; the docs' live variants rewrite part props per edition (`lib/example-variants.mjs`), the registry items do not. A Base UI or React Aria project that runs `shadcn add` on an example whose source uses `asChild`, `disabled` on `Button`, `onValueChange` on `RadioGroup` or the Radix tooltip composition gets code its parts reject. Pre-existing for Base UI since 0.3; a per-edition example build is a candidate for 0.5.1.
- `examples/custom-headless` now renders plain `table`, `thead`, `tr`, `th`, `tbody`, `td` with the shadcn Table classes because the React Aria `Table` part is a collection table that rejects arbitrary cells.
