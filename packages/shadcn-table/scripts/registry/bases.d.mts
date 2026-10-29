// Types of scripts/registry/bases.mjs for the TypeScript readers
// (vite.config.ts, .storybook/, the per-base item definitions through
// lib.d.mts). Node and Vite run the .mjs; the editor and tsc check against
// these signatures, so the tuple below follows BASES in bases.mjs.

/**
 * Every base, one tree each under registry/<base>, in reader order: Base UI
 * first.
 */
export const BASES: readonly ['base', 'radix', 'aria'];
export type Base = (typeof BASES)[number];
/** The base every other one is compared against (the diff baseline). */
export const REFERENCE_BASE: 'radix';
/**
 * The base a reader sees before choosing: the docs tabs and the Storybook root
 * redirect.
 */
export const DEFAULT_BASE: 'base';
/** Reader-facing name per base ("Base UI", "Radix UI", "React Aria"). */
export const BASE_LABELS: Readonly<Record<Base, string>>;
/** `storybook dev` port per base: base 6007, radix 6006, aria 6008. */
export const BASE_PORTS: Readonly<Record<Base, number>>;
/** The base `value` names, or DEFAULT_BASE when it names none. */
export function resolveBase(value: unknown): Base;
/** Committed item name of a base's copy: `<name>-<base>` for every base. */
export function baseItemName(name: string, base: Base): string;
