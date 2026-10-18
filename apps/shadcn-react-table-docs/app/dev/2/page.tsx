import { Nav } from '@/components/dev-home/v2/nav';
import {
  Comparison,
  Features,
  Footer,
  Hero,
  HowItWorks,
  InstallCta,
} from '@/components/dev-home/v2/sections';
import '@/components/dev-home/v2/v2.css';

/** Variant 2, Workbench: halftone hero panel with the live table overlapping it. */
export default function Variant2Page() {
  return (
    <main id="top" data-variant="2" className="v2 flex w-full flex-col">
      <Nav />
      <div className="flex flex-col gap-24 pt-4 sm:gap-32">
        <Hero />
        <Features />
        <HowItWorks />
        <Comparison />
        <InstallCta />
      </div>
      <Footer />
    </main>
  );
}
