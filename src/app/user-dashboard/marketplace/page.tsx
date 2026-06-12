'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, TextField, InputAdornment, Avatar, Button,
  Chip, Popover, Menu, MenuItem, IconButton, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import { SlidersHorizontal } from '@phosphor-icons/react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Category = 'Collectibles' | 'Real Estate' | 'Minerals';
type CategoryTab = 'All' | Category;
type SaleStatus = 'List Price' | 'Newly Minted';
type PriceRange = 'Under $2,000' | '$2,000 - $10,000' | '$10,000 - $30,000';
type MediaType = 'Image' | 'Video' | '3D';
type SortOrder = 'recent' | 'newest' | 'oldest';

interface MarketAsset {
  id: string;
  title: string;
  category: Category;
  priceUsdt: number;
  mediaType: MediaType;
  saleStatus: SaleStatus;
  image: string;
  creatorName: string;
  creatorAvatar: string;
  creatorId: string;
  createdAt: string;
}

interface FilterState {
  saleStatus: SaleStatus[];
  priceRange: PriceRange[];
  mediaType: MediaType[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORY_TABS: CategoryTab[] = ['All', 'Collectibles', 'Real Estate', 'Minerals'];
const SALE_STATUSES: SaleStatus[] = ['List Price', 'Newly Minted'];
const PRICE_RANGES: PriceRange[] = ['Under $2,000', '$2,000 - $10,000', '$10,000 - $30,000'];
const MEDIA_TYPES: MediaType[] = ['Image', 'Video', '3D'];
const EMPTY_FILTERS: FilterState = { saleStatus: [], priceRange: [], mediaType: [] };
const SORT_LABELS: Record<SortOrder, string> = {
  recent: 'Recent activity',
  newest: 'Newest',
  oldest: 'Oldest',
};

// ── Dummy assets (10) — covers every filter combination ───────────────────────

const DUMMY_ASSETS: MarketAsset[] = [
  {
    id: '1', title: 'Bronze Helm', category: 'Collectibles', priceUsdt: 103,
    mediaType: 'Image', saleStatus: 'List Price',
    image: 'https://picsum.photos/seed/bronzehelm/400/280',
    creatorName: 'Jovince_fi', creatorAvatar: '', creatorId: 'jovince_fi',
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    id: '2', title: 'River Bay', category: 'Real Estate', priceUsdt: 645,
    mediaType: 'Image', saleStatus: 'List Price',
    image: 'https://picsum.photos/seed/riverbay/400/280',
    creatorName: 'Jovince_fi', creatorAvatar: '', creatorId: 'jovince_fi',
    createdAt: '2024-03-08T10:00:00Z',
  },
  {
    id: '3', title: 'Noir Crystal', category: 'Collectibles', priceUsdt: 112,
    mediaType: 'Image', saleStatus: 'Newly Minted',
    image: 'https://picsum.photos/seed/noircrystal/400/280',
    creatorName: 'Jovince_fi', creatorAvatar: '', creatorId: 'jovince_fi',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '4', title: 'Axis Hall', category: 'Real Estate', priceUsdt: 1800,
    mediaType: 'Video', saleStatus: 'Newly Minted',
    image: 'https://picsum.photos/seed/axishall/400/280',
    creatorName: 'Jovince_fi', creatorAvatar: '', creatorId: 'jovince_fi',
    createdAt: '2024-03-20T10:00:00Z',
  },
  {
    id: '5', title: 'Arctic Crystal', category: 'Minerals', priceUsdt: 2500,
    mediaType: 'Image', saleStatus: 'List Price',
    image: 'https://picsum.photos/seed/arcticcrystal/400/280',
    creatorName: 'Jovince_fi', creatorAvatar: '', creatorId: 'jovince_fi',
    createdAt: '2024-02-28T10:00:00Z',
  },
  {
    id: '6', title: 'Bellmont House', category: 'Real Estate', priceUsdt: 8500,
    mediaType: 'Video', saleStatus: 'List Price',
    image: 'https://picsum.photos/seed/bellmonthouse/400/280',
    creatorName: 'Jovince_fi', creatorAvatar: '', creatorId: 'jovince_fi',
    createdAt: '2024-02-20T10:00:00Z',
  },
  {
    id: '7', title: 'Echo of Anubis', category: 'Collectibles', priceUsdt: 4200,
    mediaType: '3D', saleStatus: 'Newly Minted',
    image: 'https://picsum.photos/seed/echoanubis/400/280',
    creatorName: 'Jovince_fi', creatorAvatar: '', creatorId: 'jovince_fi',
    createdAt: '2024-03-25T10:00:00Z',
  },
  {
    id: '8', title: 'Cosmic Ore', category: 'Minerals', priceUsdt: 12000,
    mediaType: 'Image', saleStatus: 'List Price',
    image: 'https://picsum.photos/seed/cosmicOre/400/280',
    creatorName: 'Jovince_fi', creatorAvatar: '', creatorId: 'jovince_fi',
    createdAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '9', title: 'Jade Vase', category: 'Collectibles', priceUsdt: 18500,
    mediaType: '3D', saleStatus: 'Newly Minted',
    image: 'https://picsum.photos/seed/jadevase/400/280',
    creatorName: 'Jovince_fi', creatorAvatar: '', creatorId: 'jovince_fi',
    createdAt: '2024-03-30T10:00:00Z',
  },
  {
    id: '10', title: 'Timber Ridge', category: 'Minerals', priceUsdt: 25000,
    mediaType: 'Video', saleStatus: 'Newly Minted',
    image: 'https://picsum.photos/seed/timberridge/400/280',
    creatorName: 'Jovince_fi', creatorAvatar: '', creatorId: 'jovince_fi',
    createdAt: '2024-04-01T10:00:00Z',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function inPriceRange(price: number, range: PriceRange): boolean {
  if (range === 'Under $2,000') return price < 2000;
  if (range === '$2,000 - $10,000') return price >= 2000 && price <= 10000;
  return price > 10000 && price <= 30000;
}

function fmtUsdt(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// ── Pill (shared toggle chip) ─────────────────────────────────────────────────

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        px: 2, py: '6px', borderRadius: '50px', cursor: 'pointer', userSelect: 'none',
        fontSize: 13, fontWeight: 500, lineHeight: 1.4,
        bgcolor: active ? '#111' : 'transparent',
        color: active ? '#fff' : '#374151',
        border: '1.5px solid',
        borderColor: active ? '#111' : '#e5e7eb',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Box>
  );
}

// ── Asset Card ────────────────────────────────────────────────────────────────

function AssetCard({ asset }: { asset: MarketAsset }) {
  const router = useRouter();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Image only - full box with no cropping */}
      <Box
        sx={{
          width: '100%',
          aspectRatio: '3/3',
          borderRadius: '16px',
          overflow: 'hidden',
          bgcolor: '#f3f4f6',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 28px rgba(0,0,0,0.13)' },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.image}
          alt={asset.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </Box>

      {/* Details below the image */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', px: 0.5 }}>
        {/* Title + USDT badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <Typography
            sx={{
              fontWeight: 700, fontSize: { xs: 13, sm: 14 }, color: '#111',
              lineHeight: 1.2, flex: 1, minWidth: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
          >
            {asset.title}
          </Typography>
          <Box sx={{ bgcolor: '#009393', borderRadius: '20px', px: 1.25, py: '3px', flexShrink: 0 }}>
            <Typography sx={{ fontSize: { xs: 10, sm: 11 }, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
              {fmtUsdt(asset.priceUsdt)} USDT
            </Typography>
          </Box>
        </Box>

        {/* Creator avatar + name */}
        <Link
          href={`/user-dashboard/portfolio?creator=${asset.creatorId}`}
          style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
        >
          <Avatar
            src={asset.creatorAvatar || undefined}
            sx={{ width: 22, height: 22, fontSize: 10, bgcolor: '#e0e7ff', color: '#4f46e5' }}
          >
            {asset.creatorName[0]?.toUpperCase()}
          </Avatar>
          <Typography sx={{ fontSize: { xs: 11, sm: 12 }, color: '#6b7280', fontWeight: 500, lineHeight: 1 }}>
            {asset.creatorName}
          </Typography>
        </Link>

        {/* Buy Now button */}
        <Button
          fullWidth
          onClick={() => router.push(`/user-dashboard/marketplace/${asset.id}`)}
          sx={{
            background: 'linear-gradient(270deg, #0EA5E9 0%, #1E40AF 100%)',
            color: '#fff',
            borderRadius: '50px',
            fontWeight: 600,
            fontSize: { xs: 13, sm: 14 },
            textTransform: 'none',
            py: { xs: 0.75, sm: 1 },
            mt: 0.5,
            boxShadow: 'none',
            '&:hover': {
              background: 'linear-gradient(270deg, #0284C7 0%, #1E3A8A 100%)',
              boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
            },
          }}
        >
          Buy Now
        </Button>
      </Box>
    </Box>
  );
}

// ── Filter Popover ────────────────────────────────────────────────────────────

function FilterPopover({ anchorEl, onClose, currentFilters, onApply }: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  currentFilters: FilterState;
  onApply: (f: FilterState) => void;
}) {
  const [draft, setDraft] = useState<FilterState>(EMPTY_FILTERS);

  // Sync with applied filters when popover opens
  useEffect(() => {
    if (anchorEl) setDraft(currentFilters);
  }, [anchorEl]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
            width: { xs: 'calc(100vw - 48px)', sm: 360 },
            maxWidth: 360,
          },
        },
      }}
    >
      <Box sx={{ p: '20px 22px' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#111' }}>Filters</Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: '#9ca3af', p: 0.5, '&:hover': { color: '#374151' } }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Sale Status */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.6px', textTransform: 'uppercase', mb: 1.25 }}>
            Sale Status
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {SALE_STATUSES.map((s) => (
              <Pill key={s} label={s} active={draft.saleStatus.includes(s)}
                onClick={() => setDraft((p) => ({ ...p, saleStatus: toggle(p.saleStatus, s) }))} />
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#f3f4f6', mb: 2.5 }} />

        {/* Price Range */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.6px', textTransform: 'uppercase', mb: 1.25 }}>
            Price Range
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {PRICE_RANGES.map((r) => (
              <Pill key={r} label={r} active={draft.priceRange.includes(r)}
                onClick={() => setDraft((p) => ({ ...p, priceRange: toggle(p.priceRange, r) }))} />
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#f3f4f6', mb: 2.5 }} />

        {/* Media Type */}
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.6px', textTransform: 'uppercase', mb: 1.25 }}>
            Media Type
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {MEDIA_TYPES.map((m) => (
              <Pill key={m} label={m} active={draft.mediaType.includes(m)}
                onClick={() => setDraft((p) => ({ ...p, mediaType: toggle(p.mediaType, m) }))} />
            ))}
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #f3f4f6' }}>
          <Button
            onClick={() => setDraft(EMPTY_FILTERS)}
            sx={{ color: '#374151', fontWeight: 600, fontSize: 14, textTransform: 'none', p: 0, minWidth: 0, '&:hover': { bgcolor: 'transparent', color: '#111' } }}
          >
            Clear All
          </Button>
          <Button
            onClick={() => { onApply(draft); onClose(); }}
            variant="contained"
            sx={{ bgcolor: '#1E40AF', color: '#fff', fontWeight: 600, fontSize: 14, textTransform: 'none', borderRadius: '8px', px: 3, py: 0.875, boxShadow: 'none', '&:hover': { bgcolor: '#1E3A8A', boxShadow: 'none' } }}
          >
            Show Results
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InvestorMarketplacePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [sortAnchor, setSortAnchor] = useState<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    let result = [...DUMMY_ASSETS];

    if (activeCategory !== 'All') {
      result = result.filter((a) => a.category === activeCategory);
    }

    // Exact match search on submitted search term (case-insensitive)
    if (submittedSearch.trim()) {
      const searchTerm = submittedSearch.trim().toLowerCase();
      result = result.filter((a) => a.title.toLowerCase() === searchTerm);
    }

    if (filters.saleStatus.length > 0) {
      result = result.filter((a) => filters.saleStatus.includes(a.saleStatus));
    }

    if (filters.priceRange.length > 0) {
      result = result.filter((a) => filters.priceRange.some((r) => inPriceRange(a.priceUsdt, r)));
    }

    if (filters.mediaType.length > 0) {
      result = result.filter((a) => filters.mediaType.includes(a.mediaType));
    }

    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return result;
  }, [activeCategory, submittedSearch, filters, sortOrder]);

  const activeFilterCount = filters.saleStatus.length + filters.priceRange.length + filters.mediaType.length;

  function clearAll() {
    setFilters(EMPTY_FILTERS);
    setSearchQuery('');
    setSubmittedSearch('');
    setActiveCategory('All');
    setSortOrder('recent');
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      setSubmittedSearch(searchQuery);
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>

      {/* ── Top controls ─────────────────────────────────────────────────── */}
      <Box sx={{ mb: 3 }}>

        {/* Category chips */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {CATEGORY_TABS.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setActiveCategory(cat)}
              sx={{
                fontWeight: 600,
                fontSize: 13,
                height: 32,
                cursor: 'pointer',
                '& .MuiChip-label': { px: 1.5 },
                ...(activeCategory === cat
                  ? {
                      bgcolor: cat === 'All' ? '#ef4444' : '#111',
                      color: '#fff',
                      '&:hover': { bgcolor: cat === 'All' ? '#dc2626' : '#374151' },
                    }
                  : {
                      bgcolor: '#fff',
                      color: '#374151',
                      border: '1px solid #e5e7eb',
                      '&:hover': { bgcolor: '#f9fafb' },
                    }),
              }}
            />
          ))}
        </Box>

        {/* Filter icon (left) + Search & Sort (right) */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: { xs: 1, sm: 1.5 } }}>

          {/* Filter icon button — far left */}
          <IconButton
            onClick={(e) => setFilterAnchor(e.currentTarget)}
            sx={{
              width: 40, height: 40, border: '1px solid #e5e7eb',
              borderRadius: '15px', bgcolor: '#fff', position: 'relative', flexShrink: 0,
              '&:hover': { bgcolor: '#f9fafb', borderColor: '#d1d5db' },
            }}
          >
            <SlidersHorizontal size={18} weight="bold" color="#374151" />
            {activeFilterCount > 0 && (
              <Box
                sx={{
                  position: 'absolute', top: -5, right: -5,
                  width: 16, height: 16, bgcolor: '#ef4444',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: 9, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {activeFilterCount}
                </Typography>
              </Box>
            )}
          </IconButton>

          {/* Search + Sort — far right */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            {/* Search */}
            <TextField
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              sx={{
                width: { xs: 160, sm: 240, md: 300 },
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#fff', borderRadius: '15px', fontSize: 14,
                  '& fieldset': { borderColor: '#e5e7eb' },
                  '&:hover fieldset': { borderColor: '#d1d5db' },
                  '&.Mui-focused fieldset': { borderColor: '#9ca3af', borderWidth: '1px' },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Sort / Recent activities button */}
            <Button
              onClick={(e) => setSortAnchor(e.currentTarget)}
              endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: '#374151', bgcolor: '#fff',
                border: '1px solid #e5e7eb', borderRadius: '15px',
                px: { xs: 1.5, sm: 2 }, height: 40,
                fontSize: 13, fontWeight: 500, textTransform: 'none',
                whiteSpace: 'nowrap', flexShrink: 0,
                '&:hover': { bgcolor: '#f9fafb', borderColor: '#d1d5db' },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {SORT_LABELS[sortOrder]}
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                Sort
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── Asset grid ───────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: { xs: 8, sm: 12 } }}>
          <Typography sx={{ fontSize: 15, color: '#9ca3af', mb: 1.5 }}>
            No assets match your filters
          </Typography>
          <Button
            onClick={clearAll}
            sx={{ color: '#1E40AF', textTransform: 'none', fontWeight: 600, fontSize: 14 }}
          >
            Clear all filters
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: { xs: 1.5, sm: 2, md: 2.5 },
          }}
        >
          {filtered.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </Box>
      )}

      {/* ── Filter Popover ────────────────────────────────────────────────── */}
      <FilterPopover
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        currentFilters={filters}
        onApply={setFilters}
      />

      {/* ── Sort menu ─────────────────────────────────────────────────────── */}
      <Menu
        anchorEl={sortAnchor}
        open={Boolean(sortAnchor)}
        onClose={() => setSortAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5, borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              minWidth: 170,
            },
          },
        }}
      >
        {(['recent', 'newest', 'oldest'] as SortOrder[]).map((s) => (
          <MenuItem
            key={s}
            onClick={() => { setSortOrder(s); setSortAnchor(null); }}
            sx={{
              fontSize: 14,
              fontWeight: sortOrder === s ? 600 : 400,
              color: '#374151',
              py: 1.25,
              px: 2,
            }}
          >
            {SORT_LABELS[s]}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}