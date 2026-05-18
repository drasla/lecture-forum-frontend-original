import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router";
import Button from "../../../components/common/button/Button";
import type { Category } from "../../../types/category.type.ts";
import adminCategoryApi from "../../../api/admin/adminCategoryApi.ts";
import { FiEdit, FiRefreshCcw, FiTrash2 } from "react-icons/fi";

function AdminCategoryListPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await adminCategoryApi.fetchCategoryList();
                setCategories(data);
            } catch (error) {
                console.error(error);
                alert("카테고리 목록을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        loadCategories().then(() => {});
    }, []);

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const actionText = currentStatus === "ACTIVE" ? "비활성화(숨김)" : "활성화";

        if (!window.confirm(`정말 이 카테고리를 ${actionText} 처리하시겠습니까?`)) {
            return;
        }

        try {
            await adminCategoryApi.toggleCategoryStatus(id);
            alert(`카테고리가 성공적으로 ${actionText} 되었습니다.`);

            // 💡 서버에서 목록을 다시 불러오지 않고, 프론트엔드의 상태만 즉시 업데이트하여 성능 최적화
            setCategories(prevCategories =>
                prevCategories.map(cat =>
                    cat.id === id
                        ? { ...cat, status: cat.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
                        : cat,
                ),
            );
        } catch (error) {
            console.error(error);
            alert("상태 변경 중 오류가 발생했습니다.");
        }
    };

    return (
        <Container>
            <PageHeader>
                <Title>카테고리 관리</Title>
                <Button variant="contained" color="primary" as={Link} to="/admin/category/create">
                    + 카테고리 추가
                </Button>
            </PageHeader>

            <Card>
                {isLoading ? (
                    <LoadingText>불러오는 중...</LoadingText>
                ) : (
                    <TableWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <Th $width="10%">ID</Th>
                                    <Th $width="65%">카테고리명</Th>
                                    <Th $width="15%">상태</Th>
                                    <Th $width="15%">관리</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <Td
                                            colSpan={4}
                                            style={{ textAlign: "center", padding: "32px" }}>
                                            등록된 카테고리가 없습니다.
                                        </Td>
                                    </tr>
                                ) : (
                                    categories.map(cat => (
                                        <tr key={cat.id}>
                                            <Td>{cat.id}</Td>
                                            <Td>
                                                <strong>{cat.name}</strong>
                                            </Td>
                                            <Td>
                                                <StatusBadge $status={cat.status}>
                                                    {cat.status === "ACTIVE" ? "활성" : "비활성"}
                                                </StatusBadge>
                                            </Td>
                                            <Td>
                                                <ButtonGroup>
                                                    <Button
                                                        variant="icon"
                                                        color="primary"
                                                        title="수정"
                                                        as={Link}
                                                        to={`/admin/category/edit/${cat.id}`}
                                                    >
                                                        <FiEdit size={18} />
                                                    </Button>
                                                    <Button
                                                        variant="icon"
                                                        color={
                                                            cat.status === "ACTIVE"
                                                                ? "error"
                                                                : "primary"
                                                        }
                                                        onClick={() =>
                                                            handleToggleStatus(cat.id, cat.status)
                                                        }
                                                        title={
                                                            cat.status === "ACTIVE"
                                                                ? "비활성화"
                                                                : "활성화"
                                                        }>
                                                        {cat.status === "ACTIVE" ? (
                                                            <FiTrash2 size={18} />
                                                        ) : (
                                                            <FiRefreshCcw size={18} />
                                                        )}
                                                    </Button>
                                                </ButtonGroup>
                                            </Td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </TableWrapper>
                )}
            </Card>
        </Container>
    );
}

export default AdminCategoryListPage;

// --- Styled Components ---

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

const PageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.default};
`;

const Card = styled.div`
    background-color: ${({ theme }) => theme.colors.background.paper};
    border: 1px solid ${({ theme }) => theme.colors.divider};
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const TableWrapper = styled.div`
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const Th = styled.th<{ $width?: string }>`
    width: ${({ $width }) => $width || "auto"}; /* $width가 있으면 적용, 없으면 auto */
    text-align: left;
    padding: 12px 16px;
    background-color: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.text.disabled};
    font-size: 13px;
    font-weight: 600;
    border-bottom: 2px solid ${({ theme }) => theme.colors.divider};
`;

const Td = styled.td`
    padding: 16px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.default};
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
    vertical-align: middle;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const LoadingText = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.text.disabled};
`;

const StatusBadge = styled.span<{ $status: string }>`
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background-color: ${({ theme, $status }) =>
        $status === "ACTIVE" ? `${theme.colors.primary}20` : theme.colors.divider};
    color: ${({ theme, $status }) =>
        $status === "ACTIVE" ? theme.colors.primary : theme.colors.text.disabled};
`;
