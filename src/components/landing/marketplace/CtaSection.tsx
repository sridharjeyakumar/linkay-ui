'use client';

import { Box, Typography } from '@mui/material';
import { Archivo } from 'next/font/google';
import ArrowButton from '@/components/ui/ArrowButton';
import type { MarketplaceCtaContent } from '@/lib/content';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
});

export default function CtaSection({ content }: { content: MarketplaceCtaContent }) {
  return (
    <Box sx={{ width: '100%', px: { xs: 2, sm: 4, md: 6 }, pb: { xs: '80px', md: '100px' } }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '1196px',
          height: { xs: 'auto', md: '239px' },
          mx: 'auto',
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
          className={archivo.className}
          sx={{
            fontWeight: 600,
            fontSize: { xs: '28px', sm: '36px', md: '48px' },
            lineHeight: '100%',
            letterSpacing: '-0.07em',
            color: '#0A0A0A',
            maxWidth: '680px',
            textAlign: 'center',
          }}
        >
          {content.title}
        </Typography>

        <ArrowButton
          label={content.button_text}
          onClick={() => window.dispatchEvent(new CustomEvent('linkay:open-register'))}
        />
      </Box>
    </Box>
  );
}
