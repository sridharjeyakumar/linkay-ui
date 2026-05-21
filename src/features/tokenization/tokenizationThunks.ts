import { createAsyncThunk } from '@reduxjs/toolkit';
import { tokenizationApi } from '@/api/tokenizationApi';
import type { TokenizationJob } from '@/types/tokenization.types';
import type { Asset } from '@/types/asset.types';

export const initiateTokenizationThunk = createAsyncThunk(
  'tokenization/initiate',
  async (asset: Asset, { rejectWithValue }) => {
    try {
      const { data } = await tokenizationApi.mint(asset.id);
      const job = data.data;
      return {
        jobId:      job.jobId,
        assetId:    asset.id,
        assetTitle: asset.title,
        assetType:  asset.assetType,
        status:     job.status,
        steps:      job.steps,
        createdAt:  job.createdAt,
      } as TokenizationJob;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Tokenization failed';
      return rejectWithValue(msg);
    }
  },
);

export const pollJobStatusThunk = createAsyncThunk(
  'tokenization/poll',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const { data } = await tokenizationApi.getStatus(jobId);
      const job = data.data;
      return {
        jobId:       job.jobId,
        assetId:     job.assetId,
        status:      job.status,
        steps:       job.steps,
        error:       job.error ?? null,
        completedAt: job.completedAt,
      } as TokenizationJob;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Poll failed';
      return rejectWithValue(msg);
    }
  },
);
