'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { Archivo, Inter } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import type { REInfrastructureContent } from '@/lib/content';

const archivo = Archivo({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' });
const inter   = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' });

/* ─── Intersection observer hook — fires once ────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── keyframes ─────────────────────────────────────────────────────────── */
const kf = {
  '@keyframes dissolveIn': {
    '0%':   { opacity: 0, transform: 'translateY(18px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes imageFadeIn': {
    '0%':   { opacity: 0 },
    '100%': { opacity: 1 },
  },
};

/* how long each image stays visible (ms) before dissolving to the next */
const SLIDE_DURATION = 2500;
/* row dissolve stagger step */
const STEP = 200;

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function REInfrastructure({ content }: { content: REInfrastructureContent }) {
  const { ref, visible } = useInView(0.1);
  const total = content.property_types.length;

  /*
   * activeIdx: which image is currently shown.
   * Starts at 0 when the section enters view, then cycles 0→1→2→0→1→2…
   * indefinitely using setInterval.
   */
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    if (!visible) return;
    setActiveIdx(0);                                   // show first image immediately
    const id = setInterval(
      () => setActiveIdx(prev => (prev + 1) % total), // cycle forever
      SLIDE_DURATION,
    );
    return () => clearInterval(id);
  }, [visible, total]);

  return (
    <Box sx={{ bgcolor: '#fff', py: { xs: 6, md: 9 } }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 3, md: 6 } }}>

        {/* Section title */}
        <Typography
          component="h2"
          className={archivo.className}
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            color: '#0A0A0A',
            textAlign: 'center',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            mb: 3,
          }}
        >
          {content.title}
        </Typography>

        {/* Section subtitle */}
        <Typography
          className={inter.className}
          sx={{
            textAlign: 'center',
            color: '#737373',
            fontSize: { xs: '0.9rem', md: '1rem' },
            fontWeight: 400,
            maxWidth: 560,
            mx: 'auto',
            lineHeight: 1.65,
            mb: { xs: 5, md: 7 },
          }}
        >
          {content.subtitle}
        </Typography>

        {/* Two-column layout */}
        <Box
          ref={ref}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            gap: { xs: 4, md: 5 },
          }}
        >
          {/* ── Left: property type rows dissolve one by one ── */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '31px',
              maxWidth: { md: '493px' },
            }}
          >
            {content.property_types.map((pt, index) => (
              <Box
                key={pt.num}
                sx={{
                  display: 'flex',
                  gap: '23px',
                  alignItems: 'flex-start',
                  /* dissolve row in at index × STEP ms */
                  opacity: visible ? 1 : 0,
                  animation: visible ? `dissolveIn 0.6s ease forwards` : 'none',
                  animationDelay: visible ? `${index * STEP}ms` : '0ms',
                  ...kf,
                }}
              >
                {/* Number — Inter 600, 35px, sky-blue */}
                <Typography
                  className={inter.className}
                  sx={{
                    fontWeight: 600,
                    fontSize: '30px',
                    lineHeight: '100%',
                    letterSpacing: 0,
                    textAlign: 'center',
                    color: 'rgba(14, 165, 233, 1)',
                    width: '46px',
                    height: '42px',
                    flexShrink: 0,
                  }}
                >
                  {pt.num}
                </Typography>

                <Box>
                  {/* Title — Archivo 600, 35px, black */}
                  <Typography
                    className={archivo.className}
                    sx={{
                      fontWeight: 600,
                      fontSize: '30px',
                      lineHeight: '100%',
                      letterSpacing: 0,
                      color: 'rgba(0, 0, 0, 1)',
                      width: { md: '425px' },
                      mb: '6px',
                    }}
                  >
                    {pt.title}
                  </Typography>

                  {/* Description — Inter 400, 18px, gray */}
                  <Typography
                    className={inter.className}
                    sx={{
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '100%',
                      letterSpacing: 0,
                      color: 'rgba(115, 115, 115, 1)',
                      width: { md: '421px' },
                    }}
                  >
                    {pt.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* ── Right: 460×436 image frame — images dissolve one by one ── */}
          <Box
            sx={{
              flexShrink: 0,
              width:  { xs: '100%', md: '360px' },  /* spec: width  460 */
              height: { xs: '56vw', md: '336px' },   /* spec: height 436 */
              position: 'relative',
              borderRadius: '15px',                  /* spec: border-radius 15 */
              overflow: 'hidden',
              bgcolor: '#e8edf4',
            }}
          >
            {content.property_types.map((pt, index) => (
              <Box
                key={pt.num}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  /* only the active image is opaque — all others dissolve out */
                  opacity: activeIdx === index ? 1 : 0,
                  transition: 'opacity 0.7s ease-in-out',
                  zIndex: activeIdx === index ? 1 : 0,
                  ...kf,
                }}
              >
                {/* Guard: only render when src is a non-empty string */}
                {pt.image ? (
                  <Image
                    src={pt.image}
                    alt={pt.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                ) : null}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
