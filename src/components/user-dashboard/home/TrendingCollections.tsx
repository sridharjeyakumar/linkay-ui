'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { AuctionItem } from '@/data/dashboardData';
import { useDashboardFilter } from '@/context/DashboardFilterContext';
import { useDashboardData } from '@/hooks/useDashboardData';

function useCountdown(endsAt: Date) {
  const calc = () => {
    const diff = Math.max(0, endsAt.getTime() - Date.now());
    return {
      h: Math.floor(diff / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1_000),
    };
  };
  const [time, setTime] = useState(calc);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    ref.current = setInterval(() => setTime(calc()), 1_000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [endsAt]);
  return time;
}

function EndingChip({ endsAt }: { endsAt: Date }) {
  const { h, m, s } = useCountdown(endsAt);
  return (
    <Box
      sx={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 0.4,
        border: '1px solid #fca5a5',
        borderRadius: 6,
        bgcolor: '#fef2f2',
        whiteSpace: 'nowrap',
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ef4444', flexShrink: 0 }} />
      <Typography sx={{ fontSize: 12, color: '#ef4444', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
        {String(h).padStart(2, '0')}h {String(m).padStart(2, '0')}m {String(s).padStart(2, '0')}s
      </Typography>
    </Box>
  );
}

function ViewAllButton({ onClick }: { onClick: () => void }) {
  return (
    <Box onClick={onClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer', mt: 1.5 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          bgcolor: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.15s',
          '&:hover': { bgcolor: '#333' },
        }}
      >
        <ArrowOutwardIcon sx={{ color: '#fff', fontSize: 17 }} />
      </Box>
      <Typography sx={{ fontWeight: 500, fontSize: 14, color: '#111' }}>View all</Typography>
    </Box>
  );
}

function CollectionCard({ item }: { item: AuctionItem }) {
  const router = useRouter();
  const img = item.image || '/placeholder-asset.jpg';

  return (
    <Box>
      {/* Mosaic: 1 large image left, 3 thumbnails stacked right */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '4px',
          aspectRatio: '2 / 1',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={img}
          alt={item.title}
          sx={{ gridRow: '1 / 4', width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {[img, img, img].map((src, i) => (
          <Box
            key={i}
            component="img"
            src={src}
            alt=""
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ))}
      </Box>

      {/* Info row: title + chip */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 1.5 }}>
        <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 15, md: 18 }, color: '#111' }}>
          {item.title}
        </Typography>
        <EndingChip endsAt={item.endsAt} />
      </Box>

      <ViewAllButton onClick={() => router.push(`/product/${item.id}`)} />
    </Box>
  );
}

export default function TrendingCollections() {
  const { activeCategory, setAvailableCategories } = useDashboardFilter();
  const { auctions, auctionsLoading, availableCategories } = useDashboardData(activeCategory);

  useEffect(() => {
    if (availableCategories.length > 1) setAvailableCategories(availableCategories);
  }, [availableCategories]);

  const filtered = auctions.filter((a) => {
    const diff = a.endsAt.getTime() - Date.now();
    return diff > 0 && diff <= 24 * 3_600_000;
  });

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: 16, md: 20 }, color: '#111', mb: 2.5 }}>
        Trending Collections
      </Typography>

      {auctionsLoading ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={32} sx={{ color: '#111' }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 3, border: '1px dashed #ddd' }}>
          <Typography sx={{ color: '#aaa', fontSize: 15 }}>No collections ending within 24 hours.</Typography>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {filtered.map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
              <CollectionCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
