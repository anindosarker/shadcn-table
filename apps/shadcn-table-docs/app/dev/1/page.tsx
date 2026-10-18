import type { Metadata } from 'next';
import { cn } from '@/lib/cn';
import { orbitDisplay } from '@/components/dev-home/v1/font';
import { OrbitNav } from '@/components/dev-home/v1/orbit-nav';
import { OrbitHero } from '@/components/dev-home/v1/orbit-hero';
import {
  FeatureIndexSection,
  InstallSection,
  LiveTableSection,
  WhySection,
} from '@/components/dev-home/v1/orbit-sections';
import { SectionRail } from '@/components/dev-home/v1/section-rail';
import { OrbitFooter } from '@/components/dev-home/v1/orbit-footer';
import '@/components/dev-home/v1/v1.css';

export const metadata: Metadata = {
  title: 'Orbit · homepage variant 1',
};

export default function Variant1Page() {
  return (
    <main data-variant="1" className={cn('o1 flex-1', orbitDisplay.variable)}>
      <OrbitNav />
      <OrbitHero />
      <SectionRail />
      <LiveTableSection />
      <FeatureIndexSection />
      <WhySection />
      <InstallSection />
      <OrbitFooter />
    </main>
  );
}
