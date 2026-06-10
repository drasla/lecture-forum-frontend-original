// /src/pages/my/inquiry/edit/MyInquiryEditPage.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import { inquirySchema, type InquiryInputType } from "../../../../schemas/inquiry/inquirySchema.ts";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";

import {
    PostContainer,
    PostPageHeader,
    PostTitle,
    FormWrapper,
    FormDivider,
    LoadingText,
} from "../../../../components/post/post.style.tsx";

function MyInquiryEditPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const inquiryId = Number(id);

    const [isPageLoading, setIsPageLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InquiryInputType>({
        resolver: zodResolver(inquirySchema),
    });

    // 기존 데이터 불러오기
    const fetchInquiry = useCallback(async () => {
        setIsPageLoading(true);
        try {
            const data = await inquiryApi.getInquiryById(inquiryId);

            // 💡 클라이언트단 방어 로직: 이미 답변이 달렸으면 접근 차단
            if (data.answer) {
                alert("이미 답변이 등록된 문의글은 수정할 수 없습니다.");
                navigate(`/my/inquiry/${inquiryId}`, { replace: true });
                return;
            }

            reset({
                title: data.title,
                content: data.content,
            });
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            alert("존재하지 않거나 삭제된 문의글입니다.");
            navigate("/my/inquiry", { replace: true });
        } finally {
            setIsPageLoading(false);
        }
    }, [inquiryId, navigate, reset]);

    useEffect(() => {
        if (isNaN(inquiryId)) {
            alert("잘못된 접근입니다.");
            navigate("/my/inquiry", { replace: true });
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchInquiry().then(() => {});
    }, [inquiryId, fetchInquiry, navigate]);

    const onSubmit = async (data: InquiryInputType) => {
        try {
            await inquiryApi.updateInquiry(inquiryId, data);
            alert("문의 내용이 성공적으로 수정되었습니다.");
            navigate(`/my/inquiry/${inquiryId}`, { replace: true }); // 수정 완료 후 상세 페이지로 복귀
        } catch (error) {
            console.error("문의글 수정 실패:", error);
            alert("문의글 수정 중 오류가 발생했습니다.");
        }
    };

    if (isPageLoading) {
        return (
            <PostContainer>
                <LoadingText>데이터를 불러오는 중입니다...</LoadingText>
            </PostContainer>
        );
    }

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    1:1 문의 수정 <small>등록하신 문의 내용을 수정합니다.</small>
                </PostTitle>
            </PostPageHeader>

            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputGroup
                    id="title"
                    label="문의 제목"
                    placeholder="문의하실 내용의 제목을 입력해주세요."
                    errorMessage={errors.title?.message}
                    registerObj={register("title")}
                />

                <FormDivider />

                <TextareaGroup
                    id="content"
                    label="문의 내용"
                    placeholder="관리자가 정확하게 답변할 수 있도록 문의 내용을 상세히 적어주세요."
                    errorMessage={errors.content?.message}
                    registerObj={register("content")}
                    style={{ minHeight: "300px" }}
                />

                <ButtonGroup>
                    <Button
                        type="button"
                        variant="text"
                        color="secondary"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}>
                        취소
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}>
                        {isSubmitting ? "수정 중..." : "수정 완료"}
                    </Button>
                </ButtonGroup>
            </FormWrapper>
        </PostContainer>
    );
}

export default MyInquiryEditPage;

// --- Styled Components ---

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
`;
