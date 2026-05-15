import axiosInstance from './axiosInstance';

// TODO: confirm endpoint with backend — expected: PATCH /api/v1/users/wallet
export const saveWalletAddressApi = (walletAddress: string) =>
  axiosInstance.patch('/api/v1/users/wallet', { walletAddress });
