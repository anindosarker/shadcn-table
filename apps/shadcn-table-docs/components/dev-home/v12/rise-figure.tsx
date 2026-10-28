'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * v7's hairline figure (caption and note optional) that rises out of the hero field the first time it scrolls
 * into view. Opacity and transform only; reduced motion shows it in place.
 */
export function RiseFigure({
  caption,
  note,
  children,
}: {
  caption?: string;
  note?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [risen, setRisen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRisen(true);
        io.disconnect();
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className="v7-figure" data-risen={risen || undefined}>
      {caption ? (
        <figcaption className="v7-figcap">
          <strong>{caption}</strong>
          {note ? <span>{note}</span> : null}
        </figcaption>
      ) : null}
      {children}
    </figure>
  );
}
