// The base list: one complete library tree per base, registry/<base>,
// and the one source of the order readers see them in (Base UI, Radix UI,
// React Aria): the docs base selector and tabs, the Storybook base
// switch and every script that loops over bases. Every script and config
// that handles more than one base reads it: the registry scripts (through
// lib.mjs), vite.config.ts and .storybook (ST_BASE, the base switch),
// check-storybook.mjs, the release smoke (scripts/release/smoke.mjs) and the
// docs app's scripts/install.mjs and lib/example-variant-dir.mjs. No node
// imports, so Vite bundles it into the Storybook manager and preview. The
// types live in bases.d.mts.
//
// Two constants name one base each, for two different jobs:
// - REFERENCE_BASE is the diff baseline: check-bases.mjs compares every
//   other base against it, each with its own list of files allowed to
//   differ (scripts/registry/<base>-diff.json; the reference has none),
//   example-map.mjs and examples.mjs discover the example slugs in its
//   folder. Hand edits land in its tree first.
// - DEFAULT_BASE is what a reader sees before choosing: the docs base
//   tabs open on it (apps/shadcn-table-docs/lib/install.ts, defaultBase),
//   the Storybook root redirects to its build (vercel.json, written by hand
//   to match; smoke.mjs checks it after a deploy) and the tools build it
//   when ST_BASE is unset (resolveBase).
// No base lives at the Storybook root: the static builds sit side by side
// under storybook-static/<base>/ (`storybook:build:<base>`).
export const BASES = Object.freeze(['base', 'radix', 'aria']);
export const REFERENCE_BASE = 'radix';
export const DEFAULT_BASE = 'base';

// How each base is named to readers: the Storybook chrome and base
// switch, the release smoke's SKILL.md check.
export const BASE_LABELS = Object.freeze({
  base: 'Base UI',
  radix: 'Radix UI',
  aria: 'React Aria',
});

// The `storybook dev` port of each base, keyed by name so the order above
// never moves one: the package.json `storybook:<base>` scripts (written by
// hand to match), scripts/preview.mjs and the dev links in
// .storybook/base-tool.ts.
export const BASE_PORTS = Object.freeze({
  base: 6007,
  radix: 6006,
  aria: 6008,
});

// The base a value such as process.env.ST_BASE names, the default base
// when it names none.
export const resolveBase = (value) =>
  BASES.find((base) => base === value) ?? DEFAULT_BASE;

// The committed registry name of a base's copy of an item:
// `<name>-<base>` for every base (the docs examples
// `example-basic-base`, `example-basic-radix`, `example-basic-aria`; the
// library items in registry/<base>/registry.ts follow the same pattern by
// hand: `shadcn-table-base`, `shadcn-table-radix`, `shadcn-table-aria`). The
// plain name in the committed catalogs is a generated alias of the
// DEFAULT_BASE item, for the GitHub shorthand
// `anindosarker/shadcn-table/<name>`, which cannot pick a base
// (aliasItems in lib.mjs). The hosted registries (hosted.mjs) serve every
// base under the plain name, one directory per base, aliases skipped.
export const baseItemName = (name, base) => `${name}-${base}`;
