'use client';

import { Box, Typography, Container, Grid, Link as MuiLink } from '@mui/material';
import { InstagramLogo, LinkedinLogo, XLogo } from '@phosphor-icons/react';
import Image from 'next/image';

const FOOTER_COLS = [
  {
    title: 'Company',
    links: ['About Us', 'Blog', 'Contact'],
  },
  {
    title: 'Platform',
    links: ['How It Works', 'Tokenization', 'Security'],
  },
  {
    title: 'Marketplace',
    links: ['Explore Assets', 'Live Auctions', 'Featured Assets'],
  },
  {
    title: 'Support',
    links: ['FAQs', 'Help Center', 'Privacy Policy'],
  },
];

const SOCIALS = [
  { Icon: InstagramLogo, label: 'Instagram', href: '#' },
  { Icon: LinkedinLogo,  label: 'LinkedIn',  href: '#' },
  { Icon: XLogo,         label: 'X',         href: '#' },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0A0A0A',
        color: '#fff',
        pt: { xs: 7, md: 10 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1400px', px: { xs: 3, sm: 4, md: 6 } }}>

        {/* Top row — logo + columns */}
        <Grid container spacing={{ xs: 4, md: 5 }}>

          {/* Logo (SVG includes icon + name) + description */}
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Box sx={{ mb: 2.5 }}>
              <Image
                src="/landing/black and white.svg"
                alt="LinkBlockAssets"
                width={220}
                height={38}
                style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxHeight: 44 }}
                unoptimized
                priority
              />
            </Box>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: { xs: '0.83rem', md: '0.88rem' },
                lineHeight: 1.8,
                maxWidth: 300,
              }}
            >
              LinkblockAssets is a next generation platform for investing in tokenized real world
              assets. Secure, Transparent and Accessible for everyone.
            </Typography>
          </Grid>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <Grid key={col.title} size={{ xs: 6, sm: 3, md: 2 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', md: '0.95rem' },
                  color: '#fff',
                  mb: { xs: 2, md: 2.5 },
                }}
              >
                {col.title}
              </Typography>
              <Box
                component="ul"
                sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}
              >
                {col.links.map((link) => (
                  <Box component="li" key={link}>
                    <MuiLink
                      href="#"
                      underline="none"
                      sx={{
                        color: '#ffffff',
                        fontSize: { xs: '0.82rem', md: '0.88rem' },
                        transition: 'color 0.2s ease',
                        '&:hover': { color: 'rgba(255,255,255,0.45)' },
                      }}
                    >
                      {link}
                    </MuiLink>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Divider */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: { xs: 6, md: 8 }, pt: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              gap: { xs: 3, sm: 0 },
            }}
          >
            {/* Left — socials + copyright */}
            <Box>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                {SOCIALS.map(({ Icon, label, href }) => (
                  <Box
                    key={label}
                    component="a"
                    href={href}
                    aria-label={label}
                    sx={{
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s ease',
                      '&:hover': { color: 'rgba(255,255,255,0.45)' },
                    }}
                  >
                    <Icon size={22} weight="regular" />
                  </Box>
                ))}
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                Copyright © 2026 LinkBlockAssets
              </Typography>
            </Box>

            {/* Right — legal */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                All Rights Reserved
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>|</Typography>
              <MuiLink
                href="#"
                underline="always"
                sx={{
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'rgba(255,255,255,0.45)' },
                }}
              >
                Terms and Conditions
              </MuiLink>
              <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>|</Typography>
              <MuiLink
                href="#"
                underline="always"
                sx={{
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'rgba(255,255,255,0.45)' },
                }}
              >
                Privacy Policy
              </MuiLink>
            </Box>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}
