import { useEffect, useState } from "react";
import { Link } from "react-router"; // react-router-dom이 아닌 react-router를 쓰시는 버전에 맞춤
import styled from "styled-components";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import type { User } from "../../../types/user.type"; // 💡 공통 타입 임포트
import Button from "../../../components/common/button/Button";
import Card from "../../../components/common/card/Card";
import Badge from "../../../components/common/badge/Badge";
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
import adminUserApi from "../../../api/admin/adminUserApi.ts";

function AdminUserListPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const size = 10;

    const loadUsers = async (currentPage: number) => {
        setIsLoading(true);
        try {
            const data = await adminUserApi.fetchUserList(currentPage, size);
            setUsers(data.list);
            setTotal(data.total);
        } catch (error) {
            console.error(error);
            alert("유저 목록을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(page).then(() => {});
    }, [page]);

    const handleDelete = async (id: number) => {
        if (!confirm("정말 이 유저를 삭제(탈퇴) 처리하시겠습니까?")) return;

        try {
            await adminUserApi.deleteUser(id);
            alert("유저가 성공적으로 삭제되었습니다.");
            await loadUsers(page);
        } catch (error) {
            console.error(error);
            alert("유저 삭제 중 오류가 발생했습니다.");
        }
    };

    const totalPages = Math.ceil(total / size) || 1;

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>유저 관리</AdminTitle>
                <Button variant="contained" color="primary" as={Link} to="/admin/users/create">
                    + 유저 추가
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
                                        <AdminTh $width="5%">ID</AdminTh>
                                        <AdminTh $width="15%">아이디</AdminTh>
                                        <AdminTh $width="15%">이름 (닉네임)</AdminTh>
                                        <AdminTh $width="20%">이메일</AdminTh>
                                        <AdminTh $width="10%">권한</AdminTh>
                                        <AdminTh $width="10%">상태</AdminTh>
                                        <AdminTh $width="15%">가입일</AdminTh>
                                        <AdminTh $width="10%">관리</AdminTh>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <AdminTd
                                                colSpan={8}
                                                style={{ textAlign: "center", padding: "32px" }}>
                                                등록된 유저가 없습니다.
                                            </AdminTd>
                                        </tr>
                                    ) : (
                                        users.map(user => (
                                            <tr key={user.id}>
                                                <AdminTd>{user.id}</AdminTd>
                                                <AdminTd>
                                                    <strong>{user.username}</strong>
                                                </AdminTd>
                                                <AdminTd>
                                                    {user.name || "-"} <br />
                                                    <small>({user.nickname || "-"})</small>
                                                </AdminTd>
                                                <AdminTd>{user.email}</AdminTd>
                                                <AdminTd>
                                                    <Badge
                                                        color={
                                                            user.role === "ADMIN"
                                                                ? "error"
                                                                : "primary"
                                                        }>
                                                        {user.role || "USER"}
                                                    </Badge>
                                                </AdminTd>
                                                <AdminTd>
                                                    <Badge
                                                        color={
                                                            user.deletedAt ? "default" : "success"
                                                        }>
                                                        {user.deletedAt ? "탈퇴" : "정상"}
                                                    </Badge>
                                                </AdminTd>
                                                <AdminTd>
                                                    {user.createdAt
                                                        ? new Date(
                                                              user.createdAt,
                                                          ).toLocaleDateString()
                                                        : "-"}
                                                </AdminTd>
                                                <AdminTd>
                                                    <AdminButtonGroup $align="left">
                                                        {/* id가 있을 때만 링크 연결 */}
                                                        {user.id && (
                                                            <Button
                                                                variant="icon"
                                                                color="primary"
                                                                title="수정"
                                                                as={Link}
                                                                to={`/admin/users/edit/${user.id}`}>
                                                                <FiEdit size={18} />
                                                            </Button>
                                                        )}
                                                        {!user.deletedAt && user.id && (
                                                            <Button
                                                                variant="icon"
                                                                color="error"
                                                                title="삭제"
                                                                onClick={() =>
                                                                    handleDelete(user.id as number)
                                                                }>
                                                                <FiTrash2 size={18} />
                                                            </Button>
                                                        )}
                                                    </AdminButtonGroup>
                                                </AdminTd>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </AdminTable>
                        </AdminTableWrapper>

                        {total > 0 && (
                            <PaginationWrapper>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}>
                                    이전
                                </Button>
                                <PageInfo>
                                    {page} / {totalPages}
                                </PageInfo>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}>
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

export default AdminUserListPage;

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
