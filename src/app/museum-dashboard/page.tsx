'use client';

import { useEffect, useState } from 'react';
import {
  Box, Chip, CircularProgress, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  Typography, useMediaQuery, useTheme,
} from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { getMeThunk } from '@/features/auth/authThunks';
import { fetchAssetsThunk } from '@/features/assets/assetThunks';
import CreateAssetModal from '@/components/assets/CreateAssetModal';
import DraftsModal from '@/components/assets/DraftsModal';

/* ── helpers ─────────────────────────────────────────────────── */

const ASSET_TYPE_LABELS: Record<string, string> = {
  REAL_ESTATE:  'Real Estate',
  FINE_ART:     'Fine Art',
  LUXURY_ASSET: 'Luxury Asset',
  LUXURY_WATCH: 'Luxury Watch',
  COLLECTIBLE:  'Collectible',
  OTHER:        'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  FINE_ART:     '#e8d5f5',
  REAL_ESTATE:  '#fde8f0',
  LUXURY_ASSET: '#d5eaf5',
  LUXURY_WATCH: '#dce8f5',
  COLLECTIBLE:  '#d5f5e3',
  OTHER:        '#f5f0d5',
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  DRAFT:     { bg: '#f3f4f6', color: '#374151' },
  REVIEW:    { bg: '#fef3c7', color: '#92400e' },
  LIVE:      { bg: '#dbeafe', color: '#1d4ed8' },
  PUBLISHED: { bg: '#dbeafe', color: '#1d4ed8' },
  TOKENIZED: { bg: '#d1fae5', color: '#065f46' },
  PENDING:   { bg: '#fef3c7', color: '#92400e' },
  AUCTION:   { bg: '#ede9fe', color: '#5b21b6' },
  SOLD:      { bg: '#d1fae5', color: '#065f46' },
  ARCHIVED:  { bg: '#f3f4f6', color: '#9ca3af' },
};

const fmt = (n?: number | null) =>
  n != null && !isNaN(Number(n)) ? `$${Number(n).toLocaleString()}` : '—';

/* ── page ─────────────────────────────────────────────────────── */

