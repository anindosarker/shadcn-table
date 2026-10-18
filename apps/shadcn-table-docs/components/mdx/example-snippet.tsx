import path from 'node:path';
import type { ReactNode } from 'react';
import { highlight } from 'fumadocs-core/highlight';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { buildExamplePrompt, buildInstallCommand } from '@/lib/example-prompt';
import { readExampleFiles } from '@/lib/example-source';
import { gitConfig } from '@/lib/shared';
import { ExamplePlayground } from '@/components/example-playground';

interface Props {
  /** Folder name under examples/, also the panel's anchor id. */
  name: string;
  /** The live example. */
  children: ReactNode;
}

const LANGS: Record<string, string> = {
  '.tsx': 'tsx',
  '.ts': 'ts',
  '.css': 'css',
  '.json': 'json',
};

/**
 * Server side: reads every source file under examples/<name> (TS.tsx first,
 * subfolders included, the index.tsx wrapper left out), highlights each by
 * its extension with shiki and hands the code blocks, the install command
 * and the copy prompt plus the live table to the client playground panel.
 */
export const ExampleSnippet = async ({ name, children }: Props) => {
  const sources = await readExampleFiles(name);
  const files = await Promise.all(
    sources.map(async (file) => {
      const lang = LANGS[path.extname(file.path)] ?? 'text';
      const rendered = await highlight(file.source, {
        lang,
        components: { pre: Pre },
      });
      return {
        path: file.path,
        source: file.source,
        node: (
          <CodeBlock
            allowCopy={false}
            className="my-0 rounded-none border-0"
            viewportProps={{ className: 'max-h-[32rem]' }}
          >
            {rendered}
          </CodeBlock>
        ),
      };
    }),
  );
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/tree/${gitConfig.branch}/apps/shadcn-table-docs/examples/${name}`;
  const prompt = await buildExamplePrompt({ name });

  return (
    <ExamplePlayground
      files={files}
      githubUrl={githubUrl}
      installCommand={buildInstallCommand(name)}
      name={name}
      prompt={prompt}
    >
      {children}
    </ExamplePlayground>
  );
};
