'use client';

import { Box, Typography, SxProps, Theme } from '@mui/material';
import Link from 'next/link';

interface OutlineButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  sx?: SxProps<Theme>;
}

export default function OutlineButton({ label = 'List Your Asset', onClick, href, sx }: OutlineButtonProps) {
  return (
    <Box
      {...(href ? { component: Link, href } : { onClick })}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50px',
        border: '1.5px solid #0A0A0A',
        bgcolor: 'transparent',
         px: { xs: 2.5, md: 3 },
        py: { xs: 1, md: 2.2 },
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        color: '#070707',
        '&:hover': {
          bgcolor: '#0A0A0A',
          color: '#FAFAFA',
        },
        '&:hover .outline-btn-text': {
          color: '#FAFAFA',
        },
        ...sx,
      }}
    >
      <Typography
        component="span"
        className="outline-btn-text"
        sx={{
          fontWeight: 500,
          fontSize: { xs: '0.9rem', md: '1rem' },
          lineHeight: '100%',
          letterSpacing: '0%',
          color: 'inherit',
          whiteSpace: 'nowrap',
          transition: 'color 0.25s ease',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
