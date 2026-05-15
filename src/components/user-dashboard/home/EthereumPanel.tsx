'use client';

import { Box, Typography } from '@mui/material';

// Simple SVG area chart matching the Figma design
function AreaChart() {
  return (
    <Box sx={{ width: '100%', height: 100, mt: 1.5 }}>
      <svg viewBox="0 0 240 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="ethGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b5bdb" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b5bdb" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M0,80 L30,65 L60,70 L80,50 L100,60 L120,40 L140,55 L160,35 L180,45 L200,30 L220,20 L240,25 L240,100 L0,100 Z"
          fill="url(#ethGrad)"
        />
        <path
          d="M0,80 L30,65 L60,70 L80,50 L100,60 L120,40 L140,55 L160,35 L180,45 L200,30 L220,20 L240,25"
          fill="none"
          stroke="#4c6ef5"
          strokeWidth="2"
        />
      </svg>
    </Box>
  );
}

// Ethereum diamond logo
function EthLogo() {
  return (
    <Box sx={{ width: 36, height: 36, flexShrink: 0 }}>
      <svg viewBox="0 0 36 36" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="18" cy="18" r="18" fill="#627EEA" />
        <path d="M18 6v9.5l8 3.5L18 6Z" fill="white" fillOpacity="0.6" />
        <path d="M18 6L10 19l8-3.5V6Z" fill="white" />
        <path d="M18 24.5v5.5l8-11L18 24.5Z" fill="white" fillOpacity="0.6" />
        <path d="M18 30v-5.5L10 19l8 11Z" fill="white" />
        <path d="M18 23l8-4.5L18 15.5V23Z" fill="white" fillOpacity="0.2" />
        <path d="M10 18.5L18 23v-7.5l-8 3Z" fill="white" fillOpacity="0.6" />
      </svg>
    </Box>
  );
}

export default function EthereumPanel() {
  return (
    <Box
      sx={{
        width: { md: 200, lg: 230 },
        flexShrink: 0,
        position: 'sticky',
        top: 80,
        alignSelf: 'flex-start',
        display: { xs: 'none', md: 'block' },
        border: '1px solid #eee',
        borderRadius: 3,
        p: 2,
        bgcolor: '#fff',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EthLogo />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Ethereum</Typography>
            <Typography sx={{ fontSize: 12, color: '#888' }}>ETH</Typography>
          </Box>
        </Box>

        {/* Price change badge */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.4,
            bgcolor: '#e6f4ea',
            borderRadius: 6,
            px: 1,
            py: 0.4,
          }}
        >
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              bgcolor: '#34a853',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 10 10" style={{ width: 8, height: 8 }}>
              <polyline points="2,7 5,3 8,7" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Box>
          <Typography sx={{ fontSize: 11, color: '#34a853', fontWeight: 700 }}>+13.05</Typography>
        </Box>
      </Box>

      <AreaChart />
    </Box>
  );
}
