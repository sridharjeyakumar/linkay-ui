'use client';

import { useState } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { keyframes } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';

const floatBlob = keyframes`
  0%   { transform: translate(0%,   0%)   scale(1);    }
  20%  { transform: translate(18%,  -22%) scale(1.1);  }
  40%  { transform: translate(35%,  8%)   scale(0.95); }
  60%  { transform: translate(20%,  28%)  scale(1.07); }
  80%  { transform: translate(-10%, 15%)  scale(0.98); }
  100% { transform: translate(0%,   0%)   scale(1);    }
`;

export default function CtaSection() {
  const [hovered, setHovered] = useState(false);

  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 8 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: '16px', sm: '24px', md: '32px' },
            background:
              'linear-gradient(135deg, #fff9f6 0%, #fff4ee 35%, #fef0e8 65%, #fde8d8 100%)',
            border: '1.5px solid #e8d8cc',
            px: { xs: 3, sm: 5, md: 8, lg: 10 },
            py: { xs: 7, sm: 8, md: 10 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Animated orange glow blob */}
          <Box
            sx={{
              position: 'absolute',
              width: { xs: '220px', sm: '280px', md: '380px' },
              height: { xs: '220px', sm: '280px', md: '380px' },
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,150,60,0.42) 0%, rgba(255,110,40,0.18) 50%, transparent 70%)',
              filter: { xs: 'blur(36px)', md: 'blur(56px)' },
              animation: `${floatBlob} 12s ease-in-out infinite`,
              top: '-10%',
              left: '25%',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Title */}
          <Typography
            component="h2"
            sx={{
              position: 'relative',
              zIndex: 1,
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: '48px',
              lineHeight: 1,
              letterSpacing: '0%',
              color: 'rgba(10, 10, 10, 1)',
              textAlign: 'center',
              mb: { xs: 3.5, md: 4.5 },
            }}
          >
            The Future of Asset Ownership
          </Typography>

          {/* Buttons */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              gap: { xs: 1.5, sm: 2 },
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* Get Started — dark pill with animated arrow */}
            <Button
              component={Link}
              href="/register"
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
                    width: { xs: 30, md: 34 },
                    height: { xs: 30, md: 34 },
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src="/landing/arrow-default.svg"
                    alt="arrow"
                    width={16}
                    height={16}
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
                    width={16}
                    height={16}
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
                px: { xs: 2.5, md: 3 },
                py: { xs: 1, md: 1.2 },
                fontWeight: 600,
                fontSize: { xs: '0.88rem', md: '0.95rem' },
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1a1a1a',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.22)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Get Started
            </Button>

            {/* List Your Asset — outline pill */}
            <Button
              component={Link}
              href="/register"
              variant="outlined"
              sx={{
                borderRadius: '50px',
                px: { xs: 2.5, md: 3 },
                py: { xs: 1, md: 1.2 },
                fontWeight: 600,
                fontSize: { xs: '0.88rem', md: '0.95rem' },
                textTransform: 'none',
                borderColor: '#d1d5db',
                color: '#111827',
                bgcolor: 'transparent',
                '&:hover': {
                  borderColor: '#0A0A0A',
                  bgcolor: '#0A0A0A',
                  color: '#ffffff',
                },
                transition: 'all 0.2s ease',
              }}
            >
              List Your Asset
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
