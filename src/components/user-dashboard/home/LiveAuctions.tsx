'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AuctionItem } from '@/data/dashboardData';
import { useDashboardFilter } from '@/context/DashboardFilterContext';
import { useDashboardData } from '@/hooks/useDashboardData';

const ITEMS_PER_PAGE = 3;

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

function CountdownBadge({ endsAt }: { endsAt: Date }) {
  const { h, m, s, done } = useCountdown(endsAt);
  if (done) return null;
  const label = `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s left`;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        bgcolor: 'rgba(0,0,0,0.55)',
        borderRadius: 2,
        px: 1,
        py: 0.3,
      }}
    >
      <Typography sx={{ fontSize: 11, color: '#fff', fontWeight: 600, letterSpacing: 0.2 }}>
        {label}
      </Typography>
    </Box>
  );
}

function AuctionCard({ item }: { item: AuctionItem }) {
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
      {/* Image + countdown overlay */}
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={item.image}
          alt={item.title}
          sx={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
        />
        <Box sx={{ position: 'absolute', bottom: 8, left: 8 }}>
          <CountdownBadge endsAt={item.endsAt} />
        </Box>
      </Box>

      <Box sx={{ px: 1.5, pt: 1.2, pb: 1.5 }}>
        <Typography noWrap sx={{ fontWeight: 700, fontSize: 13, color: '#111', mb: 0.6 }}>
          {item.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.2 }}>
          <Typography sx={{ fontSize: 13, color: '#16a34a', fontWeight: 700 }}>
            {item.priceEth} ETH
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#999' }}>
            {item.currentIndex}/{item.totalSupply}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="small"
          sx={{
            bgcolor: '#111',
            color: '#fff',
            borderRadius: 6,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 12,
            py: 0.7,
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
          width: 36,
          height: 36,
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
          width: 36,
          height: 36,
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
  const { auctions } = useDashboardData(activeCategory);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(auctions.length / ITEMS_PER_PAGE);
  const visible = auctions.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

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

      {auctions.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 3, border: '1px dashed #ddd' }}>
          <Typography sx={{ color: '#aaa', fontSize: 15 }}>No live auctions for this category.</Typography>
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
