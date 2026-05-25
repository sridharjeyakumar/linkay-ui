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
  href?: string;
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

export type InvestorHeroContent = {
  label: string;
  headline_line1: string;
  headline_line2: string;
  subheading: string;
  button_text: string;
};

export type InvestorFeatureItem = { title: string; description: string };
export type ModernInvestingContent = {
  title: string;
  items: InvestorFeatureItem[];
};

export type InvestorFeature = { title: string; description: string };
export type DesignedForContent = {
  title: string;
  image: string;
  features: InvestorFeature[];
};

export type FeaturedOpportunity = {
  title: string;
  category: string;
  price: string;
  minInvestment: string;
  image: string;
};
export type FeaturedOpportunitiesContent = {
  title: string;
  opportunities: FeaturedOpportunity[];
};

export type InvestorCtaContent = {
  title: string;
  button_text: string;
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
export type MuseumHeroContent = {
  title: string;
  subheading: string;
  button_primary: string;
  button_secondary: string;
  image: string;
};

export const getMuseumHeroContent = () => read<MuseumHeroContent>('landing/museum-artifacts/hero.json');

export type MuseumCategory = { title: string; description: string };
export type MuseumAssetClassesContent = {
  title: string;
  subheading: string;
  categories: MuseumCategory[];
  images: string[];
};
export const getMuseumAssetClassesContent = () => read<MuseumAssetClassesContent>('landing/museum-artifacts/asset-classes.json');

export type MuseumFeatureItem = { icon: string; title: string; description: string };
export type MuseumFeaturesContent = { items: MuseumFeatureItem[] };
export const getMuseumFeaturesContent = () => read<MuseumFeaturesContent>('landing/museum-artifacts/features.json');

export type MuseumVisualizationItem = { title: string; bullets: string[]; image: string };
export type MuseumVisualizationContent = { title: string; subtitle: string; items: MuseumVisualizationItem[] };
export const getMuseumVisualizationContent = () => read<MuseumVisualizationContent>('landing/museum-artifacts/visualization.json');

export type MuseumProperty = { name: string; image: string; button_label: string; current_bid: string; ends_in: string };
export type MuseumFeaturedContent = { title: string; properties: MuseumProperty[] };
export const getMuseumFeaturedContent = () => read<MuseumFeaturedContent>('landing/museum-artifacts/featured.json');

export type MuseumTransparencyItem = { title: string; description: string };
export type MuseumTransparencyContent = { title: string; items: MuseumTransparencyItem[] };
export const getMuseumTransparencyContent = () => read<MuseumTransparencyContent>('landing/museum-artifacts/transparency.json');

export type MuseumFaqItem = { question: string; answer: string };
export type MuseumFaqContent = { title: string; items: MuseumFaqItem[] };
export const getMuseumFaqContent = () => read<MuseumFaqContent>('landing/museum-artifacts/faq.json');

export type MuseumCtaContent = { title: string; button_primary: string; button_secondary: string };
export const getMuseumCtaContent = () => read<MuseumCtaContent>('landing/museum-artifacts/cta.json');

export const getInvestorHeroContent = () => read<InvestorHeroContent>('landing/investors/hero.json');
export const getModernInvestingContent = () => read<ModernInvestingContent>('landing/investors/modern-investing.json');
export const getDesignedForContent = () => read<DesignedForContent>('landing/investors/designed-for.json');
export const getFeaturedOpportunitiesContent = () => read<FeaturedOpportunitiesContent>('landing/investors/featured.json');
export const getInvestorCtaContent = () => read<InvestorCtaContent>('landing/investors/cta.json');
/// ── Real Estate ──────────────────────────────────────────────────────────────

export type REHeroContent = {
  title: string;
  subtitle: string;
  button_explore: string;
  button_tokenize: string;
  hero_image: string;
};

export type REPropertyType = { num: string; title: string; description: string };
export type REInfrastructureContent = {
  title: string;
  subtitle: string;
  building_image: string;
  property_types: REPropertyType[];
};

export type REBenefitItem = { title: string; description: string };
export type REBenefitsContent = { items: REBenefitItem[] };

export type REProperty = { name: string; image: string; button_icon: string; stats: string; button_label: string };
export type REFeaturedContent = { title: string; properties: REProperty[] };

export type REVizItem = { title: string; description: string; image: string; image_left: boolean };
export type REVisualizationContent = {
  title: string;
  subtitle: string;
 
  items: REVizItem[];
  cta_title: string;
  cta_button_primary: string;
  cta_button_secondary: string;
};

export type REFaqItem = { question: string; answer: string };
export type REFaqContent = {
  faq_title: string;
  items: REFaqItem[];
};
export type RECtaContent = {
  cta_title: string;
  cta_button_primary: string;
  cta_button_secondary: string;
};

export const getREHeroContent = () => read<REHeroContent>('real-estate/hero.json');
export const getREInfrastructureContent = () => read<REInfrastructureContent>('real-estate/infrastructure.json');
export const getREBenefitsContent = () => read<REBenefitsContent>('real-estate/benefits.json');
export const getREFeaturedContent = () => read<REFeaturedContent>('real-estate/featured.json');
export const getREVisualizationContent = () => read<REVisualizationContent>('real-estate/visualization.json');
export const getREFaqContent = () => read<REFaqContent>('real-estate/faq.json');
export const getRECtaContent = () => read<RECtaContent>('real-estate/cta.json');
