#!/usr/bin/env node
// Usage (inside packages/shadcn-table): pnpm preview
//
// Package preview: builds the local registry (`pnpm registry:dev`, .dev/r),
// then serves it on http://localhost:5310/r and starts Storybook for every
// edition (Radix UI on 6006, Base UI on 6007, React Aria on 6008). Ctrl-C
// stops everything and removes .dev.
//
// Also exports the helpers the root `pnpm preview` (scripts/preview.mjs)
// uses. Commands are concurrently command objects
// ({ name, command, cwd, env, prefixColor }); `preview` runs them through
// concurrently with colored `[name]` prefixes. Ctrl-C, SIGTERM or any command
// exiting non-zero stops the rest, then `cleanup()` runs once and the process
// exits (130 on Ctrl-C).
import { concurrently } from 'concurrently';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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
export const step = async (command) => {
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
export const failureCode = () => EXIT_CODES[caught] ?? 1;

/**
 * Runs every command until Ctrl-C or a failure, then `cleanup()` once.
 * @param {{ commands: Array<{ name: string, command: string, cwd?: string, env?: Record<string, string>, prefixColor?: string }>, cleanup?: () => unknown }} options
 */
export const preview = async ({ commands, cleanup = () => {} }) => {
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
export const registryDev = async () => {
  await step({
    name: 'registry',
    command: 'node scripts/registry/build.mjs --dev',
    cwd: PKG,
    prefixColor: 'blue',
  });
  await step({
    name: 'registry',
    command: `${BIN}/shadcn build .dev/registry.json --output .dev/r`,
    cwd: PKG,
    prefixColor: 'blue',
  });
};

export const removeDev = () =>
  fs.rmSync(path.join(PKG, '.dev'), { recursive: true, force: true });

/** Registry server on 5310 and Storybook for every edition. */
export const packageChildren = [
  {
    name: 'registry',
    command: `${ROOT_BIN}/serve .dev -l 5310`,
    cwd: PKG,
    prefixColor: 'blue',
  },
  {
    name: 'storybook',
    command: `${BIN}/storybook dev -p 6006 --no-open`,
    cwd: PKG,
    prefixColor: 'magenta',
  },
  {
    name: 'storybook:base',
    command: `${BIN}/storybook dev -p 6007 --no-open`,
    cwd: PKG,
    env: { ST_BASE: 'base' },
    prefixColor: 'cyan',
  },
  {
    name: 'storybook:aria',
    command: `${BIN}/storybook dev -p 6008 --no-open`,
    cwd: PKG,
    env: { ST_BASE: 'aria' },
    prefixColor: 'yellow',
  },
];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    await registryDev();
  } catch (error) {
    console.error(`preview: ${error.message}`);
    removeDev();
    process.exit(failureCode());
  }
  await preview({ commands: packageChildren, cleanup: removeDev });
}
