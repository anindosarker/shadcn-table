#!/usr/bin/env node
// Usage (repo root): pnpm test <name> [--base base|radix|aria]
//   [--scenario <s>] [--ci] [<test flags>]
//   pnpm test --list          every test, one per line, with its bases or
//                             scenarios
//   pnpm test --all           every test, serially, per base and per scenario
//   pnpm test --changed       the tests whose paths match a changed file
//                             (against the merge base with
//                             origin/claude/review, plus the working tree);
//                             with --list it only names them
//
// A test is a folder test/<name>/ whose run.mjs default-exports
// defineTest(...) (test/lib/define.mjs). A based test without --base runs
// every base serially. Flags the runner does not own (`--url`,
// `--no-browser`, `--no-diff`, ...) go to the test. Every run writes
// test/.out/<name>[-<base>|-<scenario>].json and ends with one summary line;
// the exit code is 1 when any run failed. Runs are never parallel: the
// browser tests saturate a shared machine. --ci switches to the fixed CI
// ports, GitHub annotations and no colour.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { report, writeRecord } from './lib/report.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const OUT = path.join(HERE, '.out');
const SKIP = new Set(['lib', '.out', 'node_modules']);

const fail = (message) => {
  console.error(`test: ${message}`);
  process.exit(2);
};

/** Every test definition, in folder order, keyed by name. */
const discover = async () => {
  const tests = new Map();
  const dirs = fs
    .readdirSync(HERE, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !SKIP.has(e.name))
    .map((e) => e.name)
    .sort();
  for (const dir of dirs) {
    const file = path.join(HERE, dir, 'run.mjs');
    if (!fs.existsSync(file)) continue;
    const def = (await import(pathToFileURL(file).href)).default;
    if (!def || def.name !== dir) {
      fail(
        `test/${dir}/run.mjs must default-export defineTest({ name: '${dir}' })`,
      );
    }
    tests.set(dir, def);
  }
  return tests;
};

// The order --list and --all use: the CI job order (D86).
const ORDER = [
  'typecheck',
  'lint',
  'storybook-tests',
  'docs-e2e',
  'validate-repo',
  'installation-e2e',
  'validate-pr',
  'validate-production',
];
const ordered = (tests) =>
  [...tests.values()].sort((a, b) => {
    const ia = ORDER.indexOf(a.name);
    const ib = ORDER.indexOf(b.name);
    return (
      (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.name.localeCompare(b.name)
    );
  });

const parseArgs = (argv, names) => {
  const opts = { flags: [], names: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      const v = argv[++i];
      if (v === undefined || v.startsWith('--')) fail(`${arg} needs a value`);
      return v;
    };
    if (arg === '--list') opts.list = true;
    else if (arg === '--all') opts.all = true;
    else if (arg === '--changed') opts.changed = true;
    else if (arg === '--ci') opts.ci = true;
    else if (arg === '--base') opts.base = value();
    else if (arg.startsWith('--base=')) opts.base = arg.slice(7);
    else if (arg === '--scenario') opts.scenario = value();
    else if (arg.startsWith('--scenario=')) opts.scenario = arg.slice(11);
    else if (!arg.startsWith('-') && names.has(arg) && !opts.flags.length) {
      opts.names.push(arg);
    } else opts.flags.push(arg);
  }
  return opts;
};

/** `**` any path, `*` any segment part. */
const globToRegExp = (glob) =>
  new RegExp(
    '^' +
      glob
        .split('**')
        .map((part) =>
          part
            .split('*')
            .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
            .join('[^/]*'),
        )
        .join('.*') +
      '$',
  );

const git = (args) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);

const changedFiles = () => {
  const base = execFileSync(
    'git',
    ['merge-base', 'origin/claude/review', 'HEAD'],
    { cwd: ROOT, encoding: 'utf8' },
  ).trim();
  return [
    ...new Set([
      ...git(['diff', '--name-only', base]),
      ...git(['ls-files', '--others', '--exclude-standard']),
    ]),
  ];
};

