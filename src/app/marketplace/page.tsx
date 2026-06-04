export const dynamic = 'force-dynamic';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import HeaderSection from '@/components/landing/marketplace/HeaderSection';
import FeaturedSection from '@/components/landing/marketplace/FeaturedSection';
import TransparencySection from '@/components/landing/marketplace/TransparencySection';
import CtaSection from '@/components/landing/marketplace/CtaSection';
import {
  getFooterContent,
  getNavbarContent,
  getMarketplaceHeaderContent,
  getFeaturedContent,
  getTransparencyContent,
  getMarketplaceCtaContent,
} from '@/lib/content';

export default function MarketplacePage() {
  const footer = getFooterContent();
  const navbar = getNavbarContent();
  const header = getMarketplaceHeaderContent();
  const featured = getFeaturedContent();
  const transparency = getTransparencyContent();
  const cta = getMarketplaceCtaContent();

  return (
    <>
      <Navbar content={navbar} />
      <HeaderSection content={header} />
      <FeaturedSection content={featured} />
      <TransparencySection content={transparency} />
      <CtaSection content={cta} />
      <Footer content={footer} />
    </>
  );
}
