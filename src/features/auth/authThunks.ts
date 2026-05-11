import { createAsyncThunk } from '@reduxjs/toolkit';
import { registerApi, loginApi, logoutApi, getMeApi } from '../../api/authApi';
import type { RegisterPayload } from '../../types/auth.types';

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const { data } = await registerApi(payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await loginApi(email, password);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

export const getMeThunk = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getMeApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Session expired.');
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
});
