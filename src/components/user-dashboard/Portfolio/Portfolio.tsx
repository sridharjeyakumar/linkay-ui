'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import {
    PORTFOLIO_ASSETS,
    PORTFOLIO_STATS,
    PORTFOLIO_CATEGORIES,
    type PortfolioCategory,
    type PortfolioAsset,
} from '@/data/portfolioData';
import { keyframes } from '@emotion/react';

// const pulseGlow = keyframes`
//   0% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.95); }
//   50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.08); }
//   100% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.95); }
// `;
/* ------------------------------------------------------------------ */
/*  ETH icon (inline SVG — diamond shape)                              */
/* ------------------------------------------------------------------ */
function EthIcon({ size = 10 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 256 417"

            preserveAspectRatio="xMidYMid"
            style={{ flexShrink: 0 }}
        >
            <path fill="#fff" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
            <path fill="#ccc" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
            <path fill="#fff" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.601L256 236.587z" />
            <path fill="#ccc" d="M127.962 416.905V312.187L0 236.585z" />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/*  Asset card — Figma: card 245.98 × 347.87, image 245.98 × 309.87   */
/* ------------------------------------------------------------------ */
function AssetCard({ asset }: { asset: PortfolioAsset }) {
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 245.98,
                cursor: 'pointer',
                bgcolor: 'transparent',
                boxShadow: 'none',
                '&:hover .card-image': {
                    transform: 'scale(1.03)',
                },
            }}
        >
            {/* Image wrapper — clips image to rounded corners */}
            <Box
                className="card-image"
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: 309.87,
                    borderRadius: '50.69px',
                    overflow: 'hidden',
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    // Force the img to fill completely with no gap
                    fontSize: 0,
                    lineHeight: 0,
                    transition: 'transform 0.3s ease',
                }}
            >
                <img
                    src={asset.image}
                    alt={asset.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        margin: 0,
                        padding: 0,
                        border: 'none',
                    }}
                />

                {/* ETH badge — bottom center, inside image */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 50,          // ← inside the image
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
                        zIndex: 2,           // ← ensure it renders on top of image
                    }}
                >
                    <EthIcon size={10} />
                    <Typography
                        sx={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#fff',
                            letterSpacing: 0.3,
                            lineHeight: 1,
                        }}
                    >
                        {asset.priceEth} USDT
                    </Typography>
                </Box>
            </Box>

            {/* Asset name */}
            <Typography
                sx={{
                    mt: '-10px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#111',
                    textAlign: 'center',
                }}
            >
                {asset.name}
            </Typography>
        </Box>
    );
}

