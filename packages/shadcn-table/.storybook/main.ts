import { createRequire } from 'node:module';
import { dirname, join } from 'path';
import type { StorybookConfig } from '@storybook/react-vite';
import { BASE_LABELS, resolveBase } from '../../../tools/registry/bases.mjs';
import { storySourcePlugin } from './story-source-plugin';

const require = createRequire(import.meta.url);

// Which tree this Storybook shows (vite.config.ts aliases `@/` by the same
// variable). Handed to the manager and the preview as a global so themes.ts can
// label the chrome: the three builds are served side by side under /base/,
// /radix/ and /aria/, and the title is what tells them apart. Unset ST_BASE
// means the default base (resolveBase). The manager also gets whether this is
// `storybook dev` (one port per base) or a static build (one directory per
// base), which decides where its base switch goes (base-tool.ts).
const ST_BASE = resolveBase(process.env.ST_BASE);
const baseScript = `<script>window.__ST_BASE__ = ${JSON.stringify(ST_BASE)};</script>`;
// The search head of the manager page (D1): each base is its own search entry
// under its own address, whatever `?path=` the address carries.
const ST_BASE_LABEL = BASE_LABELS[ST_BASE];
const STORYBOOK_ORIGIN = 'https://storybook.shadcn-table.com';
const searchHead =
  `<meta name="description" content="shadcn-table Storybook for ${ST_BASE_LABEL}: the live stories of every table feature, each with its code.">` +
  `<link rel="canonical" href="${STORYBOOK_ORIGIN}/${ST_BASE}/">`;
// The library version, for the toolbar (version-tool.ts, D150): read from the
// package file as the docs header reads it, never typed.
const { version: ST_VERSION } = require('../package.json') as {
  version: string;
};
const versionScript = `<script>window.__ST_VERSION__ = ${JSON.stringify(ST_VERSION)};</script>`;
const devScript = (dev: boolean) =>
  `<script>window.__ST_DEV__ = ${JSON.stringify(dev)};</script>`;
// The preview gets whether this is a static build, which resets each story
// after its play (preview.tsx). Vitest loads no configType, so it stays false.
const staticScript = (isStatic: boolean) =>
  `<script>window.__ST_STATIC__ = ${JSON.stringify(isStatic)};</script>`;

/** Resolve the absolute path of a package (monorepo-safe). */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  // The static <title> of the manager page, as the sidebar brand names it
  // (themes.ts brandTitle); Storybook appends " - Storybook".
  title: `shadcn-table (${ST_BASE_LABEL})`,
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('storybook-dark-mode'),
    {
      name: getAbsolutePath('@storybook/addon-docs'),
      // No `docs.source.originalSource`: the Code tab would show the story as
      // written, with its play, until the code text arrives (spec 66, D142).
      options: { csfPluginOptions: { disableSource: true } },
    },
    getAbsolutePath('@storybook/addon-mcp'),
    getAbsolutePath('@storybook/addon-vitest'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  managerHead: (head, { configType }) =>
    `${head}${baseScript}${versionScript}${devScript(configType !== 'PRODUCTION')}${searchHead}`,
  previewHead: (head, { configType }) =>
    `${head}${baseScript}${versionScript}${staticScript(configType === 'PRODUCTION')}`,
  // Storybook keys its Vite dep cache by the config dir alone, so the base
  // servers (storybook:all) would share one optimized-deps dir and invalidate
  // each other ("Failed to fetch dynamically imported module"). One cache per
  // base. The story code texts of the Code tab come from
  // `virtual:story-sources` (story-source-plugin.ts, spec 66).
  viteFinal: (config) => ({
    ...config,
    ...(config.cacheDir ? { cacheDir: `${config.cacheDir}-${ST_BASE}` } : {}),
    plugins: [...(config.plugins ?? []), storySourcePlugin({ base: ST_BASE })],
  }),
  features: {
    // Components manifest for the MCP addon's docs tools.
    componentsManifest: true,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    // The docgen plugin only knows files matched by its own globs (which skip
    // dot-dirs), so exclude .storybook/ to silence the "Skipping docgen for
    // preview.tsx" warning. Stories are excluded by default already.
    reactDocgenTypescriptOptions: {
      exclude: ['**/*.stories.tsx', '**/.storybook/**'],
    },
  },
};

export default config;
