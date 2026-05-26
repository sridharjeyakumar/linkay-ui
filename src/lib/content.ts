import fs from 'fs';
import path from 'path';

function read<T>(file: string): T {
  const fullPath = path.join(process.cwd(), 'content', file);
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T;
}

export type CarouselImage = { src: string; alt: string };
export type HeroContent = {
  label: string;
  headline_line1: string;
  headline_line2: string;
  subheading: string;
  button_text: string;
  carousel: CarouselImage[];
};

export type FeatureItem = { title: string; description: string };
export type FeaturesContent = {
  title: string;
  subtitle: string;
  items: FeatureItem[];
};

export type TransformBannerContent = {
  title: string;
  paragraph1: string;
  paragraph2: string;
};

export type VisualizationAsset = { src: string; alt: string };
export type VisualizationContent = {
  title: string;
  description: string;
  assets: VisualizationAsset[];
};

export type OwnershipStep = {
  title: string;
  description: string;
  shape: string;
  imagePosition: 'left' | 'right';
};
export type OwnershipContent = {
  title: string;
  subtitle: string;
  steps: OwnershipStep[];
};

export type AssetClass = { title: string; description: string };
export type DiscoverContent = {
  title: string;
  assetClasses: AssetClass[];
};

export type CtaContent = {
  title: string;
  button_primary: string;
  button_secondary: string;
};

export type FooterLink = { label: string; href: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type FooterSocial = { platform: string; href: string };
export type FooterContent = {
  logo_description: string;
  columns: FooterColumn[];
  socials: FooterSocial[];
  copyright: string;
};

export type MineralModalContent = {
  title: string;
  description: string;
  button_text: string;
};

export type NavDropdownItem = {
  label: string;
  icon: string;
  description?: string;
  comingSoon?: boolean;
};
export type NavLinkItem = {
  label: string;
  href?: string;
  dropdown?: NavDropdownItem[];
};
export type NavbarContent = { links: NavLinkItem[] };

export type TokenizationFeature = { title: string; description: string };
export type TokenizationHeaderContent = {
  heading: string;
  subtitle: string;
  button_text: string;
  why_tag: string;
  why_title: string;
  features: TokenizationFeature[];
};

export type ModernAssetCard = { title: string; description: string; image: string };
export type ModernAssetContent = { title: string; cards: ModernAssetCard[] };

export type FaqItem = { question: string; answer: string };
export type FaqContent = {
  items: FaqItem[];
  cta_title: string;
  cta_button_primary: string;
  cta_button_secondary: string;
};

export const getHeroContent = () => read<HeroContent>('landing/hero.json');
export const getFeaturesContent = () => read<FeaturesContent>('landing/features.json');
export const getTransformBannerContent = () => read<TransformBannerContent>('landing/transform-banner.json');
export const getVisualizationContent = () => read<VisualizationContent>('landing/visualization.json');
export const getOwnershipContent = () => read<OwnershipContent>('landing/ownership.json');
export const getDiscoverContent = () => read<DiscoverContent>('landing/discover.json');
export const getCtaContent = () => read<CtaContent>('landing/cta.json');
export const getFooterContent = () => read<FooterContent>('landing/footer.json');
export const getMineralModalContent = () => read<MineralModalContent>('landing/mineral-modal.json');
export const getNavbarContent = () => read<NavbarContent>('landing/navbar.json');
export const getTokenizationHeaderContent = () => read<TokenizationHeaderContent>('tokenization/header.json');
export const getModernAssetContent = () => read<ModernAssetContent>('tokenization/modern-asset.json');
export const getFaqContent = () => read<FaqContent>('tokenization/faq.json');

export type AssetOwnersHeaderContent = {
  heading: string;
  subtitle: string;
  button_text: string;
};
export const getAssetOwnersHeaderContent = () => read<AssetOwnersHeaderContent>('asset-owners/header.json');

export type ValuableAssetsBox = {
  title: string;
  description: string;
};
export type ValuableAssetsContent = {
  title: string;
  boxes: ValuableAssetsBox[];
};
export const getValuableAssetsContent = () => read<ValuableAssetsContent>('asset-owners/valuable-assets.json');

export type BenefitsItem = {
  title: string;
  image: string;
  points: string[];
};
export type BenefitsContent = {
  title: string;
  cta_title: string;
  cta_button_primary: string;
  benefits: BenefitsItem[];
};
export const getBenefitsContent = () => read<BenefitsContent>('asset-owners/benefits.json');

export type MarketplaceHeaderContent = {
  heading: string;
  subtitle: string;
  button_text: string;
};
export const getMarketplaceHeaderContent = () => read<MarketplaceHeaderContent>('marketplace/header.json');

export type FeaturedItem = {
  title: string;
  image: string;
  category: string;
  current_bid: string;
  ends_in: string;
};
export type FeaturedContent = {
  title: string;
  subtitle: string;
  button_text: string;
  items: FeaturedItem[];
};
export const getFeaturedContent = () => read<FeaturedContent>('marketplace/featured.json');

export type TransparencyBox = {
  title: string;
  description: string;
};
export type TransparencyContent = {
  title: string;
  subtitle: string;
  boxes: TransparencyBox[];
};
export const getTransparencyContent = () => read<TransparencyContent>('marketplace/transparency.json');

export type MarketplaceCtaContent = {
  title: string;
  button_text: string;
};
export const getMarketplaceCtaContent = () => read<MarketplaceCtaContent>('marketplace/cta.json');
