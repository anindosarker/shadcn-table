'use client';

import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'top', label: 'Orbit' },
  { id: 'table', label: 'Live table' },
  { id: 'features', label: 'Features' },
  { id: 'why', label: 'Why ST' },
  { id: 'install', label: 'Install' },
] as const;

/** Fixed section index on wide screens. Hidden while the orbit is on screen. */
export function SectionRail() {
  const [current, setCurrent] = useState<string>('top');

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(e.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const shown = current !== 'top';

  return (
    <nav
      aria-label="Sections"
      className="o1-rail"
      data-shown={shown ? 'true' : undefined}
      inert={!shown}
    >
      <ol>
        {SECTIONS.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={current === s.id ? 'true' : undefined}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
