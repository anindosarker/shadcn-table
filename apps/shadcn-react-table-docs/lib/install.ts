// Install commands and the agent prompt for the library item. Pure: safe to
// import from server components and from the page checks' expectations.
import { absoluteMarkdownUrl, libraryItem, registryRef } from './shared';

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

/** The prompt behind "Copy prompt" on the install page. */
export const buildLibraryInstallPrompt = () =>
  [
    'Install shadcn-react-table, a data table for shadcn/ui built on TanStack Table, into this project.',
    '',
    '1. Requirements: a shadcn/ui project on the Radix base with Tailwind CSS v4 and React 18 or newer.',
    `   No shadcn/ui yet: run ${initCommand()} first.`,
    `2. Run: ${addCommand(libraryItem)}`,
    `   It copies the table into ${installDir}/ and adds the shadcn/ui parts and npm dependencies it needs.`,
    '3. Render a first table where it belongs:',
    `   import { ShadcnReactTable } from '@/${installDir}';`,
    '   <ShadcnReactTable columns={columns} data={data} />',
    `   Column and data shapes: ${absoluteMarkdownUrl(['getting-started', 'usage'])}`,
    `   Every option: ${absoluteMarkdownUrl(['api', 'table-options'])}`,
    '4. Verify: the project type-checks and the table renders its rows.',
  ].join('\n');
