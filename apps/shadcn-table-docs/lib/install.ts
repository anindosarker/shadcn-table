// Install commands and the agent prompt for the library item. Pure: safe to
// import from server components, client components and the page checks'
// expectations.
import {
  DEFAULT_BASE,
  BASE_LABELS,
  BASES,
  type Base,
} from '../../../packages/shadcn-table/scripts/registry/bases.mjs';
import { gitConfig, libraryItem, siteUrl } from './shared';

export const packageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof packageManagers)[number];

const runners: Record<PackageManager, string> = {
  pnpm: 'pnpm dlx shadcn@latest',
  npm: 'npx shadcn@latest',
  yarn: 'yarn shadcn@latest',
  bun: 'bunx --bun shadcn@latest',
};

/**
 * The shadcn bases the table supports, as `shadcn init --base` names them,
 * in reader order: the library's BASES (Base UI, Radix UI, React Aria).
 * The docs' base selector (components/base-selector.tsx) picks one; a
 * project's base is the `style` in its `components.json` (`base-*`,
 * `radix-*` or `aria-*`, the React Aria base's style being `aria-nova`).
 */
export const bases = BASES;
export type { Base };
/** The base shown before the reader picks one (DEFAULT_BASE, Base UI). */
export const defaultBase: Base = DEFAULT_BASE;

/** Reader-facing name per base, the library's BASE_LABELS. */
export const baseLabels: Readonly<Record<Base, string>> = BASE_LABELS;

export const isBase = (value: unknown): value is Base =>
  bases.includes(value as Base);

/** The same value for every base, keyed by base. */
export const perBase = <T>(fn: (base: Base) => T): Record<Base, T> =>
  Object.fromEntries(bases.map((base) => [base, fn(base)])) as Record<Base, T>;

/**
 * Hosted registry item for a base: `pnpm registry:hosted`
 * (packages/shadcn-table/scripts/registry/hosted.mjs) serves
 * every base under the same item names, `/r/radix/<item>.json`,
 * `/r/base/<item>.json` and `/r/aria/<item>.json`.
 */
export const itemUrl = (item: string, base: Base = defaultBase) =>
  `${siteUrl}/r/${base}/${item}.json`;

/** `shadcn add` of a registry item on a base with the given package manager. */
export const addCommand = (
  item: string,
  base: Base = defaultBase,
  pm: PackageManager = 'pnpm',
) => `${runners[pm]} add ${itemUrl(item, base)}`;

/** `shadcn add` of the library item for a base. */
export const libraryAddCommand = (
  base: Base = defaultBase,
  pm: PackageManager = 'pnpm',
) => addCommand(libraryItem, base, pm);

/** `shadcn add` of a locale item (`shadcn-table-locale-<code>`) for a base. */
export const localeAddCommand = (
  code: string,
  base: Base = defaultBase,
  pm: PackageManager = 'pnpm',
) => addCommand(`${libraryItem}-locale-${code}`, base, pm);

/** `shadcn add` of a docs example item (`example-<name>`) for a base. */
export const exampleAddCommand = (
  name: string,
  base: Base = defaultBase,
  pm: PackageManager = 'pnpm',
) => addCommand(`example-${name}`, base, pm);

/** `shadcn init` for a project that has no shadcn/ui yet, on the given base. */
export const initCommand = (
  base: Base = defaultBase,
  pm: PackageManager = 'pnpm',
) => `${runners[pm]} init --base ${base}`;

/**
 * Namespace form, the alternative to the direct URL: register the registry
 * once, then add items by name. `{style}` is the project's shadcn style
 * (`radix-nova`, `base-sera`, `aria-nova`, ...), which the site maps onto
 * the base.
 */
export const registryNamespace = 'st';

export const registryAddCommand = (pm: PackageManager = 'pnpm') =>
  `${runners[pm]} registry add @${registryNamespace}=${siteUrl}/r/{style}/{name}.json`;

export const namespaceAddCommand = (
  item: string = libraryItem,
  pm: PackageManager = 'pnpm',
) => `${runners[pm]} add @${registryNamespace}/${item}`;

/** Where `shadcn add` puts the table (registry.json `target`). */
export const installDir = `components/ui/${libraryItem}`;

/** The one-line prompt behind "Copy prompt": the skill file holds the rest. */
export const agentPrompt = `Install shadcn-table in my app: ${siteUrl}/SKILL.md`;

/** Installs the same skill file into the agent's skills directory. */
export const skillInstallCommand = `npx skills add ${gitConfig.user}/${gitConfig.repo}`;
