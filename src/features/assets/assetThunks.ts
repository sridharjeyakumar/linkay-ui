import { createAsyncThunk } from '@reduxjs/toolkit';
import { assetApi } from '@/api/assetApi';
import type { CreateAssetPayload, UpdateAssetPayload } from '@/types/asset.types';

export const fetchAssetsThunk = createAsyncThunk(
  'assets/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await assetApi.listAll();
      // API returns { success, data: [...assets], pagination }
      return Array.isArray(data.data) ? data.data : [];
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to fetch assets';
      return rejectWithValue(msg);
    }
  },
);

export const createAssetThunk = createAsyncThunk(
  'assets/create',
  async ({ payload, files }: { payload: CreateAssetPayload; files?: File[] }, { rejectWithValue }) => {
    try {
      const { data } = await assetApi.createAsset(payload, files);
      // API returns { success, data: <asset> }
      return data.data ?? data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to create asset';
      return rejectWithValue(msg);
    }
  },
);

export const updateAssetThunk = createAsyncThunk(
  'assets/update',
  async (
    { assetId, payload, files }: { assetId: string; payload: UpdateAssetPayload; files?: File[] },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await assetApi.updateAsset(assetId, payload, files);
      // API returns { success, data: <asset> }
      return data.data ?? data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to update asset';
      return rejectWithValue(msg);
    }
  },
);

export const deleteAssetThunk = createAsyncThunk(
  'assets/delete',
  async (assetId: string, { rejectWithValue }) => {
    try {
      await assetApi.deleteAsset(assetId);
      return assetId;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to delete asset';
      return rejectWithValue(msg);
    }
  },
);

export const previewAssetThunk = createAsyncThunk(
  'assets/preview',
  async (assetId: string, { rejectWithValue }) => {
    try {
      const { data } = await assetApi.previewAsset(assetId);
      // API returns { success, data: { asset, media, ownershipSplit, dynamicFields, tokenization } }
      return data.data?.asset ?? data.data ?? data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to load preview';
      return rejectWithValue(msg);
    }
  },
);
