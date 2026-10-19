import path from 'node:path';
import type { ReactNode } from 'react';
import { highlight } from 'fumadocs-core/highlight';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { buildExamplePrompt } from '@/lib/example-prompt';
import { readExampleFiles } from '@/lib/example-source';
import { bases, exampleAddCommand, type Base } from '@/lib/install';
import { gitConfig } from '@/lib/shared';
import {
  ExamplePlayground,
  type ExampleVariantData,
} from '@/components/example-playground';
import { ExampleVariant } from '@/components/example-variant';

interface Props {
  /** Folder name under examples/, also the panel's anchor id. */
  name: string;
}

const LANGS: Record<string, string> = {
  '.tsx': 'tsx',
  '.ts': 'ts',
  '.css': 'css',
  '.json': 'json',
};

/**
 * Server side: for each base, reads every source file of the example
 * (TS.tsx first, subfolders included, the index.tsx wrapper left out; the
 * Base UI variant from examples/.base), highlights each by its extension
 * with shiki and hands the code blocks, the install command and the copy
 * prompt to the client playground panel, which shows the selected base's
 * set next to the lazily loaded live table of that base.
 */
export const ExampleSnippet = async ({ name }: Props) => {
  // Files without a ui import are identical on both bases; highlight once.
  const highlighted = new Map<string, Promise<ReactNode>>();
  const render = (source: string, lang: string) => {
    const key = `${lang}\n${source}`;
    let node = highlighted.get(key);
    if (!node) {
      node = highlight(source, { lang, components: { pre: Pre } }).then(
        (rendered) => (
          <CodeBlock
            allowCopy={false}
            className="my-0 rounded-none border-0"
            viewportProps={{ className: 'max-h-[32rem]' }}
          >
            {rendered}
          </CodeBlock>
        ),
      );
      highlighted.set(key, node);
    }
    return node;
  };

  const variantFor = async (base: Base): Promise<ExampleVariantData> => {
    const sources = await readExampleFiles(name, base);
    const files = await Promise.all(
      sources.map(async (file) => ({
        path: file.path,
        source: file.source,
        node: await render(
          file.source,
          LANGS[path.extname(file.path)] ?? 'text',
        ),
      })),
    );
    return {
      files,
      installCommand: exampleAddCommand(name, base),
      prompt: await buildExamplePrompt({ name, base }),
    };
  };

  const variants = Object.fromEntries(
    await Promise.all(
      bases.map(async (base) => [base, await variantFor(base)] as const),
    ),
  ) as Record<Base, ExampleVariantData>;
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/tree/${gitConfig.branch}/apps/shadcn-table-docs/examples/${name}`;

  return (
    <ExamplePlayground githubUrl={githubUrl} name={name} variants={variants}>
      <ExampleVariant name={name} />
    </ExamplePlayground>
  );
};
