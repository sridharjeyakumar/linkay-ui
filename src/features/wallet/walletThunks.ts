import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveWalletAddressApi } from '@/api/walletApi';

export const saveWalletThunk = createAsyncThunk(
  'wallet/save',
  async (walletAddress: string, { rejectWithValue }) => {
    try {
      const res = await saveWalletAddressApi(walletAddress);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to save wallet address');
    }
  }
);
