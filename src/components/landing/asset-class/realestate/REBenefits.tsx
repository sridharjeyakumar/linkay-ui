'use client';

import { Box, Typography } from '@mui/material';
import { Percent, Waves, Certificate } from '@phosphor-icons/react';
import { Archivo, Inter } from 'next/font/google';
import type { REBenefitsContent } from '@/lib/content';

const archivo = Archivo({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400'], display: 'swap' });

// New Phosphor icons as requested
const ICONS = [
  <Percent key="percent" size={32} color="#1a6fd4" weight="regular" />,
  <Waves key="waves" size={32} color="#1a6fd4" weight="regular" />,
  <Certificate key="certificate" size={32} color="#1a6fd4" weight="regular" />,
];

export default function REBenefits({ content }: { content: REBenefitsContent }) {
  return (
    <Box sx={{ bgcolor: 'white', py: { xs: 5, md: 7 } }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 3, md: 6 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
          }}
        >
          {content.items.map((b, i) => (
            <Box key={b.title} sx={{ flex: 1 }}>
              <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'flex-start' }}>
                {ICONS[i] ?? ICONS[0]}
              </Box>
              <Typography
                className={archivo.className}
                sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'rgba(14, 165, 233, 1)', mb: 1, textAlign: 'left' }}
              >
                {b.title}
              </Typography>
              <Typography
                className={inter.className}
                sx={{ fontSize: '0.83rem', color: '#555', lineHeight: 1.65, textAlign: 'left' }}
              >
                {b.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}