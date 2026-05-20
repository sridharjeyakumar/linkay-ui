'use client';

import { Box, TextField } from '@mui/material';
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

export function SupplyPricingStep({ asset, values, onChange }: Props) {
  const availableSupplyLabel = [
    asset.totalFractions ? `${asset.totalFractions} fractions` : null,
    asset.pricePerFraction != null
      ? `$${Number(asset.pricePerFraction).toLocaleString('en-US', { maximumFractionDigits: 3 })} per fraction`
      : null,
  ]
    .filter(Boolean)
    .join(' | ');

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
            type="number"
            value={values.fractionsAllocated}
            onChange={(e) => onChange('fractionsAllocated', e.target.value)}
            sx={inputSx}
            slotProps={{ htmlInput: { min: 1, max: asset.totalFractions } }}
          />
        </Box>
      </Box>

      {/* Row 2: Min + Max purchase quantity */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <AuctionLabel required>Min purchase quantity</AuctionLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={values.minPurchaseQty}
            onChange={(e) => onChange('minPurchaseQty', e.target.value)}
            sx={inputSx}
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </Box>
        <Box>
          <AuctionLabel required>Max purchase quantity</AuctionLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={values.maxPurchaseQty}
            onChange={(e) => onChange('maxPurchaseQty', e.target.value)}
            sx={inputSx}
          />
        </Box>
      </Box>

      {/* Row 3: Starting bid + Reserve price */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <AuctionLabel required>Starting bid price</AuctionLabel>
          <TextField
            fullWidth
            size="small"
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
