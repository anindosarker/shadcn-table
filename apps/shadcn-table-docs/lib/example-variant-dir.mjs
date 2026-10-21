/**
 * Folders under examples/ holding the generated variants per base
 * (lib/example-variants.mjs writes them, components/example-variant.tsx and
 * components/dev-home import from them). Kept apart from the generator so
 * client code can import the names without its node:fs imports.
 */
export const VARIANT_DIRS = { radix: '.radix', base: '.base' };
