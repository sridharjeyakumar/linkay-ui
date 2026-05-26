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
} from '@mui/material';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from 'react';

/* ─── Types ───────────────────────────────────────────────── */

interface QueueRow {
  asset: string;
  owner: string;
  valuation: string;
  category: string;
  type: string;
  custodian: string;
  fractions: number;
  perFraction: string;
  description: string;
  historicalContext: string;
  conditionReport: string;
  certRef: string;
  imageBg: string;
}

/* ─── Static data ─────────────────────────────────────────── */

const TOP_STATS = [
  { label: 'AUCTIONS AWAITING APPROVAL', value: '12' },
  { label: 'LIVE AUCTIONS',             value: '38' },
  { label: 'REGISTERED ASSET OWNERS',   value: '412' },
];

const SIDE_STATS = [
  { label: 'VERIFIED INVESTORS',      value: '8,421'  },
  { label: 'TOTAL ASSETS',            value: '619'    },
  { label: 'TOTAL ASSET VALUE',       value: '$ 300M' },
  { label: 'PLATFORM FEES GENERATED', value: '$ 328K' },
];

const QUEUE_ROWS: QueueRow[] = [
  {
    asset: 'Whispers of the Horizon',
    owner: 'Linkay Custody',
    valuation: '$5000000',
    category: 'Collectible',
    type: 'Artwork',
    custodian: 'Linkay Custodial Services',
    fractions: 30,
    perFraction: '$3,18,650.781',
    description: 'This contemporary abstract artwork features layered textures and flowing brushstrokes in shades of deep blue, gold, and crimson. The composition evokes a dreamlike landscape where light and motion intersect. Bold geometric accents contrast with soft gradients, creating a balance between structure and emotion. The piece explores themes of memory...',
    historicalContext: 'This contemporary abstract artwork features layered textures and flowing brushstrokes in shades of deep blue, gold, and crimson. The composition evokes a dreamlike landscape where light and motion intersect. Bold geometric accents contrast with soft gradients, creating a balance between structure and emotion. The piece explores themes of memory...',
    conditionReport: 'Excellent overall condition',
    certRef: 'CERT-ART-2026-004781',
    imageBg: 'linear-gradient(135deg, #8B6914 0%, #C4956A 40%, #7B5C8D 80%, #4A3B6B 100%)',
  },
  {
    asset: 'Blue Sapphire Reserve',
    owner: 'Nova Minerals',
    valuation: '$785000000',
    category: 'Real Estate',
    type: 'Real Estate',
    custodian: 'Nova Custodial Services',
    fractions: 50,
    perFraction: '$15,700,000',
    description: 'A premium real estate asset featuring a prime commercial property in the heart of the financial district. The property boasts modern architecture with state-of-the-art facilities and exceptional connectivity to all major transit hubs.',
    historicalContext: 'Originally developed in 2018, the Blue Sapphire Reserve has established itself as a landmark commercial property with a strong track record of premium tenancies and consistent rental yields across multiple economic cycles.',
    conditionReport: 'Excellent structural condition',
    certRef: 'CERT-RE-2026-007823',
    imageBg: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #0EA5E9 100%)',
  },
  {
    asset: 'Chola Dynasty Artifact',
    owner: 'Heritage Vault',
    valuation: '$7844400',
    category: 'Collectible',
    type: 'Artifact',
    custodian: 'Heritage Custodial Services',
    fractions: 20,
    perFraction: '$392,220',
    description: 'A rare bronze artifact from the Chola Dynasty period, dating back to the 10th century. The piece features intricate craftsmanship with religious iconography and represents a significant piece of South Asian cultural heritage.',
    historicalContext: 'The Chola Dynasty, known for their patronage of arts and architecture, produced some of the finest bronze sculptures in history. This artifact was discovered in Tamil Nadu and authenticated by leading archaeological experts.',
    conditionReport: 'Good condition, minor patina',
    certRef: 'CERT-ART-2026-003312',
    imageBg: 'linear-gradient(135deg, #92400E 0%, #D97706 50%, #B45309 100%)',
  },
  {
    asset: 'Skyline Logistics Hub',
    owner: 'Urban Axis',
    valuation: '$260,000',
    category: 'Real Estate',
    type: 'Industrial',
    custodian: 'Urban Axis Custodial',
    fractions: 25,
    perFraction: '$10,400',
    description: 'A modern logistics and warehousing hub strategically located near major transport corridors. The facility offers 50,000 sq ft of Grade A warehouse space with advanced automation systems and smart inventory management.',
    historicalContext: 'Developed in 2022 as part of the Smart Cities initiative, Skyline Logistics Hub represents the next generation of industrial real estate with integrated technology and sustainable design principles.',
    conditionReport: 'New condition, fully operational',
    certRef: 'CERT-IND-2026-009901',
    imageBg: 'linear-gradient(135deg, #374151 0%, #6B7280 50%, #9CA3AF 100%)',
  },
];

