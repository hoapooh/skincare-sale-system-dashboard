import axiosInstance from '@/configs/axiosInstance';

export const getOrderTotalApi = async () => {
  try {
    const response = await axiosInstance.get('/orders/totals');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order total data', error);
    throw error;
  }
};
