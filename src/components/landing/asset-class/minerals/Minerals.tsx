'use client';

import { Box, Container, Typography } from '@mui/material';
import ArrowButton from '@/components/ui/ArrowButton';
import type { MineralModalContent } from '@/lib/content';

export default function Minerals({ content }: { content: MineralModalContent }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: '#ffffff',
      }}
    >
      {/* Same gradient blob as HeroSection */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '-99.72px',
          width: '1614.59px',
          height: '296px',
          background: 'linear-gradient(351.31deg, rgba(238, 64, 57, 0.6) 24.61%, rgba(244, 120, 62, 0.6) 31.87%, rgba(247, 148, 65, 0.4) 39.69%, rgba(250, 176, 67, 0.6) 92.67%)',
          filter: 'blur(80px)',
          transform: 'rotate(7.52deg)',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container
        maxWidth={false}
        sx={{
          maxWidth: '800px',
          px: { xs: 3, sm: 4, md: 6 },
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Title */}
        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
            lineHeight: 1.1,
            color: '#0A0A0A',
            letterSpacing: '-0.02em',
            mb: { xs: 2.5, md: 3 },
          }}
        >
          {content.title}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' },
            lineHeight: 1.6,
            color: '#555555',
            maxWidth: 620,
            mb: { xs: 4, md: 5 },
          }}
        >
          {content.description}
        </Typography>

        {/* Button */}
        <ArrowButton
          label={content.button_text}
          onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}
        />
      </Container>
    </Box>
  );
}
