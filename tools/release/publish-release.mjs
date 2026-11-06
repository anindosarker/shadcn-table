#!/usr/bin/env node
// Usage (repo root, full history and tags, GH_TOKEN; the Publish Release job
// of .github/workflows/release.yml):
//   node tools/release/publish-release.mjs --version <v>
//
// The GitHub release for the tag v<v>, then the "Released in v<v>" comments:
//   1. notes.mjs <v> writes the `## <v>` section of CHANGELOG.md to a temp
//      file (no section, no release).
//   2. `gh release create v<v> --verify-tag --title v<v> --notes-file <file>`
//      with --prerelease for a version with a hyphen, else --latest.
//      --verify-tag refuses to create the tag: the release is for the tag
//      Verify Deployment or a hand push created. A release that exists
//      already (a re-run after the comments failed) is kept.
//   3. comment.mjs v<v> comments on every pull request the tag shipped; it
//      skips a pull request that already names the tag.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');

const fail = (reason) => {
  console.error(`publish-release: ${reason}`);
  process.exit(1);
};

const argv = process.argv.slice(2);
let version;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--version') version = argv[++i];
  else if (argv[i].startsWith('--version=')) version = argv[i].slice(10);
  else fail(`unknown argument ${argv[i]}`);
}
if (!version)
  fail('usage: node tools/release/publish-release.mjs --version <v>');
const tag = `v${version}`;

const node = (script, args) =>
  execFileSync(process.execPath, [path.join(HERE, script), ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });

let notes;
try {
  notes = node('notes.mjs', [version]);
} catch {
  fail(`CHANGELOG.md has no notes for ${version}`);
}

const exists =
  spawnSync('gh', ['release', 'view', tag], { cwd: ROOT, stdio: 'ignore' })
    .status === 0;
if (exists) {
  console.log(`release ${tag} exists`);
} else {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'publish-release-'));
  const file = path.join(dir, 'notes.md');
  fs.writeFileSync(file, notes);
  try {
    execFileSync(
      'gh',
      [
        'release',
        'create',
        tag,
        '--verify-tag',
        '--title',
        tag,
        '--notes-file',
        file,
        version.includes('-') ? '--prerelease' : '--latest',
      ],
      { cwd: ROOT, stdio: 'inherit' },
    );
  } catch {
    fail(`gh release create ${tag} failed`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  console.log(`released ${tag}`);
}

const comment = spawnSync(
  process.execPath,
  [path.join(HERE, 'comment.mjs'), tag],
  { cwd: ROOT, stdio: 'inherit' },
);
if (comment.status !== 0) fail(`comment.mjs ${tag} failed`);
