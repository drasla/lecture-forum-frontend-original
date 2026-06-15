// /src/api/admin/adminDashboardApi.ts
import axiosInstance from "../axiosInstance.ts";
import type { User } from "../../types/user.type.ts";
import type { Post } from "../../types/post.type.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";

export interface DashboardSummaryResponse {
    users: Pick<User, "id" | "nickname" | "username" | "createdAt">[];
    posts: Pick<Post, "id" | "title" | "createdAt" | "user">[];
    inquiries: Pick<Inquiry, "id" | "title" | "createdAt" | "answer" | "user">[];
}

const getDashboardSummary = async (limit: number = 5): Promise<DashboardSummaryResponse> => {
    const response = await axiosInstance.get("/admin/summary", {
        params: { limit },
    });
    return response.data.data;
};

export default {
    getDashboardSummary,
};
