'use client';

import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton, Snackbar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  Typography, LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import SyncIcon from '@mui/icons-material/Sync';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useRouter } from 'next/navigation';
import SumsubWebSdk from '@sumsub/websdk-react';

import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { getKycStatusThunk, initKycThunk } from '@/features/ekyc/ekycThunks';
import { setKycStatus } from '@/features/ekyc/ekycSlice';
import { getMeThunk, logoutThunk } from '@/features/auth/authThunks';
import { fetchAssetsThunk, deleteAssetThunk, previewAssetThunk } from '@/features/assets/assetThunks';
import { setSelectedAsset } from '@/features/assets/assetSlice';
import type { EkycState } from '@/types/ekyc.types';
import type { Asset } from '@/types/asset.types';

import CreateAssetModal from '@/components/assets/CreateAssetModal';
import DraftsModal from '@/components/assets/DraftsModal';
import AssetPreviewModal from '@/components/assets/AssetPreviewModal';

type KycStatus = EkycState['kycStatus'];

const ASSET_TYPE_LABELS: Record<string, string> = {
  'REAL_ESTATE':  'Real Estate',
  'FINE_ART':     'Fine Art',
  'LUXURY_ASSET': 'Luxury Asset',
  'LUXURY_WATCH': 'Luxury Watch',
  'COLLECTIBLE':  'Collectible',
  'OTHER':        'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  'FINE_ART':     '#e8d5f5',
  'REAL_ESTATE':  '#fde8f0',
  'LUXURY_ASSET': '#d5eaf5',
  'LUXURY_WATCH': '#dce8f5',
  'COLLECTIBLE':  '#d5f5e3',
  'OTHER':        '#f5f0d5',
};

const STATUS_COLORS: Record<string, { bg: string; dot: string }> = {
  DRAFT:    { bg: '#fef9c3', dot: '#ca8a04' },
  REVIEW:   { bg: '#fef3c7', dot: '#d97706' },
  LIVE:     { bg: '#dcfce7', dot: '#16a34a' },
  AUCTION:  { bg: '#dcfce7', dot: '#16a34a' },
  PENDING:  { bg: '#fef3c7', dot: '#d97706' },
  SOLD:     { bg: '#f3f4f6', dot: '#6b7280' },
  ARCHIVED: { bg: '#f3f4f6', dot: '#6b7280' },
};

function StatusChip({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: '#eee', dot: '#999' };
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 0.25,
        borderRadius: 10,
        bgcolor: c.bg,
        fontSize: 12,
        fontWeight: 600,
        color: '#333',
      }}
    >
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: c.dot }} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Box>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, p: 2, mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700, fontSize: 20, mt: 0.5 }}>{value}</Typography>
    </Box>
  );
}

function KycBanner({ status, onStart }: { status: KycStatus; onStart: () => void }) {
  const btn = (label: string) => (
    <Button color="inherit" size="small" variant="outlined" onClick={onStart} sx={{ whiteSpace: 'nowrap' }}>
      {label}
    </Button>
  );
  switch (status) {
    case null:
    case 'NOT_STARTED':
      return <Alert severity="warning" action={btn('Start Verification')}>Identity verification required.</Alert>;
    case 'PENDING':
      return <Alert severity="info">Verification submitted. Under review.</Alert>;
    case 'APPROVED':
      return null;
    case 'REJECTED':
      return (
        <Alert severity="error" action={<Button color="inherit" size="small" variant="outlined" href="mailto:support@linkay.com">Contact Support</Button>}>
          Verification rejected.
        </Alert>
      );
    case 'RESUBMIT_REQUIRED':
      return <Alert severity="warning" action={btn('Resubmit')}>Additional information required.</Alert>;
    default:
      return null;
  }
}

