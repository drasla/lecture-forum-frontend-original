import type { PaginationResponseType } from "../../types/common.type.ts";
import axiosInstance from "../axiosInstance.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";
import type { InquiryAnswerInputType } from "../../schemas/inquiry/inquiryAnswerSchema.ts";

const getInquiryList = async (
    page: number = 1,
    size: number = 20,
): Promise<PaginationResponseType<Inquiry>> => {
    const response = await axiosInstance.get("/admin/inquiry/list", {
        params: { page, size },
    });
    return response.data.data;
};

const getInquiryById = async (inquiryId: number): Promise<Inquiry> => {
    const response = await axiosInstance.get(`/admin/inquiry/${inquiryId}`);
    return response.data.data;
};

const answerInquiry = async (inquiryId: number, data: InquiryAnswerInputType): Promise<Inquiry> => {
    const response = await axiosInstance.patch(`/admin/inquiry/${inquiryId}`, data);
    return response.data.data;
};

const deleteInquiryAnswer = async (inquiryId: number): Promise<void> => {
    await axiosInstance.delete(`/admin/inquiry/${inquiryId}`);
};

export default {
    getInquiryList,
    getInquiryById,
    answerInquiry,
    deleteInquiryAnswer,
};
