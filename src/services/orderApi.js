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

export const getAllOrdersApi = async () => {
  try {
    const response = await axiosInstance.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order data', error);
    throw error;
  }
};

export const getOrderByIdApi = async orderId => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order details', error);
    throw error;
  }
};

export const updateOrderApi = async (orderId, data) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update order', error);
    throw error;
  }
};

export const updateOrderStatusApi = async (orderId, status) => {
  try {
    const response = await axiosInstance.patch(`/orders/${orderId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update order status', error);
    throw error;
  }
};
