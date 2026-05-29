'use client';

import { Box, Typography, Container } from '@mui/material';
import Image from 'next/image';
import { WalletIcon, ShieldCheckIcon, SparkleIcon } from '@phosphor-icons/react';
import type { DesignedForContent } from '@/lib/content';

const ICONS = [WalletIcon, ShieldCheckIcon, SparkleIcon];

export default function DesignedForInvestors({ content }: { content: DesignedForContent }) {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 10, md: 14 } }}>
      <Container maxWidth={false} sx={{ maxWidth: '1200px', px: { xs: 2, sm: 4, md: 6 } }}>

        <Typography
          component="h2"
          sx={{
            textAlign: 'center',
            fontFamily: 'var(--font-archivo), sans-serif',
            fontWeight: 600,
            fontSize: { xs: '2rem', sm: '2.8rem', md: '48px' },
            lineHeight: 1,
            color: '#0A0A0A',
            mb: { xs: 6, md: 8 },
          }}
        >
          {content.title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', md: 'row' },
            alignItems: 'center',
            gap: { xs: 6, md: 10 },
          }}
        >
          {/* LEFT: Floating image */}
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: '280px', md: '420px' },
              height: { xs: '280px', md: '420px' },
              position: 'relative',
              animation: 'investorFloat 6s ease-in-out infinite',
              '@keyframes investorFloat': {
                '0%':   { transform: 'translateY(0px)' },
                '50%':  { transform: 'translateY(-24px)' },
                '100%': { transform: 'translateY(0px)' },
              },
            }}
          >
            <Image
              src="/landing/for investors/investor floting.svg"
              alt="Investor visualization"
              fill
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
          </Box>

          {/* RIGHT: Feature list */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 5 }, flex: 1 }}>
            {content.features.map((feature, index) => {
              const Icon = ICONS[index % ICONS.length];
              return (
                <Box key={feature.title} sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 84,
                      height: 84,
                      minWidth: 56,
                      borderRadius: '12px',
                      bgcolor: 'rgba(30, 64, 175, 0.1)',
                      border: '1px solid #1E40AF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={32} color="#1E40AF" />
                  </Box>

                  <Box>
                    <Typography
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        fontFamily: 'var(--font-archivo), sans-serif',
                        fontSize: { xs: '1.05rem', md: '1.2rem' },
                        color: '#0A0A0A',
                        mb: 0.75,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#737373',
                        fontSize: { xs: '0.85rem', md: '0.9rem' },
                        fontFamily: '"Inter", sans-serif',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

      </Container>
    </Box>
  );
}