'use client';

import {
  Box, Button, Chip, Dialog, DialogContent,
  Divider, IconButton, LinearProgress, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { clearPreviewAsset } from '@/features/assets/assetSlice';

const ASSET_TYPE_LABELS: Record<string, string> = {
  'REAL_ESTATE':  'Real Estate',
  'FINE_ART':     'Fine Art',
  'LUXURY_ASSET': 'Luxury Asset',
  'LUXURY_WATCH': 'Luxury Watch',
  'COLLECTIBLE':  'Collectible',
  'OTHER':        'Other',
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

function resolveImg(path: string) {
  if (!path) return '/placeholder-asset.jpg';
  return path;
}

export default function AssetPreviewModal() {
  const dispatch = useAppDispatch();
  const { previewAsset } = useAppSelector((s) => s.assets);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const open = !!previewAsset;

  function handleClose() {
    dispatch(clearPreviewAsset());
    setQty(1);
    setSelectedImg(0);
  }

  if (!previewAsset) return null;

  const rawImages = parseMediaFiles(previewAsset.mediaFiles);
  const images = rawImages.length ? rawImages.map(resolveImg) : ['/placeholder-asset.jpg'];

  const fractionsSold = previewAsset.fractionsSold ?? 0;
  const totalFractions = previewAsset.totalFractions ?? 1000;
  const remaining = totalFractions - fractionsSold;
  const soldPct = Math.round((fractionsSold / totalFractions) * 100);

  const fmt = (n?: number | null) =>
    n != null ? `$${Number(n).toLocaleString()}` : '—';

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              mx: { xs: 1, sm: 2 },
              '&::-webkit-scrollbar': { width: 4 },
              '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: 4 },
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2.5, pb: 1, borderBottom: '1px solid #f3f4f6' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16 }}>Asset Preview</Typography>
          <IconButton size="small" onClick={handleClose}><CloseIcon /></IconButton>
        </Box>

        <DialogContent sx={{ pt: 2.5, px: { xs: 2, sm: 3 }, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: 4 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>

            {/* Left: image gallery */}
            <Box>
              {/* Main image */}
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '4/3',
                  bgcolor: '#f3f4f6',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 1,
                  cursor: images[selectedImg] !== '/placeholder-asset.jpg' ? 'zoom-in' : 'default',
                  position: 'relative',
                  '&:hover .zoom-overlay': { opacity: images[selectedImg] !== '/placeholder-asset.jpg' ? 1 : 0 },
                }}
                onClick={() => {
                  if (images[selectedImg] !== '/placeholder-asset.jpg') {
                    setLightboxSrc(images[selectedImg]);
                  }
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[selectedImg]}
                  alt={previewAsset.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-asset.jpg'; }}
                />
                <Box
                  className="zoom-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <ZoomInIcon sx={{ color: '#fff', fontSize: 36 }} />
                </Box>
              </Box>

              {/* Thumbnails */}
              {images.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {images.slice(0, 6).map((src, i) => (
                    <Box
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1.5,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedImg === i ? '2px solid' : '2px solid transparent',
                        borderColor: selectedImg === i ? 'primary.main' : 'transparent',
                        flexShrink: 0,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-asset.jpg'; }}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Description */}
              <Box sx={{ mt: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Description</Typography>
                  <RemoveIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {previewAsset.description || 'No description provided.'}
                </Typography>
              </Box>

              {/* Jurisdiction */}
              {previewAsset.jurisdiction && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Jurisdiction</Typography>
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">{previewAsset.jurisdiction}</Typography>
                </Box>
              )}

              {/* Documents */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Documents</Typography>
                  <AddIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </Box>
                <Divider sx={{ mt: 0.5 }} />
              </Box>
            </Box>

            {/* Right: details */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {previewAsset.title}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2.5, flexWrap: 'wrap' }}>
                <Chip
                  label={ASSET_TYPE_LABELS[previewAsset.assetType] ?? previewAsset.assetType}
                  size="small"
                  sx={{ bgcolor: '#111', color: '#fff', fontWeight: 600 }}
                />
                {previewAsset.museumName && (
                  <Chip label={previewAsset.museumName} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                )}
              </Box>

              {/* Stats grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1.5,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  p: 2,
                  mb: 2.5,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>Total Valuation</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{fmt(previewAsset.valuation)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>Price / Fraction</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{fmt(previewAsset.pricePerFraction)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>Lockup Period</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{previewAsset.lockupPeriod ?? '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>Compliance</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{previewAsset.compliance ?? '—'}</Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 2' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Fractions sold — {soldPct}% ({remaining} remaining)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={soldPct}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>

              {/* Quantity */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  p: 1.5,
                  width: 'fit-content',
                }}
              >
                <IconButton size="small" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ fontWeight: 700, fontSize: 18, minWidth: 28, textAlign: 'center' }}>{qty}</Typography>
                <IconButton size="small" onClick={() => setQty((q) => q + 1)}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Buy button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ mb: 2, borderRadius: 3, py: 1.5, fontWeight: 700 }}
              >
                Buy Now — Sign with wallet
              </Button>

              {previewAsset.ipfsUrl && (
                <Button
                  fullWidth
                  variant="outlined"
                  endIcon={<OpenInNewIcon />}
                  href={previewAsset.ipfsUrl}
                  target="_blank"
                  sx={{ mb: 1, justifyContent: 'space-between', textTransform: 'none' }}
                >
                  View on IPFS
                </Button>
              )}
              {previewAsset.ipfsMetadataUrl && (
                <Button
                  fullWidth
                  variant="outlined"
                  endIcon={<OpenInNewIcon />}
                  href={previewAsset.ipfsMetadataUrl}
                  target="_blank"
                  sx={{ justifyContent: 'space-between', textTransform: 'none' }}
                >
                  View IPFS Metadata
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <Dialog
        open={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
        maxWidth="lg"
        slotProps={{ paper: { sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'visible' } } }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setLightboxSrc(null)}
            sx={{ position: 'absolute', top: -16, right: -16, bgcolor: '#fff', zIndex: 1, '&:hover': { bgcolor: '#f3f4f6' } }}
          >
            <CloseIcon />
          </IconButton>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc ?? ''}
            alt="Fullscreen preview"
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, display: 'block', objectFit: 'contain' }}
          />
        </Box>
      </Dialog>
    </>
  );
}
