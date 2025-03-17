import axiosInstance from '@/configs/axiosInstance';

export const getAllProductsApi = async () => {
  try {
    const response = await axiosInstance.get(`/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductByIdApi = async id => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProductApi = async productData => {
  try {
    const response = await axiosInstance.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProductApi = async (id, productData) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProductApi = async id => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const restoreProductApi = async id => {
  try {
    const response = await axiosInstance.patch(`/products/${id}/restore`);
    return response.data;
  } catch (error) {
    console.error('Error restoring product:', error);
    throw error;
  }
};
