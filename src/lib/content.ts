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