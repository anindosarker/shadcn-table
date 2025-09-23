#!/usr/bin/env node
import { Eta } from 'eta';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { cyan, green, yellow } from 'kolorist';
import { dirname, join, relative } from 'path';

// Simple mode: no args required. Legacy `add data-table` is still accepted but not required.
const [, , ..._argv] = process.argv;

const cwd = process.cwd();
// Compute path to CLI's templates directory (we ship src/templates with the package)
const selfPath = process.argv[1] || '';
const cliDir = dirname(selfPath);
const templatesRoot = join(cliDir, '..', 'src', 'templates');
const sourceDir = join(templatesRoot, 'shadcn-react-table');

function listFilesRecursively(rootDir: string): string[] {
  const results: string[] = [];
  const stack: string[] = [rootDir];
  while (stack.length) {
    const current = stack.pop() as string;
    for (const entry of readdirSync(current)) {
      const full = join(current, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) stack.push(full);
      else if (stat.isFile()) results.push(full);
    }
  }
  return results;
}

async function formatWithPrettier(code: string) {
  return code;
}

async function run() {
  const engine = new Eta();
  if (!existsSync(sourceDir)) {
    console.log(
      yellow('!'),
      cyan('Missing templates dir:'),
      relative(cwd, sourceDir),
    );
    process.exit(1);
  }
  const files = listFilesRecursively(sourceDir);
  for (const template of files) {
    const raw = readFileSync(template, 'utf8');
    const rendered = engine.renderString(raw, {}) ?? raw;
    // Map template path under src/templates/shadcn-react-table/** to app's src/components/ui/shadcn-react-table/**
    const rel = template.slice(sourceDir.length + 1);
    const target = join(cwd, 'src/components/ui/shadcn-react-table', rel);
    const formatted = await formatWithPrettier(rendered);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, formatted, 'utf8');
    console.log(green('✔'), cyan('Generated:'), relative(cwd, target));
  }
}

run();
