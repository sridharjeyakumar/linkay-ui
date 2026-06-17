'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Alert } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import CloseIcon from '@mui/icons-material/Close';
import { Diamond, LockKey } from '@phosphor-icons/react';
import { useAccount, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt, readContract } from '@wagmi/core';
import { parseUnits, parseGwei, maxUint256 } from 'viem';
import { wagmiConfig } from '@/lib/wagmiConfig';
import { auctionApi } from '@/api/auctionApi';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface ProductPageItem {
  id: string;
  title: string;
  category: string;
  custodyService: string;
  /** index 0 = hero, index 1-3 = thumbnails */
  images: [string, string, string, string];
  totalValuation: number;
  pricePerFraction: number;
  compliance: string;
  lockupMonths: number;
  totalFractions: number;
  fractionsRemaining: number;
  description: string;
  ipfsUrl?: string;
  ipfsMetadataUrl?: string;
  auctionId?: string;
  onChainAuctionId?: string;
  auctionEndTime?: string;
  auctionTimezone?: string;
  currentBid?: number;
  activities?: ActivityItem[];
  // Additional information fields
  certificationRef?: string;
  conditionReport?: string;
  historicalContext?: string;
  jurisdiction?: string;
  ownershipEntity?: string;
  royaltyPercent?: number;
  royaltyWallet?: string;
  retainedPercent?: number;
  tokenizedPercent?: number;
  nftContractAddress?: string;
  erc3643ContractAddress?: string;
  nftTokenId?: number;
  transactionHash?: string;
  publishedAt?: string;
}

interface ActivityItem {
  type: 'bid' | 'reserve' | 'mint';
  user: string;
  date: string;
  amount?: number;
  transactionHash?: string;
}

interface ProductPageProps {
  item: ProductPageItem;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ── API CONFIG ── (developers edit this section only)
   ═══════════════════════════════════════════════════════════════════════════

   1. Set API_BASE_URL to your endpoint base
   2. Update getProductId() to match your routing (URL param, slug, etc.)
   3. Update transformApiResponse() to map your backend field names

