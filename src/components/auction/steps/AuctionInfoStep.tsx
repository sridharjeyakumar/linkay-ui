'use client';

import { Box, TextField, Typography } from '@mui/material';
import { AuctionLabel } from '../shared/AuctionLabel';
import { AssetInfoCard } from '../shared/AssetInfoCard';
import { inputSx } from '../shared/styles';
import type { Asset } from '@/types/asset.types';

const MAX_WORDS = 200;

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

interface Props {
  asset: Asset;
  auctionTitle: string;
  auctionDescription: string;
  activeImageIndex: number;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onDotClick: (i: number) => void;
}

export function AuctionInfoStep({
  asset,
  auctionTitle,
  auctionDescription,
  activeImageIndex,
  onTitleChange,
  onDescriptionChange,
  onDotClick,
}: Props) {
  const wordCount = countWords(auctionDescription);
  const over = wordCount > MAX_WORDS;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box>
        <AuctionLabel required>Auction Title</AuctionLabel>
        <TextField
          fullWidth
          size="small"
          value={auctionTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          sx={inputSx}
        />
      </Box>

      <Box>
        <AuctionLabel required>Auction Description</AuctionLabel>
        <TextField
          fullWidth
          multiline
          rows={5}
          size="small"
          value={auctionDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          sx={inputSx}
        />
        <Typography sx={{ fontSize: 12, mt: 0.5, color: over ? '#ef4444' : '#9ca3af' }}>
          {over ? `${wordCount}/${MAX_WORDS} words — over limit` : 'Max 200 words'}
        </Typography>
      </Box>

      <Box>
        <AuctionLabel required>Asset</AuctionLabel>
        <AssetInfoCard
          asset={asset}
          activeImageIndex={activeImageIndex}
          onDotClick={onDotClick}
        />
      </Box>
    </Box>
  );
}
