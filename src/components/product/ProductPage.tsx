'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider, useMediaQuery, useTheme } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { SketchLogo, Keyhole } from '@phosphor-icons/react';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface ProductPageItem {
  id: string;
  title: string;
  category: string;
  custodyService: string;
  /** index 0 = hero, index 1-3 = thumbnails */
  images: [string, string, string, string];
  totalValuation: number;
  pricePerFraction: number;
  compliance: string;
  lockupMonths: number;
  totalFractions: number;
  fractionsRemaining: number;
  description: string;
  ipfsUrl?: string;
  ipfsMetadataUrl?: string;
  auctionEndTime?: string;
  currentBid?: number;
  activities?: ActivityItem[];
}

interface ActivityItem {
  type: 'bid' | 'reserve' | 'mint';
  user: string;
  date: string;
  amount?: number;
}

interface ProductPageProps {
  item: ProductPageItem;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ── API CONFIG ── (developers edit this section only)
   ═══════════════════════════════════════════════════════════════════════════

   1. Set API_BASE_URL to your endpoint base
   2. Update getProductId() to match your routing (URL param, slug, etc.)
   3. Update transformApiResponse() to map your backend field names

   ─────────────────────────────────────────────────────────────────────── */

const API_BASE_URL = 'https://api.yourdomain.com/v1';

function getProductId(): string {
  if (typeof window === 'undefined') return 'demo';
  return new URLSearchParams(window.location.search).get('id') || 'demo';
}

async function fetchProduct(id: string): Promise<ProductPageItem> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${YOUR_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return transformApiResponse(json);
}

function transformApiResponse(d: any): ProductPageItem {
  return {
    id:                 d.id                ?? d._id                  ?? '',
    title:              d.title             ?? d.name                 ?? '',
    category:           d.category          ?? d.type                 ?? '',
    custodyService:     d.custodyService     ?? d.custody_service      ?? '',
    images: [
      d.images?.[0]    ?? d.mainImage       ?? DEMO.images[0],
      d.images?.[1]    ?? d.thumbnail1      ?? DEMO.images[1],
      d.images?.[2]    ?? d.thumbnail2      ?? DEMO.images[2],
      d.images?.[3]    ?? d.thumbnail3      ?? DEMO.images[3],
    ],
    totalValuation:     d.totalValuation    ?? d.total_valuation      ?? 0,
    pricePerFraction:   d.pricePerFraction  ?? d.price_per_fraction   ?? 0,
    compliance:         d.compliance        ?? '',
    lockupMonths:       d.lockupMonths      ?? d.lockup_months        ?? 0,
    totalFractions:     d.totalFractions    ?? d.total_fractions      ?? 0,
    fractionsRemaining: d.fractionsRemaining ?? d.fractions_remaining ?? 0,
    description:        d.description       ?? '',
    ipfsUrl:            d.ipfsUrl           ?? d.ipfs_url             ?? '',
    ipfsMetadataUrl:    d.ipfsMetadataUrl   ?? d.ipfs_metadata_url    ?? '',
  };
}

/* ─── Demo fallback (remove once API is wired up) ───────────────────────── */
const DEMO: ProductPageItem = {
  id: 'demo-001',
  title: 'Patekk Phillipe Nautilus 5711/1A-010',
  category: 'Luxury Watch',
  custodyService: 'Linkay Custody Services',
  images: [
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=900&q=80',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&q=80',
    'https://images.unsplash.com/photo-1549482199-bc1ca6f58502?w=400&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80',
  ],
  totalValuation: 150000,
  pricePerFraction: 150,
  compliance: 'ERC-3643',
  lockupMonths: 6,
  totalFractions: 1000,
  fractionsRemaining: 650,
  description:
    'A timeless icon of horology, the Nautilus 5711/1A-010 represents the pinnacle of Swiss craftsmanship. Its distinctive octagonal bezel, integrated bracelet, and exquisite movement make it one of the most sought-after luxury watches in the world.',
  ipfsUrl: 'https://ipfs.io/ipfs/QmDemo',
  ipfsMetadataUrl: 'https://ipfs.io/ipfs/QmDemo/metadata.json',
  auctionEndTime: new Date(Date.now() + 12 * 3600000 + 43 * 60000 + 42000).toISOString(),
  currentBid: 0.33,
  activities: [
    { type: 'bid',     user: 'oneoff316',       date: 'May 5, 2026 at 6:13pm',  amount: 0.33 },
    { type: 'bid',     user: 'auraMint88',       date: 'May 5, 2026 at 4:37pm',  amount: 0.31 },
    { type: 'bid',     user: 'crypticMuse19',    date: 'May 5, 2026 at 2:10pm',  amount: 0.26 },
    { type: 'reserve', user: 'Zhannet Podobed',  date: 'May 1, 2023 at 4:49pm',  amount: 0.18 },
    { type: 'mint',    user: 'Zhannet Podobed',  date: 'May 1, 2026 at 4:46pm' },
  ],
};

/* ─── Static activity data ───────────────────────────────────────────────── */
const STATIC_ACTIVITIES: ActivityItem[] = [
  { type: 'bid',     user: 'oneoff316',      date: 'May 5, 2026 at 6:13pm',  amount: 0.33 },
  { type: 'bid',     user: 'auraMint88',     date: 'May 5, 2026 at 4:37pm',  amount: 0.31 },
  { type: 'bid',     user: 'crypticMuse19',  date: 'May 5, 2026 at 2:10pm',  amount: 0.26 },
  { type: 'reserve', user: 'Zhannet Podobed',date: 'May 1, 2023 at 4:49pm',  amount: 0.18 },
  { type: 'mint',    user: 'Zhannet Podobed',date: 'May 1, 2026 at 4:46pm' },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const fmt = (n: number) =>
  '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function SkeletonBlock({ height, borderRadius = 8, mb = 0 }: { height: number; borderRadius?: number; mb?: number }) {
  return (
    <Box sx={{
      width: '100%', height, borderRadius, mb: `${mb}px`,
      background: 'linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'lb-shimmer 1.4s ease-in-out infinite',
      '@keyframes lb-shimmer': {
        '0%':   { backgroundPosition: '200% 0' },
        '100%': { backgroundPosition: '-200% 0' },
      },
    }} />
  );
}

/* ─── Accordion row ──────────────────────────────────────────────────────── */
function AccordionRow({ label, children }: { label: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Divider />
      <Box
        onClick={() => setOpen(v => !v)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '18px', cursor: 'pointer', userSelect: 'none' }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111' }}>
          {label}
        </Typography>
        {/* Chevron icon — width 15.5px, height 7.5px, rotates 180° when open */}
        <Box
          sx={{
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.25s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <svg
            width="15.5"
            height="7.5"
            viewBox="0 0 15.5 7.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block' }}
          >
            <path
              d="M1 1L7.75 6.5L14.5 1"
              stroke="#111111"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
      </Box>
      {open && (
        <Box sx={{ pb: '20px' }}>
          {children ?? (
            <Typography sx={{ fontSize: 14, color: '#888', lineHeight: 1.75 }}>
              No {label.toLowerCase()} available.
            </Typography>
          )}
        </Box>
      )}
    </>
  );
}

/* ─── IPFS Row ───────────────────────────────────────────────────────────── */
function IpfsRow({ label, href }: { label: string; href?: string }) {
  return (
    <Box
      component="a"
      href={href ?? '#'}
      target="_blank"
      rel="noreferrer"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        /* ✅ Full-width always — never fixed 343px on mobile */
        width: '100%',
        height: 58,
        px: '20px',
        bgcolor: 'rgba(250,250,250,1)',
        borderRadius: '16px',
        textDecoration: 'none',
        boxSizing: 'border-box',
        border: '1px solid #f0f0f0',
        transition: 'background 0.15s',
        '&:hover': { bgcolor: 'rgba(238,238,238,1)' },
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(10,10,10,1)' }}>
        {label}
      </Typography>
      <OpenInNewIcon sx={{ fontSize: 18, color: 'rgba(115,115,115,1)', flexShrink: 0 }} />
    </Box>
  );
}

/* ─── ProductPage (with internal data fetching) ──────────────────────────── */
export default function ProductPage({ item: itemProp }: Partial<ProductPageProps>) {
  const theme = useTheme();

  /*
   * useMediaQuery with MUI theme breakpoints.
   * These are SERVER-SAFE (SSR-compatible) and work with MUI's ThemeProvider.
   *
   * Breakpoints used:
   *   xs  : 0px+     (mobile portrait)
   *   sm  : 600px+   (mobile landscape / small tablet)
   *   md  : 900px+   (tablet landscape)
   *   lg  : 1200px+  (desktop)
   */
  const isMobile  = useMediaQuery(theme.breakpoints.down('sm'));   // < 600px
  const isTablet  = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600–900px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));     // ≥ 900px

  /* ── State ── */
  const [item, setItem]           = useState<ProductPageItem | null>(itemProp ?? null);
  const [loading, setLoading]     = useState(!itemProp);
  const [error, setError]         = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [timeLeft, setTimeLeft]   = useState({ h: 0, m: 0, s: 0 });

  /* ── Fetch (skipped if item was passed as prop) ── */
  useEffect(() => {
    if (itemProp) return; // prop wins — no fetch needed
    let dead = false;
    (async () => {
      try {
        setLoading(true);
        const id = getProductId();
        if (id === 'demo' || API_BASE_URL.includes('yourdomain')) {
          await new Promise(r => setTimeout(r, 500));
          if (!dead) setItem(DEMO);
        } else {
          const data = await fetchProduct(id);
          if (!dead) setItem(data);
        }
      } catch (e: any) {
        if (!dead) setError(e.message);
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => { dead = true; };
  }, [itemProp]);

  /* ── Auction countdown ── */
  useEffect(() => {
    if (!item?.auctionEndTime) return;
    const tick = () => {
      const diff = Math.max(0, new Date(item.auctionEndTime!).getTime() - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [item?.auctionEndTime]);

  /* ── Error ── */
  if (error) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 2, p: 3 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Failed to load product</Typography>
      <Typography sx={{ fontSize: 13, color: '#888' }}>{error}</Typography>
      <Button onClick={() => window.location.reload()}
        sx={{ mt: 1, borderRadius: 50, bgcolor: '#1e40af', color: '#fff', px: 4, textTransform: 'none', '&:hover': { bgcolor: '#183496' } }}>
        Retry
      </Button>
    </Box>
  );

  /* ── Loading skeleton ── */
  if (loading || !item) return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1140, mx: 'auto' }}>
      <SkeletonBlock height={isMobile ? 200 : 340} borderRadius={11} mb={10} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, mb: 3 }}>
        <SkeletonBlock height={isMobile ? 66 : 110} borderRadius={11} />
        <SkeletonBlock height={isMobile ? 66 : 110} borderRadius={11} />
        <SkeletonBlock height={isMobile ? 66 : 110} borderRadius={11} />
      </Box>
      <SkeletonBlock height={28} mb={12} />
      <SkeletonBlock height={16} mb={8} />
      <SkeletonBlock height={16} />
    </Box>
  );

  /* ── Derived ── */
  const thumbs   = [item.images[1], item.images[2], item.images[3]] as const;
  const mainImgH = isMobile ? 210 : isTablet ? 300 : 378;
  const thumbH   = isMobile ? 72  : isTablet ? 110 : 144;
  const thumbGap = isMobile ? '7px' : '11px';

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        minHeight: '100vh',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        '& *': { fontFamily: 'inherit' },
      }}
    >
      <Box
        sx={{
          maxWidth: 1140,
          mx: 'auto',
          px: { xs: '16px', sm: '24px', md: '40px' },
          pt: { xs: '20px', md: '32px' },
          pb: '60px',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'minmax(0,1fr) 360px' : '1fr',
            gap: isDesktop ? '56px' : '28px',
            alignItems: 'start',
            width: '100%',
          }}
        >
          <Box sx={{ minWidth: 0, width: '100%' }}>

            {/* ── GALLERY ── */}
            <Box sx={{ mb: '28px', width: '100%' }}>

              {/* Main image — fluid height, no fixed pixel width */}
              <Box
                component="img"
                src={item.images[activeImg]}
                alt={item.title}
                sx={{
                  display: 'block',
                  width: '100%',
                  height: mainImgH,
                  objectFit: 'contain',
                  borderRadius: '11px',
                  mb: thumbGap,
                  flexShrink: 0,
                  bgcolor: '#f5f5f5',
                }}
              />

              {/* Thumbnail strip — CSS grid so each thumb is equal & never overflows */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: thumbGap,
                  height: thumbH,
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                {thumbs.map((src, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={src}
                    alt={`View ${i + 2}`}
                    onClick={() => setActiveImg(i + 1)}
                    sx={{
                      width: '100%',   /* ✅ fills grid cell */
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '11px',
                      cursor: 'pointer',
                      display: 'block',
                      bgcolor: '#f5f5f5',
                      outline: activeImg === i + 1
                        ? '2.5px solid #111'
                        : '2.5px solid transparent',
                      outlineOffset: '2px',
                      transition: 'outline-color 0.15s',
                      '&:hover': { outlineColor: '#bbb' },
                    }}
                  />
                ))}
              </Box>
            </Box>
            {/* ── END GALLERY ── */}

            {/* Accordion sections */}
            <AccordionRow label="Description">
              <Typography sx={{ fontSize: 14, color: '#888', lineHeight: 1.78 }}>
                {item.description}
              </Typography>
            </AccordionRow>
            <AccordionRow label="Additional Information" />
            <AccordionRow label="Documents" />
            <Divider />
          </Box>

          {/* ════════════════ RIGHT COLUMN ════════════════ */}
          <Box sx={{ minWidth: 0, width: '100%' }}>

            {/* Title */}
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 20, sm: 26, md: 32 },
                fontWeight: 800,
                color: '#111',
                lineHeight: 1.18,
                letterSpacing: '-0.4px',
                mb: '18px',
                wordBreak: 'break-word',
              }}
            >
              {item.title}
            </Typography>

            {/* Chips */}
            <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', mb: '20px' }}>
              <Box sx={{ px: '14px', py: '7px', bgcolor: '#111', borderRadius: '6px' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                  {item.category}
                </Typography>
              </Box>
              <Box sx={{ px: '14px', py: '7px', border: '1.5px solid #d0d0d0', borderRadius: '6px' }}>
                <Typography sx={{ fontSize: 13, color: '#555' }}>
                  {item.custodyService}
                </Typography>
              </Box>
            </Box>

            {/* Ends In + Current Bid */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 32px', mb: '22px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Typography sx={{ fontSize: 13, color: '#888' }}>Ends In</Typography>
                <Typography
                  sx={{
                    fontSize: 15, fontWeight: 700, color: '#ef4444',
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em',
                  }}
                >
                  {String(timeLeft.h).padStart(2, '0')}h&nbsp;
                  {String(timeLeft.m).padStart(2, '0')}m&nbsp;
                  {String(timeLeft.s).padStart(2, '0')}s
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Typography sx={{ fontSize: 13, color: '#888' }}>Current Bid</Typography>
                {/* Ethereum diamond */}
                <Box component="span" sx={{ fontSize: 15, color: '#3b82f6', lineHeight: 1 }}>
                  ⬥
                </Box>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#3b82f6' }}>
                  {(item.currentBid ?? 0).toFixed(2)} ETH
                </Typography>
              </Box>
            </Box>

            {/* Make a bid button */}
            <Button
              startIcon={
                <Box
                  component="img"
                  src="/landing/real estate/Bid.svg"
                  alt=""
                  sx={{ width: 20, height: 20, display: 'block' }}
                />
              }
              sx={{
                width: '100%',
                height: 56,
                background: 'linear-gradient(270deg, #EF4443 0%, #FABD24 100%)',
                color: '#fff',
                borderRadius: '50px',
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                mb: '28px',
                '&:hover': {
                  background: 'linear-gradient(270deg, #d63b3a 0%, #e0a91f 100%)',
                  boxShadow: 'none',
                },
              }}
            >
              Make a bid
            </Button>

            {/* Activity */}
            <Box>
              {/* header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '22px' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Activity</Typography>
                <OpenWithIcon sx={{ fontSize: 18, color: '#888', cursor: 'pointer', transform: 'rotate(45deg)', '&:hover': { color: '#111' } }} />
              </Box>

              {/* ── Timeline rows ── */}
              {(() => {
                const acts = item.activities ?? STATIC_ACTIVITIES;
                const reserveAct = acts.find(a => a.type === 'reserve');
                const mintAct    = acts.find(a => a.type === 'mint');

                /* shared dashed connector */
                const Connector = () => (
                  <Box
                    sx={{
                      width: 0,
                      flex: 1,
                      minHeight: 32,
                      my: '4px',
                      borderLeft: '2px dashed #d1d5db',
                    }}
                  />
                );

                return (
                  <Box>

                    {/* Row 1 — Be the First to Bid */}
                    <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      {/* icon + line */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 46 }}>
                        <Box sx={{
                          width: 42, height: 42, borderRadius: '50%',
                          background: 'linear-gradient(270deg, #EF4443 0%, #FABD24 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Box component="img" src="/landing/real estate/Bid.svg" alt="bid" sx={{ width: 22, height: 22 }} />
                        </Box>
                        <Connector />
                      </Box>
                      {/* text */}
                      <Box sx={{ pt: '6px', pb: '20px', flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111', lineHeight: 1.3 }}>
                          Be the First to Bid
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: '#9ca3af', mt: '4px', lineHeight: 1.4 }}>
                          Open the auction with your bid.
                        </Typography>
                      </Box>
                    </Box>

                    {/* Row 2 — Reserve */}
                    {reserveAct && (
                      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        {/* icon + line */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 46 }}>
                          {/* outer light-blue ring */}
                          <Box sx={{
                            width: 46, height: 46, borderRadius: '50%',
                            background: 'rgba(191, 219, 254, 1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            {/* inner dark-blue circle */}
                            <Box sx={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'rgba(191, 219, 254, 1)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Keyhole size={18} weight="fill" color="rgba(30, 64, 175, 1)" />
                            </Box>
                          </Box>
                          {mintAct && <Connector />}
                        </Box>
                        {/* text + amount */}
                        <Box sx={{
                          pt: '6px', pb: mintAct ? '20px' : 0,
                          flex: 1, minWidth: 0,
                          display: 'flex', alignItems: 'flex-start',
                          justifyContent: 'space-between', gap: '12px',
                        }}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                              Reserve set by&nbsp;
                              <Box component="span" sx={{ color: '#111', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                                {reserveAct.user}
                              </Box>
                              &nbsp;
                              <OpenInNewIcon sx={{ fontSize: 11, verticalAlign: 'middle', color: '#999' }} />
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: '#aaa', mt: '3px' }}>
                              {reserveAct.date}&nbsp;
                              <OpenInNewIcon sx={{ fontSize: 10, verticalAlign: 'middle', color: '#ccc' }} />
                            </Typography>
                          </Box>
                          {reserveAct.amount != null && (
                            <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111', flexShrink: 0, pt: '2px' }}>
                              {reserveAct.amount.toFixed(2)} ETH
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}

                    {/* Row 3 — Mint */}
                    {mintAct && (
                      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        {/* icon (no connector after last row) */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 46 }}>
                          {/* outer light-blue ring */}
                          <Box sx={{
                            width: 46, height: 46, borderRadius: '50%',
                            background: 'rgba(191, 219, 254, 1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            {/* inner dark-blue circle */}
                            <Box sx={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'rgba(191, 219, 254, 1)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <SketchLogo size={18} weight="fill" color="rgba(30, 64, 175, 1)" />
                            </Box>
                          </Box>
                        </Box>
                        {/* text */}
                        <Box sx={{ pt: '6px', flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                            Minted by&nbsp;
                            <Box component="span" sx={{ color: '#111', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                              {mintAct.user}
                            </Box>
                            &nbsp;
                            <OpenInNewIcon sx={{ fontSize: 11, verticalAlign: 'middle', color: '#999' }} />
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: '#aaa', mt: '3px' }}>
                            {mintAct.date}&nbsp;
                            <OpenInNewIcon sx={{ fontSize: 10, verticalAlign: 'middle', color: '#ccc' }} />
                          </Typography>
                        </Box>
                      </Box>
                    )}

                  </Box>
                );
              })()}
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}