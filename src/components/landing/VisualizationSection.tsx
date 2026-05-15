'use client';

import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import { keyframes } from '@emotion/react';


// Asset images data
const ASSETS = [
  { src: '/landing/visualization/asset-1.png', alt: 'Mineral rock' },
  { src: '/landing/visualization/asset-2.png', alt: 'Sculpture' },
  { src: '/landing/visualization/asset-3.png', alt: 'Real estate' },
  { src: '/landing/visualization/asset-4.png', alt: 'Blue crystal' },
  { src: '/landing/visualization/asset-5.png', alt: 'Marble bust' },
  { src: '/landing/visualization/asset-6.png', alt: 'Asset' },
];

// Rotation animations
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

// Orbit duration
const ORBIT_DURATION = 24;
// Distance from center (percentage)
const ORBIT_RADIUS_PCT = 38;

// Calculate 6 positions evenly spaced on the circle (starting from 12 o'clock)
const calculatePositions = () => {
  const positions = [];
  for (let i = 0; i < ASSETS.length; i++) {
    // Start from top (12 o'clock) and go clockwise
    const angle = (i * 2 * Math.PI) / ASSETS.length - Math.PI / 2;
    positions.push({
      x: 50 + ORBIT_RADIUS_PCT * Math.cos(angle),
      y: 50 + ORBIT_RADIUS_PCT * Math.sin(angle),
    });
  }
  return positions;
};

const positions = calculatePositions();

export default function VisualizationSection() {
  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        py: { xs: 4, md: 6, lg: 8 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1400px',
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            borderRadius: { xs: '20px', md: '28px', lg: '32px' },
            background: 'linear-gradient(135deg, #E8F0FE 0%, #DCE8F5 50%, #E4EDF9 100%)',
            pt: { xs: 4, sm: 5, md: 6, lg: 6 },
            pb: { xs: 3, sm: 4, md: 5, lg: 5 },
            px: { xs: 3, sm: 5, md: 7, lg: 8 },
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Title */}
          <Typography
            component="h2"
            sx={{
              textAlign: 'center',
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 600,
              fontSize: {
                xs: '2rem',
                sm: '2.5rem',
                md: '3.2rem',
              },
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
            Intelligent Asset Visualization
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              textAlign: 'center',
              color: '#000000',

              maxWidth: '680px',
              mx: 'auto',

              fontSize: {
                xs: '15px',
                sm: '16px',
                md: '18px',
              },

              lineHeight: 1.45,
              fontWeight: 400,

              px: { xs: 2, sm: 0 },

              mb: {
                xs: 5,
                md: 7,
              },

              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

              position: 'relative',
              zIndex: 10,
            }}
          >
            Every asset on LinkBlock Assets is enhanced through AI powered
            visualization and intelligent presentation technology designed to
            improve clarity, engagement and investor confidence.
          </Typography>

          {/* Semi-circle visual container - positioned below the text */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '240px', sm: '300px', md: '360px', lg: '420px', xl: '480px' },
              overflow: 'hidden',
              mt: { xs: -3, sm: -4, md: -5 },
            }}
          >
            {/* 
              Circle positioned so its CENTER is at the TOP edge of this container
              This creates a semi-circle effect where only the BOTTOM half is visible
            */}
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '0%',
                transform: 'translateX(-50%)',
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

                {/* Glow effect behind center logo */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
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
                    top: '50%',
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
                    src="/landing/Frame 2147225010.svg"
                    alt="LinkBlock Assets Logo"
                    width={140}
                    height={140}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
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
                    marginLeft: {
                      xs: '-210px',
                      sm: '-270px',
                      md: '-350px',
                      lg: '-430px',
                      xl: '-500px',
                    },
                    marginTop: {
                      xs: '-210px',
                      sm: '-270px',
                      md: '-350px',
                      lg: '-430px',
                      xl: '-500px',
                    },
                    animation: `${spinCW} ${ORBIT_DURATION}s linear infinite`,
                    zIndex: 5,
                  }}
                >
                  {/* Asset images on the orbit */}
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
                          width: { xs: '55px', sm: '70px', md: '85px', lg: '100px', xl: '115px' },
                          height: { xs: '55px', sm: '70px', md: '85px', lg: '100px', xl: '115px' },
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
                          src={ASSETS[i].src}
                          alt={ASSETS[i].alt}
                          fill
                          sizes="(max-width: 640px) 55px, (max-width: 768px) 70px, (max-width: 1024px) 85px, (max-width: 1280px) 100px, 115px"
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

            {/* Top fade gradient - smooth transition from text to semi-circle */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: { xs: '40px', sm: '50px', md: '60px', lg: '70px' },
                background: 'linear-gradient(to bottom, rgba(220, 232, 245, 0.98) 0%, rgba(220, 232, 245, 0.6) 40%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 15,
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}