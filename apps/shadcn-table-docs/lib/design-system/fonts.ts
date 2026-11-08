// next/font loaders for every font the theme customizer offers (same set and CSS
// variables as shadcn-ui apps/v4/app/(view)/preview/fonts.ts). Inter, the default,
// is app/layout.tsx's loader (`--font-inter`, preloaded); the rest download when
// selected. The docs keep their own monospace font, so no `--font-mono` here.
import {
  DM_Sans,
  EB_Garamond,
  Figtree,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  Lora,
  Manrope,
  Merriweather,
  Montserrat,
  Noto_Sans,
  Noto_Serif,
  Nunito_Sans,
  Outfit,
  Oxanium,
  Playfair_Display,
  Public_Sans,
  Raleway,
  Roboto,
  Roboto_Slab,
  Source_Sans_3,
  Space_Grotesk,
} from 'next/font/google';
import { cn } from '@/lib/cn';

const geistSans = Geist({
  subsets: ['latin'],
  preload: false,
  variable: '--font-geist-sans',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  preload: false,
  variable: '--font-noto-sans',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  preload: false,
  variable: '--font-nunito-sans',
});

const figtree = Figtree({
  subsets: ['latin'],
  preload: false,
  variable: '--font-figtree',
});

const roboto = Roboto({
  subsets: ['latin'],
  preload: false,
  variable: '--font-roboto',
});

const raleway = Raleway({
  subsets: ['latin'],
  preload: false,
  variable: '--font-raleway',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  preload: false,
  variable: '--font-dm-sans',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  preload: false,
  variable: '--font-public-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  preload: false,
  variable: '--font-outfit',
});

const oxanium = Oxanium({
  subsets: ['latin'],
  preload: false,
  variable: '--font-oxanium',
});

const manrope = Manrope({
  subsets: ['latin'],
  preload: false,
  variable: '--font-manrope',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  preload: false,
  variable: '--font-space-grotesk',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  preload: false,
  variable: '--font-montserrat',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  preload: false,
  variable: '--font-ibm-plex-sans',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  preload: false,
  variable: '--font-source-sans-3',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  preload: false,
  variable: '--font-instrument-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  preload: false,
  variable: '--font-jetbrains-mono',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  preload: false,
  variable: '--font-geist-mono',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  preload: false,
  variable: '--font-noto-serif',
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  preload: false,
  variable: '--font-roboto-slab',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  preload: false,
  variable: '--font-merriweather',
});

const lora = Lora({
  subsets: ['latin'],
  preload: false,
  variable: '--font-lora',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  preload: false,
  variable: '--font-playfair-display',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  preload: false,
  variable: '--font-eb-garamond',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  preload: false,
  weight: '400',
  variable: '--font-instrument-serif',
});

export const designSystemFontVariables = cn(
  geistSans.variable,
  notoSans.variable,
  nunitoSans.variable,
  figtree.variable,
  roboto.variable,
  raleway.variable,
  dmSans.variable,
  publicSans.variable,
  outfit.variable,
  oxanium.variable,
  manrope.variable,
  spaceGrotesk.variable,
  montserrat.variable,
  ibmPlexSans.variable,
  sourceSans3.variable,
  instrumentSans.variable,
  geistMono.variable,
  jetbrainsMono.variable,
  notoSerif.variable,
  robotoSlab.variable,
  merriweather.variable,
  lora.variable,
  playfairDisplay.variable,
  ebGaramond.variable,
  instrumentSerif.variable,
);
