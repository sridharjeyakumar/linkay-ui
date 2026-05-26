'use client';

import { Box, Typography, Container } from '@mui/material';
import { keyframes } from '@emotion/react';
import type { InvestorCtaContent } from '@/lib/content';
import ArrowButton from '@/components/ui/ArrowButton';

const floatBlob = keyframes`
  0%   { transform: translate(0%,   0%)   scale(1);    }
  20%  { transform: translate(18%, -22%) scale(1.1);  }
  40%  { transform: translate(35%,  8%)   scale(0.95); }
  60%  { transform: translate(20%,  28%)  scale(1.07); }
  80%  { transform: translate(-10%, 15%)  scale(0.98); }
  100% { transform: translate(0%,   0%)   scale(1);    }
`;

export default function InvestorCta({ content }: { content: InvestorCtaContent }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 8 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: '16px', sm: '24px', md: '32px' },
            background:
              'linear-gradient(135deg, #fff9f6 0%, #fff4ee 35%, #fef0e8 65%, #fde8d8 100%)',
            border: '1.5px solid #e8d8cc',
            px: { xs: 3, sm: 5, md: 8, lg: 10 },
            py: { xs: 7, sm: 8, md: 10 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: { xs: '220px', sm: '280px', md: '380px' },
              height: { xs: '220px', sm: '280px', md: '380px' },
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,150,60,0.42) 0%, rgba(255,110,40,0.18) 50%, transparent 70%)',
              filter: { xs: 'blur(36px)', md: 'blur(56px)' },
              animation: `${floatBlob} 12s ease-in-out infinite`,
              top: '-10%',
              left: '25%',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <Typography
            component="h2"
            sx={{
              position: 'relative',
              zIndex: 1,
              fontFamily: 'var(--font-archivo), sans-serif',
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '48px' },
              lineHeight: 1,
              color: '#0A0A0A',
              mb: { xs: 3.5, md: 4.5 },
            }}
          >
            {content.title}
          </Typography>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <ArrowButton
              label={content.button_text}
              onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
