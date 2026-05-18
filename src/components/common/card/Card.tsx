import styled from "styled-components";
import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: string;
}

function Card({ children, className, padding = "32px" }: CardProps) {
    return (
        <StyledCard className={className} $padding={padding}>
            {children}
        </StyledCard>
    );
}

export default Card;

const StyledCard = styled.div<{ $padding: string }>`
    background-color: ${({ theme }) => theme.colors.background.paper};
    border: 1px solid ${({ theme }) => theme.colors.divider};
    border-radius: 12px;
    padding: ${({ $padding }) => $padding};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;
