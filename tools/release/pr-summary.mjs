#!/usr/bin/env node
// Usage (repo root, the PR Summary job of .github/workflows/pr.yml, after
// the test-out-* artifacts are downloaded into test/.out/):
//   node tools/release/pr-summary.mjs
//
// Builds the one sticky comment of a pull request (D87) from the test
// records test/.out/*.json:
//   the hidden marker <!-- shadcn-table:pr-summary -->
//   line 1  `Ships as <version> (<label>).` or the reason from the
//           validate-pr record
//   line 2  the `## Unreleased` line counts by heading (`Added 2, Fixed 4`)
//   then    one line per job in D86 order with the record's summary
//           (`Storybook Tests (radix): 609 passed`), `<job>: no record
//           (skipped or cancelled)` without one
//   last    the link to the run
// On a pull_request event the comment carrying the marker is PATCHed, else
// one is POSTed (GH_TOKEN, GITHUB_REPOSITORY, the PR number from the event
// payload). On a `labeled` or `unlabeled` event only Validate PR ran: lines 1
// and 2 and the Validate PR line are rewritten from its record, the other job
// lines and the run link are kept from the previous comment. Without a pull
// request (workflow_dispatch) the comment goes to $GITHUB_STEP_SUMMARY only;
// on a pull request it goes there too. The exit code is 0 whatever the jobs
// did: the job lines carry their failures, Prepare Release needs every job.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
export const MARKER = '<!-- shadcn-table:pr-summary -->';

const BASES = ['base', 'radix', 'aria'];
const SCENARIOS = [
  'fresh',
  'existing',
  'base',
  'aria',
  'nextjs-base',
  'nextjs-radix',
  'nextjs-aria',
];

/** The nineteen test jobs of pr.yml in D86 order: the job name and its record key. */
export const JOBS = [
  ...BASES.map((b) => ({
    job: `Typecheck (${b})`,
    test: 'typecheck',
    base: b,
  })),
  { job: 'Lint', test: 'lint' },
  ...BASES.map((b) => ({
    job: `Storybook Tests (${b})`,
    test: 'storybook-tests',
    base: b,
  })),
  ...BASES.map((b) => ({
    job: `Docs E2E Tests (${b})`,
    test: 'docs-e2e',
    base: b,
  })),
  { job: 'Validate Repo', test: 'validate-repo' },
  ...SCENARIOS.map((s) => ({
    job: `Installation E2E (${s})`,
    test: 'installation-e2e',
    scenario: s,
  })),
  { job: 'Validate PR', test: 'validate-pr' },
];

const findRecord = (records, { test, base, scenario }) =>
  records.find(
    (r) =>
      r.name === test &&
      (r.base ?? undefined) === base &&
      (r.scenario ?? undefined) === scenario,
  );

const jobLine = (records, job) => {
  const record = findRecord(records, job);
  if (!record) return `- ${job.job}: no record (skipped or cancelled)`;
  return `- ${job.job}: ${record.status === 'pass' ? '' : 'FAIL '}${record.summary}`;
};

const versionLine = (pr) => {
  if (!pr) return 'No version: Validate PR did not run.';
  const d = pr.details ?? {};
  if (d.version) {
    return `Ships as ${d.version} (${d.label}${d.note ? `, ${d.note}` : ''}).`;
  }
  const reason = d.reason ?? pr.summary;
  return /[.!?]$/.test(reason) ? reason : `${reason}.`;
};

const changelogLine = (pr) => {
  const counts = pr?.details?.changelog;
  if (!counts) return 'Changelog: no Validate PR record.';
  const parts = Object.entries(counts).map(
    ([heading, n]) => `${heading[0].toUpperCase()}${heading.slice(1)} ${n}`,
  );
  return parts.length ? parts.join(', ') : 'No lines under ## Unreleased.';
};

/**
 * The comment body, starting with the marker. `previous` is the body of the
 * existing comment; on a label event its job lines (all but Validate PR) and
 * its run link are kept.
 */
