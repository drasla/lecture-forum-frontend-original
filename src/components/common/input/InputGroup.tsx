import styled from "styled-components";
import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import Input from "./Input.tsx";

const StyledInputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const StyledLabel = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text.default};
`;

const StyledErrorMessage = styled.span`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.error};
    font-weight: 500;
`;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    errorMessage?: string;
    registerObj?: UseFormRegisterReturn;
}

function InputGroup({ id, label, errorMessage, registerObj, ...props }: Props) {
    return (
        <StyledInputGroup>
            {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
            <Input $hasError={!!errorMessage} {...props} {...registerObj} />
            {errorMessage && <StyledErrorMessage>{errorMessage}</StyledErrorMessage>}
        </StyledInputGroup>
    );
}

export default InputGroup;
