'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import type { HeroContent } from '@/lib/content';
import ArrowButton from '@/components/ui/ArrowButton';

export default function HeroSection({ content }: { content: HeroContent }) {
  const [current, setCurrent] = useState(0);

  const total = content.carousel.length;
  const getPrev = () => (current - 1 + total) % total;
  const getNext = () => (current + 1) % total;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 3500);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <Box
      sx={{
        background: '#ffffff',
        position: 'relative',
        pt: { xs: 10, md: 14 },
        pb: { xs: 0, md: 0 },
        overflow: 'hidden',
      }}
    >
      {/* Gradient blob from design spec */}
      <Box
        sx={{
          position: 'absolute',
          top: '267px',
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
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 }, position: 'relative', zIndex: 1 }}>

        {/* Top label */}
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

        {/* Headline line 1 */}
        <Typography
          component="h1"
          sx={{
            textAlign: 'center',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 500,
            fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4.4rem', lg: '70px' },
            lineHeight: 1.04,
            color: '#FB8200',
            letterSpacing: '-0.03em',
          }}
        >
          {content.headline_line1}
        </Typography>

        {/* Headline line 2 — blue */}
        <Typography
          component="h1"
          sx={{
            textAlign: 'center',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 500,
            fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4.4rem', lg: '70px' },
            lineHeight: 1.04,
            color: '#037DC8',
            letterSpacing: '-0.03em',
            mb: { xs: 2, md: 3 },
          }}
        >
          {content.headline_line2}
        </Typography>

        {/* Sub-copy */}
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

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 5, md: 7 } }}>
          <ArrowButton
            label={content.button_text}
            onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}
          />
        </Box>

        {/* Carousel */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 220, sm: 300, md: 400, lg: 460 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {content.carousel.map((img, i) => {
            const isCenter = i === current;
            const isPrev = i === getPrev();
            const isNext = i === getNext();

            if (!isCenter && !isPrev && !isNext) return null;

            let translateX = '0%';
            let scale = 1;
            let opacity = 1;
            let zIndex = 2;

            if (isPrev) {
              translateX = '-62%';
              scale = 0.82;
              opacity = 0.65;
              zIndex = 1;
            }
            if (isNext) {
              translateX = '62%';
              scale = 0.82;
              opacity = 0.65;
              zIndex = 1;
            }

            return (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  transform: `translateX(${translateX}) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: 'transform 0.6s ease, opacity 0.6s ease',
                  borderRadius: { xs: '12px', md: '16px' },
                  overflow: 'hidden',
                  width: { xs: 260, sm: 380, md: 520, lg: 600 },
                  height: { xs: 180, sm: 260, md: 360, lg: 420 },
                  bgcolor: '#FAFAFA',
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={isCenter}
                />
              </Box>
            );
          })}
        </Box>

      </Container>
    </Box>
  );
}
