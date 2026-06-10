import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import styled from "styled-components";
import inquiryApi from "../../../api/user/inquiryApi.ts";
import type { Inquiry } from "../../../types/inquiry.type.ts";

import Button from "../../../components/common/button/Button.tsx";
import Badge from "../../../components/common/badge/Badge.tsx";
import Pagination from "../../../components/common/pagination/Pagination.tsx";

// 💡 as 키워드 없이 선언된 이름 그대로 임포트합니다.
import {
    PostContainer,
    PostPageHeader,
    PostTitle,
    BoardWrapper,
    BoardTable,
    BoardTh,
    BoardTd,
    LoadingText,
} from "../../../components/post/post.style.tsx";

function MyInquiryListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const size = 10;
    const pageParam = searchParams.get("page");
    const page = pageParam ? Number(pageParam) : 1;

    const loadInquiries = async (currentPage: number) => {
        setIsLoading(true);
        try {
            const data = await inquiryApi.getInquiryList(currentPage, size);
            setInquiries(data.list);
            setTotal(data.total);
        } catch (error) {
            console.error(error);
            alert("나의 문의 내역을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        searchParams.set("page", newPage.toString());
        setSearchParams(searchParams);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInquiries(page).then(() => {});
    }, [page]);

    const totalPages = Math.ceil(total / size) || 1;

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    1:1 문의 내역 <small>관리자에게 남긴 문의를 확인하세요</small>
                </PostTitle>
                <Button variant="contained" color="primary" as={Link} to="/my/inquiry/create">
                    + 1:1 문의하기
                </Button>
            </PostPageHeader>

            <BoardWrapper>
                {isLoading ? (
                    <LoadingText>문의 내역을 불러오는 중입니다...</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                            <tr>
                                <BoardTh $width="10%">번호</BoardTh>
                                <BoardTh $width="15%">상태</BoardTh>
                                <BoardTh $width="55%">문의 제목</BoardTh>
                                <BoardTh $width="20%">등록일</BoardTh>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.length === 0 ? (
                                <tr>
                                    <BoardTd colSpan={4} style={{ padding: "100px 0" }}>
                                        작성하신 1:1 문의 내역이 없습니다.
                                    </BoardTd>
                                </tr>
                            ) : (
                                inquiries.map(inquiry => (
                                    <tr key={inquiry.id}>
                                        <BoardTd>{inquiry.id}</BoardTd>
                                        <BoardTd>
                                            <Badge color={inquiry.answer ? "success" : "default"}>
                                                {inquiry.answer ? "답변 완료" : "답변 대기"}
                                            </Badge>
                                        </BoardTd>
                                        <BoardTd className="title-cell">
                                            {/* 💡 제목 클릭 시 상세 페이지로 이동 */}
                                            <StyledLink to={`/my/inquiry/${inquiry.id}`}>
                                                {inquiry.title}
                                            </StyledLink>
                                        </BoardTd>
                                        <BoardTd>
                                            {new Date(inquiry.createdAt).toLocaleDateString(
                                                "ko-KR",
                                                {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                },
                                            )}
                                        </BoardTd>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </BoardTable>
                )}
            </BoardWrapper>

            {total > 0 && (
                <Pagination
                    currentPage={page}
                    totalPage={totalPages}
                    onPageChange={handlePageChange}
                    maxVisiblePages={5}
                />
            )}
        </PostContainer>
    );
}

export default MyInquiryListPage;

// --- Styled Components (해당 페이지 전용) ---

const StyledLink = styled(Link)`
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.default};
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: underline;
    }
`;