export default function MuseumDashboardPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const { user } = useAppSelector((s) => s.auth);
  const { assets } = useAppSelector((s) => s.assets);

  const [createOpen, setCreateOpen] = useState(false);
  const [draftsOpen, setDraftsOpen] = useState(false);

  /* auth guard – step 1: ensure user data is loaded */
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.replace('/'); return; }
    if (!user) {
      dispatch(getMeThunk()).unwrap().catch(() => router.replace('/'));
    }
  }, []);

  /* auth guard – step 2: check museum access once user is known */
  useEffect(() => {
    if (!user) return;
    if (!user.is_museum_user) {
      router.replace('/user-dashboard');
    } else {
      dispatch(fetchAssetsThunk());
    }
  }, [user?.id]);

  if (!user || !user.is_museum_user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  /* derived counts */
  const drafts    = assets.filter((a) => a.status === 'DRAFT');
  const published = assets.filter((a) => a.status === 'PUBLISHED');
  const tokenized = assets.filter((a) => a.status === 'TOKENIZED');

  const totalValue    = assets.reduce((s, a) => s + (Number(a.valuation) || 0), 0);
  const fractionsSold = assets.reduce((s, a) => s + (Number(a.fractionsSold) || 0), 0);

  const displayName = user.firstName
    ? `${user.firstName} ${user.lastName ?? ''}`.trim()
    : user.email ?? 'there';

  /* ── stat cards ── */
  const statCards = [
    {
      key: 'create',
      icon: <AddBoxOutlinedIcon sx={{ fontSize: isMobile ? 24 : 30, color: '#3b82f6', flexShrink: 0 }} />,
      label: 'CREATE ASSET',
      sub: 'Create a new real world asset',
      onClick: () => setCreateOpen(true),
      active: true,
    },
    {
      key: 'drafts',
      icon: <DraftsOutlinedIcon sx={{ fontSize: isMobile ? 24 : 30, color: '#f59e0b', flexShrink: 0 }} />,
      label: 'DRAFTS',
      sub: drafts.length ? `${drafts.length} asset${drafts.length > 1 ? 's' : ''} in drafts` : 'No assets in drafts',
      onClick: () => setDraftsOpen(true),
      active: false,
    },
    {
      key: 'published',
      icon: <FolderOpenOutlinedIcon sx={{ fontSize: isMobile ? 24 : 30, color: '#d97706', flexShrink: 0 }} />,
      label: 'PUBLISHED',
      sub: published.length ? `${published.length} published asset${published.length > 1 ? 's' : ''}` : 'No published assets',
      onClick: undefined,
      active: false,
    },
    {
      key: 'tokenized',
      icon: <TokenOutlinedIcon sx={{ fontSize: isMobile ? 24 : 30, color: '#10b981', flexShrink: 0 }} />,
      label: 'TOKENIZED',
      sub: tokenized.length ? `${tokenized.length} tokenized asset${tokenized.length > 1 ? 's' : ''}` : 'No tokenized assets',
      onClick: undefined,
      active: false,
    },
  ];

  /* ── sidebar stats ── */
  const sideStats = [
    { label: 'TOTAL ASSETS',      value: assets.length ? String(assets.length) : 'No assets yet' },
    { label: 'TOTAL ASSET VALUE', value: totalValue ? fmt(totalValue) : 'No assets yet' },
    { label: 'FRACTIONS SOLD',    value: fractionsSold ? String(fractionsSold) : 'Start tokenization' },
    { label: 'ACTIVE MINTING',    value: 'No minting jobs' },
  ];

  /* ── shared table head cell sx ── */
  const thCellSx = {
    color: '#6b7280', fontWeight: 500,
    fontSize: { xs: 11, sm: 12, md: 13 },
    py: { xs: 1, sm: 1.5 },
    px: { xs: 1.5, sm: 2 },
    whiteSpace: 'nowrap' as const,
  };
  const tdCellSx = {
    fontSize: { xs: 12, sm: 13, md: 14 },
    py: { xs: 1, sm: 1.5 },
    px: { xs: 1.5, sm: 2 },
  };

  return (
    <>
      {/* ── Outer layout ── */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: { xs: 2, sm: 2.5, lg: 3 },
        alignItems: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
      }}>

        {/* ── Main column ── */}
        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>

          {/* Greeting */}
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: { xs: 0.5, sm: 1 },
            mb: { xs: 2, sm: 3 },
          }}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, sm: 18, md: 20 }, color: '#111' }}>
              Hey {displayName}
            </Typography>
            <Typography sx={{ fontSize: { xs: 12, sm: 14, md: 16 }, color: '#6b7280' }}>
              Welcome to LinkBlockAssets
            </Typography>
          </Box>

          {/* ── Sidebar stats: mobile + tablet (hidden on lg+) ── */}
          <Box sx={{
            display: { xs: 'grid', lg: 'none' },
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            },
            gap: { xs: 1.5, sm: 2 },
            mb: { xs: 2, sm: 3 },
          }}>
            {sideStats.map(({ label, value }) => (
              <Paper key={label} elevation={0} sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: { xs: 2, sm: 3 },
                border: '1px solid #e5e7eb',
                bgcolor: '#fff',
                minWidth: 0,
              }}>
                <Typography sx={{
                  fontSize: { xs: 9, sm: 10, md: 11 },
                  fontWeight: 700, color: '#9ca3af',
                  letterSpacing: 0.6, mb: 0.5,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {label}
                </Typography>
                <Typography sx={{
                  fontSize: { xs: 12, sm: 13, md: 15 },
                  fontWeight: 700, color: '#111',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {value}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* ── Action stat cards ── */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 1.5, sm: 2 },
            mb: { xs: 2, sm: 3 },
          }}>
            {statCards.map((card) => (
              <Paper
                key={card.key}
                elevation={0}
                onClick={card.onClick}
                sx={{
                  p: { xs: '10px 12px', sm: 2 },
                  borderRadius: { xs: 2, sm: 3 },
                  border: card.active ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  cursor: card.onClick ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 1.5 },
                  bgcolor: '#fff',
                  minWidth: 0,
                  overflow: 'hidden',
                  transition: 'box-shadow 0.15s',
                  '&:hover': card.onClick ? { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' } : {},
                }}
              >
                <Box sx={{ flexShrink: 0, display: 'flex' }}>{card.icon}</Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{
                    fontSize: { xs: 9, sm: 11, md: 12 },
                    fontWeight: 700,
                    color: card.active ? '#3b82f6' : '#374151',
                    letterSpacing: 0.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {card.label}
                  </Typography>
                  <Typography sx={{
                    fontSize: { xs: 9, sm: 11, md: 12 },
                    color: '#6b7280',
                    mt: 0.25,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {card.sub}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* ── Recent Assets table ── */}
          <Paper elevation={0} sx={{
            borderRadius: { xs: 2, sm: 3 },
            border: '1px solid #e5e7eb',
            mb: { xs: 2, sm: 3 },
            bgcolor: '#fff',
            overflow: 'hidden',
          }}>
            <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 }, pb: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 15, md: 16 }, color: '#111' }}>
                Recent Assets
              </Typography>
              <Typography sx={{ fontSize: { xs: 11, sm: 12, md: 13 }, color: '#6b7280', mt: 0.25 }}>
                Monitor tokenization, compliance, marketplace activity, and investor engagement.
              </Typography>
            </Box>

            <TableContainer sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <Table sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
                    {['Asset', 'Category', 'Valuation', 'Status', 'Jurisdiction'].map((col) => (
                      <TableCell key={col} sx={thCellSx}>
                        <TableSortLabel sx={{ color: '#6b7280 !important', '& .MuiTableSortLabel-icon': { color: '#6b7280 !important' } }}>
                          {col}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ border: 0, py: { xs: 4, sm: 6 }, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                          <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                            <polygon points="24,4 44,24 24,44 4,24" stroke="#3b52a5" strokeWidth="2" fill="none" />
                            <polygon points="24,4 44,24 24,24" stroke="#3b52a5" strokeWidth="1.5" fill="rgba(59,82,165,0.1)" />
                            <polygon points="24,44 4,24 24,24" stroke="#3b52a5" strokeWidth="1.5" fill="rgba(59,82,165,0.15)" />
                          </svg>
                          <Typography sx={{ color: '#3b52a5', fontWeight: 500, fontSize: { xs: 13, sm: 14 } }}>
                            Start your first tokenization draft
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    assets.map((asset) => (
                      <TableRow key={asset.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={{ ...tdCellSx, whiteSpace: 'nowrap' }}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13, md: 14 }, color: '#111', fontWeight: 500 }}>
                            {asset.title}
                          </Typography>
                        </TableCell>
                        <TableCell sx={tdCellSx}>
                          <Chip
                            label={ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType}
                            size="small"
                            sx={{ bgcolor: CATEGORY_COLORS[asset.assetType] ?? '#eee', fontWeight: 500, fontSize: { xs: 10, sm: 11, md: 12 }, border: 'none' }}
                          />
                        </TableCell>
                        <TableCell sx={{ ...tdCellSx, whiteSpace: 'nowrap' }}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: '#374151' }}>
                            {fmt(asset.valuation)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={tdCellSx}>
                          <Chip
                            label={asset.status}
                            size="small"
                            sx={{
                              bgcolor: STATUS_COLORS[asset.status]?.bg ?? '#f3f4f6',
                              color: STATUS_COLORS[asset.status]?.color ?? '#374151',
                              fontWeight: 600,
                              fontSize: { xs: 10, sm: 11 },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ ...tdCellSx, whiteSpace: 'nowrap' }}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: '#6b7280' }}>
                            {asset.jurisdiction ?? '—'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* ── Live Tokenization Pipeline ── */}
          <Paper elevation={0} sx={{
            borderRadius: { xs: 2, sm: 3 },
            border: '1px solid #e5e7eb',
            bgcolor: '#fff',
            overflow: 'hidden',
          }}>
            <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 }, pb: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 15, md: 16 }, color: '#111' }}>
                Live Tokenization Pipeline
              </Typography>
            </Box>

            <TableContainer sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <Table sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
                    {['Asset', 'Category', 'Status', 'Progress', 'Estimated Completion'].map((col) => (
                      <TableCell key={col} sx={thCellSx}>
                        <TableSortLabel sx={{ color: '#6b7280 !important', '& .MuiTableSortLabel-icon': { color: '#6b7280 !important' } }}>
                          {col}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokenized.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ border: 0, py: { xs: 4, sm: 6 }, textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                          <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                            <polygon points="24,4 44,24 24,44 4,24" stroke="#3b52a5" strokeWidth="2" fill="none" />
                            <polygon points="24,4 44,24 24,24" stroke="#3b52a5" strokeWidth="1.5" fill="rgba(59,82,165,0.1)" />
                            <polygon points="24,44 4,24 24,24" stroke="#3b52a5" strokeWidth="1.5" fill="rgba(59,82,165,0.15)" />
                          </svg>
                          <Typography sx={{ color: '#3b52a5', fontWeight: 500, fontSize: { xs: 13, sm: 14 } }}>
                            Start your first tokenization draft
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tokenized.map((asset) => (
                      <TableRow key={asset.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={{ ...tdCellSx, whiteSpace: 'nowrap' }}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13, md: 14 }, color: '#111', fontWeight: 500 }}>
                            {asset.title}
                          </Typography>
                        </TableCell>
                        <TableCell sx={tdCellSx}>
                          <Chip label={ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType} size="small"
                            sx={{ bgcolor: CATEGORY_COLORS[asset.assetType] ?? '#eee', fontWeight: 500, fontSize: { xs: 10, sm: 11, md: 12 } }} />
                        </TableCell>
                        <TableCell sx={tdCellSx}>
                          <Chip label={asset.status} size="small"
                            sx={{ bgcolor: STATUS_COLORS[asset.status]?.bg ?? '#f3f4f6', color: STATUS_COLORS[asset.status]?.color ?? '#374151', fontWeight: 600, fontSize: { xs: 10, sm: 11 } }} />
                        </TableCell>
                        <TableCell sx={tdCellSx}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: '#374151' }}>—</Typography>
                        </TableCell>
                        <TableCell sx={{ ...tdCellSx, whiteSpace: 'nowrap' }}>
                          <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: '#6b7280' }}>—</Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* ── Right sidebar – desktop only (lg+) ── */}
        <Box sx={{
          width: { lg: 210, xl: 230 },
          flexShrink: 0,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          gap: 2,
        }}>
          {sideStats.map(({ label, value }) => (
            <Paper key={label} elevation={0} sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid #e5e7eb',
              bgcolor: '#fff',
            }}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 0.8, mb: 0.75 }}>
                {label}
              </Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111' }}>
                {value}
              </Typography>
            </Paper>
          ))}
        </Box>

      </Box>

      {/* Modals */}
      <CreateAssetModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => dispatch(fetchAssetsThunk())}
      />
      <DraftsModal
        open={draftsOpen}
        onClose={() => setDraftsOpen(false)}
        onEdit={() => {}}
        onTokenize={() => {}}
      />
    </>
  );
}
