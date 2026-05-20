'use client';

import { Box, Typography } from '@mui/material';

interface Props {
  children: React.ReactNode;
  required?: boolean;
}

export function AuctionLabel({ children, required }: Props) {
  return (
    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111', mb: 0.75 }}>
      {children}
      {required && (
        <Box component="span" sx={{ color: '#ef4444', ml: 0.25 }}>
          *
        </Box>
      )}
    </Typography>
  );
}
