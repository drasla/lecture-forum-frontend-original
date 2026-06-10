import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import styled from "styled-components";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import type { Inquiry } from "../../../../types/inquiry.type.ts";

import Button from "../../../../components/common/button/Button.tsx";
import Badge from "../../../../components/common/badge/Badge.tsx";

// 💡 as 키워드 없이 선언된 이름 그대로 임포트
import {
    PostContainer,
    DetailWrapper,
    DetailHeader,
    DetailTitle,
    DetailInfo,
    DetailContent,
    LoadingText,
} from "../../../../components/post/post.style.tsx";

function MyInquiryDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadInquiry = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await inquiryApi.getInquiryById(Number(id));
            setInquiry(data);
        } catch (error) {
            console.error(error);
            alert("문의글을 불러오는 중 오류가 발생했습니다.");
            navigate("/my/inquiry");
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInquiry().then(() => {});
    }, [loadInquiry]);

    const handleDelete = async () => {
        if (!window.confirm("정말 이 문의글을 삭제하시겠습니까?")) return;

        try {
            await inquiryApi.deleteInquiry(Number(id));
            alert("문의글이 삭제되었습니다.");
            navigate("/my/inquiry");
        } catch (error) {
            console.error(error);
            alert("문의글 삭제 중 오류가 발생했습니다.");
        }
    };

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>문의 상세 내용을 불러오는 중입니다...</LoadingText>
            </PostContainer>
        );
    }

    if (!inquiry) return null;

    return (
        <PostContainer>
            <DetailWrapper>
                {/* --- 1. 헤더 영역 (제목 및 정보) --- */}
                <DetailHeader>
                    <DetailTitle>
                        <Badge
                            color={inquiry.answer ? "success" : "default"}
                            className="status-badge"
                            style={{ marginRight: "12px", verticalAlign: "middle" }}>
                            {inquiry.answer ? "답변 완료" : "답변 대기"}
                        </Badge>
                        {inquiry.title}
                    </DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>
                                <b>{inquiry.user.nickname}</b>
                            </span>
                            <span>
                                {new Date(inquiry.createdAt).toLocaleString("ko-KR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        <div className={"right-info"}>
                            <span>NO. {inquiry.id}</span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                {/* --- 2. 문의 본문 영역 --- */}
                <DetailContent>{inquiry.content}</DetailContent>

                {/* --- 3. 관리자 답변 영역 (답변이 있을 때만 노출) --- */}
                {inquiry.answer && (
                    <AnswerBox>
                        <AnswerHeader>
                            <span className="admin-label">관리자 답변</span>
                            <span className="answer-date">
                                {inquiry.answeredAt &&
                                    new Date(inquiry.answeredAt).toLocaleString("ko-KR")}
                            </span>
                        </AnswerHeader>
                        <DetailContent className="answer-content">{inquiry.answer}</DetailContent>
                    </AnswerBox>
                )}

                {/* --- 4. 하단 버튼 컨트롤 영역 --- */}
                <ButtonGroup>
                    <div className="left-btn">
                        <Button color="secondary" variant="contained" onClick={() => navigate(-1)}>
                            목록으로
                        </Button>
                    </div>

                    {/* 💡 관리자의 답변이 달리지 않은 경우에만 수정/삭제 버튼 노출 */}
                    {!inquiry.answer && (
                        <div className="right-btn">
                            <Button
                                color="warning"
                                variant="contained"
                                as={Link}
                                to={`/my/inquiry/edit/${inquiry.id}`}>
                                수정
                            </Button>
                            <Button color="error" variant="contained" onClick={handleDelete}>
                                삭제
                            </Button>
                        </div>
                    )}
                </ButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default MyInquiryDetailPage;

// --- Styled Components (유저 측 상세 페이지 전용) ---

const AnswerBox = styled.div`
    margin-top: 40px;
    padding: 24px;
    background-color: ${({ theme }) => theme.colors.background.default};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.divider};

    .answer-content {
        min-height: auto;
        padding-top: 16px;
    }
`;

const AnswerHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed ${({ theme }) => theme.colors.divider};
    padding-bottom: 16px;

    .admin-label {
        font-size: 16px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.primary};
    }

    .answer-date {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.text.disabled};
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid ${({ theme }) => theme.colors.divider};

    .right-btn {
        display: flex;
        gap: 12px;
    }
`;
