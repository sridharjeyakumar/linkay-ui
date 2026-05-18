import { Box, Typography, Container } from '@mui/material';

export default function TransformBanner() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#ffffff' }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: '16px', md: '42px' },
            background: `
              radial-gradient(circle, rgba(239, 238, 255, 0.18) 1.5px, transparent 1.5px),
              linear-gradient(135deg, #4a56c0 0%, #5b66cc 45%, #6d6dcc 100%)
            `,
            backgroundSize: '22px 22px, 100% 100%',
            px: { xs: 3, sm: 4, md: 5, lg: 6 },
            py: { xs: 13, sm: 15, md: 17, lg: 19 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
            Transforming Physical Assets into Digital Ownership
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
            LinkBlock Assets transforms premium real-world assets into digitally accessible
            investment opportunities through secure fractional ownership and institutional
            grade marketplace infrastructure.
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
            By combining structured tokenization with transparent trading mechanisms, the
            platform enables broader participation, improved liquidity and seamless access
            to historically exclusive asset classes while preserving verifiable asset
            backed ownership.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
