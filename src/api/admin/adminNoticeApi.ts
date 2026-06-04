import axiosInstance from "../axiosInstance.ts";
import type { Notice } from "../../types/notice.type.ts";
import type { NoticeInputType } from "../../schemas/admin/notice/noticeSchema.ts"; // 💡 Zod 타입 임포트

const createNotice = async (data: NoticeInputType): Promise<Notice> => {
    const response = await axiosInstance.post("/admin/notice/create", data);
    return response.data.data;
};

const updateNotice = async (id: number, data: NoticeInputType): Promise<Notice> => {
    const response = await axiosInstance.patch(`/admin/notice/${id}`, data);
    return response.data.data;
};

const deleteNotice = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/notice/${id}`);
};

export default {
    createNotice,
    updateNotice,
    deleteNotice,
};
