'use client';

import { Box, Typography, Container, Grid } from '@mui/material';
import Image from 'next/image';
import type { DiscoverContent } from '@/lib/content';

export default function DiscoverSection({ content }: { content: DiscoverContent }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 8 } }} id="discover">
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: '16px', md: '42px' },

            // Main blue gradient matching uploaded image
            background: `
              radial-gradient(circle at center, rgba(255,255,255,0.12) 1px, transparent 1px),
              linear-gradient(
                180deg,
                #037DC8 0%,
                #1E8FD8 38%,
                #6EB7E8 72%,
                #C7E0F3 100%
              )
            `,

            // Dot grid density
            backgroundSize: '18px 18px, 100% 100%',

            // Soft outer glow like the image
            

            px: { xs: 3, sm: 4, md: 5, lg: 6 },
            py: { xs: 13, sm: 15, md: 17, lg: 19 },

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

            // Optional subtle overlay for depth
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(
                  circle at top center,
                  rgba(255,255,255,0.18),
                  transparent 55%
                )
              `,
              pointerEvents: 'none',
            },
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.8rem', md: '48px' },
              lineHeight: 1,
              letterSpacing: 0,
              textAlign: 'center',
              color: '#FAFAFA',
              mb: { xs: 4, sm: 5, md: 7 },
            }}
          >
            {content.title}
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} sx={{ justifyContent: 'center' }}>
            {content.assetClasses.map((asset) => (
              <Grid key={asset.title} size={{ xs: 12, sm: 5 }}>
                <Box
                  onClick={() => window.dispatchEvent(new Event('linkay:open-register'))}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: { xs: 2, md: 3 },
                    background: 'rgba(0, 0, 0, 0.15)',
                    border: '1.5px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: { xs: '12px', md: '16px' },
                    px: { xs: 2.5, sm: 3, md: 3.5 },
                    py: { xs: 3.5, sm: 4, md: 5 },
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      border: '1.5px solid rgba(255, 255, 255, 0.6)',
                      transform: 'translateY(-3px)',
                      background: 'rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      component="h3"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: '1.1rem', sm: '1.25rem', md: '24px' },
                        lineHeight: 1,
                        letterSpacing: 0,
                        color: '#FFFFFF',
                        mb: { xs: 0.75, md: 1 },
                      }}
                    >
                      {asset.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 400,
                        fontSize: { xs: '0.85rem', sm: '0.9rem', md: '16px' },
                        lineHeight: 1,
                        letterSpacing: 0,
                        color: '#FFFFFFCC',
                      }}
                    >
                      {asset.description}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flexShrink: 0,
                      width: { xs: 38, sm: 42, md: 48 },
                      height: { xs: 38, sm: 42, md: 48 },
                      position: 'relative',
                    }}
                  >
                    <Image
                      src="/landing/orange arrow.svg"
                      alt={`Explore ${asset.title}`}
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
