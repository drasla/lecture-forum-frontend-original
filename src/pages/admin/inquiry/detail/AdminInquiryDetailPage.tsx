import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import styled from "styled-components";
import type { Inquiry } from "../../../../types/inquiry.type.ts";
import adminInquiryApi from "../../../../api/admin/adminInquiryApi.ts";
import type { InquiryAnswerInputType } from "../../../../schemas/inquiry/inquiryAnswerSchema.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminDetailContent,
    AdminDetailHeader,
    AdminDetailMeta,
    AdminDetailTitle,
    AdminDivider,
    AdminLoadingText,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import Badge from "../../../../components/common/badge/Badge.tsx";
import AdminInquiryForm from "../../../../components/inquiry/AdminInquiryForm.tsx";
import AdminInquiryAnswerBox from "../../../../components/inquiry/AdminInquiryAnswerBox.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function AdminInquiryDetailPage() {
    const { inquiryId } = useParams<{ inquiryId: string }>();
    const navigate = useNavigate();
    const id = Number(inquiryId);

    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const loadInquiry = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminInquiryApi.getInquiryById(id);
            setInquiry(data);
        } catch (error) {
            console.error(error);
            alert("문의글을 불러오지 못했습니다.");
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (isNaN(id)) {
            alert("잘못된 접근입니다.");
            navigate("/admin/inquiry");
            return;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInquiry().then(() => {});
    }, [id, loadInquiry, navigate]);

    const handleAnswerSubmit = async (data: InquiryAnswerInputType) => {
        try {
            await adminInquiryApi.answerInquiry(id, data);
            alert("답변이 성공적으로 등록(수정)되었습니다.");
            setIsEditing(false);
            await loadInquiry();
        } catch (error) {
            console.error(error);
            alert("답변 등록 중 오류가 발생했습니다.");
        }
    };

    const handleDeleteAnswer = async () => {
        if (!window.confirm("정말 이 답변을 삭제하고 '대기' 상태로 되돌리시겠습니까?")) return;

        try {
            await adminInquiryApi.deleteInquiryAnswer(id);
            alert("답변이 삭제되었습니다.");
            setIsEditing(false);
            await loadInquiry();
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

    const showForm = !inquiry.answer || isEditing;

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>1:1 문의 상세 및 답변</AdminTitle>
            </AdminPageHeader>

            <Card padding="32px">
                <AdminDetailHeader>
                    <AdminDetailTitle>
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

                {/* 💡 공통 컴포넌트를 조립하여 UI 구성 */}
                <AnswerSection>
                    {showForm ? (
                        <AdminInquiryForm
                            initialAnswer={inquiry.answer}
                            isEditing={isEditing}
                            onSubmit={handleAnswerSubmit}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <AdminInquiryAnswerBox
                            answer={inquiry.answer!}
                            answeredAt={inquiry.answeredAt}
                            onEdit={() => setIsEditing(true)}
                            onDelete={handleDeleteAnswer}
                        />
                    )}
                </AnswerSection>

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

    .status-badge {
        margin-right: 12px;
        vertical-align: middle;
    }
`;
