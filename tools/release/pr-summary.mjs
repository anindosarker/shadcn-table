#!/usr/bin/env node
// Usage (repo root, the PR Summary job of .github/workflows/pr.yml, with
// NEEDS set to toJSON(needs); locally without NEEDS):
//   node tools/release/pr-summary.mjs
//
// Builds the one sticky comment of a pull request (D87, D37) from the test
// records and the checkout's CHANGELOG.md. The records come from the job
// outputs in NEEDS (D38: every test job prints its record as an output,
// tools/release/record-output.mjs), else from test/.out/*.json (a local
// run without NEEDS). The comment:
//   the hidden marker <!-- shadcn-table:pr-summary -->
//   `## <PR title>` (`## PR checks` on a dispatch)
//   `` `<label>` | [run <id>](<url>) | <status> ``: the validate-pr record's
//           label or `no release label`; `✅ all green`, `❌ <n> jobs failed`
//           or `⚪ <n> skipped` (jobs without a record)
//   one `| Job | Result |` table in D86 order: a bold group row per matrix
//           job (Typecheck, Storybook Tests, Docs E2E Tests, Installation
//           E2E) with one indented row per base or scenario, Lint, Validate
//           Repo and Validate PR as one bold row each; cells `✅ <summary>`,
//           `❌ <summary before its first ": ">`, `⚪ skipped`
//   `<details>` `❌ <n> failures`: one `- **<job>** <error>` line per error
//           of every failed record, omitted when nothing failed
//   `#### Changelog`: the `## Unreleased` counts by `###` heading and one
//           bullet per heading listing its `####` titles; the top
//           `## <version>` section when Unreleased is absent
//   the `<sub>` footer
// On a pull_request event the comment carrying the marker is PATCHed, else
// one is POSTed (GH_TOKEN, GITHUB_REPOSITORY, the PR number from the event
// payload). On a `labeled` or `unlabeled` event only Validate PR ran: the
// title, the status line, the Validate PR row and the changelog section are
// rebuilt, the other table rows and the failures block are kept from the
// previous comment. Without a pull request (workflow_dispatch) the comment
// goes to $GITHUB_STEP_SUMMARY only; on a pull request it goes there too.
// The exit code is 0 whatever the jobs did: the table carries their
// failures, Prepare Release needs every job.
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

const capitalize = (s) => `${s[0].toUpperCase()}${s.slice(1)}`;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
/** A table cell: `|` escaped, one line. */
const cell = (text) =>
  String(text)
    .replace(/\|/g, '\\|')
    .replace(/\s*\n\s*/g, ' ');
/** The leg of a matrix job (`base`, `nextjs-aria`), or undefined. */
const legOf = (job) => job.base ?? job.scenario;
/** The group name of a job: its label without the ` (<leg>)` suffix. */
const groupOf = (job) => job.job.replace(/ \([^)]*\)$/, '');

const resultCell = (record) => {
  if (!record) return '⚪ skipped';
  if (record.status === 'pass') return `✅ ${cell(record.summary)}`;
  const summary = String(record.summary ?? 'failed');
  const cut = summary.indexOf(': ');
  return `❌ ${cell(cut === -1 ? summary : summary.slice(0, cut))}`;
};

/**
 * The table rows in JOBS order: `{ key, line, job }`, `key` being the
 * first cell text under its group (`Typecheck/&nbsp;&nbsp;base`), `job`
 * undefined on a bold group row. A test shared by several jobs is a group.
 */
export const groupRows = (records) => {
  const shared = (test) => JOBS.filter((j) => j.test === test).length > 1;
  const rows = [];
  for (const job of JOBS) {
    const result = resultCell(findRecord(records, job));
    if (!shared(job.test)) {
      const first = `**${job.job}**`;
      rows.push({ key: first, line: `| ${first} | ${result} |`, job });
      continue;
    }
    const group = groupOf(job);
    if (!rows.some((r) => r.key === `**${group}**`)) {
      rows.push({ key: `**${group}**`, line: `| **${group}** | |` });
    }
    const first = `&nbsp;&nbsp;${legOf(job)}`;
    rows.push({
      key: `${group}/${first}`,
      line: `| ${first} | ${result} |`,
      job,
    });
  }
  return rows;
};

/** `` `<label>` | [run <id>](<url>) | <status> `` counted over the result rows. */
export const statusLine = (rows, { label, runUrl, runId }) => {
  const results = rows.filter((r) => r.job).map((r) => r.line.split(' | ')[1]);
  const failed = results.filter((c) => c.startsWith('❌')).length;
  const skipped = results.filter((c) => c.startsWith('⚪')).length;
  const status = failed
    ? `❌ ${plural(failed, 'job')} failed`
    : skipped
      ? `⚪ ${skipped} skipped`
      : '✅ all green';
  return `${label ? `\`${label}\`` : 'no release label'} | [run ${runId}](${runUrl}) | ${status}`;
};

/** The error lines of every failed record: `- **<job label>** <error>`. */
const failureLines = (records) =>
  JOBS.flatMap((job) => {
    const record = findRecord(records, job);
    if (!record || record.status === 'pass') return [];
    const errors = record.errors?.length ? record.errors : [record.summary];
    return errors.map((e) => `- **${job.job}** ${cell(e)}`);
  });

/** The collapsed failures block, or '' when nothing failed. */
export const failuresBlock = (lines) =>
  lines.length
    ? [
        '<details>',
        `<summary>❌ ${plural(lines.length, 'failure')}</summary>`,
        '',
        ...lines,
        '',
        '</details>',
      ].join('\n')
    : '';

/**
 * `#### Changelog` from the CHANGELOG.md text: the `## Unreleased` section,
 * or the top `## <version> - <date>` section when it is absent; its `###`
 * headings with their `####` counts in file order, then one bullet per
 * heading listing the `####` titles as written.
 */
