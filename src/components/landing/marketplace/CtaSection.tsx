'use client';

import { Box, Typography, Container } from '@mui/material';
import ArrowButton from '@/components/ui/ArrowButton';
import type { MarketplaceCtaContent } from '@/lib/content';

export default function CtaSection({ content }: { content: MarketplaceCtaContent }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 8 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: '16px', sm: '24px', md: '32px' },
          border: '2px solid #ABE2FB',
          background: 'linear-gradient(90deg, #0EA5E9 -10%, #C2FFFB 50%, #0EA5E9 115%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, sm: 5, md: 8, lg: 10 },
          py: { xs: 7, sm: 8, md: 10 },
          boxShadow: 'inset 0 0 40px rgba(83, 181, 246, 0.25)',
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 600,
            fontSize: '48px',
            lineHeight: 1,
            letterSpacing: '-0.07em',
            color: '#0A0A0A',
            textAlign: 'center',
            mb: { xs: 3.5, md: 4.5 },
          }}
        >
          {content.title}
        </Typography>

        <ArrowButton
          label={content.button_text}
          onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}
        />
      </Box>
      </Container>
    </Box>
  );
}
