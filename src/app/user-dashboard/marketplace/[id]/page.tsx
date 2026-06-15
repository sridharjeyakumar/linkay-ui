'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ConfirmPurchaseModal } from '@/components/marketplace/ConfirmPurchaseModal';
import {
  Box, Typography, Avatar, Button, Tabs, Tab, Dialog, IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import {
  Info, ClipboardText, Cube, CornersOut,
  Tag, Hammer, Coin, ArrowSquareOut,
} from '@phosphor-icons/react';

// ── Types ─────────────────────────────────────────────────────────────────────

type EventType = 'Listing' | 'Auction' | 'Mint';
type ActivityFilter = 'All' | EventType;

interface DetailAsset {
  id: string;
  title: string;
  category: string;
  custodian: string;
  holderName: string;
  holderAvatar: string;
  priceUsdt: number;
  priceUsd: number;
  images: string[];
  description: string;
  additionalInfo: { label: string; value: string }[];
  blockchain: { label: string; value: string }[];
}

interface ActivityRow {
  id: string;
  event: EventType;
  price: string;
  from: string;
  to: string;
  time: string;
}

// ── Static data ───────────────────────────────────────────────────────────────

function assetImages(seed: string): string[] {
  return [
    `https://picsum.photos/seed/${seed}a/600/450`,
    `https://picsum.photos/seed/${seed}b/600/450`,
    `https://picsum.photos/seed/${seed}c/600/450`,
    `https://picsum.photos/seed/${seed}d/600/450`,
  ];
}

const SHARED_DESC =
  'Napoleon Crossing the Alps depicts the French military leader during his historic campaign across the Great St. Bernard Pass in 1800. The dramatic composition, powerful rearing horse, and flowing red cloak symbolize leadership, determination, and victory, transforming a historical event into an enduring image of heroism and ambition.';

const SHARED_ADDITIONAL: { label: string; value: string }[] = [
  { label: 'Jurisdiction', value: 'Switzerland' },
  { label: 'Certification Ref', value: 'CERT-2024-001' },
  { label: 'Ownership Entity', value: 'Heritage Trust LLC' },
  { label: 'Total Fractions', value: '1,000' },
  { label: 'Tokenized %', value: '30%' },
  { label: 'Condition Report', value: 'Excellent — no visible wear' },
];

function blockchainData(tokenId: string): { label: string; value: string }[] {
  return [
    { label: 'Contract Address', value: '0x1234...abcd' },
    { label: 'Token ID', value: tokenId },
    { label: 'Token Standard', value: 'ERC-3643' },
    { label: 'Blockchain', value: 'Ethereum' },
    { label: 'Transaction Hash', value: '0xabcd...5678' },
  ];
}

const ASSETS: DetailAsset[] = [
  { id: '1', title: 'Bronze Helm', category: 'Collectible', custodian: 'Linkay Custodial Services', holderName: 'Jovince_fi', holderAvatar: '', priceUsdt: 103, priceUsd: 105, images: assetImages('bronzehelm'), description: SHARED_DESC, additionalInfo: SHARED_ADDITIONAL, blockchain: blockchainData('#1') },
  { id: '2', title: 'River Bay', category: 'Real Estate', custodian: 'Linkay Custodial Services', holderName: 'Jovince_fi', holderAvatar: '', priceUsdt: 645, priceUsd: 660, images: assetImages('riverbay'), description: SHARED_DESC, additionalInfo: SHARED_ADDITIONAL, blockchain: blockchainData('#2') },
  { id: '3', title: 'Noir Crystal', category: 'Collectible', custodian: 'Linkay Custodial Services', holderName: 'Jovince_fi', holderAvatar: '', priceUsdt: 112, priceUsd: 115, images: assetImages('noircrystal'), description: SHARED_DESC, additionalInfo: SHARED_ADDITIONAL, blockchain: blockchainData('#3') },
  { id: '4', title: 'Axis Hall', category: 'Real Estate', custodian: 'Linkay Custodial Services', holderName: 'Jovince_fi', holderAvatar: '', priceUsdt: 1800, priceUsd: 1845, images: assetImages('axishall'), description: SHARED_DESC, additionalInfo: SHARED_ADDITIONAL, blockchain: blockchainData('#4') },
  { id: '5', title: 'Arctic Crystal', category: 'Mineral', custodian: 'Linkay Custodial Services', holderName: 'Jovince_fi', holderAvatar: '', priceUsdt: 2500, priceUsd: 2560, images: assetImages('arcticcrystal'), description: SHARED_DESC, additionalInfo: SHARED_ADDITIONAL, blockchain: blockchainData('#5') },
  { id: '6', title: 'Bellmont House', category: 'Real Estate', custodian: 'Linkay Custodial Services', holderName: 'Jovince_fi', holderAvatar: '', priceUsdt: 8500, priceUsd: 8700, images: assetImages('bellmonthouse'), description: SHARED_DESC, additionalInfo: SHARED_ADDITIONAL, blockchain: blockchainData('#6') },
  { id: '7', title: 'Echo of Anubis', category: 'Collectible', custodian: 'Linkay Custodial Services', holderName: 'Jovince_fi', holderAvatar: '', priceUsdt: 4200, priceUsd: 4300, images: assetImages('echoanubis'), description: SHARED_DESC, additionalInfo: SHARED_ADDITIONAL, blockchain: blockchainData('#7') },
  { id: '8', title: 'Cosmic Ore', category: 'Mineral', custodian: 'Linkay Custodial Services', holderName: 'Jovince_fi', holderAvatar: '', priceUsdt: 12000, priceUsd: 12300, images: assetImages('cosmicOre'), description: SHARED_DESC, additionalInfo: SHARED_ADDITIONAL, blockchain: blockchainData('#8') },
  { id: '9', title: 'Jade Vase', category: 'Collectible', custodian: 'Linkay Custodial Services', holderName: 'Jovince_fi', holderAvatar: '', priceUsdt: 18500, priceUsd: 18950, images: assetImages('jadevase'), description: SHARED_DESC, additionalInfo: SHARED_ADDITIONAL, blockchain: blockchainData('#9') },
  { id: '10', title: 'Timber Ridge', category: 'Mineral', custodian: 'Linkay Custodial Services', holderName: 'Jovince_fi', holderAvatar: '', priceUsdt: 25000, priceUsd: 25600, images: assetImages('timberridge'), description: SHARED_DESC, additionalInfo: SHARED_ADDITIONAL, blockchain: blockchainData('#10') },
];

const ACTIVITY: ActivityRow[] = [
  { id: '1', event: 'Listing', price: '0.0012 USDT', from: 'Jovince_fi', to: 'Nancy', time: '2d ago' },
  { id: '2', event: 'Listing', price: '0.0012 USDT', from: 'Jovince_fi', to: 'Nancy', time: '2w ago' },
  { id: '3', event: 'Listing', price: '0.0012 USDT', from: 'Jovince_fi', to: 'Nancy', time: '3w ago' },
  { id: '4', event: 'Listing', price: '0.0012 USDT', from: 'Jovince_fi', to: 'Nancy', time: '1mon ago' },
  { id: '5', event: 'Listing', price: '0.0012 USDT', from: 'Jovince_fi', to: 'Nancy', time: '1mon ago' },
  { id: '6', event: 'Listing', price: '0.0012 USDT', from: 'Jovince_fi', to: 'Nancy', time: '1mon ago' },
  { id: '7', event: 'Auction', price: '0.0012 USDT', from: 'Jovince_fi', to: 'Nancy', time: '2mon ago' },
  { id: '8', event: 'Mint', price: '—', from: 'Jovince_fi', to: 'Nancy', time: '2mon ago' },
];

const ACTIVITY_FILTERS: ActivityFilter[] = ['All', 'Auction', 'Listing', 'Mint'];

const ICON_BG = 'linear-gradient(90deg, #FBBF24 0%, #EF4444 100%)';

function fmtUsdt(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// ── GradientIconBox ───────────────────────────────────────────────────────────

function GradientIconBox({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: 40, height: 40, borderRadius: '10px', background: ICON_BG,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

// ── AccordionItem ─────────────────────────────────────────────────────────────

function AccordionItem({
  icon, label, children, defaultOpen = false,
}: {
  icon: React.ReactNode; label: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ border: '1px solid #f0f0f0', borderRadius: '12px', overflow: 'hidden' }}>
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, p: '14px 16px',
          cursor: 'pointer', bgcolor: '#fff', '&:hover': { bgcolor: '#fafafa' },
        }}
      >
        <GradientIconBox>{icon}</GradientIconBox>
        <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#111', flex: 1 }}>{label}</Typography>
        {open
          ? <KeyboardArrowUpIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
          : <KeyboardArrowDownIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
        }
      </Box>
      {open && (
        <Box sx={{ px: 2, pb: 2.5, pt: 0.5, bgcolor: '#fff' }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

// ── ActivityFilterPill ────────────────────────────────────────────────────────

function ActivityPill({
  label, active, icon, onClick,
}: {
  label: string; active: boolean; icon?: React.ReactNode; onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: 0.5,
        px: 1.5, py: '5px', borderRadius: '50px', cursor: 'pointer',
        border: '1px solid', borderColor: active ? '#111' : '#e5e7eb',
        bgcolor: active ? '#111' : 'transparent',
        color: active ? '#fff' : '#374151',
        fontSize: 12, fontWeight: 500,
        transition: 'all 0.15s', userSelect: 'none', whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

// ── ImageGallery ──────────────────────────────────────────────────────────────

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <Box>
      {/* Main image */}
      <Box
        sx={{
          position: 'relative', borderRadius: '16px', overflow: 'hidden',
          bgcolor: '#f3f4f6', width: '100%', paddingTop: '75%',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Left arrow */}
        {active > 0 && (
          <IconButton
            onClick={() => setActive((i) => i - 1)}
            size="small"
            sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', p: 0.3, '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' } }}
          >
            <ChevronLeftIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        {/* Right arrow */}
        {active < images.length - 1 && (
          <IconButton
            onClick={() => setActive((i) => i + 1)}
            size="small"
            sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.45)', color: '#fff', p: 0.3, '&:hover': { bgcolor: 'rgba(0,0,0,0.65)' } }}
          >
            <ChevronRightIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        {/* Full Size button */}
        <Box
          onClick={() => setLightboxOpen(true)}
          sx={{
            position: 'absolute', bottom: 12, right: 12,
            display: 'flex', alignItems: 'center', gap: 0.5,
            bgcolor: 'rgba(0,0,0,0.55)', borderRadius: '8px', px: 1.25, py: 0.5,
            cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
          }}
        >
          <CornersOut size={13} color="#fff" weight="bold" />
          <Typography sx={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>Full Size</Typography>
        </Box>
      </Box>

      {/* Thumbnails: 4 slots */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mt: 1.5 }}>
        {images.map((img, i) => (
          <Box
            key={i}
            onClick={() => setActive(i)}
            sx={{
              borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
              paddingTop: '75%', position: 'relative', bgcolor: '#f3f4f6',
              border: '2.5px solid',
              borderColor: i === active ? '#1E40AF' : 'transparent',
              transition: 'border-color 0.15s',
              '&:hover': { borderColor: i === active ? '#1E40AF' : '#d1d5db' },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`${title} ${i + 1}`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </Box>
        ))}
      </Box>

      {/* Lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth={false}
        slotProps={{
          paper: { sx: { bgcolor: 'transparent', boxShadow: 'none', m: 0, overflow: 'hidden', width: '100vw', maxWidth: '100vw', height: '100vh', maxHeight: '100vh' } },
          backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' } },
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{ position: 'absolute', top: 16, right: 16, color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}
          >
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <Typography sx={{ position: 'absolute', top: 20, left: 20, color: '#fff', fontSize: 13, fontWeight: 600 }}>
            {active + 1} / {images.length}
          </Typography>
          {active > 0 && (
            <IconButton
              onClick={() => setActive((i) => i - 1)}
              sx={{ position: 'absolute', left: 16, color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}
            >
              <ChevronLeftIcon sx={{ fontSize: 28 }} />
            </IconButton>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={title}
            style={{ maxWidth: '85vw', maxHeight: '80vh', display: 'block', borderRadius: 12, objectFit: 'contain' }}
          />
          {active < images.length - 1 && (
            <IconButton
              onClick={() => setActive((i) => i + 1)}
              sx={{ position: 'absolute', right: 16, color: '#fff', bgcolor: 'rgba(255,255,255,0.12)', '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}
            >
              <ChevronRightIcon sx={{ fontSize: 28 }} />
            </IconButton>
          )}
          <Box sx={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.75 }}>
            {images.map((_, i) => (
              <Box
                key={i}
                onClick={() => setActive(i)}
                sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i === active ? '#fff' : 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'background-color 0.2s' }}
              />
            ))}
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

// ── DetailsTab ────────────────────────────────────────────────────────────────

function DetailsTab({ asset }: { asset: DetailAsset }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
      <AccordionItem
        icon={<Info size={20} color="#fff" weight="bold" />}
        label="Description"
        defaultOpen
      >
        <Typography sx={{ fontSize: 13, color: '#6b7280', lineHeight: 1.9, mt: 0.75 }}>
          {asset.description}
        </Typography>
      </AccordionItem>

      <AccordionItem
        icon={<ClipboardText size={20} color="#fff" weight="bold" />}
        label="Additional Information"
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '14px 24px', mt: 1 }}>
          {asset.additionalInfo.map((item) => (
            <Box key={item.label}>
              <Typography sx={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', mb: '2px' }}>
                {item.label}
              </Typography>
              <Typography sx={{ fontSize: 13, color: '#111', fontWeight: 500 }}>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </AccordionItem>

      <AccordionItem
        icon={<Cube size={20} color="#fff" weight="bold" />}
        label="Blockchain Details"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mt: 1 }}>
          {asset.blockchain.map((item) => (
            <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{item.label}</Typography>
              <Typography sx={{ fontSize: 12, color: '#111', fontWeight: 600, fontFamily: 'monospace' }}>{item.value}</Typography>
            </Box>
          ))}
        </Box>
      </AccordionItem>
    </Box>
  );
}

// ── ActivityTab ───────────────────────────────────────────────────────────────

function ActivityTab() {
  const [filter, setFilter] = useState<ActivityFilter>('All');

  const rows = useMemo(() => {
    if (filter === 'All') return ACTIVITY;
    return ACTIVITY.filter((a) => a.event === filter);
  }, [filter]);

  function EventIcon({ event }: { event: EventType }) {
    if (event === 'Listing') return <Tag size={14} weight="bold" />;
    if (event === 'Auction') return <Hammer size={14} weight="bold" />;
    return <Coin size={14} weight="bold" />;
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Filter pills */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {ACTIVITY_FILTERS.map((f) => (
          <ActivityPill
            key={f}
            label={f}
            active={filter === f}
            icon={
              f === 'Auction' ? <Hammer size={12} weight="bold" style={{ marginRight: 2 }} /> :
              f === 'Listing' ? <Tag size={12} weight="bold" style={{ marginRight: 2 }} /> :
              f === 'Mint'    ? <Coin size={12} weight="bold" style={{ marginRight: 2 }} /> :
              undefined
            }
            onClick={() => setFilter(f)}
          />
        ))}
      </Box>

      {/* Table */}
      <Box sx={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f0f0f0' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1.5fr 1fr',
            px: 2, py: 1.25, bgcolor: '#fafafa', borderBottom: '1px solid #f0f0f0', minWidth: 480,
          }}
        >
          {['Event', 'Price', 'From', 'To', 'Time'].map((h) => (
            <Typography key={h} sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {h}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        {rows.map((row, i) => (
          <Box
            key={row.id}
            sx={{
              display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1.5fr 1fr',
              px: 2, py: 1.25, alignItems: 'center', minWidth: 480,
              borderBottom: i < rows.length - 1 ? '1px solid #f9f9f9' : 'none',
              bgcolor: '#fff', '&:hover': { bgcolor: '#fafafa' },
            }}
          >
            {/* Event */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#374151' }}>
              <EventIcon event={row.event} />
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{row.event}</Typography>
            </Box>
            {/* Price */}
            <Typography sx={{ fontSize: 12, color: '#374151' }}>{row.price}</Typography>
            {/* From */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: '#e0e7ff', color: '#4f46e5' }}>
                {row.from[0]?.toUpperCase()}
              </Avatar>
              <Typography sx={{ fontSize: 12, color: '#374151' }}>{row.from}</Typography>
            </Box>
            {/* To */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: '#fce7f3', color: '#be185d' }}>
                {row.to[0]?.toUpperCase()}
              </Avatar>
              <Typography sx={{ fontSize: 12, color: '#374151' }}>{row.to}</Typography>
            </Box>
            {/* Time + link */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>{row.time}</Typography>
              <Box sx={{ color: '#9ca3af', cursor: 'pointer', display: 'flex', '&:hover': { color: '#374151' } }}>
                <ArrowSquareOut size={13} weight="bold" />
              </Box>
            </Box>
          </Box>
        ))}

        {rows.length === 0 && (
          <Box sx={{ px: 2, py: 4, textAlign: 'center' }}>
            <Typography sx={{ fontSize: 13, color: '#9ca3af' }}>No activity found</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AssetDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const asset = ASSETS.find((a) => a.id === id) ?? ASSETS[0];
  const [activeTab, setActiveTab] = useState(0);
  const [buyOpen, setBuyOpen] = useState(false);

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 0, sm: 1 }, py: { xs: 2, sm: 3 } }}>
      {/* Two-column layout: images left, info right */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 5 },
          alignItems: 'flex-start',
        }}
      >
        {/* ─── Left: Image gallery ─────────────────────────────────────── */}
        <Box sx={{ width: { xs: '100%', md: '46%' }, flexShrink: 0 }}>
          <ImageGallery images={asset.images} title={asset.title} />
        </Box>

        {/* ─── Right: Asset info ───────────────────────────────────────── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <Typography
            sx={{ fontWeight: 800, fontSize: { xs: 22, sm: 26, md: 28 }, color: '#111', lineHeight: 1.2, mb: 2 }}
          >
            {asset.title}
          </Typography>

          {/* Category + Custodian badges */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
            <Box sx={{ px: 1.5, py: '5px', bgcolor: '#111', borderRadius: '8px' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{asset.category}</Typography>
            </Box>
            <Box sx={{ px: 1.5, py: '5px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{asset.custodian}</Typography>
            </Box>
          </Box>

          {/* Current Holder */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography sx={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, minWidth: 100 }}>
              Current Holder
            </Typography>
            <Avatar
              src={asset.holderAvatar || undefined}
              sx={{ width: 24, height: 24, fontSize: 11, bgcolor: '#e0e7ff', color: '#4f46e5' }}
            >
              {asset.holderName[0]?.toUpperCase()}
            </Avatar>
            <Typography sx={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{asset.holderName}</Typography>
          </Box>

          {/* List Price */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            <Typography sx={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>List Price</Typography>
            <Typography sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 800, color: '#111' }}>
              {fmtUsdt(asset.priceUsdt)} USDT
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#9ca3af' }}>
              (${fmtUsdt(asset.priceUsd)})
            </Typography>
          </Box>

          {/* Buy Now */}
          <Button
            fullWidth
            onClick={() => setBuyOpen(true)}
            sx={{
              background: 'linear-gradient(270deg, #0EA5E9 0%, #1E40AF 100%)',
              color: '#fff', borderRadius: '50px',
              fontWeight: 700, fontSize: { xs: 15, sm: 16 },
              textTransform: 'none', py: 1.5, mb: 3,
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(270deg, #0284C7 0%, #1E3A8A 100%)',
                boxShadow: '0 6px 20px rgba(14,165,233,0.4)',
              },
            }}
          >
            Buy now
          </Button>

          {/* Confirm Purchase modal */}
          <ConfirmPurchaseModal
            open={buyOpen}
            onClose={() => setBuyOpen(false)}
            asset={{
              title: asset.title,
              images: asset.images,
              priceUsdt: asset.priceUsdt,
              priceUsd: asset.priceUsd,
            }}
          />

          {/* Details / Activity tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              borderBottom: '1px solid #f0f0f0',
              minHeight: 40,
              '& .MuiTab-root': {
                textTransform: 'none', fontWeight: 600, fontSize: 14,
                color: '#9ca3af', minWidth: 0, px: 0, mr: 3, minHeight: 40, pb: 1,
              },
              '& .Mui-selected': { color: '#111' },
              '& .MuiTabs-indicator': { bgcolor: '#111', height: 2, borderRadius: 1 },
            }}
          >
            <Tab label="Details" />
            <Tab label="Activity" />
          </Tabs>

          {activeTab === 0 && <DetailsTab asset={asset} />}
          {activeTab === 1 && <ActivityTab />}
        </Box>
      </Box>
    </Box>
  );
}
