'use client';

import { useEffect, useRef, useState } from 'react';

export interface RailSection {
  id: string;
  label: string;
}

/**
 * Fixed ruler on the right edge (xl and up): tick marks, a marker that
 * tracks scroll progress, the current band's name set sideways, and a
 * three-digit percentage readout. Marker and readout are written straight
 * to the DOM so scrolling never re-renders React.
 */
export function RulerRail({ sections }: { sections: RailSection[] }) {
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    // a band is current while it crosses the line 40% down the viewport
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = els.indexOf(entry.target as HTMLElement);
          if (i !== -1) setActive(i);
        }
      },
      { rootMargin: '-40% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const travel = (railRef.current?.clientHeight ?? 0) - 64;
      if (markerRef.current) {
        markerRef.current.style.transform = `translateY(${16 + p * travel}px)`;
      }
      if (readoutRef.current) {
        readoutRef.current.textContent = String(Math.round(p * 100)).padStart(
          3,
          '0',
        );
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <aside ref={railRef} className="v3-rail" aria-hidden="true">
      <div className="v3-rail-ticks" />
      <div ref={markerRef} className="v3-rail-marker" />
      {sections.map((s, i) => (
        <span
          key={s.id}
          className="v3-rail-name"
          data-state={i === active ? 'on' : i < active ? 'past' : 'next'}
        >
          <b>{String(i + 1).padStart(2, '0')}</b> {s.label}
        </span>
      ))}
      <p className="v3-rail-readout">
        <span ref={readoutRef}>000</span>%
      </p>
    </aside>
  );
}
