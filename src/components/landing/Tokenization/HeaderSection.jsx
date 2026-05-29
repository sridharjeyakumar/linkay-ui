'use client';

import { Box, Typography, Container } from '@mui/material';
import { Plus_Jakarta_Sans, Archivo, Inter } from 'next/font/google';
import Image from 'next/image';
import ArrowButton from '@/components/ui/ArrowButton';
import { SealCheckIcon, CoinsIcon, CirclesThreeIcon } from '@phosphor-icons/react';

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

const FEATURE_ICONS = [SealCheckIcon, CoinsIcon, CirclesThreeIcon];

export default function HeaderSection({ content }) {
  return (
    <Box
      sx={{
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Gradient blur backdrop */}
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

      {/* HERO / HEADER SECTION */}
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
          {content.heading}
        </Typography>

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
          {content.subtitle}
        </Typography>

        <ArrowButton label={content.button_text} onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))} />
      </Container>

      {/* WHY TOKENIZATION SECTION */}
      <Box
        sx={{
          maxWidth: '1440px',
          mx: 'auto',
          position: 'relative',
          zIndex: 1,
          px: { xs: '20px', md: '0' },
        }}
      >
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
            {content.why_tag}
          </Typography>

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
            {content.why_title}
          </Typography>
        </Box>

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
          {/* LEFT: Feature cards */}
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
            {content.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
              return (
                <Box
                  key={feature.title}
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
                    <Icon size={32} color="#1E40AF" weight="regular" />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', width: 280 }}>
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
                      {feature.title}
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
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* RIGHT: Floating ETH Image */}
          <Box
            sx={{
              width: { xs: '280px', md: '398px' },
              height: { xs: '275px', md: '391px' },
              position: 'relative',
              flexShrink: 0,
              mt: { xs: '40px', md: 2 },
              animation: 'ethFloat 6s ease-in-out infinite',
              '@keyframes ethFloat': {
                '0%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-30px)' },
                '100%': { transform: 'translateY(0px)' },
              },
            }}
          >
            <Image
              src="/ETH.svg"
              alt="Ethereum"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
