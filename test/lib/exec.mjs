// Process helpers for the tests: run a command to completion, start a server
// and wait until it answers, pick a free agent port. Every server a test
// starts is stopped by the test, on failure too; the runner also stops any
// left running when it exits or is interrupted.
import { spawn } from 'node:child_process';
import net from 'node:net';

const live = new Set();

const stopAll = () => {
  for (const server of live) server.kill();
};
process.on('exit', stopAll);
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopAll();
    process.exit(signal === 'SIGINT' ? 130 : 143);
  });
}

/**
 * Runs `cmd args` to completion. Output streams through unless `quiet`;
 * with `capture` it is also returned. Never throws on a non-zero exit.
 *
 * @returns {Promise<{ code: number, stdout: string, stderr: string }>}
 */
export const run = (
  cmd,
  args = [],
  { cwd, env, capture = false, quiet = false } = {},
) =>
  new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      if (capture) stdout += chunk;
      if (!quiet) process.stdout.write(chunk);
    });
    child.stderr.on('data', (chunk) => {
      if (capture) stderr += chunk;
      if (!quiet) process.stderr.write(chunk);
    });
    child.on('error', (error) => {
      stderr += `${error.message}\n`;
      resolve({ code: 127, stdout, stderr });
    });
    child.on('close', (code, signal) =>
      resolve({ code: code ?? (signal ? 1 : 0), stdout, stderr }),
    );
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Starts `cmd args` in its own process group and polls `readyUrl` until it
 * answers below 500. Rejects (after stopping the server) when the process
 * exits first or `timeoutMs` passes.
 *
 * @returns {Promise<{ stop: () => Promise<void> }>}
 */
export const spawnServer = async (
  cmd,
  args = [],
  { cwd, env, readyUrl, timeoutMs = 120_000, quiet = true, name = cmd } = {},
) => {
  const child = spawn(cmd, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: ['ignore', quiet ? 'ignore' : 'inherit', quiet ? 'pipe' : 'inherit'],
    detached: true,
  });
  let stderr = '';
  child.stderr?.on('data', (chunk) => {
    stderr = (stderr + chunk).slice(-4000);
  });
  let exited = false;
  const done = new Promise((resolve) =>
    child.on('exit', () => {
      exited = true;
      resolve();
    }),
  );
  const handle = {
    kill: () => {
      if (exited) return;
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        // already gone
      }
    },
  };
  live.add(handle);
  const stop = async () => {
    handle.kill();
    const timer = setTimeout(() => {
      try {
        if (!exited) process.kill(-child.pid, 'SIGKILL');
      } catch {
        // already gone
      }
    }, 5000);
    await done;
    clearTimeout(timer);
    // The direct child exits before its workers (next dev keeps writing
    // .next/ while they wind down); wait until the process group is empty,
    // then SIGKILL whatever is left, so a later rmSync does not hit ENOTEMPTY.
    const gone = Date.now() + 10000;
    while (Date.now() < gone) {
      try {
        process.kill(-child.pid, 0);
      } catch {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {
      // group is empty
    }
    live.delete(handle);
  };
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (exited) {
      live.delete(handle);
      throw new Error(`${name} exited before ${readyUrl} answered\n${stderr}`);
    }
    try {
      const response = await fetch(readyUrl, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.status < 500) return { stop };
    } catch {
      // not up yet
    }
    await sleep(500);
  }
  await stop();
  throw new Error(`${name}: ${readyUrl} did not answer in ${timeoutMs} ms`);
};

const isFree = (port) =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.listen({ port }, () => server.close(() => resolve(true)));
  });

const taken = new Set();

/** The first free port in [from, to] not handed out before (P6: 5340-5360). */
export const freePort = async (from = 5340, to = 5360) => {
  for (let port = from; port <= to; port++) {
    if (taken.has(port)) continue;
    if (await isFree(port)) {
      taken.add(port);
      return port;
    }
  }
  throw new Error(`no free port between ${from} and ${to}`);
};

/** The fixed CI port under --ci, else a free agent port. */
export const portFor = (ctx, ciPort) => (ctx.ci ? ciPort : freePort());

/** `text` without ANSI escapes. */
export const stripAnsi = (text) =>
  // eslint-disable-next-line no-control-regex -- matching the ESC byte is the point
  text.replace(/\u001b\[[0-9;?]*[ -/]*[@-~]/g, '');
