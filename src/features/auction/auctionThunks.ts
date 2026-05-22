import { createAsyncThunk } from '@reduxjs/toolkit';
import { auctionApi, type CreateAuctionPayload } from '@/api/auctionApi';

function extractMessage(err: unknown): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
    'Auction operation failed'
  );
}

export const createAuctionThunk = createAsyncThunk(
  'auction/create',
  async (payload: CreateAuctionPayload, { rejectWithValue }) => {
    try {
      const { data } = await auctionApi.create(payload);
      return data.data ?? data;
    } catch (err) {
      return rejectWithValue(extractMessage(err));
    }
  },
);

export const saveDraftAuctionThunk = createAsyncThunk(
  'auction/saveDraft',
  async (payload: CreateAuctionPayload, { rejectWithValue }) => {
    try {
      const { data } = await auctionApi.create({ ...payload, status: 'DRAFT' });
      return data.data ?? data;
    } catch (err) {
      return rejectWithValue(extractMessage(err));
    }
  },
);