/* ------------------------------------------------------------------ */
/*  Category tab button                                                */
/* ------------------------------------------------------------------ */
function CategoryTab({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <Box
            component="button"
            onClick={onClick}
            sx={{
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                px: 2.2,
                py: 0.7,
                borderRadius: 5,
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s ease',
                bgcolor: active ? '#ef4444' : 'transparent',
                color: active ? '#fff' : '#555',
                '&:hover': {
                    bgcolor: active ? '#ef4444' : '#f5f5f5',
                    color: active ? '#fff' : '#111',
                },
            }}
        >
            {label}
        </Box>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Portfolio component                                           */
/* ------------------------------------------------------------------ */
export default function Portfolio() {
    const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('All');

    const filteredAssets =
        activeCategory === 'All'
            ? PORTFOLIO_ASSETS
            : PORTFOLIO_ASSETS.filter((a) => a.category === activeCategory);

    const stats = PORTFOLIO_STATS;

    return (
        <Box sx={{ maxWidth: 1104, mx: 'auto', fontFamily: 'Inter, sans-serif', position: 'relative' }}>

            {/* Decorative corner image — top-right */}
            <Box
                component="img"
                src="/Portifolio/Rectangle.png"
                alt=""
                aria-hidden="true"
                sx={{
                    position: 'absolute',
                    top: { xs: '-100px', sm: '-150px', md: '-100.83px'  },
                    left: { xs: '-50px', sm: '20px', md: '-180.29px' },
                    width: { xs: '420px', sm: '580px', md: '504.43px' },
                    height: 'auto',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/* ───────── Profile header — Figma: height 142 ───────── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 3, md: 0 },
                    mb: 0,
                    minHeight: 112,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Left — avatar + name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {/* Avatar — Figma: public/Portifolio/Avatar.svg */}
                    <Box
                        component="img"
                        src="/Portifolio/Avatar.svg"
                        alt="John Smith"
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                    <Box>
                        {/* Figma: Inter SemiBold 18px, color #0A0A0A, line-height 100% */}
                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                fontSize: 18,
                                lineHeight: 1,
                                color: '#0A0A0A',
                            }}
                        >
                            John Smith
                        </Typography>
                        {/* Figma: Inter Regular 14px, color #000000, line-height 100% */}
                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 400,
                                fontSize: 14,
                                lineHeight: 1,
                                color: '#000000',
                                mt: '10px',
                            }}
                        >
                            Joined June 2026
                        </Typography>
                    </Box>
                </Box>

                {/* Right — stats — Figma: box 309 × 43 */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 0,
                    }}
                >
                    {/* USD Value — Figma: width ~88 */}
                    <Box sx={{ textAlign: 'center', minWidth: 88 }}>
                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 14,
                                fontWeight: 400,
                                lineHeight: 1,
                                color: '#888',
                                mb: '6px',
                            }}
                        >
                            USD Value
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 18,
                                fontWeight: 500,
                                lineHeight: 1,
                                color: '#111',
                            }}
                        >
                            ${stats.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                    </Box>

                    {/* Collectibles */}
                    <Box
                        sx={{
                            textAlign: 'center',
                            minWidth: 100,
                            borderLeft: '1px solid #e0e0e0',
                            pl: 2.5,
                            ml: 2.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 14,
                                fontWeight: 400,
                                lineHeight: 1,
                                color: '#888',
                                mb: '6px',
                                
                            }}
                        >
                            Collectibles
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 18,
                                fontWeight: 500,
                                lineHeight: 1,
                                color: '#111',
                            }}
                        >
                            {stats.collectiblesCount}
                            <Typography
                                component="span"
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: 14,
                                    fontWeight: 400,
                                    color: '#888',
                                    ml: 0.5,
                                }}
                            >
                                | {stats.collectiblesPercent}%
                            </Typography>
                        </Typography>
                    </Box>

                    {/* Real Estate */}
                    <Box
                        sx={{
                            textAlign: 'center',
                            minWidth: 100,
                            borderLeft: '1px solid #e0e0e0',
                            pl: 2.5,
                            ml: 2.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 14,
                                fontWeight: 400,
                                lineHeight: 1,
                                color: '#888',
                                mb: '6px',
                            }}
                        >
                            Real Estate
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 18,
                                fontWeight: 500,
                                lineHeight: 1,
                                color: '#111',
                            }}
                        >
                            {stats.realEstateCount}
                            <Typography
                                component="span"
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: 14,
                                    fontWeight: 400,
                                    color: '#888',
                                    ml: 0.5,
                                }}
                            >
                                | {stats.realEstatePercent}%
                            </Typography>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* ───────── Divider — Figma: border-width 0.4px ───────── */}
            <Box
                sx={{
                    borderBottom: '0.4px solid #e0e0e0',
                    mb: '20px',
                }}
            />

            {/* ───────── Category tabs ───────── */}
            <Box sx={{ display: 'flex', gap: 0.5, mb: '28px', justifyContent: { xs: 'center', lg: 'flex-start' } }}>
                {PORTFOLIO_CATEGORIES.map((cat) => (
                    <CategoryTab
                        key={cat}
                        label={cat}
                        active={activeCategory === cat}
                        onClick={() => setActiveCategory(cat)}
                    />
                ))}
            </Box>

            {/* ───────── Asset grid — Figma: gap 16px ───────── */}
            {filteredAssets.length === 0 ? (
                <Box
                    sx={{
                        py: 8,
                        textAlign: 'center',
                        bgcolor: '#fafafa',
                        borderRadius: 3,
                        border: '1px dashed #ddd',
                    }}
                >
                    <Typography sx={{ color: '#aaa', fontSize: 15 }}>
                        No assets in this category.
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                        gap: '16px',
                        justifyItems: 'center',
                    }}
                >
                    {filteredAssets.map((asset) => (
                        <AssetCard key={asset.id} asset={asset} />
                    ))}
                </Box>
            )}
        </Box>
    );
}
