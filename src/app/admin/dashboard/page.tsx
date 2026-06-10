'use client';

import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  useMediaQuery,
  useTheme,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Skeleton,
} from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import {
  fetchAdminQueueThunk,
  fetchAdminStatsThunk,
  approveTreasuryThunk,
  rejectTreasuryThunk,
  fetchFullAssetThunk,
} from '@/features/admin/adminThunks';
import type { PendingAsset, FullAssetDetail } from '@/features/admin/adminSlice';

/* ─── Helpers ─────────────────────────────────────────────── */

function formatValue(v: number | null): string {
  if (v == null) return '—';
  return `$${v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatValuation(v: number | null): string {
  if (v == null) return '—';
  return `$${Number(v).toLocaleString()}`;
}

function parseMediaFiles(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return (raw as string[]).filter(Boolean);
  if (typeof raw === 'string') {
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p.filter(Boolean) : []; }
    catch { return []; }
  }
  return [];
}

/* ─── Sub-components ──────────────────────────────────────── */

function TopStatCard({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <Paper elevation={0} sx={{ border: '1px solid #E8E8E8', borderRadius: '10px', bgcolor: '#FFFFFF', p: { xs: '14px 16px', sm: '18px 22px' }, textAlign: 'center', height: '100%' }}>
      <Typography sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 500, color: '#999999', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', mb: '8px', lineHeight: 1.4 }}>
        {label}
      </Typography>
      {loading
        ? <Skeleton variant="text" width={60} height={36} sx={{ mx: 'auto' }} />
        : <Typography sx={{ fontSize: { xs: '24px', sm: '28px', md: '30px' }, fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>{value}</Typography>
      }
    </Paper>
  );
}

function SideStatCard({ label, value, loading }: { label: string; value: string; loading?: boolean }) {
  return (
    <Paper elevation={0} sx={{ border: '1px solid #E8E8E8', borderRadius: '10px', bgcolor: '#FFFFFF', p: { xs: '14px 16px', sm: '18px 22px' } }}>
      <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#999999', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', mb: '8px', lineHeight: 1.4 }}>
        {label}
      </Typography>
      {loading
        ? <Skeleton variant="text" width={80} height={30} />
        : <Typography sx={{ fontSize: { xs: '22px', sm: '24px', md: '26px' }, fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>{value}</Typography>
      }
    </Paper>
  );
}

function CategoryBadge({ category }: { category: string | null }) {
  const label = category ?? 'Asset';
  const isCollectible = label === 'Collectible' || label === 'Artwork' || label === 'Artifact';
  return (
    <Box component="span" sx={{ display: 'inline-block', px: '12px', py: '4px', borderRadius: '12px', bgcolor: isCollectible ? '#EDE9FE' : '#FCE7F3', color: isCollectible ? '#7C3AED' : '#BE185D', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
      {label}
    </Box>
  );
}

/* ─── Approve Modal ───────────────────────────────────────── */

function ApproveModal({ assetTitle, open, onClose, onConfirm, loading }: {
  assetTitle: string; open: boolean; onClose: () => void; onConfirm: () => void; loading: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px', m: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } } }}>
      <DialogContent sx={{ p: '24px', position: 'relative' }}>
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', top: '12px', right: '12px', color: '#9CA3AF', '&:hover': { color: '#374151', bgcolor: '#F3F4F6' } }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
        <Box sx={{ width: '40px', height: '40px', borderRadius: '10px', bgcolor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '16px' }}>
          <WarningAmberIcon sx={{ fontSize: '22px', color: '#F97316' }} />
        </Box>
        <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', mb: '10px', pr: '24px', lineHeight: 1.4 }}>
          Are you sure you want to approve &ldquo;{assetTitle}&rdquo;
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, mb: '24px' }}>
          You are about to approve this tokenized asset for auction eligibility. Once approved, the asset owner will be allowed to configure and submit auctions for investor participation. Action cannot be undone
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button onClick={onClose} disabled={loading} sx={{ color: '#374151', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', textTransform: 'none', px: '4px', py: '8px', minWidth: 0, '&:hover': { bgcolor: 'transparent' } }}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading} variant="contained" startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
            sx={{ background: 'linear-gradient(90deg, #FBBE24 0%, #EF4444 100%)', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', textTransform: 'none', borderRadius: '20px', px: '16px', py: '8px', boxShadow: 'none', '&:hover': { background: 'linear-gradient(90deg, #F0B420 0%, #DC2626 100%)', boxShadow: 'none' } }}>
            Approve Asset
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Decline Modal ───────────────────────────────────────── */

function DeclineModal({ open, onClose, onConfirm, loading }: {
  open: boolean; onClose: () => void; onConfirm: (reason: string) => void; loading: boolean;
}) {
  const [reason, setReason] = useState('');
  const MIN = 5;
  const MAX = 500;
  const trimmed = reason.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN;
  const isValid  = trimmed.length >= MIN && trimmed.length <= MAX;

  const handleClose = () => { setReason(''); onClose(); };
  const handleConfirm = () => { if (isValid) onConfirm(reason); };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: '14px', m: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } } }}>
      <DialogContent sx={{ p: '24px', position: 'relative' }}>
        <IconButton onClick={handleClose} size="small" sx={{ position: 'absolute', top: '12px', right: '12px', color: '#9CA3AF', '&:hover': { color: '#374151', bgcolor: '#F3F4F6' } }}>
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>
        <Box sx={{ width: '40px', height: '40px', borderRadius: '10px', bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '16px' }}>
          <WarningAmberIcon sx={{ fontSize: '22px', color: '#EF4444' }} />
        </Box>
        <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', mb: '4px', pr: '24px' }}>
          Decline Asset Submission
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', mb: '20px', lineHeight: 1.5 }}>
          The asset will remain unavailable for auction creation
        </Typography>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', mb: '8px' }}>
          Reason for Decline
        </Typography>
        <TextField fullWidth multiline rows={3} placeholder="Enter reason here" value={reason}
          onChange={(e) => { if (e.target.value.length <= MAX) setReason(e.target.value); }}
          error={tooShort}
          helperText={
            tooShort
              ? `Minimum ${MIN} characters required`
              : undefined
          }
          sx={{ mb: '8px', '& .MuiOutlinedInput-root': { borderRadius: '8px', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#374151', '& fieldset': { borderColor: '#E5E7EB' }, '&:hover fieldset': { borderColor: '#D1D5DB' }, '&.Mui-focused fieldset': { borderColor: '#9CA3AF', borderWidth: '1px' } }, '& .MuiOutlinedInput-input::placeholder': { color: '#9CA3AF', opacity: 1 } }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '16px' }}>
          <Typography sx={{ fontSize: 11, color: reason.length >= MAX ? '#ef4444' : '#9ca3af', fontFamily: 'Inter, sans-serif' }}>
            {reason.length} / {MAX}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button onClick={handleClose} disabled={loading} sx={{ color: '#374151', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px', textTransform: 'none', px: '4px', py: '8px', minWidth: 0, '&:hover': { bgcolor: 'transparent' } }}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading || !isValid} variant="contained" startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <CancelIcon sx={{ fontSize: '16px !important' }} />}
            sx={{ bgcolor: '#EF4444', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', textTransform: 'none', borderRadius: '20px', px: '16px', py: '8px', boxShadow: 'none', '&:hover': { bgcolor: '#DC2626', boxShadow: 'none' } }}>
            Decline Asset
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Detail Row helper ───────────────────────────────────── */

function DetailRow({ label, value, full }: { label: string; value: string | null | undefined; full?: boolean }) {
  if (!value) return null;
  return (
    <Box sx={{ gridColumn: full ? '1 / -1' : undefined }}>
      <Typography sx={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', mb: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</Typography>
      <Typography sx={{ fontSize: '12px', color: '#111111', fontFamily: 'Inter, sans-serif', fontWeight: 500, wordBreak: 'break-word', lineHeight: 1.5 }}>{value}</Typography>
    </Box>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', fontFamily: 'Inter, sans-serif', letterSpacing: '0.7px', textTransform: 'uppercase', px: '18px', pt: '14px', pb: '8px', bgcolor: '#F9FAFB', borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0' }}>
      {children}
    </Typography>
  );
}

/* ─── View Modal ──────────────────────────────────────────── */

function ViewModal({ asset, loading, open, onClose, onApprove, onReject }: {
  asset: FullAssetDetail | null; loading: boolean; open: boolean; onClose: () => void; onApprove: () => void; onReject: () => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = asset ? parseMediaFiles(asset.mediaFiles) : [];
  const GRADIENTS = [
    'linear-gradient(135deg, #8B6914 0%, #C4956A 40%, #7B5C8D 80%, #4A3B6B 100%)',
    'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #0EA5E9 100%)',
    'linear-gradient(135deg, #92400E 0%, #D97706 50%, #B45309 100%)',
    'linear-gradient(135deg, #374151 0%, #6B7280 50%, #9CA3AF 100%)',
    'linear-gradient(135deg, #065F46 0%, #10B981 50%, #6EE7B7 100%)',
  ];
  const fallbackGradient = asset
    ? GRADIENTS[asset.title.charCodeAt(0) % GRADIENTS.length]
    : 'linear-gradient(135deg, #374151 0%, #6B7280 100%)';

  const perFraction = asset?.totalFractions && asset?.valuation
    ? `$${(asset.valuation / asset.totalFractions).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : '—';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: fullScreen ? 0 : '12px',
            overflow: 'hidden',
            m: fullScreen ? 0 : '16px',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: fullScreen ? '100vh' : 'calc(100vh - 32px)',
          },
        },
      }}
    >

      {/* ══ Sticky header ════════════════════════════════════════ */}
      <Box sx={{ flexShrink: 0, position: 'relative', bgcolor: '#FFFFFF' }}>

        {/* X close button — nudged inward */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 10,
            bgcolor: 'rgba(255,255,255,0.9)',
            width: '28px',
            height: '28px',
            '&:hover': { bgcolor: '#F3F4F6' },
          }}
        >
          <CloseIcon sx={{ fontSize: '16px', color: '#374151' }} />
        </IconButton>

        {/* Hero image carousel */}
        <Box sx={{ position: 'relative', width: '100%', height: { xs: '120px', sm: '140px' }, bgcolor: '#f3f4f6', overflow: 'hidden' }}>
          {images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[activeIndex]}
              alt={asset?.title ?? ''}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <Box sx={{ width: '100%', height: '100%', background: fallbackGradient }} />
          )}

          {/* Left arrow */}
          {images.length > 1 && activeIndex > 0 && (
            <IconButton onClick={() => setActiveIndex(i => i - 1)} size="small"
              sx={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', p: 0.25, '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' } }}>
              <ChevronLeftIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          {/* Right arrow */}
          {images.length > 1 && activeIndex < images.length - 1 && (
            <IconButton onClick={() => setActiveIndex(i => i + 1)} size="small"
              sx={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', p: 0.25, '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' } }}>
              <ChevronRightIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <Box sx={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.5 }}>
              {images.map((_, i) => (
                <Box key={i} onClick={() => setActiveIndex(i)} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.45)', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.15)' }} />
              ))}
            </Box>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <Box sx={{ position: 'absolute', top: 6, right: 8, bgcolor: 'rgba(0,0,0,0.45)', borderRadius: '4px', px: 0.75, py: 0.25 }}>
              <Typography sx={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>
                {activeIndex + 1} / {images.length}
              </Typography>
            </Box>
          )}

          {/* View full (lightbox) */}
          {images.length > 0 && (
            <Box onClick={() => setLightboxOpen(true)} sx={{ position: 'absolute', bottom: 6, right: 8, bgcolor: 'rgba(0,0,0,0.45)', borderRadius: '4px', px: 0.75, py: 0.25, cursor: 'zoom-in' }}>
              <Typography sx={{ fontSize: 10, color: '#fff', fontWeight: 600, letterSpacing: 0.3 }}>VIEW FULL</Typography>
            </Box>
          )}
        </Box>

        {/* Lightbox */}
        {images.length > 0 && (
          <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth={false}
            slotProps={{
              paper: { sx: { bgcolor: 'transparent', boxShadow: 'none', m: 0, overflow: 'hidden', width: '100vw', maxWidth: '100vw', height: '100vh', maxHeight: '100vh' } },
              backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' } },
            }}>
            <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              {/* Close */}
              <IconButton onClick={() => setLightboxOpen(false)}
                sx={{ position: 'absolute', top: 16, right: 16, color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}>
                <CloseIcon sx={{ fontSize: 22 }} />
              </IconButton>

              {/* Counter */}
              {images.length > 1 && (
                <Typography sx={{ position: 'absolute', top: 20, left: 20, color: '#fff', fontSize: 13, fontWeight: 600 }}>
                  {activeIndex + 1} / {images.length}
                </Typography>
              )}

              {/* Left arrow */}
              {images.length > 1 && activeIndex > 0 && (
                <IconButton onClick={() => setActiveIndex(i => i - 1)}
                  sx={{ position: 'absolute', left: 16, color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}>
                  <ChevronLeftIcon sx={{ fontSize: 28 }} />
                </IconButton>
              )}

              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[activeIndex]} alt={asset?.title ?? ''}
                style={{ maxWidth: '85vw', maxHeight: '80vh', display: 'block', borderRadius: 8, objectFit: 'contain' }} />

              {/* Right arrow */}
              {images.length > 1 && activeIndex < images.length - 1 && (
                <IconButton onClick={() => setActiveIndex(i => i + 1)}
                  sx={{ position: 'absolute', right: 16, color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}>
                  <ChevronRightIcon sx={{ fontSize: 28 }} />
                </IconButton>
              )}

              {/* Dots */}
              {images.length > 1 && (
                <Box sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.75 }}>
                  {images.map((_, i) => (
                    <Box key={i} onClick={() => setActiveIndex(i)}
                      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'background-color 0.2s' }} />
                  ))}
                </Box>
              )}
            </Box>
          </Dialog>
        )}

        {/* Title & summary — only shown once loaded */}
        {!loading && asset && (
          <>
            <Box sx={{ px: '18px', pt: '14px', pb: '14px', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '17px', fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', mb: '4px' }}>
                {asset.title}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#777777', fontFamily: 'Inter, sans-serif', mb: '2px' }}>
                {asset.assetType ?? '—'}{asset.jurisdiction ? ` · ${asset.jurisdiction}` : ''}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#777777', fontFamily: 'Inter, sans-serif' }}>
                {formatValuation(asset.valuation)} · {asset.totalFractions ?? '—'} fractions · {perFraction}/fraction
              </Typography>
            </Box>
            <Box sx={{ height: '1px', bgcolor: '#F0F0F0' }} />
          </>
        )}
      </Box>

      {/* ══ Scrollable body ══════════════════════════════════════ */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#D1D5DB', borderRadius: '4px' },
          scrollbarWidth: 'thin',
          scrollbarColor: '#D1D5DB transparent',
        }}
      >
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: '48px' }}>
            <CircularProgress size={32} sx={{ color: '#2563EB' }} />
          </Box>
        )}

        {!loading && asset && (
          <>
            {asset.description && (
              <>
                <SectionTitle>Description</SectionTitle>
                <Box sx={{ px: '18px', py: '12px' }}>
                  <Typography sx={{ fontSize: '12px', color: '#555555', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>{asset.description}</Typography>
                </Box>
              </>
            )}

            {asset.historicalContext && (
              <>
                <SectionTitle>Historical Context</SectionTitle>
                <Box sx={{ px: '18px', py: '12px' }}>
                  <Typography sx={{ fontSize: '12px', color: '#555555', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>{asset.historicalContext}</Typography>
                </Box>
              </>
            )}

            {asset.conditionReport && (
              <>
                <SectionTitle>Condition Report</SectionTitle>
                <Box sx={{ px: '18px', py: '12px' }}>
                  <Typography sx={{ fontSize: '12px', color: '#555555', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>{asset.conditionReport}</Typography>
                </Box>
              </>
            )}

            {(asset.certificationRef || asset.jurisdiction || asset.custodian || asset.ownershipEntity) && (
              <>
                <SectionTitle>Asset Details</SectionTitle>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', px: '18px', py: '14px' }}>
                  <DetailRow label="Certification Ref" value={asset.certificationRef} />
                  <DetailRow label="Jurisdiction"       value={asset.jurisdiction} />
                  <DetailRow label="Custodian"          value={asset.custodian} />
                  <DetailRow label="Ownership Entity"   value={asset.ownershipEntity} />
                </Box>
              </>
            )}

            {(() => {
              const raw = asset.dynamicFields as unknown;
              const fields: Array<{ fieldLabel?: string; fieldKey: string; fieldValue: unknown }> = Array.isArray(raw)
                ? raw
                : typeof raw === 'string'
                  ? (() => { try { return JSON.parse(raw); } catch { return []; } })()
                  : [];
              const visible = fields.filter((f) => f.fieldValue !== null && f.fieldValue !== undefined && String(f.fieldValue).trim() !== '');
              if (visible.length === 0) return null;
              return (
                <>
                  {/* <SectionTitle>Custom Fields</SectionTitle> */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', px: '18px', py: '14px' }}>
                    {visible.map((f, i) => (
                      <DetailRow key={i} label={f.fieldLabel || f.fieldKey} value={String(f.fieldValue)} />
                    ))}
                  </Box>
                </>
              );
            })()}

            {asset.ownershipSplit && asset.ownershipSplit.length > 0 && (
              <>
                <SectionTitle>Ownership Split</SectionTitle>
                <Box sx={{ px: '18px', py: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {asset.ownershipSplit.map((o, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '10px 12px', bgcolor: '#F9FAFB', borderRadius: '8px', border: '1px solid #F0F0F0' }}>
                      <Box>
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#111111', fontFamily: 'Inter, sans-serif' }}>{o.ownerName || '—'}</Typography>
                        <Typography sx={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>{o.ownerType || '—'}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#2563EB', fontFamily: 'Inter, sans-serif' }}>{o.percentage ?? '—'}%</Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </>
        )}
      </Box>

      {/* ══ Fixed footer ═════════════════════════════════════════ */}
      <Box
        sx={{
          flexShrink: 0,
          borderTop: '1px solid #F0F0F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: '18px',
          py: '14px',
          gap: '8px',
          bgcolor: '#FFFFFF',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size="small"
          sx={{ bgcolor: '#374151', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', textTransform: 'none', borderRadius: '8px', px: '20px', py: '8px', boxShadow: 'none', flex: { xs: '1 1 100%', sm: '0 0 auto' }, '&:hover': { bgcolor: '#1F2937', boxShadow: 'none' } }}
        >
          Close
        </Button>
        <Box sx={{ display: 'flex', gap: '8px', flex: { xs: '1 1 100%', sm: '0 0 auto' }, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
          <Button
            variant="contained"
            size="small"
            onClick={onReject}
            disabled={loading || !asset}
            sx={{ bgcolor: '#EF4444', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', textTransform: 'none', borderRadius: '8px', px: '20px', py: '8px', boxShadow: 'none', flex: { xs: 1, sm: '0 0 auto' }, '&:hover': { bgcolor: '#DC2626', boxShadow: 'none' }, '&.Mui-disabled': { bgcolor: '#FCA5A5', color: '#FFFFFF' } }}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={onApprove}
            disabled={loading || !asset}
            sx={{ bgcolor: '#2563EB', color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px', textTransform: 'none', borderRadius: '8px', px: '20px', py: '8px', boxShadow: 'none', flex: { xs: 1, sm: '0 0 auto' }, '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' }, '&.Mui-disabled': { bgcolor: '#93C5FD', color: '#FFFFFF' } }}
          >
            Approve
          </Button>
        </Box>
      </Box>

    </Dialog>
  );
}

/* ─── Page ────────────────────────────────────────────────── */

export default function AdminDashboardPage() {
  const dispatch    = useAppDispatch();
  const { user }    = useAppSelector((s) => s.auth);
  const { queue, loadingQueue, stats, loadingStats, reviewingIds, selectedFullAsset, loadingFullAsset } = useAppSelector((s) => s.admin);

  const [selectedAsset, setSelectedAsset] = useState<PendingAsset | null>(null);
  const [viewOpen,    setViewOpen]    = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [snack, setSnack] = useState<{ msg: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    dispatch(fetchAdminQueueThunk());
    dispatch(fetchAdminStatsThunk());
  }, [dispatch]);

  const reviewingId = selectedFullAsset?.id ?? selectedAsset?.id ?? '';
  const isReviewing = reviewingId ? reviewingIds.includes(reviewingId) : false;

  function handleView(asset: PendingAsset) {
    setSelectedAsset(asset);
    setViewOpen(true);
    dispatch(fetchFullAssetThunk(asset.id));
  }

  function handleOpenApprove() {
    setViewOpen(false);
    setApproveOpen(true);
  }

  function handleOpenDecline() {
    setViewOpen(false);
    setDeclineOpen(true);
  }

  async function handleApproveConfirm() {
    const id    = selectedFullAsset?.id    ?? selectedAsset?.id;
    const title = selectedFullAsset?.title ?? selectedAsset?.title ?? '';
    if (!id) return;
    const result = await dispatch(approveTreasuryThunk(id));
    if (approveTreasuryThunk.fulfilled.match(result)) {
      setApproveOpen(false);
      setSelectedAsset(null);
      setSnack({ msg: `"${title}" approved successfully`, severity: 'success' });
    } else {
      setSnack({ msg: String(result.payload ?? 'Approval failed'), severity: 'error' });
    }
  }

  async function handleDeclineConfirm(reason: string) {
    const id    = selectedFullAsset?.id    ?? selectedAsset?.id;
    const title = selectedFullAsset?.title ?? selectedAsset?.title ?? '';
    if (!id) return;
    const result = await dispatch(rejectTreasuryThunk({ assetId: id, reason }));
    if (rejectTreasuryThunk.fulfilled.match(result)) {
      setDeclineOpen(false);
      setSelectedAsset(null);
      setSnack({ msg: `"${title}" declined`, severity: 'success' });
    } else {
      setSnack({ msg: String(result.payload ?? 'Decline failed'), severity: 'error' });
    }
  }

  const TABLE_COLS = ['Tokenized Asset', 'Asset Owner', 'Valuation', 'Category', 'Actions'];

  // Only show items still awaiting a platform decision — hide anything already approved or rejected
const pendingQueue = queue.filter(
    (a) =>
      a.tokenization?.tokenizationStatus === 'TREASURY_PENDING'
  );

  return (
    <Box sx={{ bgcolor: '#F8F8F8', minHeight: 'calc(100vh - 60px)' }}>
      <Box sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: '16px', sm: '24px', md: '32px' }, py: { xs: '16px', sm: '20px', md: '24px' } }}>
        <Box sx={{ display: 'flex', gap: { xs: '16px', md: '20px' }, alignItems: 'flex-start', flexDirection: { xs: 'column', lg: 'row' } }}>

          {/* ══ Left / Main column ════════════════════════════ */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: { xs: '14px', md: '16px' } }}>

            {/* Top 3 stat cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: { xs: '12px', sm: '14px' } }}>
              <TopStatCard label="AUCTIONS AWAITING APPROVAL" value={String((stats?.pendingTreasuryCount ?? 0) || pendingQueue.length)} loading={loadingStats && loadingQueue} />
              <TopStatCard label="LIVE AUCTIONS"              value={String(stats?.liveAuctionsCount    ?? '—')} loading={loadingStats} />
              <TopStatCard label="REGISTERED ASSET OWNERS"   value={String(stats?.museumAdminCount     ?? '—')} loading={loadingStats} />
            </Box>

            {/* Auction Approvals Queue */}
            <Paper elevation={0} sx={{ border: '1px solid #E8E8E8', borderRadius: '10px', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
              <Box sx={{ px: { xs: '16px', sm: '22px' }, pt: { xs: '16px', sm: '20px' }, pb: '14px' }}>
                <Typography sx={{ fontSize: { xs: '12px', sm: '13px' }, fontWeight: 700, color: '#111111', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', mb: '4px' }}>
                  Auction Approvals Queue
                </Typography>
                <Typography sx={{ fontSize: { xs: '11px', sm: '12px' }, color: '#888888', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                  Review auction launch requests, monitor bidding activity, detect risks and manage operations
                </Typography>
              </Box>

              <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <Table sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow sx={{ borderTop: '1px solid #F0F0F0', '& .MuiTableCell-root': { borderBottom: '1px solid #F0F0F0' } }}>
                      {TABLE_COLS.map((col) => (
                        <TableCell key={col} sx={{ fontSize: '12px', fontWeight: 500, color: '#888888', fontFamily: 'Inter, sans-serif', bgcolor: '#FAFAFA', py: '10px', px: { xs: '12px', sm: '16px' }, whiteSpace: 'nowrap' }}>
                          {col !== 'Actions' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                              {col}<UnfoldMoreIcon sx={{ fontSize: '14px', color: '#CCCCCC' }} />
                            </Box>
                          ) : col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {loadingQueue ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          {TABLE_COLS.map((c) => (
                            <TableCell key={c} sx={{ px: { xs: '12px', sm: '16px' }, py: '13px' }}>
                              <Skeleton variant="text" width={c === 'Actions' ? 60 : '80%'} />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : pendingQueue.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: '32px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
                          No assets pending treasury review
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingQueue.map((asset, i) => (
                        <TableRow key={asset.id} sx={{ '& .MuiTableCell-root': { borderBottom: i < pendingQueue.length - 1 ? '1px solid #F5F5F5' : 'none' }, '&:hover': { bgcolor: '#FAFAFA' } }}>
                          <TableCell sx={{ fontSize: '13px', fontWeight: 500, color: '#111111', fontFamily: 'Inter, sans-serif', px: { xs: '12px', sm: '16px' }, py: '13px', minWidth: '130px', maxWidth: '180px' }}>
                            {asset.title}
                          </TableCell>
                          <TableCell sx={{ fontSize: '13px', color: '#555555', fontFamily: 'Inter, sans-serif', px: { xs: '12px', sm: '16px' }, py: '13px', whiteSpace: 'nowrap' }}>
                            {asset.ownerName}
                          </TableCell>
                          <TableCell sx={{ fontSize: '13px', color: '#555555', fontFamily: 'Inter, sans-serif', px: { xs: '12px', sm: '16px' }, py: '13px', whiteSpace: 'nowrap' }}>
                            {formatValuation(asset.valuation)}
                          </TableCell>
                          <TableCell sx={{ px: { xs: '12px', sm: '16px' }, py: '13px' }}>
                            <CategoryBadge category={asset.assetType} />
                          </TableCell>
                          <TableCell sx={{ px: { xs: '12px', sm: '16px' }, py: '13px' }}>
                            <Button variant="contained" size="small" onClick={() => handleView(asset)}
                              sx={{ bgcolor: '#1E293B', color: '#FFFFFF', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif', textTransform: 'none', borderRadius: '20px', px: '16px', py: '5px', boxShadow: 'none', minWidth: 0, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' } }}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Box>

          {/* ══ Right sidebar ═════════════════════════════════ */}
          <Box sx={{ width: { xs: '100%', lg: '240px' }, flexShrink: 0, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', lg: '1fr' }, gap: { xs: '12px', sm: '14px' } }}>
            <SideStatCard label="VERIFIED INVESTORS"      value={stats ? stats.verifiedInvestorCount.toLocaleString() : '—'} loading={loadingStats} />
            <SideStatCard label="TOTAL ASSETS"            value={stats ? String(stats.totalAssetsCount) : '—'}               loading={loadingStats} />
            <SideStatCard label="TOTAL ASSET VALUE"       value={stats ? formatValue(stats.totalAssetValue) : '—'}           loading={loadingStats} />
            <SideStatCard label="PLATFORM FEES GENERATED" value="—" />
          </Box>

        </Box>
      </Box>

      <ViewModal
        asset={selectedFullAsset}
        loading={loadingFullAsset}
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onApprove={handleOpenApprove}
        onReject={handleOpenDecline}
      />
      <ApproveModal
        assetTitle={selectedFullAsset?.title ?? selectedAsset?.title ?? ''}
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        onConfirm={handleApproveConfirm}
        loading={isReviewing}
      />
      <DeclineModal
        open={declineOpen}
        onClose={() => setDeclineOpen(false)}
        onConfirm={handleDeclineConfirm}
        loading={isReviewing}
      />

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack?.severity} onClose={() => setSnack(null)} sx={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
          {snack?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
