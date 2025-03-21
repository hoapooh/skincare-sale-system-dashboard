import axiosInstance from '@/configs/axiosInstance';
import { create } from 'zustand';

export const useAuthStore = create(set => ({
  isLoading: false,
  user: null,
  isAuthenticated: false,
  isRefreshToken: false,
  errorRefreshToken: '',

  setRefreshTokenAction: (isRefreshToken, errorRefreshToken) =>
    set({ isRefreshToken, errorRefreshToken }),

  login: data => {
    localStorage.setItem('access_token', data.access_token);
    set({ user: data.user, isAuthenticated: true });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get('/auth/current-user');
      set({ user: response.data.user, isAuthenticated: true });
      // eslint-disable-next-line
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, isAuthenticated: false });
  },
}));
