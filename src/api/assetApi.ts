import axiosInstance from './axiosInstance';
import type { CreateAssetPayload, UpdateAssetPayload } from '@/types/asset.types';

/** One entry per dynamic-field file upload. fieldIndex = position in dynamicFields array. */
export interface DynamicFieldFileEntry {
  file:       File;
  fieldIndex: number;
}

/**
 * Builds a FormData that contains:
 *  - mediaFiles        → regular asset media
 *  - dynamicFieldFiles → files for file_upload type dynamic fields
 *  - dynamicFieldMeta  → JSON "[0, 0, 1, ...]" — fieldIndex per uploaded file
 *  - dynamicFields     → JSON string of the full dynamic fields array
 *                        so the backend can merge file paths into the right field
 *                        in the same request (no separate JSON+FormData 2-step problem)
 */
function buildMediaFormData(
  mediaFiles:        File[],
  dynamicFieldFiles: DynamicFieldFileEntry[],
  dynamicFields?:    unknown,
): FormData {
  const fd = new FormData();

  for (const file of mediaFiles) {
    fd.append('mediaFiles', file);
  }

  if (dynamicFieldFiles.length) {
    const meta: number[] = [];
    for (const { file, fieldIndex } of dynamicFieldFiles) {
      fd.append('dynamicFieldFiles', file);
      meta.push(fieldIndex);
    }
    fd.append('dynamicFieldMeta', JSON.stringify(meta));
  }

  // Always include dynamicFields so the backend can identify file_upload fields
  // and merge file paths into them in one shot.
  if (dynamicFields !== undefined) {
    fd.append('dynamicFields', JSON.stringify(dynamicFields));
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

  createAsset: async (
    payload:           CreateAssetPayload,
    files?:            File[],
    dynamicFieldFiles: DynamicFieldFileEntry[] = [],
  ) => {
    // Step 1 — JSON: create the asset record (dynamicFields stored with fieldValue null for file_upload)
    const response = await axiosInstance.post('/api/v1/assets/create', payload);

    const hasFiles = (files?.length ?? 0) > 0 || dynamicFieldFiles.length > 0;
    if (hasFiles) {
      const assetId: string | undefined = response.data?.data?.id ?? response.data?.id;
      if (assetId) {
        // Step 2 — FormData: upload files + include dynamicFields JSON so the backend
        // can merge file paths directly into the correct field's fieldValue
        return axiosInstance.patch(
          `/api/v1/assets/update/${assetId}`,
          buildMediaFormData(files ?? [], dynamicFieldFiles, payload.dynamicFields),
          { headers: { 'Content-Type': 'multipart/form-data' } },
        );
      }
    }
    return response;
  },

  updateAsset: async (
    assetId:           string,
    payload:           UpdateAssetPayload,
    files?:            File[],
    dynamicFieldFiles: DynamicFieldFileEntry[] = [],
  ) => {
    // Step 1 — JSON: update scalar fields + dynamicFields array
    const response = await axiosInstance.patch(`/api/v1/assets/update/${assetId}`, payload);

    const hasFiles = (files?.length ?? 0) > 0 || dynamicFieldFiles.length > 0;
    if (hasFiles) {
      // Step 2 — FormData: upload files + include dynamicFields JSON for file merge
      return axiosInstance.patch(
        `/api/v1/assets/update/${assetId}`,
        buildMediaFormData(files ?? [], dynamicFieldFiles, payload.dynamicFields),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
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