   ─────────────────────────────────────────────────────────────────────── */

const API_BASE_URL = 'https://api.yourdomain.com/v1';

function getProductId(): string {
  if (typeof window === 'undefined') return 'demo';
  return new URLSearchParams(window.location.search).get('id') || 'demo';
}

async function fetchProduct(id: string): Promise<ProductPageItem> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${YOUR_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return transformApiResponse(json);
}

function transformApiResponse(d: any): ProductPageItem {
  return {
    id:                 d.id                ?? d._id                  ?? '',
    title:              d.title             ?? d.name                 ?? '',
    category:           d.category          ?? d.type                 ?? '',
    custodyService:     d.custodyService     ?? d.custody_service      ?? '',
    images: [
      d.images?.[0]    ?? d.mainImage       ?? DEMO.images[0],
      d.images?.[1]    ?? d.thumbnail1      ?? DEMO.images[1],
      d.images?.[2]    ?? d.thumbnail2      ?? DEMO.images[2],
      d.images?.[3]    ?? d.thumbnail3      ?? DEMO.images[3],
    ],
    totalValuation:     d.totalValuation    ?? d.total_valuation      ?? 0,
    pricePerFraction:   d.pricePerFraction  ?? d.price_per_fraction   ?? 0,
    compliance:         d.compliance        ?? '',
    lockupMonths:       d.lockupMonths      ?? d.lockup_months        ?? 0,
    totalFractions:     d.totalFractions    ?? d.total_fractions      ?? 0,
    fractionsRemaining: d.fractionsRemaining ?? d.fractions_remaining ?? 0,
    description:        d.description       ?? '',
    ipfsUrl:            d.ipfsUrl           ?? d.ipfs_url             ?? '',
    ipfsMetadataUrl:    d.ipfsMetadataUrl   ?? d.ipfs_metadata_url    ?? '',
  };
}

/* ─── Demo fallback (remove once API is wired up) ───────────────────────── */
const DEMO: ProductPageItem = {
  id: 'demo-001',
  title: 'Patekk Phillipe Nautilus 5711/1A-010',
  category: 'Luxury Watch',
  custodyService: 'Linkay Custody Services',
  images: [
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=900&q=80',
    'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&q=80',
    'https://images.unsplash.com/photo-1549482199-bc1ca6f58502?w=400&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80',
  ],
  totalValuation: 150000,
  pricePerFraction: 150,
  compliance: 'ERC-3643',
  lockupMonths: 6,
  totalFractions: 1000,
  fractionsRemaining: 650,
  description:
    'A timeless icon of horology, the Nautilus 5711/1A-010 represents the pinnacle of Swiss craftsmanship. Its distinctive octagonal bezel, integrated bracelet, and exquisite movement make it one of the most sought-after luxury watches in the world.',
  ipfsUrl: 'https://ipfs.io/ipfs/QmDemo',
  ipfsMetadataUrl: 'https://ipfs.io/ipfs/QmDemo/metadata.json',
  auctionEndTime: new Date(Date.now() + 12 * 3600000 + 43 * 60000 + 42000).toISOString(),
  currentBid: 0.33,
  activities: [
    { type: 'bid',     user: 'oneoff316',       date: 'May 5, 2026 at 6:13pm',  amount: 0.33 },
    { type: 'bid',     user: 'auraMint88',       date: 'May 5, 2026 at 4:37pm',  amount: 0.31 },
    { type: 'bid',     user: 'crypticMuse19',    date: 'May 5, 2026 at 2:10pm',  amount: 0.26 },
    { type: 'reserve', user: 'Zhannet Podobed',  date: 'May 1, 2023 at 4:49pm',  amount: 0.18 },
    { type: 'mint',    user: 'Zhannet Podobed',  date: 'May 1, 2026 at 4:46pm' },
  ],
};

/* ─── Static activity data ───────────────────────────────────────────────── */
const STATIC_ACTIVITIES: ActivityItem[] = [
  { type: 'bid',     user: 'oneoff316',      date: 'May 5, 2026 at 6:13pm',  amount: 0.33 },
  { type: 'bid',     user: 'auraMint88',     date: 'May 5, 2026 at 4:37pm',  amount: 0.31 },
  { type: 'bid',     user: 'crypticMuse19',  date: 'May 5, 2026 at 2:10pm',  amount: 0.26 },
  { type: 'reserve', user: 'Zhannet Podobed',date: 'May 1, 2023 at 4:49pm',  amount: 0.18 },
  { type: 'mint',    user: 'Zhannet Podobed',date: 'May 1, 2026 at 4:46pm' },
];

/* ─── Contract config ────────────────────────────────────────────────────── */
const AUCTION_HOUSE_ADDRESS = (process.env.NEXT_PUBLIC_AUCTION_HOUSE_ADDRESS ?? '') as `0x${string}`;
const USDC_ADDRESS          = (process.env.NEXT_PUBLIC_USDC_ADDRESS ?? '') as `0x${string}`;

const USDC_APPROVE_ABI = [{
  name: 'approve',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [
    { name: 'spender', type: 'address' },
    { name: 'amount',  type: 'uint256' },
  ],
  outputs: [{ name: '', type: 'bool' }],
}] as const;

const USDC_ALLOWANCE_ABI = [{
  name: 'allowance',
  type: 'function',
  stateMutability: 'view',
  inputs: [
    { name: 'owner',   type: 'address' },
    { name: 'spender', type: 'address' },
  ],
  outputs: [{ name: '', type: 'uint256' }],
}] as const;

const AUCTION_PLACE_BID_ABI = [{
  name: 'placeBid',
  type: 'function',
  stateMutability: 'payable',
  inputs: [
    { name: 'auctionId', type: 'uint256' },
    { name: 'bidAmount', type: 'uint256' },
  ],
  outputs: [],
}] as const;

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const fmt = (n: number) =>
  '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function SkeletonBlock({ height, borderRadius = 8, mb = 0 }: { height: number; borderRadius?: number; mb?: number }) {
  return (
    <Box sx={{
      width: '100%', height, borderRadius, mb: `${mb}px`,
      background: 'linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'lb-shimmer 1.4s ease-in-out infinite',
      '@keyframes lb-shimmer': {
        '0%':   { backgroundPosition: '200% 0' },
        '100%': { backgroundPosition: '-200% 0' },
      },
    }} />
  );
}

