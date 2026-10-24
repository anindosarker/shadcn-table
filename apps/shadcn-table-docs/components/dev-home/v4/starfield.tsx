import type { CSSProperties } from 'react';

/** Deterministic PRNG so server and client agree on every star. */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(4);
const STARS = Array.from({ length: 72 }, () => ({
  x: rand() * 100,
  y: rand() * 100,
  big: rand() > 0.86,
  base: 0.18 + rand() * 0.4,
  dur: 2.6 + rand() * 4.4,
  delay: -rand() * 7,
}));

/** A sparse field of tiny dots behind the page; each twinkles on opacity. */
export function Starfield() {
  return (
    <div aria-hidden="true" className="v4-stars">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="v4-star"
          data-big={s.big || undefined}
          style={
            {
              left: `${s.x.toFixed(3)}%`,
              top: `${s.y.toFixed(3)}%`,
              '--v4-o': s.base.toFixed(2),
              '--v4-tw': `${s.dur.toFixed(2)}s`,
              '--v4-td': `${s.delay.toFixed(2)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
