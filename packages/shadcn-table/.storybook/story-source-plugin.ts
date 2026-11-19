import path from 'node:path';
import type { Plugin } from 'vite';
import type { Base } from '../../../tools/registry/bases.mjs';
import { storySources } from '../../../tools/story-source/extract.mjs';

/**
 * `virtual:story-sources` (spec 66, 1.6.4, D142): every story's code text
 * (tools/story-source/extract.mjs) for this Storybook's base, keyed by story
 * id, for the Code tab
 * (preview.tsx `docs.source.transform`). The texts are kept on globalThis so a
 * story file edited under `storybook dev` updates the text the preview reads:
 * the module is invalidated on every story file change and accepts itself.
 */
const ID = 'virtual:story-sources';
const RESOLVED = `\0${ID}`;
const STORIES_DIR = path.resolve(import.meta.dirname, '../stories');

const moduleText = (sources: Record<string, string>) => `
const sources = ${JSON.stringify(sources)};
globalThis.__ST_STORY_SOURCES__ = sources;
/** The code text of a story, by id. */
export const storySource = (id) => globalThis.__ST_STORY_SOURCES__[id];
if (import.meta.hot) import.meta.hot.accept();
`;

/** `base`: the base this Storybook renders, which the texts name as `ST_BASE`. */
export function storySourcePlugin({ base }: { base: Base }): Plugin {
  return {
    name: 'shadcn-table:story-sources',
    resolveId: (source) => (source === ID ? RESOLVED : undefined),
    load: async (id) =>
      id === RESOLVED ? moduleText(await storySources({ base })) : undefined,
    configureServer(server) {
      server.watcher.on('change', (file) => {
        if (!file.startsWith(STORIES_DIR) || !file.endsWith('.tsx')) return;
        const module = server.moduleGraph.getModuleById(RESOLVED);
        if (module) void server.reloadModule(module);
      });
    },
  };
}
