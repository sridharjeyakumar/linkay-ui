'use client';

import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import { Lightning } from '@phosphor-icons/react';
import type { MuseumFeaturedContent } from '@/lib/content';

function EthIcon() {
  return (
    <svg width="11" height="18" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0L0.5 11.2L7 14.8L13.5 11.2L7 0Z" fill="white" fillOpacity="0.95" />
      <path d="M0.5 11.2L7 14.8L13.5 11.2L7 22L0.5 11.2Z" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

export default function MuseumFeatured({ content }: { content: MuseumFeaturedContent }) {
  return (
    <Box component="section" sx={{ width: '100%', bgcolor: '#FFFFFF', py: { xs: '70px', md: '110px' } }}>
      <Container maxWidth="xl">
        <Typography
          component="h2"
          sx={{
            textAlign: 'center',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 700,
            color: '#101828',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            fontSize: { xs: '2rem', md: '3rem' },
            mb: { xs: 6, md: 8 },
          }}
        >
          {content.title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '28px',
            flexWrap: { xs: 'wrap', lg: 'nowrap' },
          }}
        >
          {content.properties.map((p) => (
            <Box
              key={p.name}
              sx={{
                width: '100%',
                maxWidth: '355px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-8px)' },
              }}
            >
              {/* Image card */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '420px',
                  overflow: 'hidden',
                  borderRadius: '22px',
                  boxShadow: '0 12px 40px rgba(15,23,42,0.08)',
                  background: '#E5E7EB',
                }}
              >
                <Image src={p.image} alt={p.name} fill unoptimized style={{ objectFit: 'cover', objectPosition: 'center' }} />

                {/* Overlay */}
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.34), rgba(0,0,0,0.02))' }} />

                {/* Glass bid bar */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '16px', right: '16px', bottom: '16px',
                    height: '62px',
                    borderRadius: '16px',
                    background: 'rgba(120,120,120,0.28)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: '18px',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', color: 'rgba(255,255,255,0.72)', fontSize: '11px', fontWeight: 400, lineHeight: 1, mb: '6px' }}>
                      Current Bid
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <EthIcon />
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#FFFFFF', fontWeight: 600, fontSize: '15px', lineHeight: 1 }}>
                        {p.current_bid}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.22)' }} />

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', color: 'rgba(255,255,255,0.72)', fontSize: '11px', fontWeight: 400, lineHeight: 1, mb: '6px' }}>
                      Ends in
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#FFFFFF', fontWeight: 500, fontSize: '15px', lineHeight: 1, letterSpacing: '0.01em' }}>
                      {p.ends_in}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ height: '14px' }} />

              {/* Bottom row */}
              <Box sx={{ width: '100%', px: '8px', py: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-archivo), sans-serif',
                    color: '#111827',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  {p.name}
                </Typography>

                <Box
                  component="button"
                  sx={{
                    height: '42px',
                    px: '18px',
                    border: 'none',
                    borderRadius: '999px',
                    background: 'linear-gradient(90deg, #FBBF24 0%, #F97316 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    '&:hover': { opacity: 0.92, transform: 'scale(1.03)' },
                  }}
                >
                  <Lightning size={18} color="#FFFFFF" weight="fill" />
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', color: '#FFFFFF', fontWeight: 600, fontSize: '13px', lineHeight: 1 }}>
                    {p.button_label}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
