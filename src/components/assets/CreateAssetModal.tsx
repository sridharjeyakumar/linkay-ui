'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Box, Button, Dialog, IconButton,
  MenuItem, Select, TextField, Typography, CircularProgress, Alert, Slider,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { createAssetThunk, updateAssetThunk, fetchAssetsThunk } from '@/features/assets/assetThunks';
import { clearError } from '@/features/assets/assetSlice';
import type { Asset } from '@/types/asset.types';

// ── helpers ──────────────────────────────────────────────────────────────────

function parseMediaFiles(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return (raw as string[]).filter(Boolean);
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch { return []; }
  }
  return [];
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// ── constants ─────────────────────────────────────────────────────────────────

const ASSET_TYPES = ['Real Estate', 'Fine Art', 'Luxury Asset', 'Luxury Watch', 'Collectible', 'Other'];

const ASSET_TYPE_MAP: Record<string, string> = {
  'Real Estate':  'REAL_ESTATE',
  'Fine Art':     'FINE_ART',
  'Luxury Asset': 'LUXURY_ASSET',
  'Luxury Watch': 'LUXURY_WATCH',
  'Collectible':  'COLLECTIBLE',
  'Other':        'OTHER',
};

const ASSET_TYPE_REVERSE_MAP: Record<string, string> = {
  REAL_ESTATE:  'Real Estate',
  FINE_ART:     'Fine Art',
  LUXURY_ASSET: 'Luxury Asset',
  LUXURY_WATCH: 'Luxury Watch',
  COLLECTIBLE:  'Collectible',
  OTHER:        'Other',
};

const JURISDICTIONS = [
  'United States', 'United Kingdom', 'European Union', 'Singapore',
  'United Arab Emirates', 'Switzerland', 'Germany', 'France',
  'Japan', 'Canada', 'Australia', 'India', 'Other',
];

const ROYALTY_OPTIONS = ['0%', '1%', '2.5%', '5%', '7.5%', '10%'];

const MAX_WORDS = 200;
const MAX_FILES = 10;
const MAX_FILE_MB = 50;

// ── shared styles ─────────────────────────────────────────────────────────────

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#f3f4f6',
    borderRadius: '8px',
    '& fieldset': { border: 'none' },
    fontSize: 14,
    color: '#111',
  },
};

const selectSx = {
  bgcolor: '#f3f4f6',
  borderRadius: '8px',
  fontSize: 14,
  color: '#111',
  '& fieldset': { border: 'none' },
  '& .MuiSelect-select': { py: '10px' },
};

// ── sub-components ────────────────────────────────────────────────────────────

