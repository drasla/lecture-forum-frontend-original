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
import { AdminButtonGroup } from "../../admin/admin.style.tsx";

interface ReplyFormProps {
    postId: number;
    replyId?: number;
    initialContent?: string;
    onCancel?: () => void;
    onSuccess: () => Promise<void>;
}

function ReplyForm({ postId, replyId, initialContent, onCancel, onSuccess }: ReplyFormProps) {
    const { isLoggedIn } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!replyId;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateReplyInputType>({
        resolver: zodResolver(createReplySchema),
        defaultValues: { content: initialContent || "" },
    });

    const onSubmit = async (data: CreateReplyInputType) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditMode) {
                // 수정 모드 API 호출
                await replyApi.updateReply(replyId, data.content.trim());
            } else {
                // 작성 모드 API 호출
                await replyApi.createReply(postId, data.content.trim());
            }
            reset();

            if (onCancel) onCancel();
            await onSuccess();
        } catch (error) {
            console.error(`댓글 ${isEditMode ? "수정" : "작성"} 실패:`, error);
            alert(`댓글 ${isEditMode ? "수정" : "작성"} 중 오류가 발생했습니다.`);
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
                autoFocus={isEditMode}
                {...register("content")}
            />
            <AdminButtonGroup>
                {isEditMode && onCancel && (
                    <Button
                        type="button"
                        color="secondary"
                        variant="contained"
                        onClick={onCancel}
                        disabled={isSubmitting}>
                        취소
                    </Button>
                )}
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={!isLoggedIn || isSubmitting}>
                    {isSubmitting
                        ? isEditMode
                            ? "저장 중..."
                            : "등록 중..."
                        : isEditMode
                          ? "수정 완료"
                          : "댓글 등록"}
                </Button>
            </AdminButtonGroup>
        </StyledReplyForm>
    );
}

export default ReplyForm;
