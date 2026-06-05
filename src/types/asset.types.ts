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
  threeDModelUrl?: string | null;
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
  transactionHash?: string | null;
  museumName?: string;
  // New fields
  custodian?: string;
  ownershipEntity?: string;
  historicalContext?: string;
  conditionReport?: string;
  certificationRef?: string;
  tokenizedPercent?: number;
  retainedPercent?: number;
  royaltyPercent?: number;
  royaltyWallet?: string;
  tokenization?: {
    tokenizationStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'TREASURY_PENDING' | 'TREASURY_APPROVED' | 'TREASURY_REJECTED';
    errorMessage?: string | null;
  } | null;
  latestAuction?: {
    id: string;
    status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED';
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    onChainAuctionId?: string | null;
  } | null;
}

export interface DynamicFieldPayload {
  id?: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  fieldValue?: string | null;
  fieldOptions?: Array<{ label: string; value: string }> | null;
  isRequired: boolean;
  fieldOrder: number;
}

export interface CreateAssetPayload {
  title: string;
  assetType: string;
  description?: string;
  valuation?: number;
  jurisdiction?: string;
  mediaFiles?: string[];
  threeDFiles?: string;
  threeDModelUrl?: string | null;
  liveStream?: string;
  status?: string;
  custodian?: string;
  ownershipEntity?: string;
  historicalContext?: string;
  conditionReport?: string;
  certificationRef?: string;
  tokenizedPercent?: number;
  retainedPercent?: number;
  totalFractions?: number;
  pricePerFraction?: number;
  royaltyPercent?: number;
  royaltyWallet?: string;
  dynamicFields?: DynamicFieldPayload[];
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
