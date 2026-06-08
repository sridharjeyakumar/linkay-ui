'use client';

import { useEffect, useState } from 'react';
import {
  Alert, Box, CircularProgress, Paper, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { fetchAssetsThunk } from '@/features/assets/assetThunks';
import { createAuctionThunk, saveDraftAuctionThunk } from '@/features/auction/auctionThunks';
import { auctionApi } from '@/api/auctionApi';
import {
  CreateAuctionModal,
  type AuctionDraftData,
  type AuctionScheduleData,
} from '@/components/auction/CreateAuctionModal';
import type { Asset } from '@/types/asset.types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuctionRecord {
  id: string;
  assetId: string;
  title?: string;
  description?: string;
  status: string;
  fractionsAllocated?: number;
  minPurchaseQty?: number;
  maxPurchaseQty?: number;
  startingBidPrice?: number;
  reservePrice?: number;
  minIncrement?: number;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timezone?: string;
  onchainAuctionId?: string | null;
  bidCount?: number;
  currentBidPrice?: number;
  highestBidderName?: string;
  asset?: { id: string; title: string; assetType: string };
}


const AUCTION_STATUS_CFG: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  LIVE:      { bg: '#dcfce7', color: '#15803d', dot: '#16a34a', label: 'Live' },
  ACTIVE:    { bg: '#dcfce7', color: '#15803d', dot: '#16a34a', label: 'Live' },
  DRAFT:     { bg: '#fef9c3', color: '#854d0e', dot: '#ca8a04', label: 'Draft' },
  SCHEDULED: { bg: '#fef9c3', color: '#854d0e', dot: '#ca8a04', label: 'Scheduled' },
  COMPLETED: { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6', label: 'Completed' },
  ENDED:     { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6', label: 'Completed' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444', label: 'Cancelled' },
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// Display the stored date/time exactly as entered — no timezone conversion.
function formatDateTime(date?: string, time?: string): string {
  if (!date) return '-';
  try {
    const [year, month, day] = date.split('-').map(Number);
    const monthStr = new Date(year, month - 1, day).toLocaleString('en-US', { month: 'short' });
    if (!time) return `${monthStr} ${day}, ${year}`;
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${monthStr} ${day}, ${year} • ${h12}:${String(m).padStart(2, '0')} ${period}`;
  } catch {
    return date;
  }
}
// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyAssetsPage() {
  const dispatch = useAppDispatch();
  const { assets, loading: assetsLoading } = useAppSelector((s) => s.assets);

  const [auctions, setAuctions] = useState<AuctionRecord[]>([]);
  const [auctionAsset, setAuctionAsset] = useState<Asset | null>(null);
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    dispatch(fetchAssetsThunk());
    auctionApi
      .list()
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setAuctions(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, [dispatch]);

  // ── Stats ──
  const liveAuctions      = auctions.filter((a) => a.status === 'LIVE' || a.status === 'ACTIVE').length;
  const completedAuctions = auctions.filter((a) => a.status === 'COMPLETED' || a.status === 'ENDED').length;
  const totalAssets       = auctions.length;
  const upcomingAuctions  = auctions.filter((a) => a.status === 'SCHEDULED').length;

  const statCards = [
    { label: 'LIVE AUCTIONS',      value: pad(liveAuctions),      textColor: '#16a34a', bg: '#f0fdf4' },
    { label: 'COMPLETED AUCTIONS', value: pad(completedAuctions), textColor: '#2563eb', bg: '#eff6ff' },
    { label: 'TOTAL ASSETS',       value: pad(totalAssets),       textColor: '#7c3aed', bg: '#f5f3ff' },
    { label: 'UPCOMING AUCTIONS',  value: pad(upcomingAuctions),  textColor: '#b45309', bg: '#fffbeb' },
  ];

  // ── Auction handlers ──
  function buildPayload(assetId: string, data: AuctionScheduleData | AuctionDraftData) {
    const p = data.pricing;
    return {
      assetId,
      title:              data.auctionTitle,
      description:        data.auctionDescription || undefined,
      fractionsAllocated: Number(p.fractionsAllocated),
      minPurchaseQty:     Number(p.minPurchaseQty),
      maxPurchaseQty:     Number(p.maxPurchaseQty),
      startingBidPrice:   Number(p.startingBidPrice),
      reservePrice:       Number(p.reservePrice),
      minIncrement:       Number(p.minIncrement),
      ...('schedule' in data
        ? {
            startDate:     data.schedule.startDate,
            startTime:     data.schedule.startTime,
            endDate:       data.schedule.endDate,
            endTime:       data.schedule.endTime,
            timezone:      data.schedule.timezone,
            showCountdown: data.schedule.showCountdown,
          }
        : { startDate: '', startTime: '', endDate: '', endTime: '', timezone: 'UTC', showCountdown: true }),
    };
  }

  function handleSaveDraft(data: AuctionDraftData) {
    dispatch(saveDraftAuctionThunk(buildPayload(data.assetId, data) as Parameters<typeof saveDraftAuctionThunk>[0]))
      .then((result) => {
        if (saveDraftAuctionThunk.fulfilled.match(result)) {
          setSnack({ msg: 'Auction saved as draft.', severity: 'success' });
          setAuctionAsset(null);
        } else {
          setSnack({ msg: String(result.payload ?? 'Failed to save draft'), severity: 'error' });
        }
      });
  }

  async function handleSchedule(data: AuctionScheduleData) {
    const result = await dispatch(
      createAuctionThunk(buildPayload(data.assetId, data) as Parameters<typeof createAuctionThunk>[0]),
    );
    if (createAuctionThunk.fulfilled.match(result)) {
      setSnack({ msg: 'Auction scheduled successfully!', severity: 'success' });
      setAuctionAsset(null);
      auctionApi
        .list()
        .then((res) => {
          const d = res.data?.data ?? res.data ?? [];
          setAuctions(Array.isArray(d) ? d : []);
        })
        .catch(() => {});
    } else {
      throw new Error(String(result.payload ?? 'Failed to schedule auction'));
    }
  }

  // ── Shared cell styles ──
  const thSx = {
    color: '#6b7280',
    fontWeight: 500,
    fontSize: 13,
    py: 1.5,
    px: 2,
    whiteSpace: 'nowrap' as const,
  };
  const tdSx = { fontSize: 14, py: 1.5, px: 2 };

  if (assetsLoading && assets.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* ── Stats row ── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        {statCards.map(({ label, value, textColor, bg }) => (
          <Paper
            key={label}
            elevation={0}
            sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, bgcolor: bg, border: '1px solid transparent' }}
          >
            <Typography
              sx={{ fontSize: 11, fontWeight: 700, color: textColor, letterSpacing: 0.7, mb: 0.75, opacity: 0.9 }}
            >
              {label}
            </Typography>
            <Typography sx={{ fontSize: { xs: 28, sm: 32 }, fontWeight: 700, color: textColor, lineHeight: 1 }}>
              {value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* ── Launch Auction banner ── */}
  

      {/* ── Recent Assets table ── */}
   

      {/* ── Auctions table ── */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 1, border: '1px solid #e5e7eb', bgcolor: '#fff', overflow: 'hidden', mt: 3 }}
      >
        <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#111' }}>Auctions</Typography>
          <Typography sx={{ fontSize: 13, color: '#6b7280', mt: 0.3 }}>
            All auctions created for your assets.
          </Typography>
        </Box>

        <TableContainer sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
                {['Title', 'Asset', 'Status', 'Start', 'End', 'Fractions', 'Reserve Price', 'Starting Bid'].map(
                  (col) => (
                    <TableCell key={col} sx={thSx}>
                      {col}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {auctions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ border: 0, py: 6, textAlign: 'center' }}>
                    <Typography sx={{ color: '#9ca3af', fontSize: 14 }}>No auctions yet</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                auctions.map((auction) => {
                  const statusKey = auction.status?.toUpperCase();
                  const statusCfg = AUCTION_STATUS_CFG[statusKey] ?? null;
                  const assetTitle =
                    auction.asset?.title ??
                    assets.find((a) => a.id === auction.assetId)?.title ??
                    auction.assetId;

                  return (
                    <TableRow key={auction.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      {/* Title */}
                      <TableCell sx={{ ...tdSx, fontWeight: 500, color: '#111', maxWidth: 180 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#111' }} noWrap>
                          {auction.title || '-'}
                        </Typography>
                        {auction.description && (
                          <Typography sx={{ fontSize: 12, color: '#9ca3af', mt: 0.2 }} noWrap>
                            {auction.description}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Asset */}
                      <TableCell sx={{ ...tdSx, color: '#374151', maxWidth: 150 }}>
                        <Typography sx={{ fontSize: 13 }} noWrap>{assetTitle}</Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell sx={tdSx}>
                        {statusCfg ? (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.75,
                              bgcolor: statusCfg.bg,
                              color: statusCfg.color,
                              px: 1.25,
                              py: 0.4,
                              borderRadius: 5,
                              fontSize: 12,
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: statusCfg.dot, flexShrink: 0 }} />
                            {statusCfg.label}
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>{auction.status}</Typography>
                        )}
                      </TableCell>

                      {/* Start */}
                      <TableCell sx={{ ...tdSx, whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontSize: 13, color: '#374151' }}>
                          {formatDateTime(auction.startDate, auction.startTime)}
                        </Typography>
                        {auction.timezone && (
                          <Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 0.2 }}>
                            {auction.timezone}
                          </Typography>
                        )}
                      </TableCell>

                      {/* End */}
                      <TableCell sx={{ ...tdSx, whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontSize: 13, color: '#374151' }}>
                          {formatDateTime(auction.endDate, auction.endTime)}
                        </Typography>
                        {auction.timezone && (
                          <Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 0.2 }}>
                            {auction.timezone}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Fractions */}
                      <TableCell sx={{ ...tdSx, color: '#374151' }}>
                        {auction.fractionsAllocated != null
                          ? Number(auction.fractionsAllocated).toLocaleString()
                          : '-'}
                      </TableCell>

                      {/* Reserve Price */}
                      <TableCell sx={{ ...tdSx, color: '#374151' }}>
                        {auction.reservePrice != null
                          ? `$${Number(auction.reservePrice).toLocaleString()}`
                          : '-'}
                      </TableCell>

                      {/* Starting Bid */}
                      <TableCell sx={{ ...tdSx, color: '#374151' }}>
                        {auction.startingBidPrice != null
                          ? `$${Number(auction.startingBidPrice).toLocaleString()}`
                          : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Create Auction Modal ── */}
      {auctionAsset && (
        <CreateAuctionModal
          open
          asset={auctionAsset}
          onClose={() => setAuctionAsset(null)}
          onSaveDraft={handleSaveDraft}
          onSchedule={handleSchedule}
        />
      )}

      {/* ── Snackbar ── */}
      <Snackbar
        open={!!snack}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack(null)} severity={snack?.severity ?? 'info'} sx={{ width: '100%' }}>
          {snack?.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
