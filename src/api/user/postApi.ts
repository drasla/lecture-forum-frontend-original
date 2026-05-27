import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Post } from "../../types/post.type.ts";
import axiosInstance from "../axiosInstance.ts";
import type { CreatePostInputType } from "../../schemas/post/createPostSchema.ts";

const fetchPostListByCategory = async (
    categoryId: number,
    page: number,
    size: number,
): Promise<PaginationResponseType<Post>> => {
    const response = await axiosInstance(`/post/list/${categoryId}?page=${page}&size=${size}`);
    return response.data.data;
};

const createPost = async (categoryId: number, input: CreatePostInputType): Promise<Post> => {
    const body = {
        ...input,
        categoryId: categoryId,
    };
    const response = await axiosInstance.post("/post/create", body);
    return response.data.data;
};

export default {
    fetchPostListByCategory,
    createPost,
};
