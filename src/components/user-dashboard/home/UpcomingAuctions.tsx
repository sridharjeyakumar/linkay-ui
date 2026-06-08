'use client';

import { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import AlarmIcon from '@mui/icons-material/Alarm';
import { UpcomingAuction } from '@/data/dashboardData';
import { useUpcomingAuctions } from '@/hooks/useUpcomingAuctions';

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function UpcomingAuctionRow({
  item,
  defaultReminded = false,
}: {
  item: UpcomingAuction;
  defaultReminded?: boolean;
}) {
  const [reminded, setReminded] = useState(defaultReminded);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        py: 2,
      }}
    >
      {/* Image — 92×92, border-radius 12px */}
      <Box
        component="img"
        src={item.image}
        alt={item.title}
        sx={{
          width: 92,
          height: 92,
          borderRadius: '12px',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />

      {/* Right content */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Title */}
        <Typography
          noWrap
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 15,
            lineHeight: 1,
            color: '#0a0a0a',
          }}
        >
          {item.title}
        </Typography>

        {/* ETH price + date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Typography sx={{ color: '#16a34a', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>
              ◆
            </Typography>
            <Typography sx={{ color: '#16a34a', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>
              {item.priceEth} ETH
            </Typography>
          </Box>
          <Typography sx={{ color: '#aaa', fontSize: 11, lineHeight: 1 }}>
            {formatDate(item.startsAt)}
          </Typography>
        </Box>

        {/* Notify / Reminder Set */}
        {reminded ? (
          <Button
            onClick={() => setReminded(false)}
            sx={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: 36,
              borderRadius: '50px',
              px: '20px',
              py: '8px',
              bgcolor: 'rgba(30, 64, 175, 0.1)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              textTransform: 'none',
              boxShadow: 'none',
              minWidth: 0,
              '&:hover': { bgcolor: 'rgba(30, 64, 175, 0.15)', boxShadow: 'none' },
            }}
          >
            <AlarmIcon sx={{ fontSize: 15, color: 'rgba(14, 165, 233, 1)' }} />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 14,
                lineHeight: 1,
                color: 'rgba(14, 165, 233, 1)',
              }}
            >
              Reminder Set
            </Typography>
          </Button>
        ) : (
          <Button
            onClick={() => setReminded(true)}
            sx={{
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              height: 36,
              borderRadius: '50px',
              px: '20px',
              py: '8px',
              bgcolor: 'transparent',
              border: '1px solid #1e3faf',
              textTransform: 'none',
              boxShadow: 'none',
              minWidth: 0,
              '&:hover': { bgcolor: 'rgba(30,64,175,0.05)', boxShadow: 'none' },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: 14,
                lineHeight: 1,
                color: '#1e3faf',
              }}
            >
              Notify
            </Typography>
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default function UpcomingAuctions() {
  const { auctions, loading } = useUpcomingAuctions();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: 20,
          color: '#0a0a0a',
          mb: 1.5,
        }}
      >
        Upcoming Auctions
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : auctions.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: '#aaa', py: 2 }}>
          No upcoming auctions at the moment.
        </Typography>
      ) : (
        <Box>
          {auctions.map((item) => (
            <UpcomingAuctionRow key={item.id} item={item} />
          ))}
        </Box>
      )}
    </Box>
  );
}
