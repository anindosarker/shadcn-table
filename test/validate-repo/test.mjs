// validate-repo: nine repository checks in order, all of them before the
// exit: bases-identical, date-picker, icon-maps, tailwind-classes,
// registry-valid, registry-fresh, story-pages, story-source, unit. Summary
// `bases identical, date picker matches, icon maps complete, tailwind valid,
// registry valid, registry fresh, story pages match, story code complete, <n>
// unit tests`, the failing checks named on a failure.
import { check as basesIdentical } from './lib/bases-identical.mjs';
import { check as datePicker } from './lib/date-picker.mjs';
import { check as iconMaps } from './lib/icon-maps.mjs';
import { check as registryFresh } from './lib/registry-fresh.mjs';
import { check as registryValid } from './lib/registry-valid.mjs';
import { check as storyPages } from './lib/story-pages.mjs';
import { check as storySource } from './lib/story-source.mjs';
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
  await step('date-picker', 'date picker matches', () =>
    datePicker(ctx.log, ctx.root, ctx.ci),
  );
  await step('icon-maps', 'icon maps complete', () => iconMaps(ctx.log));
  await step('tailwind-classes', 'tailwind valid', () =>
    tailwindClasses(ctx.log),
  );
  await step('registry-valid', 'registry valid', () =>
    registryValid(ctx.log, ctx.root),
  );
  await step('registry-fresh', 'registry fresh', () =>
    registryFresh(ctx.log, ctx.root),
  );
  await step('story-pages', 'story pages match', () => storyPages(ctx.log));
  await step('story-source', 'story code complete', () => storySource(ctx.log));
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