/* ─── Accordion row ──────────────────────────────────────────────────────── */
function AccordionRow({ label, defaultOpen = false, children }: { label: string; defaultOpen?: boolean; children?: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Divider />
      <Box
        onClick={() => setOpen(v => !v)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: '18px',
          mx: '-8px',
          px: '8px',
          borderRadius: '8px',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'background 0.15s',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.025)' },
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111', letterSpacing: '-0.1px' }}>
          {label}
        </Typography>
        <Box
          sx={{
            width: 28, height: 28, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
            border: '1.5px solid',
            borderColor: open ? '#111' : '#d1d5db',
            bgcolor: open ? '#111' : 'transparent',
            transition: 'background 0.22s, border-color 0.22s',
          }}
        >
          <svg
            width="10" height="6"
            viewBox="0 0 10 6"
            fill="none"
            style={{
              display: 'block',
              transition: 'transform 0.22s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <path d="M1 1L5 5L9 1" stroke={open ? '#fff' : '#555'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Box>
      </Box>
      {open && (
        <Box sx={{ pb: '24px' }}>
          {children ?? (
            <Typography sx={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.75 }}>
              No {label.toLowerCase()} available.
            </Typography>
          )}
        </Box>
      )}
    </>
  );
}

/* ─── IPFS Row ───────────────────────────────────────────────────────────── */
function IpfsRow({ label, href }: { label: string; href?: string }) {
  return (
    <Box
      component="a"
      href={href ?? '#'}
      target="_blank"
      rel="noreferrer"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        /* ✅ Full-width always — never fixed 343px on mobile */
        width: '100%',
        height: 58,
        px: '20px',
        bgcolor: 'rgba(250,250,250,1)',
        borderRadius: '16px',
        textDecoration: 'none',
        boxSizing: 'border-box',
        border: '1px solid #f0f0f0',
        transition: 'background 0.15s',
        '&:hover': { bgcolor: 'rgba(238,238,238,1)' },
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'rgba(10,10,10,1)' }}>
        {label}
      </Typography>
      <OpenInNewIcon sx={{ fontSize: 18, color: 'rgba(115,115,115,1)', flexShrink: 0 }} />
    </Box>
  );
}

/* ─── Additional Information ─────────────────────────────────────────────── */
function truncateAddress(addr: string) {
  return addr.length > 18 ? `${addr.slice(0, 10)}…${addr.slice(-8)}` : addr;
}

function InfoRow({ label, value, href, mono = false }: { label: string; value: string; href?: string; mono?: boolean }) {
  const valueStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: '#111',
    textAlign: 'right' as const,
    wordBreak: 'break-word' as const,
    fontFamily: mono ? '"SF Mono","Fira Code","Roboto Mono",monospace' : 'inherit',
    letterSpacing: mono ? '0.02em' : 'normal',
  };
  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: 3, py: '11px',
      borderBottom: '1px solid #f3f3f3',
      '&:last-child': { borderBottom: 'none' },
    }}>
      <Typography sx={{
        fontSize: 11, fontWeight: 600, color: '#9ca3af',
        textTransform: 'uppercase', letterSpacing: '0.07em',
        flexShrink: 0, minWidth: 120,
      }}>
        {label}
      </Typography>
      {href ? (
        <Box
          component="a" href={href} target="_blank" rel="noreferrer"
          sx={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', '&:hover span': { textDecoration: 'underline' } }}
        >
          <Typography component="span" sx={{ ...valueStyle, color: '#2563eb' }}>{value}</Typography>
          <OpenInNewIcon sx={{ fontSize: 13, color: '#2563eb', flexShrink: 0 }} />
        </Box>
      ) : (
        <Typography sx={valueStyle}>{value}</Typography>
      )}
    </Box>
  );
}

type InfoGroupDef = { title: string; rows: { label: string; value: string; href?: string; mono?: boolean }[] };

