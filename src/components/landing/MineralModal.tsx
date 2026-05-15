'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { keyframes } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';

const backdropFade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const modalEnter = keyframes`
  from { opacity: 0; transform: scale(0.93) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

const floatBlob = keyframes`
  0%   { transform: translate(0%,   0%)   scale(1);    }
  20%  { transform: translate(18%,  -22%) scale(1.1);  }
  40%  { transform: translate(35%,  8%)   scale(0.95); }
  60%  { transform: translate(20%,  28%)  scale(1.07); }
  80%  { transform: translate(-10%, 15%)  scale(0.98); }
  100% { transform: translate(0%,   0%)   scale(1);    }
`;

interface MineralModalProps {
  open: boolean;
  onClose: () => void;
}

export default function MineralModal({ open, onClose }: MineralModalProps) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        px: { xs: 2, sm: 4, md: 6 },
        animation: `${backdropFade} 0.3s ease forwards`,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: '16px', sm: '24px', md: '32px' },
          background: 'linear-gradient(135deg, #f0fdf8 0%, #d8f8ec 35%, #c0f2e0 65%, #a8ebd4 100%)',
          border: '1.5px solid #96dfc4',
          px: { xs: 3, sm: 5, md: 8, lg: 10 },
          py: { xs: 7, sm: 8, md: 10 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '800px',
          width: '100%',
          animation: `${modalEnter} 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
        }}
      >
        {/* Animated green glow blob */}
        <Box
          sx={{
            position: 'absolute',
            width: { xs: '220px', sm: '280px', md: '380px' },
            height: { xs: '220px', sm: '280px', md: '380px' },
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(52,211,153,0.45) 0%, rgba(16,185,129,0.2) 50%, transparent 70%)',
            filter: { xs: 'blur(36px)', md: 'blur(56px)' },
            animation: `${floatBlob} 12s ease-in-out infinite`,
            top: '-10%',
            left: '25%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Close button */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            color: '#0A0A0A',
            opacity: 0.45,
            fontSize: '1rem',
            '&:hover': { opacity: 1, bgcolor: 'rgba(0,0,0,0.06)' },
          }}
        >
          ✕
        </IconButton>

        {/* Title */}
        <Typography
          component="h2"
          sx={{
            position: 'relative',
            zIndex: 1,
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 600,
            fontSize: { xs: '1.8rem', sm: '2.4rem', md: '48px' },
            lineHeight: 1,
            letterSpacing: 0,
            color: 'rgba(10, 10, 10, 1)',
            textAlign: 'center',
            mb: { xs: 3, md: 4.5 },
          }}
        >
          Mineral Asset Opportunities
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            position: 'relative',
            zIndex: 1,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '20px' },
            lineHeight: 1.5,
            letterSpacing: 0,
            color: 'rgba(115, 115, 115, 1)',
            textAlign: 'center',
            maxWidth: '850px',
            mb: { xs: 4, md: 5 },
          }}
        >
          LinkBlock Assets is expanding access to digitally structured mineral and natural resource
          ownership opportunities. Join today to explore active opportunities across museum artifacts
          and premium real estate while receiving early access updates for future mineral asset
          offerings.
        </Typography>

        {/* Button */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
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
            Explore Current Opportunities
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
