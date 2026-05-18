'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Box, Button, Dialog, DialogContent, IconButton,
  MenuItem, Select, TextField, Typography, CircularProgress, Alert,
  InputAdornment, LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { useAppDispatch, useAppSelector } from '@/store/hooks/useAppDispatch';
import { createAssetThunk, updateAssetThunk, fetchAssetsThunk } from '@/features/assets/assetThunks';
import { clearError } from '@/features/assets/assetSlice';
import type { Asset } from '@/types/asset.types';

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

const ASSET_TYPES = [
  'Real Estate',
  'Fine Art',
  'Luxury Asset',
  'Luxury Watch',
  'Collectible',
  'Other',
];

const ASSET_TYPE_MAP: Record<string, string> = {
  'Real Estate':  'REAL_ESTATE',
  'Fine Art':     'FINE_ART',
  'Luxury Asset': 'LUXURY_ASSET',
  'Luxury Watch': 'LUXURY_WATCH',
  'Collectible':  'COLLECTIBLE',
  'Other':        'OTHER',
};

const ASSET_TYPE_REVERSE_MAP: Record<string, string> = {
  'REAL_ESTATE':  'Real Estate',
  'FINE_ART':     'Fine Art',
  'LUXURY_ASSET': 'Luxury Asset',
  'LUXURY_WATCH': 'Luxury Watch',
  'COLLECTIBLE':  'Collectible',
  'OTHER':        'Other',
};

interface Props {
  open: boolean;
  onClose: () => void;
  editAsset?: Asset | null;
  onSuccess?: () => void;
}

