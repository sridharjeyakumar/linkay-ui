// ---------------------------------------------------------------------------
// Portfolio data — static mock data for the investor portfolio page.
// Images are sourced from public/Marketplace/Asset_images.
// ---------------------------------------------------------------------------

export type PortfolioCategory = 'All' | 'Collectibles' | 'Real Estate';

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  'All',
  'Collectibles',
  'Real Estate',
];

export interface PortfolioAsset {
  id: string;
  name: string;
  category: Exclude<PortfolioCategory, 'All'>;
  priceEth: number;
  image: string;
}

export const PORTFOLIO_ASSETS: PortfolioAsset[] = [
  {
    id: 'pa-1',
    name: 'Bronze Helm',
    category: 'Collectibles',
    priceEth: 0.85,
    image: '/Marketplace/Asset_images/Bronze Helm (2).svg',
  },
  {
    id: 'pa-2',
    name: 'Axis Hall',
    category: 'Real Estate',
    priceEth: 7.25,
    image: '/Marketplace/Asset_images/Axis Hall (2).svg',
  },
  {
    id: 'pa-3',
    name: 'Noir Crystal',
    category: 'Collectibles',
    priceEth: 0.31,
    image: '/Marketplace/Asset_images/Noir Crystal (2).svg',
  },
  {
    id: 'pa-4',
    name: 'Riviera Bay',
    category: 'Real Estate',
    priceEth: 0.31,
    image: '/Marketplace/Asset_images/Riviera Bay (2).svg',
  },
  {
    id: 'pa-5',
    name: 'lokmansevim',
    category: 'Collectibles',
    priceEth: 0.15,
    image: '/Marketplace/Asset_images/lokmansevim (2).svg',
  },
  {
    id: 'pa-6',
    name: 'Gold Cluster',
    category: 'Collectibles',
    priceEth: 0.86,
    image: '/Marketplace/Asset_images/Gold Cluster (2).svg',
  },
  {
    id: 'pa-7',
    name: 'Verona Estate',
    category: 'Real Estate',
    priceEth: 0.19,
    image: '/Marketplace/Asset_images/Verona Estate (2).svg',
  },
  {
    id: 'pa-8',
    name: 'Legacy Totem',
    category: 'Collectibles',
    priceEth: 0.15,
    image: '/Marketplace/Asset_images/Legacy Totem (2).svg',
  },
];

// ---------- Summary stats ----------
export interface PortfolioStats {
  usdValue: number;
  collectiblesCount: number;
  collectiblesPercent: number;
  realEstateCount: number;
  realEstatePercent: number;
}

export const PORTFOLIO_STATS: PortfolioStats = {
  usdValue: 3763.62,
  collectiblesCount: 780,
  collectiblesPercent: 78,
  realEstateCount: 220,
  realEstatePercent: 22,
};
