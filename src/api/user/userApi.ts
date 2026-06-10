import axiosInstance from "../axiosInstance.ts";
import type { UpdateUserInputType } from "../../schemas/user/updateUserSchema.ts"; // 💡 변경된 임포트
import type { UpdatePasswordInputType } from "../../schemas/user/updatePasswordSchema.ts";
import type { User } from "../../types/user.type.ts";

const updateProfile = async (data: UpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch("/user/profile", data);
    return response.data.data;
};

const updatePassword = async (data: UpdatePasswordInputType): Promise<void> => {
    const response = await axiosInstance.patch("/user/password", data);
    return response.data;
};

export default {
    updateProfile,
    updatePassword,
};
