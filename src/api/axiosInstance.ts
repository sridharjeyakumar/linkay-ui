import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:4000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function getTokenUserId(token: string): string | null {
  const payload = decodeTokenPayload(token);
  return payload ? ((payload.sub ?? payload.id ?? payload.userId) as string | null) : null;
}

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    try {
      const payload = decodeTokenPayload(token);
      if (payload?.role) config.headers['x-user-role'] = payload.role;
    } catch { /* malformed token — skip */ }
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!)
  );
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401) return Promise.reject(error);

    // Guard 1 — never retry auth endpoints (refresh, login, register)
    if (original.url?.includes('/auth/refresh') || original.url?.includes('/auth/login') || original.url?.includes('/auth/register')) {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      if (original.url?.includes('/auth/refresh')) window.location.href = '/';
      return Promise.reject(error);
    }

    // Guard 2 — don't retry a request that already retried
    if (original._retry) return Promise.reject(error);

    // Guard 3 — queue concurrent 401s while a refresh is already in flight
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const storedRefreshToken = sessionStorage.getItem('refreshToken');
      const { data } = await axiosInstance.post('/api/v1/auth/refresh',
        storedRefreshToken ? { refreshToken: storedRefreshToken } : {}
      );
      const newToken: string = data.accessToken;

      // Guard: if the refreshed token belongs to a different user, reject instead of
      // silently switching identity (extra safety for old sessions without stored refresh token).
      const oldToken = sessionStorage.getItem('accessToken');
      if (oldToken && getTokenUserId(oldToken) !== getTokenUserId(newToken)) {
        processQueue(new Error('session_mismatch'), null);
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/';
        return Promise.reject(new Error('session_mismatch'));
      }

      sessionStorage.setItem('accessToken', newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      processQueue(null, newToken);
      return axiosInstance(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      window.location.href = '/';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;










// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:4000',
//   withCredentials: true,
//   headers: { 'Content-Type': 'application/json' },
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = sessionStorage.getItem('accessToken');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const original = error.config;
//     if (error.response?.status === 401 && !original._retry) {
//       original._retry = true;
//       try {
//         const { data } = await axiosInstance.post('/api/v1/auth/refresh');
//         sessionStorage.setItem('accessToken', data.accessToken);
//         original.headers.Authorization = `Bearer ${data.accessToken}`;
//         return axiosInstance(original);
//       } catch {
//         sessionStorage.removeItem('accessToken');
//         window.location.href = '/';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
