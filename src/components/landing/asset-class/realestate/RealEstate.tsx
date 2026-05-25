import REHero from './REHero';
import REInfrastructure from './REInfrastructure';
import REBenefits from './REBenefits';
import REFeatured from './REFeatured';
import REVisualization from './REVisualization';
import REFaq from './REFaq';
import RECta from './RECta';
import type {
  REHeroContent,
  REInfrastructureContent,
  REBenefitsContent,
  REFeaturedContent,
  REVisualizationContent,
  REFaqContent,
  RECtaContent,
} from '@/lib/content';

type Props = {
  hero: REHeroContent;
  infrastructure: REInfrastructureContent;
  benefits: REBenefitsContent;
  featured: REFeaturedContent;
  visualization: REVisualizationContent;
  faq: REFaqContent;
  cta: RECtaContent;
};

export default function RealEstate({ hero, infrastructure, benefits, featured, visualization, faq, cta }: Props) {
  return (
    <>
      <REHero content={hero} />
      <REInfrastructure content={infrastructure} />
      <REBenefits content={benefits} />
      <REFeatured content={featured} />
      <REVisualization content={visualization} />
      <REFaq content={faq} />
      <RECta content={cta} />
    </>
  );
}
