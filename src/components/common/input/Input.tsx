import styled from "styled-components";

const Input = styled.input<{ $hasError?: boolean }>`
    width: 100%;
    padding: 12px 16px;
    background-color: ${({ theme }) => theme.colors.background.default};
    border: 1px solid
        ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.divider)};
    border-radius: 8px;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.text.default};
    transition: all 0.2s ease;

    &::placeholder {
        color: ${({ theme }) => theme.colors.text.disabled};
    }

    &:focus {
        outline: none;
        border-color: ${({ theme, $hasError }) =>
            $hasError ? theme.colors.error : theme.colors.primary};
        /* 포커스 시 약간의 빛번짐 효과 */
        box-shadow: 0 0 0 3px
            ${({ theme, $hasError }) =>
                $hasError ? `${theme.colors.error}20` : `${theme.colors.primary}20`};
    }
`;

export default Input;
