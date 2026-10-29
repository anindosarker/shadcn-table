import {
  BASE_LABELS,
  BASES,
} from '../../../packages/shadcn-table/scripts/registry/bases.mjs';

/**
 * The stored value of the site-wide fumadocs tab group `base` per base
 * (packages/shadcn-table/scripts/registry/bases.mjs): the base's label escaped
 * the way fumadocs' simple-mode Tabs escape theirs (lower case, the first space
 * a hyphen). components/base-selector.tsx reads and writes it;
 * scripts/check-pages.mjs stores it to open every page with that base selected.
 * Plain ESM so the Node script can import it without a TypeScript loader.
 * @type {Readonly<Record<import('../../../packages/shadcn-table/scripts/registry/bases.mjs').Base, string>>}
 */
export const TAB_VALUES = Object.freeze(
  Object.fromEntries(
    BASES.map((base) => [
      base,
      BASE_LABELS[base].toLowerCase().replace(/\s/, '-'),
    ]),
  ),
);
