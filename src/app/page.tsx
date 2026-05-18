import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TransformBanner from '@/components/landing/TransformBanner';
import VisualizationSection from '@/components/landing/VisualizationSection';
import OwnershipSection from '@/components/landing/OwnershipSection';
import DiscoverSection from '@/components/landing/DiscoverSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TransformBanner />
        <VisualizationSection />
        <OwnershipSection />
        <DiscoverSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
