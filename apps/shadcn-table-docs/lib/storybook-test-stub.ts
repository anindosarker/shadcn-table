/**
 * The docs bundle's `storybook/test` (next.config.mjs `turbopack.resolveAlias`).
 * The story pages mount stories through `composeStories` of
 * `@storybook/react` (components/story-variant.tsx), and Storybook's core
 * annotations import `storybook/test`, which bundles @testing-library/dom,
 * @testing-library/user-event and the expect library. The docs never run a
 * play, so each export here does nothing and no test library reaches a
 * visitor's bundle (spec 56, 1.6.4). Every name a bundled module imports from
 * `storybook/test` is exported: Storybook's own (csf, @storybook/react) and the
 * story files' (stories/**).
 */
const noop = () => {};

/** Accepts any property read or call and returns itself, for play code that never runs. */
const chain: never = new Proxy(noop, {
  get: (_target, key) => (key === 'then' ? undefined : chain),
  apply: () => chain,
}) as never;

// Storybook's core annotations (storybook/internal/csf, @storybook/react)
export const fn = (implementation?: (...args: never[]) => unknown) =>
  implementation ?? noop;
export const isMockFunction = () => false;
export const onMockCall = () => noop;
export const clearAllMocks = noop;
export const resetAllMocks = noop;
export const restoreAllMocks = noop;
export const configure = noop;
export const uninstrumentedUserEvent = { setup: () => chain };
export const within = () => chain;

// the story files' play functions
export const expect = chain;
export const waitFor = chain;
export const userEvent = chain;
export const fireEvent = chain;
export const spyOn = chain;
export const screen = chain;
