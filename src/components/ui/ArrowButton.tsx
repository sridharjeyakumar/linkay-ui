'use client';

import { useState } from 'react';
import { Box, Button, SxProps, Theme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface ArrowButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  sx?: SxProps<Theme>;
}

export default function ArrowButton({ label = 'Get Started', onClick, href, sx }: ArrowButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Button
      {...(href ? { component: Link, href } : { onClick })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      startIcon={
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#FAFAFA',
            borderRadius: '50%',
            width: 36,
            height: 36,
            flexShrink: 0,
          }}
        >
          <Image
            src="/landing/arrow-default.svg"
            alt="arrow"
            width={20}
            height={20}
            unoptimized
            style={{
              position: 'absolute',
              opacity: hovered ? 0 : 1,
              transform: hovered ? 'scale(0.6)' : 'scale(1)',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
            }}
          />
          <Image
            src="/landing/arrow-hover.svg"
            alt="arrow"
            width={20}
            height={20}
            unoptimized
            style={{
              position: 'absolute',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1)' : 'scale(0.6)',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
            }}
          />
        </Box>
      }
      sx={{
        bgcolor: '#0A0A0A',
        color: '#FAFAFA',
        borderRadius: '50px',
        px: { xs: 2.5, md: 3 },
        py: { xs: 1, md: 1.2 },
        fontWeight: 600,
        fontSize: { xs: '0.9rem', md: '1rem' },
        textTransform: 'none',
        boxShadow: 'none',
        '&:hover': { bgcolor: '#1a1a1a', boxShadow: '0 6px 20px rgba(0,0,0,0.25)' },
        transition: 'all 0.2s ease',
        ...sx,
      }}
    >
      {label}
    </Button>
  );
}
