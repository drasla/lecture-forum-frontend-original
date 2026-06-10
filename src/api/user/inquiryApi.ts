import type { PaginationResponseType } from "../../types/common.type.ts";
import axiosInstance from "../axiosInstance.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";
import type { InquiryInputType } from "../../schemas/inquiry/inquirySchema.ts";

const getInquiryList = async (
    page: number = 1,
    size: number = 20,
): Promise<PaginationResponseType<Inquiry>> => {
    const response = await axiosInstance.get("/inquiry/list", {
        params: { page, size },
    });
    return response.data.data;
};

const getInquiryById = async (inquiryId: number): Promise<Inquiry> => {
    const response = await axiosInstance.get(`/inquiry/${inquiryId}`);
    return response.data.data;
};

const createInquiry = async (data: InquiryInputType): Promise<Inquiry> => {
    const response = await axiosInstance.post("/inquiry/create", data);
    return response.data.data;
};

const updateInquiry = async (inquiryId: number, data: InquiryInputType): Promise<Inquiry> => {
    const response = await axiosInstance.patch(`/inquiry/${inquiryId}`, data);
    return response.data.data;
};

const deleteInquiry = async (inquiryId: number): Promise<void> => {
    await axiosInstance.delete(`/inquiry/${inquiryId}`);
};

export default {
    getInquiryList,
    getInquiryById,
    createInquiry,
    updateInquiry,
    deleteInquiry,
};
