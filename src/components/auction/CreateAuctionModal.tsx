'use client';

import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Asset } from '@/types/asset.types';

import { StepLines } from './shared/StepLines';
import { btnPrimary, btnSecondary } from './shared/styles';
import { AuctionInfoStep } from './steps/AuctionInfoStep';
import { SupplyPricingStep, type SupplyPricingValues } from './steps/SupplyPricingStep';
import { AuctionPreviewModal } from './AuctionPreviewModal';
import { ScheduleAuctionModal, type ScheduleValues } from './ScheduleAuctionModal';
import { AuctionConfirmDialog } from './AuctionConfirmDialog';
import { AuctionSuccessModal } from './AuctionSuccessModal';

// ── types ─────────────────────────────────────────────────────────────────────

type View = 'step1' | 'step2' | 'preview' | 'schedule' | 'confirm' | 'success';

const STEP_TITLES: Record<View, string> = {
  step1: 'AUCTION INFO',
  step2: 'SUPPLY & PRICING CONFIGURATION',
  preview: '',
  schedule: '',
  confirm: '',
  success: '',
};

// ── props ─────────────────────────────────────────────────────────────────────

export interface CreateAuctionModalProps {
  open: boolean;
  asset: Asset;
  onClose: () => void;
  onSaveDraft?: (data: AuctionDraftData) => void;
  onSchedule?: (data: AuctionScheduleData) => Promise<void>;
}

export interface AuctionDraftData {
  auctionTitle: string;
  auctionDescription: string;
  pricing: SupplyPricingValues;
}

export interface AuctionScheduleData extends AuctionDraftData {
  schedule: ScheduleValues;
}

// ── helpers ───────────────────────────────────────────────────────────────────

const emptyPricing: SupplyPricingValues = {
  fractionsAllocated: '',
  minPurchaseQty: '',
  maxPurchaseQty: '',
  startingBidPrice: '',
  reservePrice: '',
  minIncrement: '',
};

const emptySchedule: ScheduleValues = {
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  timezone: 'UTC',
  showCountdown: true,
};

