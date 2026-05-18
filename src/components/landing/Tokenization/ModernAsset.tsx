'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { Archivo, Inter } from 'next/font/google';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const cards = [
  {
    title: 'Museums & Collections',
    description: 'Digitally expand access to historically significant assets.',
    image: '/Modern_Asset/White heart icon.svg',
  },
  {
    title: 'Private Collectors',
    description: 'Unlock digital investment access to premium assets.',
    image: '/Modern_Asset/key icon.svg',
  },
  {
    title: 'Real Estate Owners',
    description: 'Access premium properties through structured ownership.',
    image: '/Modern_Asset/pin icon.svg',
  },
  {
    title: 'Institutional Asset Holders',
    description: 'Enable transparent ownership distribution in a secure ecosystem.',
    image: '/Modern_Asset/Metal icon-white spring.svg',
  },
];

export default function ModernAsset() {
  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* ── 1440 container ── */}
      <Box
        sx={{
          maxWidth: '1440px',
          mx: 'auto',
          px: { xs: '20px', md: '0' },
        }}
      >
        {/* ═══════════════════════════════════════════
            HEADING BLOCK
            Figma: width 1196, height 100, left 122
            → centered in 1440  (122 + 1196 + 122 = 1440)
        ═══════════════════════════════════════════ */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1196px',
            mx: 'auto',
            pt: { xs: '60px', md: '70px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '19px',
          }}
        >
          <Typography
            component="h2"
            className={archivo.className}
            sx={{
              fontWeight: 600,
              fontSize: { xs: '32px', sm: '40px', md: '48px' },
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#0A0A0A',
            }}
          >
            Built for Modern Asset Owners
          </Typography>
        </Box>

        {/* ═══════════════════════════════════════════
            2×2 CARD GRID
            Each card: 340×371, gap-x: 42px, gap-y: 8px
            Total grid: 722px wide, centered
        ═══════════════════════════════════════════ */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: { xs: '40px', md: '51px' },
            pb: { xs: '60px', md: '82px' },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '340px 340px' },
              columnGap: '42px',
              rowGap: '8px',
              justifyContent: 'center',
            }}
          >
            {cards.map((card, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: '100%', sm: '340px' },
                  height: { xs: 'auto', sm: '371px' },
                  borderRadius: '20px',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '33px',
                  boxSizing: 'border-box',
                }}
              >
                {/* ── Card Image: 200×200 ── */}
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </Box>

                {/* ── Card Text: 280×78, gap 6px ── */}
                <Box
                  sx={{
                    width: { xs: '100%', sm: '280px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Typography
                    className={archivo.className}
                    sx={{
                      fontWeight: 500,
                      fontSize: '24px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      color: '#0A0A0A',
                      
                      whiteSpace:
      card.title === 'Institutional Asset Holders'
        ? 'nowrap'
        : 'normal',
  
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    className={inter.className}
                    sx={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '145%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      color: '#737373',
                    }}
                  >
                    {card.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
