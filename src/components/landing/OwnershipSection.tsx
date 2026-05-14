'use client';

import { Box, Typography, Container, Grid } from '@mui/material';
import Image from 'next/image';

const FEATURES = [
  {
    title: 'Asset Submission',
    description: 'Asset owners submit assets for review and tokenization.',
    icon: '/landing/ownership-icons/asset-submission.gif',
    iconFallback: '/landing/ownership-icons/asset-submission.svg',
    imagePosition: 'right', // Image on RIGHT, text on LEFT
  },
  {
    title: 'Asset Tokenization',
    description: 'Assets are digitally tokenized into fractional ownership units.',
    icon: '/landing/ownership-icons/asset-tokenization.gif',
    iconFallback: '/landing/ownership-icons/asset-tokenization.svg',
    imagePosition: 'left', // Image on LEFT, text on RIGHT
  },
  {
    title: 'Investor Access',
    description: 'Verified assets become available to global investors.',
    icon: '/landing/ownership-icons/investor-access.gif',
    iconFallback: '/landing/ownership-icons/investor-access.svg',
    imagePosition: 'right', // Image on RIGHT, text on LEFT
  },
  {
    title: 'Secure Ownership Exchange',
    description: 'Investors seamlessly acquire and trade tokenized assets.',
    icon: '/landing/ownership-icons/secure-ownership.gif',
    iconFallback: '/landing/ownership-icons/secure-ownership.svg',
    imagePosition: 'left', // Image on LEFT, text on RIGHT
  },
];

export default function OwnershipSection() {
  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        py: { xs: 6, sm: 8, md: 10, lg: 12 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1400px',
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
        }}
      >
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
          <Typography
            component="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '2.8rem' },
              color: '#0A0A0A',
              mb: 0,
              letterSpacing: '-0.02em',
              fontFamily: "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              position: 'relative',
              display: 'inline-block',
            }}
          >
            Digital Ownership with Confidence
          </Typography>
          
          {/* Paragraph below title */}
          <Typography
            sx={{
              textAlign: 'center',
              color: '#737373',
              maxWidth: { xs: '100%', sm: 650, md: 750, lg: 850 },
              mx: 'auto',
              mt: { xs: 1.5, sm: 2, md: 2.5 },
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem', lg: '1.5rem', xl: '24px' },
              lineHeight: 1,
              letterSpacing: '0%',
              px: { xs: 2, sm: 3 },
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: 400,
            }}
          >
            Participate in a marketplace designed for liquidity, transparency and seamless 
            ownership transfers across tokenized real world assets.
          </Typography>
        </Box>

        {/* Feature Rows - Alternating Layout */}
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {FEATURES.map((feature, index) => (
            <Grid
              key={feature.title}
              container
              spacing={{ xs: 4, md: 6, lg: 8 }}
              sx={{
                mb: index === FEATURES.length - 1 ? 0 : { xs: 6, md: 8, lg: 10 },
                alignItems: 'center',
                flexDirection: {
                  xs: 'column',
                  md: feature.imagePosition === 'left' ? 'row' : 'row-reverse',
                },
              }}
            >
              {/* Image/Icon Column */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: { xs: 2, md: 3 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 180, sm: 220, md: 260, lg: 300 },
                      height: { xs: 180, sm: 220, md: 260, lg: 300 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Placeholder for 3D GIF */}
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#F5F8FF',
                        borderRadius: '24px',
                      }}
                    >
                      <Image
                        src={feature.iconFallback}
                        alt={feature.title}
                        width={180}
                        height={180}
                        style={{
                          width: 'auto',
                          height: 'auto',
                          maxWidth: '80%',
                          maxHeight: '80%',
                          objectFit: 'contain',
                        }}
                        unoptimized
                      />
                    </Box>
                    
                    {/* Uncomment when GIFs are ready */}
                    {/* <Image
                      src={feature.icon}
                      alt={feature.title}
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    /> */}
                  </Box>
                </Box>
              </Grid>

              {/* Text Column */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  sx={{
                    textAlign: { xs: 'center', md: 'left' },
                    px: { xs: 1, md: 2 },
                  }}
                >
                  {/* Title */}
                  <Typography
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2.2rem' },
                      color: '#0A0A0A',
                      mb: { xs: 2, md: 2.5 },
                      fontFamily: "'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#6B7280',
                      fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem', lg: '1.1rem' },
                      lineHeight: 1.6,
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      maxWidth: { xs: '100%', md: '90%' },
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Container>
    </Box>
  );
}