import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import HeaderSection from '@/components/landing/Tokenization/HeaderSection';
import ModernAsset from '@/components/landing/Tokenization/ModernAsset';
import OwnershipSection from '@/components/landing/Tokenization/OwnershipSection';

export default function TokenizationPage() {
  return (
    <>
      <Navbar />
      <HeaderSection />
      <ModernAsset />
      <OwnershipSection/>
      <Footer />
    </>
  );
}
