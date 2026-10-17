'use client';

import { useState, type ReactNode } from 'react';
import { CodeIcon, CodeXmlIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SourceCodeSnippetProps {
  /** The live example; omitted for source-only snippets (prop tables). */
  children?: ReactNode;
  /** The highlighted TS source, already wrapped in a fumadocs CodeBlock. */
  code: ReactNode;
  tableId: string;
}

export const SourceCodeSnippet = ({
  children,
  code,
  tableId,
}: SourceCodeSnippetProps) => {
  const [showCode, setShowCode] = useState(false);
  const demoId = `${tableId}-demo`;
  const codeId = `${tableId}-source-code`;

  return (
    <div className="not-prose my-8 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {children !== undefined ? (
          <h4 id={demoId} className="scroll-mt-24 text-xl font-semibold">
            <a href={`#${demoId}`} className="hover:underline">
              Demo
            </a>
          </h4>
        ) : (
          <span />
        )}
        <Button
          aria-controls={codeId}
          aria-expanded={showCode}
          onClick={() => setShowCode((open) => !open)}
          size="sm"
          variant="outline"
        >
          {showCode ? <CodeXmlIcon /> : <CodeIcon />}
          {showCode ? 'Hide Code' : 'Code'}
        </Button>
      </div>
      {children}
      {showCode && (
        <div className="flex flex-col gap-4" id={codeId}>
          <h4 className="scroll-mt-24 text-xl font-semibold">
            <a href={`#${codeId}`} className="hover:underline">
              Source Code
            </a>
          </h4>
          {code}
        </div>
      )}
    </div>
  );
};
