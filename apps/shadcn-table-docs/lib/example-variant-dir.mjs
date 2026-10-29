import { BASES } from '../../../packages/shadcn-table/scripts/registry/bases.mjs';

/**
 * Folders under examples/ holding the generated variants per base, one per base
 * (packages/shadcn-table/scripts/registry/bases.mjs), named `.<base>`
 * (lib/example-variants.mjs writes them, components/example-variant.tsx and
 * components/dev-home import from them). Kept apart from the generator so
 * client code can import the names without its node:fs imports.
 */
export const VARIANT_DIRS = Object.fromEntries(
  BASES.map((base) => [base, `.${base}`]),
);