export const buildComment = (records, { runUrl, previous, labelEvent }) => {
  const pr = findRecord(records, { test: 'validate-pr' });
  let jobs = JOBS.map((job) => jobLine(records, job));
  let run = `[Run](${runUrl})`;
  if (labelEvent && previous?.startsWith(MARKER)) {
    const old = previous.split('\n');
    jobs = JOBS.map((job, i) => {
      if (job.test === 'validate-pr') return jobs[i];
      return old.find((l) => l.startsWith(`- ${job.job}: `)) ?? jobs[i];
    });
    run = old.find((l) => l.startsWith('[Run](')) ?? run;
  }
  return [
    MARKER,
    versionLine(pr),
    '',
    changelogLine(pr),
    '',
    ...jobs,
    '',
    run,
    '',
  ].join('\n');
};

const request = async ({ token }, method, url, body) => {
  const res = await fetch(url, {
    method,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'x-github-api-version': '2022-11-28',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`${method} ${url}: HTTP ${res.status} ${await res.text()}`);
  }
  return res.json();
};

const API = () => process.env.GITHUB_API_URL ?? 'https://api.github.com';

/** The PR's comment carrying the marker, or undefined. */
export const findComment = async (api) => {
  for (let page = 1; ; page++) {
    const comments = await request(
      api,
      'GET',
      `${API()}/repos/${api.repo}/issues/${api.pr}/comments?per_page=100&page=${page}`,
    );
    const hit = comments.find((c) => c.body?.startsWith(MARKER));
    if (hit) return hit;
    if (comments.length < 100) return undefined;
  }
};

/** PATCHes the comment carrying the marker, else POSTs a new one. */
export const upsertComment = async (api, body) => {
  const existing = await findComment(api);
  if (existing) {
    await request(
      api,
      'PATCH',
      `${API()}/repos/${api.repo}/issues/comments/${existing.id}`,
      { body },
    );
    return 'updated';
  }
  await request(
    api,
    'POST',
    `${API()}/repos/${api.repo}/issues/${api.pr}/comments`,
    { body },
  );
  return 'created';
};

/** Every record under `dir` (test/.out/*.json), unreadable files skipped. */
export const readRecords = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => {
      try {
        const record = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        return record?.name && record?.status ? [record] : [];
      } catch {
        return [];
      }
    });
};

const main = async () => {
  const env = process.env;
  const event = env.GITHUB_EVENT_PATH
    ? JSON.parse(fs.readFileSync(env.GITHUB_EVENT_PATH, 'utf8'))
    : {};
  const pr =
    event.pull_request?.number ?? (env.PR ? Number(env.PR) : undefined);
  const labelEvent = ['labeled', 'unlabeled'].includes(event.action);
  const runUrl = `${env.GITHUB_SERVER_URL ?? 'https://github.com'}/${env.GITHUB_REPOSITORY ?? 'anindosarker/shadcn-table'}/actions/runs/${env.GITHUB_RUN_ID ?? '0'}`;
  const records = readRecords(path.join(ROOT, 'test', '.out'));

  let api;
  let previous;
  if (pr && env.GITHUB_EVENT_NAME !== 'workflow_dispatch') {
    if (!env.GH_TOKEN)
      throw new Error('GH_TOKEN is required on a pull request');
    api = { repo: env.GITHUB_REPOSITORY, pr, token: env.GH_TOKEN };
    if (labelEvent) previous = (await findComment(api))?.body;
  }
  const body = buildComment(records, { runUrl, previous, labelEvent });
  if (env.GITHUB_STEP_SUMMARY) fs.appendFileSync(env.GITHUB_STEP_SUMMARY, body);
  console.log(body);
  if (api) console.log(`comment ${await upsertComment(api, body)} on #${pr}`);
  else console.log('no pull request: the step summary only');
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    await main();
  } catch (error) {
    console.error(`pr-summary: ${error.message}`);
    process.exit(1);
  }
}
