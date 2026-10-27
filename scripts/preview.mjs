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
// REGISTRY_HOSTED_URL=http://localhost:5320/r). Ctrl-C stops everything,
// rewrites apps/shadcn-table-docs/public/r with the production URL and
// removes packages/shadcn-table/.dev.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  packageChildren,
  registryDev,
  removeDev,
  run,
  step,
} from '../packages/shadcn-table/scripts/preview.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG = path.join(ROOT, 'packages/shadcn-table');
const DOCS = path.join(ROOT, 'apps/shadcn-table-docs');
const LOCAL_HOSTED_URL = 'http://localhost:5320/r';

const hosted = (env) =>
  step({
    name: 'hosted',
    cmd: process.execPath,
    args: [path.join(PKG, 'scripts/registry/hosted.mjs')],
    env,
  });

// The production URL again, whatever the shell exported.
const restoreHosted = async () => {
  delete process.env.REGISTRY_HOSTED_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  await hosted({});
};

try {
  await registryDev();
  await step({ name: 'registry', cmd: 'pnpm', args: ['registry:build'] });
  await step({ name: 'items', cmd: 'pnpm', args: ['registry:items'] });
  await hosted({ REGISTRY_HOSTED_URL: LOCAL_HOSTED_URL });
} catch (error) {
  console.error(`preview: ${error.message}`);
  removeDev();
  await restoreHosted().catch(() => {});
  process.exit(1);
}

await run({
  children: [
    ...packageChildren,
    {
      name: 'docs',
      cmd: 'pnpm',
      args: ['dev'],
      cwd: DOCS,
      env: { PORT: '5320' },
    },
  ],
  cleanup: async () => {
    await restoreHosted();
    removeDev();
  },
});
