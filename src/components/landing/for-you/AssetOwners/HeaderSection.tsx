'use client';

import { Box, Typography, Container } from '@mui/material';
import { Plus_Jakarta_Sans } from 'next/font/google';
import ArrowButton from '@/components/ui/ArrowButton';
import type { AssetOwnersHeaderContent } from '@/lib/content';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

export default function HeaderSection({ content }: { content: AssetOwnersHeaderContent }) {
  return (
    <Box
      sx={{
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
    >

{/* Gradient blur backdrop — centered wrapper keeps both blobs centered on all screen sizes */}
<Box
  sx={{
    position: 'absolute',
    top: '200px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '200px',
    zIndex: 0,
    pointerEvents: 'none',
  }}
>
  <Box
    sx={{
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '180px',
      height: '100px',
      borderRadius: '50%',
      border: '156px solid #1E40AF',
      opacity: 0.8,
      filter: 'blur(135px)',
      transform: 'rotate(45deg)',
    }}
  />
  <Box
    sx={{
      position: 'absolute',
      left: '290px',
      top: '0px',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      border: '156px solid #0EA5E9',
      opacity: 0.8,
      filter: 'blur(130px)',
      transform: 'rotate(45deg)',
    }}
  />
</Box>

      {/* HERO / HEADER SECTION */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1400px',
          px: { xs: 2, sm: 4, md: 6 },
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 28, sm: 32, md: 33 },
          pb: { xs: 6, md: 10 },
        }}
      >
        {/* Heading container — Figma: w1000 h278, gap 17px */}
        <Box
          sx={{
            maxWidth: '1000px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '17px',
            pt: { xs: 0, md: 0 },
            pb: { xs: 4, md: 15},
          }}
        >
          {/* Heading — Figma: Plus Jakarta Sans, Bold 700, 50px */}
          <Typography
            component="h1"
            className={plusJakarta.className}
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.6rem', md: '50px' },
              lineHeight: 1.28,
              letterSpacing: '-0.03em',
              color: '#000000',
              maxWidth: '1000px',
              mx: 'auto',
            }}
          >
            {content.heading}
          </Typography>

          {/* Subtitle — Figma: Inter, Regular 400, 16px, maxWidth 642px */}
          <Typography
            sx={{
              textAlign: 'center',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '147%',
              letterSpacing: '-0.01em',
              color: '#000000',
              maxWidth: '642px',
              mx: 'auto',
              mb: { xs: 1, md: 1.5 },
            }}
          >
            {content.subtitle}
          </Typography>

          {/* CTA Button */}
          <ArrowButton label={content.button_text} onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))} />
        </Box>
      </Container>
    </Box>
  );
}
