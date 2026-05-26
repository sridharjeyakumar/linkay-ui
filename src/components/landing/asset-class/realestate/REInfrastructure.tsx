'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { Archivo, Inter } from 'next/font/google';
import type { REInfrastructureContent } from '@/lib/content';

const archivo = Archivo({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });

export default function REInfrastructure({ content }: { content: REInfrastructureContent }) {
  return (
    <Box sx={{ bgcolor: '#fff', py: { xs: 6, md: 9 } }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 3, md: 6 } }}>
        {/* Section title — Archivo 700 */}
        <Typography
          component="h2"
          className={archivo.className}
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            color: '#0A0A0A',
            textAlign: 'center',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            mb: 1.5,
          }}
        >
          {content.title}
        </Typography>

        {/* Section subtitle — Inter 400 */}
        <Typography
          className={inter.className}
          sx={{
            textAlign: 'center',
            color: '#737373',
            fontSize: { xs: '0.9rem', md: '1rem' },
            fontWeight: 400,
            maxWidth: 560,
            mx: 'auto',
            lineHeight: 1.65,
            mb: { xs: 5, md: 7 },
          }}
        >
          {content.subtitle}
        </Typography>

        {/* Two-column layout via flex — no Grid, no DOM warnings */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            gap: { xs: 4, md: 5 },
          }}
        >
          {/* Left: property types list */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {content.property_types.map((pt) => (
              <Box key={pt.num} sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <Typography
                  className={archivo.className}
                  sx={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'rgba(14, 165, 233, 1)',
                    minWidth: 28,
                    lineHeight: 1.3,
                    mt: '2px',
                    flexShrink: 0,
                  }}
                >
                  {pt.num}
                </Typography>

                <Box>
                  <Typography
                    className={archivo.className}
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      color: '#0A0A0A',
                      lineHeight: 1.3,
                      mb: '6px',
                    }}
                  >
                    {pt.title}
                  </Typography>

                  <Typography
                    className={inter.className}
                    sx={{
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      color: '#737373',
                      lineHeight: 1.65,
                    }}
                  >
                    {pt.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Right: building image */}
          <Box
            sx={{
              flex: { xs: 'none', md: 1 },
              flexShrink: 0,
              width: '100%',
              height: { xs: '56vw', sm: '300px', md: '360px' },
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              bgcolor: '#e8edf4',
            }}
          >
            <Image src={content.building_image} alt="Building" fill style={{ objectFit: 'cover' }} unoptimized />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}