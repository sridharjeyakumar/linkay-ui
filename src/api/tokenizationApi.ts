import axiosInstance from './axiosInstance';

export const tokenizationApi = {
  mint: (assetId: string) =>
    axiosInstance.post('/api/v1/tokenization/mint', { assetId }),

  getStatus: (jobId: string) =>
    axiosInstance.get(`/api/v1/tokenization/status/${jobId}`),
};
