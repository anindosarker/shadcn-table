// Types of scripts/registry/lib.mjs for the per-edition item definitions
// (registry/<edition>/registry.ts), which import the .mjs from TypeScript.
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
  EDITION_LABELS,
  EDITIONS,
  editionItemName,
  REFERENCE_EDITION,
  resolveEdition,
  type Edition,
} from './editions.mjs';
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
export function baseItems(base: BaseItemsOptions): RegistryItem[];

/**
 * One edition's main item and locale items in a catalog built from the
 * committed registry.json.
 */
export function editionItems(
  catalog: { items: RegistryItem[] },
  edition: string,
): { main: RegistryItem | undefined; locales: RegistryItem[] };

/**
 * One edition's example items in the docs catalog (examples.mjs), each under
 * its hosted name, the plain `example-<slug>`.
 */
export function editionExampleItems(
  catalog: { items: RegistryItem[] },
  edition: string,
): RegistryItem[];
