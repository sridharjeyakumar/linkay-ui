'use client';

import { useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import type { RECtaContent } from '@/lib/content';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600'], display: 'swap' });

const openRegister = () =>
  window.dispatchEvent(new CustomEvent('linkay:open-register'));

export default function RECta({ content }: { content: RECtaContent }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 8 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: '16px', sm: '24px', md: '32px' },
          border: '2px solid #ABE2FB',
          background: 'linear-gradient(90deg, #0EA5E9 -10%, #C2FFFB 50%, #0EA5E9 115%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, sm: 5, md: 8, lg: 10 },
          py: { xs: 7, sm: 8, md: 10 },
          boxShadow: 'inset 0 0 40px rgba(83, 181, 246, 0.25)',
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 600,
            fontSize: '48px',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: '#0A0A0A',
            textAlign: 'center',
            mb: { xs: 3.5, md: 4.5 },
          }}
        >
          {content.cta_title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: '16px',
            flexShrink: 0,
          }}
        >
          <Button
            onClick={openRegister}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            startIcon={
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#FAFAFA',
                  borderRadius: '50%',
                  width: { xs: 28, md: 32 },
                  height: { xs: 28, md: 32 },
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/landing/arrow-default.svg"
                  alt="arrow"
                  width={18}
                  height={18}
                  unoptimized
                  style={{
                    position: 'absolute',
                    opacity: hovered ? 0 : 1,
                    transform: hovered ? 'scale(0.6)' : 'scale(1)',
                    transition: 'opacity 0.15s ease, transform 0.15s ease',
                  }}
                />
                <Image
                  src="/landing/arrow-hover.svg"
                  alt="arrow"
                  width={18}
                  height={18}
                  unoptimized
                  style={{
                    position: 'absolute',
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? 'scale(1)' : 'scale(0.6)',
                    transition: 'opacity 0.15s ease, transform 0.15s ease',
                  }}
                />
              </Box>
            }
            sx={{
              bgcolor: '#0A0A0A',
              color: '#FAFAFA',
              borderRadius: '50px',
              px: { xs: '20px', md: '24px' },
              py: { xs: '10px', md: '12px' },
              fontWeight: 600,
              fontSize: { xs: '14px', md: '15px' },
              fontFamily: inter.style.fontFamily,
              textTransform: 'none',
              boxShadow: 'none',
              whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#1a1a1a', boxShadow: '0 6px 20px rgba(0,0,0,0.22)' },
              transition: 'all 0.2s ease',
            }}
          >
            {content.cta_button_primary}
          </Button>

          <Button
            onClick={openRegister}
            variant="outlined"
            sx={{
              borderRadius: '50px',
              px: { xs: '20px', md: '24px' },
              py: { xs: '10px', md: '12px' },
              fontWeight: 600,
              fontSize: { xs: '14px', md: '15px' },
              fontFamily: inter.style.fontFamily,
              textTransform: 'none',
              borderColor: '#0A0A0A',
              color: '#0A0A0A',
              bgcolor: 'transparent',
              whiteSpace: 'nowrap',
              '&:hover': { borderColor: '#0A0A0A', bgcolor: '#0A0A0A', color: '#ffffff' },
              transition: 'all 0.2s ease',
            }}
          >
            {content.cta_button_secondary}
          </Button>
        </Box>
      </Box>
      </Container>
    </Box>
  );
}
