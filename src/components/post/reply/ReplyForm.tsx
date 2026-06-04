import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../../stores/auth/AuthStore.ts";
import {
    type CreateReplyInputType,
    createReplySchema,
} from "../../../schemas/reply/createReplySchema.ts";
import replyApi from "../../../api/user/replyApi.ts";
import { ReplyTextarea, StyledReplyForm } from "../reply.style.tsx";
import Button from "../../common/button/Button.tsx";

interface ReplyFormProps {
    postId: number;
    onSuccess: () => Promise<void>; // 작성이 성공하면 실행할 콜백 (목록 새로고침)
}

function ReplyForm({ postId, onSuccess }: ReplyFormProps) {
    const { isLoggedIn } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateReplyInputType>({
        resolver: zodResolver(createReplySchema),
        defaultValues: { content: "" },
    });

    const onSubmit = async (data: CreateReplyInputType) => {
        if (!isLoggedIn) {
            alert("댓글을 작성하려면 로그인이 필요합니다.");
            return;
        }

        setIsSubmitting(true);
        try {
            await replyApi.createReply(postId, data.content.trim());
            reset();
            await onSuccess(); // 부모 컴포넌트의 loadReplies(1) 실행
        } catch (error) {
            console.error("댓글 작성 실패:", error);
            alert("댓글 작성 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <StyledReplyForm onSubmit={handleSubmit(onSubmit)}>
            <ReplyTextarea
                placeholder={
                    isLoggedIn
                        ? "토론에 대한 의견을 남겨주세요."
                        : "로그인 후 댓글을 작성할 수 있습니다."
                }
                disabled={!isLoggedIn || isSubmitting}
                $hasError={!!errors.content}
                {...register("content")}
            />
            <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={!isLoggedIn || isSubmitting}>
                {isSubmitting ? "등록 중..." : "댓글 등록"}
            </Button>
        </StyledReplyForm>
    );
}

export default ReplyForm;
