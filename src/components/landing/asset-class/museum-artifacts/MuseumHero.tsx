'use client';

import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import type { MuseumHeroContent } from '@/lib/content';
import ArrowButton from '@/components/ui/ArrowButton';
import OutlineButton from '@/components/ui/OutlineButton';

export default function MuseumHero({ content }: { content: MuseumHeroContent }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', overflow: 'hidden' }}>

      {/* Top content — title, subtitle, buttons */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1400px',
          px: { xs: 2, sm: 4, md: 6 },
          pt: { xs: 12, md: 16 },
          pb: 0,
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 700,
            fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem', lg: '52px' },
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#0A0A0A',
            mb: { xs: 2, md: 2.5 },
          }}
        >
          {content.title}
        </Typography>

        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: 1.6,
            color: '#374151',
            maxWidth: 520,
            mx: 'auto',
            mb: { xs: 3.5, md: 4 },
          }}
        >
          {content.subheading}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
            mb: 0,
          }}
        >
          <ArrowButton
            label={content.button_primary}
            onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}
          />
          <OutlineButton
            label={content.button_secondary}
            onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}
          />
        </Box>
      </Container>

      {/* Full-width image with white vignette from all edges */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '380px', sm: '460px', md: '560px', lg: '620px' },
          mt: { xs: '-100px', md: '-140px' },
        }}
      >
        <Image
          src={content.image}
          alt="Museum gallery"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
          unoptimized
        />

        {/* Left fade */}
        <Box
          sx={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: '35%',
            background: 'linear-gradient(to right, #ffffff 0%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        {/* Right fade */}
        <Box
          sx={{
            position: 'absolute',
            right: 0, top: 0, bottom: 0,
            width: '35%',
            background: 'linear-gradient(to left, #ffffff 0%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        {/* Top fade */}
        <Box
          sx={{
            position: 'absolute',
            left: 0, right: 0, top: 0,
            height: '15%',
            background: 'linear-gradient(to bottom, #ffffff 0%, #ffffff 35%, rgba(255,255,255,0.7) 55%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        {/* Bottom fade */}
        <Box
          sx={{
            position: 'absolute',
            left: 0, right: 0, bottom: 0,
            height: '45%',
            background: 'linear-gradient(to top, #ffffff 0%, #ffffff 20%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      </Box>

    </Box>
  );
}
