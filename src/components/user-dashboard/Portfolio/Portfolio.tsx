'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAppSelector } from '@/store/hooks/useAppDispatch';
import { auctionApi } from '@/api/auctionApi';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
interface WonAuction {
  id: string;
  winningBid: number;
  asset: {
    id: string;
    title: string;
    assetType: string;
    mediaFiles: string | string[] | null;
    valuation: number;
  } | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
const ASSET_TYPE_LABEL: Record<string, string> = {
  COLLECTIBLE:  'Collectibles',
  REAL_ESTATE:  'Real Estate',
  FINE_ART:     'Fine Art',
  LUXURY_ASSET: 'Luxury Asset',
  LUXURY_WATCH: 'Luxury Watch',
  OTHER:        'Other',
};

function typeLabel(assetType: string): string {
  return ASSET_TYPE_LABEL[assetType] ?? assetType;
}

function parseFirstImage(raw: unknown): string {
  if (!raw) return '';
  if (Array.isArray(raw)) return (raw as string[])[0] ?? '';
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed[0] ?? '') : raw;
    } catch { return raw; }
  }
  return '';
}

/* ------------------------------------------------------------------ */
/*  ETH icon (inline SVG)                                               */
/* ------------------------------------------------------------------ */
function EthIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 417" preserveAspectRatio="xMidYMid" style={{ flexShrink: 0 }}>
      <path fill="#fff" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
      <path fill="#ccc" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
      <path fill="#fff" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.601L256 236.587z" />
      <path fill="#ccc" d="M127.962 416.905V312.187L0 236.585z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Asset card                                                          */
/* ------------------------------------------------------------------ */
function AssetCard({ title, image, bid }: { title: string; image: string; bid: number }) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 245.98,
        cursor: 'pointer',
        bgcolor: 'transparent',
        boxShadow: 'none',
        '&:hover .card-image': { transform: 'scale(1.03)' },
      }}
    >
      <Box
        className="card-image"
        sx={{
          position: 'relative',
          width: '100%',
          height: 350,
          borderRadius: '16px',
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
          fontSize: 0,
          lineHeight: 0,
          transition: 'transform 0.3s ease',
        }}
      >
        {image ? (
          <img
            src={image}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', bgcolor: '#e5e7eb' }} />
        )}

        <Box
          sx={{
            position: 'absolute',
            bottom: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            height: 27,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            px: '10px',
            bgcolor: 'rgba(30,30,30,0.72)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderRadius: '8px',
            whiteSpace: 'nowrap',
            zIndex: 2,
          }}
        >
          <EthIcon size={10} />
          <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.3, lineHeight: 1 }}>
            {bid.toFixed(2)} USDT
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ mt: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, color: '#111', textAlign: 'center' }}>
        {title}
      </Typography>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Category tab                                                        */
/* ------------------------------------------------------------------ */
function CategoryTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        border: 'none', outline: 'none', cursor: 'pointer',
        px: 2.2, py: 0.7, borderRadius: 5,
        fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 600,
        transition: 'all 0.2s ease',
        bgcolor: active ? '#ef4444' : 'transparent',
        color: active ? '#fff' : '#555',
        '&:hover': { bgcolor: active ? '#ef4444' : '#f5f5f5', color: active ? '#fff' : '#111' },
      }}
    >
      {label}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Portfolio component                                            */
