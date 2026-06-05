export const dynamic = 'force-dynamic';

import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import HeaderSection from '@/components/landing/Tokenization/HeaderSection';
import ModernAsset from '@/components/landing/Tokenization/ModernAsset';
import OwnershipSection from '@/components/landing/Tokenization/OwnershipSection';
import {
  getFooterContent,
  getNavbarContent,
  getTokenizationHeaderContent,
  getModernAssetContent,
  getFaqContent,
} from '@/lib/content';

export default function TokenizationPage() {
  const footer = getFooterContent();
  const navbar = getNavbarContent();
  const header = getTokenizationHeaderContent();
  const modernAsset = getModernAssetContent();
  const faq = getFaqContent();

  return (
    <>
      <Navbar content={navbar} />
      <HeaderSection content={header} />
      <ModernAsset content={modernAsset} />
      <OwnershipSection content={faq} />
      <Footer content={footer} />
    </>
  );
}
