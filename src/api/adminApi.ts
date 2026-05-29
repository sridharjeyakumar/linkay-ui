import axiosInstance from './axiosInstance';

export const adminApi = {
  getAuthStats: () =>
    axiosInstance.get('/api/v1/admin/stats'),
};
