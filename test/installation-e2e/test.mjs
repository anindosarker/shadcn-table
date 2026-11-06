// installation-e2e (per scenario, D78, D79): a fresh app installs the table
// from a dev registry built from this checkout, mounts it, type-checks and
// builds; the Next scenarios then run the browser phase (lib/browser.mjs)
// against `next dev`. The former install.yml steps as Node, in their order;
// the first failing step ends the scenario.
//
//   fresh, existing   radix, Vite (existing pre-installs the TanStack packages)
//   base, aria        that base, Vite
//   nextjs-<base>     that base, Next.js, then the browser phase
//
// Build phase, in a fresh directory under the OS temp dir ($RUNNER_TEMP
// under --ci): `shadcn init` from the template, the dev registry
// (`registry:dev` with REGISTRY_BASE_URL) served on 5310 under --ci, else on
// a free agent port (never the shared 5310), the item added from it; Vite:
// fixtures/vite/App.tsx, tsc and vite build, then the locale and
// example-basic with fixtures/vite/App-example.tsx and both builds again;
// Next: fixtures/table-demo.tsx, fixtures/page.tsx and fixtures/pages/
// copied in, the TooltipProvider wrap (not on aria), next build; the
// package.json asserts last.
//
// Flags: --no-browser skips the browser phase, --no-diff captures without
// comparing (macOS rendering, D79). The captures and result.json land in
// test/.out/installation-e2e-<scenario>/. Summary `built`, or
// `built, browser pass, diff <n> px` for a Next scenario.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { portFor, run as exec, spawnServer } from '../lib/exec.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(HERE, 'fixtures');
const CI_REGISTRY_PORT = 5310;
const CI_NEXT_PORT = 5341;

export const SCENARIOS = {
  fresh: { base: 'radix', template: 'vite' },
  existing: { base: 'radix', template: 'vite' },
  base: { base: 'base', template: 'vite' },
  aria: { base: 'aria', template: 'vite' },
  'nextjs-base': { base: 'base', template: 'next' },
  'nextjs-radix': { base: 'radix', template: 'next' },
  'nextjs-aria': { base: 'aria', template: 'next' },
};

/**
 * shadcn's `aria-nova` `label` part ships an unused `import * as React`,
 * which fails Vite's `noUnusedLocals` (TS6133); the documented user step
 * deletes the line (v0.6.x decision 4). Throws when the line is missing, so
 * an upstream fix shows up here; remove the step then.
 */
