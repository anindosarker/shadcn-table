import { createRequire } from 'node:module';
import { dirname, join } from 'path';
import type { StorybookConfig } from '@storybook/react-vite';
import { resolveEdition } from '../scripts/registry/editions.mjs';

const require = createRequire(import.meta.url);

// Which tree this Storybook shows (vite.config.ts aliases `@/` by the same
// variable). Handed to the manager and the preview as a global so themes.ts
// can label the chrome: the three builds are served side by side under
// /radix/, /base/ and /aria/, and the title is what tells them apart. The
// manager also gets
// whether this is `storybook dev` (one port per edition) or a static build
// (one directory per edition), which decides where its edition button goes
// (edition-tool.ts).
const ST_BASE = resolveEdition(process.env.ST_BASE);
const baseScript = `<script>window.__ST_BASE__ = ${JSON.stringify(ST_BASE)};</script>`;
const devScript = (dev: boolean) =>
  `<script>window.__ST_DEV__ = ${JSON.stringify(dev)};</script>`;

/** Resolve the absolute path of a package (monorepo-safe). */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('storybook-dark-mode'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-mcp'),
    getAbsolutePath('@storybook/addon-vitest'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  managerHead: (head, { configType }) =>
    `${head}${baseScript}${devScript(configType !== 'PRODUCTION')}`,
  previewHead: (head) => `${head}${baseScript}`,
  // Storybook keys its Vite dep cache by the config dir alone, so the
  // edition servers (storybook:all) would share one optimized-deps dir
  // and invalidate each other ("Failed to fetch dynamically imported
  // module"). One cache per edition.
  viteFinal: (config) =>
    config.cacheDir
      ? { ...config, cacheDir: `${config.cacheDir}-${ST_BASE}` }
      : config,
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
