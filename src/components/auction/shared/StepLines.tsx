'use client';

import { Box } from '@mui/material';

interface Props {
  step: number;
  total: number;
}

export function StepLines({ step, total }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
      {Array.from({ length: total }, (_, i) => (
        <Box
          key={i}
          sx={{
            height: 3,
            width: 36,
            borderRadius: 10,
            bgcolor: i < step ? '#3b6ef8' : '#e5e7eb',
            transition: 'background-color 0.3s ease',
          }}
        />
      ))}
    </Box>
  );
}
