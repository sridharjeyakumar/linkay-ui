'use client';

import { Box, Dialog, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const pricingParts = showPricing
    ? [
        fmtCurrency(asset.valuation),
        asset.totalFractions ? `${asset.totalFractions} fractions` : null,
        asset.pricePerFraction != null ? `${fmtCurrency(asset.pricePerFraction)} per fraction` : null,
      ].filter(Boolean)
    : [];

  const dotCount = images.length;

  return (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      {/* Image carousel */}
      <Box sx={{ width: '100%', height: 220, bgcolor: '#f3f4f6', position: 'relative', overflow: 'hidden' }}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={asset.title}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography sx={{ color: '#9ca3af', fontSize: 13 }}>No image available</Typography>
          </Box>
        )}

        {/* Left arrow */}
        {images.length > 1 && activeImageIndex > 0 && (
          <IconButton
            onClick={() => onDotClick?.(activeImageIndex - 1)}
            size="small"
            sx={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', p: 0.25, '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' } }}
          >
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        {/* Right arrow */}
        {images.length > 1 && activeImageIndex < images.length - 1 && (
          <IconButton
            onClick={() => onDotClick?.(activeImageIndex + 1)}
            size="small"
            sx={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', p: 0.25, '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' } }}
          >
            <ChevronRightIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <Box sx={{ position: 'absolute', top: 6, right: 8, bgcolor: 'rgba(0,0,0,0.45)', borderRadius: '4px', px: 0.75, py: 0.25 }}>
            <Typography sx={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>
              {activeImageIndex + 1} / {images.length}
            </Typography>
          </Box>
        )}

        {/* Dot indicators overlaid at bottom-center */}
        {dotCount > 1 && (
          <Box sx={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.5 }}>
            {images.map((_, i) => (
              <Box
                key={i}
                onClick={() => onDotClick?.(i)}
                sx={{
                  width: 6, height: 6, borderRadius: '50%',
                  bgcolor: i === activeImageIndex ? '#fff' : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  border: '1px solid rgba(0,0,0,0.15)',
                }}
              />
            ))}
          </Box>
        )}

        {/* VIEW FULL button */}
        {src && (
          <Box
            onClick={() => setLightboxOpen(true)}
            sx={{ position: 'absolute', bottom: 6, right: 8, bgcolor: 'rgba(0,0,0,0.45)', borderRadius: '4px', px: 0.75, py: 0.25, cursor: 'zoom-in' }}
          >
            <Typography sx={{ fontSize: 10, color: '#fff', fontWeight: 600, letterSpacing: 0.3 }}>VIEW FULL</Typography>
          </Box>
        )}
      </Box>

      {/* Lightbox */}
      {src && (
        <Dialog
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          maxWidth={false}
          slotProps={{
            paper: { sx: { bgcolor: 'transparent', boxShadow: 'none', m: 0, overflow: 'hidden', width: '100vw', maxWidth: '100vw', height: '100vh', maxHeight: '100vh' } },
            backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' } },
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton
              onClick={() => setLightboxOpen(false)}
              sx={{ position: 'absolute', top: 16, right: 16, color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}
            >
              <CloseIcon sx={{ fontSize: 22 }} />
            </IconButton>

            {images.length > 1 && (
              <Typography sx={{ position: 'absolute', top: 20, left: 20, color: '#fff', fontSize: 13, fontWeight: 600 }}>
                {activeImageIndex + 1} / {images.length}
              </Typography>
            )}

            {images.length > 1 && activeImageIndex > 0 && (
              <IconButton
                onClick={() => onDotClick?.(activeImageIndex - 1)}
                sx={{ position: 'absolute', left: 16, color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}
              >
                <ChevronLeftIcon sx={{ fontSize: 28 }} />
              </IconButton>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={asset.title}
              style={{ maxWidth: '85vw', maxHeight: '80vh', display: 'block', borderRadius: 8, objectFit: 'contain' }}
            />

            {images.length > 1 && activeImageIndex < images.length - 1 && (
              <IconButton
                onClick={() => onDotClick?.(activeImageIndex + 1)}
                sx={{ position: 'absolute', right: 16, color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}
              >
                <ChevronRightIcon sx={{ fontSize: 28 }} />
              </IconButton>
            )}

            {dotCount > 1 && (
              <Box sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.75 }}>
                {images.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => onDotClick?.(i)}
                    sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i === activeImageIndex ? '#fff' : 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Dialog>
      )}

      {/* Text info */}
      <Box sx={{ px: 2, pt: 1.5, pb: 2, textAlign: 'center' }}>
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
