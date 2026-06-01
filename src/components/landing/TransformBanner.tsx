import { Box, Typography, Container } from '@mui/material';
import type { TransformBannerContent } from '@/lib/content';

export default function TransformBanner({ content }: { content: TransformBannerContent }) {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#ffffff' }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: '16px', md: '42px' },

            // Main blue gradient matching uploaded image
            background: `
              radial-gradient(circle at center, rgba(255,255,255,0.12) 1px, transparent 1px),
              linear-gradient(
                180deg,
                #037DC8 0%,
                #1E8FD8 38%,
                #6EB7E8 72%,
                #C7E0F3 100%
              )
            `,

            // Dot grid density
            backgroundSize: '18px 18px, 100% 100%',

            // Soft outer glow like the image
            

            px: { xs: 3, sm: 4, md: 5, lg: 6 },
            py: { xs: 13, sm: 15, md: 17, lg: 19 },

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

            // Optional subtle overlay for depth
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `
                radial-gradient(
                  circle at top center,
                  rgba(255,255,255,0.18),
                  transparent 55%
                )
              `,
              pointerEvents: 'none',
            },
          }}
        >
          {/* Title */}
          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.8rem', md: '48px' },
              lineHeight: 1,
              letterSpacing: '0',
              textAlign: 'center',
              color: '#FAFAFA',
              mb: { xs: 2.5, md: 3 },
            }}
          >
            {content.title}
          </Typography>

          {/* Paragraph 1 */}
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: { xs: '1rem', sm: '1.2rem', md: '23px' },
              lineHeight: 1,
              letterSpacing: '0',
              textAlign: 'center',
              color: '#FAFAFA',
              mb: { xs: 2, md: 2.5 },
              maxWidth: 1100,
            }}
          >
            {content.paragraph1}
          </Typography>

          {/* Paragraph 2 */}
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 400,
              fontSize: { xs: '1rem', sm: '1.2rem', md: '23px' },
              lineHeight: 1,
              letterSpacing: '0',
              textAlign: 'center',
              color: '#FAFAFA',
              maxWidth: 1100,
            }}
          >
            {content.paragraph2}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
