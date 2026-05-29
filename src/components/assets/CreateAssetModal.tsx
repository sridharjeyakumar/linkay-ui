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
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import LoopIcon from '@mui/icons-material/Loop';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { useScrollLock } from '@/hooks/useScrollLock';
import { createAssetThunk, updateAssetThunk, fetchAssetsThunk, changeStatusThunk } from '@/features/assets/assetThunks';
import { clearError } from '@/features/assets/assetSlice';
import type { Asset } from '@/types/asset.types';

// ── helpers ──────────────────────────────────────────────────────────────────

function parseMediaFiles(raw: unknown): string[] {
  if (!raw) return [];
  let arr: string[] = [];
  if (Array.isArray(raw)) {
    arr = (raw as string[]).filter(Boolean);
  } else if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      arr = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch { return []; }
  }
  return arr.filter(Boolean);
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// ── TRELLIS API ───────────────────────────────────────────────────────────────

const TRELLIS_API = 'https://unseemly-showgirl-unmixable.ngrok-free.dev';

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
  useScrollLock(open);
  const dispatch = useAppDispatch();
  const { actionLoading, error } = useAppSelector((s) => s.assets);
  const walletAddress = useAppSelector((s) => s.auth.user?.walletAddress ?? '');
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
  const [royaltyWallet, setRoyaltyWallet]       = useState(walletAddress);

  // Step 3 – Media
  const [mediaFiles, setMediaFiles]     = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [threeDFiles, setThreeDFiles]   = useState('');
  const [liveStream, setLiveStream]     = useState('');
  const [dragOver, setDragOver]         = useState(false);

  // Lightbox
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Validation errors
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  // 3D Generation Modal
  const threeDFileInputRef = useRef<HTMLInputElement>(null);
  const [show3DModal, setShow3DModal] = useState(false);
  const [threeDModalStep, setThreeDModalStep] = useState<1 | 2 | 3>(1);
  const [threeDUploadedFiles, setThreeDUploadedFiles] = useState<File[]>([]);
  const [threeDDragOver, setThreeDDragOver] = useState(false);
  const [generated3DFiles, setGenerated3DFiles] = useState<File[]>([]);

  // TRELLIS API state
  const [bgRemovedPreviews, setBgRemovedPreviews] = useState<string[]>([]);
  const [loadingBgRemoval, setLoadingBgRemoval] = useState(false);
  const [loadingGenerate3D, setLoadingGenerate3D] = useState(false);
  const [generatedModel, setGeneratedModel] = useState<{ preview_video: string; glb_model: string } | null>(null);
  const [trellisError, setTrellisError] = useState<string | null>(null);

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
      setTokenizePercent(editAsset.tokenizedPercent != null ? Number(editAsset.tokenizedPercent) : 5);
      setTotalFractions(editAsset.totalFractions != null ? String(editAsset.totalFractions) : '');
      setRoyalty(
        editAsset.royaltyPercent != null
          ? (ROYALTY_OPTIONS.find((o) => parseFloat(o) === Number(editAsset.royaltyPercent)) ?? `${editAsset.royaltyPercent}%`)
          : ''
      );
      setRoyaltyWallet(editAsset.royaltyWallet ?? walletAddress);
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
    setRoyalty(''); setRoyaltyWallet(walletAddress);
    setMediaFiles([]); setExistingImages([]); setThreeDFiles(''); setLiveStream('');
    setGenerated3DFiles([]);
    setStep1Errors({});
    setStep2Errors({});
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

  // ── 3D modal file handling ──────────────────────────────────────────────────

  function handleThreeDDrop(e: React.DragEvent) {
    e.preventDefault();
    setThreeDDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      /\.(jpg|jpeg|png|svg|zip)$/i.test(f.name),
    );
    setThreeDUploadedFiles((prev) => [...prev, ...dropped]);
  }

  function handleThreeDFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setThreeDUploadedFiles((prev) => [...prev, ...picked]);
    e.target.value = '';
  }

  function removeThreeDFile(index: number) {
    setThreeDUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // ── TRELLIS API calls ───────────────────────────────────────────────────────

  async function callPreviewRemoveBG(selectedFiles: File[]): Promise<boolean> {
    setLoadingBgRemoval(true);
    setTrellisError(null);
    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append('files', f));
    try {
      const res = await fetch(`${TRELLIS_API}/preview-removebg`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setBgRemovedPreviews(data.previews ?? []);
        setLoadingBgRemoval(false);
        return true;
      }
      throw new Error(data.message ?? 'Background removal failed');
    } catch (e) {
      setTrellisError(e instanceof Error ? e.message : 'Background removal failed');
      setLoadingBgRemoval(false);
      return false;
    }
  }

  async function callGenerate3D(selectedFiles: File[]): Promise<boolean> {
    setLoadingGenerate3D(true);
    setTrellisError(null);
    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append('files', f));
    formData.append('seed', '0');
    formData.append('ss_guidance_strength', '7.5');
    formData.append('ss_sampling_steps', '12');
    formData.append('slat_guidance_strength', '3');
    formData.append('slat_sampling_steps', '12');
    formData.append('multiimage_algo', 'stochastic');
    formData.append('mesh_simplify', '0.95');
    formData.append('texture_size', '1024');
    try {
      const res = await fetch(`${TRELLIS_API}/generate`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setGeneratedModel(data);
      setLoadingGenerate3D(false);
      return true;
    } catch (e) {
      setTrellisError(e instanceof Error ? e.message : '3D generation failed');
      setLoadingGenerate3D(false);
      return false;
    }
  }

  // ── 3D modal navigation with API ────────────────────────────────────────────

  async function handleThreeDGenerate() {
    if (threeDModalStep === 1) {
      if (threeDUploadedFiles.length === 0) return;
      const ok = await callPreviewRemoveBG(threeDUploadedFiles);
      if (ok) setThreeDModalStep(2);
    } else if (threeDModalStep === 2) {
      const ok = await callGenerate3D(threeDUploadedFiles);
      if (ok) setThreeDModalStep(3);
    }
  }

  function close3DModal() {
    setShow3DModal(false);
    setThreeDModalStep(1);
    setThreeDUploadedFiles([]);
    setBgRemovedPreviews([]);
    setGeneratedModel(null);
    setTrellisError(null);
  }

  function handleUploadAs3DModal() {
    setThreeDFiles('generated-3d-model');
    setGenerated3DFiles([...threeDUploadedFiles]);
    close3DModal();
  }

  function removeGenerated3DFile(index: number) {
    setGenerated3DFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) setThreeDFiles('');
      return updated;
    });
  }

  // ── save/submit ─────────────────────────────────────────────────────────────

  async function handleSave(asDraft: boolean) {
    // Client-side validation before any API call — prevents generic "Validation failed"
    const errs: Record<string, string> = {};
    const titleTrimmed = title.trim();
    if (!titleTrimmed) {
      errs.title = 'Asset Title is required.';
    } else if (titleTrimmed.length < 3) {
      errs.title = 'Asset Title must be at least 3 characters.';
    }
    if (!assetType) {
      errs.assetType = 'Asset Type is required.';
    }
    if (Object.keys(errs).length > 0) {
      setStep1Errors((p) => ({ ...p, ...errs }));
      dispatch(clearError());
      if (step !== 1) setStep(1);
      return;
    }

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
      tokenizedPercent:  tokenizePercent,
      retainedPercent:   100 - tokenizePercent,
      ...(totalFractions  && { totalFractions: parseInt(totalFractions, 10) }),
      ...(pricePerFraction && { pricePerFraction: parseFloat(pricePerFraction) }),
      ...(royalty         && { royaltyPercent: parseFloat(royalty.replace('%', '')) }),
      ...(royaltyWallet   && { royaltyWallet: royaltyWallet.trim() }),
      ...(threeDFiles      && { threeDFiles }),
      ...(liveStream       && { liveStream }),
    };

    try {
      let savedId: string;
      if (editAsset) {
        const updated = await dispatch(updateAssetThunk({ assetId: editAsset.id, payload, files: mediaFiles })).unwrap();
        savedId = updated.id;
      } else {
        const created = await dispatch(createAssetThunk({ payload, files: mediaFiles })).unwrap();
        savedId = created.id;
      }
      if (!asDraft) {
        await dispatch(changeStatusThunk({ assetId: savedId, status: 'REVIEW' })).unwrap();
      }
      dispatch(fetchAssetsThunk());
      onSuccess?.();
      handleClose();
    } catch {
      // surfaced via Redux error state
    }
  }

  // ── step navigation ─────────────────────────────────────────────────────────

  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim())             errs.title             = 'Asset Title is required.';
    if (!assetType)                errs.assetType         = 'Asset Type is required.';
    if (!custodian.trim())         errs.custodian         = 'Custodian is required.';
    if (!ownershipEntity.trim())   errs.ownershipEntity   = 'Ownership Entity is required.';
    if (!description.trim())       errs.description       = 'Asset Description is required.';
    else if (countWords(description) > MAX_WORDS)
                                   errs.description       = `Description exceeds ${MAX_WORDS} words.`;
    if (!historicalContext.trim()) errs.historicalContext = 'Historical Context is required.';
    else if (countWords(historicalContext) > MAX_WORDS)
                                   errs.historicalContext = `Historical Context exceeds ${MAX_WORDS} words.`;
    if (!certificationRef.trim())  errs.certificationRef  = 'Certification Ref is required.';
    setStep1Errors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2(): boolean {
    const errs: Record<string, string> = {};
    if (!valuation || parseFloat(valuation) <= 0) errs.valuation     = 'Asset Valuation is required.';
    if (!jurisdiction)                             errs.jurisdiction  = 'Jurisdiction is required.';
    if (!totalFractions || parseInt(totalFractions, 10) <= 0) {
      errs.totalFractions = 'Total Fractions is required.';
    } else {
      const fractions = parseInt(totalFractions, 10);
      const publicFractions = Math.floor(fractions * tokenizePercent / 100);
      if (publicFractions < 1) {
        const minFractions = Math.ceil(100 / tokenizePercent);
        errs.totalFractions = `Too low: with ${tokenizePercent}% tokenization, minimum is ${minFractions} fractions. Recommended: 1000+`;
      }
    }
    setStep2Errors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  }

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
                    onChange={(e) => { setTitle(e.target.value); if (step1Errors.title) setStep1Errors(p => ({ ...p, title: '' })); }}
                    error={!!step1Errors.title} helperText={step1Errors.title} sx={inputSx} />
                </Box>
                <Box>
                  <Label required>Asset Type</Label>
                  <Select fullWidth size="small" value={assetType} displayEmpty
                    onChange={(e) => { setAssetType(e.target.value); if (step1Errors.assetType) setStep1Errors(p => ({ ...p, assetType: '' })); }} sx={selectSx}>
                    <MenuItem value="" disabled><em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select</em></MenuItem>
                    {ASSET_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                  {step1Errors.assetType && <Typography sx={{ fontSize: 12, color: '#ef4444', mt: 0.5 }}>{step1Errors.assetType}</Typography>}
                </Box>
              </Box>

              {/* Row 2: Custodian + Ownership entity */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Label required>Custodian</Label>
                  <TextField fullWidth size="small" value={custodian}
                    onChange={(e) => { setCustodian(e.target.value); if (step1Errors.custodian) setStep1Errors(p => ({ ...p, custodian: '' })); }}
                    error={!!step1Errors.custodian} helperText={step1Errors.custodian} sx={inputSx} />
                </Box>
                <Box>
                  <Label required>Ownership entity</Label>
                  <TextField fullWidth size="small" value={ownershipEntity}
                    onChange={(e) => { setOwnershipEntity(e.target.value); if (step1Errors.ownershipEntity) setStep1Errors(p => ({ ...p, ownershipEntity: '' })); }}
                    error={!!step1Errors.ownershipEntity} helperText={step1Errors.ownershipEntity} sx={inputSx} />
                </Box>
              </Box>

              {/* Asset Description */}
              <Box>
                <Label required>Asset Description</Label>
                <TextField
                  fullWidth multiline rows={4} size="small" value={description}
                  onChange={(e) => { setDescription(e.target.value); if (step1Errors.description) setStep1Errors(p => ({ ...p, description: '' })); }}
                  error={!!step1Errors.description} sx={inputSx}
                />
                {step1Errors.description ? (
                  <Typography sx={{ fontSize: 12, color: '#ef4444', mt: 0.5 }}>{step1Errors.description}</Typography>
                ) : (
                  <Typography sx={{ fontSize: 12, mt: 0.5, color: countWords(description) > MAX_WORDS ? '#ef4444' : '#9ca3af' }}>
                    {countWords(description) > MAX_WORDS ? `${countWords(description)}/${MAX_WORDS} words — over limit` : 'Max 200 words'}
                  </Typography>
                )}
              </Box>

              {/* Historical Context */}
              <Box>
                <Label required>Historical Context</Label>
                <TextField
                  fullWidth multiline rows={4} size="small" value={historicalContext}
                  onChange={(e) => { setHistoricalContext(e.target.value); if (step1Errors.historicalContext) setStep1Errors(p => ({ ...p, historicalContext: '' })); }}
                  error={!!step1Errors.historicalContext} sx={inputSx}
                />
                {step1Errors.historicalContext ? (
                  <Typography sx={{ fontSize: 12, color: '#ef4444', mt: 0.5 }}>{step1Errors.historicalContext}</Typography>
                ) : (
                  <Typography sx={{ fontSize: 12, mt: 0.5, color: countWords(historicalContext) > MAX_WORDS ? '#ef4444' : '#9ca3af' }}>
                    {countWords(historicalContext) > MAX_WORDS ? `${countWords(historicalContext)}/${MAX_WORDS} words — over limit` : 'Max 200 words'}
                  </Typography>
                )}
              </Box>

              {/* Row 3: Condition Report + Certification Ref */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Label>Condition Report</Label>
                  <TextField fullWidth size="small" value={conditionReport}
                    onChange={(e) => setConditionReport(e.target.value)} sx={inputSx} />
                </Box>
                <Box>
                  <Label required>Certification Ref</Label>
                  <TextField fullWidth size="small" value={certificationRef}
                    onChange={(e) => { setCertificationRef(e.target.value); if (step1Errors.certificationRef) setStep1Errors(p => ({ ...p, certificationRef: '' })); }}
                    error={!!step1Errors.certificationRef} helperText={step1Errors.certificationRef} sx={inputSx} />
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
                    onChange={(e) => { setValuation(e.target.value); if (step2Errors.valuation) setStep2Errors(p => ({ ...p, valuation: '' })); }}
                    error={!!step2Errors.valuation} helperText={step2Errors.valuation}
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
                    onChange={(e) => { setJurisdiction(e.target.value); if (step2Errors.jurisdiction) setStep2Errors(p => ({ ...p, jurisdiction: '' })); }} sx={selectSx}>
                    <MenuItem value="" disabled><em style={{ color: '#9ca3af', fontStyle: 'normal' }}>Select</em></MenuItem>
                    {JURISDICTIONS.map((j) => <MenuItem key={j} value={j}>{j}</MenuItem>)}
                  </Select>
                  {step2Errors.jurisdiction && <Typography sx={{ fontSize: 12, color: '#ef4444', mt: 0.5 }}>{step2Errors.jurisdiction}</Typography>}
                </Box>
              </Box>

              {/* Row 2: Slider + Total Fractions + Price per Fraction */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1.4fr 1.4fr' }, gap: 2, alignItems: 'start' }}>
                {/* Slider */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                    <Label required>Percentage % to Tokenize</Label>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <Box sx={{ px: 1.5, py: 0.25, bgcolor: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#3b6ef8' }}>
                          {tokenizePercent}% tokenized
                        </Typography>
                      </Box>
                      <Box sx={{ px: 1.5, py: 0.25, bgcolor: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>
                          {100 - tokenizePercent}% retained
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ px: 0.5, pt: 0.5 }}>
                    <Slider
                      value={Number(tokenizePercent) || 0}
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
                    onChange={(e) => { setTotalFractions(e.target.value); if (step2Errors.totalFractions) setStep2Errors(p => ({ ...p, totalFractions: '' })); }}
                    error={!!step2Errors.totalFractions}
                    helperText={step2Errors.totalFractions || `Recommended: 1000+. With ${tokenizePercent}% tokenization → ${Math.floor((parseInt(totalFractions||'0',10) * tokenizePercent)/100)} public fractions`}
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
                  <TextField
                    fullWidth size="small" value={royaltyWallet}
                    disabled
                    sx={{
                      ...inputSx,
                      '& .Mui-disabled': {
                        WebkitTextFillColor: '#374151 !important',
                        bgcolor: '#f3f4f6',
                        borderRadius: '8px',
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 0.5 }}>
                    Auto-filled from your connected wallet
                  </Typography>
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
                  <Button
                    fullWidth
                    onClick={() => { setShow3DModal(true); setThreeDModalStep(1); }}
                    startIcon={<AutoFixHighIcon sx={{ fontSize: '18px !important' }} />}
                    sx={{
                      background: 'linear-gradient(135deg, #243AFB 0%, #EF44E9 100%)',
                      color: '#fff',
                      borderRadius: '8px',
                      py: 1.1,
                      fontWeight: 700,
                      fontSize: 13,
                      textTransform: 'none',
                      justifyContent: 'center',
                      '&:hover': { background: 'linear-gradient(135deg, #1a2fd4 0%, #d93dd2 100%)' },
                    }}
                  >
                    Generate 3D Model with AI
                  </Button>
                  {generated3DFiles.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {generated3DFiles.map((f, i) => (
                        <Box key={i} sx={{
                          display: 'flex', alignItems: 'center', gap: 1.5,
                          p: 1, border: '1px solid #e5e7eb', borderRadius: 2, bgcolor: '#fafafa',
                        }}>
                          <Box sx={{ width: 40, height: 40, borderRadius: 1, overflow: 'hidden', flexShrink: 0, bgcolor: '#f3f4f6' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={URL.createObjectURL(f)} alt={f.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {f.name}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>
                              {(f.size / 1024).toFixed(0)}kb
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={() => removeGenerated3DFile(i)} sx={{ color: '#9ca3af', flexShrink: 0 }}>
                            <CloseIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
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
              onClick={handleNext}
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

      {/* 3D Generation Modal */}
      <Dialog
        open={show3DModal}
        onClose={close3DModal}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              bgcolor: '#fff',
              width: { xs: '95%', sm: 640 },
              maxWidth: 640,
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ flexShrink: 0, px: 3, pt: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, pr: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#111', mb: 1 }}>
              {threeDModalStep === 1 && '3D Modal Generation'}
              {threeDModalStep === 2 && '3D Modal Generation - Background Removal'}
              {threeDModalStep === 3 && '3D Modal Generation - Preview'}
            </Typography>
            {threeDModalStep === 1 && (
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {[
                  'Upload at least 4 clear images from different angles for optimal 3D quality',
                  'Use good lighting with a clean, uncluttered background',
                  'Keep the object fully visible and centered in every photo',
                ].map((tip, i) => (
                  <Typography component="li" key={i} sx={{ fontSize: 13, color: '#4b5563', mb: 0.5 }}>
                    {tip}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
          <IconButton size="small" onClick={close3DModal} sx={{ color: '#6b7280', mt: -0.5, flexShrink: 0 }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            px: 3,
            pb: 2,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: '#f9fafb', borderRadius: 4 },
            '&::-webkit-scrollbar-thumb': {
              background: '#d1d5db',
              borderRadius: 4,
              '&:hover': { background: '#9ca3af' },
            },
          }}
        >
          {/* ── Step 1: Upload ── */}
          {threeDModalStep === 1 && (
            <>
              <Box
                onDragOver={(e) => { e.preventDefault(); setThreeDDragOver(true); }}
                onDragLeave={() => setThreeDDragOver(false)}
                onDrop={handleThreeDDrop}
                sx={{
                  border: '2px dashed',
                  borderColor: threeDDragOver ? '#2d5fe8' : '#3b6ef8',
                  borderRadius: 2,
                  py: 4,
                  px: 2,
                  textAlign: 'center',
                  bgcolor: threeDDragOver ? '#eff6ff' : '#f8f9ff',
                  transition: 'all 0.2s',
                }}
              >
                <Box sx={{
                  width: 64, height: 64, bgcolor: '#3b6ef8', borderRadius: 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2,
                }}>
                  <UploadFileIcon sx={{ color: '#fff', fontSize: 36 }} />
                </Box>
                <Typography sx={{ fontSize: 14, color: '#374151', fontWeight: 500, mb: 1 }}>
                  Drag your file(s) to start uploading
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#9ca3af', mb: 1.5 }}>OR</Typography>
                <Button
                  onClick={() => threeDFileInputRef.current?.click()}
                  variant="outlined"
                  sx={{
                    borderColor: '#3b6ef8', color: '#3b6ef8',
                    borderRadius: 20, px: 3,
                    textTransform: 'none', fontSize: 13, fontWeight: 600,
                    '&:hover': { bgcolor: '#eff6ff', borderColor: '#2d5fe8' },
                  }}
                >
                  Browse files
                </Button>
              </Box>
              <Typography sx={{ fontSize: 12, color: '#9ca3af', mt: 1, mb: threeDUploadedFiles.length ? 1.5 : 0 }}>
                Only support .jpg, .png and .svg and zip files
              </Typography>

              {threeDUploadedFiles.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {threeDUploadedFiles.map((f, i) => (
                    <Box key={i} sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      p: 1, border: '1px solid #e5e7eb', borderRadius: 2,
                    }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: 1, overflow: 'hidden', flexShrink: 0, bgcolor: '#f3f4f6' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={URL.createObjectURL(f)} alt={f.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>
                          {(f.size / 1024).toFixed(0)}kb
                        </Typography>
                      </Box>
                      <IconButton size="small" onClick={() => removeThreeDFile(i)} sx={{ color: '#9ca3af', flexShrink: 0 }}>
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}

              <input
                ref={threeDFileInputRef} type="file" multiple hidden
                accept=".jpg,.jpeg,.png,.svg,.zip" onChange={handleThreeDFileChange}
              />
            </>
          )}

          {/* ── Step 2: Background Removal (real API previews) ── */}
          {threeDModalStep === 2 && (
            <>
              {trellisError && (
                <Alert severity="error" sx={{ mb: 1.5, fontSize: 13 }}>{trellisError}</Alert>
              )}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {/* Original images (left column — first image shown) */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, bgcolor: '#f3f4f6', borderRadius: 1, mb: 1, width: 'fit-content' }}>
                    <ImageOutlinedIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                    <Typography sx={{ fontSize: 11, color: '#6b7280' }}>Input Image</Typography>
                  </Box>
                  <Box sx={{
                    border: '2px dashed #d1d5db', borderRadius: 2, overflow: 'hidden',
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: '#fafafa',
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(threeDUploadedFiles[0])}
                      alt="input"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </Box>
                </Box>

                {/* BG-removed preview (right column — first preview from API) */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, bgcolor: '#f3f4f6', borderRadius: 1, mb: 1, width: 'fit-content' }}>
                    <ImageOutlinedIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                    <Typography sx={{ fontSize: 11, color: '#6b7280' }}>Background Removed</Typography>
                  </Box>
                  <Box sx={{
                    border: '2px dashed #d1d5db', borderRadius: 2, overflow: 'hidden',
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundImage: [
                      'linear-gradient(45deg, #d0d0d0 25%, transparent 25%)',
                      'linear-gradient(-45deg, #d0d0d0 25%, transparent 25%)',
                      'linear-gradient(45deg, transparent 75%, #d0d0d0 75%)',
                      'linear-gradient(-45deg, transparent 75%, #d0d0d0 75%)',
                    ].join(', '),
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
                  }}>
                    {bgRemovedPreviews[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={bgRemovedPreviews[0]} alt="bg-removed"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <CircularProgress size={28} sx={{ color: '#3b6ef8' }} />
                    )}
                  </Box>
                </Box>
              </Box>

              {/* All previews grid (if more than 1) */}
              {bgRemovedPreviews.length > 1 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography sx={{ fontSize: 12, color: '#6b7280', mb: 1 }}>
                    All {bgRemovedPreviews.length} previews
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {bgRemovedPreviews.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={src} alt={`preview-${i}`}
                        style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f3f4f6' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}

          {/* ── Step 3: 3D Preview (real video + GLB download) ── */}
          {threeDModalStep === 3 && (
            <>
              {trellisError && (
                <Alert severity="error" sx={{ mb: 1.5, fontSize: 13 }}>{trellisError}</Alert>
              )}
              <Box sx={{
                border: '2px dashed #3b6ef8', borderRadius: 2,
                position: 'relative', minHeight: 300,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                bgcolor: '#f8f9ff', p: 2, gap: 2,
              }}>
                <Box sx={{
                  position: 'absolute', top: 10, left: 10,
                  px: 1.5, py: 0.4, bgcolor: '#fff',
                  border: '1px solid #e5e7eb', borderRadius: 1,
                }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>3D Model</Typography>
                </Box>

                {generatedModel?.preview_video ? (
                  <video
                    controls
                    src={generatedModel.preview_video}
                    style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 8 }}
                  />
                ) : (
                  /* Fallback: show uploaded image if video not yet available */
                  threeDUploadedFiles.length > 0 && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={bgRemovedPreviews[0] ?? URL.createObjectURL(threeDUploadedFiles[0])}
                      alt="3d-preview"
                      style={{ maxWidth: '80%', maxHeight: 260, objectFit: 'contain' }}
                    />
                  )
                )}

                {generatedModel?.glb_model && (
                  <Box
                    component="a"
                    href={generatedModel.glb_model}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      mt: 1, fontSize: 13, fontWeight: 600, color: '#3b6ef8',
                      textDecoration: 'underline', cursor: 'pointer',
                    }}
                  >
                    ⬇ Download GLB Model
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ flexShrink: 0, px: 3, pb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {threeDModalStep === 3 ? (
            <>
              {/* Regenerate → back to step 1 */}
              <Button
                onClick={() => {
                  setThreeDModalStep(1);
                  setBgRemovedPreviews([]);
                  setGeneratedModel(null);
                  setTrellisError(null);
                }}
                variant="contained"
                startIcon={<LoopIcon />}
                sx={{
                  bgcolor: '#374151', color: '#fff', borderRadius: 20,
                  px: 2.5, textTransform: 'none', fontWeight: 600, fontSize: 13,
                  '&:hover': { bgcolor: '#1f2937' },
                }}
              >
                Regenerate
              </Button>
              <Button
                onClick={handleUploadAs3DModal}
                variant="contained"
                startIcon={<AutoFixHighIcon />}
                sx={{
                  bgcolor: '#3b6ef8', color: '#fff', borderRadius: 20,
                  px: 3, textTransform: 'none', fontWeight: 700, fontSize: 13,
                  '&:hover': { bgcolor: '#2d5fe8' },
                }}
              >
                Upload as 3D Modal
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={close3DModal}
                variant="outlined"
                disabled={loadingBgRemoval || loadingGenerate3D}
                sx={{
                  borderColor: '#d1d5db', color: '#374151', borderRadius: 20,
                  px: 3, textTransform: 'none', fontWeight: 600, fontSize: 13,
                  '&:hover': { bgcolor: '#f9fafb', borderColor: '#9ca3af' },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleThreeDGenerate}
                disabled={
                  (threeDModalStep === 1 && threeDUploadedFiles.length === 0) ||
                  loadingBgRemoval ||
                  loadingGenerate3D
                }
                variant="contained"
                startIcon={
                  loadingBgRemoval || loadingGenerate3D
                    ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                    : <AutoFixHighIcon />
                }
                sx={{
                  bgcolor: '#3b6ef8', color: '#fff', borderRadius: 20,
                  px: 3, textTransform: 'none', fontWeight: 700, fontSize: 13,
                  '&:hover': { bgcolor: '#2d5fe8' },
                  '&.Mui-disabled': { bgcolor: '#d1d5db', color: '#9ca3af' },
                }}
              >
                {loadingBgRemoval
                  ? 'Removing background…'
                  : loadingGenerate3D
                    ? 'Generating 3D…'
                    : 'Generate'}
              </Button>
            </>
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
          {lightboxSrc && (
            <img
              src={lightboxSrc} alt="Preview"
              style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, display: 'block', objectFit: 'contain' }}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
}
