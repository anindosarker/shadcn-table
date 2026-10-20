// Types of registry/lib.mjs for the per-base item definitions
// (bases/<base>/registry.ts), which import the .mjs from TypeScript. Node
// strips the types at run time; the editor checks against these signatures.
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
  /** The base directory (bases/<base>). */
  dir: string;
  name: string;
  title: string;
  description: string;
  dependencies: BaseDependency[];
  devDependencies: BaseDependency[];
  /** shadcn parts shipped as item files instead of registryDependencies. */
  forkedUi: string[];
}

/**
 * The items of one base: the main item first, then one item per
 * non-English locale.
 */
export function baseItems(base: BaseItemsOptions): RegistryItem[];