const TABLE_COLS = ['Tokenized Asset', 'Asset Owner', 'Valuation', 'Category', 'Actions'];

/* ─── Sub-components ──────────────────────────────────────── */

function TopStatCard({ label, value }: { label: string; value: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #E8E8E8',
        borderRadius: '10px',
        bgcolor: '#FFFFFF',
        p: { xs: '14px 16px', sm: '18px 22px' },
        textAlign: 'center',
        height: '100%',
      }}
    >
      <Typography sx={{ fontSize: { xs: '10px', sm: '11px' }, fontWeight: 500, color: '#999999', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', mb: '8px', lineHeight: 1.4 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: { xs: '24px', sm: '28px', md: '30px' }, fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function SideStatCard({ label, value }: { label: string; value: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #E8E8E8',
        borderRadius: '10px',
        bgcolor: '#FFFFFF',
        p: { xs: '14px 16px', sm: '18px 22px' },
      }}
    >
      <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#999999', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', mb: '8px', lineHeight: 1.4 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: { xs: '22px', sm: '24px', md: '26px' }, fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const isCollectible = category === 'Collectible';
  return (
    <Box component="span" sx={{ display: 'inline-block', px: '12px', py: '4px', borderRadius: '12px', bgcolor: isCollectible ? '#EDE9FE' : '#FCE7F3', color: isCollectible ? '#7C3AED' : '#BE185D', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>
      {category}
    </Box>
  );
}

/* ─── Approve Modal ───────────────────────────────────────── */

function ApproveModal({ row, open, onClose, onConfirm }: { row: QueueRow | null; open: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!row) return null;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '14px',
            m: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        },
      }}
    >
      <DialogContent sx={{ p: '24px', position: 'relative' }}>
        {/* Close button */}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: '#9CA3AF',
            '&:hover': { color: '#374151', bgcolor: '#F3F4F6' },
          }}
        >
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>

        {/* Warning icon */}
        <Box
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            bgcolor: '#FFF7ED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: '16px',
          }}
        >
          <WarningAmberIcon sx={{ fontSize: '22px', color: '#F97316' }} />
        </Box>

        {/* Title */}
        <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', mb: '10px', pr: '24px', lineHeight: 1.4 }}>
          Are you sure you want to approve &ldquo;{row.asset}&rdquo;
        </Typography>

        {/* Body text */}
        <Typography sx={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, mb: '24px' }}>
          You are about to approve this tokenized asset for auction eligibility. Once approved, the asset owner will be allowed to configure and submit auctions for investor participation. Action cannot be undone
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            onClick={onClose}
            sx={{
              color: '#374151',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '13px',
              textTransform: 'none',
              px: '4px',
              py: '8px',
              minWidth: 0,
              borderRadius: '8px',
              '&:hover': { bgcolor: 'transparent' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            startIcon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
            sx={{
              background: 'linear-gradient(90deg, #FBBE24 0%, #EF4444 100%)',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'none',
              borderRadius: '20px',
              px: '16px',
              py: '8px',
              boxShadow: 'none',
              '&:hover': { background: 'linear-gradient(90deg, #F0B420 0%, #DC2626 100%)', boxShadow: 'none' },
            }}
          >
            Approve Asset
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Decline Modal ───────────────────────────────────────── */

function DeclineModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '14px',
            m: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        },
      }}
    >
      <DialogContent sx={{ p: '24px', position: 'relative' }}>
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: '#9CA3AF',
            '&:hover': { color: '#374151', bgcolor: '#F3F4F6' },
          }}
        >
          <CloseIcon sx={{ fontSize: '18px' }} />
        </IconButton>

        {/* Warning icon */}
        <Box
          sx={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            bgcolor: '#FFF1F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: '16px',
          }}
        >
          <WarningAmberIcon sx={{ fontSize: '22px', color: '#EF4444' }} />
        </Box>

        {/* Title */}
        <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', mb: '4px', pr: '24px' }}>
          Decline Asset Submission
        </Typography>

        {/* Subtitle */}
        <Typography sx={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', mb: '20px', lineHeight: 1.5 }}>
          The asset will remain unavailable for auction creation
        </Typography>

        {/* Reason input */}
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', mb: '8px' }}>
          Reason for Decline
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Enter reason here"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{
            mb: '24px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              color: '#374151',
              '& fieldset': { borderColor: '#E5E7EB' },
              '&:hover fieldset': { borderColor: '#D1D5DB' },
              '&.Mui-focused fieldset': { borderColor: '#9CA3AF', borderWidth: '1px' },
            },
            '& .MuiOutlinedInput-input::placeholder': { color: '#9CA3AF', opacity: 1 },
          }}
        />

        {/* Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            onClick={handleClose}
            sx={{
              color: '#374151',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '13px',
              textTransform: 'none',
              px: '4px',
              py: '8px',
              minWidth: 0,
              borderRadius: '8px',
              '&:hover': { bgcolor: 'transparent' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            startIcon={<CancelIcon sx={{ fontSize: '16px !important' }} />}
            sx={{
              bgcolor: '#EF4444',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'none',
              borderRadius: '20px',
              px: '16px',
              py: '8px',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#DC2626', boxShadow: 'none' },
            }}
          >
            Decline Asset
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

/* ─── View Modal ──────────────────────────────────────────── */

function ViewModal({ row, open, onClose, onApprove, onReject }: { row: QueueRow | null; open: boolean; onClose: () => void; onApprove: () => void; onReject: () => void }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!row) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: fullScreen ? 0 : '12px',
            overflow: 'hidden',
            m: fullScreen ? 0 : '16px',
          },
        },
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          bgcolor: 'rgba(255,255,255,0.9)',
          width: '28px',
          height: '28px',
          '&:hover': { bgcolor: '#F3F4F6' },
        }}
      >
        <CloseIcon sx={{ fontSize: '16px', color: '#374151' }} />
      </IconButton>

      <DialogContent sx={{ p: 0, overflowX: 'hidden', overflowY: 'auto' }}>

        {/* ── Image with gradient placeholder ── */}
        <Box
          sx={{
            width: '100%',
            height: { xs: '160px', sm: '190px' },
            background: row.imageBg,
            flexShrink: 0,
          }}
        />

        {/* ── Pagination dots ── */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '6px', mt: '10px' }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                bgcolor: i === 1 ? '#2563EB' : '#D1D5DB',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </Box>

        {/* ── Title section ── */}
        <Box sx={{ px: '18px', pt: '12px', pb: '14px' }}>
          <Typography sx={{ fontSize: '17px', fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', mb: '4px', textAlign: 'center' }}>
            {row.asset}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#777777', fontFamily: 'Inter, sans-serif', textAlign: 'center', mb: '3px' }}>
            {row.type} | {row.custodian}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#777777', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
            {row.valuation} | {row.fractions} fractions | {row.perFraction} per fraction
          </Typography>
        </Box>

        {/* ── Divider ── */}
        <Box sx={{ height: '1px', bgcolor: '#F3F4F6', mx: '18px' }} />

        {/* ── Asset Description ── */}
        <Box sx={{ px: '18px', pt: '14px', pb: '12px' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', mb: '6px' }}>
            Asset Description
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#555555', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
            {row.description}
          </Typography>
        </Box>

        {/* ── Historical Context ── */}
        <Box sx={{ px: '18px', pb: '14px' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#111111', fontFamily: 'Inter, sans-serif', mb: '6px' }}>
            Historical Context
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#555555', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
            {row.historicalContext}
          </Typography>
        </Box>

        {/* ── Divider ── */}
        <Box sx={{ height: '1px', bgcolor: '#F3F4F6', mx: '18px' }} />

        {/* ── Condition Report + Certification Ref ── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', px: '18px', py: '14px' }}>
          <Box>
            <Typography sx={{ fontSize: '11px', color: '#999999', fontFamily: 'Inter, sans-serif', mb: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Condition Report
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#111111', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              {row.conditionReport}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '11px', color: '#999999', fontFamily: 'Inter, sans-serif', mb: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Certification Ref
            </Typography>
            <Typography sx={{ fontSize: '12px', color: '#111111', fontFamily: 'Inter, sans-serif', fontWeight: 500, wordBreak: 'break-all' }}>
              {row.certRef}
            </Typography>
          </Box>
        </Box>

        {/* ── Action buttons ── */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: '18px',
            pb: '18px',
            pt: '4px',
            gap: '8px',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <Button
            onClick={onClose}
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#374151',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'none',
              borderRadius: '8px',
              px: '20px',
              py: '8px',
              boxShadow: 'none',
              flex: { xs: '1 1 100%', sm: '0 0 auto' },
              '&:hover': { bgcolor: '#1F2937', boxShadow: 'none' },
            }}
          >
            Close
          </Button>

          <Box sx={{ display: 'flex', gap: '8px', flex: { xs: '1 1 100%', sm: '0 0 auto' }, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
            <Button
              variant="contained"
              size="small"
              onClick={onReject}
              sx={{
                bgcolor: '#EF4444',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'none',
                borderRadius: '8px',
                px: '20px',
                py: '8px',
                boxShadow: 'none',
                flex: { xs: 1, sm: '0 0 auto' },
                '&:hover': { bgcolor: '#DC2626', boxShadow: 'none' },
              }}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={onApprove}
              sx={{
                bgcolor: '#2563EB',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'none',
                borderRadius: '8px',
                px: '20px',
                py: '8px',
                boxShadow: 'none',
                flex: { xs: 1, sm: '0 0 auto' },
                '&:hover': { bgcolor: '#1D4ED8', boxShadow: 'none' },
              }}
            >
              Approve
            </Button>
          </Box>
        </Box>

      </DialogContent>
    </Dialog>
  );
}

/* ─── Page ────────────────────────────────────────────────── */

export default function AdminDashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<QueueRow | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);

  const handleView = (row: QueueRow) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleOpenApprove = () => {
    setModalOpen(false);
    setApproveOpen(true);
  };

  const handleOpenDecline = () => {
    setModalOpen(false);
    setDeclineOpen(true);
  };

  const handleApproveConfirm = () => {
    setApproveOpen(false);
    setSelectedRow(null);
  };

  const handleDeclineConfirm = (_reason: string) => {
    setDeclineOpen(false);
    setSelectedRow(null);
  };

  return (
    <Box sx={{ bgcolor: '#F8F8F8', minHeight: 'calc(100vh - 60px)' }}>
      <Box
        sx={{
          maxWidth: '1440px',
          mx: 'auto',
          px: { xs: '16px', sm: '24px', md: '32px' },
          py: { xs: '16px', sm: '20px', md: '24px' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: { xs: '16px', md: '20px' },
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >

          {/* ══ Left / Main column ════════════════════════════ */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: { xs: '14px', md: '16px' } }}>

            {/* Top 3 stat cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: { xs: '12px', sm: '14px' } }}>
              {TOP_STATS.map((s) => (
                <TopStatCard key={s.label} label={s.label} value={s.value} />
              ))}
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
                              {col}
                              <UnfoldMoreIcon sx={{ fontSize: '14px', color: '#CCCCCC' }} />
                            </Box>
                          ) : col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {QUEUE_ROWS.map((row, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          '& .MuiTableCell-root': { borderBottom: i < QUEUE_ROWS.length - 1 ? '1px solid #F5F5F5' : 'none' },
                          '&:hover': { bgcolor: '#FAFAFA' },
                        }}
                      >
                        <TableCell sx={{ fontSize: '13px', fontWeight: 500, color: '#111111', fontFamily: 'Inter, sans-serif', px: { xs: '12px', sm: '16px' }, py: '13px', minWidth: '130px', maxWidth: '180px' }}>
                          {row.asset}
                        </TableCell>
                        <TableCell sx={{ fontSize: '13px', color: '#555555', fontFamily: 'Inter, sans-serif', px: { xs: '12px', sm: '16px' }, py: '13px', whiteSpace: 'nowrap' }}>
                          {row.owner}
                        </TableCell>
                        <TableCell sx={{ fontSize: '13px', color: '#555555', fontFamily: 'Inter, sans-serif', px: { xs: '12px', sm: '16px' }, py: '13px', whiteSpace: 'nowrap' }}>
                          {row.valuation}
                        </TableCell>
                        <TableCell sx={{ px: { xs: '12px', sm: '16px' }, py: '13px' }}>
                          <CategoryBadge category={row.category} />
                        </TableCell>
                        <TableCell sx={{ px: { xs: '12px', sm: '16px' }, py: '13px' }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleView(row)}
                            sx={{
                              bgcolor: '#1E293B',
                              color: '#FFFFFF',
                              fontSize: '12px',
                              fontWeight: 500,
                              fontFamily: 'Inter, sans-serif',
                              textTransform: 'none',
                              borderRadius: '20px',
                              px: '16px',
                              py: '5px',
                              boxShadow: 'none',
                              minWidth: 0,
                              whiteSpace: 'nowrap',
                              '&:hover': { bgcolor: '#0F172A', boxShadow: 'none' },
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Box>

          {/* ══ Right sidebar ═════════════════════════════════ */}
          <Box
            sx={{
              width: { xs: '100%', lg: '240px' },
              flexShrink: 0,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', lg: '1fr' },
              gap: { xs: '12px', sm: '14px' },
            }}
          >
            {SIDE_STATS.map((s) => (
              <SideStatCard key={s.label} label={s.label} value={s.value} />
            ))}
          </Box>

        </Box>
      </Box>

      <ViewModal
        row={selectedRow}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onApprove={handleOpenApprove}
        onReject={handleOpenDecline}
      />
      <ApproveModal
        row={selectedRow}
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        onConfirm={handleApproveConfirm}
      />
      <DeclineModal
        open={declineOpen}
        onClose={() => setDeclineOpen(false)}
        onConfirm={handleDeclineConfirm}
      />
    </Box>
  );
}
