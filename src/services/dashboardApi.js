import axiosInstance from '@/configs/axiosInstance';

export const getAllProductsApi = async () => {
  try {
    const response = await axiosInstance.get('/products');

    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getAllOrdersApi = async () => {
  try {
    const response = await axiosInstance.get('/orders');

    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
