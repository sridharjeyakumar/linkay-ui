'use client';

import dynamic from 'next/dynamic';
import { Box, Typography, Container, Grid } from '@mui/material';
import type { ShapeType } from './Ownership3DShape';
import type { OwnershipContent } from '@/lib/content';

const Ownership3DShape = dynamic(() => import('./Ownership3DShape'), { ssr: false });

export default function OwnershipSection({ content }: { content: OwnershipContent }) {
  return (
    <Box
      id="ownership"
      sx={{
        bgcolor: '#FFFFFF',
        py: { xs: 6, sm: 8, md: 10, lg: 12 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1400px',
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
        }}
      >
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '2.8rem' },
              color: '#0A0A0A',
              mb: 0,
              letterSpacing: '-0.02em',
              fontFamily: "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              position: 'relative',
              display: 'inline-block',
            }}
          >
            {content.title}
          </Typography>

          <Typography
            sx={{
              textAlign: 'center',
              color: '#737373',
              maxWidth: { xs: '100%', sm: 650, md: 750, lg: 850 },
              mx: 'auto',
              mt: { xs: 1.5, sm: 2, md: 2.5 },
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem', lg: '1.5rem', xl: '24px' },
              lineHeight: 1,
              letterSpacing: '0%',
              px: { xs: 2, sm: 3 },
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 400,
            }}
          >
            {content.subtitle}
          </Typography>
        </Box>

        {/* Feature Rows */}
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {content.steps.map((step, index) => (
            <Grid
              key={step.title}
              container
              spacing={{ xs: 4, md: 6, lg: 8 }}
              sx={{
                mb: index === content.steps.length - 1 ? 0 : { xs: 6, md: 8, lg: 10 },
                alignItems: 'center',
                flexDirection: {
                  xs: 'column',
                  md: step.imagePosition === 'left' ? 'row' : 'row-reverse',
                },
              }}
            >
              {/* 3D Shape Column */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: { xs: 2, md: 3 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 200, sm: 240, md: 280, lg: 320 },
                      height: { xs: 200, sm: 240, md: 280, lg: 320 },
                    }}
                  >
                    <Ownership3DShape type={step.shape as ShapeType} />
                  </Box>
                </Box>
              </Grid>

              {/* Text Column */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  sx={{
                    textAlign: { xs: 'center', md: 'left' },
                    px: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2.2rem' },
                      color: '#0A0A0A',
                      mb: { xs: 2, md: 2.5 },
                      fontFamily: "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#6B7280',
                      fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem', lg: '1.1rem' },
                      lineHeight: 1.6,
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      maxWidth: { xs: '100%', md: '90%' },
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
