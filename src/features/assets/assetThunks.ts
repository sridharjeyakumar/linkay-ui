import { createAsyncThunk } from '@reduxjs/toolkit';
import { assetApi, type DynamicFieldFileEntry } from '@/api/assetApi';
import type { CreateAssetPayload, UpdateAssetPayload } from '@/types/asset.types';

function extractErrorMessage(err: unknown, fallback: string): string {
  const data = (err as { response?: { data?: unknown } })?.response?.data as Record<string, unknown> | undefined;
  if (!data) return fallback;

  // NestJS ValidationPipe: message is a string array
  if (Array.isArray(data.message) && (data.message as unknown[]).length > 0) {
    return (data.message as string[]).join('; ');
  }

  // Custom validation response: top-level message + nested errors array
  if (typeof data.message === 'string' && data.message) {
    if (Array.isArray(data.errors) && (data.errors as unknown[]).length > 0) {
      const details = (data.errors as { message?: string; msg?: string }[])
        .map((e) => e.message || e.msg || '')
        .filter(Boolean)
        .join('; ');
      if (details) return details;
    }
    return data.message;
  }

  return fallback;
}

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
  async (
    { payload, files, dynamicFieldFiles = [] }:
      { payload: CreateAssetPayload; files?: File[]; dynamicFieldFiles?: DynamicFieldFileEntry[] },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await assetApi.createAsset(payload, files, dynamicFieldFiles);
      return data.data ?? data;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to create asset'));
    }
  },
);

export const updateAssetThunk = createAsyncThunk(
  'assets/update',
  async (
    { assetId, payload, files, dynamicFieldFiles = [] }:
      { assetId: string; payload: UpdateAssetPayload; files?: File[]; dynamicFieldFiles?: DynamicFieldFileEntry[] },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await assetApi.updateAsset(assetId, payload, files, dynamicFieldFiles);
      return data.data ?? data;
    } catch (err: unknown) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to update asset'));
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

export const changeStatusThunk = createAsyncThunk(
  'assets/changeStatus',
  async ({ assetId, status }: { assetId: string; status: string }, { rejectWithValue }) => {
    try {
      const { data } = await assetApi.changeStatus(assetId, status);
      return data.data ?? data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to change asset status';
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
