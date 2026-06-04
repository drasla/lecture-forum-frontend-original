import styled from "styled-components";

export const ReplyContainer = styled.div`
    margin-top: 40px;
    padding-top: 32px;
    border-top: 2px solid ${({ theme }) => theme.colors.divider};
`;

export const ReplyTitle = styled.h3`
    display: flex;
    align-items: center;
    gap: 8px; /* 💡 아이콘과 글자 사이의 간격 */
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.default};
    margin: 0 0 24px 0;

    /* 💡 아이콘 색상 자연스럽게 맞추기 */
    svg {
        color: ${({ theme }) => theme.colors.secondary};
    }

    /* 댓글 수 카운트 마크업 구조에 맞춘 스타일 정렬 */
    .count {
        color: ${({ theme }) => theme.colors.primary};
        font-size: 18px;
        margin-left: 4px;
    }
`;

export const StyledReplyForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 40px;
`;

export const ReplyTextarea = styled.textarea<{ $hasError?: boolean }>`
    width: 100%;
    padding: 16px;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.text.default};
    background-color: ${({ theme }) => theme.colors.background.default};
    border: 1px solid
        ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.divider)};
    border-radius: 8px;
    min-height: 100px;
    resize: vertical;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: ${({ theme, $hasError }) =>
            $hasError ? theme.colors.error : theme.colors.primary};
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.background.paper};
        cursor: not-allowed;
    }
`;

export const FormFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ErrorMessage = styled.span`
    color: ${({ theme }) => theme.colors.error};
    font-size: 13px;
    font-weight: 500;
`;

export const ReplyList = styled.div`
    display: flex;
    flex-direction: column;
`;

export const EmptyMessage = styled.div`
    text-align: center;
    padding: 40px 0;
    color: ${({ theme }) => theme.colors.text.disabled};
    font-size: 15px;
`;

export const StyledReplyItem = styled.div`
    padding: 24px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};

    &:last-child {
        border-bottom: none;
    }
`;

export const ReplyHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;

    .author-info {
        display: flex;
        align-items: center;
        gap: 12px;

        strong {
            font-size: 15px;
            color: ${({ theme }) => theme.colors.text.default};
        }

        .date {
            font-size: 13px;
            color: ${({ theme }) => theme.colors.text.disabled};
        }
    }

    .delete-btn {
        background: none;
        border: none;
        color: ${({ theme }) => theme.colors.error};
        font-size: 13px;
        cursor: pointer;
        padding: 4px 8px;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export const ReplyContent = styled.p`
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.default};
    white-space: pre-wrap;
    word-break: break-word;
`;
