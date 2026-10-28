# v0.6.x: decisions

Rulings taken 2026-10-28 in chat after the 0.5.1 release. The 0.4.x and 0.5.x rulings
([../../v0.4.x/anindosarker/decisions.md](../../v0.4.x/anindosarker/decisions.md),
[../../v0.4.x/anindosarker/decisions-review.md](../../v0.4.x/anindosarker/decisions-review.md),
[../../v0.5.x/anindosarker/decisions.md](../../v0.5.x/anindosarker/decisions.md)) stay in
force; nothing here re-decides them.

## Examples per edition

1. The docs examples follow the library's edition model: one complete hand-written set per
   edition, `apps/shadcn-table-docs/examples/<edition>/<slug>/` for every edition in
   `EDITIONS`, instead of one Radix-shaped source rewritten per edition. Why: the registry
   items `example-<slug>` under `/r/base/` and `/r/aria/` embedded the Radix source, so
   `shadcn add` on an example using `asChild`, `disabled` on `Button`, `onValueChange` on
   `RadioGroup` or the Radix tooltip composition gave Base UI and React Aria projects code
   their parts reject; the string rewriter in `lib/example-variants.mjs` only knew those four
   shapes and `custom-headless` already needs a structurally different aria file. Hand-written
   copies are idiomatic per edition and type-check against the real parts.
   - Guard, same as `check-bases.mjs`: `scripts/registry/examples-<edition>-diff.json` lists
     the example files allowed to differ from radix; every other example file must be
     byte-identical across the three folders and present in all of them; CI `bases` job fails
     otherwise. Starts with the nine examples that use edition-specific part props plus
     `custom-headless` for aria.
   - `scripts/registry/examples.mjs` builds `/r/<edition>/example-<slug>.json` from that
     edition's folder; the base and aria example sets are type-checked against their installed
     parts in CI.
   - The prop rewrite in `lib/example-variants.mjs` is deleted. The import rewrite
     (`@/components/ui/` to `@/components/ui-<edition>/`) stays, because the docs app installs
     three part copies side by side while a user's project has one; the code view keeps
     showing `@/components/ui/`.
   - Stories stay one set: they exercise the library API, identical across editions, and
     already run per edition through `ST_BASE`.
   - No edition rename: shadcn's own slugs are `base`, `radix`, `aria`
     (ui.shadcn.com/docs/components/<slug>/*, styles `base-nova`, `radix-nova`, `aria-nova`),
     already ours.