function StepDots({ step }: { step: number }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
      {[1, 2, 3].map((s) => (
        <Box
          key={s}
          sx={{
            height: 5,
            width: s === step ? 28 : 8,
            borderRadius: 10,
            bgcolor: s === step ? '#3b6ef8' : '#d1d5db',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </Box>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111', mb: 0.75 }}>
      {children}
      {required && <Box component="span" sx={{ color: '#ef4444', ml: 0.25 }}>*</Box>}
    </Typography>
  );
}

// ── props ─────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  editAsset?: Asset | null;
  onSuccess?: () => void;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function CreateAssetModal({ open, onClose, editAsset, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const { actionLoading, error } = useAppSelector((s) => s.assets);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);

  // Step 1 – Asset Info
  const [title, setTitle]                     = useState('');
  const [assetType, setAssetType]             = useState('');
  const [custodian, setCustodian]             = useState('');
  const [ownershipEntity, setOwnershipEntity] = useState('');
  const [description, setDescription]         = useState('');
  const [historicalContext, setHistoricalContext] = useState('');
  const [conditionReport, setConditionReport] = useState('');
  const [certificationRef, setCertificationRef] = useState('');

  // Step 2 – Valuation & Tokenization
  const [valuation, setValuation]               = useState('');
  const [jurisdiction, setJurisdiction]         = useState('');
  const [tokenizePercent, setTokenizePercent]   = useState<number>(5);
  const [totalFractions, setTotalFractions]     = useState('');
  const [royalty, setRoyalty]                   = useState('');
  const [royaltyWallet, setRoyaltyWallet]       = useState('');

  // Step 3 – Media
  const [mediaFiles, setMediaFiles]     = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [threeDFiles, setThreeDFiles]   = useState('');
  const [liveStream, setLiveStream]     = useState('');
  const [dragOver, setDragOver]         = useState(false);

  // Lightbox
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Auto-calculated price per fraction
  const pricePerFraction = (() => {
    const v = parseFloat(valuation);
    const f = parseInt(totalFractions, 10);
    if (!isNaN(v) && !isNaN(f) && f > 0) return (v / f).toFixed(2);
    return '';
  })();

  // ── lifecycle ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    dispatch(clearError());
    setStep(1);
    if (editAsset) {
      setTitle(editAsset.title ?? '');
      setAssetType(ASSET_TYPE_REVERSE_MAP[editAsset.assetType] ?? editAsset.assetType ?? '');
      setCustodian(editAsset.custodian ?? '');
      setOwnershipEntity(editAsset.ownershipEntity ?? '');
      setDescription(editAsset.description ?? '');
      setHistoricalContext(editAsset.historicalContext ?? '');
      setConditionReport(editAsset.conditionReport ?? '');
      setCertificationRef(editAsset.certificationRef ?? '');
      setValuation(editAsset.valuation != null ? String(editAsset.valuation) : '');
      setJurisdiction(editAsset.jurisdiction ?? '');
      setTokenizePercent(editAsset.tokenizePercentage ?? 5);
      setTotalFractions(editAsset.totalFractions != null ? String(editAsset.totalFractions) : '');
      setRoyalty(editAsset.royalty ?? '');
      setRoyaltyWallet(editAsset.royaltyWallet ?? '');
      setThreeDFiles(editAsset.threeDFiles ?? '');
      setLiveStream(editAsset.liveStream ?? '');
      setMediaFiles([]);
      setExistingImages(parseMediaFiles(editAsset.mediaFiles));
    } else {
      resetForm();
    }
  }, [editAsset, open]);

  function resetForm() {
    setStep(1);
    setTitle(''); setAssetType(''); setCustodian(''); setOwnershipEntity('');
    setDescription(''); setHistoricalContext(''); setConditionReport(''); setCertificationRef('');
    setValuation(''); setJurisdiction(''); setTokenizePercent(5); setTotalFractions('');
    setRoyalty(''); setRoyaltyWallet('');
    setMediaFiles([]); setExistingImages([]); setThreeDFiles(''); setLiveStream('');
  }

  function handleClose() {
    dispatch(clearError());
    onClose();
  }

  // ── file handling ───────────────────────────────────────────────────────────

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.size <= MAX_FILE_MB * 1024 * 1024,
    );
    setMediaFiles((prev) => [...prev, ...dropped].slice(0, MAX_FILES));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).filter(
      (f) => f.size <= MAX_FILE_MB * 1024 * 1024,
    );
    setMediaFiles((prev) => [...prev, ...picked].slice(0, MAX_FILES));
  }

  // ── save/submit ─────────────────────────────────────────────────────────────

  async function handleSave(asDraft: boolean) {
    const payload = {
      title,
      assetType: ASSET_TYPE_MAP[assetType] ?? assetType,
      ...(custodian        && { custodian }),
      ...(ownershipEntity  && { ownershipEntity }),
      ...(description      && { description }),
      ...(historicalContext && { historicalContext }),
      ...(conditionReport  && { conditionReport }),
      ...(certificationRef && { certificationRef }),
      ...(valuation        && { valuation: parseFloat(valuation) }),
      ...(jurisdiction     && { jurisdiction }),
      tokenizePercentage: tokenizePercent,
      ...(totalFractions   && { totalFractions: parseInt(totalFractions, 10) }),
      ...(pricePerFraction  && { pricePerFraction: parseFloat(pricePerFraction) }),
      ...(royalty          && { royalty }),
      ...(royaltyWallet    && { royaltyWallet }),
      ...(threeDFiles      && { threeDFiles }),
      ...(liveStream       && { liveStream }),
      ...(asDraft          && { status: 'DRAFT' }),
    };

    try {
      if (editAsset) {
        await dispatch(updateAssetThunk({ assetId: editAsset.id, payload, files: mediaFiles })).unwrap();
      } else {
        await dispatch(createAssetThunk({ payload, files: mediaFiles })).unwrap();
      }
      dispatch(fetchAssetsThunk());
      onSuccess?.();
      handleClose();
    } catch {
      // surfaced via Redux error state
    }
  }

  // ── step navigation ─────────────────────────────────────────────────────────

  const STEP_TITLES = ['ASSET INFO', 'VALUATION & TOKENIZATION SETTINGS', 'MEDIA UPLOAD'];

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              borderRadius: { xs: 3, sm: 3 },
              bgcolor: '#fff',
              width: { xs: '100%', sm: 'calc(100% - 32px)', md: 720 },
              maxWidth: { xs: '100%', sm: 720 },
              maxHeight: { xs: '95vh', sm: '92vh' },
              m: { xs: 0, sm: 2, md: 'auto' },
              alignSelf: { xs: 'flex-end', sm: 'center' },
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* ── Fixed header ── */}
        <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: 0 }}>
          {/* Top row: Back (left) + Close (right) */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            {step > 1 ? (
              <Button
                onClick={() => setStep((s) => s - 1)}
                variant="outlined"
                sx={{
                  minWidth: 0,
                  px: 2,
                  py: 0.4,
                  color: '#374151',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 13,
                  borderColor: '#d1d5db',
                  borderRadius: 2,
                  '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
                }}
              >
                Back
              </Button>
            ) : (
              <Box sx={{ height: 30 }} />
            )}
            <IconButton size="small" onClick={handleClose} sx={{ color: '#6b7280', p: 0.5 }}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          {/* Step dots — left aligned */}
          <Box sx={{ mb: 1.5 }}>
            <StepDots step={step} />
          </Box>

          {/* Step title */}
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#111', letterSpacing: 0.3 }}>
            {STEP_TITLES[step - 1]}
          </Typography>
        </Box>

        {/* Divider */}
        <Box sx={{ borderBottom: '1px solid #f0f0f0', mt: 1.5, flexShrink: 0 }} />

        {/* ── Scrollable content ── */}
        <Box
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            scrollBehavior: 'smooth',
            px: 3,
            py: 3,
            '&::-webkit-scrollbar': { width: 5 },
            '&::-webkit-scrollbar-track': { background: '#f9fafb', borderRadius: 4 },
            '&::-webkit-scrollbar-thumb': {
              background: '#d1d5db',
              borderRadius: 4,
              '&:hover': { background: '#9ca3af' },
            },
          }}
        >
          {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

          {/* ══ STEP 1: Asset Info ══════════════════════════════════════════════ */}
          {step === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* Row 1: Title + Type */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Label required>Asset Title</Label>
                  <TextField fullWidth size="small" value={title}
                    onChange={(e) => setTitle(e.target.value)} sx={inputSx} />
                </Box>
                <Box>
                  <Label required>Asset Type</Label>
                  <Select fullWidth size="small" value={assetType} displayEmpty
                    onChange={(e) => setAssetType(e.target.value)} sx={selectSx}>
                    <MenuItem value="" disabled><em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select</em></MenuItem>
                    {ASSET_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </Box>
              </Box>

              {/* Row 2: Custodian + Ownership entity */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Label required>Custodian</Label>
                  <TextField fullWidth size="small" value={custodian}
                    onChange={(e) => setCustodian(e.target.value)} sx={inputSx} />
                </Box>
                <Box>
                  <Label required>Ownership entity</Label>
                  <TextField fullWidth size="small" value={ownershipEntity}
                    onChange={(e) => setOwnershipEntity(e.target.value)} sx={inputSx} />
                </Box>
              </Box>

              {/* Asset Description */}
              <Box>
                <Label required>Asset Description</Label>
                <TextField
                  fullWidth multiline rows={4} size="small" value={description}
                  onChange={(e) => setDescription(e.target.value)} sx={inputSx}
                />
                <Typography
                  sx={{ fontSize: 12, mt: 0.5, color: countWords(description) > MAX_WORDS ? '#ef4444' : '#9ca3af' }}
                >
                  {countWords(description) > MAX_WORDS
                    ? `${countWords(description)}/${MAX_WORDS} words — over limit`
                    : 'Max 200 words'}
                </Typography>
              </Box>

              {/* Historical Context */}
              <Box>
                <Label required>Historical Context</Label>
                <TextField
                  fullWidth multiline rows={4} size="small" value={historicalContext}
                  onChange={(e) => setHistoricalContext(e.target.value)} sx={inputSx}
                />
                <Typography
                  sx={{ fontSize: 12, mt: 0.5, color: countWords(historicalContext) > MAX_WORDS ? '#ef4444' : '#9ca3af' }}
                >
                  {countWords(historicalContext) > MAX_WORDS
                    ? `${countWords(historicalContext)}/${MAX_WORDS} words — over limit`
                    : 'Max 200 words'}
                </Typography>
              </Box>

              {/* Row 3: Condition Report + Certification Ref */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Label>Condition Report</Label>
                  <TextField fullWidth size="small" value={conditionReport}
                    onChange={(e) => setConditionReport(e.target.value)} sx={inputSx} />
                </Box>
                <Box>
                  <Label>Certification Ref</Label>
                  <TextField fullWidth size="small" value={certificationRef}
                    onChange={(e) => setCertificationRef(e.target.value)} sx={inputSx} />
                </Box>
              </Box>
            </Box>
          )}

          {/* ══ STEP 2: Valuation & Tokenization ═══════════════════════════════ */}
          {step === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* Row 1: Valuation + Jurisdiction */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Label required>Asset Valuation</Label>
                  <TextField
                    fullWidth size="small" type="number" value={valuation}
                    onChange={(e) => setValuation(e.target.value)}
                    sx={inputSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ color: '#9ca3af', fontSize: 14 }}>$</Typography>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Label required>Jurisdiction</Label>
                  <Select fullWidth size="small" value={jurisdiction} displayEmpty
                    onChange={(e) => setJurisdiction(e.target.value)} sx={selectSx}>
                    <MenuItem value="" disabled><em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select</em></MenuItem>
                    {JURISDICTIONS.map((j) => <MenuItem key={j} value={j}>{j}</MenuItem>)}
                  </Select>
                </Box>
              </Box>

              {/* Row 2: Slider + Total Fractions + Price per Fraction */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1.4fr 1.4fr' }, gap: 2, alignItems: 'start' }}>
                {/* Slider */}
                <Box>
                  <Label required>Percentage % to Tokenize</Label>
                  <Box sx={{ px: 0.5, pt: 0.5 }}>
                    <Slider
                      value={tokenizePercent}
                      onChange={(_, v) => setTokenizePercent(v as number)}
                      min={0} max={49} step={1}
                      sx={{
                        color: '#3b6ef8',
                        height: 6,
                        '& .MuiSlider-thumb': {
                          width: 18, height: 18,
                          bgcolor: '#3b6ef8',
                          '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(59,110,248,0.15)' },
                        },
                        '& .MuiSlider-track': { bgcolor: '#3b6ef8', border: 'none' },
                        '& .MuiSlider-rail': { bgcolor: '#e5e7eb' },
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.25 }}>
                    {'> 51% belongs to custodian; Max 49%'}
                  </Typography>
                </Box>

                {/* Total Fractions */}
                <Box>
                  <Label required>Total Fractions</Label>
                  <TextField
                    fullWidth size="small" type="number" value={totalFractions}
                    onChange={(e) => setTotalFractions(e.target.value)}
                    sx={inputSx}
                    slotProps={{ htmlInput: { min: 1 } }}
                  />
                </Box>

                {/* Price per Fraction (auto-calculated) */}
                <Box>
                  <Label required>Price per Fraction</Label>
                  <TextField
                    fullWidth size="small" value={pricePerFraction}
                    placeholder="Auto"
                    disabled
                    sx={{
                      ...inputSx,
                      '& .MuiOutlinedInput-root': {
                        ...inputSx['& .MuiOutlinedInput-root'],
                        bgcolor: '#f3f4f6',
                      },
                      '& .Mui-disabled': {
                        WebkitTextFillColor: '#374151 !important',
                        bgcolor: '#f3f4f6',
                        borderRadius: '8px',
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: pricePerFraction ? (
                          <InputAdornment position="start">
                            <Typography sx={{ color: '#9ca3af', fontSize: 14 }}>$</Typography>
                          </InputAdornment>
                        ) : undefined,
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Row 3: Royalty + Royalty Wallet */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Label>Royalty</Label>
                  <Select fullWidth size="small" value={royalty} displayEmpty
                    onChange={(e) => setRoyalty(e.target.value)} sx={selectSx}>
                    <MenuItem value="" disabled><em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select</em></MenuItem>
                    {ROYALTY_OPTIONS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                  </Select>
                </Box>
                <Box>
                  <Label>Royalty Wallet</Label>
                  <TextField fullWidth size="small" value={royaltyWallet}
                    onChange={(e) => setRoyaltyWallet(e.target.value)} sx={inputSx} />
                </Box>
              </Box>
            </Box>
          )}

          {/* ══ STEP 3: Media Upload ════════════════════════════════════════════ */}
          {step === 3 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

              {/* Existing images (edit mode) */}
              {existingImages.length > 0 && (
                <Box>
                  <Label>Existing Media ({existingImages.length})</Label>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {existingImages.map((src, i) => (
                      <Box
                        key={i}
                        onClick={() => setLightboxSrc(src)}
                        sx={{
                          position: 'relative', width: 80, height: 80,
                          borderRadius: 2, overflow: 'hidden', cursor: 'pointer',
                          border: '2px solid #e5e7eb', flexShrink: 0,
                          '&:hover .overlay': { opacity: 1 },
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`media-${i}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <Box className="overlay" sx={{
                          position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          opacity: 0, transition: 'opacity 0.2s',
                        }}>
                          <ZoomInIcon sx={{ color: '#fff', fontSize: 24 }} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Drop zone */}
              <Box>
                <Label required>Asset Media Files</Label>
                <Box
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    border: '1.5px dashed',
                    borderColor: dragOver ? '#3b6ef8' : '#d1d5db',
                    borderRadius: 2,
                    py: 4,
                    px: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: dragOver ? '#eff6ff' : '#fafafa',
                    transition: 'all 0.2s',
                    minHeight: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                  }}
                >
                  <FileUploadOutlinedIcon sx={{ color: '#9ca3af', fontSize: 32, mb: 0.5 }} />
                  <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
                    Drop here to attach or{' '}
                    <Box component="span" sx={{ color: '#3b6ef8', fontWeight: 600 }}>upload</Box>
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>
                    Max size: {MAX_FILE_MB} mb each file
                  </Typography>

                  {mediaFiles.length > 0 && (
                    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center' }}>
                      {mediaFiles.map((f, i) => (
                        <Box key={i} sx={{
                          px: 1.5, py: 0.25, bgcolor: '#e8e7ff', borderRadius: 10,
                          fontSize: 12, color: '#5a52e0', fontWeight: 500,
                        }}>
                          {f.name}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                <Typography sx={{ fontSize: 12, color: '#9ca3af', mt: 0.75 }}>
                  Add your media files here and you can upload up to {MAX_FILES} files max
                </Typography>

                <input
                  ref={fileInputRef} type="file" multiple hidden
                  accept="image/*,video/*" onChange={handleFileChange}
                />
              </Box>

              {/* Row: 3D Files + Live Stream */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Label>Asset 3D Files</Label>
                  <TextField
                    fullWidth size="small" value={threeDFiles}
                    onChange={(e) => setThreeDFiles(e.target.value)}
                    sx={inputSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon sx={{ color: '#9ca3af', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Label>Asset Live Stream</Label>
                  <TextField
                    fullWidth size="small" value={liveStream}
                    onChange={(e) => setLiveStream(e.target.value)}
                    sx={inputSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon sx={{ color: '#9ca3af', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* ── Fixed footer ── */}
        <Box sx={{ borderTop: '1px solid #f0f0f0', flexShrink: 0 }} />
        <Box sx={{
          flexShrink: 0, px: 3, py: 2,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {/* Save Draft */}
          <Button
            onClick={() => handleSave(true)}
            disabled={actionLoading}
            sx={{
              bgcolor: '#374151',
              color: '#fff',
              borderRadius: 10,
              px: 3,
              py: 1,
              fontWeight: 700,
              fontSize: 13,
              textTransform: 'none',
              letterSpacing: 0.3,
              '&:hover': { bgcolor: '#1f2937' },
              '&.Mui-disabled': { bgcolor: '#9ca3af', color: '#fff' },
            }}
          >
            {actionLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Save Draft'}
          </Button>

          {/* Next / Submit */}
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={actionLoading}
              sx={{
                bgcolor: '#3b6ef8',
                color: '#fff',
                borderRadius: 10,
                px: 4,
                py: 1,
                fontWeight: 700,
                fontSize: 13,
                textTransform: 'none',
                letterSpacing: 0.3,
                '&:hover': { bgcolor: '#2d5fe8' },
                '&.Mui-disabled': { bgcolor: '#9ca3af', color: '#fff' },
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => handleSave(false)}
              disabled={actionLoading}
              sx={{
                bgcolor: '#3b6ef8',
                color: '#fff',
                borderRadius: 10,
                px: 3,
                py: 1,
                fontWeight: 700,
                fontSize: 13,
                textTransform: 'none',
                letterSpacing: 0.3,
                '&:hover': { bgcolor: '#2d5fe8' },
                '&.Mui-disabled': { bgcolor: '#9ca3af', color: '#fff' },
              }}
            >
              {actionLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Submit for Review'}
            </Button>
          )}
        </Box>
      </Dialog>

      {/* Lightbox */}
      <Dialog
        open={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
        maxWidth="lg"
        slotProps={{ paper: { sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'visible' } } }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setLightboxSrc(null)}
            sx={{ position: 'absolute', top: -16, right: -16, bgcolor: '#fff', zIndex: 1, '&:hover': { bgcolor: '#f3f4f6' } }}
          >
            <CloseIcon />
          </IconButton>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc ?? ''} alt="Preview"
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, display: 'block', objectFit: 'contain' }}
          />
        </Box>
      </Dialog>
    </>
  );
}
