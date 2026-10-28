#!/usr/bin/env node
// Usage (repo root, full history and tags): node scripts/release/comment.mjs <tag> [--dry-run]
//
// Comments "Released in <tag>: <release url>" on every pull request that
// <tag> shipped, run by .github/workflows/release.yml after
// `gh release create`. The pull requests are the ones merged between the
// previous tag (git describe --tags --abbrev=0 <tag>^) and <tag>, found three
// ways and deduplicated: "Merge pull request #N" merge subjects, "(#N)"
// squash subjects, and the pull requests GitHub lists for each first-parent
// commit of the range (merge commits with a custom subject); plus the
// version pull request, by its title `chore: version <version>`. A pull
// request whose comments already name <tag> is skipped, so a re-run posts
// nothing twice. --dry-run prints what it would post.
import { execFileSync } from 'node:child_process';

const fail = (reason) => {
  console.error(`comment: ${reason}`);
  process.exit(1);
};

const run = (cmd, args, { quiet = false } = {}) =>
  execFileSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', quiet ? 'ignore' : 'inherit'],
  }).trim();
const git = (...args) => run('git', args);
const gh = (...args) => run('gh', args);

const [tag, ...flags] = process.argv.slice(2);
if (!tag || flags.some((f) => f !== '--dry-run')) {
  fail('usage: node scripts/release/comment.mjs <tag> [--dry-run]');
}
const dryRun = flags.includes('--dry-run');

let previous;
try {
  previous = run('git', ['describe', '--tags', '--abbrev=0', `${tag}^`], {
    quiet: true,
  });
} catch {
  fail(
    `no tag before ${tag}; fetch the tags (fetch-depth: 0) or comment by hand`,
  );
}
const range = `${previous}..${tag}`;

const numbers = new Set();
const add = (text, pattern) => {
  for (const m of text.matchAll(pattern)) numbers.add(Number(m[1]));
};
add(
  git('log', '--merges', '--format=%s', range),
  /^Merge pull request #(\d+)\b/gm,
);
add(git('log', '--format=%s', range), /\(#(\d+)\)$/gm);
for (const sha of git('log', '--first-parent', '--format=%H', range)
  .split('\n')
  .filter(Boolean)) {
  add(
    gh(
      'api',
      `repos/{owner}/{repo}/commits/${sha}/pulls`,
      '--jq',
      '.[] | select(.merged_at != null) | "#\\(.number)"',
    ),
    /#(\d+)/g,
  );
}
const version = tag.replace(/^v/, '');
add(
  gh(
    'pr',
    'list',
    '--state',
    'merged',
    '--search',
    `"chore: version ${version}" in:title`,
    '--json',
    'number,title',
    '--jq',
    `.[] | select(.title == "chore: version ${version}") | "#\\(.number)"`,
  ),
  /#(\d+)/g,
);

let url;
try {
  url = gh('release', 'view', tag, '--json', 'url', '--jq', '.url');
} catch {
  if (!dryRun) fail(`no GitHub release ${tag}; create it first`);
  url = `(release ${tag})`;
}
const body = `Released in ${tag}: ${url}`;
console.log(`${range}: ${numbers.size} pull request(s)`);

for (const n of [...numbers].sort((a, b) => a - b)) {
  const comments = gh(
    'pr',
    'view',
    String(n),
    '--json',
    'comments',
    '--jq',
    '.comments[].body',
  );
  if (comments.includes(`Released in ${tag}`)) {
    console.log(`#${n}: already commented`);
  } else if (dryRun) {
    console.log(`#${n}: would comment "${body}"`);
  } else {
    gh('pr', 'comment', String(n), '--body', body);
    console.log(`#${n}: commented`);
  }
}
