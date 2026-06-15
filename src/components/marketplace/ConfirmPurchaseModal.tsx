'use client';

import { useState } from 'react';
import { Box, Typography, Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AssetSummary {
  title: string;
  images: string[];
  priceUsdt: number;
  priceUsd: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  asset: AssetSummary;
}

// ── Static wallet balance ─────────────────────────────────────────────────────
// Replace with real wallet query in production.
// Set to 0 to see "Not Enough USDT" / disabled state.
// Set to a value >= asset price to see the active button state.
const MOCK_BALANCE_USDT = 0;

const FEE_PERCENT = 2.5;

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtUsdt(n: number): string {
  if (n === 0) return '0.000';
  return n.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ConfirmPurchaseModal({ open, onClose, asset }: Props) {
  const [activeImage, setActiveImage] = useState(0);

  const totalUsdt = asset.priceUsdt;
  const hasEnough = MOCK_BALANCE_USDT >= totalUsdt;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: '20px 20px 0 0', sm: '20px' },
            bgcolor: '#fff',
            width: { xs: '100%', sm: 820 },
            maxWidth: { xs: '100%', sm: 820 },
            maxHeight: { xs: '95vh', sm: '88vh' },
            m: 0,
            alignSelf: { xs: 'flex-end', sm: 'center' },
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* ── Header: full width ───────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: { xs: 2.5, sm: 3 }, py: { xs: 1.75, sm: 2 },
          borderBottom: '1px solid #f0f0f0', flexShrink: 0,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: { xs: 15, sm: 16 }, color: '#111' }}>
          Confirm Purchase
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: '#6b7280', p: 0.5, '&:hover': { bgcolor: '#f3f4f6' } }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* ── Body: image left + content right ─────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flex: 1,
          minHeight: 0,
          // mobile: entire body scrolls (image + content stacked)
          // desktop: body is clipped; only the right column scrolls
          overflowY: { xs: 'auto', sm: 'hidden' },
          overflowX: 'hidden',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { background: '#e5e7eb', borderRadius: 4 },
        }}
      >
        {/* Left: image carousel — padded with rounded inner box */}
        <Box
          sx={{
            width: { xs: '100%', sm: '45%' },
            flexShrink: 0,
            bgcolor: '#fff',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              bgcolor: '#0a0a0a',
              flex: 1,
              minHeight: { xs: 260, sm: 0 },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.images[activeImage]}
              alt={asset.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            {/* Left arrow */}
            {activeImage > 0 && (
              <IconButton
                onClick={() => setActiveImage((i) => i - 1)}
                size="small"
                sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', p: 0.3, zIndex: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' } }}
              >
                <ChevronLeftIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            {/* Right arrow */}
            {activeImage < asset.images.length - 1 && (
              <IconButton
                onClick={() => setActiveImage((i) => i + 1)}
                size="small"
                sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', p: 0.3, zIndex: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' } }}
              >
                <ChevronRightIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
            {/* Dot navigation */}
            {asset.images.length > 1 && (
              <Box
                sx={{
                  position: 'absolute', bottom: 14, left: '50%',
                  transform: 'translateX(-50%)', display: 'flex', gap: 0.75,
                  zIndex: 1,
                }}
              >
                {asset.images.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setActiveImage(i)}
                    sx={{
                      width: 8, height: 8, borderRadius: '50%', cursor: 'pointer',
                      bgcolor: i === activeImage ? '#fff' : 'rgba(255,255,255,0.38)',
                      transition: 'background-color 0.2s',
                      flexShrink: 0,
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Right: purchase details */}
        <Box
          sx={{
            flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
            // desktop: this column scrolls independently
            // mobile: parent body scrolls, so no nested scroll here
            overflowY: { xs: 'unset', sm: 'auto' },
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 2.5, sm: 3.5 },
            gap: 2,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': { background: '#e5e7eb', borderRadius: 4 },
          }}
        >
          {/* Asset title */}
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 20, sm: 22, md: 24 },
              color: '#111', lineHeight: 1.2,
            }}
          >
            {asset.title}
          </Typography>

          {/* Divider */}
          <Box sx={{ borderTop: '1px solid #f0f0f0' }} />

          {/* List Price */}
          <Box>
            <Typography sx={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, mb: 0.75 }}>
              List Price
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 20, sm: 22 }, color: '#111' }}>
                {fmtUsdt(asset.priceUsdt)} USDT
              </Typography>
              <Typography sx={{ fontSize: { xs: 13, sm: 14 }, color: '#9ca3af' }}>
                (${fmtUsdt(asset.priceUsd)})
              </Typography>
            </Box>
          </Box>

          

          {/* Current balance */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>Your current balance</Typography>
            <Typography sx={{ fontSize: 13, color: '#111', fontWeight: 600 }}>
              {fmtUsdt(MOCK_BALANCE_USDT)} USDT
            </Typography>
          </Box>

          {/* Total amount box */}
          <Box sx={{ bgcolor: '#f3f4f6', borderRadius: '12px', px: 2, py: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
              <Typography sx={{ fontSize: 13, color: '#374151', flexShrink: 0 }}>
                Total amount ({FEE_PERCENT}%):
              </Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111' }}>
                  {fmtUsdt(totalUsdt)} USDT (${fmtUsdt(asset.priceUsd)})
                </Typography>
                {!hasEnough && (
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#ef4444', mt: 0.25 }}>
                    Not Enough USDT
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Footnote */}
          <Typography sx={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.7 }}>
            Final price includes a 2.5% buyers to Linkay Ventures Treasury.{' '}
            <Box
              component="span"
              sx={{ color: '#374151', textDecoration: 'underline', cursor: 'pointer', '&:hover': { color: '#111' } }}
            >
              Learn more
            </Box>
          </Typography>

          {/* Buy now */}
          <Button
            fullWidth
            disabled={!hasEnough}
            sx={{
              borderRadius: '50px',
              fontWeight: 700, fontSize: { xs: 15, sm: 16 },
              textTransform: 'none',
              py: { xs: 1.5, sm: 1.75 },
              boxShadow: 'none',
              color: '#fff',
              mt: 'auto',
              background: hasEnough
                ? 'linear-gradient(270deg, #0EA5E9 0%, #1E40AF 100%)'
                : 'linear-gradient(270deg, #93C5FD 0%, #a5b4fc 100%)',
              '&:hover': hasEnough
                ? { background: 'linear-gradient(270deg, #0284C7 0%, #1E3A8A 100%)', boxShadow: '0 6px 20px rgba(14,165,233,0.4)' }
                : {},
              '&.Mui-disabled': {
                color: '#fff',
                background: 'linear-gradient(270deg, #93C5FD 0%, #a5b4fc 100%)',
              },
            }}
          >
            Buy now
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