export const changelogSection = (text) => {
  const head = '#### Changelog';
  if (typeof text !== 'string') return `${head}\n\nChangelog: not found`;
  const lines = [];
  let fence = false;
  for (const line of text.split('\n')) {
    if (line.startsWith('```')) fence = !fence;
    if (!fence) lines.push(line);
  }
  const tops = lines.flatMap((l, i) => (/^## /.test(l) ? [i] : []));
  const start =
    tops.find((i) => lines[i].trim() === '## Unreleased') ?? tops[0];
  if (start === undefined) return `${head}\n\nChangelog: no section found`;
  const name = lines[start].trim().slice(3);
  const next = tops.find((i) => i > start) ?? lines.length;
  const headings = [];
  for (const line of lines.slice(start + 1, next)) {
    if (/^### /.test(line))
      headings.push({ name: line.slice(4).trim(), titles: [] });
    else if (/^#### /.test(line) && headings.length)
      headings.at(-1).titles.push(line.slice(5).trim());
  }
  const filled = headings.filter((h) => h.titles.length);
  const under = `Under \`## ${name}\`:`;
  if (!filled.length) return `${head}\n\n${under} nothing yet`;
  return [
    head,
    '',
    `${under} ${filled.map((h) => `${capitalize(h.name)} ${h.titles.length}`).join(' · ')}`,
    '',
    ...filled.map(
      (h) => `- **${capitalize(h.name)}** · ${h.titles.join(' · ')}`,
    ),
  ].join('\n');
};

const FOOTER = '<sub>Updated on every run of this pull request.</sub>';

/**
 * The comment body, starting with the marker. `previous` is the body of the
 * existing comment; on a label event its table rows (all but Validate PR)
 * and its failures block are kept, the Validate PR failure lines excepted.
 */
export const buildComment = (
  records,
  { title, runUrl, runId, changelog, previous, labelEvent },
) => {
  const pr = findRecord(records, { test: 'validate-pr' });
  let rows = groupRows(records);
  let failures = failureLines(records);
  if (labelEvent && previous?.startsWith(MARKER)) {
    const old = previous.split('\n');
    let group;
    const kept = new Map();
    for (const line of old.filter((l) => l.startsWith('| '))) {
      const first = line.slice(2, line.indexOf(' | '));
      if (first.startsWith('**')) group = first.slice(2, -2);
      kept.set(first.startsWith('&nbsp;') ? `${group}/${first}` : first, line);
    }
    rows = rows.map((r) =>
      r.job?.test === 'validate-pr'
        ? r
        : { ...r, line: kept.get(r.key) ?? r.line },
    );
    const open = old.indexOf('<details>');
    const close = old.indexOf('</details>');
    const oldFailures =
      open === -1 || close === -1
        ? []
        : old
            .slice(open, close)
            .filter(
              (l) =>
                l.startsWith('- **') && !l.startsWith('- **Validate PR** '),
            );
    failures = [
      ...oldFailures,
      ...failures.filter((l) => l.startsWith('- **Validate PR** ')),
    ];
  }
  const failed = failuresBlock(failures);
  return [
    MARKER,
    `## ${title ?? 'PR checks'}`,
    '',
    statusLine(rows, { label: pr?.details?.label, runUrl, runId }),
    '',
    '| Job | Result |',
    '| --- | --- |',
    ...rows.map((r) => r.line),
    '',
    ...(failed ? [failed, ''] : []),
    changelogSection(changelog),
    '',
    FOOTER,
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

/** Every record under `dir` (test/.out/*.json, a local run), unreadable files skipped. */
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

/**
 * Every record in the job outputs of `toJSON(needs)` (D38): each output
 * value of each job parsed as JSON; empty, unparsable and nameless values
 * skipped (a job without a record shows skipped).
 */
export const recordsFromNeeds = (json) => {
  let needs;
  try {
    needs = JSON.parse(json);
  } catch {
    return [];
  }
  if (!needs || typeof needs !== 'object') return [];
  return Object.values(needs)
    .flatMap((job) => Object.values(job?.outputs ?? {}))
    .flatMap((value) => {
      try {
        const record = JSON.parse(value);
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
  const records = env.NEEDS
    ? recordsFromNeeds(env.NEEDS)
    : readRecords(path.join(ROOT, 'test', '.out'));
  const changelogPath = path.join(ROOT, 'CHANGELOG.md');
  const changelog = fs.existsSync(changelogPath)
    ? fs.readFileSync(changelogPath, 'utf8')
    : undefined;

  let api;
  let previous;
  if (pr && env.GITHUB_EVENT_NAME !== 'workflow_dispatch') {
    if (!env.GH_TOKEN)
      throw new Error('GH_TOKEN is required on a pull request');
    api = { repo: env.GITHUB_REPOSITORY, pr, token: env.GH_TOKEN };
    if (labelEvent) previous = (await findComment(api))?.body;
  }
  const body = buildComment(records, {
    title: event.pull_request?.title ?? 'PR checks',
    runUrl,
    runId: env.GITHUB_RUN_ID ?? '0',
    changelog,
    previous,
    labelEvent,
  });
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
