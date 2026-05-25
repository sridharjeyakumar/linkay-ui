'use client';

import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';

import { Archivo, Inter } from 'next/font/google';
import type { REFeaturedContent } from '@/lib/content';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

/* ETH ICON */
function EthIcon() {
  return (
    <svg
      width="11"
      height="18"
      viewBox="0 0 14 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 0L0.5 11.2L7 14.8L13.5 11.2L7 0Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M0.5 11.2L7 14.8L13.5 11.2L7 22L0.5 11.2Z"
        fill="white"
        fillOpacity="0.6"
      />
    </svg>
  );
}

export default function REFeatured({
  content,
}: {
  content: REFeaturedContent;
}) {
  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        bgcolor: '#FFFFFF',
        py: { xs: '70px', md: '110px' },
      }}
    >
      <Container maxWidth="xl">
        {/* SECTION TITLE */}
        <Typography
          component="h2"
          className={archivo.className}
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            color: '#101828',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            fontSize: {
              xs: '2rem',
              md: '3rem',
            },
            mb: {
              xs: 6,
              md: 8,
            },
          }}
        >
          {content.title}
        </Typography>

        {/* CARDS ROW */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '28px',
            flexWrap: {
              xs: 'wrap',
              lg: 'nowrap',
            },
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
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              {/* IMAGE CARD */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '56vw', sm: '320px', md: '420px' },
                  overflow: 'hidden',
                  borderRadius: '22px',
                  boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
                  background: '#E5E7EB',
                }}
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  unoptimized
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                />

                {/* IMAGE OVERLAY */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(0,0,0,0.34), rgba(0,0,0,0.02))',
                  }}
                />

                {/* GLASS BID BAR */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '16px',
                    right: '16px',
                    bottom: '16px',
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
                  {/* LEFT */}
                  <Box>
                    <Typography
                      className={inter.className}
                      sx={{
                        color: 'rgba(255,255,255,0.72)',
                        fontSize: '11px',
                        fontWeight: 400,
                        lineHeight: 1,
                        mb: '6px',
                      }}
                    >
                      Current Bid
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <EthIcon />

                      <Typography
                        className={inter.className}
                        sx={{
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '15px',
                          lineHeight: 1,
                        }}
                      >
                        0.85 ETH
                      </Typography>
                    </Box>
                  </Box>

                  {/* DIVIDER */}
                  <Box
                    sx={{
                      width: '1px',
                      height: '28px',
                      background: 'rgba(255,255,255,0.22)',
                    }}
                  />

                  {/* RIGHT */}
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      className={inter.className}
                      sx={{
                        color: 'rgba(255,255,255,0.72)',
                        fontSize: '11px',
                        fontWeight: 400,
                        lineHeight: 1,
                        mb: '6px',
                      }}
                    >
                      Ends in
                    </Typography>

                    <Typography
                      className={inter.className}
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 500,
                        fontSize: '15px',
                        lineHeight: 1,
                        letterSpacing: '0.01em',
                      }}
                    >
                      12h 43m 42s
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* SPACE */}
              <Box sx={{ height: '14px' }} />

              {/* BOTTOM SECTION */}
              <Box
                sx={{
                  width: '100%',
                  px: '8px',
                  py: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* PROPERTY NAME */}
                <Typography
                  className={archivo.className}
                  sx={{
                    color: '#111827',
                    fontWeight: 600,
                    fontSize: '1.05rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  {p.name}
                </Typography>

                {/* BUTTON */}
                <Box
                  component="button"
                  sx={{
                    height: '42px',
                    px: '18px',
                    border: 'none',
                    borderRadius: '999px',
                    background:
                      'linear-gradient(90deg, #FBBF24 0%, #F97316 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '7px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      opacity: 0.92,
                      transform: 'scale(1.03)',
                    },
                  }}
                >
                  {/* bid icon from JSON */}
                  <Image
                    src={p.button_icon}
                    alt="bid"
                    width={20}
                    height={20}
                    style={{ display: 'block' }}
                  />

                  <Typography
                    className={inter.className}
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '13px',
                      lineHeight: 1,
                    }}
                  >
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