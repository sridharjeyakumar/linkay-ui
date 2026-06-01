'use client';

import { useEffect, useState } from 'react';
import {
  Alert, Box, Chip, CircularProgress, Paper, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Typography,
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
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
  status: string;
  endDate?: string;
  endTime?: string;
  bidCount?: number;
  currentBidPrice?: number;
  highestBidderName?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const ASSET_TYPE_LABELS: Record<string, string> = {
  REAL_ESTATE:  'Real Estate',
  FINE_ART:     'Fine Art',
  LUXURY_ASSET: 'Luxury Asset',
  LUXURY_WATCH: 'Luxury Watch',
  COLLECTIBLE:  'Collectible',
  MINERAL:      'Mineral',
  OTHER:        'Other',
};

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  FINE_ART:     { bg: '#f3e8ff', color: '#7c3aed' },
  REAL_ESTATE:  { bg: '#fce7f3', color: '#be185d' },
  LUXURY_ASSET: { bg: '#e0f2fe', color: '#0369a1' },
  LUXURY_WATCH: { bg: '#dbeafe', color: '#1d4ed8' },
  COLLECTIBLE:  { bg: '#dcfce7', color: '#16a34a' },
  MINERAL:      { bg: '#fed7aa', color: '#c2410c' },
  OTHER:        { bg: '#fef9c3', color: '#b45309' },
};

const AUCTION_STATUS_CFG: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  LIVE:      { bg: '#dcfce7', color: '#15803d', dot: '#16a34a', label: 'Live' },
  ACTIVE:    { bg: '#dcfce7', color: '#15803d', dot: '#16a34a', label: 'Live' },
  DRAFT:     { bg: '#fef9c3', color: '#854d0e', dot: '#ca8a04', label: 'Draft' },
  SCHEDULED: { bg: '#fef9c3', color: '#854d0e', dot: '#ca8a04', label: 'Scheduled' },
  COMPLETED: { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6', label: 'Completed' },
  ENDED:     { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6', label: 'Completed' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444', label: 'Cancelled' },
};

