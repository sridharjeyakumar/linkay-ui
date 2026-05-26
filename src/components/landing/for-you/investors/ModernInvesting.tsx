'use client';

import { Box, Typography, Container, Grid } from '@mui/material';
import { PuzzlePiece, Diamond, Storefront } from '@phosphor-icons/react';
import type { ModernInvestingContent } from '@/lib/content';

const ICONS = [PuzzlePiece, Diamond, Storefront];

export default function ModernInvesting({ content }: { content: ModernInvestingContent }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 8, md: 12 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
        <Typography
          component="h2"
          sx={{
            textAlign: 'center',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 500,
            fontSize: { xs: '2rem', sm: '2.8rem', md: '48px' },
            lineHeight: 1,
            color: '#0A0A0A',
            mb: { xs: 6, md: 8 },
          }}
        >
          {content.title}
        </Typography>

        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ justifyContent: 'center' }}>
          {content.items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex' }}>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    bgcolor: '#DBF2FC',
                    borderRadius: '16px',
                    px: { xs: 3, md: 4 },
                    py: { xs: 4, md: 5 },
                    transition: 'box-shadow 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 8px 28px rgba(26, 111, 212, 0.12)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2.5 }}>
                    <Icon size={48} color ="#1E40AF"/>
                  </Box>

                  <Typography
                    component="h3"
                    sx={{
                      fontWeight: 500,
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '25px',
                      color: '#1a6fd4',
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#6b7280',
                      fontSize: { xs: '0.85rem', md: '0.9rem' },
                      fontFamily: '"Inter", sans-serif',
                      lineHeight: 1.7,
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
