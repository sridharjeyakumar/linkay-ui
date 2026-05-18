'use client';

import { useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Plus_Jakarta_Sans, Archivo, Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowsLeftRight, TreeStructure, CoinsIcon, SealCheckIcon, CirclesThreeIcon } from '@phosphor-icons/react';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

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

export default function HeaderSection() {
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <Box
      sx={{
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* ── Gradient blur backdrop (Rectangle 7056) ──
           Figma specs:
           width: 1614.59px, height: 296px
           top: 217px, left: -99.72px
           angle: 7.52deg, opacity: 0.4
           background: linear-gradient(171.31deg, ...)
           backdrop-filter: blur(126px)
      ── */}
      <Box
        sx={{
          position: 'absolute',
          top: '211px',
          left: '-95.72px',
          width: '1614.59px',
          height: '276px',
          background: `linear-gradient(171.31deg, #1E40AF 28.61%, #1E40AF 38.87%, #42B9EE 39.69%, #0EA5E9 92.67%)`,
          filter: 'blur(126px)',
          transform: 'rotate(7.52deg)',
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ══════════════════════════════════════════════
          HERO / HEADER SECTION
      ══════════════════════════════════════════════ */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1400px',
          px: { xs: 2, sm: 4, md: 6 },
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 15, md: 18 },
          pb: { xs: 6, md: 10 },
        }}
      >
        {/* ── Heading ── */}
        <Typography
          component="h1"
          className={plusJakarta.className}
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.6rem', md: '50px' },
            lineHeight: 1.28,
            letterSpacing: '-0.02em',
            color: '#000000',
            maxWidth: '1000px',
            mx: 'auto',
            mb: { xs: 2, md: 3 },
          }}
        >
          Transform Real-World Assets Into Digital Ownership Opportunities
        </Typography>

        {/* ── Subtitle ── */}
        <Typography
          sx={{
            textAlign: 'center',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '147%',
            letterSpacing: '-0.03em',
            color: '#000000',
            maxWidth: '642px',
            mx: 'auto',
            mb: { xs: 3, md: 4 },
          }}
        >
          Tokenize premium assets through a structured marketplace designed for
          accessibility, liquidity and secure ownership participation.
        </Typography>

        {/* ── CTA Button ── */}
        <Box
          component={Link}
          href="/tokenize"
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            bgcolor: '#0A0A0A',
            borderRadius: '30px',
            pl: '13px',
            pr: '16px',
            py: '6px',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            '&:hover': {
              bgcolor: '#1a1a1a',
              boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
            },
          }}
        >
          

          {/* Arrow circle */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#FAFAFA',
              borderRadius: '14px',
              width: 28,
              height: 28,
              padding: '2px',
              flexShrink: 0,
              position: 'relative',
              transform: 'rotate(-48.72deg)',
            }}
          >
            {/* Default arrow */}
            <Image
              src="/landing/arrow-default.svg"
              alt="arrow"
              width={24}
              height={24}
              unoptimized
              style={{
                position: 'absolute',
                opacity: btnHovered ? 0 : 1,
                transform: `rotate(41.28deg) ${btnHovered ? 'scale(0.6)' : 'scale(1)'}`,
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
            />
            {/* Hover arrow */}
            <Image
              src="/landing/arrow-hover.svg"
              alt="arrow"
              width={24}
              height={24}
              unoptimized
              style={{
                position: 'absolute',
                opacity: btnHovered ? 1 : 0,
                transform: `rotate(41.28deg) ${btnHovered ? 'scale(1)' : 'scale(0.6)'}`,
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
            />
          </Box>

          {/* Button label */}
          <Typography
            component="span"
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
            }}
          >
            Tokenize an Asset
          </Typography>
        </Box>
      </Container>

      {/* ══════════════════════════════════════════════
          WHY TOKENIZATION SECTION
          (merged from WhyTokenization component)
      ══════════════════════════════════════════════ */}
      <Box
        sx={{
          maxWidth: '1440px',
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
          px: { xs: '20px', md: '0' },
        }}
      >
        {/* ── Header Block – centered, width 1036 ── */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1036px',
            mx: 'auto',
            pt: { xs: '80px', md: '65px' },
            mt: { xs: '60px', md: '85px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          {/* WHY TOKENIZATION tag */}
          <Typography
            className={archivo.className}
            sx={{
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: '14px',
              lineHeight: '147%',
              letterSpacing: '-0.03em',
              textAlign: 'center',
              color: '#000000',
              textTransform: 'uppercase',
            }}
          >
            WHY TOKENIZATION
          </Typography>

          {/* Main heading */}
          <Typography
            component="h2"
            className={archivo.className}
            sx={{
              fontWeight: 600,
              fontSize: { xs: '32px', sm: '40px', md: '48px' },
              lineHeight: '100%',
              letterSpacing: '-0.03em',
              textAlign: 'center',
              color: '#0A0A0A',
            }}
          >
            Unlock New Value Through Asset Tokenization
          </Typography>
        </Box>

        {/* ── Content Area – Cards LEFT + ETH RIGHT ── */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'space-between',
            mt: { xs: '40px', md: '82px' },
            pb: { xs: '60px', md: '82px' },
            px: { xs: '0', md: '122px' },
            position: 'relative',
          }}
        >
          {/* ── LEFT: Stacked feature cards ── */}
          <Box
            sx={{
              width: { xs: '100%', md: '436px' },
              maxWidth: '436px',
              height: { xs: 'auto', md: '466px' },
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Card 1 — Increased Accessibility */}
            <Box
              sx={{
                width: '100%',
                borderRadius: '20px',
                p: '30px',
                display: 'flex',
                flexDirection: 'row',
                gap: '33px',
                alignItems: 'flex-start',
              }}
            >
              {/* Icon box */}
              <Box
                sx={{
                  width: 84,
                  minWidth: 84,
                  height: 84,
                  borderRadius: '10px',
                  border: '1px solid #1E40AF',
                  bgcolor: '#1E40AF1A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SealCheckIcon size={32} color="#1E40AF" weight="regular" />
              </Box>

              {/* Text content */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  width: 280,
                }}
              >
                <Typography
                  className={archivo.className}
                  sx={{
                    fontWeight: 500,
                    fontSize: '24px',
                    lineHeight: '100%',
                    letterSpacing: '-0.03em',
                    color: '#0A0A0A',
                  }}
                >
                  Increased Accessibility
                </Typography>
                <Typography
                  className={inter.className}
                  sx={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '145%',
                    letterSpacing: '-0.03em',
                    color: '#737373',
                  }}
                >
                  Enable broader participation through fractional ownership opportunities.
                </Typography>
              </Box>
            </Box>

            {/* Card 2 — Enhanced Liquidity */}
            <Box
              sx={{
                width: '100%',
                borderRadius: '20px',
                p: '30px',
                display: 'flex',
                flexDirection: 'row',
                gap: '33px',
                alignItems: 'flex-start',
              }}
            >
              {/* Icon box */}
              <Box
                sx={{
                  width: 84,
                  minWidth: 84,
                  height: 84,
                  borderRadius: '10px',
                  border: '1px solid #1E40AF',
                  bgcolor: '#1E40AF1A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CoinsIcon size={32} color="#1E40AF" weight="regular" />
              </Box>

              {/* Text content */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  width: 280,
                }}
              >
                <Typography
                  className={archivo.className}
                  sx={{
                    fontWeight: 500,
                    fontSize: '24px',
                    lineHeight: '100%',
                    letterSpacing: '-0.03em',
                    color: '#0A0A0A',
                  }}
                >
                  Enhanced Liquidity
                </Typography>
                <Typography
                  className={inter.className}
                  sx={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '145%',
                    letterSpacing: '0%',
                    color: '#737373',
                  }}
                >
                  Create marketplace activity around traditionally illiquid assets.
                </Typography>
              </Box>
            </Box>

            {/* Card 3 — Structured Ownership */}
            <Box
              sx={{
                width: '100%',
                borderRadius: '20px',
                p: '30px',
                display: 'flex',
                flexDirection: 'row',
                gap: '33px',
                alignItems: 'flex-start',
              }}
            >
              {/* Icon box */}
              <Box
                sx={{
                  width: 84,
                  minWidth: 84,
                  height: 84,
                  borderRadius: '10px',
                  border: '1px solid #1E40AF',
                  bgcolor: '#1E40AF1A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CirclesThreeIcon size={32} color="#1E40AF" weight="regular" />
              </Box>

              {/* Text content */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  width: 280,
                }}
              >
                <Typography
                  className={archivo.className}
                  sx={{
                    fontWeight: 500,
                    fontSize: '24px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    color: '#0A0A0A',
                  }}
                >
                  Structured Ownership
                </Typography>
                <Typography
                  className={inter.className}
                  sx={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '145%',
                    letterSpacing: '0%',
                    color: '#737373',
                  }}
                >
                  Digitally organize and manage ownership participation with transparency.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ── RIGHT: Floating ETH Image ── */}
          <Box
            sx={{
              width: { xs: '280px', md: '398px' },
              height: { xs: '275px', md: '391px' },
              position: 'relative',
              flexShrink: 0,
              mt: { xs: '40px', md: 2 },

              // Smooth floating animation
              animation: 'ethFloat 6s ease-in-out infinite',

              '@keyframes ethFloat': {
                '0%': {
                  transform: 'translateY(0px)',
                },
                '50%': {
                  transform: 'translateY(-30px)',
                },
                '100%': {
                  transform: 'translateY(0px)',
                },
              },
            }}
          >
            <Image
              src="/ETH.svg"
              alt="Ethereum"
              fill
              style={{
                objectFit: 'contain',
              }}
              priority
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
