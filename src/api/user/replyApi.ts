import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Reply } from "../../types/reply.type.ts";

const getReplies = async (
    postId: number,
    page: number = 1,
    size: number = 10,
): Promise<PaginationResponseType<Reply>> => {
    const response = await axiosInstance.get(`/reply/${postId}`, {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const createReply = async (postId: number, content: string): Promise<Reply> => {
    const response = await axiosInstance.post(`/reply/${postId}`, { content });
    return response.data.data;
};

const deleteReply = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/reply/${id}`);
};

export default {
    getReplies,
    createReply,
    deleteReply,
};
