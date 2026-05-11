import { createSlice } from '@reduxjs/toolkit';
import type { EkycState } from '../../types/ekyc.types';
import { initKycThunk, getKycStatusThunk } from './ekycThunks';

const initialState: EkycState = {
  sdkToken: null,
  applicantId: null,
  kycStatus: null,
  loading: false,
  error: null,
};

const ekycSlice = createSlice({
  name: 'ekyc',
  initialState,
  reducers: {
    clearEkycError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initKycThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(initKycThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.sdkToken = action.payload.sdkToken;
      state.applicantId = action.payload.applicantId;
    });
    builder.addCase(initKycThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getKycStatusThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getKycStatusThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.kycStatus = action.payload.kycStatus;
      state.applicantId = action.payload.applicantId ?? state.applicantId;
    });
    builder.addCase(getKycStatusThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearEkycError } = ekycSlice.actions;
export default ekycSlice.reducer;
