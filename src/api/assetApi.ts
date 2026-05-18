import axiosInstance from './axiosInstance';
import type { CreateAssetPayload, UpdateAssetPayload } from '@/types/asset.types';

function toFormData(payload: Record<string, unknown>, files?: File[]): FormData {
  const fd = new FormData();
  for (const [key, val] of Object.entries(payload)) {
    if (val !== undefined && val !== null) {
      fd.append(key, String(val));
    }
  }
  if (files) {
    for (const file of files) {
      fd.append('mediaFiles', file);
    }
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

  createAsset: (payload: CreateAssetPayload, files?: File[]) => {
    if (files && files.length > 0) {
      const fd = toFormData(payload as unknown as Record<string, unknown>, files);
      return axiosInstance.post('/api/v1/assets/create', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosInstance.post('/api/v1/assets/create', payload);
  },

  updateAsset: (assetId: string, payload: UpdateAssetPayload, files?: File[]) => {
    if (files && files.length > 0) {
      const fd = toFormData(payload as unknown as Record<string, unknown>, files);
      return axiosInstance.patch(`/api/v1/assets/update/${assetId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosInstance.patch(`/api/v1/assets/update/${assetId}`, payload);
  },

  deleteAsset: (assetId: string) =>
    axiosInstance.delete(`/api/v1/assets/delete/${assetId}`),

  changeStatus: (assetId: string, status: string) =>
    axiosInstance.patch(`/api/v1/assets/change-status/${assetId}`, { status }),

  publishAsset: (assetId: string) =>
    axiosInstance.patch(`/api/v1/assets/publish/${assetId}`),

  marketplace: (params?: Record<string, string>) =>
    axiosInstance.get('/api/v1/assets/marketplace', { params }),
};
