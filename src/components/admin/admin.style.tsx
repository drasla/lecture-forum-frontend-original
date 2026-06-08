// /src/components/admin/admin.style.tsx
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
`;

export const AdminLoadingText = styled.div`
    text-align: center;
    padding: 40px;
    color: ${props => props.theme.colors.text.disabled};
`;

export const AdminTableWrapper = styled.div`
    overflow-x: auto;
`;

export const AdminTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const AdminTh = styled.th<{ $width?: string }>`
    width: ${props => props.$width};
    text-align: left;
    padding: 12px 16px;
    background-color: ${props => props.theme.colors.background.default};
    color: ${props => props.theme.colors.text.disabled};
    font-size: 13px;
    font-weight: 600;
    border-bottom: 2px solid ${props => props.theme.colors.divider};
`;

export const AdminTd = styled.td`
    padding: 16px;
    font-size: 14px;
    border-bottom: 1px solid ${props => props.theme.colors.divider};
    vertical-align: middle;
`;

export const AdminForm = styled.form<{ $wrap?: boolean }>`
    display: flex;
    flex-direction: ${props => (props.$wrap ? "row" : "column")};
    flex-wrap: ${props => (props.$wrap ? "wrap" : "nowrap")};
    gap: 32px;
`;

export const AdminButtonGroup = styled.div<{ $align?: "left" | "right" | "center" }>`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: ${({ $align = "right" }) =>
        $align === "right" ? "flex-end" : $align === "center" ? "center" : "flex-start"};
`;

// 💡 --- 여기서부터 추가된 상세 페이지(Detail) 공통 스타일 ---

export const AdminDetailHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
`;

export const AdminDetailTitle = styled.h3`
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.default};
    margin: 0;
    line-height: 1.4;
`;

export const AdminDetailMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text.secondary};

    .divider {
        color: ${({ theme }) => theme.colors.divider};
    }
`;

export const AdminDivider = styled.hr`
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.divider};
    margin: 0;
`;

export const AdminDetailContent = styled.div`
    padding: 32px 0;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text.default};
    line-height: 1.8;
    white-space: pre-wrap;
    word-break: break-all;
`;
