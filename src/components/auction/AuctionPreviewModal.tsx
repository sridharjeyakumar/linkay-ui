'use client';

import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { AssetInfoCard } from './shared/AssetInfoCard';
import { btnPrimary, fmtCurrency } from './shared/styles';
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
  open,
  asset,
  activeImageIndex,
  onDotClick,
  pricing,
  onEdit,
  onProceed,
  onClose,
}: Props) {
  const pricingLines = [
    asset.valuation ? `${fmtCurrency(asset.valuation)} Valuation` : null,
    pricing.fractionsAllocated ? `${pricing.fractionsAllocated} Fraction Supply` : null,
    asset.pricePerFraction ? `${fmtCurrency(asset.pricePerFraction)} per Fraction` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  const auctionDetails = [
    pricing.reservePrice ? `Reserve Price: $${pricing.reservePrice}` : null,
    pricing.startingBidPrice ? `Starting Bid: $${pricing.startingBidPrice}` : null,
    pricing.minIncrement ? `Minimum increment: $${pricing.minIncrement}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: '#fff',
            width: { xs: '100%', sm: 480 },
            maxWidth: { xs: '100%', sm: 480 },
            maxHeight: { xs: '95vh', sm: '92vh' },
            m: { xs: 0, sm: 2, md: 'auto' },
            alignSelf: { xs: 'flex-end', sm: 'center' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        },
      }}
    >
      {/* Warning banner */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          bgcolor: '#fef3c7',
          px: 2,
          py: 1.25,
          flexShrink: 0,
        }}
      >
        <WarningAmberRoundedIcon sx={{ color: '#d97706', fontSize: 18, mt: 0.15, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
          Once live, the auction cannot be edited and asset fractions remain locked during the auction.
        </Typography>
      </Box>

      {/* Close button row */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pt: 1.5, flexShrink: 0 }}>
        <IconButton size="small" onClick={onClose} sx={{ color: '#6b7280', p: 0.5 }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Scrollable content */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 2.5,
          pb: 2.5,
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-track': { background: '#f9fafb', borderRadius: 4 },
          '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: 4 },
        }}
      >
        {/* Asset image + info */}
        <AssetInfoCard
          asset={asset}
          activeImageIndex={activeImageIndex}
          onDotClick={onDotClick}
          showPricing={false}
        />

        {/* Pricing details below card */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {pricingLines && (
            <Typography sx={{ fontSize: 13, color: '#6b7280', mb: 0.5 }}>
              {pricingLines}
            </Typography>
          )}
          {auctionDetails && (
            <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
              {auctionDetails}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: '1px solid #f0f0f0', flexShrink: 0 }} />
      <Box
        sx={{
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
          variant="outlined"
          sx={{
            borderRadius: 10,
            px: 3,
            py: 1,
            fontWeight: 700,
            fontSize: 13,
            textTransform: 'none',
            color: '#374151',
            borderColor: '#d1d5db',
            '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
          }}
        >
          Edit
        </Button>
        <Button onClick={onProceed} sx={btnPrimary}>
          Proceed to schedule
        </Button>
      </Box>
    </Dialog>
  );
}
