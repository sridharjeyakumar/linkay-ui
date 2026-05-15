import { createSlice } from '@reduxjs/toolkit';
import type { EkycState } from '../../types/ekyc.types';
import { initKycThunk, getKycStatusThunk } from './ekycThunks';
import { logoutThunk } from '../auth/authThunks';

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
    setKycStatus(state, action: { payload: EkycState['kycStatus'] }) {
      state.kycStatus = action.payload;
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
      // handle both camelCase and snake_case from API
      state.kycStatus = action.payload.kycStatus ?? action.payload.kyc_status ?? state.kycStatus;
      state.applicantId = action.payload.applicantId ?? action.payload.applicant_id ?? state.applicantId;
    });
    builder.addCase(getKycStatusThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // reset ekyc state on logout so stale kycStatus doesn't persist across sessions
    builder.addCase(logoutThunk.fulfilled, () => initialState);
  },
});

export const { clearEkycError, setKycStatus } = ekycSlice.actions;
export default ekycSlice.reducer;
