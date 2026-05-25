'use client';

import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import { keyframes } from '@emotion/react';
import type { VisualizationContent } from '@/lib/content';

const spinCW = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const spinCCW = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
`;

const pulseGlow = keyframes`
  0% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.95); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.08); }
  100% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.95); }
`;

const ORBIT_DURATION = 24;
const ORBIT_RADIUS_PCT = 30;

const calculatePositions = (count: number) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
    positions.push({
      x: 50 + ORBIT_RADIUS_PCT * Math.cos(angle),
      y: 50 + ORBIT_RADIUS_PCT * Math.sin(angle),
    });
  }
  return positions;
};

export default function VisualizationSection({ content }: { content: VisualizationContent }) {
  const positions = calculatePositions(content.assets.length);

  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 4, md: 6, lg: 8 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
        <Box
          sx={{
            borderRadius: { xs: '20px', md: '28px', lg: '32px' },
            background: 'linear-gradient(135deg, #E8F0FE 0%, #DCE8F5 50%, #E4EDF9 100%)',
            pt: { xs: 4, sm: 5, md: 6, lg: 6 },
            pb: { xs: 3, sm: 4, md: 5, lg: 0 },
            px: { xs: 3, sm: 5, md: 7, lg: 8 },
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Typography
            component="h2"
            sx={{
              textAlign: 'center',
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' },
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #009FD9 0%, #1E40AF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              position: 'relative',
              zIndex: 10,
            }}
          >
            {content.title}
          </Typography>

          <Typography
            sx={{
              textAlign: 'center',
              color: '#000000',
              maxWidth: '680px',
              mx: 'auto',
              fontSize: { xs: '15px', sm: '16px', md: '18px' },
              lineHeight: 1.45,
              fontWeight: 400,
              px: { xs: 2, sm: 0 },
              mb: { xs: 5, md: 7 },
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              position: 'relative',
              zIndex: 10,
            }}
          >
            {content.description}
          </Typography>

          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '240px', sm: '300px', md: '360px', lg: '420px', xl: '480px' },
              overflow: 'hidden',
              mt: { xs: -3, sm: -4, md: -5 },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '90%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '420px', sm: '540px', md: '700px', lg: '860px', xl: '1000px' },
                height: { xs: '420px', sm: '540px', md: '700px', lg: '860px', xl: '1000px' },
                pointerEvents: 'none',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                {/* Outer dashed circle */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '240px', sm: '300px', md: '380px', lg: '460px', xl: '540px' },
                    height: { xs: '240px', sm: '300px', md: '380px', lg: '460px', xl: '540px' },
                    borderRadius: '50%',
                    border: '2px dashed rgba(26, 95, 205, 0.35)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Glow effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '45%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '120px', sm: '150px', md: '180px', lg: '220px', xl: '260px' },
                    height: { xs: '120px', sm: '150px', md: '180px', lg: '220px', xl: '260px' },
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.15) 40%, transparent 70%)',
                    animation: `${pulseGlow} 3s ease-in-out infinite`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Center Logo */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '45%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '65px', sm: '80px', md: '100px', lg: '120px', xl: '140px' },
                    height: { xs: '65px', sm: '80px', md: '100px', lg: '120px', xl: '140px' },
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                  }}
                >
                  <Image
                    src="/landing/LinkBlock Assets Logo.svg"
                    alt="LinkBlock Assets Logo"
                    width={140}
                    height={140}
                    style={{ width: '50%', height: '50%', objectFit: 'contain' }}
                    priority
                    unoptimized
                  />
                </Box>

                {/* Rotating orbit ring */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: { xs: '420px', sm: '540px', md: '700px', lg: '860px', xl: '1000px' },
                    height: { xs: '420px', sm: '540px', md: '700px', lg: '860px', xl: '1000px' },
                    marginLeft: { xs: '-210px', sm: '-270px', md: '-350px', lg: '-430px', xl: '-500px' },
                    marginTop: { xs: '-210px', sm: '-270px', md: '-350px', lg: '-430px', xl: '-500px' },
                    animation: `${spinCW} ${ORBIT_DURATION}s linear infinite`,
                    zIndex: 5,
                  }}
                >
                  {positions.map((pos, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 6,
                      }}
                    >
                      <Box
                        sx={{
                          animation: `${spinCCW} ${ORBIT_DURATION}s linear infinite`,
                          width: { xs: '90px', sm: '115px', md: '140px', lg: '165px', xl: '190px' },
                          height: { xs: '90px', sm: '115px', md: '140px', lg: '165px', xl: '190px' },
                          position: 'relative',
                          filter: 'drop-shadow(0 6px 15px rgba(0, 0, 0, 0.1))',
                          transition: 'transform 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            filter: 'drop-shadow(0 10px 22px rgba(0, 0, 0, 0.18))',
                          },
                        }}
                      >
                        <Image
                          src={content.assets[i].src}
                          alt={content.assets[i].alt}
                          fill
                          sizes="(max-width: 640px) 90px, (max-width: 768px) 115px, (max-width: 1024px) 140px, (max-width: 1280px) 165px, 190px"
                          style={{ objectFit: 'contain' }}
                          priority={i < 3}
                          unoptimized
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
