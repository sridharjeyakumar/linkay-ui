import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import HeaderSection from '@/components/landing/for-you/AssetOwners/HeaderSection';
import ValuableAssetsSection from '@/components/landing/for-you/AssetOwners/ValuableAssetsSection';
import BenefitsSection from '@/components/landing/for-you/AssetOwners/BenefitsSection';
import {
  getFooterContent,
  getNavbarContent,
  getAssetOwnersHeaderContent,
  getValuableAssetsContent,
  getBenefitsContent,
} from '@/lib/content';

export default function AssetOwnersPage() {
  const footer = getFooterContent();
  const navbar = getNavbarContent();
  const header = getAssetOwnersHeaderContent();
  const valuableAssets = getValuableAssetsContent();
  const benefits = getBenefitsContent();

  return (
    <>
      <Navbar content={navbar} />
      <HeaderSection content={header} />
      <ValuableAssetsSection content={valuableAssets} />
      <BenefitsSection content={benefits} />
      <Footer content={footer} />
    </>
  );
}

