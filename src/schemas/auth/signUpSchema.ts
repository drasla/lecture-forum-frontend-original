import { z } from "zod";
import { Gender } from "../../types/user.type.ts";

export const signUpSchema = z
    .object({
        username: z
            .string()
            .min(4, "아이디는 4자 이상 입력해주세요.")
            .max(20, "아이디는 20자 이하로 입력해주세요."),
        password: z.string().min(6, "비밀번호는 8자 이상 입력해주세요."),
        passwordConfirm: z.string().min(1, "비밀번호 확인은 입력해주세요."),
        name: z.string().min(2, "이름을 정확히 입력해주세요."),
        nickname: z
            .string()
            .min(2, "닉네임은 2자 이상 입력해주세요.")
            .max(10, "닉네임은 10자 이하로 입력해주세요."),
        email: z.email("올바른 이메일 형식이 아닙니다."),
        birthdate: z.string().optional(),
        gender: z.enum(Gender),
    })
    .refine(data => data.password === data.passwordConfirm, {
        path: ["passwordConfirm"],
        message: "비밀번호가 일치하지 않습니다.",
    });

export type SignUpInputType = z.infer<typeof signUpSchema>;
