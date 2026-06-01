import styled from "styled-components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ReplyPaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

function ReplyPagination({
    totalPages,
    currentPage,
    onPageChange,
    maxVisiblePages = 5,
}: ReplyPaginationProps) {
    if (totalPages <= 1) return null;

    // 💡 블록 이동 로직 (예: 1~5, 6~10)
    const currentBlock = Math.ceil(currentPage / maxVisiblePages);
    const startPage = (currentBlock - 1) * maxVisiblePages + 1;
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <PaginationWrapper>
            {/* 이전 블록 이동 */}
            <ArrowButton
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="이전 페이지">
                <FiChevronLeft size={16} />
            </ArrowButton>

            {/* 페이지 번호 목록 */}
            {pageNumbers.map(page => (
                <PageNumButton
                    key={page}
                    $isActive={currentPage === page}
                    onClick={() => onPageChange(page)}>
                    {page}
                </PageNumButton>
            ))}

            {/* 다음 블록 이동 */}
            <ArrowButton
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="다음 페이지">
                <FiChevronRight size={16} />
            </ArrowButton>
        </PaginationWrapper>
    );
}

export default ReplyPagination;

// ==========================================
// 🎨 메인과 완벽히 차별화된 서브(댓글) 페이징 스타일
// ==========================================

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px; /* 메인보다 좁은 간격 */
    margin-top: 24px; /* 메인보다 적은 여백 */
`;

const PageNumButton = styled.button<{ $isActive?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px; /* 💡 36px -> 28px로 축소 */
    height: 28px;
    border-radius: 50%; /* 💡 둥근 사각형 -> 완전한 원형으로 변경 */
    font-size: 13px; /* 💡 글씨 크기도 약간 축소 */
    font-weight: ${({ $isActive }) => ($isActive ? "700" : "500")};
    /* 테두리(border)를 아예 없애서 가벼운 느낌을 줌 */
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    /* 활성화 상태: 메인 컬러 배경에 흰색 글씨 */
    background-color: ${({ theme, $isActive }) =>
        $isActive ? theme.colors.primary : "transparent"};
    color: ${({ theme, $isActive }) => ($isActive ? "#FFFFFF" : theme.colors.secondary)};

    &:hover {
        background-color: ${({ theme, $isActive }) =>
            $isActive ? theme.colors.primary : theme.colors.background.default};
        color: ${({ theme, $isActive }) => ($isActive ? "#FFFFFF" : theme.colors.text.default)};
    }
`;

const ArrowButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.secondary};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.background.default};
        color: ${({ theme }) => theme.colors.text.default};
    }

    &:disabled {
        color: ${({ theme }) => theme.colors.divider};
        cursor: not-allowed;
    }
`;
