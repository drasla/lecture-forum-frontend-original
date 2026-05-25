import axiosInstance from "../axiosInstance.ts";
import type { Category } from "../../types/category.type.ts";

const fetchActiveCategories = async (): Promise<Category[]> => {
    // 💡 토큰 유무와 상관없이 호출할 수 있는 퍼블릭 엔드포인트
    const response = await axiosInstance.get("/category");
    return response.data.data;
};

export default {
    fetchActiveCategories,
};
