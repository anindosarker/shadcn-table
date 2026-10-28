import path from 'node:path';
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
  /** Folder name under examples/<base>/, also the panel's anchor id. */
  name: string;
}

const LANGS: Record<string, string> = {
  '.tsx': 'tsx',
  '.ts': 'ts',
  '.css': 'css',
  '.json': 'json',
};

/**
 * Server side: reads, per base, every source file of that base's example
 * (examples/<base>/<name>: TS.tsx first, subfolders included; the
 * hand-written source with its `@/components/ui/` imports) and hands the raw
 * sources with their shiki language plus the base's GitHub folder, install
 * command and copy prompt to the client playground panel, which shows them
 * next to the lazily loaded live table of the selected base. Nothing is
 * highlighted here: the explorer highlights the active file in the browser,
 * so the page carries strings instead of a rendered tree per file.
 */
export const ExampleSnippet = async ({ name }: Props) => {
  const variantFor = async (base: Base): Promise<ExampleVariantData> => {
    const sources = await readExampleFiles(name, base);
    return {
      files: sources.map((file) => ({
        path: file.path,
        source: file.source,
        lang: LANGS[path.extname(file.path)] ?? 'text',
      })),
      githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}/tree/${gitConfig.branch}/apps/shadcn-table-docs/examples/${base}/${name}`,
      installCommand: exampleAddCommand(name, base),
      prompt: await buildExamplePrompt({ name, base }),
    };
  };

  const variants = Object.fromEntries(
    await Promise.all(
      bases.map(async (base) => [base, await variantFor(base)] as const),
    ),
  ) as Record<Base, ExampleVariantData>;

  return (
    <ExamplePlayground name={name} variants={variants}>
      <ExampleVariant name={name} />
    </ExamplePlayground>
  );
};
