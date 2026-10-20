import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig, { ST_BASE } from './vite.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Every story in ./stories runs as a render test in headless Chromium through
// Storybook's Vitest addon. See .ai/plans/storybook-tests/anindosarker/storybook-tests-plan.md.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
              // Only used in watch mode, and only when nothing already serves
              // storybookUrl. 6306 keeps clear of the dev Storybook on 6006.
              storybookScript: 'storybook dev -p 6306 --ci',
              storybookUrl: 'http://localhost:6306',
            }),
            {
              // The addon sets one sb-vitest dep cache for the config dir;
              // test and test:base must not share it (stale deps after a
              // base switch show up as "Failed to fetch dynamically imported
              // module"). One cache per edition, like main.ts does for dev.
              name: 'st-base-cache-dir',
              enforce: 'post',
              config: (config) =>
                config.cacheDir
                  ? { cacheDir: `${config.cacheDir}-${ST_BASE}` }
                  : undefined,
            },
          ],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              provider: playwright({}),
              headless: true,
              instances: [{ browser: 'chromium' }],
            },
            setupFiles: ['./.storybook/vitest.setup.ts'],
          },
        },
      ],
    },
  }),
);