/* ------------------------------------------------------------------ */
export default function Portfolio() {
  const user = useAppSelector((state) => state.auth.user);
  const fullName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'User';
  const joinedLabel = user?.createdAt
    ? `Joined ${new Date(user.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}`
    : 'Joined';

  const [wonAuctions, setWonAuctions] = useState<WonAuction[]>([]);
  const [loadingAuctions, setLoadingAuctions] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    auctionApi.getWonAuctions()
      .then(({ data }) => {
        const raw: any[] = Array.isArray(data?.data) ? data.data : [];
        setWonAuctions(raw.map((a) => ({
          id:         a.id,
          winningBid: Number(a.winningBid ?? 0),
          asset:      a.asset ?? null,
        })));
      })
      .catch(() => {})
      .finally(() => setLoadingAuctions(false));
  }, []);

  /* ── Derived stats ── */
  const total     = wonAuctions.length;
  const usdValue  = wonAuctions.reduce((sum, a) => sum + a.winningBid, 0);

  // Count per type label
  const typeCounts: Record<string, number> = {};
  for (const a of wonAuctions) {
    const label = typeLabel(a.asset?.assetType ?? 'OTHER');
    typeCounts[label] = (typeCounts[label] ?? 0) + 1;
  }

  const typeStats = Object.entries(typeCounts).map(([label, count]) => ({
    label,
    count,
    percent: total > 0 ? Math.round((count / total) * 100) : 0,
  }));

  /* ── Dynamic category tabs ── */
  const categories = ['All', ...Object.keys(typeCounts)];

  /* ── Filtered cards ── */
  const filtered = activeCategory === 'All'
    ? wonAuctions
    : wonAuctions.filter((a) => typeLabel(a.asset?.assetType ?? 'OTHER') === activeCategory);

  return (
    <Box sx={{ maxWidth: 1104, mx: 'auto', fontFamily: 'Inter, sans-serif', position: 'relative' }}>

      {/* Decorative corner image */}
      <Box
        component="img"
        src="/Portifolio/Rectangle.png"
        alt=""
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: { xs: '-100px', sm: '-150px', md: '-100.83px' },
          left: { xs: '-50px', sm: '20px', md: '-180.29px' },
          width: { xs: '420px', sm: '580px', md: '504.43px' },
          height: 'auto',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ───────── Profile header ───────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 0 },
          mb: 0,
          pb: '24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left — avatar stacked above name */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Box
            component="img"
            src="/Portifolio/Avatar.svg"
            alt={fullName}
            sx={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }}
          />
          <Box>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 20, lineHeight: 1, color: '#0A0A0A' }}>
              {fullName}
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14, lineHeight: 1, color: '#555', mt: '6px' }}>
              {joinedLabel}
            </Typography>
          </Box>
        </Box>

        {/* Right — stats */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
          {/* USD Value */}
          <Box sx={{ textAlign: 'center', minWidth: 88 }}>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: 1, color: '#888', mb: '6px' }}>
              USD Value
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 500, lineHeight: 1, color: '#111' }}>
              ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Box>

          {/* Dynamic per-type stats */}
          {typeStats.map((stat) => (
            <Box
              key={stat.label}
              sx={{ textAlign: 'center', minWidth: 100, borderLeft: '1px solid #e0e0e0', pl: 2.5, ml: 2.5 }}
            >
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, lineHeight: 1, color: '#888', mb: '6px' }}>
                {stat.label}
              </Typography>
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 500, lineHeight: 1, color: '#111' }}>
                {stat.count}
                <Typography component="span" sx={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 400, color: '#888', ml: 0.5 }}>
                  | {stat.percent}%
                </Typography>
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ borderBottom: '0.4px solid #e0e0e0', mb: '20px' }} />

      {/* ───────── Category tabs ───────── */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: '28px', justifyContent: { xs: 'center', lg: 'flex-start' } }}>
        {categories.map((cat) => (
          <CategoryTab key={cat} label={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
        ))}
      </Box>

      {/* ───────── Asset grid ───────── */}
      {loadingAuctions ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} sx={{ color: '#ef4444' }} />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 3, border: '1px dashed #ddd' }}>
          <Typography sx={{ color: '#aaa', fontSize: 15 }}>
            {total === 0 ? 'No won auctions yet.' : 'No assets in this category.'}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: '16px',
            justifyItems: 'center',
          }}
        >
          {filtered.map((a) => (
            <AssetCard
              key={a.id}
              title={a.asset?.title ?? '—'}
              image={parseFirstImage(a.asset?.mediaFiles)}
              bid={a.winningBid}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
