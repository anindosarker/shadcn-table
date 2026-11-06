// validate-repo: five repository checks in order, all of them before the
// exit: bases-identical, icon-maps, tailwind-classes, registry-valid, unit.
// Summary `bases identical, icon maps complete, tailwind valid, registry
// valid, <n> unit tests`, the failing checks named on a failure.
import { check as basesIdentical } from './lib/bases-identical.mjs';
import { check as iconMaps } from './lib/icon-maps.mjs';
import { check as registryValid } from './lib/registry-valid.mjs';
import { check as tailwindClasses } from './lib/tailwind-classes.mjs';
import { check as unit } from './lib/unit.mjs';

export const run = async (ctx) => {
  const errors = [];
  const parts = [];
  const step = async (name, ok, fn) => {
    let problems;
    try {
      problems = await fn();
    } catch (error) {
      problems = [error.message];
    }
    if (problems.length) {
      parts.push(`${name} failed (${problems.length})`);
      errors.push(...problems.map((problem) => `${name}: ${problem}`));
    } else parts.push(ok);
  };
  await step('bases-identical', 'bases identical', () =>
    basesIdentical(ctx.log),
  );
  await step('icon-maps', 'icon maps complete', () => iconMaps(ctx.log));
  await step('tailwind-classes', 'tailwind valid', () =>
    tailwindClasses(ctx.log),
  );
  await step('registry-valid', 'registry valid', () =>
    registryValid(ctx.log, ctx.root),
  );
  let tests = 0;
  await step('unit', 'unit', async () => {
    const result = await unit(ctx.log, ctx.root);
    tests = result.tests;
    return result.problems;
  });
  const i = parts.indexOf('unit');
  if (i >= 0) parts[i] = `${tests} unit tests`;
  return {
    status: errors.length ? 'fail' : 'pass',
    summary: parts.join(', '),
    details: { unitTests: tests },
    ...(errors.length ? { errors } : {}),
  };
};
