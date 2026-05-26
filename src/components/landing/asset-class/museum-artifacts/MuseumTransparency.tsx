'use client';

import { Box, Typography } from '@mui/material';
import { UserGear, ShieldCheck, UsersThree } from '@phosphor-icons/react';
import type { MuseumTransparencyContent } from '@/lib/content';

const ICONS = [UserGear, ShieldCheck, UsersThree];

export default function MuseumTransparency({ content }: { content: MuseumTransparencyContent }) {
  return (
    <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 3, md: 6 } }}>
        {/* Heading */}
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
            color: '#0A0A0A',
            lineHeight: 1.15,
            textAlign: 'center',
            mb: { xs: 6, md: 8 },
          }}
        >
          {content.title}
        </Typography>

        {/* Three columns */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 5, md: 6 } }}>
          {content.items.map((item, i) => {
            const Icon = ICONS[i] ?? ICONS[0];
            return (
              <Box key={item.title} sx={{ flex: 1 }}>
                <Box sx={{ mb: 2, color: 'rgba(14,165,233,1)' }}>
                  <Icon size={36} color="rgba(14,165,233,1)" weight="regular" />
                </Box>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-Inter), sans-serif',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: ' rgba(18, 20, 29, 1)',
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.83rem',
                    color: '#555',
                    lineHeight: 1.65,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
