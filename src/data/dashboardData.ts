// ---------------------------------------------------------------------------
// Mock data — swap image URLs and arrays with real API responses in
// useDashboardData.ts when the backend tables are ready.
// ---------------------------------------------------------------------------

export type Category =
  | 'All Categories'
  | 'Collectible'
  | 'Real Estate'
  | 'Fine Arts'
  | 'Minerals';

export const CATEGORIES: Category[] = [
  'All Categories',
  'Collectible',
  'Real Estate',
  'Fine Arts',
  'Minerals',
];

export interface Collection {
  id: string;
  title: string;
  category: Exclude<Category, 'All Categories'>;
  totalItems: number;
  /** [mainImage, thumb1, thumb2, thumb3] — mosaic layout */
  previewImages: [string, string, string, string];
}

export interface AuctionItem {
  id: string;
  title: string;
  category: Exclude<Category, 'All Categories'>;
  priceEth: number;
  totalSupply: number;
  currentIndex: number;
  image: string;
  endsAt: Date;
}

// TODO: replace with API-provided URLs
const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    title: 'Reddington Palace',
    category: 'Real Estate',
    totalItems: 54,
    previewImages: [img('house1', 600, 400), img('house2', 300, 130), img('house3', 300, 130), img('house4', 300, 130)],
  },
  {
    id: 'col-2',
    title: 'Mineral Collection',
    category: 'Minerals',
    totalItems: 54,
    previewImages: [img('mineral1', 600, 400), img('mineral2', 300, 130), img('mineral3', 300, 130), img('mineral4', 300, 130)],
  },
  {
    id: 'col-3',
    title: 'Classical Sculptures',
    category: 'Fine Arts',
    totalItems: 32,
    previewImages: [img('sculpture1', 600, 400), img('sculpture2', 300, 130), img('sculpture3', 300, 130), img('sculpture4', 300, 130)],
  },
  {
    id: 'col-4',
    title: 'Vintage Coins',
    category: 'Collectible',
    totalItems: 128,
    previewImages: [img('coins1', 600, 400), img('coins2', 300, 130), img('coins3', 300, 130), img('coins4', 300, 130)],
  },
  {
    id: 'col-5',
    title: 'Modern Villas',
    category: 'Real Estate',
    totalItems: 18,
    previewImages: [img('villa1', 600, 400), img('villa2', 300, 130), img('villa3', 300, 130), img('villa4', 300, 130)],
  },
  {
    id: 'col-6',
    title: 'Rare Gemstones',
    category: 'Minerals',
    totalItems: 76,
    previewImages: [img('gem1', 600, 400), img('gem2', 300, 130), img('gem3', 300, 130), img('gem4', 300, 130)],
  },
  {
    id: 'col-7',
    title: 'Abstract Paintings',
    category: 'Fine Arts',
    totalItems: 45,
    previewImages: [img('paint1', 600, 400), img('paint2', 300, 130), img('paint3', 300, 130), img('paint4', 300, 130)],
  },
  {
    id: 'col-8',
    title: 'Antique Watches',
    category: 'Collectible',
    totalItems: 60,
    previewImages: [img('watch1', 600, 400), img('watch2', 300, 130), img('watch3', 300, 130), img('watch4', 300, 130)],
  },
];

const hoursFromNow = (h: number) => new Date(Date.now() + h * 3_600_000);

export const MOCK_AUCTIONS: AuctionItem[] = [
  {
    id: 'auc-1',
    title: 'Arthurist',
    category: 'Fine Arts',
    priceEth: 0.25,
    totalSupply: 321,
    currentIndex: 1,
    image: img('arthurist', 400, 400),
    endsAt: hoursFromNow(3.83),
  },
  {
    id: 'auc-2',
    title: 'Mbambu',
    category: 'Fine Arts',
    priceEth: 0.25,
    totalSupply: 321,
    currentIndex: 1,
    image: img('mbambu', 400, 400),
    endsAt: hoursFromNow(5.5),
  },
  {
    id: 'auc-3',
    title: 'Peacock',
    category: 'Minerals',
    priceEth: 0.25,
    totalSupply: 321,
    currentIndex: 1,
    image: img('peacock', 400, 400),
    endsAt: hoursFromNow(2.1),
  },
  {
    id: 'auc-4',
    title: 'Golden Gate',
    category: 'Real Estate',
    priceEth: 1.5,
    totalSupply: 100,
    currentIndex: 3,
    image: img('goldengate', 400, 400),
    endsAt: hoursFromNow(7.25),
  },
  {
    id: 'auc-5',
    title: 'Ruby Crystal',
    category: 'Collectible',
    priceEth: 0.75,
    totalSupply: 50,
    currentIndex: 2,
    image: img('ruby', 400, 400),
    endsAt: hoursFromNow(1.5),
  },
  {
    id: 'auc-6',
    title: 'Bronze Warrior',
    category: 'Fine Arts',
    priceEth: 0.4,
    totalSupply: 200,
    currentIndex: 5,
    image: img('warrior', 400, 400),
    endsAt: hoursFromNow(4.0),
  },
];
