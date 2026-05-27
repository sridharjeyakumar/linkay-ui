'use client';

import { Box, Button, Dialog, Typography } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useScrollLock } from '@/hooks/useScrollLock';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  error?: string | null;
  cancelLabel?: string;
}

export function AuctionConfirmDialog({ open, onCancel, onConfirm, loading, error, cancelLabel }: Props) {
  useScrollLock(open);
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '12px',
            bgcolor: '#FFFFFF',
            width: { xs: '90%', sm: 400 },
            maxWidth: 400,
            m: 'auto',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
          },
        },
      }}
    >
      <Box sx={{ px: 3, pt: 3, pb: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* Warning icon */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <WarningAmberRoundedIcon sx={{ color: '#d97706', fontSize: 28 }} />
        </Box>

        {/* Title */}
        <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#111', mb: 1.5 }}>
          Are you sure you want to Schedule Auction?
        </Typography>

        {/* Description */}
        <Typography sx={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
          You are about to schedule this auction for investors. Once the auction goes live, pricing,
          allocation, and timing settings cannot be edited.
        </Typography>

        {error && (
          <Typography sx={{ mt: 1.5, fontSize: 13, color: '#dc2626', fontWeight: 600 }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          pb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Button
          onClick={onCancel}
          disabled={loading}
          sx={{
            fontWeight: 600,
            fontSize: 13,
            color: '#374151',
            textTransform: 'none',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
          }}
        >
          {cancelLabel ?? (error ? 'Back' : 'Cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          startIcon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
          sx={{
            bgcolor: '#1D4ED8',
            color: '#fff',
            borderRadius: '8px',
            height: 40,
            px: 3,
            fontWeight: 600,
            fontSize: 13,
            textTransform: 'none',
            '&:hover': { bgcolor: '#1E3A8A' },
            '&.Mui-disabled': { bgcolor: '#93c5fd', color: '#fff' },
          }}
        >
          Schedule Auction
        </Button>
      </Box>
    </Dialog>
  );
}
