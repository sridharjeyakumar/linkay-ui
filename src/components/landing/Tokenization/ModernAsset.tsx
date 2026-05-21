'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { Archivo, Inter } from 'next/font/google';
import type { ModernAssetContent } from '@/lib/content';

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

export default function ModernAsset({ content }: { content: ModernAssetContent }) {
  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        position: 'relative',
        width: '100%',
      }}
    >
      <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: '20px', md: '0' } }}>

        {/* Heading */}
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
            {content.title}
          </Typography>
        </Box>

        {/* 2×2 Card Grid */}
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
            {content.cards.map((card, index) => (
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
                <Box sx={{ width: 200, height: 200, position: 'relative', flexShrink: 0 }}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </Box>

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
                      whiteSpace: card.title === 'Institutional Asset Holders' ? 'nowrap' : 'normal',
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
