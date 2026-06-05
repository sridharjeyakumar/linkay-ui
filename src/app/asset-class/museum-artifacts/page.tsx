export const dynamic = 'force-dynamic';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import MuseumHero from '@/components/landing/asset-class/museum-artifacts/MuseumHero';
import MuseumAssetClasses from '@/components/landing/asset-class/museum-artifacts/MuseumAssetClasses';
import MuseumFeatures from '@/components/landing/asset-class/museum-artifacts/MuseumFeatures';
import MuseumVisualization from '@/components/landing/asset-class/museum-artifacts/MuseumVisualization';
import MuseumFeatured from '@/components/landing/asset-class/museum-artifacts/MuseumFeatured';
import MuseumTransparency from '@/components/landing/asset-class/museum-artifacts/MuseumTransparency';
import MuseumFaq from '@/components/landing/asset-class/museum-artifacts/MuseumFaq';
import MuseumCta from '@/components/landing/asset-class/museum-artifacts/MuseumCta';
import {
  getNavbarContent,
  getFooterContent,
  getMuseumHeroContent,
  getMuseumAssetClassesContent,
  getMuseumFeaturesContent,
  getMuseumVisualizationContent,
  getMuseumFeaturedContent,
  getMuseumTransparencyContent,
  getMuseumFaqContent,
  getMuseumCtaContent,
} from '@/lib/content';

export default function MuseumArtifactsPage() {
  const navbar = getNavbarContent();
  const footer = getFooterContent();
  const hero = getMuseumHeroContent();
  const assetClasses = getMuseumAssetClassesContent();
  const features = getMuseumFeaturesContent();
  const visualization = getMuseumVisualizationContent();
  const featured = getMuseumFeaturedContent();
  const transparency = getMuseumTransparencyContent();
  const faq = getMuseumFaqContent();
  const cta = getMuseumCtaContent();

  return (
    <>
      <Navbar content={navbar} />
      <main>
        <MuseumHero content={hero} />
        <MuseumAssetClasses content={assetClasses} />
        <MuseumFeatures content={features} />
        <MuseumVisualization content={visualization} />
        <MuseumFeatured content={featured} />
        <MuseumTransparency content={transparency} />
        <MuseumFaq content={faq} />
        <MuseumCta content={cta} />
      </main>
      <Footer content={footer} />
    </>
  );
}
