import axiosInstance from './axiosInstance';
import type { CreateAssetPayload, UpdateAssetPayload } from '@/types/asset.types';

function buildMediaFormData(files: File[]): FormData {
  const fd = new FormData();
  for (const file of files) {
    fd.append('mediaFiles', file);
  }
  return fd;
}

export const assetApi = {
  listAll: (params?: Record<string, string>) =>
    axiosInstance.get('/api/v1/assets/list-all', { params }),

  getAsset: (assetId: string) =>
    axiosInstance.get(`/api/v1/assets/get/${assetId}`),

  previewAsset: (assetId: string) =>
    axiosInstance.get(`/api/v1/assets/preview/${assetId}`),

  createAsset: async (payload: CreateAssetPayload, files?: File[]) => {
    // Send JSON first so dynamicFields arrives as a proper array (not a serialized string)
    const response = await axiosInstance.post('/api/v1/assets/create', payload);
    if (files && files.length > 0) {
      const assetId: string | undefined = response.data?.data?.id ?? response.data?.id;
      if (assetId) {
        return axiosInstance.patch(`/api/v1/assets/update/${assetId}`, buildMediaFormData(files), {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
    }
    return response;
  },

  updateAsset: async (assetId: string, payload: UpdateAssetPayload, files?: File[]) => {
    // Send JSON first so dynamicFields arrives as a proper array (not a serialized string)
    const response = await axiosInstance.patch(`/api/v1/assets/update/${assetId}`, payload);
    if (files && files.length > 0) {
      return axiosInstance.patch(`/api/v1/assets/update/${assetId}`, buildMediaFormData(files), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return response;
  },

  deleteAsset: (assetId: string) =>
    axiosInstance.delete(`/api/v1/assets/delete/${assetId}`),

  changeStatus: (assetId: string, status: string) =>
    axiosInstance.patch(`/api/v1/assets/change-status/${assetId}`, { status }),

  publishAsset: (assetId: string) =>
    axiosInstance.patch(`/api/v1/assets/publish/${assetId}`),

  marketplace: (params?: Record<string, string>) =>
    axiosInstance.get('/api/v1/assets/marketplace', { params }),

  adminStats: () =>
    axiosInstance.get('/api/v1/assets/admin-stats'),
};
