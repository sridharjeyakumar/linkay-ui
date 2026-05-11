import axiosInstance from './axiosInstance';

export const initKycApi = () =>
  axiosInstance.post('/api/v1/ekyc/init');

export const getKycStatusApi = () =>
  axiosInstance.get('/api/v1/ekyc/status');
