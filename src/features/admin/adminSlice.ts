import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAdminQueueThunk,
  fetchAdminStatsThunk,
  approveTreasuryThunk,
  rejectTreasuryThunk,
  fetchFullAssetThunk,
} from './adminThunks';

export interface PendingAsset {
  id: string;
  title: string;
  valuation: number | null;
  assetType: string | null;
  description: string | null;
  certificationRef: string | null;
  totalFractions: number | null;
  mediaFiles: unknown; // string[] or JSON string of string[]
  ownerName: string;
  dynamicFields: Array<{ fieldKey: string; fieldValue: unknown }>;
  tokenization: { tokenizationStatus: string } | null;
}

export interface OwnershipEntry {
  ownerName: string;
  ownerType: string;
  percentage: number;
}

export interface FullAssetDetail {
  id: string;
  title: string;
  assetType: string | null;
  description: string | null;
  valuation: number | null;
  jurisdiction: string | null;
  custodian: string | null;
  ownershipEntity: string | null;
  historicalContext: string | null;
  conditionReport: string | null;
  totalFractions: number | null;
  tokenizedPercent: number | null;
  retainedPercent: number | null;
  pricePerFraction: number | null;
  royaltyPercent: number | null;
  royaltyWallet: string | null;
  certificationRef: string | null;
  mediaFiles: unknown;
  dynamicFields: Array<{ fieldKey: string; fieldValue: unknown }>;
  ownershipSplit: OwnershipEntry[];
  tokenization: { tokenizationStatus: string } | null;
}

export interface AdminStats {
  pendingTreasuryCount: number;
  liveAuctionsCount: number;
  totalAssetsCount: number;
  totalAssetValue: number;
  museumAdminCount: number;
  verifiedInvestorCount: number;
}

interface AdminState {
  queue: PendingAsset[];
  loadingQueue: boolean;
  queueError: string | null;

  stats: AdminStats | null;
  loadingStats: boolean;

  reviewingIds: string[];

  selectedFullAsset: FullAssetDetail | null;
  loadingFullAsset: boolean;
}

const initialState: AdminState = {
  queue:             [],
  loadingQueue:      false,
  queueError:        null,
  stats:             null,
  loadingStats:      false,
  reviewingIds:      [],
  selectedFullAsset: null,
  loadingFullAsset:  false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Queue
      .addCase(fetchAdminQueueThunk.pending, (state) => {
        state.loadingQueue = true;
        state.queueError   = null;
      })
      .addCase(fetchAdminQueueThunk.fulfilled, (state, action) => {
        state.loadingQueue = false;
        state.queue        = action.payload;
      })
      .addCase(fetchAdminQueueThunk.rejected, (state, action) => {
        state.loadingQueue = false;
        state.queueError   = action.payload as string;
      })

      // Stats
      .addCase(fetchAdminStatsThunk.pending, (state) => {
        state.loadingStats = true;
      })
      .addCase(fetchAdminStatsThunk.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats        = action.payload;
      })
      .addCase(fetchAdminStatsThunk.rejected, (state) => {
        state.loadingStats = false;
      })

      // Approve
      .addCase(approveTreasuryThunk.pending, (state, action) => {
        state.reviewingIds = [...state.reviewingIds, action.meta.arg];
      })
      .addCase(approveTreasuryThunk.fulfilled, (state, action) => {
        state.reviewingIds = state.reviewingIds.filter((id) => id !== action.meta.arg);
        state.queue        = state.queue.filter((a) => a.id !== action.meta.arg);
        if (state.stats) {
          state.stats.pendingTreasuryCount = Math.max(0, state.stats.pendingTreasuryCount - 1);
        }
      })
      .addCase(approveTreasuryThunk.rejected, (state, action) => {
        state.reviewingIds = state.reviewingIds.filter((id) => id !== action.meta.arg);
      })

      // Reject
      .addCase(rejectTreasuryThunk.pending, (state, action) => {
        state.reviewingIds = [...state.reviewingIds, action.meta.arg.assetId];
      })
      .addCase(rejectTreasuryThunk.fulfilled, (state, action) => {
        state.reviewingIds = state.reviewingIds.filter((id) => id !== action.meta.arg.assetId);
        state.queue        = state.queue.filter((a) => a.id !== action.meta.arg.assetId);
        if (state.stats) {
          state.stats.pendingTreasuryCount = Math.max(0, state.stats.pendingTreasuryCount - 1);
        }
      })
      .addCase(rejectTreasuryThunk.rejected, (state, action) => {
        state.reviewingIds = state.reviewingIds.filter((id) => id !== action.meta.arg.assetId);
      })

      // Full asset detail
      .addCase(fetchFullAssetThunk.pending, (state) => {
        state.loadingFullAsset  = true;
        state.selectedFullAsset = null;
      })
      .addCase(fetchFullAssetThunk.fulfilled, (state, action) => {
        state.loadingFullAsset  = false;
        state.selectedFullAsset = action.payload;
      })
      .addCase(fetchFullAssetThunk.rejected, (state) => {
        state.loadingFullAsset = false;
      });
  },
});

export default adminSlice.reducer;
