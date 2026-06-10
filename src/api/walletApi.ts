import axiosInstance from './axiosInstance';

export const getWalletNonceApi = (address: string) =>
  axiosInstance.get<{ success: boolean; nonce: string }>(`/api/v1/auth/walletnonce?address=${address}`);

export const bindWalletApi = (address: string, signature: string, nonce: string) =>
  axiosInstance.post<{ success: boolean; walletAddress: string; accessToken: string }>(
    '/api/v1/auth/wallet-bind',
    { address, signature, nonce }
  );
