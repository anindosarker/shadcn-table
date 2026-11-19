// The module story-source-plugin.ts serves (spec 66, 1.6.4).
declare module 'virtual:story-sources' {
  /** The code text of a story, by id; undefined for an unknown id. */
  export const storySource: (id: string) => string | undefined;
}
