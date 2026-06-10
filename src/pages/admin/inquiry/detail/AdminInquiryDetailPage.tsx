// /src/pages/admin/inquiry/detail/AdminInquiryDetailPage.tsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import {
    type InquiryAnswerInputType,
    inquiryAnswerSchema,
} from "../../../../schemas/inquiry/inquiryAnswerSchema.ts";
import adminInquiryApi from "../../../../api/admin/adminInquiryApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminDetailContent,
    AdminDetailHeader,
    AdminDetailMeta,
    AdminDetailTitle,
    AdminDivider,
    AdminForm,
    AdminLoadingText,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import Badge from "../../../../components/common/badge/Badge.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import type { Inquiry } from "../../../../types/inquiry.type.ts";

function AdminInquiryDetailPage() {
    const { inquiryId } = useParams<{ inquiryId: string }>();
    const navigate = useNavigate();
    const id = Number(inquiryId);

    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 💡 수정 모드 토글 (기존 답변을 수정할 때 true로 변경)
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InquiryAnswerInputType>({
        resolver: zodResolver(inquiryAnswerSchema),
    });

    const loadInquiry = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminInquiryApi.getInquiryById(id);
            setInquiry(data);
            // 기존 답변이 있으면 폼 초기값으로 셋팅
            if (data.answer) {
                reset({ answer: data.answer });
            }
        } catch (error) {
            console.error(error);
            alert("문의글을 불러오지 못했습니다.");
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate, reset]);

    useEffect(() => {
        if (isNaN(id)) {
            alert("잘못된 접근입니다.");
            navigate("/admin/inquiry");
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInquiry().then(() => {});
    }, [id, loadInquiry, navigate]);

    // 1. 답변 등록/수정 핸들러
    const onSubmit = async (data: InquiryAnswerInputType) => {
        try {
            await adminInquiryApi.answerInquiry(id, data);
            alert("답변이 성공적으로 등록(수정)되었습니다.");
            setIsEditing(false); // 수정 모드 종료
            await loadInquiry(); // 데이터 갱신
        } catch (error) {
            console.error(error);
            alert("답변 등록 중 오류가 발생했습니다.");
        }
    };

    // 2. 답변 삭제 핸들러
    const handleDeleteAnswer = async () => {
        if (!window.confirm("정말 이 답변을 삭제하고 '대기' 상태로 되돌리시겠습니까?")) return;

        try {
            await adminInquiryApi.deleteInquiryAnswer(id);
            alert("답변이 삭제되었습니다.");
            reset({ answer: "" }); // 폼 초기화
            setIsEditing(false);
            await loadInquiry(); // 데이터 갱신
        } catch (error) {
            console.error(error);
            alert("답변 삭제 중 오류가 발생했습니다.");
        }
    };

    if (isLoading || !inquiry) {
        return (
            <AdminContainer>
                <AdminLoadingText>데이터를 불러오는 중입니다...</AdminLoadingText>
            </AdminContainer>
        );
    }

    // 현재 폼을 보여줘야 하는 상태인지 판별 (답변이 없거나, 수정 버튼을 눌렀을 때)
    const showForm = !inquiry.answer || isEditing;

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>1:1 문의 상세 및 답변</AdminTitle>
            </AdminPageHeader>

            <Card padding="32px">
                {/* --- 1. 유저의 문의 내용 영역 --- */}
                <AdminDetailHeader>
                    <AdminDetailTitle>
                        {/* 💡 뱃지 컴포넌트 적극 활용 */}
                        <Badge
                            color={inquiry.answer ? "success" : "error"}
                            className="status-badge">
                            {inquiry.answer ? "답변 완료" : "답변 대기"}
                        </Badge>
                        {inquiry.title}
                    </AdminDetailTitle>
                    <AdminDetailMeta>
                        <span>
                            작성자: {inquiry.user.nickname} ({inquiry.user.email})
                        </span>
                        <span className="divider">|</span>
                        <span>
                            {new Date(inquiry.createdAt).toLocaleString("ko-KR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </AdminDetailMeta>
                </AdminDetailHeader>

                <AdminDivider />

                <AdminDetailContent>{inquiry.content}</AdminDetailContent>

                <AdminDivider />

                {/* --- 2. 관리자 답변 영역 --- */}
                <AnswerSection>
                    {showForm ? (
                        /* 답변 작성/수정 폼 */
                        <AdminForm onSubmit={handleSubmit(onSubmit)}>
                            <TextareaGroup
                                id="answer"
                                label="관리자 답변 작성"
                                placeholder="유저에게 전달할 답변을 상세히 작성해주세요."
                                errorMessage={errors.answer?.message}
                                registerObj={register("answer")}
                                style={{ minHeight: "200px" }}
                            />

                            <AdminButtonGroup $align="right" style={{ marginTop: "16px" }}>
                                {isEditing && (
                                    <Button
                                        type="button"
                                        variant="text"
                                        color="secondary"
                                        onClick={() => {
                                            setIsEditing(false);
                                            reset({ answer: inquiry.answer || "" }); // 수정 취소 시 기존 데이터로 롤백
                                        }}
                                        disabled={isSubmitting}>
                                        수정 취소
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}>
                                    {isSubmitting ? "처리 중..." : "답변 저장하기"}
                                </Button>
                            </AdminButtonGroup>
                        </AdminForm>
                    ) : (
                        /* 답변 조회 모드 */
                        <AnswerDisplay>
                            <AnswerHeader>
                                <h4>관리자 답변</h4>
                                <small>
                                    답변일시:{" "}
                                    {inquiry.answeredAt &&
                                        new Date(inquiry.answeredAt).toLocaleString("ko-KR")}
                                </small>
                            </AnswerHeader>
                            <AdminDetailContent className="answer-content">
                                {inquiry.answer}
                            </AdminDetailContent>

                            <AdminButtonGroup $align="right" style={{ marginTop: "24px" }}>
                                <Button
                                    variant={"contained"}
                                    color="primary"
                                    onClick={() => setIsEditing(true)}>
                                    답변 수정
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleDeleteAnswer}>
                                    답변 삭제
                                </Button>
                            </AdminButtonGroup>
                        </AnswerDisplay>
                    )}
                </AnswerSection>

                {/* --- 3. 하단 공통 버튼 (목록으로 돌아가기) --- */}
                <AdminButtonGroup $align="left" style={{ marginTop: "32px" }}>
                    <Button variant="text" color="secondary" onClick={() => navigate(-1)}>
                        목록으로 돌아가기
                    </Button>
                </AdminButtonGroup>
            </Card>
        </AdminContainer>
    );
}

export default AdminInquiryDetailPage;

// --- Styled Components ---

const AnswerSection = styled.div`
    margin-top: 32px;
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.background.default};
    border-radius: 8px;

    /* 제목 옆에 뱃지 간격 조정 */
    .status-badge {
        margin-right: 12px;
        vertical-align: middle;
    }
`;

const AnswerDisplay = styled.div`
    display: flex;
    flex-direction: column;

    .answer-content {
        padding: 16px 0 0 0;
    }
`;

const AnswerHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed ${({ theme }) => theme.colors.divider};
    padding-bottom: 16px;

    h4 {
        margin: 0;
        font-size: 18px;
        color: ${({ theme }) => theme.colors.primary};
        font-weight: 700;
    }

    small {
        color: ${({ theme }) => theme.colors.secondary};
        font-size: 14px;
    }
`;
