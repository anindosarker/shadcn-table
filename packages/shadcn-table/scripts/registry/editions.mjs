// The edition list: one complete library tree per edition, registry/<edition>.
// Every script and config that handles more than one edition reads it, in
// this order: the registry scripts (through lib.mjs), vite.config.ts and
// .storybook (ST_BASE, the edition switch), check-storybook.mjs, the release
// smoke (scripts/release/smoke.mjs) and the docs app's scripts/install.mjs
// and lib/example-variant-dir.mjs. No node imports, so Vite bundles it into
// the Storybook manager and preview. The types live in editions.d.mts.
//
// Radix is the reference: check-bases.mjs compares every other edition
// against it, each with its own list of files allowed to differ
// (scripts/registry/<edition>-diff.json; the reference has none). It is also
// the default build of the tools (ST_BASE unset) and the root of the static
// Storybook, every other edition under <edition>/.
export const EDITIONS = Object.freeze(['radix', 'base', 'aria']);
export const REFERENCE_EDITION = 'radix';

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

// The committed registry name of an edition's copy of an item: the plain
// name for the reference edition, `<name>-<edition>` for every other
// (`shadcn-table`, `shadcn-table-base`, `shadcn-table-aria`; the docs
// examples `example-basic`, `example-basic-base`, `example-basic-aria`).
// The hosted registries (hosted.mjs) serve every edition under the plain
// name, one directory per edition.
export const editionItemName = (name, edition) =>
  edition === REFERENCE_EDITION ? name : `${name}-${edition}`;
