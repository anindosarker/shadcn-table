'use client';

import { useState, type ReactNode } from 'react';
import { CodeIcon, CodeXmlIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  /** The highlighted source, already wrapped in a fumadocs CodeBlock. */
  code: ReactNode;
  /** Anchor id of the wrapper, MRT's `tableId` for the page. */
  tableId: string;
}

/** Small Code toggle for source-only snippets (prop tables). */
export const SourceToggle = ({ code, tableId }: Props) => {
  const [open, setOpen] = useState(false);
  const codeId = `${tableId}-source-code`;

  return (
    <div
      id={tableId}
      className="not-prose my-8 flex scroll-mt-24 flex-col gap-4"
    >
      <div className="flex justify-end">
        <Button
          aria-controls={codeId}
          aria-pressed={open}
          onClick={() => setOpen((value) => !value)}
          size="sm"
          variant="outline"
        >
          {open ? <CodeXmlIcon /> : <CodeIcon />}
          {open ? 'Hide Code' : 'Code'}
        </Button>
      </div>
      {open && <div id={codeId}>{code}</div>}
    </div>
  );
};
