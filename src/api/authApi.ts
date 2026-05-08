import axiosInstance from './axiosInstance';
import type { RegisterPayload } from '../types/auth.types';

export const registerApi = (payload: RegisterPayload) =>
  axiosInstance.post('/api/v1/auth/register', payload);

export const loginApi = (email: string, password: string) =>
  axiosInstance.post('/api/v1/auth/login', { email, password });

export const logoutApi = () =>
  axiosInstance.post('/api/v1/auth/logout');

export const getMeApi = () =>
  axiosInstance.get('/api/v1/auth/me');
