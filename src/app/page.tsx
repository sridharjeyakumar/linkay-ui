import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TransformBanner from '@/components/landing/TransformBanner';
import VisualizationSection from '@/components/landing/VisualizationSection';
import OwnershipSection from '@/components/landing/OwnershipSection';
import DiscoverSection from '@/components/landing/DiscoverSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';
import {
  getHeroContent,
  getFeaturesContent,
  getTransformBannerContent,
  getVisualizationContent,
  getOwnershipContent,
  getDiscoverContent,
  getCtaContent,
  getFooterContent,
  getNavbarContent,
  getMineralModalContent,
} from '@/lib/content';

export default function LandingPage() {
  const hero = getHeroContent();
  const features = getFeaturesContent();
  const transformBanner = getTransformBannerContent();
  const visualization = getVisualizationContent();
  const ownership = getOwnershipContent();
  const discover = getDiscoverContent();
  const cta = getCtaContent();
  const footer = getFooterContent();
  const navbar = getNavbarContent();
  const mineralModal = getMineralModalContent();

  return (
    <>
      <Navbar content={navbar} mineralModal={mineralModal} />
      <main>
        <HeroSection content={hero} />
        <FeaturesSection content={features} />
        <TransformBanner content={transformBanner} />
        <VisualizationSection content={visualization} />
        <OwnershipSection content={ownership} />
        <DiscoverSection content={discover} />
        <CtaSection content={cta} />
      </main>
      <Footer content={footer} />
    </>
  );
}
