import path from 'node:path';
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
 * Server side: reads every source file of the example once (TS.tsx first,
 * subfolders included, the index.tsx wrapper left out; the base-neutral
 * source with its `@/components/ui/` imports, shown on both bases),
 * highlights each by its extension with shiki and hands the code blocks
 * plus, per base, the install command and the copy prompt to the client
 * playground panel, which shows them next to the lazily loaded live table
 * of the selected base.
 */
export const ExampleSnippet = async ({ name }: Props) => {
  const render = (source: string, lang: string) =>
    highlight(source, { lang, components: { pre: Pre } }).then((rendered) => (
      <CodeBlock
        allowCopy={false}
        className="my-0 rounded-none border-0"
        viewportProps={{ className: 'max-h-[32rem]' }}
      >
        {rendered}
      </CodeBlock>
    ));

  const sources = await readExampleFiles(name);
  const files = await Promise.all(
    sources.map(async (file) => ({
      path: file.path,
      source: file.source,
      node: await render(file.source, LANGS[path.extname(file.path)] ?? 'text'),
    })),
  );

  const variantFor = async (base: Base): Promise<ExampleVariantData> => ({
    files,
    installCommand: exampleAddCommand(name, base),
    prompt: await buildExamplePrompt({ name, base }),
  });

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
