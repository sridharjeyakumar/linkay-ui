export type AssetStatus = 'DRAFT' | 'REVIEW' | 'LIVE' | 'AUCTION' | 'PENDING' | 'SOLD' | 'ARCHIVED' | 'PUBLISHED' | 'TOKENIZED';

export type AssetCategory =
  | 'REAL_ESTATE'
  | 'FINE_ART'
  | 'LUXURY_ASSET'
  | 'LUXURY_WATCH'
  | 'COLLECTIBLE'
  | 'OTHER';

export interface Asset {
  id: string;
  title: string;
  assetType: AssetCategory;
  description: string;
  status: AssetStatus;
  valuation?: number | null;
  jurisdiction?: string | null;
  mediaFiles?: string[] | null;
  threeDFiles?: string;
  liveStream?: string;
  pricePerFraction?: number;
  totalFractions?: number;
  fractionsSold?: number;
  compliance?: string;
  lockupPeriod?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  ipfsUrl?: string;
  ipfsMetadataUrl?: string;
  museumName?: string;
  // New fields
  custodian?: string;
  ownershipEntity?: string;
  historicalContext?: string;
  conditionReport?: string;
  certificationRef?: string;
  tokenizePercentage?: number;
  royalty?: string;
  royaltyWallet?: string;
}

export interface CreateAssetPayload {
  title: string;
  assetType: string;
  description?: string;
  valuation?: number;
  jurisdiction?: string;
  mediaFiles?: string[];
  threeDFiles?: string;
  liveStream?: string;
  status?: string;
  custodian?: string;
  ownershipEntity?: string;
  historicalContext?: string;
  conditionReport?: string;
  certificationRef?: string;
  tokenizePercentage?: number;
  totalFractions?: number;
  pricePerFraction?: number;
  royalty?: string;
  royaltyWallet?: string;
}

export type UpdateAssetPayload = Partial<CreateAssetPayload>;

export interface AssetState {
  assets: Asset[];
  selectedAsset: Asset | null;
  previewAsset: Asset | null;
  stats: {
    totalAssets: number;
    totalAssetValue: number;
    fractionsSold: number;
    activeMinting: number;
  };
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}
