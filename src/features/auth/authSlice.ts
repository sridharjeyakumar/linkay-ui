import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../types/auth.types';
import { getMeThunk, loginThunk, logoutThunk, registerThunk } from './authThunks';
import { saveWalletThunk } from '../wallet/walletThunks';

const initialState: AuthState = {
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
    setWalletAddress(state, action: PayloadAction<string>) {
      if (state.user) state.user.walletAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      const raw = action.payload.user ?? action.payload;
      state.user = {
        ...raw,
        kycStatus: raw.kycStatus ?? raw.kyc_status ?? null,
        is_museum_user: raw.is_museum_user ?? raw.isMuseumUser,
        is_user: raw.is_user ?? raw.isUser,
      };
      const token = action.payload.accessToken ?? action.payload.access_token;
      if (token) {
        state.accessToken = token;
        localStorage.setItem('accessToken', token);
      }
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem('accessToken');
    });
    builder.addCase(getMeThunk.pending, (state) => {
  state.loading = true;
});
builder.addCase(getMeThunk.fulfilled, (state, action) => {
  state.loading = false;
  const raw = action.payload.user ?? action.payload;
  state.user = {
    ...raw,
    kycStatus: raw.kycStatus ?? raw.kyc_status ?? null,
    is_museum_user: raw.is_museum_user ?? raw.isMuseumUser ?? (raw.role === 'MUSEUM_ADMIN'),
    is_user: raw.is_user ?? raw.isUser ?? (raw.role === 'INVESTOR' || raw.role === 'MUSEUM_ADMIN'),
  };
});
builder.addCase(getMeThunk.rejected, (state) => {
  state.loading = false;
  state.user = null;
});

// Save wallet address
builder.addCase(saveWalletThunk.fulfilled, (state, action) => {
  if (state.user) {
    state.user.walletAddress =
      action.payload.walletAddress ?? action.payload.wallet_address ?? null;
  }
});
  },
});

export const { clearMessages, setWalletAddress } = authSlice.actions;
export default authSlice.reducer;
