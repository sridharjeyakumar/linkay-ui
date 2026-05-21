'use client';

import { Box, Typography, Container, Grid } from '@mui/material';
import { CirclesThreePlus, Storefront, Compass } from '@phosphor-icons/react';
import type { FeaturesContent } from '@/lib/content';

const ICONS = [CirclesThreePlus, Storefront, Compass];

export default function FeaturesSection({ content }: { content: FeaturesContent }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 8, md: 12 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>

        {/* Title */}
        <Typography
          component="h2"
          sx={{
            textAlign: 'center',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 600,
            fontSize: { xs: '2rem', sm: '2.8rem', md: '48px' },
            lineHeight: 1,
            letterSpacing: '0',
            color: '#0A0A0A',
            mb: 2,
          }}
        >
          {content.title}
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            textAlign: 'center',
            color: '#737373',
            maxWidth: { xs: '100%', sm: 650, md: 750, lg: 850 },
            mx: 'auto',
            mb: { xs: 6, md: 8 },
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.3rem' },
            lineHeight: 1.2,
            letterSpacing: '0%',
            fontWeight: 400,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          }}
        >
          {content.subtitle}
        </Typography>

        {/* Feature cards */}
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ justifyContent: 'center' }}>
          {content.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <Grid
                key={item.title}
                size={{ xs: 12, sm: 6, md: 4 }}
                sx={{ display: 'flex' }}
              >
                <Box
                  className="card-hover"
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    bgcolor: 'transparent',
                    borderRadius: '20px',
                    border: '1.5px solid transparent',
                    px: { xs: 3, md: 4 },
                    py: { xs: 4, md: 5 },
                    cursor: 'pointer',
                    transition: 'background-color 0.8s ease-in-out',
                    '&:hover': {
                      bgcolor: '#EEF1FF',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 60, md: 68 },
                      height: { xs: 60, md: 68 },
                      borderRadius: '14px',
                      bgcolor: '#eef1ff',
                      border: '1px solid #1E40AF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                      flexShrink: 0,
                      transition: 'all 0.8s ease-in-out',
                      '& svg': {
                        color: '#1E40AF',
                        transition: 'color 0.8s ease-in-out',
                      },
                      '.card-hover:hover &': {
                        bgcolor: '#1E40AF',
                        borderColor: '#1E40AF',
                      },
                      '.card-hover:hover & svg': {
                        color: '#ffffff',
                      },
                    }}
                  >
                    <Icon size={32} />
                  </Box>

                  <Typography
                    component="h3"
                    sx={{
                      fontWeight: index === 1 ? 700 : 600,
                      fontFamily: 'var(--font-archivo), sans-serif',
                      fontSize: { xs: '1rem', md: '1.05rem' },
                      color: '#0A0A0A',
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#6b7280',
                      fontSize: { xs: '0.85rem', md: '0.9rem' },
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      lineHeight: 1.7,
                      maxWidth: 220,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>

      </Container>
    </Box>
  );
}
