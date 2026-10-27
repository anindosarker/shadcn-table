#!/usr/bin/env node
// Usage (inside packages/shadcn-table): pnpm preview
//
// Package preview: builds the local registry (`pnpm registry:dev`, .dev/r),
// then serves it on http://localhost:5310/r and starts Storybook for both
// bases (Radix UI on 6006, Base UI on 6007). Ctrl-C stops everything and
// removes .dev.
//
// Also exports `run`, the small process runner the root `pnpm preview`
// (scripts/preview.mjs) uses: each child's output is prefixed with its name;
// Ctrl-C, SIGTERM or any child exiting non-zero stops the rest (SIGTERM, then
// SIGKILL after 5 s), awaits `cleanup()` and exits.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(PKG, '..', '..');
const BIN = (dir, name) => path.join(dir, 'node_modules/.bin', name);

/** Prefixes every complete line of `stream` with `[name] `. */
const pipe = (stream, out, name) => {
  let rest = '';
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    const lines = (rest + chunk).split('\n');
    rest = lines.pop();
    for (const line of lines) out.write(`[${name}] ${line}\n`);
  });
  stream.on('end', () => {
    if (rest) out.write(`[${name}] ${rest}\n`);
  });
};

const start = ({ name, cmd, args = [], cwd = ROOT, env = {} }) => {
  const child = spawn(cmd, args, {
    cwd,
    env: { ...process.env, FORCE_COLOR: '1', ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
    // Own process group, so a stop reaches the grandchildren too.
    detached: true,
  });
  pipe(child.stdout, process.stdout, name);
  pipe(child.stderr, process.stderr, name);
  return child;
};

/** Runs one step to completion; rejects on a non-zero exit. */
export const step = (spec) =>
  new Promise((resolve, reject) => {
    const child = start(spec);
    child.on('error', reject);
    child.on('exit', (code, signal) =>
      code === 0
        ? resolve()
        : reject(new Error(`${spec.name} exited with ${code ?? signal}`)),
    );
  });

const kill = (child, signal) => {
  try {
    process.kill(-child.pid, signal);
  } catch {
    // Already gone.
  }
};

/**
 * Starts every child and keeps them running until Ctrl-C or a failure.
 * @param {{ children: Array<{ name: string, cmd: string, args?: string[], cwd?: string, env?: Record<string, string> }>, cleanup?: () => unknown }} options
 */
export const run = ({ children, cleanup = () => {} }) =>
  new Promise(() => {
    const running = new Set();
    let stopping = false;

    const stop = async (code) => {
      if (stopping) return;
      stopping = true;
      for (const child of running) kill(child, 'SIGTERM');
      const timer = setTimeout(() => {
        for (const child of running) kill(child, 'SIGKILL');
      }, 5000);
      await Promise.all(
        [...running].map(
          (child) => new Promise((done) => child.once('exit', done)),
        ),
      );
      clearTimeout(timer);
      try {
        await cleanup();
      } catch (error) {
        console.error(`preview: cleanup failed: ${error.message}`);
        code ||= 1;
      }
      process.exit(code);
    };

    process.on('SIGINT', () => stop(130));
    process.on('SIGTERM', () => stop(143));

    for (const spec of children) {
      const child = start(spec);
      running.add(child);
      child.on('error', (error) => {
        console.error(`[${spec.name}] ${error.message}`);
        running.delete(child);
        stop(1);
      });
      child.on('exit', (code, signal) => {
        running.delete(child);
        if (stopping) return;
        console.error(`[${spec.name}] exited with ${code ?? signal}`);
        if (code !== 0) stop(code ?? 1);
      });
    }
  });

/** `pnpm registry:dev`: .dev/registry.json, then .dev/r. */
export const registryDev = async () => {
  await step({
    name: 'registry',
    cmd: process.execPath,
    args: ['scripts/registry/build.mjs', '--dev'],
    cwd: PKG,
  });
  await step({
    name: 'registry',
    cmd: BIN(PKG, 'shadcn'),
    args: ['build', '.dev/registry.json', '--output', '.dev/r'],
    cwd: PKG,
  });
};

export const removeDev = () =>
  fs.rmSync(path.join(PKG, '.dev'), { recursive: true, force: true });

/** Registry server on 5310 and Storybook for both bases. */
export const packageChildren = [
  {
    name: 'registry',
    cmd: BIN(ROOT, 'serve'),
    args: ['.dev', '-l', '5310'],
    cwd: PKG,
  },
  {
    name: 'storybook',
    cmd: BIN(PKG, 'storybook'),
    args: ['dev', '-p', '6006', '--no-open'],
    cwd: PKG,
  },
  {
    name: 'storybook:base',
    cmd: BIN(PKG, 'storybook'),
    args: ['dev', '-p', '6007', '--no-open'],
    cwd: PKG,
    env: { ST_BASE: 'base' },
  },
];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    await registryDev();
  } catch (error) {
    console.error(`preview: ${error.message}`);
    removeDev();
    process.exit(1);
  }
  await run({ children: packageChildren, cleanup: removeDev });
}
