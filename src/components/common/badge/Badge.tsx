import styled, { css } from "styled-components";
import type { ReactNode } from "react";

// 💡 서비스에서 자주 쓰일 법한 색상 타입들을 미리 정의해둡니다.
export type BadgeColor = "primary" | "secondary" | "error" | "success" | "default";

interface BadgeProps {
    color?: BadgeColor;
    children: ReactNode;
    className?: string;
}

function Badge({ color = "default", children, className }: BadgeProps) {
    return (
        <StyledBadge $color={color} className={className}>
            {children}
        </StyledBadge>
    );
}

export default Badge;

const StyledBadge = styled.span<{ $color: BadgeColor }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    
    ${({ theme, $color }) => {
        switch ($color) {
            case "primary":
                return css`
                    background-color: ${theme.colors.primary}20; /* 투명도 20% */
                    color: ${theme.colors.primary};
                `;
            case "error":
                return css`
                    background-color: ${theme.colors.error}20;
                    color: ${theme.colors.error};
                `;
            case "success":
                return css`
                    background-color: ${theme.colors.success
                        ? `${theme.colors.success}20`
                        : "#4caf5020"};
                    color: ${theme.colors.success || "#4caf50"};
                `;
            case "default":
            default:
                return css`
                    background-color: ${theme.colors.divider};
                    color: ${theme.colors.text.disabled};
                `;
        }
    }}
`;
