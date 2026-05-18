import axiosInstance from "../axiosInstance";
import type { Category } from "../../types/category.type.ts";

const fetchCategoryList = async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/admin/category/list");
    return response.data.data;
};

const fetchCategoryById = async (id: number): Promise<Category> => {
    const response = await axiosInstance.get(`/admin/category/${id}`);
    return response.data.data;
};

const createCategory = async (name: string): Promise<Category> => {
    const response = await axiosInstance.post("/admin/category/create", { name });
    return response.data.data;
};

const updateCategory = async (id: number, name: string): Promise<Category> => {
    const response = await axiosInstance.patch(`/admin/category/${id}`, { name });
    return response.data.data;
};

const toggleCategoryStatus = async (id: number): Promise<Category> => {
    const response = await axiosInstance.patch(`/admin/category/${id}/status`);
    return response.data.data;
};

export default {
    fetchCategoryList,
    fetchCategoryById,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
};
