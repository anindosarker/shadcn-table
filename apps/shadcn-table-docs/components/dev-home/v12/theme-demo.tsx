'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// as tall as the demo it stands in for, so the swap shifts nothing
const placeholder = (
  <div
    role="status"
    className="flex h-[121rem] items-center justify-center text-sm text-(--dh-ink-muted) sm:h-[115rem] lg:h-[93.5rem] min-[90rem]:h-[54.5rem]"
  >
    Loading demo
  </div>
);

const WholeApp = dynamic(
  () =>
    import('@/components/theme-demo/variants/whole-app').then(
      (m) => m.WholeApp,
    ),
  { ssr: false, loading: () => placeholder },
);

/**
 * The theming demo (/dev/theme/9) for the homepage. Its code, the mock app
 * and the demo fonts load only once the section nears the viewport;
 * autoplay waits until it is on screen (useThemeCycle).
 */
export function ThemeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{near ? <WholeApp /> : placeholder}</div>;
}
