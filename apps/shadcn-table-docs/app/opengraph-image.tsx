import { generateOGImage } from 'fumadocs-ui/og';
import { appName, siteDescription, siteName } from '@/lib/shared';

export const revalidate = false;

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = siteName;

/** The home page social card, rendered like the docs cards in `app/og/docs`. */
export default function Image() {
  return generateOGImage({
    title: siteName,
    description: siteDescription,
    site: appName,
  });
}
