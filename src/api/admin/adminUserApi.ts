import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { User } from "../../types/user.type.ts";
import type { AdminCreateUserInputType } from "../../schemas/admin/user/adminCreateUserSchema.ts";
import type { AdminUpdateUserInputType } from "../../schemas/admin/user/adminUpdateUserSchema.ts";

const fetchUserList = async (
    page: number = 1,
    size: number = 10,
): Promise<PaginationResponseType<User>> => {
    const response = await axiosInstance.get(`/admin/user/list?page=${page}&size=${size}`);
    return response.data.data;
};

const fetchUserById = async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/admin/user/${id}`);
    return response.data.data;
};

const createUser = async (data: AdminCreateUserInputType): Promise<User> => {
    const response = await axiosInstance.post("/admin/user/create", data);
    return response.data.data;
};

const updateUser = async (id: number, data: AdminUpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch(`/admin/user/${id}`, data);
    return response.data.data;
};

// 2. 유저 삭제 (소프트 삭제)
const deleteUser = async (id: number): Promise<User> => {
    const response = await axiosInstance.delete(`/admin/user/${id}`);
    return response.data.data;
};

export default {
    fetchUserList,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
};
