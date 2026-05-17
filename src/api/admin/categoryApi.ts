import axiosInstance from "../axiosInstance";
import type { Category } from "../../types/category.type.ts";

export const fetchCategoryList = async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/admin/category/list");
    return response.data.data;
};

export const createCategory = async (name: string): Promise<Category> => {
    const response = await axiosInstance.post("/admin/category/create", { name });
    return response.data.data;
};
