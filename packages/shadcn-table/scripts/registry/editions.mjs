// The edition list: one complete library tree per edition, registry/<edition>.
// Every script and config that handles more than one edition reads it, in
// this order: the registry scripts (through lib.mjs), vite.config.ts and
// .storybook (ST_BASE, the edition switch), check-storybook.mjs, the release
// smoke (scripts/release/smoke.mjs) and the docs app's scripts/install.mjs
// and lib/example-variant-dir.mjs. No node imports, so Vite bundles it into
// the Storybook manager and preview. The types live in editions.d.mts.
//
// Two constants name one edition each, for two different jobs:
// - REFERENCE_EDITION is the diff baseline: check-bases.mjs compares every
//   other edition against it, each with its own list of files allowed to
//   differ (scripts/registry/<edition>-diff.json; the reference has none),
//   example-map.mjs and examples.mjs discover the example slugs in its
//   folder, and the tools build it when ST_BASE is unset.
// - DEFAULT_EDITION is what a reader sees before choosing: the docs edition
//   tabs open on it (apps/shadcn-table-docs/lib/install.ts, defaultBase) and
//   the Storybook root redirects to its build (vercel.json, written by hand
//   to match; smoke.mjs checks it after a deploy).
// No edition lives at the Storybook root: the static builds sit side by side
// under storybook-static/<edition>/ (`storybook:build`, `:base`, `:aria`).
export const EDITIONS = Object.freeze(['radix', 'base', 'aria']);
export const REFERENCE_EDITION = 'radix';
export const DEFAULT_EDITION = 'base';

// How each edition is named to readers: the Storybook chrome and edition
// switch, the release smoke's SKILL.md check.
export const EDITION_LABELS = Object.freeze({
  radix: 'Radix UI',
  base: 'Base UI',
  aria: 'React Aria',
});

// The edition a value such as process.env.ST_BASE names, the reference when
// it names none.
export const resolveEdition = (value) =>
  EDITIONS.find((edition) => edition === value) ?? REFERENCE_EDITION;

// The committed registry name of an edition's copy of an item:
// `<name>-<edition>` for every edition (the docs examples
// `example-basic-radix`, `example-basic-base`, `example-basic-aria`; the
// library items in registry/<edition>/registry.ts follow the same pattern by
// hand: `shadcn-table-radix`, `shadcn-table-base`, `shadcn-table-aria`). The
// plain name in the committed catalogs is a generated alias of the
// DEFAULT_EDITION item, for the GitHub shorthand
// `anindosarker/shadcn-table/<name>`, which cannot pick an edition
// (aliasItems in lib.mjs). The hosted registries (hosted.mjs) serve every
// edition under the plain name, one directory per edition, aliases skipped.
export const editionItemName = (name, edition) => `${name}-${edition}`;
