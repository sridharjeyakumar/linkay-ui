import { createAsyncThunk } from '@reduxjs/toolkit';
import { getWalletNonceApi, bindWalletApi } from '@/api/walletApi';

interface BindWalletArgs {
  address: string;
  signMessage: (message: string) => Promise<string>;
}

export const bindWalletThunk = createAsyncThunk(
  'wallet/bind',
  async ({ address, signMessage }: BindWalletArgs, { rejectWithValue }) => {
    try {
      const nonceRes = await getWalletNonceApi(address);
      const { nonce } = nonceRes.data;

      const message = `Sign to verify wallet ownership. Nonce: ${nonce}`;
      const signature = await signMessage(message);

      const bindRes = await bindWalletApi(address, signature, nonce);
      return bindRes.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message ?? 'Failed to bind wallet');
    }
  }
);
