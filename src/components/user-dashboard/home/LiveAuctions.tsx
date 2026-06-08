'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AuctionItem } from '@/data/dashboardData';
import { useDashboardFilter } from '@/context/DashboardFilterContext';
import { useDashboardData } from '@/hooks/useDashboardData';

const ITEMS_PER_PAGE = 3;

function EthIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M7 0.5L2.5 7.3L7 9.8L11.5 7.3L7 0.5Z" fill="#16a34a" />
      <path d="M7 10.8L2.5 8L7 13.5L11.5 8L7 10.8Z" fill="#16a34a" />
    </svg>
  );
}

function useCountdown(endsAt: Date) {
  const calc = () => {
    const diff = Math.max(0, endsAt.getTime() - Date.now());
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    return { h, m, s, done: diff === 0 };
  };
  const [time, setTime] = useState(calc);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    ref.current = setInterval(() => setTime(calc()), 1_000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [endsAt]);
  return time;
}

function CountdownRow({ endsAt, timezone }: { endsAt: Date; timezone?: string }) {
  const { h, m, s, done } = useCountdown(endsAt);
  if (done) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 1.5, flexWrap: 'wrap' }}>
      <Typography component="span" sx={{ fontWeight: 700, fontSize: 13, color: '#06b6d4' }}>
        {h}h
      </Typography>
      <Typography component="span" sx={{ fontWeight: 700, fontSize: 13, color: '#eab308' }}>
        {' '}{String(m).padStart(2, '0')}m
      </Typography>
      <Typography component="span" sx={{ fontWeight: 700, fontSize: 13, color: '#06b6d4' }}>
        {' '}{String(s).padStart(2, '0')}s
      </Typography>
      <Typography component="span" sx={{ fontSize: 13, color: '#666' }}>
        {' '}left
      </Typography>
      {timezone && (
        <Typography component="span" sx={{ fontSize: 11, color: '#06b6d4', opacity: 0.7, fontWeight: 500 }}>
          {timezone}
        </Typography>
      )}
    </Box>
  );
}

function AuctionCard({ item }: { item: AuctionItem }) {
  const router = useRouter();
  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: '#fff',
        border: '1px solid #eee',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.1)', transform: 'translateY(-2px)' },
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={item.image || '/placeholder-asset.jpg'}
        alt={item.title}
        sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
      />

      <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
        {/* Title */}
        <Typography noWrap sx={{ fontWeight: 700, fontSize: 15, color: '#111', mb: 1 }}>
          {item.title}
        </Typography>

        {/* Price + supply row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <EthIcon />
            <Typography sx={{ fontSize: 13, color: '#16a34a', fontWeight: 700 }}>
              {item.priceEth} USDT
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: '#999' }}>
            {item.currentIndex} of {item.totalSupply}
          </Typography>
        </Box>

        {/* Countdown */}
        <CountdownRow endsAt={item.endsAt} timezone={item.timezone} />

        {/* Button */}
        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={() => router.push(`/product/${item.id}`)}
          sx={{
            bgcolor: '#111',
            color: '#fff',
            borderRadius: 6,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 13,
            py: 1,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#333', boxShadow: 'none' },
          }}
        >
          Place a bid
        </Button>
      </Box>
    </Box>
  );
}

function CarouselNav({
  page,
  total,
  onPrev,
  onNext,
}: {
  page: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 3 }}>
      <IconButton
        onClick={onPrev}
        disabled={page === 0}
        sx={{
          width: 36, height: 36,
          bgcolor: page === 0 ? '#f0f0f0' : '#111',
          color: page === 0 ? '#bbb' : '#fff',
          borderRadius: '50%',
          '&:hover': { bgcolor: page === 0 ? '#f0f0f0' : '#333' },
          '&.Mui-disabled': { bgcolor: '#f0f0f0', color: '#bbb' },
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: 20 }} />
      </IconButton>

      <IconButton
        onClick={onNext}
        disabled={page >= total - 1}
        sx={{
          width: 36, height: 36,
          bgcolor: page >= total - 1 ? '#f0f0f0' : '#111',
          color: page >= total - 1 ? '#bbb' : '#fff',
          borderRadius: '50%',
          '&:hover': { bgcolor: page >= total - 1 ? '#f0f0f0' : '#333' },
          '&.Mui-disabled': { bgcolor: '#f0f0f0', color: '#bbb' },
        }}
      >
        <ChevronRightIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
}

export default function LiveAuctions() {
  const { activeCategory } = useDashboardFilter();
  const { auctions, auctionsLoading } = useDashboardData(activeCategory);
  const [page, setPage] = useState(0);

  const filtered = auctions.filter((a) => a.endsAt.getTime() - Date.now() > 24 * 3_600_000);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const visible = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  useEffect(() => { setPage(0); }, [activeCategory]);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2.5 }}>
        <Typography component="span" sx={{ fontWeight: 700, fontSize: { xs: 16, md: 20 }, color: '#ef4444' }}>
          Live
        </Typography>
        <Typography component="span" sx={{ fontWeight: 700, fontSize: { xs: 16, md: 20 }, color: '#111' }}>
          {' Auction'}
        </Typography>
      </Box>

      {auctionsLoading ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={32} sx={{ color: '#111' }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 3, border: '1px dashed #ddd' }}>
          <Typography sx={{ color: '#aaa', fontSize: 15 }}>No live auctions for this category</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {visible.map((item) => (
              <Grid key={item.id} size={{ xs: 12, sm: 4 }}>
                <AuctionCard item={item} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <CarouselNav
              page={page}
              total={totalPages}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          )}
        </>
      )}
    </Box>
  );
}

