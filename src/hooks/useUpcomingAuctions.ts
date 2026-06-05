import { useState, useEffect } from 'react';
import { UpcomingAuction } from '@/data/dashboardData';
import { assetApi } from '@/api/assetApi';
import type { Asset } from '@/types/asset.types';

function parseMediaFiles(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return (raw as string[]).filter(Boolean);
  if (typeof raw === 'string') {
    try { return JSON.parse(raw).filter(Boolean); } catch { return []; }
  }
  return [];
}

function padTime(t: string) {
  return t.split(':').length === 2 ? `${t}:00` : t;
}

export function useUpcomingAuctions() {
  const [auctions, setAuctions] = useState<UpcomingAuction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assetApi
      .listAll()
      .then(({ data }) => {
        const assets: Asset[] = Array.isArray(data.data) ? data.data : [];
        const now = Date.now();
        const items = assets
          .filter((a) => {
            const auction = a.latestAuction;
            if (auction?.status !== 'SCHEDULED') return false;
            if (!auction.startDate || !auction.startTime) return false;
            return (
              new Date(`${auction.startDate}T${padTime(auction.startTime)}Z`).getTime() > now
            );
          })
          .map((a): UpcomingAuction => {
            const auction = a.latestAuction!;
            const images = parseMediaFiles(a.mediaFiles);
            return {
              id: a.id,
              title: a.title,
              priceEth: Number(a.pricePerFraction ?? 0),
              startsAt: new Date(`${auction.startDate}T${padTime(auction.startTime)}Z`),
              image: images[0] ?? '',
            };
          });
        setAuctions(items);
      })
      .catch(() => setAuctions([]))
      .finally(() => setLoading(false));
  }, []);

  return { auctions, loading };
}
