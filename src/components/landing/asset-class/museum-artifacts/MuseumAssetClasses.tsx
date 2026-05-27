'use client';

import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import type { MuseumAssetClassesContent } from '@/lib/content';

const ICON_PATHS = [
  '/landing/museum-artifacts/pillar icon.svg',
  '/landing/museum-artifacts/Frame icon.svg',
  '/landing/museum-artifacts/diamond icon.svg',
];

const hoverCard = {
  position: 'relative' as const,
  borderRadius: '16px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.32s ease, box-shadow 0.32s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 24px 56px rgba(0,0,0,0.18)',
  },
};

export default function MuseumAssetClasses({ content }: { content: MuseumAssetClassesContent }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', pt: { xs: 6, md: 8 }, pb: { xs: 10, md: 14 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>

        {/* Heading */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 11 } }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 600,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '48px' },
              lineHeight: 1,
              letterSpacing: 0,
              color: '#0A0A0A',
              mb: { xs: 3, md: 3.5 },
            }}
          >
            {content.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '24px' },
              lineHeight: 1.4,
              color: '#737373',
              maxWidth: 860,
              mx: 'auto',
            }}
          >
            {content.subheading}
          </Typography>
        </Box>

        {/* Two-column layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 7, lg: 10 },
            alignItems: { xs: 'stretch', lg: 'center' },
          }}
        >
          {/* Left: category list */}
          <Box
            sx={{
              flex: '0 0 auto',
              width: { xs: '100%', lg: '42%' },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 4, md: 5 },
            }}
          >
            {content.categories.map((cat, i) => {
              return (
                <Box key={cat.title} sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: { xs: 60, md: 68 },
                      height: { xs: 60, md: 68 },
                      borderRadius: '50%',
                      bgcolor: '#1E40AF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ICON_PATHS[i]}
                      alt=""
                      width={32}
                      height={32}
                      style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-archivo), sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: '1.15rem', md: '30px' },
                        lineHeight: 1,
                        color: '#000000',
                        mb: 1.5,
                      }}
                    >
                      {cat.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 400,
                        fontSize: { xs: '0.875rem', md: '15px' },
                        lineHeight: 1.6,
                        color: '#6B7280',
                      }}
                    >
                      {cat.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Right: staggered 2-column image grid */}
          <Box sx={{ flex: 1, width: { xs: '100%', lg: 'auto' }, display: 'flex', gap: { xs: 1.5, md: 2 }, alignItems: 'flex-start' }}>

            {/* Left column: building (very tall) → artifact (square) */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
              <Box sx={{ ...hoverCard, height: { xs: '240px', md: '410px' } }}>
                <Image
                  src={content.images[0]}
                  alt={content.categories[0].title}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </Box>
              <Box sx={{ ...hoverCard, height: { xs: '150px', md: '275px' } }}>
                <Image
                  src={content.images[2]}
                  alt={content.categories[2].title}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </Box>
            </Box>

            {/* Right column: painting (medium) → crystal (tall) */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
              <Box sx={{ ...hoverCard, height: { xs: '170px', md: '310px' } }}>
                <Image
                  src={content.images[1]}
                  alt={content.categories[1].title}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </Box>
              <Box sx={{ ...hoverCard, height: { xs: '220px', md: '375px' } }}>
                <Image
                  src={content.images[3]}
                  alt={content.categories[2].title}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </Box>
            </Box>

          </Box>
        </Box>

      </Container>
    </Box>
  );
}
