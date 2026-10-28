import {
  EDITION_LABELS,
  EDITIONS,
} from '../../../packages/shadcn-table/scripts/registry/editions.mjs';

/**
 * The stored value of the site-wide fumadocs tab group `base` per edition
 * (packages/shadcn-table/scripts/registry/editions.mjs): the edition's
 * label escaped the way fumadocs' simple-mode Tabs escape theirs (lower
 * case, the first space a hyphen). components/base-selector.tsx reads and
 * writes it; scripts/check-pages.mjs stores it to open every page with that
 * edition selected. Plain ESM so the Node script can import it without a
 * TypeScript loader.
 * @type {Readonly<Record<import('../../../packages/shadcn-table/scripts/registry/editions.mjs').Edition, string>>}
 */
export const TAB_VALUES = Object.freeze(
  Object.fromEntries(
    EDITIONS.map((edition) => [
      edition,
      EDITION_LABELS[edition].toLowerCase().replace(/\s/, '-'),
    ]),
  ),
);
