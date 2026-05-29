'use client';

import { useEffect } from 'react';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import { useScrollLock } from '@/hooks/useScrollLock';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ASSET_TYPE_LABELS, fmtCurrency, parseImages } from './shared/styles';
import type { Asset } from '@/types/asset.types';
import type { SupplyPricingValues } from './steps/SupplyPricingStep';

interface Props {
  open: boolean;
  asset: Asset;
  activeImageIndex: number;
  onDotClick: (i: number) => void;
  pricing: SupplyPricingValues;
  onEdit: () => void;
  onProceed: () => void;
  onClose: () => void;
}

export function AuctionPreviewModal({
  open, asset, activeImageIndex, onDotClick, pricing, onEdit, onProceed, onClose,
}: Props) {
  useScrollLock(open);
  const images    = parseImages(asset.mediaFiles);
  const dotCount  = Math.max(images.length, 1);
  const src       = images[activeImageIndex] ?? '';
  const typeLabel = ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType;
  const custodian = asset.custodian ?? 'Linkay Custodial Services';

  const metrics = [
    asset.valuation            ? `${fmtCurrency(asset.valuation)} Valuation`                : null,
    pricing.fractionsAllocated ? `${pricing.fractionsAllocated} Fraction Supply`            : null,
    asset.pricePerFraction     ? `${fmtCurrency(asset.pricePerFraction)} per Fraction`      : null,
  ].filter(Boolean) as string[];

  const auctionDetailItems = [
    pricing.reservePrice     ? `Reserve Price: $${pricing.reservePrice}`      : null,
    pricing.startingBidPrice ? `Starting Bid: $${pricing.startingBidPrice}`   : null,
    pricing.minIncrement     ? `Minimum Increment: $${pricing.minIncrement}`  : null,
  ].filter(Boolean) as string[];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
            bgcolor: '#FFFFFF',
            width: { xs: '100%', sm: 720 },
            maxWidth: { xs: '100%', sm: 720 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            m: { xs: 0, sm: 2, md: 'auto' },
            alignSelf: { xs: 'flex-end', sm: 'center' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
          },
        },
      }}
    >
      {/* Top row: alert banner + close button */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, px: 2.5, pt: 2.5, pb: 2, flexShrink: 0 }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: '#FDF3D7',
            borderRadius: '8px',
            px: 2,
            py: 1.25,
          }}
        >
          <InfoOutlinedIcon sx={{ color: '#D97706', fontSize: 16, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>
            Once live, the auction cannot be edited and asset fractions remain locked during the auction.
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: '#6B7280', p: 0.5, flexShrink: 0, mt: 0.25 }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Scrollable body */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 2.5,
          pb: 3,
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-track': { background: '#f9fafb', borderRadius: 4 },
          '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: 4 },
        }}
      >
        {/* Featured image */}
        <Box
          sx={{
            width: '100%',
            height: 230,
            borderRadius: '10px',
            overflow: 'hidden',
            bgcolor: '#f3f4f6',
          }}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={asset.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography sx={{ color: '#9ca3af', fontSize: 13 }}>No image available</Typography>
            </Box>
          )}
        </Box>

        {/* Carousel dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mt: 1.5 }}>
          {Array.from({ length: dotCount }, (_, i) => (
            <Box
              key={i}
              onClick={() => onDotClick(i)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: i === activeImageIndex ? '#2563EB' : '#d1d5db',
                cursor: dotCount > 1 ? 'pointer' : 'default',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </Box>

        {/* Asset title */}
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 700,
            color: '#1F2937',
            textAlign: 'center',
            mt: 2,
            lineHeight: 1.25,
          }}
        >
          {asset.title}
        </Typography>

        {/* Subtitle */}
        <Typography sx={{ fontSize: 14, color: '#6B7280', textAlign: 'center', mt: 0.75 }}>
          {typeLabel} | {custodian}
        </Typography>

        {/* Metrics row with dividers */}
        {metrics.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2.5, flexWrap: 'wrap' }}>
            {metrics.map((m, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 14, color: '#6B7280' }}>{m}</Typography>
                {i < metrics.length - 1 && (
                  <Box sx={{ width: '1px', height: 14, bgcolor: '#D1D5DB', mx: 1.5 }} />
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Auction details row with dividers */}
        {auctionDetailItems.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, flexWrap: 'wrap' }}>
            {auctionDetailItems.map((d, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 14, color: '#6B7280' }}>{d}</Typography>
                {i < auctionDetailItems.length - 1 && (
                  <Box sx={{ width: '1px', height: 14, bgcolor: '#D1D5DB', mx: 1.5 }} />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid #F3F4F6',
          flexShrink: 0,
          px: 2.5,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button
          onClick={onEdit}
          sx={{
            bgcolor: '#6B7280',
            color: '#fff',
            borderRadius: '8px',
            height: 40,
            width: 90,
            fontWeight: 600,
            fontSize: 13,
            textTransform: 'none',
            '&:hover': { bgcolor: '#4B5563' },
          }}
        >
          Edit
        </Button>
        <Button
          onClick={onProceed}
          sx={{
            bgcolor: '#1D4ED8',
            color: '#fff',
            borderRadius: '8px',
            height: 40,
            width: 180,
            fontWeight: 600,
            fontSize: 13,
            textTransform: 'none',
            '&:hover': { bgcolor: '#1E3A8A' },
          }}
        >
          Proceed to schedule
        </Button>
      </Box>
    </Dialog>
  );
}