const matches = (def, files) => {
  const patterns = def.paths.map(globToRegExp);
  return files.some((file) => patterns.some((re) => re.test(file)));
};

/** The units of one test: one per base, per scenario, or one. */
const units = (def, opts) => {
  // --all and --changed run every test; --base and --scenario narrow the
  // tests that have them and leave the others whole.
  const many = opts.all || opts.changed;
  if (def.bases) {
    if (opts.base && !def.bases.includes(opts.base)) {
      fail(`${def.name} has no base ${opts.base} (${def.bases.join(', ')})`);
    }
    return (opts.base ? [opts.base] : def.bases).map((base) => ({ base }));
  }
  if (def.scenarios) {
    if (opts.scenario && !def.scenarios.includes(opts.scenario)) {
      fail(
        `${def.name} has no scenario ${opts.scenario} (${def.scenarios.join(', ')})`,
      );
    }
    return (opts.scenario ? [opts.scenario] : def.scenarios).map(
      (scenario) => ({ scenario }),
    );
  }
  if (!many && (opts.base || opts.scenario)) {
    fail(`${def.name} takes no --base or --scenario`);
  }
  return [{}];
};

const sha = () => {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'unknown';
  }
};

const runUnit = async (def, unit, opts) => {
  const startedAt = new Date();
  const ctx = Object.freeze({
    ...unit,
    ci: Boolean(opts.ci),
    flags: Object.freeze([...opts.flags]),
    root: ROOT,
    out: OUT,
    log: (line) => console.log(line),
  });
  let result;
  try {
    result = await def.run(ctx);
  } catch (error) {
    result = {
      status: 'fail',
      summary: error.message.split('\n')[0],
      errors: [error.stack ?? error.message],
    };
  }
  const record = {
    name: def.name,
    ...unit,
    status: result.status === 'pass' ? 'pass' : 'fail',
    summary: result.summary,
    ...(result.details ? { details: result.details } : {}),
    ...(result.errors?.length ? { errors: result.errors } : {}),
    startedAt: startedAt.toISOString(),
    durationMs: Date.now() - startedAt.getTime(),
    sha: sha(),
  };
  writeRecord(OUT, record);
  report(record, { ci: ctx.ci });
  return record;
};

const tests = await discover();
const opts = parseArgs(process.argv.slice(2), new Set(tests.keys()));
if (opts.ci) {
  process.env.NO_COLOR = '1';
  process.env.FORCE_COLOR = '0';
}

let selected;
if (opts.changed) {
  const files = changedFiles();
  selected = ordered(tests).filter((def) => matches(def, files));
  if (!selected.length) {
    console.log('no test matches the change');
    process.exit(0);
  }
} else if (opts.all) {
  selected = ordered(tests);
} else if (opts.list) {
  selected = ordered(tests);
} else if (opts.names.length) {
  selected = opts.names.map((name) => tests.get(name));
} else {
  fail(
    `name a test (${ordered(tests)
      .map((t) => t.name)
      .join(', ')}), or --list, --all, --changed`,
  );
}

if (opts.list) {
  for (const def of selected) {
    const variants = def.bases ?? def.scenarios;
    const suffix = def.pending ? ' [pending]' : '';
    console.log(
      `${def.name}${variants ? ` (${variants.join(', ')})` : ''}${suffix}`,
    );
  }
  process.exit(0);
}

const records = [];
for (const def of selected) {
  if (def.pending) {
    console.log(`${def.name}: skipped (pending)`);
    continue;
  }
  for (const unit of units(def, opts)) {
    records.push(await runUnit(def, unit, opts));
  }
}
const failed = records.filter((r) => r.status !== 'pass');
if (records.length > 1) {
  console.log(
    `test: ${records.length - failed.length} passed, ${failed.length} failed`,
  );
}
process.exit(failed.length ? 1 : 0);
