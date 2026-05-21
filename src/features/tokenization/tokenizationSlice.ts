import { createSlice } from '@reduxjs/toolkit';
import type { TokenizationState } from '@/types/tokenization.types';
import { initiateTokenizationThunk, pollJobStatusThunk } from './tokenizationThunks';

const STORAGE_KEY = 'tkn_jobs';

function loadJobs() {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persist(state: TokenizationState) {
  try {
    const active = state.jobs.filter(
      (j) => j.status !== 'completed' && j.status !== 'failed',
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
  } catch { /* ignore */ }
}

const initialState: TokenizationState = {
  jobs:    [],
  loading: false,
  error:   null,
};

const tokenizationSlice = createSlice({
  name: 'tokenization',
  initialState,
  reducers: {
    loadStoredJobs(state) {
      state.jobs = loadJobs();
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiateTokenizationThunk.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(initiateTokenizationThunk.fulfilled, (state, action) => {
        state.loading = false;
        const exists = state.jobs.findIndex((j) => j.assetId === action.payload.assetId);
        if (exists !== -1) {
          state.jobs[exists] = action.payload;
        } else {
          state.jobs.unshift(action.payload);
        }
        persist(state);
      })
      .addCase(initiateTokenizationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload as string;
      })
      .addCase(pollJobStatusThunk.fulfilled, (state, action) => {
        const idx = state.jobs.findIndex((j) => j.jobId === action.payload.jobId);
        if (idx !== -1) {
          state.jobs[idx] = { ...state.jobs[idx], ...action.payload };
          persist(state);
        }
      });
  },
});

export const { loadStoredJobs, clearError } = tokenizationSlice.actions;
export default tokenizationSlice.reducer;