const STATUS_SORT_ORDER = ['LIVE', 'ACTIVE', 'SCHEDULED', 'DRAFT', 'COMPLETED', 'ENDED', 'CANCELLED'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatEndTime(endDate?: string, endTime?: string): string {
  if (!endDate) return '-';
  try {
    const iso = endDate.includes('T') ? endDate : `${endDate}T${endTime ?? '00:00'}`;
    const d = new Date(iso);
    const mon = d.toLocaleString('en-US', { month: 'short' });
    const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${mon} ${d.getDate()}, ${d.getFullYear()} • ${time}`;
  } catch {
    return endDate;
  }
}

function isTokenizedApproved(asset: Asset): boolean {
  return (
    asset.tokenization?.tokenizationStatus === 'TREASURY_APPROVED' ||
    asset.tokenization?.tokenizationStatus === 'COMPLETED'
  );
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
  const draftAssets       = assets.filter((a) => a.status === 'DRAFT').length;
  const completedAuctions = auctions.filter((a) => a.status === 'COMPLETED' || a.status === 'ENDED').length;
  const totalAssets       = assets.length;
  const upcomingAuctions  = auctions.filter((a) => a.status === 'SCHEDULED').length;

  const statCards = [
    { label: 'LIVE AUCTIONS',      value: pad(liveAuctions),      textColor: '#16a34a', bg: '#f0fdf4' },
    { label: 'DRAFT ASSETS',       value: pad(draftAssets),       textColor: '#ea580c', bg: '#fff7ed' },
    { label: 'COMPLETED AUCTIONS', value: pad(completedAuctions), textColor: '#2563eb', bg: '#eff6ff' },
    { label: 'TOTAL ASSETS',       value: String(totalAssets),    textColor: '#7c3aed', bg: '#f5f3ff' },
    { label: 'UPCOMING AUCTIONS',  value: pad(upcomingAuctions),  textColor: '#b45309', bg: '#fffbeb' },
  ];

  // ── Banner: tokenized assets with no active/scheduled auction ──
  const activeAuctionAssetIds = new Set(
    auctions
      .filter((a) => a.status === 'LIVE' || a.status === 'ACTIVE' || a.status === 'SCHEDULED')
      .map((a) => a.assetId),
  );
  const readyAssets = assets.filter(
    (a) => isTokenizedApproved(a) && !activeAuctionAssetIds.has(a.id),
  );

  // ── Table rows: each asset paired with its highest-priority auction ──
  const tableRows = assets.map((asset) => {
    const related = auctions
      .filter((a) => a.assetId === asset.id)
      .sort(
        (a, b) =>
          STATUS_SORT_ORDER.indexOf(a.status.toUpperCase()) -
          STATUS_SORT_ORDER.indexOf(b.status.toUpperCase()),
      );
    return { asset, auction: related[0] ?? null };
  });

  // ── Auction handlers (mirrors museum-dashboard) ──
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
      {readyAssets.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: 2,
            p: { xs: '14px 18px', sm: '16px 24px' },
            mb: 3,
            borderRadius: 3,
            border: '1.5px solid #3b6ef8',
            bgcolor: '#fff',
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#111', mb: 0.4 }}>
              Launch Auction
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
              You have {readyAssets.length} tokenized asset{readyAssets.length > 1 ? 's' : ''} ready to go
              live. Start your auction and begin receiving bids from investors.
            </Typography>
          </Box>
          <Box
            component="button"
            onClick={() => setAuctionAsset(readyAssets[0])}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: '#3b6ef8',
              color: '#fff',
              border: 'none',
              borderRadius: 2,
              px: 2.5,
              py: 1.1,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'background 0.15s',
              '&:hover': { bgcolor: '#2d5de0' },
            }}
          >
            <RocketLaunchIcon sx={{ fontSize: 17 }} />
            Create Auction
          </Box>
        </Paper>
      )}

      {/* ── Recent Assets table ── */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 1, border: '1px solid #e5e7eb', bgcolor: '#fff', overflow: 'hidden' }}
      >
        <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#111' }}>Recent Assets</Typography>
          <Typography sx={{ fontSize: 13, color: '#6b7280', mt: 0.3 }}>
            Monitor tokenization, compliance, marketplace activity, and investor engagement.
          </Typography>
        </Box>

        <TableContainer sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
                {['Asset', 'Category', 'Auction Status', 'End Time', 'Bidders', 'Current Bid'].map(
                  (col) => (
                    <TableCell key={col} sx={thSx}>
                      <TableSortLabel
                        sx={{
                          color: '#6b7280 !important',
                          '& .MuiTableSortLabel-icon': { color: '#9ca3af !important' },
                        }}
                      >
                        {col}
                      </TableSortLabel>
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {tableRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ border: 0, py: 6, textAlign: 'center' }}>
                    <Typography sx={{ color: '#9ca3af', fontSize: 14 }}>No assets yet</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tableRows.map(({ asset, auction }) => {
                  const catCfg =
                    CATEGORY_COLORS[asset.assetType] ?? { bg: '#f3f4f6', color: '#374151' };
                  const statusKey = auction?.status?.toUpperCase();
                  const statusCfg = statusKey ? AUCTION_STATUS_CFG[statusKey] : null;

                  return (
                    <TableRow key={asset.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      {/* Asset */}
                      <TableCell sx={{ ...tdSx, color: '#111', fontWeight: 500 }}>
                        {asset.title}
                      </TableCell>

                      {/* Category */}
                      <TableCell sx={tdSx}>
                        <Chip
                          label={ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType}
                          size="small"
                          sx={{
                            bgcolor: catCfg.bg,
                            color: catCfg.color,
                            fontWeight: 500,
                            fontSize: 12,
                            border: 'none',
                          }}
                        />
                      </TableCell>

                      {/* Auction Status */}
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
                            }}
                          >
                            <Box
                              sx={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                bgcolor: statusCfg.dot,
                                flexShrink: 0,
                              }}
                            />
                            {statusCfg.label}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.75,
                              bgcolor: '#f3f4f6',
                              color: '#6b7280',
                              px: 1.25,
                              py: 0.4,
                              borderRadius: 10,
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            <Box
                              sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#d1d5db', flexShrink: 0 }}
                            />
                            Draft
                          </Box>
                        )}
                      </TableCell>

                      {/* End Time */}
                      <TableCell sx={{ ...tdSx, color: '#374151', whiteSpace: 'nowrap' }}>
                        {formatEndTime(auction?.endDate, auction?.endTime)}
                      </TableCell>

                      {/* Bidders */}
                      <TableCell sx={{ ...tdSx, color: '#374151' }}>
                        {auction?.bidCount != null ? auction.bidCount : '-'}
                      </TableCell>

                      {/* Current Bid */}
                      <TableCell sx={tdSx}>
                        {auction?.currentBidPrice != null ? (
                          <Box>
                            {auction.highestBidderName && (
                              <Typography
                                sx={{ fontSize: 13, color: '#111', fontWeight: 500, lineHeight: 1.3 }}
                              >
                                {auction.highestBidderName}
                              </Typography>
                            )}
                            <Typography sx={{ fontSize: 13, color: '#374151', lineHeight: 1.3 }}>
                              ${Number(auction.currentBidPrice).toLocaleString()}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>-</Typography>
                        )}
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
