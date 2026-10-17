import type { ReactNode } from 'react';
import { highlight } from 'fumadocs-core/highlight';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { readExampleFiles } from '@/lib/example-source';
import { gitConfig } from '@/lib/shared';
import { ExamplePlayground } from '@/components/example-playground';

interface Props {
  /** Folder name under examples/, also the panel's anchor id. */
  name: string;
  /** The live example. */
  children: ReactNode;
}

/**
 * Server side: reads examples/<name>/TS.tsx (and makeData.ts when present),
 * highlights them with shiki and hands the code blocks plus the live table
 * to the client playground panel.
 */
export const ExampleSnippet = async ({ name, children }: Props) => {
  const sources = await readExampleFiles(name);
  const files = await Promise.all(
    sources.map(async (file) => {
      const rendered = await highlight(file.source, {
        lang: file.name.endsWith('.tsx') ? 'tsx' : 'ts',
        components: { pre: Pre },
      });
      return {
        name: file.name,
        node: (
          <CodeBlock
            className="my-0 rounded-none border-0"
            viewportProps={{ className: 'max-h-[32rem]' }}
          >
            {rendered}
          </CodeBlock>
        ),
      };
    }),
  );
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/tree/${gitConfig.branch}/apps/shadcn-react-table-docs/examples/${name}`;

  return (
    <ExamplePlayground files={files} githubUrl={githubUrl} name={name}>
      {children}
    </ExamplePlayground>
  );
};
