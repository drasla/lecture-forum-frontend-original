import type { PaginationResponseType } from "../../types/common.type.ts";
import axiosInstance from "../axiosInstance.ts";
import type { Notice } from "../../types/notice.type.ts";

const getNotices = async (
    page: number = 1,
    size: number = 10,
): Promise<PaginationResponseType<Notice>> => {
    const response = await axiosInstance.get("/notice/list", {
        params: { page, size },
    });
    return response.data.data;
};

const getNoticeById = async (id: number): Promise<Notice> => {
    const response = await axiosInstance.get(`/notice/${id}`);
    return response.data.data;
};

export default {
    getNotices,
    getNoticeById,
};
