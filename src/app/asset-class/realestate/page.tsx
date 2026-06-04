export const dynamic = 'force-dynamic';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import RealEstate from '@/components/landing/asset-class/realestate/RealEstate';
import {
  getNavbarContent,
  getFooterContent,
  getREHeroContent,
  getREInfrastructureContent,
  getREBenefitsContent,
  getREFeaturedContent,
  getREVisualizationContent,
  getREFaqContent,
  getRECtaContent,
} from '@/lib/content';


export default function RealEstatePage() {
  const navbar = getNavbarContent();
  const footer = getFooterContent();
  const hero = getREHeroContent();
  const infrastructure = getREInfrastructureContent();
  const benefits = getREBenefitsContent();
  const featured = getREFeaturedContent();
  const visualization = getREVisualizationContent();
  const faq = getREFaqContent();
  const cta = getRECtaContent();

  return (
    <>
      <Navbar content={navbar} />
      <main>
        <RealEstate
          hero={hero}
          infrastructure={infrastructure}
          benefits={benefits}
          featured={featured}
          visualization={visualization}
          faq={faq}
          cta={cta}
        />
      </main>
      <Footer content={footer} />
    </>
  );
}
