'use client';

import { Box, Typography, Container } from '@mui/material';
import { Archivo } from 'next/font/google';
import Image from 'next/image';
import ArrowButton from '@/components/ui/ArrowButton';
import type { MarketplaceHeaderContent } from '@/lib/content';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

export default function HeaderSection({ content }: { content: MarketplaceHeaderContent }) {
  return (
    <Box
      sx={{
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        minHeight: { xs: '500px', sm: '580px', md: '725px' },
      }}
    >
      {/* ── Centered star wrapper ── */}
<Box
  sx={{
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    // ✅ FIX: use 100vw on tablet/mobile instead of capping at 1200px
    width: { xs: '100vw', sm: '100vw', md: '1200px' },
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  }}
>
  {/* LEFT STAR — Star 16, #1E40AF */}
  <Box
    sx={{
      position: 'absolute',
      top: { xs: '15%', sm: '-5%', md: '-20px' },
      left: { xs: '-13vw', sm: '-13vw', md: '-150px' },
      width: { xs: '100vw', sm: '100vw', md: '1200px' },
      height: { xs: '100vw', sm: '90vw', md: '848px' },
    }}
  >
    <Image src="/Marketplace/Star_images/Star 16.svg" alt="" fill
      style={{ objectFit: 'contain' }} priority />
  </Box>

  {/* RIGHT STAR — Star 17, #0EA5E9 */}
  <Box
    sx={{
      position: 'absolute',
      top: { xs: '15%', sm: '-5%', md: '-20px' },
      right: { xs: '-15vw', sm: '-15vw', md: '-180px' },
      width: { xs: '100vw', sm: '100vw', md: '1200px' },
      height: { xs: '100vw', sm: '90vw', md: '848px' },
    }}
  >
    <Image src="/Marketplace/Star_images/Star 17.svg" alt="" fill
      style={{ objectFit: 'contain' }} priority />
  </Box>

  {/* White blur blend at bottom */}
<Box
  sx={{
    position: 'absolute',
    bottom: '-80px',
    left: 0,
    width: '100%',
    height: { xs: '140px', md: '220px' },
    background: `
      linear-gradient(
        to bottom,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.85) 70%,
        #ffffff 100%
      )
    `,
    filter: 'blur(26px)',
    pointerEvents: 'none',
    zIndex: 2,
  }}
/>
</Box>

      {/* ── Text content ── */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1412px',
          px: { xs: 2, sm: 4, md: 6 },
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: '200px', sm: '180px', md: '230px' },
          pb: { xs: '50px', sm: '100px', md: '103px' },
        }}
      >
        <Box
          sx={{
            maxWidth: '1000px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: '20px', sm: '28px', md: '41px' },
          }}
        >
          {/* Heading — Archivo Bold 700, 50px */}
          <Typography
            component="h1"
            className={archivo.className}
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.4rem', md: '50px' },
              lineHeight: 1.28,
              letterSpacing: '-0.03em',
              color: '#000000',
              maxWidth: '1000px',
              mx: 'auto',
            }}
          >
            {content.heading}
          </Typography>

          {/* Subtitle — Inter Regular 400, 16px */}
          <Typography
            sx={{
              textAlign: 'center',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: { xs: '14px', sm: '15px', md: '16px' },
              lineHeight: '147%',
              letterSpacing: '-0.03em',
              color: '#000000',
              maxWidth: '642px',
              mx: 'auto',
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