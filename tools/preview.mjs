#!/usr/bin/env node
// Usage: pnpm preview (repo root), or pnpm preview inside packages/shadcn-table
// (`node ../../tools/preview.mjs --package`).
//
// Root mode, everything at once, against local registries:
//   http://localhost:5310/r   package registry (`pnpm registry:dev`, .dev/r)
//   http://localhost:6007     Storybook, Base UI
//   http://localhost:6006     Storybook, Radix UI
//   http://localhost:6008     Storybook, React Aria
//   http://localhost:5330     docs production build (the docs `pnpm preview`,
//                             .next-preview), whose /r and install commands
//                             point at localhost:5330
// The package registry is built first; then the registry server and the
// three Storybooks start while the docs build. The docs `build` script runs the
// registry chain (registry:build, registry:items, registry:hosted with
// REGISTRY_HOSTED_URL=http://localhost:5330/r) before `next build`, then
// `next start` serves the result. Ctrl-C stops everything, rewrites
// apps/shadcn-table-docs/public/r with the production URL and removes
// packages/shadcn-table/.dev.
//
// Package mode (`--package`): builds the local registry (.dev/r), then serves
// it on http://localhost:5310/r and starts Storybook for every base (Base UI
// on 6007, Radix UI on 6006, React Aria on 6008, BASE_PORTS). Ctrl-C stops
// everything and removes .dev.
//
// Commands are concurrently command objects
// ({ name, command, cwd, env, prefixColor }); `preview` runs them through
// concurrently with colored `[name]` prefixes. Ctrl-C, SIGTERM or any command
// exiting non-zero stops the rest, then `cleanup()` runs once and the process
// exits (130 on Ctrl-C).
import { concurrently } from 'concurrently';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_PORTS, BASES } from './registry/bases.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PKG = path.join(ROOT, 'packages/shadcn-table');
const DOCS = path.join(ROOT, 'apps/shadcn-table-docs');
const LOCAL_SITE_URL = 'http://localhost:5330';
// Commands run in PKG, so the binaries resolve relative to it. concurrently
// strips a command's outer quotes, so keep the strings unquoted.
const BIN = 'node_modules/.bin';
const ROOT_BIN = '../../node_modules/.bin';

const OPTIONS = {
  prefix: 'name',
  prefixColors: 'auto',
  killOthersOn: ['failure'],
  handleInput: false,
  successCondition: 'all',
};

// concurrently forwards these signals to the commands and reports a Ctrl-C
// exit as a success, so remember the first one to pick the exit code (and to
// keep Node alive while cleanup runs).
const EXIT_CODES = { SIGINT: 130, SIGTERM: 143, SIGHUP: 129 };
let caught;
for (const signal of Object.keys(EXIT_CODES)) {
  process.on(signal, () => {
    caught ??= signal;
  });
}

/** Runs one command to completion; rejects on a non-zero exit or a signal. */
const step = async (command) => {
  let events;
  try {
    events = await concurrently([command], OPTIONS).result;
  } catch {
    throw new Error(`${command.name} failed`);
  }
  if (events.some((event) => event.killed)) {
    throw new Error(`${command.name} stopped by ${caught ?? 'a signal'}`);
  }
};

/** Exit code for a failed setup step: 130 on Ctrl-C, else 1. */
const failureCode = () => EXIT_CODES[caught] ?? 1;

/**
 * Runs every command until Ctrl-C or a failure, then `cleanup()` once.
 * @param {{ commands: Array<{ name: string, command: string, cwd?: string, env?: Record<string, string>, prefixColor?: string }>, cleanup?: () => unknown }} options
 */
const preview = async ({ commands, cleanup = () => {} }) => {
  let code = 0;
  try {
    await concurrently(commands, OPTIONS).result;
  } catch {
    code = 1;
  } finally {
    try {
      await cleanup();
    } catch (error) {
      console.error(`preview: cleanup failed: ${error.message}`);
      code ||= 1;
    }
  }
  process.exit(EXIT_CODES[caught] ?? code);
};

/** `pnpm registry:dev`: .dev/registry.json, then .dev/r. */
const registryDev = async () => {
  await step({
    name: 'registry',
    command: 'node tools/registry/build.mjs --dev',
    cwd: ROOT,
    prefixColor: 'blue',
  });
  await step({
    name: 'registry',
    command: `${BIN}/shadcn build .dev/registry.json --output .dev/r`,
    cwd: PKG,
    prefixColor: 'blue',
  });
};

const removeDev = () =>
  fs.rmSync(path.join(PKG, '.dev'), { recursive: true, force: true });

/** Prefix colour of each base's Storybook child. */
const STORYBOOK_COLORS = { base: 'cyan', radix: 'magenta', aria: 'yellow' };

/**
 * Registry server on 5310 and Storybook for every base, each on its BASE_PORTS
 * port (the package.json `storybook:<base>` scripts and the dev links in
 * .storybook/base-tool.ts).
 */
const packageChildren = [
  {
    name: 'registry',
    command: `${ROOT_BIN}/serve .dev -l 5310`,
    cwd: PKG,
    prefixColor: 'blue',
  },
  ...BASES.map((base) => ({
    name: `storybook:${base}`,
    command: `${BIN}/storybook dev -p ${BASE_PORTS[base]} --no-open`,
    cwd: PKG,
    env: { ST_BASE: base },
    prefixColor: STORYBOOK_COLORS[base],
  })),
];

// The production URL again, whatever the shell exported.
const restoreHosted = async () => {
  delete process.env.REGISTRY_HOSTED_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;
  await step({
    name: 'hosted',
    command: 'node tools/registry/hosted.mjs',
    cwd: ROOT,
    prefixColor: 'gray',
  });
};

const PACKAGE_MODE = process.argv.includes('--package');

try {
  await registryDev();
} catch (error) {
  console.error(`preview: ${error.message}`);
  removeDev();
  process.exit(failureCode());
}

if (PACKAGE_MODE) {
  await preview({ commands: packageChildren, cleanup: removeDev });
} else {
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
}
