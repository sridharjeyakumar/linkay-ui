'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const CAROUSEL_IMAGES = [
  { src: '/landing/carousel/slide-1.svg', alt: 'Museum artifacts' },
  { src: '/landing/carousel/slide-2.svg', alt: 'Real estate property' },
  { src: '/landing/carousel/slide-3.svg', alt: 'Minerals collection' },
  { src: '/landing/carousel/slide-4.svg', alt: 'Premium assets' },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [btnHovered, setBtnHovered] = useState(false);

  const total = CAROUSEL_IMAGES.length;
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
          Future of Asset Ownership
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
            color: '#0A0A0A',
            letterSpacing: '-0.03em',
          }}
        >
          Invest in Tokenized
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
            color: '#1a6fd4',
            letterSpacing: '-0.03em',
            mb: { xs: 2, md: 3 },
          }}
        >
          Real World Assets
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
          Access verified opportunities in museum artifacts, premium real estate and emerging
          asset classes through secure digital ownership and marketplace trading
        </Typography>

        {/* Get Started Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 5, md: 7 } }}>
          <Button
            component={Link}
            href="/register"
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            startIcon={
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#FAFAFA',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/landing/arrow-default.svg"
                  alt="arrow"
                  width={20}
                  height={20}
                  unoptimized
                  style={{
                    position: 'absolute',
                    opacity: btnHovered ? 0 : 1,
                    transform: btnHovered ? 'scale(0.6)' : 'scale(1)',
                    transition: 'opacity 0.15s ease, transform 0.15s ease',
                  }}
                />
                <Image
                  src="/landing/arrow-hover.svg"
                  alt="arrow"
                  width={20}
                  height={20}
                  unoptimized
                  style={{
                    position: 'absolute',
                    opacity: btnHovered ? 1 : 0,
                    transform: btnHovered ? 'scale(1)' : 'scale(0.6)',
                    transition: 'opacity 0.15s ease, transform 0.15s ease',
                  }}
                />
              </Box>
            }
            sx={{
              bgcolor: '#0A0A0A',
              color: '#FAFAFA',
              borderRadius: '50px',
              px: { xs: 2.5, md: 3 },
              py: { xs: 1, md: 1.2 },
              fontWeight: 600,
              fontSize: { xs: '0.9rem', md: '1rem' },
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#1a1a1a', boxShadow: '0 6px 20px rgba(0,0,0,0.25)' },
              transition: 'all 0.2s ease',
            }}
          >
            Get Started
          </Button>
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
          {CAROUSEL_IMAGES.map((img, i) => {
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
                  boxShadow: isCenter
                    ? '0 24px 64px rgba(0,0,0,0.18)'
                    : '0 8px 24px rgba(0,0,0,0.1)',
                  bgcolor: '#f5f5f5',
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
