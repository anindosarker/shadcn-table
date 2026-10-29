// Types of scripts/registry/editions.mjs for the TypeScript readers
// (vite.config.ts, .storybook/, the per-edition item definitions through
// lib.d.mts). Node and Vite run the .mjs; the editor and tsc check against
// these signatures, so the tuple below follows EDITIONS in editions.mjs.

/** Every edition, one tree each under registry/<edition>, in reader order: Base UI first. */
export const EDITIONS: readonly ['base', 'radix', 'aria'];
export type Edition = (typeof EDITIONS)[number];
/** The edition every other one is compared against (the diff baseline). */
export const REFERENCE_EDITION: 'radix';
/** The edition a reader sees before choosing: the docs tabs and the Storybook root redirect. */
export const DEFAULT_EDITION: 'base';
/** Reader-facing name per edition ("Base UI", "Radix UI", "React Aria"). */
export const EDITION_LABELS: Readonly<Record<Edition, string>>;
/** `storybook dev` port per edition: base 6007, radix 6006, aria 6008. */
export const EDITION_PORTS: Readonly<Record<Edition, number>>;
/** The edition `value` names, or DEFAULT_EDITION when it names none. */
export function resolveEdition(value: unknown): Edition;
/** Committed item name of an edition's copy: `<name>-<edition>` for every edition. */
export function editionItemName(name: string, edition: Edition): string;
