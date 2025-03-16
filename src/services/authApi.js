import axiosInstance from '@/configs/axiosInstance';

export const loginApi = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
