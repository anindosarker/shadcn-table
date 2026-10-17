import type { ReactNode } from 'react';
import { highlight } from 'fumadocs-core/highlight';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { readExampleSource } from '@/lib/example-source';
import { SourceCodeSnippet } from './source-code-snippet';

interface Props {
  /** Folder name under examples/, also the anchor prefix. */
  name: string;
  /** The live example. */
  children: ReactNode;
}

/** Server side: reads examples/<name>/TS.tsx and highlights it with shiki. */
export const ExampleSnippet = async ({ name, children }: Props) => {
  const source = await readExampleSource(name);
  const rendered = await highlight(source, {
    lang: 'tsx',
    components: { pre: Pre },
  });

  return (
    <SourceCodeSnippet
      code={<CodeBlock title="TS.tsx">{rendered}</CodeBlock>}
      tableId={name}
    >
      {children}
    </SourceCodeSnippet>
  );
};
