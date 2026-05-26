'use client';

import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import { Archivo } from 'next/font/google';
import type { BenefitsContent } from '@/lib/content';
import ArrowButton from '@/components/ui/ArrowButton';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const POINT_ICON = '/AssetOwners/Frame 2147225127.svg';

export default function BenefitsSection({
  content,
}: {
  content: BenefitsContent;
}) {
  return (
    <Box
      sx={{
        background: '#ffffff',
        position: 'relative',
        width: '100%',
        py: { xs: 8, md: 10 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1400px',
          px: { xs: 2, sm: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Section Title — Figma: Archivo SemiBold 600 48px, #0A0A0A */}
        <Typography
          component="h2"
          sx={{
            fontFamily: '"Archivo", sans-serif',
            fontWeight: 600,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '48px' },
            lineHeight: '100%',
            letterSpacing: '0%',
            textAlign: 'center',
            color: '#0A0A0A',
            mb: { xs: 5, md: 8 },
          }}
        >
          {content.title}
        </Typography>

        {/* Benefit cards */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: '24px', md: '38px' },
            width: '100%',
            maxWidth: '1040px',
          }}
        >
          {content.benefits.map((benefit) => (
              <Box
                key={benefit.title}
                sx={{
                  width: '100%',
                  minHeight: { xs: 'auto', md: '280px' },
                  borderRadius: '20px',
                  background: '#FFFFFF',
                  boxShadow: '0px 10px 20px -6px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  px: { xs: 3, md: 0 },
                  py: { xs: 4, md: 0 },
                  gap: { xs: 3, md: 0 },
                }}
              >
                {/* Image — dynamic from JSON */}
                <Box
                  sx={{
                    width: { xs: '150px', md: '320px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {benefit.image && (
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      width={234}
                      height={208}
                      style={{
                        objectFit: 'contain',
                        width: '100%',
                        maxWidth: '234px',
                        height: 'auto',
                      }}
                      unoptimized
                    />
                  )}
                </Box>

                {/* Content — title + points */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                    flex: 1,
                    pl: { xs: 0, md: 12 },
                  }}
                >
                  {/* Title — Figma: Inter SemiBold 600 30px, #1E40AF */}
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600,
                      fontSize: { xs: '22px', sm: '26px', md: '30px' },
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#1E40AF',
                    }}
                  >
                    {benefit.title}
                  </Typography>

                  {/* Points list */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '19px',
                    }}
                  >
                    {benefit.points.map((point) => (
                      <Box
                        key={point}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        {/* Point icon */}
                        <Image
                          src={POINT_ICON}
                          alt=""
                          width={24}
                          height={24}
                          style={{ flexShrink: 0 }}
                          unoptimized
                        />

                        {/* Point text — Figma: Inter Regular 400 20px, #737373 */}
                        <Typography
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 400,
                            fontSize: { xs: '16px', md: '20px' },
                            lineHeight: '100%',
                            letterSpacing: '0%',
                            color: '#737373',
                          }}
                        >
                          {point}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
          ))}
        </Box>

        {/* CTA Banner */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1196px',
            height: { xs: 'auto', md: '239px' },
            mx: 'auto',
            mt: { xs: '60px', md: '80px' },
            mb: { xs: '100px', md: '10px' },
            borderRadius: '28px',
            border: '2px solid #ABE2FB',
            background: 'linear-gradient(90deg, #0EA5E9 -10%, #C2FFFB 50%, #0EA5E9 115%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: '30px', md: '60px' },
            py: { xs: '40px', md: '0' },
            gap: { xs: '24px', md: '30px' },
            boxSizing: 'border-box',
            boxShadow: 'inset 0 0 40px rgba(83, 181, 246, 0.25)',
          }}
        >
          <Typography
            component="h2"
            sx={{
              position: 'relative',
              zIndex: 1,
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '48px' },
              lineHeight: 1,
              textAlign: 'center',
              color: '#0A0A0A',
              mb: { xs: 3.5, md: 1.5 },
            }}
          >
            {content.cta_title}
          </Typography>

          <ArrowButton
            label={content.cta_button_primary}
            onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}
          />
        </Box>
      </Container>
    </Box>
  );
}
