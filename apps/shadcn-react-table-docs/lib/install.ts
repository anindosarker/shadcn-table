// Install commands and the agent prompt for the library item. Pure: safe to
// import from server components and from the page checks' expectations.
import { gitConfig, libraryItem, registryRef, siteUrl } from './shared';

export const packageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof packageManagers)[number];

const runners: Record<PackageManager, string> = {
  pnpm: 'pnpm dlx shadcn@latest',
  npm: 'npx shadcn@latest',
  yarn: 'yarn shadcn@latest',
  bun: 'bunx --bun shadcn@latest',
};

/** `shadcn add` of a registry item with the given package manager. */
export const addCommand = (item: string, pm: PackageManager = 'pnpm') =>
  `${runners[pm]} add ${registryRef(item)}`;

/** `shadcn init` for a project that has no shadcn/ui yet (Radix base). */
export const initCommand = (pm: PackageManager = 'pnpm') =>
  `${runners[pm]} init --base radix`;

/** Where `shadcn add` puts the table (registry.json `target`). */
export const installDir = `components/ui/${libraryItem}`;

/** The one-line prompt behind "Copy prompt": the skill file holds the rest. */
export const agentPrompt = `Install shadcn-react-table in my app: ${siteUrl}/SKILL.md`;

/** Installs the same skill file into the agent's skills directory. */
export const skillInstallCommand = `npx skills add ${gitConfig.user}/${gitConfig.repo}`;
