// Types of tools/story-source/extract.mjs for the TypeScript readers
// (packages/shadcn-table/.storybook/story-source-plugin.ts).

/** One story's code text (spec 66, 1.6.3). */
export function storyCode(story: {
  fileText: string;
  exportName: string;
  file?: string;
}): string;
/** Every story's code text, keyed by story id. */
export function storySources(): Promise<Record<string, string>>;
/** The names a node uses and does not declare itself. */
export function usedNames(node: unknown): Set<string>;
export const ts: typeof import('typescript');
