'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

/** How long the button reads "Copied" after a click. */
const COPIED_MS = 1500;

/** Copies `text` to the clipboard; the label flips to "Copied" briefly. */
export const CopyButton = ({
  text,
  label,
}: {
  text: string;
  label: string;
}) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard blocked (permissions, insecure context): nothing to show.
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? 'Copied' : label}
    </Button>
  );
};
