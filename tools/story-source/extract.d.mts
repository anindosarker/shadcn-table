// Types of tools/story-source/extract.mjs for the TypeScript readers
// (packages/shadcn-table/.storybook/story-source-plugin.ts).

/** One story's code text (spec 66, 1.6.3). */
export function storyCode(story: {
  fileText: string;
  exportName: string;
  file?: string;
  /** The base the text names as `ST_BASE`; the default base when left out. */
  base?: 'base' | 'radix' | 'aria';
}): string;
/** Every story's code text for one base, keyed by story id. */
export function storySources(options?: {
  base?: 'base' | 'radix' | 'aria';
}): Promise<Record<string, string>>;
/** The words of a test (D142). */
export const TEST_WORDS: RegExp;
export const ts: typeof import('typescript');
