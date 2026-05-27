import styled from "styled-components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
    currentPage: number; // 현재 페이지 번호
    totalPage: number; // 전체 페이지 개수
    onPageChange: (page: number) => void; // 페이지 변경 시 실행할 함수
    maxVisiblePages?: number; // 한 번에 보여줄 페이지 번호 개수 (기본값: 5)
}

function Pagination({
    currentPage,
    totalPage,
    onPageChange,
    maxVisiblePages = 5,
}: PaginationProps) {
    if (totalPage <= 1) return null; // 페이지가 1개 이하면 페이지네이션을 숨깁니다.

    // 💡 현재 페이지가 속한 블록의 시작과 끝 페이지 계산 (예: 1~5, 6~10)
    const currentBlock = Math.ceil(currentPage / maxVisiblePages);
    const startPage = (currentBlock - 1) * maxVisiblePages + 1;
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPage);

    // 보여줄 페이지 번호 배열 생성
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <PaginationContainer>
            {/* 이전 블록 이동 버튼 */}
            <ArrowButton
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="이전 페이지">
                <FiChevronLeft size={18} />
            </ArrowButton>

            {/* 페이지 숫자 번호 목록 */}
            {pageNumbers.map(page => (
                <PageNumButton
                    key={page}
                    $isActive={page === currentPage}
                    onClick={() => onPageChange(page)}>
                    {page}
                </PageNumButton>
            ))}

            {/* 다음 블록 이동 버튼 */}
            <ArrowButton
                disabled={currentPage === totalPage}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="다음 페이지">
                <FiChevronRight size={18} />
            </ArrowButton>
        </PaginationContainer>
    );
}

export default Pagination;

// --- Styled Components ---

const PaginationContainer = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 32px;
`;

const PageNumButton = styled.button<{ $isActive: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 36px;
    height: 36px;
    padding: 0 6px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid ${props => (props.$isActive ? props.theme.colors.primary : "transparent")};
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    /* 💡 활성화 상태(현재 페이지) 스타일 설정 */
    background-color: ${props =>
        props.$isActive ? props.theme.colors.primary : props.theme.colors.background.paper};
    color: ${props => (props.$isActive ? "#FFFFFF" : props.theme.colors.text.default)};

    &:hover {
        ${props =>
            !props.$isActive &&
            `
            background-color: ${props.theme.colors.background.default};
            color: ${props.theme.colors.primary};
        `}
    }
`;

const ArrowButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    background-color: ${({ theme }) => theme.colors.background.paper};
    border: 1px solid ${({ theme }) => theme.colors.divider};
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.text.default};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.background.default};
        color: ${({ theme }) => theme.colors.primary};
        border-color: ${({ theme }) => theme.colors.divider};
    }

    &:disabled {
        color: ${({ theme }) => theme.colors.text.disabled};
        background-color: ${({ theme }) => theme.colors.background.paper};
        border-color: ${({ theme }) => theme.colors.divider};
        cursor: not-allowed;
        opacity: 0.6;
    }
`;
