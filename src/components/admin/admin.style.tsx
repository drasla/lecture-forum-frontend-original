import styled from "styled-components";

export const AdminContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

export const AdminPageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
`;

export const AdminTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.default};
`;

export const AdminForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

// 💡 활용도를 높이기 위해 정렬 방향을 prop으로 받을 수 있게 개선했습니다.
export const AdminButtonGroup = styled.div<{ $align?: "left" | "center" | "right" }>`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: ${({ $align = "right" }) =>
    $align === "right" ? "flex-end" : $align === "center" ? "center" : "flex-start"};
`;

export const AdminLoadingText = styled.div`
    text-align: center;
    padding: 40px;
    color: ${({ theme }) => theme.colors.text.disabled};
`;

export const AdminTableWrapper = styled.div`
    overflow-x: auto;
`;

export const AdminTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const AdminTh = styled.th<{ $width?: string }>`
    width: ${({ $width }) => $width || "auto"};
    text-align: left;
    padding: 12px 16px;
    background-color: ${({ theme }) => theme.colors.background.default};
    color: ${({ theme }) => theme.colors.text.disabled};
    font-size: 13px;
    font-weight: 600;
    border-bottom: 2px solid ${({ theme }) => theme.colors.divider};
`;

export const AdminTd = styled.td`
    padding: 16px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.default};
    border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
    vertical-align: middle;
`;