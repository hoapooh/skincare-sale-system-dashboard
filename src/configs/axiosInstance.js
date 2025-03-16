import { useAuthStore } from '@/store/authStore';
import { Mutex } from 'async-mutex';
import axiosClient from 'axios';

/**
 * Creates an initial 'axios' instance with custom settings.
 */

const axiosInstance = axiosClient.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = 'x-no-retry';

const handleRefreshToken = async () => {
  return await mutex.runExclusive(async () => {
    const response = await axiosInstance.get('/auth/refresh-token');

    if (response && response.data) return response.data.access_token;
    else return null;
  });
};

axiosInstance.interceptors.request.use(function (config) {
  if (
    typeof window !== 'undefined' &&
    window &&
    window.localStorage &&
    window.localStorage.getItem('access_token')
  ) {
    config.headers.Authorization =
      'Bearer ' + window.localStorage.getItem('access_token');
  }
  if (!config.headers.Accept && config.headers['Content-Type']) {
    config.headers.Accept = 'application/json';
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
  }
  return config;
});

/**
 * Handle all responses. It is possible to add handlers
 * for requests, but it is omitted here for brevity.
 */
axiosInstance.interceptors.response.use(
  res => res.data,
  async error => {
    const setRefreshTokenAction = useAuthStore.getState().setRefreshTokenAction;

    if (
      error.config &&
      error.response &&
      +error.response?.status === 401 &&
      error.config.url !== '/auth/login' &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = 'true';

      if (access_token) {
        error.config.headers['Authorization'] = `Bearer ${access_token}`;
        localStorage.setItem('access_token', access_token);
        return axiosInstance.request(error.config);
      }
    }

    if (
      error.config &&
      error.response &&
      +error.response.status === 400 &&
      error.config.url === '/auth/refresh-token'
    ) {
      const message =
        error?.response?.data?.message ?? 'Có lỗi xảy ra, vui lòng login.';
      setRefreshTokenAction(true, message);
    }

    return error?.response?.data ?? Promise.reject(error);
  }
);

/**
 * Replaces main `axios` instance with the custom-one.
 *
 * @param cfg - Axios configuration object.
 * @returns A promise object of a response of the HTTP request with the 'data' object already
 * destructured.
 */
// const axios = <T>(cfg: AxiosRequestConfig) => instance.request<any, T>(cfg);

// export default axios;

export default axiosInstance;
