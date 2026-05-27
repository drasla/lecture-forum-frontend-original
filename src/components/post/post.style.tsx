import styled from "styled-components";

// ==========================================
// 1. 공통 레이아웃 (Container & Header)
// ==========================================

export const PostContainer = styled.div`
    max-width: 1000px;
    margin: 40px auto;
    padding: 0 20px;
`;

export const PostPageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
`;

export const PostTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.default};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 20px;

    small {
        font-size: 14px;
        font-weight: 400;
        color: ${({ theme }) => theme.colors.secondary};
        margin-left: 8px;
    }
`;

// ==========================================
// 2. 게시글 목록 (Board Table)
// ==========================================

export const BoardWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.background.paper};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.divider};
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

export const BoardTable = styled.table`
    width: 100%;
    border-collapse: collapse;

    thead {
        background-color: ${({ theme }) => theme.colors.background.default};
        border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
    }

    tbody tr {
        border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
        transition: background-color 0.2s ease;

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background-color: ${({ theme }) => theme.colors.background.default};
        }
    }
`;

export const BoardTh = styled.th<{ $width?: string }>`
    padding: 16px;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.disabled};
    text-align: center;
    width: ${({ $width }) => $width || "auto"};
`;

export const BoardTd = styled.td<{ $align?: string }>`
    padding: 16px;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.text.default};
    text-align: ${({ $align }) => $align || "center"};

    &.title-cell {
        text-align: left;

        a {
            color: ${({ theme }) => theme.colors.text.default};
            text-decoration: none;
            transition: color 0.2s ease;

            &:hover {
                color: ${({ theme }) => theme.colors.primary};
                text-decoration: underline;
            }
        }
    }
`;

export const EmptyMessage = styled.div`
    text-align: center;
    padding: 100px 0;
    color: ${({ theme }) => theme.colors.text.disabled};
    font-size: 16px;
`;

// ==========================================
// 3. 게시글 상세 (Detail)
// ==========================================

export const DetailWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.background.paper};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.divider};
    padding: 32px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

export const DetailHeader = styled.div`
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
    padding-bottom: 24px;
    margin-bottom: 24px;
`;

export const DetailSubject = styled.h1`
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.default};
    margin: 0 0 16px 0;
`;

export const DetailInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.secondary};

    .left-info {
        display: flex;
        gap: 16px;
        align-items: center;
    }

    .right-info {
        display: flex;
        gap: 16px;
        align-items: center;
    }
`;

export const DetailContent = styled.div`
    font-size: 16px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.default};
    min-height: 300px;
    white-space: pre-wrap; /* 줄바꿈 문자를 그대로 유지 */
    word-break: break-word;
`;

// ==========================================
// 4. 게시글/문의 작성 폼 (Form)
// ==========================================

export const FormWrapper = styled.div`
    background-color: ${({ theme }) => theme.colors.background.paper};
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.divider};
    padding: 32px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

export const FormGroup = styled.div`
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const FormLabel = styled.label`
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: 8px;
`;

export const FormInput = styled.input`
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text.default};
    background-color: ${({ theme }) => theme.colors.background.default};
    border: 1px solid ${({ theme }) => theme.colors.divider};
    border-radius: 6px;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.text.disabled};
    }
`;

export const FormTextarea = styled.textarea<{ $hasError?: boolean }>`
    width: 100%;
    padding: 12px 16px;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.text.default};
    background-color: ${({ theme }) => theme.colors.background.default};
    border: 1px solid
        ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.divider)};
    border-radius: 8px;
    min-height: 300px;
    resize: vertical;
    transition: all 0.2s ease;

    &::placeholder {
        color: ${({ theme }) => theme.colors.text.disabled};
    }

    &:focus {
        outline: none;
        border-color: ${({ theme, $hasError }) =>
            $hasError ? theme.colors.error : theme.colors.primary};
        box-shadow: 0 0 0 3px
            ${({ theme, $hasError }) =>
                $hasError ? `${theme.colors.error}20` : `${theme.colors.primary}20`};
    }
`;

export const FormDivider = styled.hr`
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.divider};
    margin: 32px 0;
`;

// ==========================================
// 5. ⚔️ 토론대난투 전용 투표 설정 레이아웃 (Vote Section)
// ==========================================
export const VoteSectionTitle = styled.h3`
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.default};
    margin: 0 0 8px 0;

    small {
        font-size: 13px;
        font-weight: 400;
        color: ${({ theme }) => theme.colors.text.disabled};
    }
`;

export const VoteSectionDescription = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.secondary};
    margin: 0 0 20px 0;
`;

export const VoteFieldsFlex = styled.div`
    display: flex;
    gap: 32px; /* 유저님의 calc((100% - 32px) / 2) 공식 연동용 갭 마진 */
    flex-wrap: wrap;
    width: 100%;
`;

// ==========================================
// 5. 공통 버튼 래퍼 (하단 버튼 배치)
// ==========================================

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
`;

export const LoadingText = styled.div`
    text-align: center;
    padding: 100px 0;
    color: ${({ theme }) => theme.colors.text.disabled};
    font-size: 16px;
`;
