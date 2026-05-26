import { Box, Typography, Container } from '@mui/material';
import { Archivo } from 'next/font/google';
import type { TransparencyContent } from '@/lib/content';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export default function TransparencySection({ content }: { content: TransparencyContent }) {
  return (
    <Box sx={{ background: '#ffffff', width: '100%', py: { xs: 8, md: 12 } }}>
      <Container
        maxWidth={false}
        sx={{ maxWidth: '1440px', px: { xs: 2, sm: 4, md: 19 } }}
      >
        <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', lg: 'row' },
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: { xs: 6, lg: '200px' }, // adjust this value
  }}
>
          {/* Left — heading + subtitle */}
          <Box
            sx={{
              maxWidth: { xs: '100%', lg: '601px' },
              display: 'flex',
              flexDirection: 'column',
              gap: '31px',
              pt: { lg: '4px' },
            }}
          >
            <Typography
              component="h2"
              className={archivo.className}
              sx={{
                fontWeight: 400,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '48px' },
                lineHeight: '100%',
                letterSpacing: '-0.01em',
                color: '#000000',
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
                color: '#737373',
                maxWidth: '545px',
              }}
            >
              {content.subtitle}
            </Typography>
          </Box>

          {/* Right — stack of boxes */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: { xs: '100%', lg: '366px' },
              flexShrink: 0,
            }}
          >
            {content.boxes.map((box) => (
              <Box
                key={box.title}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '16px',
                  borderRadius: '15px',
                  border: '1.5px solid #A3B8FF',
                  background: '#FFFFFF',
                  px: '16px',
                  py: '17px',
                }}
              >
                {/* Blue sidebar strip */}
                <Box
                  sx={{
                    width: '18px',
                    height: '112px',
                    borderRadius: '9px',
                    background: '#1E40AF',
                    flexShrink: 0,
                  }}
                />

                {/* Title + description */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '11px',
                  }}
                >
                  <Typography
                    className={archivo.className}
                    sx={{
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#000000',
                    }}
                  >
                    {box.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#737373',
                    }}
                  >
                    {box.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
