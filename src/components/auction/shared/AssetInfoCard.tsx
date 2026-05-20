'use client';

import { Box, Typography } from '@mui/material';
import type { Asset } from '@/types/asset.types';
import { ASSET_TYPE_LABELS, fmtCurrency, parseImages } from './styles';

interface Props {
  asset: Asset;
  activeImageIndex?: number;
  onDotClick?: (i: number) => void;
  showPricing?: boolean;
}

export function AssetInfoCard({ asset, activeImageIndex = 0, onDotClick, showPricing = true }: Props) {
  const images = parseImages(asset.mediaFiles);
  const src = images[activeImageIndex] ?? '';
  const typeLabel = ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType;
  const custodian = asset.custodian ?? 'Linkay Custodial Services';

  const pricingParts = showPricing
    ? [
        fmtCurrency(asset.valuation),
        asset.totalFractions ? `${asset.totalFractions} fractions` : null,
        asset.pricePerFraction != null ? `${fmtCurrency(asset.pricePerFraction)} per fraction` : null,
      ].filter(Boolean)
    : [];

  const dotCount = Math.max(images.length, 1);

  return (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      {/* Image */}
      <Box
        sx={{
          width: '100%',
          height: 220,
          bgcolor: '#f3f4f6',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={asset.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography sx={{ color: '#9ca3af', fontSize: 13 }}>No image available</Typography>
          </Box>
        )}
      </Box>

      {/* Carousel dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, py: 1 }}>
        {Array.from({ length: dotCount }, (_, i) => (
          <Box
            key={i}
            onClick={() => onDotClick?.(i)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: i === activeImageIndex ? '#3b6ef8' : '#d1d5db',
              cursor: dotCount > 1 ? 'pointer' : 'default',
              transition: 'background-color 0.2s',
            }}
          />
        ))}
      </Box>

      {/* Text info */}
      <Box sx={{ px: 2, pb: 2, textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#111', mb: 0.25 }}>
          {asset.title}
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#6b7280', mb: pricingParts.length ? 0.5 : 0 }}>
          {typeLabel} | {custodian}
        </Typography>
        {pricingParts.length > 0 && (
          <Typography sx={{ fontSize: 12, color: '#6b7280' }}>
            {pricingParts.join(' | ')}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
