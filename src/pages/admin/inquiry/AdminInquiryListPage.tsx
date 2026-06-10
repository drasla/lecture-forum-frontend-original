import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import adminInquiryApi from "../../../api/admin/adminInquiryApi.ts";
import type { Inquiry } from "../../../types/inquiry.type.ts";

import Button from "../../../components/common/button/Button.tsx";
import Card from "../../../components/common/card/Card.tsx";
import Badge from "../../../components/common/badge/Badge.tsx";
import Pagination from "../../../components/common/pagination/Pagination.tsx"; // 💡 공통 페이지네이션 임포트
import {
    AdminContainer,
    AdminPageHeader,
    AdminTitle,
    AdminTableWrapper,
    AdminTable,
    AdminTh,
    AdminTd,
    AdminLoadingText,
} from "../../../components/admin/admin.style.tsx";

function AdminInquiryListPage() {
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
            const data = await adminInquiryApi.getInquiryList(currentPage, size);
            setInquiries(data.list);
            setTotal(data.total);
        } catch (error) {
            console.error(error);
            alert("문의 목록을 불러오는데 실패했습니다.");
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
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>1:1 문의 관리</AdminTitle>
            </AdminPageHeader>

            <Card padding="24px">
                {isLoading ? (
                    <AdminLoadingText>데이터를 불러오는 중...</AdminLoadingText>
                ) : (
                    <>
                        <AdminTableWrapper>
                            <AdminTable>
                                <thead>
                                    <tr>
                                        <AdminTh $width="8%">ID</AdminTh>
                                        <AdminTh $width="12%">상태</AdminTh>
                                        <AdminTh $width="40%">제목</AdminTh>
                                        <AdminTh $width="15%">작성자</AdminTh>
                                        <AdminTh $width="15%">등록일</AdminTh>
                                        <AdminTh $width="10%">관리</AdminTh>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.length === 0 ? (
                                        <tr>
                                            <AdminTd
                                                colSpan={6}
                                                style={{ textAlign: "center", padding: "32px" }}>
                                                등록된 문의 내역이 없습니다.
                                            </AdminTd>
                                        </tr>
                                    ) : (
                                        inquiries.map(inquiry => (
                                            <tr key={inquiry.id}>
                                                <AdminTd>{inquiry.id}</AdminTd>
                                                <AdminTd>
                                                    {/* 💡 답변 여부에 따라 뱃지 색상 다르게 표시 */}
                                                    {inquiry.answer ? (
                                                        <Badge color="success">답변 완료</Badge>
                                                    ) : (
                                                        <Badge color="error">답변 대기</Badge>
                                                    )}
                                                </AdminTd>
                                                <AdminTd>
                                                    <strong>{inquiry.title}</strong>
                                                </AdminTd>
                                                <AdminTd>{inquiry.user.nickname}</AdminTd>
                                                <AdminTd>
                                                    {new Date(inquiry.createdAt).toLocaleDateString(
                                                        "ko-KR",
                                                        {
                                                            year: "numeric",
                                                            month: "2-digit",
                                                            day: "2-digit",
                                                        },
                                                    )}
                                                </AdminTd>
                                                <AdminTd>
                                                    {/* 상세 페이지(답변 작성 페이지)로 이동 */}
                                                    <Button
                                                        variant="contained"
                                                        color={
                                                            inquiry.answer ? "secondary" : "primary"
                                                        }
                                                        as={Link}
                                                        to={`/admin/inquiry/detail/${inquiry.id}`}>
                                                        {inquiry.answer ? "보기" : "답변하기"}
                                                    </Button>
                                                </AdminTd>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </AdminTable>
                        </AdminTableWrapper>

                        {/* 💡 공통 Pagination 컴포넌트로 완벽 교체! */}
                        {total > 0 && (
                            <Pagination
                                currentPage={page}
                                totalPage={totalPages}
                                onPageChange={handlePageChange}
                                maxVisiblePages={5}
                            />
                        )}
                    </>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminInquiryListPage;
