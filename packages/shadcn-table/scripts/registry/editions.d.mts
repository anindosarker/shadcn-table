// Types of scripts/registry/editions.mjs for the TypeScript readers
// (vite.config.ts, .storybook/, the per-edition item definitions through
// lib.d.mts). Node and Vite run the .mjs; the editor and tsc check against
// these signatures, so the tuple below follows EDITIONS in editions.mjs.

/** Every edition, one tree each under registry/<edition>; radix first. */
export const EDITIONS: readonly ['radix', 'base', 'aria'];
export type Edition = (typeof EDITIONS)[number];
/** The edition every other one is compared against. */
export const REFERENCE_EDITION: 'radix';
/** Reader-facing name per edition ("Radix UI", "Base UI", "React Aria"). */
export const EDITION_LABELS: Readonly<Record<Edition, string>>;
/** The edition `value` names, or REFERENCE_EDITION when it names none. */
export function resolveEdition(value: unknown): Edition;