export const dropLabelImport = (app) => {
  const file = path.join(app, 'src/components/ui/label.tsx');
  const source = fs.readFileSync(file, 'utf8');
  const line = /^import \* as React from ["']react["'];?\r?\n/m;
  if (!line.test(source)) {
    throw new Error(
      'src/components/ui/label.tsx: no `import * as React from "react"` line; upstream may have dropped it, remove this step',
    );
  }
  fs.writeFileSync(file, source.replace(line, ''));
  return 'src/components/ui/label.tsx: unused React import deleted';
};

/**
 * The user step for the base and radix tooltip part on Next: the layout's
 * children wrapped in TooltipProvider. Throws when the template's
 * ThemeProvider line is not there.
 */
export const wrapTooltipProvider = (app) => {
  const file = path.join(app, 'app/layout.tsx');
  const source = fs.readFileSync(file, 'utf8');
  const provider = '<ThemeProvider>{children}</ThemeProvider>';
  if (!source.includes(provider)) {
    throw new Error(
      `app/layout.tsx: no \`${provider}\` line; the Next template changed, update this step`,
    );
  }
  const wrapped =
    '<ThemeProvider><TooltipProvider>{children}</TooltipProvider></ThemeProvider>';
  fs.writeFileSync(
    file,
    `import { TooltipProvider } from "@/components/ui/tooltip"\n${source.replace(provider, wrapped)}`,
  );
  return 'app/layout.tsx: children wrapped in TooltipProvider';
};

/** The package.json asserts; returns the problems. */
export const packageAsserts = (app, scenario) => {
  const problems = [];
  const pkg = JSON.parse(
    fs.readFileSync(path.join(app, 'package.json'), 'utf8'),
  );
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  const count = Object.keys(all).filter(
    (k) => k === '@tanstack/react-table',
  ).length;
  if (count !== 1) {
    problems.push(
      `@tanstack/react-table: ${count} package.json entries, expected 1`,
    );
  }
  let installed;
  try {
    installed = createRequire(path.join(app, 'package.json'))(
      '@tanstack/react-table/package.json',
    ).version;
  } catch (error) {
    problems.push(`@tanstack/react-table not installed: ${error.message}`);
  }
  if (installed && !installed.startsWith('9.')) {
    problems.push(
      `installed @tanstack/react-table ${installed}, expected a 9.x install`,
    );
  }
  if (scenario === 'base' && 'radix-ui' in all) {
    problems.push(`radix-ui installed on the Base UI base: ${all['radix-ui']}`);
  }
  if (scenario === 'aria') {
    const other = ['radix-ui', '@base-ui/react'].filter((n) => n in all);
    if (other.length)
      problems.push(`installed on the React Aria base: ${other.join(', ')}`);
    if (!('react-aria-components' in all))
      problems.push('react-aria-components missing');
  }
  return { problems, installed };
};

class StepError extends Error {}

export const run = async (ctx) => {
  const scenario = ctx.scenario;
  const { base, template } = SCENARIOS[scenario];
  const item = `shadcn-table-${base}`;
  const exampleItem = `example-basic-${base}`;
  const noBrowser = ctx.flags.includes('--no-browser');
  const noDiff = ctx.flags.includes('--no-diff');
  const outDir = path.join(ctx.out, `installation-e2e-${scenario}`);
  fs.rmSync(outDir, { recursive: true, force: true });
  const tempRoot =
    ctx.ci && process.env.RUNNER_TEMP ? process.env.RUNNER_TEMP : os.tmpdir();
  const tmp = fs.mkdtempSync(
    path.join(tempRoot, `installation-e2e-${scenario}-`),
  );
  const app = path.join(tmp, 'app');
  const servers = [];
  const done = [];
  let addLog = '';
  const details = { scenario, base, template, dir: tmp };

  const step = async (name, cmd, args, opts = {}) => {
    ctx.log(`installation-e2e (${scenario}): ${name}`);
    const result = await exec(cmd, args, { capture: true, ...opts });
    if (opts.addLog) addLog += result.stdout + result.stderr;
    if (result.code !== 0) throw new StepError(`${name}: exit ${result.code}`);
    done.push(name);
    return result;
  };
  const inline = (name, fn) => {
    ctx.log(`installation-e2e (${scenario}): ${name}`);
    try {
      ctx.log(fn());
    } catch (error) {
      throw new StepError(`${name}: ${error.message}`);
    }
    done.push(name);
  };
  const copy = (from, to) => {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.cpSync(from, to, { recursive: true });
  };

  try {
    await step(
      `scaffold a ${template === 'vite' ? 'Vite' : 'Next.js'} app on ${base}`,
      'pnpm',
      [
        'dlx',
        'shadcn@latest',
        'init',
        '--template',
        template,
        '--base',
        base,
        '--preset',
        'nova',
        '--name',
        'app',
        '--yes',
      ],
      { cwd: tmp },
    );
    if (scenario === 'existing') {
      await step(
        'pre-install the TanStack packages',
        'pnpm',
        [
          'add',
          '@tanstack/react-table@9.3.1',
          '@tanstack/react-store@0.11.2',
          '@tanstack/react-query',
        ],
        { cwd: app },
      );
    }

    // The items depend on the core item's GitHub address, which the CLI
    // resolves on the default branch; the dev registry built from this
    // checkout pins every dependency to this checkout's library.
    const registryPort = await portFor(ctx, CI_REGISTRY_PORT);
    const registry = `http://localhost:${registryPort}/r`;
    const registryEnv = ctx.ci ? {} : { REGISTRY_BASE_URL: registry };
    await step(
      'build the dev registry',
      'pnpm',
      ['--filter', 'shadcn-table', 'registry:dev'],
      {
        cwd: ctx.root,
        env: registryEnv,
      },
    );
    ctx.log(
      `installation-e2e (${scenario}): serve the dev registry on ${registry}`,
    );
    servers.push(
      await spawnServer(
        'pnpm',
        [
          'exec',
          'serve',
          'packages/shadcn-table/.dev',
          '-l',
          String(registryPort),
        ],
        {
          cwd: ctx.root,
          readyUrl: `${registry}/${item}.json`,
          timeoutMs: 30_000,
          name: 'serve',
        },
      ),
    );
    await step(
      'add the library',
      'pnpm',
      ['dlx', 'shadcn@latest', 'add', `${registry}/${item}.json`, '--yes'],
      {
        cwd: app,
        addLog: true,
      },
    );
    if (scenario === 'aria') {
      inline("delete the aria label part's unused React import", () =>
        dropLabelImport(app),
      );
    }

    if (template === 'vite') {
      copy(path.join(FIXTURES, 'vite/App.tsx'), path.join(app, 'src/App.tsx'));
      await step(
        'tsc',
        'pnpm',
        ['exec', 'tsc', '--noEmit', '-p', 'tsconfig.app.json'],
        { cwd: app },
      );
      await step('vite build', 'pnpm', ['exec', 'vite', 'build'], { cwd: app });
    } else {
      copy(
        path.join(FIXTURES, 'pages/app/release-gate'),
        path.join(app, 'app/release-gate'),
      );
      copy(
        path.join(FIXTURES, 'pages/components/gate'),
        path.join(app, 'components/gate'),
      );
      if (base !== 'aria')
        inline('wrap the layout in TooltipProvider', () =>
          wrapTooltipProvider(app),
        );
      copy(
        path.join(FIXTURES, 'table-demo.tsx'),
        path.join(app, 'components/table-demo.tsx'),
      );
      copy(path.join(FIXTURES, 'page.tsx'), path.join(app, 'app/page.tsx'));
      await step('next build', 'pnpm', ['exec', 'next', 'build'], { cwd: app });

      if (noBrowser) {
        details.browser = 'skipped';
      } else {
        const nextPort = await portFor(ctx, CI_NEXT_PORT);
        const origin = `http://localhost:${nextPort}`;
        ctx.log(`installation-e2e (${scenario}): next dev on ${origin}`);
        const nextDev = await spawnServer(
          'pnpm',
          ['exec', 'next', 'dev', '-p', String(nextPort)],
          {
            cwd: app,
            readyUrl: `${origin}/release-gate`,
            timeoutMs: 180_000,
            name: 'next dev',
          },
        );
        servers.push(nextDev);
        const browser = await exec(
          process.execPath,
          [
            path.join(HERE, 'lib/browser.mjs'),
            '--base',
            base,
            '--url',
            origin,
            '--out',
            outDir,
            ...(noDiff ? ['--no-diff'] : []),
          ],
          { cwd: ctx.root },
        );
        await nextDev.stop();
        servers.splice(servers.indexOf(nextDev), 1);
        let result = {};
        try {
          result = JSON.parse(
            fs.readFileSync(path.join(outDir, 'result.json'), 'utf8'),
          );
        } catch {
          // no result written
        }
        const pixels = Object.values(result.captures ?? {})
          .map((c) => c.diffPixels)
          .filter((n) => typeof n === 'number');
        details.browser = browser.code === 0 ? 'pass' : 'fail';
        details.diffPixels = pixels.length ? Math.max(...pixels) : null;
        if (browser.code !== 0) {
          throw new StepError(
            `browser phase: ${(result.failures ?? []).join('; ') || `exit ${browser.code}`}`,
          );
        }
        done.push('browser phase');
      }
    }

    if (template === 'vite') {
      await step(
        'add the locale',
        'pnpm',
        [
          'dlx',
          'shadcn@latest',
          'add',
          `${registry}/${item}-locale-de.json`,
          '--yes',
          '--overwrite',
        ],
        { cwd: app, addLog: true },
      );
      await step(
        'add example-basic',
        'pnpm',
        [
          'dlx',
          'shadcn@latest',
          'add',
          `${registry}/${exampleItem}.json`,
          '--yes',
          '--overwrite',
        ],
        { cwd: app, addLog: true },
      );
      // The locale item depends on the library item, which lists `label`;
      // --overwrite brings the part back with its import.
      if (scenario === 'aria') {
        inline("delete the aria label part's unused React import, again", () =>
          dropLabelImport(app),
        );
      }
      copy(
        path.join(FIXTURES, 'vite/App-example.tsx'),
        path.join(app, 'src/App.tsx'),
      );
      await step(
        'tsc with the locale and example',
        'pnpm',
        ['exec', 'tsc', '--noEmit', '-p', 'tsconfig.app.json'],
        {
          cwd: app,
        },
      );
      await step(
        'vite build with the locale and example',
        'pnpm',
        ['exec', 'vite', 'build'],
        { cwd: app },
      );
    }

    const asserts = packageAsserts(app, scenario);
    details.reactTable = asserts.installed;
    if (asserts.problems.length) {
      throw new StepError(`package.json: ${asserts.problems.join('; ')}`);
    }
    done.push('package.json asserts');
  } catch (error) {
    const message =
      error instanceof StepError
        ? error.message
        : (error.stack ?? error.message);
    const errors = [message];
    try {
      errors.push(
        `package.json: ${fs.readFileSync(path.join(app, 'package.json'), 'utf8')}`,
      );
    } catch {
      // no app
    }
    if (addLog) errors.push(`shadcn output (tail): ${addLog.slice(-2000)}`);
    ctx.log(`installation-e2e (${scenario}): kept ${tmp} for inspection`);
    return {
      status: 'fail',
      summary: message.split('\n')[0],
      details: { ...details, done },
      errors,
    };
  } finally {
    for (const server of servers) await server.stop();
  }

  fs.rmSync(tmp, { recursive: true, force: true });
  let summary = 'built';
  if (template === 'next') {
    if (details.browser === 'skipped') summary += ', browser skipped';
    else if (noDiff || details.diffPixels === null)
      summary += ', browser pass, no diff';
    else summary += `, browser pass, diff ${details.diffPixels} px`;
  }
  return { status: 'pass', summary, details: { ...details, done } };
};
