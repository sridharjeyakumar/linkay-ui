'use client';

import { Box, Typography, Container, Grid } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const ASSET_CLASSES = [
  {
    title: 'Museum Artifacts',
    description:
      'Rare and historically significant assets presented through immersive digital ownership experiences',
    href: '/register',
  },
  {
    title: 'Real Estate',
    description:
      'Access fractional ownership opportunities across premium real estate developments and properties',
    href: '/register',
  },
];

export default function DiscoverSection() {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 8 } }} id="discover">
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: '16px', sm: '24px', md: '32px' },
            background: `
              radial-gradient(circle, rgba(239, 238, 255, 0.18) 1.5px, transparent 1.5px),
              linear-gradient(135deg, #4a56c0 0%, #5b66cc 45%, #6d6dcc 100%)
            `,
            backgroundSize: '22px 22px, 100% 100%',
            px: { xs: 3, sm: 5, md: 8, lg: 10 },
            py: { xs: 6, sm: 7, md: 9, lg: 10 },
          }}
        >
          {/* Title */}
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
            Discover Real World Assets
          </Typography>

          {/* Cards */}
          <Grid container spacing={{ xs: 2, sm: 3, md: 3 }} sx={{ justifyContent: 'center' }}>
            {ASSET_CLASSES.map((asset) => (
              <Grid key={asset.title} size={{ xs: 12, sm: 5 }}>
                <Box
                  component={Link}
                  href={asset.href}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: { xs: 2, md: 3 },
                    background: 'transparent',
                    border: '1.5px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: { xs: '12px', md: '16px' },
                    px: { xs: 2.5, sm: 3, md: 3.5 },
                    py: { xs: 3.5, sm: 4, md: 5 },
                    textDecoration: 'none',
                    transition: 'border-color 0.25s ease, transform 0.25s ease',
                    '&:hover': {
                      border: '1.5px solid rgba(255, 255, 255, 0.6)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  {/* Text */}
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

                  {/* Orange arrow */}
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
