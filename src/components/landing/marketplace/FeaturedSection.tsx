'use client';

import { useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import { Archivo } from 'next/font/google';
import ArrowButton from '@/components/ui/ArrowButton';
import type { FeaturedContent } from '@/lib/content';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
});

const TABS = ['All Assets', 'Artifacts', 'Real Estate', 'Minerals'];

export default function FeaturedSection({ content }: { content: FeaturedContent }) {
  const [activeTab, setActiveTab] = useState('All Assets');

  const filtered =
    activeTab === 'All Assets'
      ? content.items
      : content.items.filter((item) => item.category === activeTab);

  return (
    <Box sx={{ background: '#ffffff', width: '100%', py: { xs: 8, md: 12 } }}>
      <Container
        maxWidth={false}
        sx={{ maxWidth: '1440px', px: { xs: 2, sm: 4, md: 6 } }}
      >
        {/* Title + Subtitle */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            maxWidth: '907px',
            mx: 'auto',
            mb: { xs: 5, md: 7 },
          }}
        >
          <Typography
            component="h2"
            className={archivo.className}
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '48px' },
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#0A0A0A',
            }}
          >
            {content.title}
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: { xs: '16px', sm: '18px', md: '24px' },
              lineHeight: '100%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#737373',
              maxWidth: '907px',
            }}
          >
            {content.subtitle}
          </Typography>
        </Box>

        {/* Filter Tabs */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: '24px', sm: '40px', md: '56px' },
            mb: { xs: 4, md: 6 },
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          {TABS.map((tab) => (
            <Box
              key={tab}
              onClick={() => setActiveTab(tab)}
              sx={{
                cursor: 'pointer',
                pb: '12px',
                mb: '-1px',
                borderBottom: activeTab === tab ? '3px solid #0EA5E9' : '3px solid transparent',
                transition: 'border-color 0.2s ease',
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  fontSize: { xs: '14px', md: '16px' },
                  lineHeight: '100%',
                  color: activeTab === tab ? '#000000' : '#737373',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease',
                }}
              >
                {tab}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Card Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: '20px', sm: '28px', md: '45px' },
            maxWidth: '1119px',
            mx: 'auto',
            mb: { xs: 6, md: '72px' },
          }}
        >
          {filtered.map((item) => (
            <Box
              key={item.title}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                cursor: 'pointer',
                '&:hover .card-image': {
                  transform: 'scale(1.03)',
                },
              }}
            >
              {/* Bare image — no background, no border, no radius, no shadow */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '234 / 360',
                }}
              >
                <Box
                  className="card-image"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover', display: 'block' }}
                    unoptimized
                  />
                </Box>

                {/* Frosted-glass pill */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: '40px', sm: '55px' },
                    left: { xs: '5%', sm: '10%' },
                    right: { xs: '5%', sm: '10%' },
                    height: { xs: '36px', sm: '41.76px' },
                    borderRadius: { xs: '5px', sm: '6.79px' },
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    display: 'flex',
                    alignItems: 'center',
                    px: { xs: '14px', sm: '10px' },
                    gap: { xs: '6px', sm: '12px' },
                    zIndex: 1,
                  }}
                >
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: '2px', sm: '3px' } }}>
                    <Typography
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: '7px', sm: '6.79px' },
                        lineHeight: '100%',
                        color: '#ffffff',
                      }}
                    >
                      Current Bid
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 700,
                        fontSize: { xs: '6.5px', sm: '9.05px' },
                        lineHeight: '100%',
                        color: '#ffffff',
                      }}
                    >
                      {item.current_bid}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: '1px', sm: '3px' }, alignItems: 'flex-end' }}>
                    <Typography
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: '7px', sm: '6.79px' },
                        lineHeight: '100%',
                        color: '#ffffff',
                      }}
                    >
                      Ends in
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 700,
                        fontSize: { xs: '6.5px', sm: '9.05px' },
                        lineHeight: '100%',
                        color: '#ffffff',
                      }}
                    >
                      {item.ends_in}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Title */}
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  fontSize: '18.36px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: '#0A0A0A',
                  textAlign: 'center',
                }}
              >
                {item.title}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Explore More button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ArrowButton
            label={content.button_text}
            onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}
          />
        </Box>
      </Container>
    </Box>
  );
}