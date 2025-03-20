import axiosInstance from '@/configs/axiosInstance';

export const getBlogsApi = async () => {
  try {
    const response = await axiosInstance.get('/blogs');
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getBlogDetailApi = async id => {
  try {
    const response = await axiosInstance.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    throw error;
  }
};

export const createBlogApi = async payload => {
  try {
    const response = await axiosInstance.post('/blogs', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlogApi = async payload => {
  try {
    const response = await axiosInstance.patch(`/blogs`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlogApi = async id => {
  try {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};
