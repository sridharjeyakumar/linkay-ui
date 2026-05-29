'use client';

import { Box, Typography, Container } from '@mui/material';
import type { InvestorHeroContent } from '@/lib/content';
import ArrowButton from '@/components/ui/ArrowButton';

export default function InvestorHero({ content }: { content: InvestorHeroContent }) {
  return (
    <Box
      sx={{
        background: '#ffffff',
        position: 'relative',
        pt: { xs: 29, md: 34 },
        pb: { xs: 14, md: 20 },
        overflow: 'hidden',
      }}
    >
      {/* Yellow rhombus */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: '250px', sm: '300px', md: '393.13px' },
          height: { xs: '250px', sm: '300px', md: '393.13px' },
          top: { xs: '50%', md: '136.84px' },
          left: { xs: '-20%', sm: '-10%', md: '324.39px' },
          transform: { xs: 'translateY(-50%) rotate(45.32deg)', md: 'rotate(45.32deg)' },
          border: { xs: '100px solid rgba(251, 191, 36, 1)', md: '156.5px solid rgba(251, 191, 36, 1)' },
          opacity: 0.4,
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Red rhombus */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: '250px', sm: '300px', md: '393.13px' },
          height: { xs: '250px', sm: '300px', md: '393.13px' },
          top: { xs: '50%', md: '126.21px' },
          right: { xs: '-20%', sm: '-10%', md: 'auto' },
          left: { md: '600px' },
          transform: { xs: 'translateY(-50%) rotate(45.32deg)', md: 'rotate(45.32deg)' },
          border: { xs: '100px solid rgba(239, 68, 68, 1)', md: '156.5px solid rgba(239, 68, 68, 1)' },
          opacity: 0.4,
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container
        maxWidth={false}
        sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 }, position: 'relative', zIndex: 1 }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontStyle: 'italic',
            color: '#6b7280',
            mb: { xs: 1.5, md: 2 },
            fontSize: { xs: '0.75rem', sm: '0.82rem', md: '0.9rem' },
            letterSpacing: 0.3,
          }}
        >
          {content.label}
        </Typography>

        <Typography
          component="h1"
          sx={{
            textAlign: 'center',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 500,
            fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4.4rem', lg: '50px' },
            lineHeight: 1.04,
            color: '#0A0A0A',
            letterSpacing: '-0.03em',
          }}
        >
          {content.headline_line1}
        </Typography>

        <Typography
          component="h1"
          sx={{
            textAlign: 'center',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 500,
            fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4.4rem', lg: '50px' },
            lineHeight: 1.04,
            color: '#000000',
            letterSpacing: '-0.03em',
            mb: { xs: 2, md: 3 },
          }}
        >
          {content.headline_line2}
        </Typography>

        <Typography
          sx={{
            textAlign: 'center',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: 1.47,
            letterSpacing: '-0.05em',
            color: '#000000',
            maxWidth: { xs: '100%', sm: 480, md: 540 },
            mx: 'auto',
            mb: { xs: 3, md: 4 },
          }}
        >
          {content.subheading}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ArrowButton
            label={content.button_text}
            onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}
          />
        </Box>
      </Container>
    </Box>
  );
}