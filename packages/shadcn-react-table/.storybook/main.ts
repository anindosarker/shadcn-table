import { createRequire } from 'node:module';
import { dirname, join } from 'path';
import type { StorybookConfig } from '@storybook/react-vite';

const require = createRequire(import.meta.url);

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
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
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
