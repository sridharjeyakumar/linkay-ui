'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { Lightning } from '@phosphor-icons/react';
import type { MuseumVisualizationContent } from '@/lib/content';

export default function MuseumVisualization({ content }: { content: MuseumVisualizationContent }) {
  return (
    <Box component="section" sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 9 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 }, maxWidth: 700, mx: 'auto', px: { xs: 2, md: 0 } }}>
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.125rem' },
            color: '#0d1b2a',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            mb: '18px',
          }}
        >
          {content.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: { xs: '0.9rem', md: '1rem' },
            color: '#555e6d',
            lineHeight: 1.7,
            maxWidth: 580,
            mx: 'auto',
          }}
        >
          {content.subtitle}
        </Typography>
      </Box>

      {/* Cards */}
      <Box
        sx={{
          maxWidth: 994,
          mx: 'auto',
          px: { xs: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, md: '24px' },
        }}
      >
        {content.items.map((item, index) => {
          const imageOnLeft = index === 1;
          return (
            <Box
              key={item.title}
              sx={{
                width: '100%',
                height: { md: 283 },
                borderRadius: '20px',
                bgcolor: 'rgba(244,249,255,1)',
                boxShadow: '0px 4px 24px 1px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: { xs: 'column', md: imageOnLeft ? 'row-reverse' : 'row' },
                overflow: 'hidden',
                alignItems: 'stretch',
              }}
            >
              {/* Text side */}
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
                  sx={{
                    fontFamily: '"Inter", sans-serif' ,
                    fontWeight: 700,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    color: ' #1E40AF',
                    mb: '16px',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {item.bullets.map((bullet) => (
                    <Box key={bullet} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: 'linear-gradient(180deg, #1E40AF 0%, #55BFEF 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                      <Lightning size={18} color=" #FFFFFF" weight="fill" />
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: { xs: '0.85rem', md: '0.9rem' },
                          color: '#555e6d',
                          lineHeight: 1.5,
                        }}
                      >
                        {bullet}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Image side */}
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
                  unoptimized
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
