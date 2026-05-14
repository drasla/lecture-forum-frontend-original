import styled from "styled-components";

export const AuthPageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
`;

export const AuthFormCard = styled.div`
    width: 100%;
    max-width: 480px;
    background-color: ${({ theme }) => theme.colors.background.paper};
    padding: 48px 40px;
    border-radius: 16px;
    box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.05),
        0 8px 10px -6px rgba(0, 0, 0, 0.01);

    /* 다크모드일 때 테두리가 살짝 보이도록 처리 */
    border: 1px solid ${({ theme }) => theme.colors.divider};
`;

export const AuthTitle = styled.h1`
    font-size: 28px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: 8px;
    text-align: center;
`;

export const AuthSubTitle = styled.p`
    font-size: 15px;
    color: ${({ theme }) => theme.colors.text.disabled};
    text-align: center;
    margin-bottom: 32px;
`;

export const AuthForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const AuthSubmitButton = styled.button`
    margin-top: 12px;
    width: 100%;
    padding: 14px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        filter: brightness(0.9);
    }

    &:active:not(:disabled) {
        transform: scale(0.98);
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.text.disabled};
        cursor: not-allowed;
    }
`;

export const AuthRootErrorMessage = styled.div`
    margin-top: 8px;
    padding: 12px;
    background-color: ${({ theme }) => `${theme.colors.error}`};
    color: ${({ theme }) => theme.colors.error};
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
`;
