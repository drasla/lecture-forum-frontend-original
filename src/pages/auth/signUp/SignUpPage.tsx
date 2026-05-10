import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { type SignUpInputType, signUpSchema } from "../../../schemas/auth/signUpSchema.ts";
// import api from "../../../api/axiosInstance"; // TODO: 실제 API 호출 시 주석 해제

function SignUpPage() {
    const navigate = useNavigate();

    // 1. React Hook Form 설정 (zod 스키마 연결)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpInputType>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur", // 입력칸을 벗어날 때 유효성 검사 실행
    });

    // 2. 폼 제출 핸들러
    const onSubmit = async (data: SignUpInputType) => {
        try {
            // 백엔드로 보낼 때는 passwordConfirm은 제외하고 보냅니다.
            const { passwordConfirm, ...submitData } = data;

            console.log("제출할 데이터:", submitData);

            // TODO: 실제 API 호출 로직
            // await api.post("/users", submitData);

            alert("회원가입이 완료되었습니다! 로그인해주세요.");
            navigate("/auth/signIn");
        } catch (error: any) {
            // 백엔드에서 던진 중복 에러(409) 처리
            const errorMessage = error.response?.data?.error || "회원가입 중 오류가 발생했습니다.";
            alert(errorMessage);
        }
    };

    return (
        <PageContainer>
            <FormCard>
                <Title>회원가입</Title>
                <SubTitle>토론대난투에 오신 것을 환영합니다!</SubTitle>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* 1. 아이디 */}
                    <InputGroup>
                        <Label htmlFor="username">아이디</Label>
                        <Input
                            id="username"
                            placeholder="4자 이상 20자 이하"
                            $hasError={!!errors.username}
                            {...register("username")}
                        />
                        {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                    </InputGroup>

                    {/* 2. 비밀번호 */}
                    <InputGroup>
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="특수문자 포함 8자 이상"
                            $hasError={!!errors.password}
                            {...register("password")}
                        />
                        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                    </InputGroup>

                    {/* 3. 비밀번호 확인 */}
                    <InputGroup>
                        <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                        <Input
                            id="passwordConfirm"
                            type="password"
                            placeholder="비밀번호를 한 번 더 입력해주세요"
                            $hasError={!!errors.passwordConfirm}
                            {...register("passwordConfirm")}
                        />
                        {errors.passwordConfirm && (
                            <ErrorMessage>{errors.passwordConfirm.message}</ErrorMessage>
                        )}
                    </InputGroup>

                    {/* 4. 이름 */}
                    <InputGroup>
                        <Label htmlFor="name">이름 (실명)</Label>
                        <Input
                            id="name"
                            placeholder="홍길동"
                            $hasError={!!errors.name}
                            {...register("name")}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </InputGroup>

                    {/* 5. 닉네임 */}
                    <InputGroup>
                        <Label htmlFor="nickname">닉네임</Label>
                        <Input
                            id="nickname"
                            placeholder="토론에서 사용할 멋진 닉네임"
                            $hasError={!!errors.nickname}
                            {...register("nickname")}
                        />
                        {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}
                    </InputGroup>

                    {/* 6. 이메일 */}
                    <InputGroup>
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="example@wepoll.kr"
                            $hasError={!!errors.email}
                            {...register("email")}
                        />
                        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                    </InputGroup>

                    <SubmitButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "가입하는 중..." : "회원가입 완료"}
                    </SubmitButton>
                </Form>
            </FormCard>
        </PageContainer>
    );
}

export default SignUpPage;

// --- Styled Components ---

const PageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
`;

const FormCard = styled.div`
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

const Title = styled.h1`
    font-size: 28px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text.default};
    margin-bottom: 8px;
    text-align: center;
`;

const SubTitle = styled.p`
    font-size: 15px;
    color: ${({ theme }) => theme.colors.text.disabled};
    text-align: center;
    margin-bottom: 32px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.default};
`;

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

const ErrorMessage = styled.span`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.error};
    font-weight: 500;
`;

const SubmitButton = styled.button`
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
