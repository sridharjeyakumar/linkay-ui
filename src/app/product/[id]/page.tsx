'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { assetApi } from '@/api/assetApi';
import type { Asset } from '@/types/asset.types';
import ProductPage, { ProductPageItem } from '@/components/product/ProductPage';
import UserDashboardLayout from '@/app/user-dashboard/layout';

const ASSET_TYPE_LABEL: Record<string, string> = {
  REAL_ESTATE:  'Real Estate',
  FINE_ART:     'Fine Arts',
  COLLECTIBLE:  'Collectible',
  LUXURY_ASSET: 'Luxury Asset',
  LUXURY_WATCH: 'Luxury Watch',
  OTHER:        'Other',
};

function parseImages(raw: unknown): string[] {
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

function formatActivityDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

function toProductItem(asset: Asset): ProductPageItem {
  const images = parseImages(asset.mediaFiles);
  const hero = images[0] || '';
  const img4: [string, string, string, string] = [
    hero,
    images[1] || hero,
    images[2] || hero,
    images[3] || hero,
  ];

  const fractionsSold  = asset.fractionsSold ?? 0;
  const totalFractions = asset.totalFractions ?? 0;
  const creator        = asset.createdByName ?? asset.museumName ?? 'Platform';

  const activities: import('@/components/product/ProductPage').ActivityItem[] = [];

  // Reserve — from auction reserve_price + auction created_at
  if (asset.latestAuction) {
    const a = asset.latestAuction;
    const reserveDate = a.createdAt
      ? formatActivityDate(a.createdAt)
      : formatActivityDate(`${a.startDate}T${a.startTime ?? '00:00:00'}Z`);
    activities.push({
      type:   'reserve',
      user:   creator,
      date:   reserveDate,
      amount: a.reservePrice != null ? Number(a.reservePrice) : undefined,
    });
  }

  // Mint — from asset published_at + transaction_hash
  activities.push({
    type:            'mint',
    user:            creator,
    date:            formatActivityDate(asset.publishedAt ?? asset.createdAt),
    transactionHash: asset.transactionHash ?? undefined,
  });

  return {
    id:                 asset.id,
    title:              asset.title,
    category:           ASSET_TYPE_LABEL[asset.assetType] ?? asset.assetType,
    custodyService:     asset.custodian ?? 'Linkay Custody Services',
    images:             img4,
    totalValuation:     Number(asset.valuation ?? 0),
    pricePerFraction:   Number(asset.pricePerFraction ?? 0),
    compliance:         asset.compliance ?? 'ERC-3643',
    lockupMonths:       parseInt(asset.lockupPeriod ?? '0') || 0,
    totalFractions,
    fractionsRemaining: totalFractions - fractionsSold,
    description:        asset.description,
    ipfsUrl:            asset.ipfsUrl ?? undefined,
    ipfsMetadataUrl:    asset.ipfsMetadataUrl ?? undefined,
    auctionId:            asset.latestAuction?.id            ?? undefined,
    onChainAuctionId:     asset.latestAuction?.onChainAuctionId ?? undefined,
    auctionEndTime: (() => {
      const a = asset.latestAuction;
      if (!a?.endDate || !a?.endTime) return undefined;
      if (a.endDateTimeUTC) return a.endDateTimeUTC;
      const t = a.endTime.split(':').length === 2 ? `${a.endTime}:00` : a.endTime;
      return new Date(`${a.endDate}T${t}Z`).toISOString();
    })(),
    auctionTimezone:      asset.latestAuction?.timezone       ?? undefined,
    startingBidPrice:     asset.latestAuction?.startingBidPrice != null ? Number(asset.latestAuction.startingBidPrice) : undefined,
    minIncrement:         asset.latestAuction?.minIncrement      != null ? Number(asset.latestAuction.minIncrement)      : undefined,
    certificationRef:     asset.certificationRef            ?? undefined,
    conditionReport:      asset.conditionReport             ?? undefined,
    historicalContext:    asset.historicalContext           ?? undefined,
    jurisdiction:         asset.jurisdiction                ?? undefined,
    ownershipEntity:      asset.ownershipEntity             ?? undefined,
    royaltyPercent:       asset.royaltyPercent              ?? undefined,
    royaltyWallet:        asset.royaltyWallet               ?? undefined,
    retainedPercent:      asset.retainedPercent             ?? undefined,
    tokenizedPercent:     asset.tokenizedPercent            ?? undefined,
    nftContractAddress:   asset.nftContractAddress          ?? undefined,
    erc3643ContractAddress: asset.erc3643ContractAddress    ?? undefined,
    nftTokenId:           asset.nftTokenId                  ?? undefined,
    transactionHash:      asset.transactionHash             ?? undefined,
    publishedAt:          asset.publishedAt                 ?? undefined,
    activities,
  };
}

export default function ProductRoute() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ProductPageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    assetApi
      .listAll()
      .then(({ data }) => {
        const assets: Asset[] = Array.isArray(data?.data) ? data.data : [];
        const asset = assets.find((a) => a.id === id);
        if (!asset?.id) { setError(true); return; }
        setItem(toProductItem(asset));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <UserDashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: '#111' }} />
        </Box>
      </UserDashboardLayout>
    );
  }

  if (error || !item) {
    return (
      <UserDashboardLayout>
        <Box sx={{ p: 5 }}>
          <Typography>Product not found.</Typography>
        </Box>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <ProductPage item={item} />
    </UserDashboardLayout>
  );
}
