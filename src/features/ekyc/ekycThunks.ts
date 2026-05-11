import { createAsyncThunk } from '@reduxjs/toolkit';
import { initKycApi, getKycStatusApi } from '../../api/ekycApi';

export const initKycThunk = createAsyncThunk(
  'ekyc/init',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await initKycApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to initialize KYC.'
      );
    }
  }
);

export const getKycStatusThunk = createAsyncThunk(
  'ekyc/status',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getKycStatusApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch KYC status.'
      );
    }
  }
);