export default function CreateAssetModal({ open, onClose, editAsset, onSuccess }: Props) {
  const dispatch = useAppDispatch();
  const { actionLoading, error } = useAppSelector((s) => s.assets);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [assetType, setAssetType] = useState('');
  const [description, setDescription] = useState('');
  const [valuation, setValuation] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [threeDFiles, setThreeDFiles] = useState('');
  const [liveStream, setLiveStream] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    dispatch(clearError());
    if (editAsset) {
      setTitle(editAsset.title ?? '');
      setAssetType(ASSET_TYPE_REVERSE_MAP[editAsset.assetType] ?? editAsset.assetType ?? '');
      setDescription(editAsset.description ?? '');
      setValuation(editAsset.valuation != null ? String(editAsset.valuation) : '');
      setJurisdiction(editAsset.jurisdiction ?? '');
      setThreeDFiles(editAsset.threeDFiles ?? '');
      setLiveStream(editAsset.liveStream ?? '');
      setMediaFiles([]);
      setExistingImages(parseMediaFiles(editAsset.mediaFiles));
    } else {
      resetForm();
    }
  }, [editAsset, open]);

  function resetForm() {
    setTitle('');
    setAssetType('');
    setDescription('');
    setValuation('');
    setJurisdiction('');
    setMediaFiles([]);
    setExistingImages([]);
    setThreeDFiles('');
    setLiveStream('');
  }

  function handleClose() {
    dispatch(clearError());
    onClose();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    setMediaFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMediaFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])]);
  }

  async function handleSave(asDraft: boolean) {
    const payload = {
      title,
      assetType: ASSET_TYPE_MAP[assetType] ?? assetType,
      ...(description   && { description }),
      ...(valuation     && { valuation: parseFloat(valuation) }),
      ...(jurisdiction  && { jurisdiction }),
      ...(threeDFiles   && { threeDFiles }),
      ...(liveStream    && { liveStream }),
      ...(asDraft       && { status: 'DRAFT' }),
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
      // error surfaced via Redux state
    }
  }

  const isEdit = !!editAsset;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: '#fff',
              mx: { xs: 1, sm: 2, md: 3 },
              width: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)', md: '760px' },
              maxWidth: '760px',
            },
          },
        }}
      >
        {/* Header: title + close */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            pt: 2.5,
            pb: 1.5,
            borderBottom: '1px solid #f3f4f6',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#111' }}>
            {isEdit ? 'Edit Asset' : 'Asset Info'}
          </Typography>
          <IconButton size="small" onClick={handleClose} sx={{ color: '#6b7280' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: '#fff',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: 4 },
          }}
        >
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {actionLoading && <LinearProgress sx={{ mb: 2 }} />}

          {/* Row 1: Title + Type */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111', mb: 0.75 }}>Asset Title</Typography>
              <TextField
                fullWidth size="small" value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f3f4f6', borderRadius: 2, '& fieldset': { border: 'none' } } }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111', mb: 0.75 }}>Asset Type</Typography>
              <Select
                fullWidth size="small" value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                displayEmpty
                sx={{ bgcolor: '#f3f4f6', borderRadius: 2, '& fieldset': { border: 'none' } }}
              >
                <MenuItem value="" disabled><em style={{ color: '#9ca3af' }}>Select type</em></MenuItem>
                {ASSET_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          {/* Description */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111', mb: 0.75 }}>Asset Description</Typography>
            <TextField
              fullWidth multiline rows={3} size="small" value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f3f4f6', borderRadius: 2, '& fieldset': { border: 'none' } } }}
            />
          </Box>

          {/* Row 2: Valuation + Jurisdiction */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5 }}>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111', mb: 0.75 }}>Valuation (USD)</Typography>
              <TextField
                fullWidth size="small" type="number" value={valuation}
                onChange={(e) => setValuation(e.target.value)}
                placeholder="e.g. 5000000"
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f3f4f6', borderRadius: 2, '& fieldset': { border: 'none' } } }}
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
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111', mb: 0.75 }}>Jurisdiction</Typography>
              <TextField
                fullWidth size="small" value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="e.g. United States"
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f3f4f6', borderRadius: 2, '& fieldset': { border: 'none' } } }}
              />
            </Box>
          </Box>

          {/* Existing images (edit mode) */}
          {isEdit && existingImages.length > 0 && (
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111', mb: 0.75 }}>
                Existing Media ({existingImages.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {existingImages.map((src, i) => (
                  <Box
                    key={i}
                    onClick={() => setLightboxSrc(src)}
                    sx={{
                      position: 'relative',
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '2px solid #e5e7eb',
                      '&:hover .overlay': { opacity: 1 },
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`media-${i}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <Box
                      className="overlay"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <ZoomInIcon sx={{ color: '#fff', fontSize: 24 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Media Files drop zone */}
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111', mb: 0.75 }}>
              {isEdit ? 'Upload New Media Files' : 'Asset Media Files'}
            </Typography>
            <Box
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: '1.5px dashed',
                borderColor: dragOver ? 'primary.main' : '#d1d5db',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: dragOver ? '#eff6ff' : '#fafafa',
                transition: 'all 0.2s',
              }}
            >
              <FileUploadOutlinedIcon sx={{ color: '#9ca3af', mb: 0.5, fontSize: 28 }} />
              <Typography sx={{ fontSize: 14, color: '#6b7280' }}>
                Drop here to attach or{' '}
                <Typography component="span" sx={{ fontSize: 14, color: 'primary.main', fontWeight: 600 }}>upload</Typography>
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#9ca3af', mt: 0.5 }}>Max size: 500 MB per file</Typography>
              {mediaFiles.length > 0 && (
                <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center' }}>
                  {mediaFiles.map((f, i) => (
                    <Box
                      key={i}
                      sx={{
                        px: 1.5,
                        py: 0.25,
                        bgcolor: '#e8e7ff',
                        borderRadius: 10,
                        fontSize: 12,
                        color: '#5a52e0',
                        fontWeight: 500,
                      }}
                    >
                      {f.name}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <input ref={fileInputRef} type="file" multiple hidden accept="image/*,video/*" onChange={handleFileChange} />
          </Box>

          {/* Row 3: 3D Files + Live Stream */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111', mb: 0.75 }}>Asset 3D Files</Typography>
              <TextField
                fullWidth size="small" value={threeDFiles}
                onChange={(e) => setThreeDFiles(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f3f4f6', borderRadius: 2, '& fieldset': { border: 'none' } } }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><LinkIcon fontSize="small" sx={{ color: '#9ca3af' }} /></InputAdornment> } }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 500, color: '#111', mb: 0.75 }}>Asset Live Stream</Typography>
              <TextField
                fullWidth size="small" value={liveStream}
                onChange={(e) => setLiveStream(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#f3f4f6', borderRadius: 2, '& fieldset': { border: 'none' } } }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><LinkIcon fontSize="small" sx={{ color: '#9ca3af' }} /></InputAdornment> } }}
              />
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => handleSave(true)}
              disabled={actionLoading}
              sx={{
                borderColor: '#d1d5db',
                color: '#374151',
                borderRadius: 10,
                px: 3,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
              }}
            >
              {actionLoading ? <CircularProgress size={18} /> : 'Save Draft'}
            </Button>
            <Button
              variant="contained"
              onClick={() => handleSave(false)}
              disabled={actionLoading}
              sx={{
                borderRadius: 10,
                px: 4,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: '#5a52e0' },
              }}
            >
              {actionLoading ? <CircularProgress size={18} color="inherit" /> : 'Continue'}
            </Button>
          </Box>
        </DialogContent>
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
            src={lightboxSrc ?? ''}
            alt="Preview"
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 12, display: 'block', objectFit: 'contain' }}
          />
        </Box>
      </Dialog>
    </>
  );
}
