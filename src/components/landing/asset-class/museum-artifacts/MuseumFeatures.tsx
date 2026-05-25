'use client';

import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import type { MuseumFeaturesContent } from '@/lib/content';

export default function MuseumFeatures({ content }: { content: MuseumFeaturesContent }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 8, md: 12 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 6 },
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {content.items.map((feature) => (
            /* Gradient border wrapper — 1px gradient bg + inner card creates the gradient border effect */
            <Box
              key={feature.title}
              sx={{
                flex: { xs: '1 1 auto', md: '0 0 328px' },
                maxWidth: { xs: '100%', md: '328px' },
                borderRadius: '20px',
                background: 'linear-gradient(180deg, #83B9FF 0%, #FFFFFF 100%)',
                p: '1px',
              }}
            >
              {/* Inner card */}
              <Box
                sx={{
                  borderRadius: '19px',
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #DBEAFE 100%)',
                  height: { xs: 'auto', md: '401px' },
                  px: 3.5,
                  pt: 4,
                  pb: 4,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Icon — top half, centered */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: { xs: '130px', md: '150px' },
                      height: { xs: '110px', md: '130px' },
                    }}
                  >
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </Box>
                </Box>

                {/* Text — bottom */}
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-archivo), sans-serif',
                      fontWeight: 500,
                      fontSize: { xs: '1.1rem', md: '25px' },
                      lineHeight: 1,
                      color: '#1E40AF',
                      mb: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 400,
                      fontSize: '15px',
                      lineHeight: 1.5,
                      color: '#737373',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
