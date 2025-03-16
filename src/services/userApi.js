import axiosInstance from '@/configs/axiosInstance';

export const getAllUsersApi = async (page, limit) => {
    try {
        const response = await axiosInstance.get(
            `/users?page=${page}&limit=${limit}&role!=admin`
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
