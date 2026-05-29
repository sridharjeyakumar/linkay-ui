'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { Archivo, Inter } from 'next/font/google';
import type { REVisualizationContent } from '@/lib/content';

const archivo = Archivo({ subsets: ['latin'], weight: ['400', '600', '700'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400'], display: 'swap' });

export default function IntelligentPropertyVisualization({
  content,
}: {
  content: REVisualizationContent;
}) {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: '#ffffff',
        pt: { xs: 1, md: 6 },
        pb: { xs: 6, md: 8 },
        px: 0,
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          textAlign: 'center',
          mb: { xs: 4, md: 8 },
          maxWidth: 907,
          mx: 'auto',
          px: { xs: '20px', md: 0 },
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <Typography
          className={archivo.className}
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: '2rem',
              md: '3rem',
            },
            color: '#0d1b2a',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          {content.title}
        </Typography>
        <Typography
          className={inter.className}
          sx={{
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
            color: '#3d4858',
            lineHeight: 1.75,
            maxWidth: 620,
            mx: 'auto',
          }}
        >
          {content.subtitle}
        </Typography>
      </Box>

      {/* Cards */}
      <Box
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          px: { xs: '16px', sm: '32px', md: '80px', lg: '223px' },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, md: '24px' },
        }}
      >
        {content.items.map((item, index) => {
          // Card 1 → image right, Card 2 → image left, Card 3 → image right
          const imageOnLeft = index === 1;

          return (
            <Box
              key={item.title}
              sx={{
                width: '100%',
                maxWidth: 994,
                mx: 'auto',
                height: { md: 283 },
                borderRadius: '20px',
                bgcolor: 'rgba(244, 249, 255, 1)',
                boxShadow: '0px 4px 24px 1px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  md: imageOnLeft ? 'row-reverse' : 'row',
                },
                overflow: 'hidden',
                alignItems: 'stretch',
              }}
            >
              {/* Text Side */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: { xs: 3, md: '40px' },
                  py: { xs: 3, md: '36px' },
                }}
              >
                <Typography
                  className={archivo.className}
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    color: '#1a6fd4',
                    mb: '12px',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  className={inter.className}
                  sx={{
                    fontSize: { xs: '0.85rem', md: '0.9rem' },
                    color: '#555e6d',
                    lineHeight: 1.75,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>

              {/* Image Side */}
              <Box
                sx={{
                  width: { xs: '100%', md: 348 },
                  height: { xs: 200, md: 244 },
                  flexShrink: 0,
                  position: 'relative',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  alignSelf: 'center',
                  m: { xs: 0, md: '20px' },
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover', borderRadius: '15px' }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}