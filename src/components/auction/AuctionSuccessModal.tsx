'use client';

import { Box, Button, Dialog, Typography } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { AssetInfoCard } from './shared/AssetInfoCard';
import { formatDateDisplay, formatTimeDisplay } from './shared/styles';
import type { Asset } from '@/types/asset.types';
import type { SupplyPricingValues } from './steps/SupplyPricingStep';
import type { ScheduleValues } from './ScheduleAuctionModal';

interface Props {
  open: boolean;
  asset: Asset;
  activeImageIndex: number;
  onDotClick: (i: number) => void;
  pricing: SupplyPricingValues;
  schedule: ScheduleValues;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Typography sx={{ fontSize: 13, color: '#374151', mb: 0.5 }}>
      <Box component="span" sx={{ fontWeight: 600 }}>{label}: </Box>
      {value}
    </Typography>
  );
}

export function AuctionSuccessModal({
  open,
  asset,
  activeImageIndex,
  onDotClick,
  pricing,
  schedule,
  onClose,
}: Props) {
  const startLabel = schedule.startDate
    ? `${formatDateDisplay(schedule.startDate)} | ${formatTimeDisplay(schedule.startTime)} ${schedule.timezone}`
    : '—';
  const endLabel = schedule.endDate
    ? `${formatDateDisplay(schedule.endDate)} | ${formatTimeDisplay(schedule.endTime)} ${schedule.timezone}`
    : '—';

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
      {/* Header */}
      <Box
        sx={{
          flexShrink: 0,
          px: 2.5,
          pt: 2,
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleOutlinedIcon sx={{ color: '#10b981', fontSize: 24 }} />
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#111' }}>
            Auction Scheduled
          </Typography>
        </Box>
        <Button
          onClick={onClose}
          sx={{
            fontWeight: 600,
            fontSize: 13,
            color: '#374151',
            textTransform: 'none',
            '&:hover': { bgcolor: '#f9fafb' },
          }}
        >
          Close
        </Button>
      </Box>

      <Box sx={{ borderBottom: '1px solid #f0f0f0', flexShrink: 0 }} />

      {/* Scrollable body */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          px: 2.5,
          py: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '&::-webkit-scrollbar': { width: 5 },
          '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: 4 },
        }}
      >
        {/* Asset card */}
        <AssetInfoCard
          asset={asset}
          activeImageIndex={activeImageIndex}
          onDotClick={onDotClick}
          showPricing={false}
        />

        {/* Auction summary */}
        <Box sx={{ px: 0.5 }}>
          {pricing.fractionsAllocated && (
            <Typography sx={{ fontSize: 13, color: '#374151', mb: 0.5 }}>
              {pricing.fractionsAllocated} Fractions Allocated
            </Typography>
          )}
          {pricing.reservePrice && (
            <DetailRow label="Reserve Price" value={`$${pricing.reservePrice}`} />
          )}
          <DetailRow label="Auction Starts" value={startLabel} />
          <DetailRow label="Auction Ends" value={endLabel} />
        </Box>
      </Box>
    </Dialog>
  );
}
