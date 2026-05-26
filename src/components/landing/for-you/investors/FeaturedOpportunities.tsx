'use client';

import { Box, Typography, Container, Grid } from '@mui/material';
import Image from 'next/image';
import type { FeaturedOpportunitiesContent } from '@/lib/content';

export default function FeaturedOpportunities({ content }: { content: FeaturedOpportunitiesContent }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 8, md: 12 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
        <Typography
          component="h2"
          sx={{
            textAlign: 'center',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 600,
            fontSize: { xs: '2rem', sm: '2.8rem', md: '48px' },
            lineHeight: 1,
            color: '#0A0A0A',
            mb: { xs: 6, md: 8 },
          }}
        >
          {content.title}
        </Typography>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {content.opportunities.map((opp) => (
            <Grid key={opp.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 5',
                  transition: 'transform 0.5s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Image
                  src={opp.image}
                  alt={opp.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}