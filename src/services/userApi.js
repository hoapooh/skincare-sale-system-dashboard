import axiosInstance from '@/configs/axiosInstance';

export const getAllUsersApi = async (page, limit, isDeleted = false) => {
  try {
    const response = await axiosInstance.get(
      `/users?page=${page}&limit=${limit}&role!=admin&isDeleted=${isDeleted}`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // rethrow the error for further handling
  }
};

export const getUserByIdApi = async id => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const banUserApi = async id => {
  try {
    const response = await axiosInstance.delete(`/users/${id}/ban`);
    return response.data;
  } catch (error) {
    console.error('Error banning user:', error);
    throw error;
  }
};

export const unbanUserApi = async id => {
  try {
    const response = await axiosInstance.patch(`/users/${id}/unban`);
    return response.data;
  } catch (error) {
    console.error('Error unbanning user:', error);
    throw error;
  }
};
