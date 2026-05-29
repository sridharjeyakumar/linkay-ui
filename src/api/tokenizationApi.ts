import axiosInstance from './axiosInstance';

export const tokenizationApi = {
  mint: (assetId: string) =>
    axiosInstance.post('/api/v1/tokenization/mint', { assetId }),

  getStatus: (jobId: string) =>
    axiosInstance.get(`/api/v1/tokenization/status/${jobId}`),

  treasuryReview: (assetId: string, action: 'approve' | 'reject', reason?: string) =>
    axiosInstance.patch(`/api/v1/tokenization/${assetId}/treasury-review`, { action, reason }),
};
