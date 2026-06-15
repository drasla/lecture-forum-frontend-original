import { useEffect, useState } from "react";
import { Link } from "react-router";
import styled from "styled-components";
import { isAxiosError } from "axios";
import { FiUsers, FiFileText, FiMessageSquare } from "react-icons/fi";
import adminDashboardApi, {
    type DashboardSummaryResponse,
} from "../../api/admin/adminDashboardApi.ts";
import Card from "../../components/common/card/Card.tsx";
import Badge from "../../components/common/badge/Badge.tsx";
import {
    AdminContainer,
    AdminPageHeader,
    AdminTitle,
    AdminTableWrapper,
    AdminTable,
    AdminTh,
    AdminTd,
} from "../../components/admin/admin.style.tsx";

function AdminDashboardPage() {
    const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardSummary = async () => {
            try {
                const data = await adminDashboardApi.getDashboardSummary(5);
                setSummary(data);
            } catch (error) {
                console.error(error);
                let errorMessage = "대시보드 요약 데이터를 불러오는 중 오류가 발생했습니다.";
                if (isAxiosError(error)) {
                    errorMessage = error.response?.data?.message || errorMessage;
                }
                alert(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardSummary().then(() => {});
    }, []);

    if (isLoading || !summary) {
        return (
            <AdminContainer>
                <LoadingWrapper>현황 데이터를 불러오는 중입니다...</LoadingWrapper>
            </AdminContainer>
        );
    }

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>대시보드 메인</AdminTitle>
            </AdminPageHeader>

            {/* 💡 복잡한 그리드 없이 순수한 세로형(Flex Column) 구조 배치 */}
            <DashboardStack>
                {/* 1. 신규 가입 회원 섹션 */}
                <Card padding="24px">
                    <CardTitleGroup>
                        <TitleLeft>
                            <FiUsers size={18} />
                            <h3>신규 가입 회원</h3>
                        </TitleLeft>
                        <StyledLink to="/admin/user">관리 바로가기</StyledLink>
                    </CardTitleGroup>
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh>아이디</AdminTh>
                                    <AdminTh>닉네임</AdminTh>
                                    <AdminTh>가입일</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.users.length === 0 ? (
                                    <tr>
                                        <AdminTd colSpan={3}>최근 가입한 회원이 없습니다.</AdminTd>
                                    </tr>
                                ) : (
                                    summary.users.map(user => (
                                        <tr key={user.id}>
                                            <AdminTd>{user.username}</AdminTd>
                                            <AdminTd>
                                                <b>{user.nickname}</b>
                                            </AdminTd>
                                            <AdminTd>
                                                {new Date(user.createdAt).toLocaleDateString(
                                                    "ko-KR",
                                                )}
                                            </AdminTd>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                </Card>

                {/* 2. 최근 등록된 토론글 섹션 */}
                <Card padding="24px">
                    <CardTitleGroup>
                        <TitleLeft>
                            <FiFileText size={18} />
                            <h3>최근 등록된 토론글</h3>
                        </TitleLeft>
                        <StyledLink to="/">서비스 홈</StyledLink>
                    </CardTitleGroup>
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh style={{ textAlign: "left" }}>토론 제목</AdminTh>
                                    <AdminTh>작성자</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.posts.length === 0 ? (
                                    <tr>
                                        <AdminTd colSpan={2}>
                                            최근 등록된 토론 글이 없습니다.
                                        </AdminTd>
                                    </tr>
                                ) : (
                                    summary.posts.map(post => (
                                        <tr key={post.id}>
                                            <AdminTd style={{ textAlign: "left" }}>
                                                <TextLink to={`/post/${post.id}`}>
                                                    {post.title}
                                                </TextLink>
                                            </AdminTd>
                                            <AdminTd>{post.user.nickname}</AdminTd>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                </Card>

                {/* 3. 최근 1:1 문의 내역 섹션 */}
                <Card padding="24px">
                    <CardTitleGroup>
                        <TitleLeft>
                            <FiMessageSquare size={18} />
                            <h3>미해결 및 최근 1:1 문의</h3>
                        </TitleLeft>
                        <StyledLink to="/admin/inquiry">전체 문의 관리</StyledLink>
                    </CardTitleGroup>
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh $width="15%">답변 상태</AdminTh>
                                    <AdminTh style={{ textAlign: "left" }} $width="50%">
                                        문의 내용
                                    </AdminTh>
                                    <AdminTh $width="20%">작성자</AdminTh>
                                    <AdminTh $width="15%">접수 시간</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.inquiries.length === 0 ? (
                                    <tr>
                                        <AdminTd colSpan={4}>
                                            접수된 1:1 문의 내역이 없습니다.
                                        </AdminTd>
                                    </tr>
                                ) : (
                                    summary.inquiries.map(inquiry => (
                                        <tr key={inquiry.id}>
                                            <AdminTd>
                                                <Badge color={inquiry.answer ? "success" : "error"}>
                                                    {inquiry.answer ? "답변완료" : "답변대기"}
                                                </Badge>
                                            </AdminTd>
                                            <AdminTd style={{ textAlign: "left" }}>
                                                <TextLink to={`/admin/inquiry/${inquiry.id}`}>
                                                    <b>{inquiry.title}</b>
                                                </TextLink>
                                            </AdminTd>
                                            <AdminTd>{inquiry.user.nickname}</AdminTd>
                                            <AdminTd>
                                                {new Date(inquiry.createdAt).toLocaleDateString(
                                                    "ko-KR",
                                                    {
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    },
                                                )}
                                            </AdminTd>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                </Card>
            </DashboardStack>
        </AdminContainer>
    );
}

export default AdminDashboardPage;

// --- Styled Components ---

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 100px 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.secondary};
`;

const DashboardStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px; /* 세로로 카드가 나열될 때의 패딩 간격 고정 */
    width: 100%;
    margin-top: 16px;
`;

const CardTitleGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

const TitleLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.colors.text.default};

    h3 {
        font-size: 16px;
        font-weight: 700;
        margin: 0;
    }
`;

const StyledLink = styled(Link)`
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const TextLink = styled(Link)`
    color: ${({ theme }) => theme.colors.text.default};
    text-decoration: none;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: underline;
    }
`;
