#!/usr/bin/env node
// Usage (repo root): pnpm preview
//
// Everything at once, against local registries:
//   http://localhost:5310/r   package registry (`pnpm registry:dev`, .dev/r)
//   http://localhost:6006     Storybook, Radix UI
//   http://localhost:6007     Storybook, Base UI
//   http://localhost:5320     docs (`next dev`), whose /r and install commands
//                             point at localhost:5320
// Before the servers start it runs the docs `build` registry chain
// (registry:build, registry:items, then registry:hosted with
// REGISTRY_HOSTED_URL=http://localhost:5320/r). The servers run through
// concurrently with colored `[name]` prefixes. Ctrl-C stops everything,
// rewrites apps/shadcn-table-docs/public/r with the production URL and
// removes packages/shadcn-table/.dev.
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
const LOCAL_HOSTED_URL = 'http://localhost:5320/r';

const hosted = (env) =>
  step({
    name: 'hosted',
    command: 'node scripts/registry/hosted.mjs',
    cwd: PKG,
    env,
    prefixColor: 'gray',
  });

// The production URL again, whatever the shell exported.
const restoreHosted = async () => {
  delete process.env.REGISTRY_HOSTED_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  await hosted({});
};

try {
  await registryDev();
  await step({
    name: 'registry',
    command: 'pnpm registry:build',
    cwd: ROOT,
    prefixColor: 'blue',
  });
  await step({
    name: 'items',
    command: 'pnpm registry:items',
    cwd: ROOT,
    prefixColor: 'yellow',
  });
  await hosted({ REGISTRY_HOSTED_URL: LOCAL_HOSTED_URL });
} catch (error) {
  console.error(`preview: ${error.message}`);
  removeDev();
  await restoreHosted().catch(() => {});
  process.exit(failureCode());
}

await preview({
  commands: [
    ...packageChildren,
    {
      name: 'docs',
      command: 'pnpm dev',
      cwd: DOCS,
      env: { PORT: '5320' },
      prefixColor: 'green',
    },
  ],
  cleanup: async () => {
    await restoreHosted();
    removeDev();
  },
});
