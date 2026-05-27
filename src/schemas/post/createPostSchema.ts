import z from "zod";

export const createPostSchema = z
    .object({
        title: z.string().min(1, "제목을 입력해주세요."),
        content: z.string().min(1, "내용을 입력해주세요."),
        // 선택지 항목은 최대 50자 제한 및 선택 사항(optional) 처리
        option1Text: z.string().max(50, "선택지는 50자 이하로 입력해주세요.").optional(),
        option2Text: z.string().max(50, "선택지는 50자 이하로 입력해주세요.").optional(),
    })
    .refine(
        data => {
            // 💡 토론 대난투 컨셉 검증: 1번과 2번 중 하나만 입력하는 비정상 상황 방지
            const hasOpt1 = !!data.option1Text?.trim();
            const hasOpt2 = !!data.option2Text?.trim();
            return (hasOpt1 && hasOpt2) || (!hasOpt1 && !hasOpt2);
        },
        {
            message: "투표 기능을 사용하려면 1번과 2번 항목을 모두 입력해야 합니다.",
            path: ["root"],
        },
    );

export type CreatePostInputType = z.infer<typeof createPostSchema>;
