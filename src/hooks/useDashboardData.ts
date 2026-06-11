import { useState, useEffect, useMemo } from 'react';
import { Category, MOCK_COLLECTIONS, AuctionItem } from '@/data/dashboardData';
import { assetApi } from '@/api/assetApi';
import type { Asset } from '@/types/asset.types';

const ASSET_TYPE_TO_CATEGORY: Record<string, Exclude<Category, 'All Categories'>> = {
  REAL_ESTATE:  'Real Estate',
  FINE_ART:     'Fine Arts',
  COLLECTIBLE:  'Collectible',
  LUXURY_ASSET: 'Collectible',
  LUXURY_WATCH: 'Collectible',
  OTHER:        'Collectible',
};

function parseMediaFiles(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return (raw as string[]).filter(Boolean);
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch { return []; }
  }
  return [];
}

function toAuctionItem(asset: Asset): AuctionItem | null {
  const auction = asset.latestAuction;
  if (!auction?.endDate || !auction?.endTime) return null;
  const images = parseMediaFiles(asset.mediaFiles);
  const endsAt = auction.endDateTimeUTC
    ? new Date(auction.endDateTimeUTC)
    : new Date(`${auction.endDate}T${auction.endTime.split(':').length === 2 ? `${auction.endTime}:00` : auction.endTime}Z`);
  return {
    id: asset.id,
    title: asset.title,
    category: ASSET_TYPE_TO_CATEGORY[asset.assetType] ?? 'Collectible',
    priceEth: Number(asset.pricePerFraction ?? 0),
    totalSupply: asset.totalFractions ?? 0,
    currentIndex: asset.fractionsSold ?? 0,
    image: images[0] ?? '',
    images,
    endsAt,
    timezone: auction.timezone ?? undefined,
  };
}

export function useDashboardData(activeCategory: Category) {
  const [liveAssets, setLiveAssets] = useState<AuctionItem[]>([]);
  const [auctionsLoading, setAuctionsLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(['All Categories']);

  useEffect(() => {
    setAuctionsLoading(true);
    assetApi
      .listAll()
      .then(({ data }) => {
        const assets: Asset[] = Array.isArray(data.data) ? data.data : [];
        const now = Date.now();
        const items = assets
          .filter((a) => {
            const status = a.latestAuction?.status;
            if (status !== 'LIVE' && status !== 'SCHEDULED') return false;
            const { endDate, endTime } = a.latestAuction!;
            if (!endDate || !endTime) return false;
            const endMs = a.latestAuction!.endDateTimeUTC
              ? new Date(a.latestAuction!.endDateTimeUTC).getTime()
              : new Date(`${endDate}T${endTime.split(':').length === 2 ? `${endTime}:00` : endTime}Z`).getTime();
            return endMs > now;
          })
          .map(toAuctionItem)
          .filter((a): a is AuctionItem => a !== null);
        setLiveAssets(items);

        const unique = [
          ...new Set(items.map((a) => a.category)),
        ] as Exclude<Category, 'All Categories'>[];
        setAvailableCategories(['All Categories', ...unique]);
      })
      .catch(() => setLiveAssets([]))
      .finally(() => setAuctionsLoading(false));
  }, []);

  const collections = useMemo(
    () =>
      activeCategory === 'All Categories'
        ? MOCK_COLLECTIONS
        : MOCK_COLLECTIONS.filter((c) => c.category === activeCategory),
    [activeCategory],
  );

  const auctions = useMemo(
    () =>
      activeCategory === 'All Categories'
        ? liveAssets
        : liveAssets.filter((a) => a.category === activeCategory),
    [liveAssets, activeCategory],
  );

  return { collections, auctions, auctionsLoading, availableCategories };
}

