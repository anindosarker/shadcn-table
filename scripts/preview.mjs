#!/usr/bin/env node
// Usage (repo root): pnpm preview
//
// Everything at once, against local registries:
//   http://localhost:5310/r   package registry (`pnpm registry:dev`, .dev/r)
//   http://localhost:6006     Storybook, Radix UI
//   http://localhost:6007     Storybook, Base UI
//   http://localhost:6008     Storybook, React Aria
//   http://localhost:5330     docs production build (the docs `pnpm preview`,
//                             .next-preview), whose /r and install commands
//                             point at localhost:5330
// The package registry is built first; then the registry server and the
// three Storybooks start while the docs build. The docs `build` script runs the
// registry chain (registry:build, registry:items, registry:hosted with
// REGISTRY_HOSTED_URL=http://localhost:5330/r) before `next build`, then
// `next start` serves the result. The servers run through concurrently with
// colored `[name]` prefixes; a failing docs build stops the rest. Ctrl-C
// stops everything, rewrites apps/shadcn-table-docs/public/r with the
// production URL and removes packages/shadcn-table/.dev.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  failureCode,
  packageChildren,
  preview,
  registryDev,
  removeDev,
  step,
} from '../packages/shadcn-table/scripts/preview.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG = path.join(ROOT, 'packages/shadcn-table');
const DOCS = path.join(ROOT, 'apps/shadcn-table-docs');
const LOCAL_SITE_URL = 'http://localhost:5330';

// The production URL again, whatever the shell exported.
const restoreHosted = async () => {
  delete process.env.REGISTRY_HOSTED_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  await step({
    name: 'hosted',
    command: 'node scripts/registry/hosted.mjs',
    cwd: PKG,
    prefixColor: 'gray',
  });
};

try {
  await registryDev();
} catch (error) {
  console.error(`preview: ${error.message}`);
  removeDev();
  process.exit(failureCode());
}

await preview({
  commands: [
    ...packageChildren,
    {
      name: 'docs',
      command: 'pnpm preview',
      cwd: DOCS,
      env: {
        REGISTRY_HOSTED_URL: `${LOCAL_SITE_URL}/r`,
        NEXT_PUBLIC_SITE_URL: LOCAL_SITE_URL,
      },
      prefixColor: 'green',
    },
  ],
  cleanup: async () => {
    await restoreHosted();
    removeDev();
  },
});
