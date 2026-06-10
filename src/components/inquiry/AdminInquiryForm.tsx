import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    type InquiryAnswerInputType,
    inquiryAnswerSchema,
} from "../../schemas/inquiry/inquiryAnswerSchema.ts";
import { AdminForm, AdminButtonGroup } from "../admin/admin.style.tsx";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import Button from "../common/button/Button.tsx";

interface AdminInquiryFormProps {
    initialAnswer?: string | null;
    isEditing?: boolean;
    onSubmit: (data: InquiryAnswerInputType) => Promise<void>;
    onCancel?: () => void;
}

function AdminInquiryForm({
    initialAnswer,
    isEditing = false,
    onSubmit,
    onCancel,
}: AdminInquiryFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InquiryAnswerInputType>({
        resolver: zodResolver(inquiryAnswerSchema),
        defaultValues: { answer: initialAnswer || "" },
    });

    // 💡 부모로부터 내려오는 초기값이 변경되면 폼을 리셋 (수정 취소 등)
    useEffect(() => {
        reset({ answer: initialAnswer || "" });
    }, [initialAnswer, reset]);

    const handleFormSubmit = async (data: InquiryAnswerInputType) => {
        await onSubmit(data);
    };

    return (
        <AdminForm onSubmit={handleSubmit(handleFormSubmit)}>
            <TextareaGroup
                id="answer"
                label="관리자 답변 작성"
                placeholder="유저에게 전달할 답변을 상세히 작성해주세요."
                errorMessage={errors.answer?.message}
                registerObj={register("answer")}
                style={{ minHeight: "200px" }}
            />

            <AdminButtonGroup $align="right" style={{ marginTop: "16px" }}>
                {isEditing && onCancel && (
                    <Button
                        type="button"
                        variant="text"
                        color="secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}>
                        수정 취소
                    </Button>
                )}
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    {isSubmitting ? "처리 중..." : "답변 저장하기"}
                </Button>
            </AdminButtonGroup>
        </AdminForm>
    );
}

export default AdminInquiryForm;
