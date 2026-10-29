// Types of scripts/registry/lib.mjs for the per-base item definitions
// (registry/<base>/registry.ts), which import the .mjs from TypeScript.
// Node strips the types at run time; the editor checks against these
// signatures.
import type { RegistryItem } from 'shadcn/schema';

declare global {
  interface ImportMeta {
    // Node 20.11+; not part of vite/client, the only type set the per-base
    // tsconfig loads.
    readonly dirname: string;
    readonly filename: string;
  }
}

/** Absolute path of packages/shadcn-table. */
export const PKG: string;
/** Absolute path of the repo root. */
export const ROOT: string;
/** Absolute path of the docs app. */
export const DOCS: string;
export {
  DEFAULT_BASE,
  BASE_LABELS,
  BASES,
  baseItemName,
  REFERENCE_BASE,
  resolveBase,
  type Base,
} from './bases.mjs';
export const GITHUB_REPO: string;
export const HOMEPAGE: string;
/** True when build.mjs runs with `--dev`. */
export const DEV: boolean;

export interface BaseDependency {
  name: string;
  /** Take the version from package.json instead of leaving it unversioned. */
  pinned?: boolean;
}

export interface BaseItemsOptions {
  /** The tree directory (registry/<base>). */
  dir: string;
  name: string;
  title: string;
  description: string;
  dependencies: BaseDependency[];
  devDependencies: BaseDependency[];
}

/**
 * The items of one base: the main item first, then one item per
 * non-English locale.
 */
export function buildBaseItems(base: BaseItemsOptions): RegistryItem[];

/**
 * The GitHub shorthand aliases: every DEFAULT_BASE item under its plain
 * name, same files and dependencies, a description naming the alias.
 */
export function aliasItems<T extends { name: string; description?: string }>(
  items: T[],
): T[];

/**
 * One base's main item and locale items in a catalog built from the
 * committed registry.json, aliases skipped.
 */
export function baseItems(
  catalog: { items: RegistryItem[] },
  base: string,
): { main: RegistryItem | undefined; locales: RegistryItem[] };

/**
 * One base's example items in the docs catalog (examples.mjs), each under
 * its hosted name, the plain `example-<slug>`; aliases skipped.
 */
export function baseExampleItems(
  catalog: { items: RegistryItem[] },
  base: string,
): RegistryItem[];
