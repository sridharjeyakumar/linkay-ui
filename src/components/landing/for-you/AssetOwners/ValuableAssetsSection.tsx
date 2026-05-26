'use client';

import { Box, Typography, Container } from '@mui/material';
import { Bank, Buildings, CirclesThreePlus } from '@phosphor-icons/react';
import type { ValuableAssetsContent } from '@/lib/content';

/* Icons are static — not editable via CMS */
const BOX_ICONS = [Bank, Buildings, CirclesThreePlus];

export default function ValuableAssetsSection({
  content,
}: {
  content: ValuableAssetsContent;
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
        {/* Title — Figma: Archivo SemiBold 600 48px, color #0A0A0A, centered */}
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
            mb: { xs: 6, md: 8 },
          }}
        >
          {content.title}
        </Typography>

        {/* Boxes row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            justifyContent: 'center',
            gap: { xs: 5, sm: 6, md: 10 },
            width: '100%',
          }}
        >
          {content.boxes.map((box, index) => {
            const IconComponent = BOX_ICONS[index];
            return (
              <Box
                key={box.title}
                sx={{
                  width: { xs: '220px', md: '217px' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '28px',
                }}
              >
                {/* Icon circle — Figma: 101×101, bg #1E40AF, border 2px #00B0FF,
                    radius 50.5px, multi-layered blue box-shadow */}
                <Box
                  sx={{
                    width: '101px',
                    height: '101px',
                    borderRadius: '50.5px',
                    background: '#1E40AF',
                    border: '2px solid #00B0FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `
                      0px 3px 6px 0px rgba(184, 232, 255, 0.71),
                      0px 11px 11px 0px rgba(184, 232, 255, 0.61),
                      0px 25px 15px 0px rgba(184, 232, 255, 0.36),
                      0px 44px 18px 0px rgba(184, 232, 255, 0.11),
                      0px 69px 19px 0px rgba(184, 232, 255, 0.01)
                    `,
                    flexShrink: 0,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.05)',
                      boxShadow: `
                        0px 4px 8px 0px rgba(184, 232, 255, 0.80),
                        0px 14px 14px 0px rgba(184, 232, 255, 0.70),
                        0px 30px 18px 0px rgba(184, 232, 255, 0.45),
                        0px 50px 22px 0px rgba(184, 232, 255, 0.18),
                        0px 75px 24px 0px rgba(184, 232, 255, 0.05)
                      `,
                    },
                  }}
                >
                  {IconComponent && (
                    <IconComponent size={46} weight="duotone" color="#ffffff" />
                  )}
                </Box>

                {/* Text group — gap 20px between title and description */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  {/* Title — Figma: Archivo Medium 500 25px, #000000 */}
                  <Typography
                    sx={{
                      fontFamily: '"Archivo", sans-serif',
                      fontWeight: 500,
                      fontSize: '25px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      color: '#000000',
                      
                    }}
                  >
                    {box.title}
                  </Typography>

                  {/* Description — Figma: implied smaller text, muted */}
                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      letterSpacing: '-0.03em',
                      textAlign: 'center',
                      color: '#000000',
                      maxWidth: '217px',
                    }}
                  >
                    {box.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