function AdditionalInfo({ item }: { item: ProductPageItem }) {
  const asset: InfoGroupDef['rows'] = [];
  const token: InfoGroupDef['rows'] = [];
  const chain: InfoGroupDef['rows'] = [];
  const meta:  InfoGroupDef['rows'] = [];

  if (item.jurisdiction)        asset.push({ label: 'Jurisdiction',       value: item.jurisdiction });
  if (item.ownershipEntity)     asset.push({ label: 'Ownership Entity',   value: item.ownershipEntity });
  if (item.certificationRef)    asset.push({ label: 'Certification Ref',  value: item.certificationRef });
  if (item.conditionReport)     asset.push({ label: 'Condition Report',   value: item.conditionReport });
  if (item.historicalContext)   asset.push({ label: 'Historical Context', value: item.historicalContext });

  if (item.tokenizedPercent != null) token.push({ label: 'Tokenized',      value: `${item.tokenizedPercent}%` });
  if (item.retainedPercent  != null) token.push({ label: 'Retained',       value: `${item.retainedPercent}%` });
  if (item.royaltyPercent   != null) token.push({ label: 'Royalty',        value: `${item.royaltyPercent}%` });
  if (item.royaltyWallet)            token.push({ label: 'Royalty Wallet', value: truncateAddress(item.royaltyWallet), mono: true });

  if (item.nftTokenId != null)       chain.push({ label: 'NFT Token ID',      value: String(item.nftTokenId), mono: true });
  if (item.nftContractAddress)       chain.push({ label: 'NFT Contract',      value: truncateAddress(item.nftContractAddress), mono: true });
  if (item.erc3643ContractAddress)   chain.push({ label: 'ERC-3643 Contract', value: truncateAddress(item.erc3643ContractAddress), mono: true });
  if (item.transactionHash)          chain.push({ label: 'Tx Hash',           value: truncateAddress(item.transactionHash), mono: true });
  if (item.ipfsMetadataUrl)          chain.push({ label: 'IPFS Metadata',     value: 'View on IPFS', href: item.ipfsMetadataUrl });

  if (item.publishedAt) meta.push({
    label: 'Published',
    value: new Date(item.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  });

  const groups: InfoGroupDef[] = [
    { title: 'Asset Details',    rows: asset },
    { title: 'Token Economics',  rows: token },
    { title: 'Blockchain',       rows: chain },
    { title: 'Publication',      rows: meta  },
  ].filter(g => g.rows.length > 0);

  if (groups.length === 0) return (
    <Box sx={{ py: '14px', px: '16px', bgcolor: '#fafafa', borderRadius: '10px', border: '1px solid #f0f0f0' }}>
      <Typography sx={{ fontSize: 14, color: '#9ca3af' }}>No additional information available.</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {groups.map(group => (
        <Box key={group.title} sx={{ border: '1px solid #ebebeb', borderRadius: '12px', overflow: 'hidden' }}>
          <Box sx={{ px: '16px', py: '9px', bgcolor: '#fafafa', borderBottom: '1px solid #ebebeb' }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              {group.title}
            </Typography>
          </Box>
          <Box sx={{ px: '16px' }}>
            {group.rows.map(r => <InfoRow key={r.label} {...r} />)}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/* ─── ProductPage (with internal data fetching) ──────────────────────────── */
export default function ProductPage({ item: itemProp }: Partial<ProductPageProps>) {
  const theme = useTheme();

  /*
   * useMediaQuery with MUI theme breakpoints.
   * These are SERVER-SAFE (SSR-compatible) and work with MUI's ThemeProvider.
   *
   * Breakpoints used:
   *   xs  : 0px+     (mobile portrait)
   *   sm  : 600px+   (mobile landscape / small tablet)
   *   md  : 900px+   (tablet landscape)
   *   lg  : 1200px+  (desktop)
   */
  const isMobile  = useMediaQuery(theme.breakpoints.down('sm'));   // < 600px
  const isTablet  = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600–900px
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));     // ≥ 900px

  /* ── Wagmi ── */
  const { address: walletAddress } = useAccount();
  const { writeContractAsync }     = useWriteContract();

  /* ── State ── */
  const [item, setItem]           = useState<ProductPageItem | null>(itemProp ?? null);
  const [loading, setLoading]     = useState(!itemProp);
  const [error, setError]         = useState<string | null>(null);
  const [activeImg, setActiveImg]       = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [timeLeft, setTimeLeft]         = useState({ h: 0, m: 0, s: 0 });
  const [activityOpen, setActivityOpen] = useState(true);
  const [realActivities, setRealActivities] = useState<ActivityItem[] | null>(null);

  const loadBids = async (auctionId: string) => {
    try {
      const { data } = await auctionApi.listBids(auctionId);
      const bids: any[] = Array.isArray(data?.data) ? data.data : [];
      setRealActivities(bids.map((b) => ({
        type:             'bid' as const,
        user:             b.bidderAddress
          ? `${b.bidderAddress.slice(0, 6)}…${b.bidderAddress.slice(-4)}`
          : '—',
        date:             new Date(b.createdAt).toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: 'numeric', minute: '2-digit', hour12: true,
        }),
        amount:           Number(b.amount),
        transactionHash:  b.txHash ?? undefined,
      })));
    } catch {
      // silently keep whatever was there
    }
  };

  /* ── Bid modal ── */
  type BidStep = 'input' | 'approving' | 'bidding' | 'recording' | 'done';
  const [bidOpen, setBidOpen]   = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidStep, setBidStep]   = useState<BidStep>('input');
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidTxHash, setBidTxHash] = useState('');

  const resetBidModal = () => {
    setBidAmount('');
    setBidStep('input');
    setBidError(null);
    setBidTxHash('');
  };

  const handleBid = async () => {
    if (!item?.auctionId || !item?.onChainAuctionId) {
      setBidError('Auction ID not available — please refresh the page');
      return;
    }
    if (!walletAddress) {
      setBidError('Connect your wallet before placing a bid');
      return;
    }
    const parsed = parseFloat(bidAmount);
    if (!parsed || parsed <= 0) {
      setBidError('Enter a valid bid amount');
      return;
    }

    setBidError(null);
    const amountWei = parseUnits(bidAmount, 6);
    // Polygon Amoy: min 30 Gwei, explicit gas limit avoids fallback to block gas limit
    const approveGas = { maxFeePerGas: parseGwei('35'), maxPriorityFeePerGas: parseGwei('30'), gas: BigInt(80_000) };
    const bidGas     = { maxFeePerGas: parseGwei('35'), maxPriorityFeePerGas: parseGwei('30'), gas: BigInt(250_000) };

    try {
      // Check existing allowance — skip approve if already sufficient
      const allowance = await readContract(wagmiConfig, {
        address: USDC_ADDRESS,
        abi: USDC_ALLOWANCE_ABI,
        functionName: 'allowance',
        args: [walletAddress as `0x${string}`, AUCTION_HOUSE_ADDRESS],
      });

      if (allowance < amountWei) {
        setBidStep('approving');
        const approveTxHash = await writeContractAsync({
          address: USDC_ADDRESS,
          abi: USDC_APPROVE_ABI,
          functionName: 'approve',
          args: [AUCTION_HOUSE_ADDRESS, amountWei],
          ...approveGas,
        });
        // Wait for approve to confirm on-chain before placing bid
        await waitForTransactionReceipt(wagmiConfig, { hash: approveTxHash });
      }

      setBidStep('bidding');
      const txHash = await writeContractAsync({
        address: AUCTION_HOUSE_ADDRESS,
        abi: AUCTION_PLACE_BID_ABI,
        functionName: 'placeBid',
        args: [BigInt(item.onChainAuctionId!), amountWei],
        ...bidGas,
      });
      setBidTxHash(txHash);

      // Wait for confirmation before recording — prevents DB entries for failed txs
      await waitForTransactionReceipt(wagmiConfig, { hash: txHash });

      setBidStep('recording');
      await auctionApi.placeBid(item.auctionId!, {
        bidderAddress: walletAddress,
        amount: bidAmount,
        txHash,
      });

      setBidStep('done');
      loadBids(item.auctionId!);
    } catch (e: any) {
      const msg: string = e?.shortMessage ?? e?.message ?? 'Transaction failed';
      setBidError(msg.length > 120 ? msg.slice(0, 120) + '…' : msg);
      setBidStep('input');
    }
  };

  /* ── Fetch (skipped if item was passed as prop) ── */
  useEffect(() => {
    if (itemProp) return; // prop wins — no fetch needed
    let dead = false;
    (async () => {
      try {
        setLoading(true);
        const id = getProductId();
        if (id === 'demo' || API_BASE_URL.includes('yourdomain')) {
          await new Promise(r => setTimeout(r, 500));
          if (!dead) setItem(DEMO);
        } else {
          const data = await fetchProduct(id);
          if (!dead) setItem(data);
        }
      } catch (e: any) {
        if (!dead) setError(e.message);
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => { dead = true; };
  }, [itemProp]);

  /* ── Load real bid activity ── */
  useEffect(() => {
    if (item?.auctionId) loadBids(item.auctionId);
  }, [item?.auctionId]);

  /* ── Auction countdown ── */
  useEffect(() => {
    if (!item?.auctionEndTime) return;
    const tick = () => {
      const diff = Math.max(0, new Date(item.auctionEndTime!).getTime() - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [item?.auctionEndTime]);

  /* ── Error ── */
  if (error) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 2, p: 3 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Failed to load product</Typography>
      <Typography sx={{ fontSize: 13, color: '#888' }}>{error}</Typography>
      <Button onClick={() => window.location.reload()}
        sx={{ mt: 1, borderRadius: 50, bgcolor: '#1e40af', color: '#fff', px: 4, textTransform: 'none', '&:hover': { bgcolor: '#183496' } }}>
        Retry
      </Button>
    </Box>
  );

  /* ── Loading skeleton ── */
  if (loading || !item) return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1140, mx: 'auto' }}>
      <SkeletonBlock height={isMobile ? 200 : 340} borderRadius={11} mb={10} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, mb: 3 }}>
        <SkeletonBlock height={isMobile ? 66 : 110} borderRadius={11} />
        <SkeletonBlock height={isMobile ? 66 : 110} borderRadius={11} />
        <SkeletonBlock height={isMobile ? 66 : 110} borderRadius={11} />
      </Box>
      <SkeletonBlock height={28} mb={12} />
      <SkeletonBlock height={16} mb={8} />
      <SkeletonBlock height={16} />
    </Box>
  );

  /* ── Derived ── */
  // Deduplicate images so the same URL never appears twice in the gallery
  const uniqueImages = [...new Set(item.images.filter(Boolean))];
  const safeActive   = Math.min(activeImg, Math.max(uniqueImages.length - 1, 0));
  const thumbGap = isMobile ? '7px' : '11px';

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        minHeight: '100vh',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        '& *': { fontFamily: 'inherit' },
      }}
    >
      <Box
        sx={{
          maxWidth: 1140,
          mx: 'auto',
          px: { xs: '16px', sm: '24px', md: '40px' },
          pt: { xs: '20px', md: '32px' },
          pb: '60px',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? 'minmax(0,1fr) 360px' : '1fr',
            gap: isDesktop ? '56px' : '28px',
            alignItems: 'start',
            width: '100%',
          }}
        >
          <Box sx={{ minWidth: 0, width: '100%' }}>

            {/* ── GALLERY ── */}
            <Box sx={{ mb: '28px', width: '100%' }}>

              {/* Main image — fixed 4:3 aspect ratio, no layout shift between images */}
              <Box
                sx={{
                  position: 'relative',
                  mb: thumbGap,
                  width: '100%',
                  paddingTop: '75%',
                  borderRadius: '11px',
                  overflow: 'hidden',
                  bgcolor: '#f5f5f5',
                }}
              >
                <Box
                  component="img"
                  src={uniqueImages[safeActive] ?? ''}
                  alt={item.title}
                  sx={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Full Size button */}
                <Box
                  onClick={() => setLightboxOpen(true)}
                  title="Full Size"
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    bgcolor: 'rgba(0,0,0,0.45)',
                    borderRadius: '7px',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                    transition: 'background 0.15s',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <OpenInFullIcon sx={{ fontSize: 17, color: '#fff' }} />
                </Box>
              </Box>

              {/* Thumbnail grid — 4 equal columns, same 4:3 ratio as main image */}
              {uniqueImages.length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: thumbGap }}>
                  {uniqueImages.map((src, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      sx={{
                        position: 'relative',
                        paddingTop: '75%',
                        borderRadius: '11px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        bgcolor: '#f5f5f5',
                        outline: safeActive === idx
                          ? '2.5px solid #111'
                          : '2.5px solid transparent',
                        outlineOffset: '2px',
                        transition: 'outline-color 0.15s',
                        '&:hover': { outlineColor: '#bbb' },
                      }}
                    >
                      <Box
                        component="img"
                        src={src}
                        alt={`View ${idx + 1}`}
                        sx={{
                          position: 'absolute',
                          top: 0, left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            {/* ── END GALLERY ── */}

            {/* Accordion sections */}
            <AccordionRow label="Description" defaultOpen>
              <Box sx={{
                bgcolor: '#fafafa',
                border: '1px solid #f0f0f0',
                borderRadius: '12px',
                px: '20px',
                py: '18px',
              }}>
                <Typography sx={{
                  fontSize: 15,
                  color: '#374151',
                  lineHeight: 1.85,
                  letterSpacing: '0.01em',
                }}>
                  {item.description}
                </Typography>
              </Box>
            </AccordionRow>
            <AccordionRow label="Additional Information">
              <AdditionalInfo item={item} />
            </AccordionRow>
            {/* <AccordionRow label="Documents1" /> */}
            {/* <Divider /> */}
          </Box>

          {/* ════════════════ RIGHT COLUMN ════════════════ */}
          <Box sx={{ minWidth: 0, width: '100%' }}>

            {/* Title */}
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 20, sm: 26, md: 32 },
                fontWeight: 800,
                color: '#111',
                lineHeight: 1.18,
                letterSpacing: '-0.4px',
                mb: '18px',
                wordBreak: 'break-word',
              }}
            >
              {item.title}
            </Typography>

            {/* Chips */}
            <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap', mb: '20px' }}>
              <Box sx={{ px: '14px', py: '7px', bgcolor: '#111', borderRadius: '6px' }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>
                  {item.category}
                </Typography>
              </Box>
              <Box sx={{ px: '14px', py: '7px', border: '1.5px solid #d0d0d0', borderRadius: '6px' }}>
                <Typography sx={{ fontSize: 13, color: '#555' }}>
                  {item.custodyService}
                </Typography>
              </Box>
            </Box>

            {/* Ends In + Current Bid */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 32px', mb: '22px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Typography sx={{ fontSize: 13, color: '#888' }}>Ends In</Typography>
                <Typography
                  sx={{
                    fontSize: 15, fontWeight: 700, color: '#ef4444',
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em',
                  }}
                >
                  {String(timeLeft.h).padStart(2, '0')}h&nbsp;
                  {String(timeLeft.m).padStart(2, '0')}m&nbsp;
                  {String(timeLeft.s).padStart(2, '0')}s
                </Typography>
                {item.auctionTimezone && (
                  <Typography sx={{ fontSize: 11, color: '#ef4444', opacity: 0.7, fontWeight: 500 }}>
                    {item.auctionTimezone}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Typography sx={{ fontSize: 13, color: '#888' }}>Current Bid</Typography>
                {/* Ethereum diamond */}
             
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#3b82f6' }}>
                  {(item.currentBid ?? 0).toFixed(2)} USDT
                </Typography>
              </Box>
            </Box>

            {/* Make a bid button */}
            <Button
              onClick={() => { resetBidModal(); setBidOpen(true); }}
              disabled={!item.auctionId || !item.onChainAuctionId}
              startIcon={
                <Box
                  component="img"
                  src="/landing/real estate/Bid.svg"
                  alt=""
                  sx={{ width: 20, height: 20, display: 'block' }}
                />
              }
              sx={{
                width: '100%',
                height: 56,
                background: 'linear-gradient(270deg, #EF4443 0%, #FABD24 100%)',
                color: '#fff',
                borderRadius: '50px',
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                mb: '28px',
                '&:hover': {
                  background: 'linear-gradient(270deg, #d63b3a 0%, #e0a91f 100%)',
                  boxShadow: 'none',
                },
                '&.Mui-disabled': { opacity: 0.45 },
              }}
            >
              Make a bid
            </Button>

            {/* Activity */}
            <Box>
              {/* header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '16px' }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Activity</Typography>
                <Box
                  onClick={() => setActivityOpen(v => !v)}
                  sx={{ cursor: 'pointer', display: 'flex', color: '#888', '&:hover': { color: '#111' } }}
                >
                  {activityOpen
                    ? <CloseFullscreenIcon sx={{ fontSize: 18 }} />
                    : <OpenInFullIcon sx={{ fontSize: 18 }} />
                  }
                </Box>
              </Box>

              {/* ── Timeline ── */}
              {(() => {
                const acts = realActivities ?? item.activities ?? (item.auctionId ? [] : STATIC_ACTIVITIES);

                const getActivityIcon = (type: ActivityItem['type']) => {
                  if (type === 'reserve') return <LockKey size={18} weight="fill" color="rgba(30,64,175,1)" />;
                  if (type === 'mint')    return <Diamond size={18} weight="fill" color="rgba(30,64,175,1)" />;
                  return <PersonIcon sx={{ fontSize: 18, color: 'rgba(30,64,175,1)' }} />;
                };

                const getActivityLabel = (type: ActivityItem['type']) => {
                  if (type === 'bid')     return 'Bid placed by';
                  if (type === 'reserve') return 'Reserve set by';
                  return 'Minted by';
                };

                return (
                  <Box sx={{
                    overflow: 'hidden',
                    maxHeight: activityOpen ? '420px' : '0px',
                    opacity: activityOpen ? 1 : 0,
                    transition: 'max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease',
                  }}>
                  <Box sx={{
                    maxHeight: '420px',
                    overflowY: 'auto',
                    pr: '4px',
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: '#e5e7eb', borderRadius: '4px' },
                    '&::-webkit-scrollbar-thumb:hover': { bgcolor: '#d1d5db' },
                  }}>
                    {acts.length === 0 && (
                      <Typography sx={{ fontSize: 13, color: '#9ca3af', py: 1 }}>
                        No bids yet — be the first!
                      </Typography>
                    )}
                    {acts.map((act, idx) => {
                      const isLast = idx === acts.length - 1;
                      return (
                        <Box key={idx} sx={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                          {/* Avatar + dashed connector */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 40 }}>
                            <Box sx={{
                              width: 40, height: 40, borderRadius: '50%',
                              bgcolor: 'rgba(219,234,254,1)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              {getActivityIcon(act.type)}
                            </Box>
                            {!isLast && (
                              <Box sx={{ width: 0, flex: 1, minHeight: 24, my: '3px', borderLeft: '2px dashed #d1d5db' }} />
                            )}
                          </Box>

                          {/* Text + amount */}
                          <Box sx={{
                            pt: '8px', pb: isLast ? '4px' : '18px',
                            flex: 1, minWidth: 0,
                            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px',
                          }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                                {getActivityLabel(act.type)}&nbsp;
                                <Box component="span" sx={{ color: '#111', fontWeight: 700 }}>
                                  {act.user}
                                </Box>
                                &nbsp;
                              </Typography>
                              <Typography sx={{ fontSize: 12, color: '#9ca3af', mt: '2px' }}>
                                {act.date}&nbsp;
                                {act.transactionHash ? (
                                  <Box
                                    component="a"
                                    href={`https://polygonscan.com/tx/${act.transactionHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                    sx={{ display: 'inline-flex', verticalAlign: 'middle', color: '#9ca3af', '&:hover': { color: '#2563eb' } }}
                                  >
                                    <OpenInNewIcon sx={{ fontSize: 10 }} />
                                  </Box>
                                ) : (
                                  <OpenInNewIcon sx={{ fontSize: 10, verticalAlign: 'middle', color: '#c4c4c4' }} />
                                )}
                              </Typography>
                            </Box>
                            {act.amount != null && (
                              <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#111', flexShrink: 0, pt: '2px' }}>
                                {act.amount.toFixed(2)} USDT
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                  </Box>
                );
              })()}
            </Box>

          </Box>
        </Box>
      </Box>

      {/* ── Bid modal ── */}
      <Dialog
        open={bidOpen}
        onClose={() => { if (bidStep !== 'approving' && bidStep !== 'bidding' && bidStep !== 'recording') setBidOpen(false); }}
        slotProps={{ paper: { sx: { borderRadius: '20px', p: '8px', minWidth: 340, maxWidth: 420 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: 20, pb: 0 }}>
          {bidStep === 'done' ? 'Bid placed!' : 'Place a bid'}
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          {bidStep === 'input' && (
            <>
              <Typography sx={{ fontSize: 13, color: '#666', mb: '16px' }}>
                Enter your bid amount in USDC. Your wallet will first approve the transfer, then place the bid on-chain.
              </Typography>
              <TextField
                label="Bid amount (USDC)"
                type="number"
                fullWidth
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
              {bidError && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: '12px', fontSize: 13 }}>{bidError}</Alert>
              )}
            </>
          )}

          {(bidStep === 'approving' || bidStep === 'bidding' || bidStep === 'recording') && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
              <CircularProgress size={40} sx={{ color: '#EF4443' }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
                {bidStep === 'approving'  && 'Approving USDC spend…'}
                {bidStep === 'bidding'    && 'Placing bid on-chain…'}
                {bidStep === 'recording'  && 'Recording bid…'}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
                Confirm the transaction in your wallet
              </Typography>
            </Box>
          )}

          {bidStep === 'done' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 1 }}>
              <Box sx={{ width: 52, height: 52, borderRadius: '50%', bgcolor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 26 }}>✓</Typography>
              </Box>
              <Typography sx={{ fontSize: 14, color: '#374151', textAlign: 'center' }}>
                Your bid of <strong>{bidAmount} USDC</strong> was placed successfully.
              </Typography>
              {bidTxHash && (
                <Box
                  component="a"
                  href={`https://amoy.polygonscan.com/tx/${bidTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  sx={{ fontSize: 12, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  View on PolygonScan <OpenInNewIcon sx={{ fontSize: 13 }} />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          {bidStep === 'input' && (
            <>
              <Button
                onClick={() => setBidOpen(false)}
                sx={{ borderRadius: '50px', textTransform: 'none', color: '#666', flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBid}
                disabled={!bidAmount || parseFloat(bidAmount) <= 0}
                sx={{
                  borderRadius: '50px', textTransform: 'none', flex: 2,
                  background: 'linear-gradient(270deg, #EF4443 0%, #FABD24 100%)',
                  color: '#fff', fontWeight: 600,
                  '&:hover': { background: 'linear-gradient(270deg, #d63b3a 0%, #e0a91f 100%)' },
                  '&.Mui-disabled': { opacity: 0.45 },
                }}
              >
                Confirm bid
              </Button>
            </>
          )}
          {bidStep === 'done' && (
            <Button
              onClick={() => setBidOpen(false)}
              fullWidth
              sx={{
                borderRadius: '50px', textTransform: 'none', fontWeight: 600,
                bgcolor: '#111', color: '#fff',
                '&:hover': { bgcolor: '#333' },
              }}
            >
              Done
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <Box
          onClick={() => setLightboxOpen(false)}
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.88)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src={uniqueImages[safeActive] ?? ''}
            alt={item.title}
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxWidth: '92vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '10px',
            }}
          />
          <Box
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: 'absolute',
              top: 18,
              right: 18,
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
            }}
          >
            <CloseIcon sx={{ fontSize: 22, color: '#fff' }} />
          </Box>
        </Box>
      )}
    </Box>
  );
}