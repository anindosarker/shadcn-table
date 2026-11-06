#!/usr/bin/env node
// Usage (repo root, the Verify Deployment job of .github/workflows/release.yml):
//   node tools/release/verify-deployment.mjs --version <v> [--timeout-min 20] [--interval-s 30]
//
// Polls https://www.shadcn-table.com/version.txt and
// https://storybook.shadcn-table.com/version.txt every --interval-s seconds
// until both serve <v> (the docs route and the `storybook:build` output),
// for at most --timeout-min minutes. Exits 0 once both match, else 1 with the
// last body of each site. The tag is the job's next step; this tool never
// runs git.
import { fileURLToPath } from 'node:url';

export const SITES = [
  'https://www.shadcn-table.com/version.txt',
  'https://storybook.shadcn-table.com/version.txt',
];

const fail = (reason) => {
  console.error(`verify-deployment: ${reason}`);
  process.exit(1);
};

/** `--version`, `--timeout-min`, `--interval-s` from argv. */
export const parseArgs = (argv) => {
  const opts = { timeoutMin: 20, intervalS: 30 };
  for (let i = 0; i < argv.length; i++) {
    const [flag, inline] = argv[i].split('=', 2);
    const value = () => inline ?? argv[++i];
    if (flag === '--version') opts.version = value();
    else if (flag === '--timeout-min') opts.timeoutMin = Number(value());
    else if (flag === '--interval-s') opts.intervalS = Number(value());
    else throw new Error(`unknown argument ${argv[i]}`);
  }
  if (!opts.version) throw new Error('--version <v> is required');
  if (!(opts.timeoutMin > 0) || !(opts.intervalS > 0)) {
    throw new Error('--timeout-min and --interval-s take positive numbers');
  }
  return opts;
};

/** The trimmed body a site serves, or a short reason it served none. */
const served = async (url) => {
  try {
    const res = await fetch(url, {
      headers: { 'cache-control': 'no-cache' },
      signal: AbortSignal.timeout(20_000),
    });
    const body = (await res.text()).trim();
    return res.ok ? body : `HTTP ${res.status}`;
  } catch (error) {
    return `no answer (${error.cause?.code ?? error.name})`;
  }
};

/**
 * Polls every site until all serve `version` or the deadline passes.
 * Returns `{ ok, bodies }`, `bodies` keyed by URL with the last answer.
 */
export const poll = async ({
  version,
  timeoutMin,
  intervalS,
  sites = SITES,
  fetchBody = served,
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
  now = () => Date.now(),
  log = console.log,
}) => {
  const deadline = now() + timeoutMin * 60_000;
  for (;;) {
    const bodies = Object.fromEntries(
      await Promise.all(sites.map(async (url) => [url, await fetchBody(url)])),
    );
    const waiting = sites.filter((url) => bodies[url] !== version);
    if (!waiting.length) return { ok: true, bodies };
    for (const url of waiting) {
      log(
        `${url} serves '${bodies[url] || 'nothing'}', waiting for ${version}`,
      );
    }
    if (now() + intervalS * 1000 > deadline) return { ok: false, bodies };
    await sleep(intervalS * 1000);
  }
};

const main = async () => {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (error) {
    fail(
      `${error.message}\nusage: node tools/release/verify-deployment.mjs --version <v> [--timeout-min 20] [--interval-s 30]`,
    );
  }
  const { ok, bodies } = await poll(opts);
  if (!ok) {
    for (const [url, body] of Object.entries(bodies)) {
      console.error(`${url}: '${body || 'nothing'}'`);
    }
    fail(
      `production does not serve ${opts.version} after ${opts.timeoutMin} min`,
    );
  }
  console.log(`www and storybook serve ${opts.version}`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
