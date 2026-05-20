'use client';

import { Box, Button, Dialog, Typography } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function AuctionConfirmDialog({ open, onCancel, onConfirm, loading }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: '#fffbeb',
            width: { xs: '90%', sm: 380 },
            maxWidth: 380,
            m: 'auto',
            overflow: 'hidden',
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
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          startIcon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
          sx={{
            bgcolor: '#d97706',
            color: '#fff',
            borderRadius: 10,
            px: 3,
            py: 1,
            fontWeight: 700,
            fontSize: 13,
            textTransform: 'none',
            letterSpacing: 0.3,
            '&:hover': { bgcolor: '#b45309' },
            '&.Mui-disabled': { bgcolor: '#fcd34d', color: '#fff' },
          }}
        >
          Schedule Auction
        </Button>
      </Box>
    </Dialog>
  );
}
