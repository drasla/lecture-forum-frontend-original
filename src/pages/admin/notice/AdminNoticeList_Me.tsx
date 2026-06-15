import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import styled from "styled-components";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Button from "../../../components/common/button/Button";
import Card from "../../../components/common/card/Card";
import {
    AdminContainer,
    AdminPageHeader,
    AdminTitle,
    AdminTableWrapper,
    AdminTable,
    AdminTh,
    AdminTd,
    AdminButtonGroup,
    AdminLoadingText,
} from "../../../components/admin/admin.style";
import noticeApi from "../../../api/user/noticeApi.ts";
import type { Notice } from "../../../types/notice.type.ts";
import adminNoticeApi from "../../../api/admin/adminNoticeApi.ts";

function AdminNoticeListPage_Me() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [total, setTotal] = useState(0);
    const size = 10;

    // URL 쿼리 스트링에서 page 값을 읽어옵니다. 없으면 1페이지.
    const pageParam = searchParams.get("page");
    const page = pageParam ? Number(pageParam) : 1;

    const loadNotices = async (currentPage: number) => {
        setIsLoading(true);
        try {
            // 내가 하고 싶은 일 : 백엔드에게 공지사항 목록을 불러오고 싶다
            // 그 기능 구현이 어느 파일에 되어져 있다
            // 이 기능을 실행하기 위해서는 무엇이 필요하다 (매개변수)
            // 그렇게 해서 백엔드가 전달하는 내용이 무엇인가
            const data = await noticeApi.getNoticeList(currentPage, size);
            setNotices(data.list);
            setTotal(data.total);
        } catch (error) {
            console.error(error);
            alert("공지사항 목록을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        // 기존 쿼리 스트링을 유지하면서 page만 덮어씌웁니다.
        searchParams.set("page", newPage.toString());
        setSearchParams(searchParams);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadNotices(page).then(() => {});
    }, [page]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

        try {
            // 💡 삭제는 관리자 전용 API 사용
            await adminNoticeApi.deleteNotice(id);
            alert("공지사항이 성공적으로 삭제되었습니다.");
            await loadNotices(page); // 현재 페이지 데이터 다시 불러오기
        } catch (error) {
            console.error(error);
            alert("공지사항 삭제 중 오류가 발생했습니다.");
        }
    };

    const totalPages = Math.ceil(total / size) || 1;

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>공지사항 관리</AdminTitle>
                <Button variant="contained" color="primary" as={Link} to="/admin/notice/create">
                    + 공지사항 추가
                </Button>
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
                                    <AdminTh $width="10%">ID</AdminTh>
                                    <AdminTh $width="55%">제목</AdminTh>
                                    <AdminTh $width="20%">등록일</AdminTh>
                                    <AdminTh $width="15%">관리</AdminTh>
                                </tr>
                                </thead>
                                <tbody>
                                {notices.length === 0 ? (
                                    <tr>
                                        <AdminTd
                                            colSpan={4}
                                            style={{ textAlign: "center", padding: "32px" }}>
                                            등록된 공지사항이 없습니다.
                                        </AdminTd>
                                    </tr>
                                ) : (
                                    notices.map(notice => (
                                        <tr key={notice.id}>
                                            <AdminTd>{notice.id}</AdminTd>
                                            <AdminTd>
                                                <strong>{notice.title}</strong>
                                            </AdminTd>
                                            <AdminTd>
                                                {new Date(notice.createdAt).toLocaleDateString(
                                                    "ko-KR",
                                                    {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                    },
                                                )}
                                            </AdminTd>
                                            <AdminTd>
                                                <AdminButtonGroup $align="left">
                                                    <Button
                                                        variant="icon"
                                                        color="primary"
                                                        title="수정"
                                                        as={Link}
                                                        to={`/admin/notice/${notice.id}`}>
                                                        <FiEdit size={18} />
                                                    </Button>
                                                    <Button
                                                        variant="icon"
                                                        color="error"
                                                        title="삭제"
                                                        onClick={() => handleDelete(notice.id)}>
                                                        <FiTrash2 size={18} />
                                                    </Button>
                                                </AdminButtonGroup>
                                            </AdminTd>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </AdminTable>
                        </AdminTableWrapper>

                        {/* 💡 기존 유저 페이지와 완벽히 동일한 페이지네이션 적용 */}
                        {total > 0 && (
                            <PaginationWrapper>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    disabled={page === 1}
                                    onClick={() => handlePageChange(page - 1)}>
                                    이전
                                </Button>
                                <PageInfo>
                                    {page} / {totalPages}
                                </PageInfo>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    disabled={page === totalPages}
                                    onClick={() => handlePageChange(page + 1)}>
                                    다음
                                </Button>
                            </PaginationWrapper>
                        )}
                    </>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminNoticeListPage_Me;

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
`;

const PageInfo = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.default};
`;