function isPricingComplete(p: SupplyPricingValues) {
  return (
    !!p.fractionsAllocated &&
    !!p.minPurchaseQty &&
    !!p.maxPurchaseQty &&
    !!p.startingBidPrice &&
    !!p.reservePrice &&
    !!p.minIncrement
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export function CreateAuctionModal({
  open,
  asset,
  onClose,
  onSaveDraft,
  onSchedule,
}: CreateAuctionModalProps) {
  const [view, setView] = useState<View>('step1');
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [auctionTitle, setAuctionTitle] = useState('');
  const [auctionDescription, setAuctionDescription] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Step 2
  const [pricing, setPricing] = useState<SupplyPricingValues>(emptyPricing);

  // Schedule
  const [schedule, setSchedule] = useState<ScheduleValues>(emptySchedule);

  // Reset on open
  useEffect(() => {
    if (open) {
      setView('step1');
      setAuctionTitle('');
      setAuctionDescription('');
      setActiveImageIndex(0);
      setPricing(emptyPricing);
      setSchedule(emptySchedule);
      setSubmitting(false);
    }
  }, [open]);

  function handlePricingChange(field: keyof SupplyPricingValues, value: string) {
    setPricing((prev) => ({ ...prev, [field]: value }));
  }

  function handleScheduleChange(field: keyof ScheduleValues, value: string | boolean) {
    setSchedule((prev) => ({ ...prev, [field]: value }));
  }

  function handleSaveDraft() {
    onSaveDraft?.({ auctionTitle, auctionDescription, pricing });
  }

  async function handleConfirmSchedule() {
    if (!onSchedule) { setView('success'); return; }
    setSubmitting(true);
    try {
      await onSchedule({ auctionTitle, auctionDescription, pricing, schedule });
      setView('success');
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (view === 'success') { onClose(); return; }
    onClose();
  }

  // Which main-dialog step is shown (1 or 2)?
  const mainDialogOpen = open && (view === 'step1' || view === 'step2');
  const stepNumber = view === 'step2' ? 2 : 1;
  const canNext = auctionTitle.trim() !== '';
  const pricingComplete = isPricingComplete(pricing);

  return (
    <>
      {/* ── Main 2-step dialog ─────────────────────────────────────── */}
      <Dialog
        open={mainDialogOpen}
        onClose={handleClose}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              borderRadius: { xs: 3, sm: 3 },
              bgcolor: '#fff',
              width: { xs: '100%', sm: 'calc(100% - 32px)', md: 560 },
              maxWidth: { xs: '100%', sm: 560 },
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
        {/* Fixed header */}
        <Box sx={{ flexShrink: 0, px: 3, pt: 2.5, pb: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            {view === 'step2' ? (
              <Button
                onClick={() => setView('step1')}
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

          <StepLines step={stepNumber} total={2} />

          <Typography sx={{ fontWeight: 700, fontSize: 17, color: '#111', letterSpacing: 0.3 }}>
            {STEP_TITLES[view]}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: '1px solid #f0f0f0', mt: 1.5, flexShrink: 0 }} />

        {/* Scrollable content */}
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
            '&::-webkit-scrollbar-thumb': { background: '#d1d5db', borderRadius: 4 },
          }}
        >
          {view === 'step1' && (
            <AuctionInfoStep
              asset={asset}
              auctionTitle={auctionTitle}
              auctionDescription={auctionDescription}
              activeImageIndex={activeImageIndex}
              onTitleChange={setAuctionTitle}
              onDescriptionChange={setAuctionDescription}
              onDotClick={setActiveImageIndex}
            />
          )}
          {view === 'step2' && (
            <SupplyPricingStep
              asset={asset}
              values={pricing}
              onChange={handlePricingChange}
            />
          )}
        </Box>

        {/* Fixed footer */}
        <Box sx={{ borderTop: '1px solid #f0f0f0', flexShrink: 0 }} />
        <Box
          sx={{
            flexShrink: 0,
            px: 3,
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* Save Draft */}
          <Button onClick={handleSaveDraft} sx={btnSecondary}>
            Save Draft
          </Button>

          {view === 'step1' && (
            <Button
              onClick={() => setView('step2')}
              disabled={!canNext}
              sx={btnPrimary}
            >
              Next
            </Button>
          )}

          {view === 'step2' && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Preview */}
              <Button
                onClick={() => setView('preview')}
                disabled={!pricingComplete}
                variant="outlined"
                sx={{
                  borderRadius: 10,
                  px: 2.5,
                  py: 1,
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: 'none',
                  color: pricingComplete ? '#374151' : '#9ca3af',
                  borderColor: pricingComplete ? '#d1d5db' : '#e5e7eb',
                  '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' },
                  '&.Mui-disabled': { color: '#9ca3af', borderColor: '#e5e7eb' },
                }}
              >
                Preview
              </Button>
              {/* Proceed to schedule */}
              <Button
                onClick={() => setView('schedule')}
                sx={btnPrimary}
              >
                {submitting ? (
                  <CircularProgress size={16} sx={{ color: '#fff' }} />
                ) : (
                  'Proceed to schedule'
                )}
              </Button>
            </Box>
          )}
        </Box>
      </Dialog>

      {/* ── Preview modal ──────────────────────────────────────────── */}
      <AuctionPreviewModal
        open={open && view === 'preview'}
        asset={asset}
        activeImageIndex={activeImageIndex}
        onDotClick={setActiveImageIndex}
        pricing={pricing}
        onEdit={() => setView('step2')}
        onProceed={() => setView('schedule')}
        onClose={() => setView('step2')}
      />

      {/* ── Schedule modal ─────────────────────────────────────────── */}
      <ScheduleAuctionModal
        open={open && view === 'schedule'}
        values={schedule}
        onChange={handleScheduleChange}
        onCancel={() => setView('preview')}
        onSchedule={() => setView('confirm')}
      />

      {/* ── Confirm dialog ─────────────────────────────────────────── */}
      <AuctionConfirmDialog
        open={open && view === 'confirm'}
        loading={submitting}
        onCancel={() => setView('schedule')}
        onConfirm={handleConfirmSchedule}
      />

      {/* ── Success modal ──────────────────────────────────────────── */}
      <AuctionSuccessModal
        open={open && view === 'success'}
        asset={asset}
        activeImageIndex={activeImageIndex}
        onDotClick={setActiveImageIndex}
        pricing={pricing}
        schedule={schedule}
        onClose={handleClose}
      />
    </>
  );
}
