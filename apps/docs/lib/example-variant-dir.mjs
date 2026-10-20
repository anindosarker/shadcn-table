/**
 * Folder under examples/ holding the generated Base UI variants
 * (lib/example-variants.mjs writes it, lib/example-source.ts reads it and
 * components/example-variant.tsx imports from it). Kept apart from the
 * generator so client code can import the name without its node:fs imports.
 */
export const BASE_VARIANT_DIR = '.base';
