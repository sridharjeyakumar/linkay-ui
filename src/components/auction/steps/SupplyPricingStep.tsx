'use client';

import { Box, TextField, Typography } from '@mui/material';
import { AuctionLabel } from '../shared/AuctionLabel';
import { inputSx, disabledInputSx } from '../shared/styles';
import type { Asset } from '@/types/asset.types';

export interface SupplyPricingValues {
  fractionsAllocated: string;
  minPurchaseQty: string;
  maxPurchaseQty: string;
  startingBidPrice: string;
  reservePrice: string;
  minIncrement: string;
}

interface Props {
  asset: Asset;
  values: SupplyPricingValues;
  onChange: (field: keyof SupplyPricingValues, value: string) => void;
}

// ── helpers ────────────────────────────────────────────────────────────────────

/** Strip anything that isn't a digit, remove leading zeros. Returns '' for empty. */
function sanitizeInt(raw: string): string {
  const digitsOnly = raw.replace(/[^0-9]/g, '');
  if (digitsOnly === '') return '';
  return String(parseInt(digitsOnly, 10)); // removes leading zeros
}

function toInt(s: string): number | null {
  const n = parseInt(s, 10);
  return isNaN(n) ? null : n;
}

// ── validation ─────────────────────────────────────────────────────────────────

function getFractionsError(value: string, maxSupply: number | undefined | null): string {
  if (value === '') return '';
  const n = toInt(value);
  if (n === null || n <= 0) return 'Must be at least 1';
  if (maxSupply != null && n > maxSupply) return `Cannot exceed available supply (${maxSupply})`;
  return '';
}

function getMinQtyError(value: string, fractionsAllocated: string, maxQty: string): string {
  if (value === '') return '';
  const n   = toInt(value);
  const max = toInt(maxQty);
  const fa  = toInt(fractionsAllocated);
  if (n === null || n <= 0) return 'Must be at least 1';
  if (fa !== null && n > fa) return `Cannot exceed fractions allocated (${fa})`;
  if (max !== null && n > max) return 'Cannot exceed max purchase quantity';
  return '';
}

function getMaxQtyError(value: string, fractionsAllocated: string, minQty: string): string {
  if (value === '') return '';
  const n   = toInt(value);
  const min = toInt(minQty);
  const fa  = toInt(fractionsAllocated);
  if (n === null || n <= 0) return 'Must be at least 1';
  if (fa !== null && n > fa) return `Cannot exceed fractions allocated (${fa})`;
  if (min !== null && n < min) return 'Must be ≥ min purchase quantity';
  return '';
}

// ── error helper ───────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <Typography sx={{ fontSize: 11, color: '#EF4444', mt: 0.5, lineHeight: 1.4 }}>
      {msg}
    </Typography>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export function SupplyPricingStep({ asset, values, onChange }: Props) {
  const availableSupplyLabel = [
    asset.totalFractions ? `${asset.totalFractions} fractions` : null,
    asset.pricePerFraction != null
      ? `$${Number(asset.pricePerFraction).toLocaleString('en-US', { maximumFractionDigits: 3 })} per fraction`
      : null,
  ]
    .filter(Boolean)
    .join(' | ');

  // Derived errors (computed from current values — no extra state needed)
  const fractionsError = getFractionsError(values.fractionsAllocated, asset.totalFractions);
  const minQtyError    = getMinQtyError(values.minPurchaseQty, values.fractionsAllocated, values.maxPurchaseQty);
  const maxQtyError    = getMaxQtyError(values.maxPurchaseQty, values.fractionsAllocated, values.minPurchaseQty);

  /** Handle changes for integer-only fields: block negatives, leading zeros, decimals */
  function handleIntChange(field: keyof SupplyPricingValues, raw: string) {
    onChange(field, sanitizeInt(raw));
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Row 1: Available supply + Fractions allocated */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <AuctionLabel required>Available supply</AuctionLabel>
          <TextField
            fullWidth
            size="small"
            value={availableSupplyLabel}
            disabled
            sx={disabledInputSx}
          />
        </Box>
        <Box>
          <AuctionLabel required>Fractions allocated</AuctionLabel>
          <TextField
            fullWidth
            size="small"
            inputMode="numeric"
            value={values.fractionsAllocated}
            onChange={(e) => handleIntChange('fractionsAllocated', e.target.value)}
            sx={{
              ...inputSx,
              ...(fractionsError ? { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#EF4444' } } : {}),
            }}
            error={!!fractionsError}
          />
          <FieldError msg={fractionsError} />
        </Box>
      </Box>

      {/* Row 2: Min + Max purchase quantity */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <AuctionLabel required>Min purchase quantity</AuctionLabel>
          <TextField
            fullWidth
            size="small"
            inputMode="numeric"
            value={values.minPurchaseQty}
            onChange={(e) => handleIntChange('minPurchaseQty', e.target.value)}
            sx={{
              ...inputSx,
              ...(minQtyError ? { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#EF4444' } } : {}),
            }}
            error={!!minQtyError}
          />
          <FieldError msg={minQtyError} />
        </Box>
        <Box>
          <AuctionLabel required>Max purchase quantity</AuctionLabel>
          <TextField
            fullWidth
            size="small"
            inputMode="numeric"
            value={values.maxPurchaseQty}
            onChange={(e) => handleIntChange('maxPurchaseQty', e.target.value)}
            sx={{
              ...inputSx,
              ...(maxQtyError ? { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#EF4444' } } : {}),
            }}
            error={!!maxQtyError}
          />
          <FieldError msg={maxQtyError} />
        </Box>
      </Box>

      {/* Row 3: Starting bid + Reserve price */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <AuctionLabel required>Starting bid price</AuctionLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
            value={values.startingBidPrice}
            onChange={(e) => onChange('startingBidPrice', e.target.value)}
            sx={inputSx}
            placeholder="$"
          />
        </Box>
        <Box>
          <AuctionLabel required>Reserve price</AuctionLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
            value={values.reservePrice}
            onChange={(e) => onChange('reservePrice', e.target.value)}
            sx={inputSx}
            placeholder="$"
          />
        </Box>
      </Box>

      {/* Row 4: Minimum increment (half width) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <AuctionLabel required>Minimum increment</AuctionLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            onKeyDown={(e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); }}
            value={values.minIncrement}
            onChange={(e) => onChange('minIncrement', e.target.value)}
            sx={inputSx}
            placeholder="$"
          />
        </Box>
        <Box />
      </Box>
    </Box>
  );
}
