import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Asset, AssetState } from '@/types/asset.types';
import {
  fetchAssetsThunk,
  createAssetThunk,
  updateAssetThunk,
  deleteAssetThunk,
  previewAssetThunk,
} from './assetThunks';

const initialState: AssetState = {
  assets: [],
  selectedAsset: null,
  previewAsset: null,
  stats: {
    totalAssets: 0,
    totalAssetValue: 0,
    fractionsSold: 0,
    activeMinting: 0,
  },
  loading: false,
  actionLoading: false,
  error: null,
};

const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setSelectedAsset(state, action: PayloadAction<Asset | null>) {
      state.selectedAsset = action.payload;
    },
    clearPreviewAsset(state) {
      state.previewAsset = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAssets
      .addCase(fetchAssetsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssetsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload;
        const assets: Asset[] = state.assets;
        state.stats.totalAssets = assets.length;
        state.stats.totalAssetValue = assets.reduce(
          (sum, a) => sum + (Number(a.valuation) || 0),
          0,
        );
        state.stats.fractionsSold = assets.reduce(
          (sum, a) => sum + (a.fractionsSold ?? 0),
          0,
        );
        state.stats.activeMinting = assets.filter(
          (a) => a.status === 'PENDING',
        ).length;
      })
      .addCase(fetchAssetsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createAsset
      .addCase(createAssetThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createAssetThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.assets.unshift(action.payload);
        state.stats.totalAssets = state.assets.length;
        state.stats.totalAssetValue += Number(action.payload.valuation) || 0;
      })
      .addCase(createAssetThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      // updateAsset
      .addCase(updateAssetThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateAssetThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.assets.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.assets[idx] = action.payload;
        if (state.selectedAsset?.id === action.payload.id) {
          state.selectedAsset = action.payload;
        }
      })
      .addCase(updateAssetThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      // deleteAsset
      .addCase(deleteAssetThunk.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteAssetThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.assets = state.assets.filter((a) => a.id !== action.payload);
        state.stats.totalAssets = Math.max(0, state.stats.totalAssets - 1);
        if (state.selectedAsset?.id === action.payload) {
          state.selectedAsset = null;
        }
      })
      .addCase(deleteAssetThunk.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      // previewAsset
      .addCase(previewAssetThunk.fulfilled, (state, action) => {
        state.previewAsset = action.payload;
      });
  },
});

export const { setSelectedAsset, clearPreviewAsset, clearError } =
  assetSlice.actions;
export default assetSlice.reducer;
