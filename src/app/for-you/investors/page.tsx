export const dynamic = 'force-dynamic';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import InvestorHero from '@/components/landing/for-you/investors/InvestorHero';
import ModernInvesting from '@/components/landing/for-you/investors/ModernInvesting';
import DesignedForInvestors from '@/components/landing/for-you/investors/DesignedForInvestors';
import FeaturedOpportunities from '@/components/landing/for-you/investors/FeaturedOpportunities';
import InvestorCta from '@/components/landing/for-you/investors/InvestorCta';
import {
  getNavbarContent,
  getFooterContent,
  getInvestorHeroContent,
  getModernInvestingContent,
  getDesignedForContent,
  getFeaturedOpportunitiesContent,
  getInvestorCtaContent,
} from '@/lib/content';

export default function InvestorsPage() {
  const navbar = getNavbarContent();
  const footer = getFooterContent();
  const hero = getInvestorHeroContent();
  const modernInvesting = getModernInvestingContent();
  const designedFor = getDesignedForContent();
  const featured = getFeaturedOpportunitiesContent();
  const cta = getInvestorCtaContent();

  return (
    <>
      <Navbar content={navbar} />
      <main>
        <InvestorHero content={hero} />
        <ModernInvesting content={modernInvesting} />
        <DesignedForInvestors content={designedFor} />
        <FeaturedOpportunities content={featured} />
        <InvestorCta content={cta} />
      </main>
      <Footer content={footer} />
    </>
  );
}