const TABLE_HEAD_SX = { bgcolor: '#f3f4f6' };
const TABLE_HEAD_CELL_SX = { color: '#374151', fontWeight: 600, fontSize: 13 };
const TABLE_SORT_SX = { color: '#374151 !important', '& .MuiTableSortLabel-icon': { color: '#374151 !important' } };

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const { kycStatus, sdkToken, loading: kycLoading } = useAppSelector((s) => s.ekyc);
  const { assets, stats, loading: assetLoading, actionLoading } = useAppSelector((s) => s.assets);

  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [editAsset, setEditAsset] = useState<Asset | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteAsset, setConfirmDeleteAsset] = useState<Asset | null>(null);

  useEffect(() => {
    if (!user) {
      dispatch(getMeThunk()).unwrap().catch(() => router.replace('/login'));
    }
    dispatch(getKycStatusThunk());
    dispatch(fetchAssetsThunk());
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.replace('/login');
  };

  const handleStartKyc = async () => {
    try {
      await dispatch(initKycThunk()).unwrap();
      setKycModalOpen(true);
    } catch { /* surfaced via Redux */ }
  };

  const handleKycMessage = (type: string) => {
    if (type === 'idCheck.onApplicantSubmitted') {
      dispatch(setKycStatus('PENDING'));
      setKycModalOpen(false);
    } else if (type === 'idCheck.onApplicantResubmissionRequested') {
      dispatch(setKycStatus('RESUBMIT_REQUIRED'));
    }
  };

  async function handleDelete(asset: Asset) {
    setConfirmDeleteAsset(asset);
  }

  async function confirmDelete() {
    if (!confirmDeleteAsset) return;
    const id = confirmDeleteAsset.id;
    setConfirmDeleteAsset(null);
    setDeletingId(id);
    try {
      await dispatch(deleteAssetThunk(id)).unwrap();
      toast('Asset deleted.', 'success');
    } catch {
      toast('Failed to delete asset.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  async function handlePreview(assetId: string) {
    try {
      await dispatch(previewAssetThunk(assetId)).unwrap();
    } catch {
      toast('Failed to load preview.', 'error');
    }
  }

  function handleEdit(asset: Asset) {
    dispatch(setSelectedAsset(asset));
    setEditAsset(asset);
    setCreateOpen(true);
  }

  function handleTokenize(asset: Asset) {
    setDraftsOpen(false);
    toast(`Tokenize flow for "${asset.title}" — coming soon.`, 'success');
  }

  function toast(msg: string, severity: 'success' | 'error') {
    setToastMsg(msg);
    setToastSeverity(severity);
  }

  const drafts = assets.filter((a) => a.status === 'DRAFT');
  const recentAssets = assets.slice(0, 10);

  const fmtValue = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M USD`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K USD`;
    return `${v} USD`;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Top Nav */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 },
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'grey.100',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4,6px)', gap: '3px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main', opacity: 0.6 + (i % 3) * 0.2 }} />
            ))}
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            <Typography component="span" color="primary.main" sx={{ fontWeight: 700, fontSize: 18 }}>Link</Typography>
            BlockAssets
          </Typography>
        </Box>

        {/* Nav links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
          {['Dashboard', 'My Assets', 'Investors', 'Analytics', 'Logs', 'Settings'].map((item) => (
            <Typography
              key={item}
              variant="body2"
              sx={{
                cursor: 'pointer',
                fontWeight: item === 'Dashboard' ? 700 : 400,
                borderBottom: item === 'Dashboard' ? '2px solid' : 'none',
                borderColor: 'primary.main',
                pb: 0.25,
                color: item === 'Dashboard' ? 'text.primary' : 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {/* Right: bell + user */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="small">
            <NotificationsNoneIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {user?.firstName?.[0]?.toUpperCase() ?? 'L'}
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
                {user?.firstName ?? 'Linkay'} {user?.lastName ?? ''}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 11, lineHeight: 1.2 }}>
                {user?.role?.replace('_', ' ') ?? ''}
              </Typography>
            </Box>
          </Box>
          <Button variant="outlined" size="small" color="error" onClick={handleLogout}>Logout</Button>
        </Box>
      </Box>

      {/* Body: main content + sidebar */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, px: { xs: 2, md: 4 }, py: 3, gap: 3 }}>
        {/* Main content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* KYC Banner */}
          {kycStatus && kycStatus !== 'APPROVED' && (
            <Box sx={{ mb: 2 }}>
              <KycBanner status={kycStatus} onStart={handleStartKyc} />
            </Box>
          )}

          {/* Welcome */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
              Hey {user?.firstName ?? 'Linkay'}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 15 }}>
              Welcome to LinkBlockAssets
            </Typography>
          </Box>

          {/* Action cards */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
            {/* Create Asset */}
            <Box
              onClick={() => { setEditAsset(null); setCreateOpen(true); }}
              sx={{
                flex: 1,
                border: '2px solid #6C63FF',
                borderRadius: 3,
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                bgcolor: '#f0efff',
                '&:hover': { bgcolor: '#e8e7ff' },
                transition: 'background 0.2s',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px dashed #6C63FF',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#e8e7ff',
                  flexShrink: 0,
                }}
              >
                <AddIcon sx={{ color: '#6C63FF', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#6C63FF' }}>
                  Create Asset
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.25 }}>
                  Create and tokenize a new real world asset
                </Typography>
              </Box>
            </Box>

            {/* Drafts */}
            <Box
              onClick={() => setDraftsOpen(true)}
              sx={{
                flex: 1,
                border: '1px solid #e5e7eb',
                borderRadius: 3,
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                bgcolor: '#fff',
                '&:hover': { bgcolor: '#fffbeb' },
                transition: 'background 0.2s',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px dashed #f59e0b',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#fffbeb',
                  flexShrink: 0,
                }}
              >
                <DiamondOutlinedIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#f59e0b' }}>
                  Drafts
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.25 }}>
                  {drafts.length === 0 ? 'Currently no drafts' : `${String(drafts.length).padStart(2, '0')} draft${drafts.length !== 1 ? 's' : ''}`}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Recent Assets table */}
          <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <Box sx={{ p: 2.5, pb: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>Recent Assets</Typography>
              <Typography variant="caption" color="text.secondary">
                Monitor tokenization, compliance, marketplace activity, and investor engagement.
              </Typography>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={TABLE_HEAD_SX}>
                    {['Asset', 'Category', 'Valuation', 'Status', 'Jurisdiction', 'Actions'].map((col) => (
                      <TableCell key={col} sx={TABLE_HEAD_CELL_SX}>
                        {col !== 'Actions' ? (
                          <TableSortLabel sx={TABLE_SORT_SX}>{col}</TableSortLabel>
                        ) : col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assetLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                  ) : recentAssets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                          <DiamondOutlinedIcon sx={{ fontSize: 44, color: 'primary.main', opacity: 0.5 }} />
                          <Typography color="primary.main" sx={{ fontWeight: 500 }}>
                            Start your first tokenization draft
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentAssets.map((asset) => (
                      <TableRow key={asset.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Typography sx={{ fontSize: 14 }}>{asset.title}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType}
                            size="small"
                            sx={{ bgcolor: CATEGORY_COLORS[asset.assetType] ?? '#eee', fontWeight: 500, fontSize: 12 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: 13 }}>
                            {asset.valuation ? `$${Number(asset.valuation).toLocaleString()}` : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={asset.status} />
                        </TableCell>
                        <TableCell>
                          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                            {asset.jurisdiction ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.75 }}>
                            <IconButton
                              size="small"
                              title="Preview"
                              onClick={() => handlePreview(asset.id)}
                              sx={{ bgcolor: '#eff6ff', color: '#3b82f6', borderRadius: 1.5, '&:hover': { bgcolor: '#dbeafe' } }}
                            >
                              <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              title="Edit"
                              onClick={() => handleEdit(asset)}
                              sx={{ bgcolor: '#fef9c3', color: '#ca8a04', borderRadius: 1.5, '&:hover': { bgcolor: '#fef08a' } }}
                            >
                              <EditOutlinedIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              title="Delete"
                              onClick={() => handleDelete(asset)}
                              disabled={actionLoading || deletingId === asset.id}
                              sx={{ bgcolor: '#fef2f2', color: '#ef4444', borderRadius: 1.5, '&:hover': { bgcolor: '#fee2e2' } }}
                            >
                              {deletingId === asset.id ? (
                                <CircularProgress size={14} sx={{ color: '#ef4444' }} />
                              ) : (
                                <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                              )}
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Live Tokenization Pipeline */}
          <Box sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2.5, pb: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>Live Tokenization Pipeline</Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={TABLE_HEAD_SX}>
                    {['Asset', 'Category', 'Status', 'Progress', 'Estimated Completion'].map((col) => (
                      <TableCell key={col} sx={TABLE_HEAD_CELL_SX}>
                        <TableSortLabel sx={TABLE_SORT_SX}>{col}</TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.filter((a) => a.status === 'PENDING').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                          <SyncIcon sx={{ fontSize: 36, color: 'primary.main', opacity: 0.4, animation: 'spin 2s linear infinite', '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } }} />
                          <Typography color="primary.main" sx={{ fontWeight: 500 }}>
                            Start your first tokenization draft
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    assets
                      .filter((a) => a.status === 'PENDING')
                      .map((asset) => (
                        <TableRow key={asset.id} hover>
                          <TableCell><Typography sx={{ fontSize: 14 }}>{asset.title}</Typography></TableCell>
                          <TableCell>
                            <Chip
                              label={ASSET_TYPE_LABELS[asset.assetType] ?? asset.assetType}
                              size="small"
                              sx={{ bgcolor: CATEGORY_COLORS[asset.assetType] ?? '#eee', fontWeight: 500, fontSize: 12 }}
                            />
                          </TableCell>
                          <TableCell><Typography sx={{ fontSize: 13 }}>Smart Contract Deployment</Typography></TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress variant="determinate" value={82} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                              <Typography sx={{ fontSize: 12 }}>82%</Typography>
                            </Box>
                          </TableCell>
                          <TableCell><Typography color="text.secondary" sx={{ fontSize: 13 }}>12 mins</Typography></TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

        {/* Right Sidebar — stats */}
        <Box sx={{ width: { xs: '100%', lg: 200 }, flexShrink: 0 }}>
          <StatCard label="Total Assets" value={stats.totalAssets === 0 ? 'No assets yet' : `${stats.totalAssets} assets`} />
          <StatCard label="Total Asset Value" value={stats.totalAssetValue === 0 ? 'No assets yet' : fmtValue(stats.totalAssetValue)} />
          <StatCard label="Fractions Sold" value={stats.fractionsSold === 0 ? 'Start tokenization' : stats.fractionsSold.toLocaleString()} />
          <StatCard label="Active Minting" value={stats.activeMinting === 0 ? 'No minting jobs' : `${String(stats.activeMinting).padStart(2, '0')} minting`} />
        </Box>
      </Box>

      {/* KYC Modal */}
      <Dialog open={kycModalOpen} onClose={() => setKycModalOpen(false)} maxWidth="md" fullWidth disableScrollLock>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Identity Verification
          <IconButton onClick={() => setKycModalOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, minHeight: 500 }}>
          {sdkToken && (
            <SumsubWebSdk
              accessToken={sdkToken}
              expirationHandler={async () => {
                const result = await dispatch(initKycThunk()).unwrap();
                return result.sdkToken;
              }}
              config={{ levelName: 'id-and-liveness' }}
              onMessage={(type: string) => handleKycMessage(type)}
              onError={(err: unknown) => { console.error('[Sumsub]', err); setKycModalOpen(false); }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDeleteAsset} onClose={() => setConfirmDeleteAsset(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 16 }}>Delete Asset</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#374151' }}>
            Are you sure you want to delete{' '}
            <Typography component="span" sx={{ fontWeight: 700 }}>
              &ldquo;{confirmDeleteAsset?.title}&rdquo;
            </Typography>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button variant="outlined" onClick={() => setConfirmDeleteAsset(null)} sx={{ borderColor: '#d1d5db', color: '#374151', borderRadius: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={confirmDelete} sx={{ borderRadius: 2 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create / Edit Asset Modal */}
      <CreateAssetModal
        open={createOpen}
        onClose={() => { setCreateOpen(false); setEditAsset(null); }}
        editAsset={editAsset}
        onSuccess={() => toast(editAsset ? 'Asset updated.' : 'Asset created.', 'success')}
      />

      {/* Drafts Modal */}
      <DraftsModal
        open={draftsOpen}
        onClose={() => setDraftsOpen(false)}
        onEdit={handleEdit}
        onTokenize={handleTokenize}
      />

      {/* Asset Preview Modal */}
      <AssetPreviewModal />

      {/* Toast */}
      <Snackbar
        open={!!toastMsg}
        autoHideDuration={4000}
        onClose={() => setToastMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toastSeverity} onClose={() => setToastMsg(null)}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
